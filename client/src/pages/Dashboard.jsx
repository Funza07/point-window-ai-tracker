import React from "react";
import { useTitles } from "../hooks/useTitles";
import { useLibrary } from "../hooks/useLibrary";
import TitleGrid from "../components/titles/TitleGrid";
import SectionHeader from "../components/common/SectionHeader";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){ const { titles }=useTitles(""); const { library, addToLibrary }=useLibrary(); const nav=useNavigate(); return <div className="page-enter"><SectionHeader title="Dashboard" sub="Trending picks and quick continue"/><TitleGrid titles={titles.slice(0,4)} library={library} onAdd={addToLibrary} onView={(t)=>nav(`/titles/${t.id}`)} /></div>; }
