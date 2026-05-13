import React from "react";
import TitleCard from "./TitleCard";
export default function TitleGrid({ titles, library, onView, onAdd }) { return <div className="grid cards">{titles.map((t)=><TitleCard key={t.id} title={t} inLib={library.some((x)=>x.id===t.id)} onView={onView} onAdd={onAdd}/>)}</div>; }
