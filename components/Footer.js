import Link from "next/link";
import { categories } from "@/lib/newsData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t border-line/80 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <Link href="/" className="inline-block" aria-label="BERS.mn">
            <span className="font-display text-3xl font-bold tracking-tight">
              BERS<span className="text-accent">.mn</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            Өдөр тутмын мэдээллийн эх сурвалж. Энэ бол сургалтын зорилготой
            жишиг төсөл юм.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
            Ангилал
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-white/75">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="transition hover:text-white"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
            Зар байршуулах
          </h3>
          <p className="text-sm leading-relaxed text-white/65">
            Баннер, sidebar, агуулгын дунд зар байршуулах боломжтой.
          </p>
          <a
            href="mailto:ads@bers.mn"
            className="mt-4 inline-block text-sm font-semibold text-white transition hover:text-accent"
          >
            ads@bers.mn
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/40">
        © {year} BERS.mn. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
