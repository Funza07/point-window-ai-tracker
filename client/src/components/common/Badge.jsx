import React from "react";
export default function Badge({ children, color = "#a855f7" }) { return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:`${color}20`,color,border:`1px solid ${color}50`}}>{children}</span>; }
