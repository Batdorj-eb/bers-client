"use client";

import { useEffect, useState, useTransition } from "react";
import { createComment, getComments } from "@/lib/api";

function formatCommentDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function insertReply(nodes, parentId, reply) {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [...(node.replies || []), reply],
      };
    }
    if (node.replies?.length) {
      return {
        ...node,
        replies: insertReply(node.replies, parentId, reply),
      };
    }
    return node;
  });
}

function CommentForm({
  authorName,
  body,
  onAuthorNameChange,
  onBodyChange,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = "Илгээх",
  compact = false,
}) {
  const fieldClass =
    "mt-1.5 w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-accent";

  return (
    <form
      onSubmit={onSubmit}
      className={`border border-line bg-surface/80 ${
        compact ? "mt-3 p-3" : "mb-8 p-4 sm:p-5"
      }`}
    >
      <label className="block text-sm font-medium text-ink-soft">
        Таны нэр *
        <input
          required
          maxLength={80}
          className={fieldClass}
          value={authorName}
          onChange={(e) => onAuthorNameChange(e.target.value)}
          placeholder="Нэрээ бичнэ үү"
        />
      </label>

      <label className="mt-3 block text-sm font-medium text-ink-soft">
        {compact ? "Хариулт *" : "Сэтгэгдэл *"}
        <textarea
          required
          rows={compact ? 3 : 4}
          maxLength={2000}
          className={fieldClass}
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder={compact ? "Хариултаа бичнэ үү..." : "Сэтгэгдлээ үлдээнэ үү..."}
        />
      </label>

      <div className="mt-3 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm text-muted hover:text-accent"
          >
            Цуцлах
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60"
        >
          {isPending ? "Илгээж байна..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  depth = 0,
  replyToId,
  setReplyToId,
  replyForm,
  setReplyForm,
  onReplySubmit,
  isPending,
}) {
  const isReplying = replyToId === comment.id;

  return (
    <li className={depth > 0 ? "mt-3" : ""}>
      <div
        className={`border border-line bg-surface/70 px-4 py-4 sm:px-5 ${
          depth > 0 ? "border-l-2 border-l-accent/40" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-semibold text-muted">
            {initials(comment.authorName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-semibold text-ink">{comment.authorName}</p>
              <time
                dateTime={comment.createdAt}
                className="text-xs text-muted"
              >
                {formatCommentDate(comment.createdAt)}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {comment.body}
            </p>
            <button
              type="button"
              onClick={() => {
                setReplyToId(isReplying ? null : comment.id);
                if (!isReplying) {
                  setReplyForm((p) => ({ ...p, body: "" }));
                }
              }}
              className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
            >
              Хариулах
            </button>

            {isReplying && (
              <CommentForm
                compact
                authorName={replyForm.authorName}
                body={replyForm.body}
                onAuthorNameChange={(value) =>
                  setReplyForm((p) => ({ ...p, authorName: value }))
                }
                onBodyChange={(value) =>
                  setReplyForm((p) => ({ ...p, body: value }))
                }
                onSubmit={(e) => onReplySubmit(e, comment.id)}
                onCancel={() => setReplyToId(null)}
                isPending={isPending}
                submitLabel="Хариулах"
              />
            )}
          </div>
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <ul className="ml-4 mt-1 border-l border-line/80 pl-3 sm:ml-8 sm:pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              replyToId={replyToId}
              setReplyToId={setReplyToId}
              replyForm={replyForm}
              setReplyForm={setReplyForm}
              onReplySubmit={onReplySubmit}
              isPending={isPending}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ authorName: "", body: "" });
  const [replyToId, setReplyToId] = useState(null);
  const [replyForm, setReplyForm] = useState({ authorName: "", body: "" });
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getComments(slug);
      setComments(data?.comments || []);
      setTotal(data?.total || 0);
    } catch (err) {
      setError(err.message || "Сэтгэгдэл ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const onSubmitRoot = (e) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const created = await createComment(slug, form);
        setComments((prev) => [created, ...prev]);
        setTotal((n) => n + 1);
        setForm((p) => ({ ...p, body: "" }));
        setReplyForm((p) => ({ ...p, authorName: form.authorName }));
      } catch (err) {
        setError(err.message || "Илгээж чадсангүй");
      }
    });
  };

  const onReplySubmit = (e, parentId) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const created = await createComment(slug, {
          ...replyForm,
          parentId,
        });
        setComments((prev) => insertReply(prev, parentId, created));
        setTotal((n) => n + 1);
        setReplyForm((p) => ({ ...p, body: "" }));
        setReplyToId(null);
        if (replyForm.authorName && !form.authorName) {
          setForm((p) => ({ ...p, authorName: replyForm.authorName }));
        }
      } catch (err) {
        setError(err.message || "Хариулт илгээж чадсангүй");
      }
    });
  };

  return (
    <section className="mt-10 border-t border-line pt-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <h2 className="section-title text-xl sm:text-2xl">Сэтгэгдэл</h2>
        <p className="text-sm text-muted">{total} сэтгэгдэл</p>
      </div>

      <CommentForm
        authorName={form.authorName}
        body={form.body}
        onAuthorNameChange={(value) =>
          setForm((p) => ({ ...p, authorName: value }))
        }
        onBodyChange={(value) => setForm((p) => ({ ...p, body: value }))}
        onSubmit={onSubmitRoot}
        isPending={isPending && !replyToId}
      />

      {error && <p className="mb-4 text-sm text-accent-deep">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">Ачаалж байна...</p>
      ) : comments.length === 0 ? (
        <p className="border border-dashed border-line bg-surface/50 px-4 py-8 text-center text-sm text-muted">
          Одоогоор сэтгэгдэл байхгүй байна. Эхнийхийг үлдээнэ үү.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyToId={replyToId}
              setReplyToId={setReplyToId}
              replyForm={replyForm}
              setReplyForm={setReplyForm}
              onReplySubmit={onReplySubmit}
              isPending={isPending}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
