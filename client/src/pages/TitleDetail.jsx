import { useEffect, useState } from "react";
import { mockTitles } from "../data/mockTitles";
import GlassCard from "../components/common/GlassCard";
import Badge from "../components/common/Badge";
import GenrePill from "../components/common/GenrePill";
import StarRating from "../components/common/StarRating";
import ProgressBar from "../components/common/ProgressBar";
import Btn from "../components/common/Button";
import SectionHeader from "../components/common/SectionHeader";
import HScrollRow from "../components/common/HScrollRow";
import { progressLabel, typeColor, typeGlow } from "../utils/titleUtils";
import { upsertItem } from "../utils/storageUtils";
import { titleService } from "../services/titleService";
import { buildLibraryPayload } from "../utils/libraryTitle";

const FALLBACK_IMAGE = "https://picsum.photos/seed/pw-fallback/400/580";
const FALLBACK_BANNER = "https://picsum.photos/seed/pw-fallback-banner/1200/420";

export default function TitleDetail({ title, lib, setLib, setPage, onSave, onAdd, onOpenLink, isMobile = false }) {
  const [resolvedTitle, setResolvedTitle] = useState(title);
  const [form, setForm] = useState(() => {
    const item = lib.find((x) => x.id === title.id) || title.__library;
    if (!item) return { status: "Planning", progress: 0, score: "", notes: "", link: "" };
    return {
      status: item.userStatus || item.status || "Planning",
      progress: item.progress || 0,
      score: item.score ?? "",
      notes: item.notes || "",
      link: item.link || "",
    };
  });

  const [saved, setSaved] = useState("");
  const c = typeColor(resolvedTitle.type);
  const pct = resolvedTitle.total ? Math.round(((form.progress || 0) / resolvedTitle.total) * 100) : 0;
  const resolvedGenres = Array.isArray(resolvedTitle.genres) ? resolvedTitle.genres : [];
  const localSimilar = mockTitles
    .filter((t) => t.id !== resolvedTitle.id && (t.type === resolvedTitle.type || (Array.isArray(t.genres) && t.genres.some((g) => resolvedGenres.includes(g)))))
    .slice(0, 6);
  const [similar, setSimilar] = useState(localSimilar);

  const save = () => {
    const payload = buildLibraryPayload(resolvedTitle, {
      libraryStatus: form.status,
      progress: form.progress,
      score: form.score,
      notes: form.notes,
      link: form.link,
    });
    if (onSave) onSave(resolvedTitle.id, payload);
    else if (onAdd) onAdd(payload);
    else setLib(upsertItem({ ...payload, titleStatus: payload.status, status: payload.libraryStatus, userStatus: payload.libraryStatus }, lib));
    setSaved("Saved to library!");
    setTimeout(() => setSaved(""), 2500);
  };

  const complete = () => {
    const updated = { ...form, status: "Completed", progress: resolvedTitle.total };
    setForm(updated);
    const payload = buildLibraryPayload(resolvedTitle, {
      libraryStatus: updated.status,
      progress: updated.progress,
      score: updated.score,
      notes: updated.notes,
      link: updated.link,
    });
    if (onSave) onSave(resolvedTitle.id, payload);
    else if (onAdd) onAdd(payload);
    else setLib(upsertItem({ ...payload, titleStatus: payload.status, status: payload.libraryStatus, userStatus: payload.libraryStatus }, lib));
    setSaved("Marked as Completed!");
    setTimeout(() => setSaved(""), 2500);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const hasMetadata = Boolean(title?.title && title?.cover && title?.type && title?.synopsis);
      if (hasMetadata) {
        setResolvedTitle(title);
        return;
      }
      const res = await titleService.getById(title.id);
      if (mounted && res?.data) setResolvedTitle((prev) => ({ ...prev, ...res.data }));
    })();
    return () => {
      mounted = false;
    };
  }, [title]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await titleService.similar(resolvedTitle.id);
      if (mounted && Array.isArray(res.data) && res.data.length) setSimilar(res.data);
      else if (mounted) setSimilar(localSimilar);
    })();
    return () => {
      mounted = false;
    };
  }, [resolvedTitle.id]);

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 22, paddingBottom: isMobile ? 90 : 0 }}>
      <button
        onClick={() => setPage("discover")}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#7a6b84", cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0, transition: "color 0.2s" }}
      >
        Back to Discover
      </button>
      <div style={{ borderRadius: isMobile ? 16 : 24, overflow: "hidden", position: "relative", minHeight: isMobile ? 320 : 260 }}>
        <img src={resolvedTitle.banner || resolvedTitle.cover || FALLBACK_BANNER} alt={resolvedTitle.title || "Untitled"} style={{ width: "100%", height: isMobile ? 220 : 290, objectFit: "cover" }} className="hero-img" />
        <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(180deg, rgba(8,6,15,0.55) 0%, rgba(8,6,15,0.98) 80%)" : "linear-gradient(90deg, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.6) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? 16 : 26, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 22, alignItems: isMobile ? "flex-start" : "flex-end" }}>
          <img src={resolvedTitle.cover || resolvedTitle.banner || FALLBACK_IMAGE} alt={resolvedTitle.title || "Untitled"} style={{ width: isMobile ? 88 : 106, height: isMobile ? 124 : 148, objectFit: "cover", borderRadius: 14, border: `2px solid ${c}60`, flexShrink: 0, boxShadow: `0 12px 32px ${typeGlow(resolvedTitle.type)}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 900, fontSize: isMobile ? 26 : 32, color: "#f0ebff", margin: "0 0 4px", lineHeight: 1.05 }}>{resolvedTitle.title || "Untitled"}</h1>
            <p style={{ fontSize: 12, color: "#7a6b84", margin: "0 0 10px" }}>{resolvedTitle.alt || "-"} - {resolvedTitle.year || "-"}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              <Badge color={c}>{resolvedTitle.type || "Unknown"}</Badge>
              <Badge color={resolvedTitle.status === "Ongoing" ? "#4ade80" : "#8a7898"}>{resolvedTitle.status || "Unknown"}</Badge>
              {(resolvedTitle.genres || []).slice(0, 3).map((g) => <GenrePill key={g} genre={g} />)}
            </div>
            <StarRating value={resolvedTitle.rating || 0} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: 16 }}>
        <GlassCard hover={false} style={{ padding: isMobile ? 16 : 22 }} delay={50}>
          <p style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>SYNOPSIS</p>
          <p style={{ fontSize: 13, color: "#c4b5d0", lineHeight: 1.8, margin: 0 }}>{resolvedTitle.synopsis || "No synopsis available."}</p>
        </GlassCard>
        <GlassCard hover={false} style={{ padding: isMobile ? 16 : 22 }} delay={100}>
          <p style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>AI REASON</p>
          <p style={{ fontSize: 13, color: "#c4b5d0", lineHeight: 1.8, margin: 0 }}>{resolvedTitle.reason || "No recommendation reason available."}</p>
          <div style={{ marginTop: 14 }}><Badge color="#22d3ee">AI Recommended</Badge></div>
        </GlassCard>
      </div>

      <GlassCard hover={false} style={{ padding: isMobile ? 16 : 22 }} delay={150}>
        <p style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 18 }}>MY PROGRESS</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#7a6b84" }}>Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ padding: "11px 12px", minHeight: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#d8b4fe", fontSize: 13, fontFamily: "inherit", width: "100%", outline: "none" }}>
              {["Planning", "Watching", "Reading", "Completed", "Dropped"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#7a6b84" }}>Current {progressLabel(resolvedTitle.type)} (of {resolvedTitle.total})</span>
            <input type="number" min={0} max={resolvedTitle.total} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} style={{ padding: "11px 12px", minHeight: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f0ebff", fontSize: 13, fontFamily: "inherit", width: "100%", outline: "none", boxSizing: "border-box" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#7a6b84" }}>Personal Score (1-10)</span>
            <input type="number" min={1} max={10} value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} style={{ padding: "11px 12px", minHeight: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fbbf24", fontSize: 13, fontFamily: "inherit", width: "100%", outline: "none", boxSizing: "border-box" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#7a6b84" }}>Watch/Read Link</span>
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Paste your streaming link" style={{ padding: "11px 12px", minHeight: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f0ebff", fontSize: 13, fontFamily: "inherit", width: "100%", outline: "none", boxSizing: "border-box" }} />
          </label>
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: "#7a6b84" }}>Notes</span>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Track thoughts, key moments, reminders..." style={{ padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f0ebff", fontSize: 13, fontFamily: "inherit", minHeight: 72, resize: "vertical", outline: "none" }} />
        </label>
        <ProgressBar pct={pct} color={c} />
        <p style={{ fontSize: 11, color: "#7a6b84", margin: "8px 0 16px" }}>{form.progress || 0} / {resolvedTitle.total} - {pct}% complete</p>
        {saved && <p style={{ fontSize: 12, color: "#4ade80", marginBottom: 12 }}>{saved}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Btn onClick={save} style={isMobile ? { minHeight: 44 } : {}}>Save Progress</Btn>
          <Btn variant="ghost" onClick={complete} style={isMobile ? { minHeight: 44 } : {}}>Mark Completed</Btn>
          {form.link && <Btn variant="cyan" onClick={async () => { if (onOpenLink) await onOpenLink(resolvedTitle.id); window.open(form.link, "_blank"); }} style={isMobile ? { minHeight: 44 } : {}}>Open Link</Btn>}
        </div>
      </GlassCard>

      <section>
        <SectionHeader title="Similar Titles" sub={`More ${resolvedTitle.type} you might enjoy`} delay={200} />
        {isMobile ? (
          <HScrollRow gap={12}>
            {similar.map((s, i) => (
              <GlassCard key={s.id} style={{ padding: 12, cursor: "pointer", minWidth: 160, flexShrink: 0, scrollSnapAlign: "start" }} delay={i * 50 + 220}>
                <img src={s.cover || FALLBACK_IMAGE} alt={s.title || "Untitled"} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />
                <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: 13, color: "#f0ebff", margin: "0 0 2px" }}>{s.title || "Untitled"}</p>
                <p style={{ fontSize: 10, color: "#7a6b84", margin: 0 }}>{s.type || "Unknown"} - {s.rating || 0}</p>
              </GlassCard>
            ))}
          </HScrollRow>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {similar.map((s, i) => (
              <GlassCard key={s.id} style={{ padding: 12, cursor: "pointer" }} delay={i * 50 + 220}>
                <img src={s.cover || FALLBACK_IMAGE} alt={s.title || "Untitled"} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />
                <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: 13, color: "#f0ebff", margin: "0 0 2px" }}>{s.title || "Untitled"}</p>
                <p style={{ fontSize: 10, color: "#7a6b84", margin: 0 }}>{s.type || "Unknown"} - {s.rating || 0}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
