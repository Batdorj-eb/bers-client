import { notFound } from "next/navigation";
import Link from "next/link";
import { newsList, getNewsBySlug, categories } from "@/lib/newsData";
import NewsCard from "@/components/NewsCard";
import PageShell from "@/components/PageShell";
import AdSlot from "@/components/AdSlot";
import { ads } from "@/lib/adsData";

export function generateStaticParams() {
  return newsList.map((news) => ({ slug: news.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);
  if (!news) return { title: "Мэдээ олдсонгүй" };
  return {
    title: `${news.title} | BERS.mn`,
    description: news.summary,
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const category = categories.find((c) => c.name === news.category);

  const related = newsList
    .filter((item) => item.slug !== news.slug)
    .filter((item) => item.category === news.category)
    .slice(0, 3);

  const moreNews =
    related.length > 0
      ? related
      : newsList.filter((item) => item.slug !== news.slug).slice(0, 3);

  return (
    <PageShell>
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted"
      >
        <Link href="/" className="transition hover:text-accent">
          Нүүр
        </Link>
        <span className="text-line">/</span>
        {category ? (
          <Link
            href={`/category/${category.slug}`}
            className="transition hover:text-accent"
          >
            {news.category}
          </Link>
        ) : (
          <span>{news.category}</span>
        )}
      </nav>

      <article className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {news.category}
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
          {news.title}
        </h1>

        <p className="mt-4 text-sm text-muted">
          {news.author} · {news.date}
        </p>

        <div className="relative mt-7 overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="h-64 w-full object-cover sm:h-[26rem] animate-image-reveal"
          />
        </div>

        <p className="mt-6 font-display text-xl font-medium leading-relaxed text-ink-soft sm:text-[1.35rem]">
          {news.summary}
        </p>

        <div className="prose-news mt-6 max-w-none text-base leading-8 text-ink-soft sm:text-[1.05rem] sm:leading-8">
          {news.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <AdSlot ad={ads.midContent} size="banner" className="my-10" />

      {moreNews.length > 0 && (
        <section>
          <h2 className="section-title mb-5 text-xl sm:text-2xl">
            {related.length > 0 ? "Ижил ангиллын мэдээ" : "Бусад мэдээ"}
          </h2>
          <div className="flex flex-col gap-5">
            {moreNews.map((item) => (
              <NewsCard key={item.slug} news={item} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
