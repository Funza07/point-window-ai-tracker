import { useState, useEffect } from "react";

export default function ProgressBar({ pct, color = "#a855f7" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(pct), 100); }, [pct]);
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${width}%`, background:`linear-gradient(90deg, ${color}cc, ${color})`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 6px ${color}66` }} />
    </div>
  );
}
