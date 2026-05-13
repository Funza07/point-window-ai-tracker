import React from "react";
export default function ProgressBar({ pct, color="#a855f7" }) { return <div style={{height:3,background:"rgba(255,255,255,.08)",borderRadius:99}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width .4s"}}/></div>; }
