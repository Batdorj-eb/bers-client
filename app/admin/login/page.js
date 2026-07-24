"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { useToast } from "@/components/admin/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("admin@bers.mn");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await login(email, password);
        showToast({ message: "Амжилттай нэвтэрлээ", type: "success" });
        router.replace("/admin");
      } catch (err) {
        showToast({
          message: err.message || "Нэвтэрч чадсангүй",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-line bg-surface p-6 shadow-sm sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          BERS Admin
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Нэвтрэх</h1>
        <p className="mt-2 text-sm text-muted">
          Админ эсвэл нийтлэгч эрхээр нэвтэрнэ.
        </p>

        <label className="mt-6 block text-sm font-medium text-ink-soft">
          И-мэйл
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-ink-soft">
          Нууц үг
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60"
        >
          {isPending ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
