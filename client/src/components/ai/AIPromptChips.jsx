import React from "react";
import Button from "../common/Button";
export default function AIPromptChips({ chips, onPick }) { return <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{chips.map((c)=><Button key={c} variant="ghost" onClick={()=>onPick(c)}>{c}</Button>)}</div>; }
