import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Алдаа
      </p>
      <h1 className="mt-3 font-display text-7xl font-bold tracking-tight text-ink">
        404
      </h1>
      <p className="mt-4 text-lg text-muted">
        Уучлаарай, таны хайсан хуудас олдсонгүй.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
      >
        Нүүр хуудас руу буцах
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
