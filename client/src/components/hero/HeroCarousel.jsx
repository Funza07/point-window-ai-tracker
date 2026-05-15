import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_BANNER = "https://via.placeholder.com/1200x420/120f1f/e2d9f3?text=Title";

const safeText = (v, fallback = "") => {
  const text = String(v ?? "").trim();
  return text || fallback;
};

const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function HeroCarousel({
  items = [],
  onView,
  isMobile = false,
  typeColor,
  Badge,
  Btn,
}) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    setIdx(0);
  }, [safeItems.length]);

  const go = useCallback(
    (next) => {
      if (!safeItems.length) return;
      setIdx((next + safeItems.length) % safeItems.length);
    },
    [safeItems.length],
  );

  useEffect(() => {
    if (safeItems.length <= 1) return undefined;
    timerRef.current = setInterval(() => {
      setIdx((current) => (current + 1) % safeItems.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeItems.length]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches?.[0]?.clientX ?? null;
  };

  const onTouchEnd = (e) => {
    if (touchStart.current === null || safeItems.length <= 1) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStart.current;
    const diff = touchStart.current - endX;
    if (Math.abs(diff) > 40) go(idx + (diff > 0 ? 1 : -1));
    touchStart.current = null;
  };

  if (!safeItems.length) return null;

  const hero = safeItems[idx] || {};
  const title = safeText(hero.title, "Untitled");
  const alt = safeText(hero.alt);
  const synopsis = safeText(hero.synopsis, "No synopsis available.");
  const year = safeNumber(hero.year, 0);
  const type = safeText(hero.type, "Unknown");
  const banner = safeText(hero.banner || hero.cover, FALLBACK_BANNER);
  const color = typeof typeColor === "function" ? typeColor(type) : "#a855f7";

  const BadgeComp = Badge;
  const BtnComp = Btn;

  return (
    <div
      style={{ position: "relative", borderRadius: isMobile ? 0 : 24, overflow: "hidden", minHeight: isMobile ? 460 : 340 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        key={`${safeText(hero.id, "hero")}-${idx}`}
        src={banner}
        alt={title}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "heroFade .6s ease" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,6,15,0.96) 0%, rgba(8,6,15,0.6) 60%, rgba(8,6,15,0.3) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 0% 100%, ${color}22 0%, transparent 55%)` }} />
      <div className="hero-shimmer" />

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "24px 20px 28px" : "32px 36px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
          <span style={{ fontSize: 9, color, fontWeight: 700, letterSpacing: "0.2em" }}>FEATURED PICK</span>
        </div>

        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: isMobile ? 30 : 42, fontWeight: 900, color: "#f0ebff", margin: "0 0 4px", lineHeight: 1.05 }}>
          {title}
        </h1>

        <p style={{ fontSize: 11, color: "#7a6b84", margin: "0 0 10px" }}>
          {alt || "-"} - {year || "-"} - {BadgeComp ? <BadgeComp color={color}>{type}</BadgeComp> : type}
        </p>

        <p
          style={{
            fontSize: 13,
            color: "#c4b5d0",
            maxWidth: isMobile ? "100%" : 500,
            margin: "0 0 20px",
            lineHeight: 1.7,
            display: isMobile ? "-webkit-box" : undefined,
            WebkitLineClamp: isMobile ? 2 : undefined,
            WebkitBoxOrient: isMobile ? "vertical" : undefined,
            overflow: isMobile ? "hidden" : undefined,
          }}
        >
          {synopsis}
        </p>

        {BtnComp ? (
          <BtnComp onClick={() => onView?.(hero)} style={{ minHeight: 44 }}>
            View Details
          </BtnComp>
        ) : (
          <button onClick={() => onView?.(hero)} style={{ minHeight: 44, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer" }}>
            View Details
          </button>
        )}
      </div>

      {safeItems.length > 1 && (
        <div style={{ position: "absolute", bottom: isMobile ? 96 : 16, right: 20, display: "flex", gap: 6 }}>
          {safeItems.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 99, background: i === idx ? color : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }}
            />
          ))}
        </div>
      )}

      {!isMobile && safeItems.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1)}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: 99, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#f0ebff", fontSize: 18, cursor: "pointer" }}
          >
            {'<'}
          </button>
          <button
            onClick={() => go(idx + 1)}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: 99, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#f0ebff", fontSize: 18, cursor: "pointer" }}
          >
            {'>'}
          </button>
        </>
      )}
    </div>
  );
}
