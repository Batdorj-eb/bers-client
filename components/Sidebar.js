import Link from "next/link";
import { categories, getPopularNews } from "@/lib/newsData";
import { ads } from "@/lib/adsData";
import AdSlot from "@/components/AdSlot";

export default function Sidebar() {
  const popular = getPopularNews(5);

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-6 lg:self-start">
      <AdSlot ad={ads.sidebar} size="rectangle" />

      <section>
        <h2 className="section-title mb-4 text-lg">Ангилал</h2>
        <ul className="flex flex-col">
          {categories.map((cat) => (
            <li key={cat.slug} className="border-b border-line/70 last:border-0">
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between py-2.5 text-sm font-medium text-ink-soft transition hover:text-accent"
              >
                <span>{cat.name}</span>
                <span className="text-muted/50 transition group-hover:text-accent" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-title mb-4 text-lg">Уншигдсан мэдээ</h2>
        <ol className="flex flex-col gap-4">
          {popular.map((news, index) => (
            <li key={news.slug} className="flex gap-3">
              <span className="font-display text-2xl font-bold leading-none text-accent/25">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/news/${news.slug}`}
                  className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition hover:text-accent"
                >
                  {news.title}
                </Link>
                <p className="mt-1 text-xs text-muted">{news.date}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <AdSlot ad={ads.inline} size="skyscraper" />
    </aside>
  );
}
