import Link from "next/link";
import Nav from "@/components/Nav";

export default function Header() {
  const today = new Date().toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="relative border-b border-line/80 bg-surface/80 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[11px] tracking-wide text-muted sm:text-xs">
        <span className="animate-fade-in">{today}</span>
        <a
          href="https://bers.mn"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-accent"
        >
          bers.mn
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-5 pt-2 sm:pb-6 sm:pt-3">
        <Link
          href="/"
          className="group inline-block animate-fade-up"
          aria-label="BERS.mn нүүр хуудас"
        >
          <img
            src="/bers-logo.svg"
            alt="BERS.mn"
            width={280}
            height={64}
            className="h-12 w-auto transition duration-300 group-hover:opacity-90 sm:h-16 md:h-[4.5rem]"
          />
        </Link>
        <p className="mt-2 max-w-md animate-fade-up delay-1 text-sm text-muted sm:text-[15px]">
          АНУ дахь Монголчуудад зориулсан мэдээллийн эх сурвалж
        </p>
      </div>

      <Nav />
    </header>
  );
}
