const SIZE_CONFIG = {
  banner: {
    // 728×90-ийн харьцаа
    box: "w-full aspect-[728/90] min-h-[72px] sm:min-h-[90px]",
  },
  rectangle: {
    // 300×250
    box: "w-full aspect-[300/250] max-w-[300px] mx-auto",
  },
  skyscraper: {
    // 300×600
    box: "w-full aspect-[300/600] max-w-[300px] mx-auto",
  },
};

export default function AdSlot({ ad, size = "banner", className = "" }) {
  if (!ad || ad.isActive === false) return null;

  const config = SIZE_CONFIG[size] || SIZE_CONFIG.banner;

  return (
    <div className={`ad-slot-wrap w-full ${className}`}>
      <aside
        aria-label={ad.label || "Зар"}
        className={`ad-slot relative overflow-hidden border border-line bg-paper ${config.box}`}
      >
        <a
          href={ad.href || "#"}
          target={ad.href && ad.href !== "#" ? "_blank" : undefined}
          rel={ad.href && ad.href !== "#" ? "noopener noreferrer" : undefined}
          className="absolute inset-0 flex h-full w-full items-center justify-center"
        >
          {ad.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.image}
              alt={ad.title || ad.label || "Зар"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed border-transparent bg-surface/70 px-4 py-3 text-center transition hover:bg-paper-deep/50">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                {ad.label}
              </span>
              <span className="font-display text-sm font-bold text-ink-soft sm:text-base">
                {ad.title}
              </span>
              <span className="text-xs text-muted">{ad.subtitle}</span>
              <span className="text-[10px] text-muted/70">{ad.size}</span>
            </span>
          )}
        </a>
      </aside>
    </div>
  );
}
