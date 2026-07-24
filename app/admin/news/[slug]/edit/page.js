"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getNewsBySlug, updateNews } from "@/lib/api";
import { categories } from "@/lib/newsData";
import NewsForm from "@/components/admin/NewsForm";
import { useToast } from "@/components/admin/Toast";

export default function AdminEditNewsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [news, setNews] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getNewsBySlug(slug);
        if (!cancelled) setNews(data);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Мэдээ олдсонгүй");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const updated = await updateNews(slug, values);
        showToast({ message: "Мэдээ амжилттай хадгалагдлаа", type: "success" });
        if (updated.slug !== slug) {
          router.replace(`/admin/news/${updated.slug}/edit`);
        } else {
          setNews(updated);
        }
        router.refresh();
      } catch (err) {
        showToast({
          message: err.message || "Хадгалж чадсангүй",
          type: "error",
        });
      }
    });
  };

  if (loading) {
    return <p className="text-sm text-muted">Ачаалж байна...</p>;
  }

  if (loadError || !news) {
    return (
      <p className="border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-deep">
        {loadError || "Мэдээ олдсонгүй"}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">
        Мэдээ засах
      </h1>
      <NewsForm
        categories={categories}
        initial={news}
        isPending={isPending}
        submitLabel="Хадгалах"
        onSubmit={onSubmit}
      />
    </div>
  );
}
