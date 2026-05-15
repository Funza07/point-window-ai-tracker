import { useState } from "react";
import GlassCard from "../components/common/GlassCard";
import Badge from "../components/common/Badge";
import ProgressBar from "../components/common/ProgressBar";
import Btn from "../components/common/Button";
import HScrollRow from "../components/common/HScrollRow";
import { typeColor } from "../utils/titleUtils";
import { removeItem } from "../utils/storageUtils";
import { resolveLibraryTitle } from "../utils/libraryTitle";

export default function Library({ lib, setLib, setPage, setDetailTitle, onRemove, onOpenLink, isMobile = false }) {
  const [tab, setTab] = useState("All");
  const TABS = ["All", "Anime", "Manga", "Manhwa", "Watching", "Reading", "Completed", "Planned", "Dropped"];
  const rows = lib.map((item) => ({ item, title: resolveLibraryTitle(item) })).filter((x) => x.title);
  const filtered = rows.filter(({ item, title }) => tab === "All" || title.type === tab || (item.userStatus || item.status)?.toLowerCase() === tab.toLowerCase());
  const stats = {
    total: rows.length,
    active: rows.filter((x) => ["Watching", "Reading"].includes(x.item.userStatus || x.item.status)).length,
    done: rows.filter((x) => (x.item.userStatus || x.item.status) === "Completed").length,
    planned: rows.filter((x) => (x.item.userStatus || x.item.status) === "Planning").length,
  };
  const onView = (t, item) => {
    setDetailTitle({ ...t, __library: item });
    setPage("detail");
  };

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile ? 90 : 0, maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
      <div style={{ marginBottom: isMobile ? 18 : 24 }}>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 900, fontSize: isMobile ? 28 : 34, color: "#f0ebff", margin: "0 0 4px" }}>My Library</h1>
        <p style={{ fontSize: isMobile ? 12 : 13, color: "#7a6b84", margin: 0 }}>Track progress, saved links, and status updates</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: isMobile ? 16 : 24 }}>
        {[["Total", stats.total, "#a855f7"], ["Active", stats.active, "#22d3ee"], ["Completed", stats.done, "#4ade80"], ["Planned", stats.planned, "#fbbf24"]].map(([l, v, c], i) => (
          <GlassCard key={l} hover={false} style={{ padding: isMobile ? "14px 10px" : "18px 12px", textAlign: "center" }} delay={i * 60}>
            <p style={{ fontSize: isMobile ? 24 : 28, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", color: c, margin: "0 0 2px", textShadow: `0 0 20px ${c}60` }}>{v}</p>
            <p style={{ fontSize: 9, color: "#7a6b84", margin: 0, letterSpacing: "0.15em" }}>{l.toUpperCase()}</p>
          </GlassCard>
        ))}
      </div>
      {isMobile ? (
        <HScrollRow gap={8} style={{ marginBottom: 16 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 14px", minHeight: 40, borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: `1px solid ${tab === t ? "#a855f7" : "rgba(255,255,255,0.08)"}`, background: tab === t ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(109,40,217,0.15))" : "rgba(255,255,255,0.03)", color: tab === t ? "#d8b4fe" : "#7a6b84", transition: "all 0.25s", boxShadow: tab === t ? "0 0 10px rgba(168,85,247,0.25)" : "none", flexShrink: 0, whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </HScrollRow>
      ) : (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: `1px solid ${tab === t ? "#a855f7" : "rgba(255,255,255,0.08)"}`, background: tab === t ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(109,40,217,0.15))" : "rgba(255,255,255,0.03)", color: tab === t ? "#d8b4fe" : "#7a6b84", transition: "all 0.25s", boxShadow: tab === t ? "0 0 10px rgba(168,85,247,0.25)" : "none" }}>{t}</button>
          ))}
        </div>
      )}
      {!rows.length ? (
        <GlassCard hover={false} style={{ padding: isMobile ? 28 : 48, textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>[]</p>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, color: "#d8b4fe", marginBottom: 6 }}>Library is empty</p>
          <p style={{ fontSize: 13, color: "#7a6b84", marginBottom: 16 }}>Start adding titles from Discover</p>
          <Btn onClick={() => setPage("discover")}>Browse Titles</Btn>
        </GlassCard>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#7a6b84", fontSize: 13 }}>No titles match this filter.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, maxWidth: "100%" }}>
          {filtered.map(({ item, title }, i) => {
            const c = typeColor(title.type);
            const pct = title.total ? Math.round((item.progress / title.total) * 100) : 0;
            return (
              <GlassCard key={title.id} style={{ padding: isMobile ? 12 : 14, display: "flex", gap: 12, width: "100%", boxSizing: "border-box", maxWidth: "100%" }} delay={i * 50}>
                <img src={title.cover} alt={title.title} style={{ width: isMobile ? 56 : 60, height: isMobile ? 78 : 82, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, maxWidth: "100%" }}>
                  <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: 15, color: "#f0ebff", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title.title}</p>
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    <Badge color={c}>{title.type}</Badge>
                    <Badge color="#8a7898">{item.userStatus || item.status || "Watching"}</Badge>
                  </div>
                  <p style={{ fontSize: 11, color: "#7a6b84", margin: "0 0 4px" }}>Progress: {item.progress} / {title.total}</p>
                  <ProgressBar pct={pct} color={c} />
                  {item.score && <p style={{ fontSize: 11, color: "#fbbf24", margin: "4px 0 0" }}>* {item.score}/10</p>}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <Btn small onClick={() => onView(title, item)}>Details</Btn>
                    <Btn small variant="ghost" onClick={() => (onRemove ? onRemove(title.id) : setLib(removeItem(title.id, lib)))} style={{ color: "#f87171" }}>Remove</Btn>
                    {item.link && <Btn small variant="cyan" onClick={async () => { if (onOpenLink) await onOpenLink(title.id); window.open(item.link, "_blank"); }}>Link</Btn>}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
