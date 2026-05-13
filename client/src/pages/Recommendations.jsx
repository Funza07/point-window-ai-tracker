import React from "react";
import { useRecommendations } from "../hooks/useRecommendations";
import { useLibrary } from "../hooks/useLibrary";
import TitleGrid from "../components/titles/TitleGrid";
import { useNavigate } from "react-router-dom";

export default function Recommendations(){ const { recommendations }=useRecommendations(); const { library, addToLibrary }=useLibrary(); const nav=useNavigate(); return <div className="page-enter"><TitleGrid titles={recommendations} library={library} onAdd={addToLibrary} onView={(t)=>nav(`/titles/${t.id}`)} /></div>; }
