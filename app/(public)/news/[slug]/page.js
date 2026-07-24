import { notFound } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/newsData";
import { getAds, getNewsBySlug, getNewsList } from "@/lib/api";
import NewsCard from "@/components/NewsCard";
import AuthorMeta from "@/components/AuthorMeta";
import PageShell from "@/components/PageShell";
import AdSlot from "@/components/AdSlot";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const news = await getNewsBySlug(slug);
    if (!news) return { title: "Мэдээ олдсонгүй" };
    return {
      title: `${news.title} | BERS.mn`,
      description: news.summary,
    };
  } catch {
    return { title: "Мэдээ олдсонгүй" };
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;

  let news = null;
  let ads = {};
  try {
    news = await getNewsBySlug(slug);
  } catch {
    news = null;
  }

  if (!news) {
    notFound();
  }

  const category =
    categories.find((c) => c.slug === news.categorySlug) ||
    categories.find((c) => c.name === news.category);

  let moreNews = [];
  try {
    const [list, adsData] = await Promise.all([
      getNewsList({ category: news.categorySlug }),
      getAds().catch(() => ({})),
    ]);
    ads = adsData || {};
    moreNews = (list || []).filter((item) => item.slug !== news.slug).slice(0, 3);
    if (moreNews.length === 0) {
      const all = (await getNewsList({ limit: 4 })) || [];
      moreNews = all.filter((item) => item.slug !== news.slug).slice(0, 3);
    }
  } catch {
    moreNews = [];
  }

  const related = moreNews.filter((item) => item.category === news.category);

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

        <AuthorMeta
          author={news.author}
          authorImage={news.authorImage}
          date={news.date}
        />

        {news.image && (
          <div className="relative mt-7 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.image}
              alt={news.title}
              className="h-64 w-full object-cover sm:h-[26rem] animate-image-reveal"
            />
          </div>
        )}

        {news.summary && (
          <p className="news-lead mt-8 border-l-4 border-accent pl-4 text-[1.05rem] leading-8 text-ink-soft sm:text-lg sm:leading-8">
            {news.summary}
          </p>
        )}

        <div className="prose-news mt-6 max-w-none text-base leading-8 text-ink-soft sm:text-[1.05rem] sm:leading-8">
          {news.content.split("\n").map((para, i) =>
            para.trim() ? (
              <p key={i} className="news-body">
                {para}
              </p>
            ) : null
          )}
        </div>
      </article>

      <CommentSection slug={news.slug} />

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
