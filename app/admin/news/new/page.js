"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createNews } from "@/lib/api";
import { categories } from "@/lib/newsData";
import NewsForm from "@/components/admin/NewsForm";
import { useToast } from "@/components/admin/Toast";

function slugify(text) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return base || `news-${Date.now()}`;
}

export default function AdminNewNewsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const slug = values.slug?.trim() || slugify(values.title);
        const created = await createNews({ ...values, slug });
        showToast({ message: "Мэдээ амжилттай үүслээ", type: "success" });
        router.push(`/admin/news/${created.slug}/edit`);
        router.refresh();
      } catch (err) {
        showToast({
          message: err.message || "Хадгалж чадсангүй",
          type: "error",
        });
      }
    });
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-ink">
        Шинэ мэдээ
      </h1>
      <NewsForm
        categories={categories}
        isPending={isPending}
        submitLabel="Үүсгэх"
        onSubmit={onSubmit}
      />
    </div>
  );
}
