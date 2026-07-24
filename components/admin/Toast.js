"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "success" }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      className={`pointer-events-auto border px-4 py-3 text-sm shadow-lg transition duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      } ${
        isError
          ? "border-accent/30 bg-accent-soft text-accent-deep"
          : "border-line bg-ink text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 text-xs ${isError ? "text-accent-deep/70" : "text-white/60"}`}
          aria-label="Хаах"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
