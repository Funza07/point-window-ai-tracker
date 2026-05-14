import { useState } from "react";
import { mockTitles } from "../data/mockTitles";
import GlassCard from "../components/common/GlassCard";
import Badge from "../components/common/Badge";
import GenrePill from "../components/common/GenrePill";
import StarRating from "../components/common/StarRating";
import ProgressBar from "../components/common/ProgressBar";
import Btn from "../components/common/Button";
import SectionHeader from "../components/common/SectionHeader";
import TitleCard from "../components/titles/TitleCard";
import { typeColor, typeGlow } from "../utils/titleUtils";
import { upsertItem } from "../utils/storageUtils";

export default function TitleDetail({ title, lib, setLib, setPage, onSave, onAdd, onOpenLink }) {
  const [form, setForm] = useState(() => {
    const item = lib.find(x => x.id === title.id);
    return item || { status:"Planning", progress:0, score:"", notes:"", link:"" };
  });
  const [saved, setSaved] = useState("");
  const c = typeColor(title.type);
  const pct = title.total ? Math.round(((form.progress || 0) / title.total) * 100) : 0;
  const similar = mockTitles.filter(t => t.id !== title.id && (t.type === title.type || t.genres.some(g => title.genres.includes(g)))).slice(0, 6);

  const save = () => {
    const payload = { id:title.id, ...form };
    if (onSave) onSave(title.id, payload);
    else if (onAdd) onAdd(payload);
    else setLib(upsertItem(payload, lib));
    setSaved("âœ“ Saved to library!");
    setTimeout(() => setSaved(""), 2500);
  };
  const complete = () => {
    const updated = { ...form, status:"Completed", progress:title.total };
    setForm(updated);
    const payload = { id:title.id, ...updated };
    if (onSave) onSave(title.id, payload);
    else if (onAdd) onAdd(payload);
    else setLib(upsertItem(payload, lib));
    setSaved("âœ“ Marked as Completed!");
    setTimeout(() => setSaved(""), 2500);
  };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <button onClick={() => setPage("discover")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#7a6b84", cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:0, transition:"color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "#d8b4fe"}
        onMouseLeave={e => e.target.style.color = "#7a6b84"}>
        â† Back to Discover
      </button>
      <div style={{ borderRadius:24, overflow:"hidden", position:"relative", minHeight:260 }}>
        <img src={title.banner} alt={title.title} style={{ width:"100%", height:290, objectFit:"cover" }} className="hero-img" />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.6) 60%, transparent 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:26, display:"flex", gap:22, alignItems:"flex-end" }}>
          <img src={title.cover} alt={title.title} style={{ width:106, height:148, objectFit:"cover", borderRadius:14, border:`2px solid ${c}60`, flexShrink:0, boxShadow:`0 12px 32px ${typeGlow(title.type)}` }} />
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:32, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.05 }}>{title.title}</h1>
            <p style={{ fontSize:12, color:"#7a6b84", margin:"0 0 10px" }}>{title.alt} Â· {title.year}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
              <Badge color={c}>{title.type}</Badge>
              <Badge color={title.status === "Ongoing" ? "#4ade80" : "#8a7898"}>{title.status}</Badge>
              {title.genres.slice(0,3).map(g => <GenrePill key={g} genre={g} />)}
            </div>
            <StarRating value={title.rating} />
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
        <GlassCard hover={false} style={{ padding:22 }} delay={50}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>SYNOPSIS</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.synopsis}</p>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={100}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>â—Ž AI REASON</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.reason}</p>
          <div style={{ marginTop:14 }}><Badge color="#22d3ee">AI Recommended</Badge></div>
        </GlassCard>
      </div>

      <GlassCard hover={false} style={{ padding:22 }} delay={150}>
        <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:18 }}>MY PROGRESS</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12, marginBottom:16 }}>
          {[
            { label:"Status", content: <select value={form.status} onChange={e => setForm({...form, status:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#d8b4fe", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none" }}>{["Planning","Watching","Reading","Completed","Dropped"].map(s => <option key={s}>{s}</option>)}</select> },
            { label:`Current ${title.type === "Anime" ? "Episode" : "Chapter"} (of ${title.total})`, content: <input type="number" min={0} max={title.total} value={form.progress} onChange={e => setForm({...form, progress:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
            { label:"Personal Score (1-10)", content: <input type="number" min={1} max={10} value={form.score} onChange={e => setForm({...form, score:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fbbf24", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
            { label:"Watch/Read Link", content: <input value={form.link} onChange={e => setForm({...form, link:e.target.value})} placeholder="Paste your streaming link" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
          ].map(({ label, content }) => (
            <label key={label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <span style={{ fontSize:11, color:"#7a6b84" }}>{label}</span>
              {content}
            </label>
          ))}
        </div>
        <label style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
          <span style={{ fontSize:11, color:"#7a6b84" }}>Notes</span>
          <textarea value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="Track thoughts, key moments, remindersâ€¦" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", minHeight:72, resize:"vertical", outline:"none" }} />
        </label>
        <ProgressBar pct={pct} color={c} />
        <p style={{ fontSize:11, color:"#7a6b84", margin:"8px 0 16px" }}>{form.progress || 0} / {title.total} Â· {pct}% complete</p>
        {saved && <p style={{ fontSize:12, color:"#4ade80", marginBottom:12, opacity:0, animation:"fadeSlideUp 0.3s ease forwards" }}>{saved}</p>}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          <Btn onClick={save}>Save Progress</Btn>
          <Btn variant="ghost" onClick={complete}>Mark Completed</Btn>
          {form.link && <Btn variant="cyan" onClick={async () => { if (onOpenLink) await onOpenLink(title.id); window.open(form.link, "_blank"); }}>â–¶ Open Link</Btn>}
        </div>
      </GlassCard>

      <section>
        <SectionHeader title="Similar Titles" sub={`More ${title.type} you might enjoy`} delay={200} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 }}>
          {similar.map((s, i) => (
            <GlassCard key={s.id} style={{ padding:12, cursor:"pointer" }} delay={i * 50 + 220}>
              <img src={s.cover} alt={s.title} style={{ width:"100%", height:100, objectFit:"cover", borderRadius:10, marginBottom:10 }} />
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:13, color:"#f0ebff", margin:"0 0 2px" }}>{s.title}</p>
              <p style={{ fontSize:10, color:"#7a6b84", margin:0 }}>{s.type} Â· â˜…{s.rating}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
