"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  uploadImage,
} from "@/lib/api";
import { useAuth } from "@/components/admin/AuthProvider";
import { useToast } from "@/components/admin/Toast";

const ROLE_LABEL = {
  admin: "Админ",
  publisher: "Нийтлэгч",
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "publisher",
  image: "",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAdmin, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/admin");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = (await getUsers()) || [];
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) {
          showToast({
            message: err.message || "Хэрэглэгчдийг ачаалж чадсангүй",
            type: "error",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, router, showToast]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role || "publisher",
      image: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (editingId) {
          const payload = {
            name: form.name,
            email: form.email,
            role: form.role,
            image: form.image,
          };
          if (form.password.trim()) payload.password = form.password;

          const updated = await updateUser(editingId, payload);
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u))
          );
          if (updated.id === user?.id) await refreshUser();
          showToast({ message: "Хэрэглэгч амжилттай засагдлаа", type: "success" });
          resetForm();
        } else {
          const created = await createUser(form);
          setUsers((prev) => [...prev, created]);
          showToast({ message: "Хэрэглэгч амжилттай үүслээ", type: "success" });
          resetForm();
        }
      } catch (err) {
        showToast({
          message: err.message || "Хадгалж чадсангүй",
          type: "error",
        });
      }
    });
  };

  const onUploadFormImage = (file) => {
    if (!file) return;
    startTransition(async () => {
      try {
        const data = await uploadImage(file);
        if (data?.url) setForm((p) => ({ ...p, image: data.url }));
      } catch (err) {
        showToast({
          message: err.message || "Upload амжилтгүй",
          type: "error",
        });
      }
    });
  };

  const onDelete = (item) => {
    if (item.id === user?.id) {
      showToast({ message: "Өөрийгөө устгаж болохгүй", type: "error" });
      return;
    }
    if (!confirm(`「${item.name}」 хэрэглэгчийг устгах уу?`)) return;

    startTransition(async () => {
      try {
        await deleteUser(item.id);
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
        if (editingId === item.id) resetForm();
        showToast({ message: "Хэрэглэгч устгагдлаа", type: "success" });
      } catch (err) {
        showToast({
          message: err.message || "Устгаж чадсангүй",
          type: "error",
        });
      }
    });
  };

  if (!isAdmin) {
    return <p className="text-sm text-muted">Эрх хүрэхгүй байна...</p>;
  }

  const fieldClass =
    "mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Хэрэглэгчид</h1>
        <p className="mt-1 text-sm text-muted">
          Админ, нийтлэгч үүсгэх · засах · устгах
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 border border-line bg-surface p-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {editingId ? "Хэрэглэгч засах" : "Шинэ хэрэглэгч"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-muted hover:text-accent"
            >
              Цуцлах
            </button>
          )}
        </div>

        <div className="sm:col-span-2 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-line bg-paper">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                Зураг
              </div>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center border border-dashed border-line bg-white px-3 py-2 text-sm hover:border-accent hover:text-accent">
            Зураг сонгох
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isPending}
              onChange={(e) => onUploadFormImage(e.target.files?.[0])}
            />
          </label>
          {form.image && (
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, image: "" }))}
              className="text-sm text-accent-deep hover:underline"
            >
              Арилгах
            </button>
          )}
        </div>

        <label className="block text-sm font-medium text-ink-soft">
          Нэр *
          <input
            required
            className={fieldClass}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </label>

        <label className="block text-sm font-medium text-ink-soft">
          И-мэйл *
          <input
            required
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </label>

        <label className="block text-sm font-medium text-ink-soft">
          Нууц үг {editingId ? "(солих бол)" : "*"}
          <input
            required={!editingId}
            type="password"
            minLength={6}
            className={fieldClass}
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            placeholder={editingId ? "Хоосон бол хуучин хэвээр" : ""}
          />
        </label>

        <label className="block text-sm font-medium text-ink-soft">
          Эрх *
          <select
            className={fieldClass}
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
          >
            <option value="publisher">Нийтлэгч</option>
            <option value="admin">Админ</option>
          </select>
        </label>

        <div className="sm:col-span-2 flex justify-end gap-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
            >
              Цуцлах
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60"
          >
            {isPending
              ? "Хадгалж байна..."
              : editingId
                ? "Хадгалах"
                : "Хэрэглэгч үүсгэх"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Ачаалж байна...</p>
      ) : (
        <div className="overflow-hidden border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Зохиогч</th>
                <th className="px-4 py-3 font-semibold">И-мэйл</th>
                <th className="px-4 py-3 font-semibold">Эрх</th>
                <th className="px-4 py-3 font-semibold">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-line/70 last:border-0 ${
                    editingId === item.id ? "bg-accent-soft/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-line bg-paper">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
                            {item.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-ink">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{item.email}</td>
                  <td className="px-4 py-3 text-muted">
                    {ROLE_LABEL[item.role] || item.role}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => startEdit(item)}
                        className="text-sm font-medium text-accent hover:underline disabled:opacity-50"
                      >
                        Засах
                      </button>
                      {item.id === user?.id ? (
                        <span className="text-xs text-muted self-center">Та</span>
                      ) : (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => onDelete(item)}
                          className="text-sm text-accent-deep hover:underline disabled:opacity-50"
                        >
                          Устгах
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
