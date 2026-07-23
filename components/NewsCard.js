import Link from "next/link";

export default function NewsCard({ news }) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group grid overflow-hidden border-b border-line/80 pb-5 transition sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-5 sm:border-b-0 sm:pb-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-deep sm:aspect-[4/3] sm:rounded-sm">
        <img
          src={news.image}
          alt={news.title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center pt-3 sm:pt-0">
        <span className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          {news.category}
        </span>
        <h2 className="font-display text-xl font-bold leading-snug tracking-tight text-ink transition group-hover:text-accent sm:text-[1.35rem]">
          {news.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {news.summary}
        </p>
        <p className="mt-3 text-xs text-muted/80">
          {news.author} · {news.date}
        </p>
      </div>
    </Link>
  );
}
