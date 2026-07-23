export default function AdSlot({ ad, size = "banner", className = "" }) {
  if (!ad) return null;

  const sizeClass =
    size === "skyscraper"
      ? "min-h-[360px]"
      : size === "rectangle"
        ? "min-h-[220px]"
        : "min-h-[90px]";

  return (
    <aside
      aria-label={ad.label}
      className={`overflow-hidden border border-dashed border-line bg-surface/70 ${sizeClass} ${className}`}
    >
      <a
        href={ad.href}
        className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-1 px-4 py-6 text-center transition hover:bg-paper-deep/50"
      >
        <span className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
          {ad.label}
        </span>
        <span className="mt-1 font-display text-base font-bold text-ink-soft sm:text-lg">
          {ad.title}
        </span>
        <span className="text-xs text-muted">{ad.subtitle}</span>
        <span className="mt-1 text-[10px] text-muted/70">{ad.size}</span>
      </a>
    </aside>
  );
}
