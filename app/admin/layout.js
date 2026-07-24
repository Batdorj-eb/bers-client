"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/admin/AuthProvider";
import { ToastProvider } from "@/components/admin/Toast";

function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  const roleLabel = user?.role === "admin" ? "Админ" : "Нийтлэгч";

  return (
    <div className="min-h-screen bg-paper/40">
      <header className="border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <Link
              href="/admin"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              BERS Admin
            </Link>
            <p className="text-xs text-muted">
              {user?.name} · {roleLabel}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link
              href="/admin"
              className={
                pathname === "/admin"
                  ? "text-accent"
                  : "text-ink-soft hover:text-accent"
              }
            >
              Мэдээ
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/users"
                  className={
                    pathname.startsWith("/admin/users")
                      ? "text-accent"
                      : "text-ink-soft hover:text-accent"
                  }
                >
                  Хэрэглэгчид
                </Link>
                <Link
                  href="/admin/ads"
                  className={
                    pathname.startsWith("/admin/ads")
                      ? "text-accent"
                      : "text-ink-soft hover:text-accent"
                  }
                >
                  Зар
                </Link>
              </>
            )}
            <Link
              href="/admin/news/new"
              className="bg-accent px-3 py-1.5 text-white transition hover:bg-accent-deep"
            >
              + Шинэ мэдээ
            </Link>
            <Link href="/" className="text-ink-soft transition hover:text-accent">
              Сайт руу →
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="text-ink-soft transition hover:text-accent"
            >
              Гарах
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminShell>{children}</AdminShell>
      </AuthProvider>
    </ToastProvider>
  );
}
