"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { deleteNews, getNewsList } from "@/lib/api";

export default function AdminNewsListPage() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = (await getNewsList()) || [];
      setNews(data);
    } catch (err) {
      setError(err.message || "Мэдээ ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = (slug) => {
    if (!confirm("Энэ мэдээг устгах уу?")) return;
    startTransition(async () => {
      try {
        await deleteNews(slug);
        setNews((prev) => prev.filter((item) => item.slug !== slug));
      } catch (err) {
        setError(err.message || "Устгаж чадсангүй");
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Мэдээнүүд</h1>
          <p className="mt-1 text-sm text-muted">
            Нийт {news.length} мэдээ
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="hidden text-sm font-semibold text-accent sm:inline"
        >
          Шинэ мэдээ нэмэх
        </Link>
      </div>

      {error && (
        <p className="mb-4 border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-deep">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Ачаалж байна...</p>
      ) : news.length === 0 ? (
        <div className="border border-line bg-surface px-6 py-12 text-center">
          <p className="text-muted">Мэдээ байхгүй байна.</p>
          <Link
            href="/admin/news/new"
            className="mt-4 inline-block text-sm font-semibold text-accent"
          >
            Эхний мэдээг нэмэх →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Гарчиг</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Ангилал
                </th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Огноо
                </th>
                <th className="px-4 py-3 font-semibold">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.slug} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.slug}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">
                    {item.category}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {item.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/news/${item.slug}/edit`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Засах
                      </Link>
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-sm text-muted hover:underline"
                        target="_blank"
                      >
                        Харах
                      </Link>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => onDelete(item.slug)}
                        className="text-sm text-accent-deep hover:underline disabled:opacity-50"
                      >
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
