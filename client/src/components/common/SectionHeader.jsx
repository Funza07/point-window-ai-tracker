import { useState, useEffect } from "react";

export default function SectionHeader({ title, sub, action, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-8px)", transition:"all 0.4s ease" }}>
      <div>
        <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:20, color:"#f0ebff", margin:"0 0 2px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:20, height:2, background:"linear-gradient(90deg,#a855f7,transparent)", display:"block" }} />
          {title}
        </h2>
        {sub && <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={action.fn} style={{ background:"none", border:"none", color:"#a855f7", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.05em", transition:"color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "#c084fc"}
          onMouseLeave={e => e.target.style.color = "#a855f7"}>
          {action.label} ?
        </button>
      )}
    </div>
  );
}
