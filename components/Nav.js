"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/newsData";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = (active, mobile = false) =>
    mobile
      ? `block border-b border-line/60 px-4 py-3.5 text-[15px] font-semibold tracking-wide transition ${
          active
            ? "bg-accent-soft/60 text-accent"
            : "text-ink-soft hover:bg-paper/70 hover:text-accent"
        }`
      : `relative whitespace-nowrap px-3 py-3 text-sm font-semibold tracking-wide transition ${
          active ? "text-accent" : "text-ink-soft hover:text-accent"
        } after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 ${
          active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
        }`;

  const links = (
    <>
      <Link
        href="/"
        className={linkClass(pathname === "/", true)}
        onClick={() => setOpen(false)}
      >
        Нүүр
      </Link>
      {categories.map((cat) => {
        const href = `/category/${cat.slug}`;
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={cat.slug}
            href={href}
            className={linkClass(active, true)}
            title={cat.description}
            onClick={() => setOpen(false)}
          >
            {cat.name}
          </Link>
        );
      })}
    </>
  );

  const desktopLinks = (
    <>
      <Link href="/" className={linkClass(pathname === "/")}>
        Нүүр
      </Link>
      {categories.map((cat) => {
        const href = `/category/${cat.slug}`;
        return (
          <Link
            key={cat.slug}
            href={href}
            className={linkClass(
              pathname === href || pathname?.startsWith(`${href}/`)
            )}
            title={cat.description}
          >
            {cat.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav
      aria-label="Үндсэн цэс"
      className="border-t border-line/70 bg-surface/60"
    >
      {/* Mobile bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:hidden">
        <span className="text-sm font-semibold tracking-wide text-ink-soft">
          Цэс
        </span>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition hover:bg-paper/80 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Цэс хаах" : "Цэс нээх"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id={menuId}
        inert={open ? undefined : true}
        aria-hidden={!open}
        className={`md:hidden overflow-hidden border-t border-line/70 transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl bg-surface/95 backdrop-blur-md">
          {links}
        </div>
      </div>

      {/* Desktop links */}
      <div className="mx-auto hidden max-w-6xl gap-0.5 px-2 sm:px-4 md:flex">
        {desktopLinks}
      </div>
    </nav>
  );
}
