import React, { useState } from "react";
import TopSearch from "../layouts/TopSearch";
import { useTitles } from "../hooks/useTitles";
import { useLibrary } from "../hooks/useLibrary";
import TitleGrid from "../components/titles/TitleGrid";
import { useNavigate } from "react-router-dom";

export default function Discover(){ const [q,setQ]=useState(""); const { titles }=useTitles(q); const { library, addToLibrary }=useLibrary(); const nav=useNavigate(); return <div className="page-enter"><TopSearch value={q} onChange={setQ} /><div style={{height:12}}/><TitleGrid titles={titles} library={library} onAdd={addToLibrary} onView={(t)=>nav(`/titles/${t.id}`)} /></div>; }
