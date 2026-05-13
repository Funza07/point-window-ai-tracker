import React from "react";
export default function SpoilerToggle({ value, onChange }) { return <label style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={value} onChange={(e)=>onChange(e.target.checked)}/> Spoiler Free</label>; }
