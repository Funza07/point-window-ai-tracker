import React from "react";
export default function AIMessageBubble({ role, content }) { const isUser=role==="user"; return <div style={{textAlign:isUser?"right":"left",margin:"8px 0"}}><span style={{display:"inline-block",padding:"8px 12px",borderRadius:12,background:isUser?"rgba(168,85,247,.2)":"rgba(255,255,255,.06)"}}>{content}</span></div>; }
