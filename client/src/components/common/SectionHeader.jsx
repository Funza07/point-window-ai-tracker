import React from "react";
export default function SectionHeader({ title, sub }) { return <div style={{marginBottom:12}}><h2 style={{fontFamily:"Rajdhani",fontWeight:800,margin:0}}>{title}</h2>{sub&&<p style={{fontSize:12,color:"#7a6b84",margin:0}}>{sub}</p>}</div>; }
