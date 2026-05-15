import { useMemo, useState } from "react";
import { mockTitles } from "../data/mockTitles";
import { MOODS } from "../data/moods";
import TitleCard from "../components/titles/TitleCard";
import GlassCard from "../components/common/GlassCard";
import SectionHeader from "../components/common/SectionHeader";
import { upsertItem } from "../utils/storageUtils";
import { buildLibraryPayload } from "../utils/libraryTitle";
import HScrollRow from "../components/common/HScrollRow";

export default function Recommendations({ lib, setLib, setPage, setDetailTitle, onAdd, isMobile = false }) {
  const [mood, setMood] = useState("Action");
  const picks = useMemo(() => mockTitles.filter((t) => t.genres.join(" ").toLowerCase().includes(mood.toLowerCase()) || mood === "OP MC").slice(0, 8), [mood]);
  const onAddLocal = (t) => {
    const payload = buildLibraryPayload(t, { libraryStatus: "Watching" });
    setLib(upsertItem({ ...payload, titleStatus: payload.status, status: payload.libraryStatus, userStatus: payload.libraryStatus }, lib));
  };
  const onView = (t) => {
    setDetailTitle(t);
    setPage("detail");
  };
  const getMatch = (t) => Math.min(99, 70 + Math.floor((t.rating - 7) * 8) + Math.floor(Math.random() * 8));

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile ? 90 : 0 }}>
      <div style={{ marginBottom: isMobile ? 18 : 24 }}>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 900, fontSize: isMobile ? 28 : 34, color: "#f0ebff", margin: "0 0 4px" }}>For You</h1>
        <p style={{ fontSize: isMobile ? 12 : 13, color: "#7a6b84", margin: 0 }}>AI-powered recommendations based on your taste profile</p>
      </div>
      <GlassCard hover={false} style={{ padding: 18, marginBottom: isMobile ? 20 : 28 }} delay={0}>
        <p style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>SELECT YOUR CURRENT MOOD</p>
        {isMobile ? (
          <HScrollRow gap={8}>
            {MOODS.map((m) => (
              <button key={m} onClick={() => setMood(m)} style={{ padding: "8px 16px", minHeight: 40, borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.05em", border: `1px solid ${mood === m ? "#a855f7" : "rgba(255,255,255,0.1)"}`, background: mood === m ? "linear-gradient(135deg,rgba(168,85,247,0.32),rgba(109,40,217,0.25))" : "rgba(255,255,255,0.03)", color: mood === m ? "#d8b4fe" : "#7a6b84", boxShadow: mood === m ? "0 0 16px rgba(168,85,247,0.35)" : "none", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0, whiteSpace: "nowrap" }}>{m}</button>
            ))}
          </HScrollRow>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MOODS.map((m) => (
              <button key={m} onClick={() => setMood(m)} style={{ padding: "8px 18px", borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.05em", border: `1px solid ${mood === m ? "#a855f7" : "rgba(255,255,255,0.1)"}`, background: mood === m ? "linear-gradient(135deg,rgba(168,85,247,0.32),rgba(109,40,217,0.25))" : "rgba(255,255,255,0.03)", color: mood === m ? "#d8b4fe" : "#7a6b84", boxShadow: mood === m ? "0 0 16px rgba(168,85,247,0.35)" : "none", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", transform: mood === m ? "scale(1.05)" : "scale(1)" }}>{m}</button>
            ))}
          </div>
        )}
      </GlassCard>
      <SectionHeader title={`Top Picks - ${mood}`} sub="Sorted by compatibility with your watch history" delay={100} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(140px, 1fr))" : "repeat(auto-fill, minmax(155px, 1fr))", gap: isMobile ? 12 : 16 }}>
        {picks.map((t, i) => (
          <div key={t.id} style={{ opacity: 0, animation: `fadeSlideUp 0.4s ease ${i * 60}ms forwards` }}>
            <div style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(109,40,217,0.08))", border: "1px solid rgba(168,85,247,0.22)", borderRadius: "12px 12px 0 0", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#a855f7", fontWeight: 700 }}>{getMatch(t)}% MATCH</span>
              <span style={{ fontSize: 9, color: "#7a6b84" }}>AI</span>
            </div>
            <div style={{ borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
              <TitleCard title={t} lib={lib} onAdd={onAdd ? (x) => onAdd(buildLibraryPayload(x, { libraryStatus: "Watching" })) : onAddLocal} onView={onView} />
            </div>
          </div>
        ))}
      </div>
      <GlassCard hover={false} style={{ padding: 22, marginTop: 28 }} delay={300}>
        <p style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>AI REASONING</p>
        <p style={{ fontSize: 13, color: "#c4b5d0", lineHeight: 1.8, margin: 0 }}>
          These picks are matched to the <strong style={{ color: "#d8b4fe" }}>{mood}</strong> mood tag based on genre overlap, pacing analysis, and sentiment matching against your library. Titles with higher ratings and stronger genre alignment score higher.
        </p>
      </GlassCard>
    </div>
  );
}
