import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import PageShell from "@/components/PageShell";
import AdSlot from "@/components/AdSlot";
import { newsList } from "@/lib/newsData";
import { ads } from "@/lib/adsData";

export default function HomePage() {
  const [featured, ...rest] = newsList;

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <Link
          href={`/news/${featured.slug}`}
          className="group relative block min-h-[52vh] overflow-hidden sm:min-h-[56vh]"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03] animate-image-reveal"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.18),transparent_45%)]" />

          <div className="relative flex min-h-[52vh] flex-col justify-end px-5 pb-8 pt-20 sm:min-h-[56vh] sm:px-8 sm:pb-10">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {featured.category}
            </p>
            <h2 className="mt-3 max-w-3xl animate-fade-up delay-1 font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-[3.25rem]">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl animate-fade-up delay-2 text-base leading-relaxed text-white/80 sm:text-lg">
              {featured.summary}
            </p>
            <p className="mt-5 animate-fade-up delay-3 text-sm text-white/55">
              {featured.author} · {featured.date}
              <span className="ml-3 inline-flex items-center gap-1 font-semibold text-white transition group-hover:gap-2">
                Унших
                <span aria-hidden>→</span>
              </span>
            </p>
          </div>
        </Link>
      </section>

      <PageShell>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h3 className="section-title text-2xl sm:text-[1.75rem]">
            Сүүлийн мэдээ
          </h3>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-line to-transparent sm:block" />
        </div>

        <div className="flex flex-col gap-5">
          {rest.slice(0, 2).map((news, i) => (
            <div
              key={news.slug}
              className={`animate-fade-up ${i === 1 ? "delay-1" : ""}`}
            >
              <NewsCard news={news} />
            </div>
          ))}
        </div>

        <AdSlot ad={ads.midContent} size="banner" className="my-8" />

        <div className="flex flex-col gap-5">
          {rest.slice(2).map((news) => (
            <NewsCard key={news.slug} news={news} />
          ))}
        </div>
      </PageShell>
    </>
  );
}
