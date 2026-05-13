import { useState } from "react";
import GlassCard from "../components/common/GlassCard";
import Btn from "../components/common/Button";

export default function Settings() {
  const [theme, setTheme] = useState("Ink Dark");
  const [notif, setNotif] = useState(true);
  const [spoiler, setSpoiler] = useState(true);
  const [genres, setGenres] = useState(["Action","Fantasy"]);
  const ALL_GENRES = ["Action","Fantasy","Romance","Dark","Comedy","Thriller","Sports","Drama","Supernatural","Smart Plot"];
  const toggleGenre = (g) => setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width:44, height:24, borderRadius:99, background: on ? "linear-gradient(135deg,#a855f7,#6d28d9)" : "rgba(255,255,255,0.1)", cursor:"pointer", position:"relative", transition:"all 0.3s", flexShrink:0, boxShadow: on ? "0 0 12px rgba(168,85,247,0.4)" : "none" }}>
      <div style={{ position:"absolute", top:3, left: on ? "calc(100% - 21px)" : 3, width:18, height:18, borderRadius:99, background:"#fff", transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
    </div>
  );

  return (
    <div className="page-enter">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px" }}>Settings</h1>
        <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>Personalise your Point Window experience</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <GlassCard hover={false} style={{ padding:22 }} delay={0}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>PROFILE</p>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:64, height:64, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", boxShadow:"0 0 24px rgba(168,85,247,0.5)" }}>B</div>
            <div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:20, color:"#f0ebff", margin:"0 0 2px" }}>Bikram</p>
              <p style={{ fontSize:12, color:"#7a6b84", margin:"0 0 10px" }}>Otaku Sage 🔮</p>
              <Btn small variant="ghost">Edit Profile</Btn>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={80}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>PREFERENCES</p>
          {[["Notifications","Get reminded to continue titles", notif, ()=>setNotif(v=>!v)],["Spoiler-Free Mode","Hide spoilers in AI responses", spoiler, ()=>setSpoiler(v=>!v)]].map(([label,desc,on,fn]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <p style={{ fontSize:13, color:"#e2d9f3", margin:"0 0 2px", fontWeight:600 }}>{label}</p>
                <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{desc}</p>
              </div>
              <Toggle on={on} onToggle={fn} />
            </div>
          ))}
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={160}>
          <p style={{ fontSize:10, color:"#fbbf24", fontWeight:700, letterSpacing:"0.15em", marginBottom:14 }}>FAVORITE GENRES</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {ALL_GENRES.map(g => (
              <button key={g} onClick={() => toggleGenre(g)} style={{ padding:"7px 14px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${genres.includes(g) ? "#fbbf24" : "rgba(255,255,255,0.1)"}`, background: genres.includes(g) ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.03)", color: genres.includes(g) ? "#fbbf24" : "#7a6b84", transition:"all 0.25s", boxShadow: genres.includes(g) ? "0 0 10px rgba(251,191,36,0.25)" : "none" }}>{g}</button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
