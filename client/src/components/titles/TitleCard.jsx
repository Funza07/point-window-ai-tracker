import { useState, useEffect } from "react";
import Badge from "../common/Badge";
import GenrePill from "../common/GenrePill";
import StarRating from "../common/StarRating";
import Btn from "../common/Button";
import { typeColor, typeGlow } from "../../utils/titleUtils";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x580/120f1f/e2d9f3?text=Title";

export default function TitleCard({ title, lib, onAdd, onView, delay = 0, width }) {
  const inLib = lib.some((x) => x.id === title.id);
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const c = typeColor(title?.type);
  const safeGenres = Array.isArray(title?.genres) ? title.genres : [];
  const compact = Number(width) > 0;

  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? c + "60" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hov ? `0 16px 48px ${typeGlow(title?.type)}, 0 0 0 1px ${c}20` : "0 4px 16px rgba(0,0,0,0.4)",
        transform: hov ? "translateY(-6px) scale(1.01)" : vis ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        opacity: vis ? 1 : 0,
        backdropFilter: "blur(16px)",
        minWidth: compact ? width : undefined,
        width: compact ? width : undefined,
        flexShrink: compact ? 0 : undefined,
        scrollSnapAlign: compact ? "start" : undefined,
        boxSizing: "border-box",
        maxWidth: "100%",
      }}
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img src={title?.cover || title?.banner || FALLBACK_IMAGE} alt={title?.title || "Untitled"} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.08)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.2) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge color={c}>{title?.type || "Unknown"}</Badge>
        </div>
        {inLib && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(6,182,212,0.18)", border: "1px solid rgba(6,182,212,0.5)", borderRadius: 99, padding: "2px 8px", fontSize: 9, color: "#22d3ee", fontWeight: 700, letterSpacing: "0.1em", backdropFilter: "blur(8px)" }}>
            SAVED
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 100%, ${c}15 0%, transparent 60%)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />
        <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: 15, color: "#f0ebff", margin: 0, lineHeight: 1.2, textShadow: "0 1px 8px rgba(0,0,0,0.8)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title?.title || "Untitled"}</p>
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <StarRating value={Number(title?.rating || 0)} />
          <span style={{ fontSize: 10, color: "#7a6b84" }}>{title?.year || "-"}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {safeGenres.slice(0, compact ? 2 : 3).map((g) => <GenrePill key={g} genre={g} />)}
        </div>
        <div style={{ display: "flex", gap: 6, minWidth: 0 }}>
          <Btn small onClick={() => onView(title)} variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Details</Btn>
          <Btn small onClick={() => !inLib && onAdd(title)} disabled={inLib} variant={inLib ? "ghost" : "primary"} style={{ flex: 1, justifyContent: "center" }}>
            {inLib ? "Saved" : "+ Add"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
