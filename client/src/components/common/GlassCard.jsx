import { useState, useEffect, useRef } from "react";

export default function GlassCard({ children, style = {}, onClick, hover = true, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        backdropFilter:"blur(24px)",
        border:`1px solid ${hov && hover ? "rgba(168,85,247,0.45)" : "rgba(255,255,255,0.07)"}`,
        borderRadius:18, transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hov && hover ? "0 8px 40px rgba(168,85,247,0.18), 0 0 0 1px rgba(168,85,247,0.1)" : "0 2px 12px rgba(0,0,0,0.3)",
        cursor: onClick ? "pointer" : "default",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
        ...style
      }}
    >
      {children}
    </div>
  );
}
