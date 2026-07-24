"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAdsAdmin, updateAd, uploadImage } from "@/lib/api";
import { useAuth } from "@/components/admin/AuthProvider";
import { useToast } from "@/components/admin/Toast";

const SLOT_META = {
  topBanner: {
    label: "Дээд баннер",
    width: 728,
    height: 90,
    previewClass: "w-full max-w-[728px] aspect-[728/90]",
  },
  midContent: {
    label: "Агуулгын дунд",
    width: 970,
    height: 90,
    previewClass: "w-full max-w-[970px] aspect-[970/90]",
  },
  sidebar: {
    label: "Sidebar",
    width: 300,
    height: 250,
    previewClass: "w-full max-w-[300px] aspect-[300/250]",
  },
  inline: {
    label: "Sidebar босоо",
    width: 300,
    height: 600,
    previewClass: "w-full max-w-[300px] aspect-[300/600]",
  },
};

export default function AdminAdsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/admin");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = (await getAdsAdmin()) || [];
        if (!cancelled) setAds(data);
      } catch (err) {
        if (!cancelled) {
          showToast({
            message: err.message || "Зар ачаалж чадсангүй",
            type: "error",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, router, showToast]);

  const setAdField = (slot, key, value) => {
    setAds((prev) =>
      prev.map((ad) => (ad.slot === slot ? { ...ad, [key]: value } : ad))
    );
  };

  const onSave = (ad) => {
    setSavingSlot(ad.slot);
    startTransition(async () => {
      try {
        const updated = await updateAd(ad.slot, {
          label: ad.label,
          size: ad.size,
          href: ad.href,
          title: ad.title,
          subtitle: ad.subtitle,
          image: ad.image,
          isActive: ad.isActive,
        });
        setAds((prev) =>
          prev.map((item) => (item.slot === updated.slot ? updated : item))
        );
        showToast({ message: "Зар хадгалагдлаа", type: "success" });
      } catch (err) {
        showToast({
          message: err.message || "Хадгалж чадсангүй",
          type: "error",
        });
      } finally {
        setSavingSlot("");
      }
    });
  };

  const onUpload = (slot, file) => {
    if (!file) return;
    setSavingSlot(slot);
    startTransition(async () => {
      try {
        const data = await uploadImage(file);
        if (data?.url) {
          setAdField(slot, "image", data.url);
          showToast({ message: "Зураг upload хийгдлээ", type: "success" });
        }
      } catch (err) {
        showToast({
          message: err.message || "Upload амжилтгүй",
          type: "error",
        });
      } finally {
        setSavingSlot("");
      }
    });
  };

  if (!isAdmin) {
    return <p className="text-sm text-muted">Эрх хүрэхгүй байна...</p>;
  }

  const fieldClass =
    "mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink">Зар байршуулалт</h1>
        <p className="mt-1 text-sm text-muted">
          Вэб дээрх 4 зар байрлалыг эндээс удирдана.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Ачаалж байна...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {ads.map((ad) => {
            const meta = SLOT_META[ad.slot] || {
              label: ad.slot,
              width: 300,
              height: 250,
              previewClass: "w-full max-w-[300px] aspect-[300/250]",
            };

            return (
            <section
              key={ad.slot}
              className="border border-line bg-surface p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    {meta.label}
                  </h2>
                  <p className="text-xs text-muted">
                    slot: {ad.slot} · {meta.width}×{meta.height}px
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={Boolean(ad.isActive)}
                    onChange={(e) =>
                      setAdField(ad.slot, "isActive", e.target.checked)
                    }
                  />
                  Идэвхтэй
                </label>
              </div>

              <div className="mb-5 overflow-hidden border border-line bg-paper">
                <div className={`relative mx-auto ${meta.previewClass}`}>
                  {ad.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ad.image}
                      alt={ad.title || meta.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
                      <span className="text-xs text-muted">Preview</span>
                      <span className="text-sm font-semibold text-ink-soft">
                        {meta.width}×{meta.height}
                      </span>
                      <span className="text-xs text-muted">Зураг байхгүй</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-ink-soft sm:col-span-2">
                    Гарчиг
                    <input
                      className={fieldClass}
                      value={ad.title || ""}
                      onChange={(e) =>
                        setAdField(ad.slot, "title", e.target.value)
                      }
                    />
                  </label>

                  <label className="block text-sm font-medium text-ink-soft">
                    Шошго
                    <input
                      className={fieldClass}
                      value={ad.label || ""}
                      onChange={(e) =>
                        setAdField(ad.slot, "label", e.target.value)
                      }
                    />
                  </label>

                  <label className="block text-sm font-medium text-ink-soft">
                    Хэмжээ
                    <input
                      className={fieldClass}
                      value={ad.size || ""}
                      onChange={(e) =>
                        setAdField(ad.slot, "size", e.target.value)
                      }
                    />
                  </label>

                  <label className="block text-sm font-medium text-ink-soft sm:col-span-2">
                    Холбоос (URL)
                    <input
                      className={fieldClass}
                      value={ad.href || ""}
                      onChange={(e) =>
                        setAdField(ad.slot, "href", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label className="block text-sm font-medium text-ink-soft sm:col-span-2">
                    Дэд гарчиг
                    <input
                      className={fieldClass}
                      value={ad.subtitle || ""}
                      onChange={(e) =>
                        setAdField(ad.slot, "subtitle", e.target.value)
                      }
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                    <label className="inline-flex cursor-pointer items-center justify-center border border-dashed border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:border-accent hover:text-accent">
                      Зураг сонгох
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isPending}
                        onChange={(e) =>
                          onUpload(ad.slot, e.target.files?.[0])
                        }
                      />
                    </label>
                    {ad.image && (
                      <button
                        type="button"
                        onClick={() => setAdField(ad.slot, "image", "")}
                        className="text-sm text-accent-deep hover:underline"
                      >
                        Зураг арилгах
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isPending && savingSlot === ad.slot}
                      onClick={() => onSave(ad)}
                      className="ml-auto bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60"
                    >
                      {savingSlot === ad.slot && isPending
                        ? "Хадгалж байна..."
                        : "Хадгалах"}
                    </button>
                  </div>
              </div>
            </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
