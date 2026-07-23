"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/newsData";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (active) =>
    `relative whitespace-nowrap px-3 py-3 text-sm font-semibold tracking-wide transition ${
      active
        ? "text-accent"
        : "text-ink-soft hover:text-accent"
    } after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 ${
      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  return (
    <nav
      aria-label="Үндсэн цэс"
      className="border-t border-line/70 bg-surface/60"
    >
      <div className="mx-auto flex max-w-6xl gap-0.5 overflow-x-auto px-2 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className={linkClass(pathname === "/")}>
          Нүүр
        </Link>
        {categories.map((cat) => {
          const href = `/category/${cat.slug}`;
          return (
            <Link
              key={cat.slug}
              href={href}
              className={linkClass(pathname === href)}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
