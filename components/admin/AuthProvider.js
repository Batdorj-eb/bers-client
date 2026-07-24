"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe, getToken, login as apiLogin, logout as apiLogout, setToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        setToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/admin/login");
    }
    if (user && isLoginPage) {
      router.replace("/admin");
    }
  }, [loading, user, isLoginPage, router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      isPublisher: user?.role === "publisher",
      async login(email, password) {
        const data = await apiLogin(email, password);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      async logout() {
        await apiLogout();
        setUser(null);
        router.replace("/admin/login");
      },
      async refreshUser() {
        const me = await getMe();
        setUser(me);
        return me;
      },
      setUser,
    }),
    [user, loading, router]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Ачаалж байна...
      </div>
    );
  }

  if (!user && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Нэвтрэх хуудас руу шилжиж байна...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
