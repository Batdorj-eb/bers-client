function formatPublishedLabel(dateStr) {
  if (!dateStr) return "";

  const published = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(published.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Нийтэлсэн саяхан";
  if (diffHours < 24) return `Нийтэлсэн ${diffHours} цагийн өмнө`;
  if (diffDays < 7) return `Нийтэлсэн ${diffDays} өдрийн өмнө`;

  return `Нийтэлсэн ${dateStr}`;
}

function authorInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function AuthorMeta({ author, authorImage, date }) {
  const name = author || "Б.Э.Р.С";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-paper">
          {authorImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={authorImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted">
              {authorInitials(name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <span className="mb-1.5 block h-1 w-5 rounded-full bg-accent" aria-hidden />
          <p className="truncate text-base font-bold tracking-wide text-ink">
            {name}
          </p>
          <p className="mt-0.5 text-sm text-muted">{formatPublishedLabel(date)}</p>
        </div>
      </div>
    </div>
  );
}
