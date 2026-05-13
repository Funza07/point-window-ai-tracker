import React from "react";
export default function StarRating({ value }) { const full=Math.round((value||0)/2); return <span style={{color:"#fbbf24",fontSize:12}}>{"?".repeat(full)}{"?".repeat(5-full)} <span style={{color:"#8a7898"}}>{value}</span></span>; }
