import { useState } from "react";

export default function Button({ children, onClick, variant = "primary", small = false, disabled = false, style = {} }) {
  const [hov, setHov] = useState(false);
  const [active, setActive] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:6, border:"none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius:10, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.04em",
    transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
    opacity: disabled ? 0.45 : 1,
    padding: small ? "5px 14px" : "9px 22px",
    fontSize: small ? 11 : 13,
    transform: active && !disabled ? "scale(0.96)" : hov && !disabled ? "translateY(-1px)" : "none",
    ...style
  };
  const events = { onMouseEnter:()=>setHov(true), onMouseLeave:()=>{setHov(false);setActive(false);}, onMouseDown:()=>setActive(true), onMouseUp:()=>setActive(false) };
  if (variant === "primary") return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "linear-gradient(135deg,#c026d3,#7c3aed)" : "linear-gradient(135deg,#a855f7,#6d28d9)", color:"#fff", boxShadow: hov ? "0 0 20px rgba(168,85,247,0.6), 0 4px 12px rgba(168,85,247,0.3)" : "0 0 12px rgba(168,85,247,0.35)" }}>
      {children}
    </button>
  );
  if (variant === "cyan") return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "rgba(6,182,212,0.22)" : "rgba(6,182,212,0.1)", color:"#22d3ee", border:"1px solid rgba(6,182,212,0.45)", boxShadow: hov ? "0 0 16px rgba(6,182,212,0.4)" : "none" }}>
      {children}
    </button>
  );
  return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", color:"#c4b5d0", border:"1px solid rgba(255,255,255,0.11)" }}>
      {children}
    </button>
  );
}
