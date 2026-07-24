"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/lib/api";
import { useAuth } from "@/components/admin/AuthProvider";

function ImageUploadField({
  label,
  value,
  onChange,
  previewClassName = "aspect-[4/3] w-full object-cover",
  boxClassName = "aspect-[4/3]",
  disabled,
}) {
  const fileRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, startUpload] = useTransition();
  const showPreview = Boolean(value) && !imageError;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Зөвхөн зураг оруулна");
      e.target.value = "";
      return;
    }

    setUploadError("");
    setImageError(false);
    startUpload(async () => {
      try {
        const data = await uploadImage(file);
        if (data?.url) onChange(data.url);
        else setUploadError("Upload амжилтгүй");
      } catch (err) {
        setUploadError(err.message || "Upload амжилтгүй");
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink-soft">{label}</p>
      <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
        <div
          className={`overflow-hidden border border-line bg-paper ${
            boxClassName.includes("rounded-full") ? "rounded-full" : ""
          }`}
        >
          {showPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className={previewClassName}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`flex items-center justify-center px-3 text-center text-xs text-muted ${boxClassName}`}
            >
              {value ? "Алдаатай зураг" : "Зураг байхгүй"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center border border-dashed border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent">
            {isUploading ? "Upload хийж байна..." : "Зураг сонгох"}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={disabled || isUploading}
              onChange={handleFileChange}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setImageError(false);
                setUploadError("");
              }}
              disabled={disabled || isUploading}
              className="text-left text-sm text-accent-deep hover:underline disabled:opacity-50"
            >
              Зураг арилгах
            </button>
          )}
          {uploadError && <p className="text-sm text-accent-deep">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

export default function NewsForm({
  categories,
  initial,
  onSubmit,
  isPending,
  submitLabel = "Хадгалах",
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    categorySlug: initial?.categorySlug || categories[0]?.slug || "",
    summary: initial?.summary || "",
    content: initial?.content || "",
    image: initial?.image || "",
    date: initial?.date || new Date().toISOString().slice(0, 10),
  });

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !initial?.slug) {
        const base = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 80);
        next.slug = base || `news-${Date.now()}`;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldClass =
    "mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-accent";

  const authorName = initial?.author || user?.name || "—";
  const authorImage = initial?.authorImage || user?.image || "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-3 border border-line bg-paper/50 px-4 py-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line bg-white">
          {authorImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={authorImage} alt={authorName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
              {String(authorName).slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted">Нийтлэгч</p>
          <p className="truncate text-sm font-semibold text-ink">{authorName}</p>
          <p className="text-xs text-muted">
            Нэр/зургийг Хэрэглэгчид хэсгээс засна
          </p>
        </div>
      </div>

      <label className="block text-sm font-medium text-ink-soft">
        Гарчиг *
        <input
          required
          className={fieldClass}
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink-soft">
          Slug *
          <input
            required
            className={fieldClass}
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
            placeholder="my-article-slug"
          />
        </label>

        <label className="block text-sm font-medium text-ink-soft">
          Ангилал *
          <select
            required
            className={fieldClass}
            value={form.categorySlug}
            onChange={(e) => setField("categorySlug", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-ink-soft">
        Огноо
        <input
          type="date"
          className={fieldClass}
          value={form.date}
          onChange={(e) => setField("date", e.target.value)}
        />
      </label>

      <ImageUploadField
        label="Мэдээний зураг"
        value={form.image}
        onChange={(url) => setField("image", url)}
        disabled={isPending}
        boxClassName="aspect-[4/3]"
        previewClassName="aspect-[4/3] w-full object-cover"
      />

      <label className="block text-sm font-medium text-ink-soft">
        Товч агуулга
        <textarea
          rows={3}
          className={fieldClass}
          value={form.summary}
          onChange={(e) => setField("summary", e.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-ink-soft">
        Дэлгэрэнгүй агуулга
        <textarea
          rows={10}
          className={fieldClass}
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
        />
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60"
        >
          {isPending ? "Хадгалж байна..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
