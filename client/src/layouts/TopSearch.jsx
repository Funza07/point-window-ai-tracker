import React from "react";
export default function TopSearch({ value, onChange }) { return <input className="input" placeholder="Search anime, manga, manhwa..." value={value} onChange={(e)=>onChange(e.target.value)} />; }
