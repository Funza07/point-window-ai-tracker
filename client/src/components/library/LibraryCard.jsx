import React from "react";
import GlassCard from "../common/GlassCard";
import ProgressBar from "../common/ProgressBar";
import { getProgressPercentage, getProgressLabel } from "../../utils/titleUtils";
export default function LibraryCard({ item, onView }) { const pct=getProgressPercentage(item.progress,item.total); return <GlassCard style={{padding:12}}><p style={{fontFamily:"Rajdhani",fontSize:18,margin:0}}>{item.title}</p><p style={{fontSize:12,color:"#7a6b84"}}>{getProgressLabel(item.type)} {item.progress}/{item.total}</p><ProgressBar pct={pct}/><button onClick={()=>onView(item)} style={{marginTop:10}}>Open</button></GlassCard>; }
