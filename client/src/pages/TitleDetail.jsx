import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { mockTitles } from "../data/mockTitles";
import TitleHero from "../components/titles/TitleHero";
import TitleMeta from "../components/titles/TitleMeta";
import ProgressBar from "../components/common/ProgressBar";
import { getProgressLabel, getProgressPercentage } from "../utils/titleUtils";
import { useLibrary } from "../hooks/useLibrary";

export default function TitleDetail(){ const { id }=useParams(); const title=mockTitles.find((x)=>x.id===id)||mockTitles[0]; const { library, updateLibraryItem, addToLibrary }=useLibrary(); const existing=library.find((x)=>x.id===title.id); const [form,setForm]=useState({progress:existing?.progress||0,score:existing?.score||0,notes:existing?.notes||"",saved_link:existing?.saved_link||"",status:existing?.status||"Planning"}); const pct=useMemo(()=>getProgressPercentage(form.progress,title.total),[form.progress,title.total]); const save=()=>{ const payload={...title,...form,total:title.total}; if(existing) updateLibraryItem(title.id,payload); else addToLibrary(payload); }; return <div className="page-enter"><TitleHero title={title}/><TitleMeta title={title}/><div className="glass" style={{padding:16,marginTop:12}}><p>{title.synopsis}</p><label>{getProgressLabel(title.type)} <input className="input" type="number" value={form.progress} max={title.total} onChange={(e)=>setForm({...form,progress:Number(e.target.value)})}/></label><ProgressBar pct={pct}/><button onClick={save}>Save Progress</button></div></div>; }
