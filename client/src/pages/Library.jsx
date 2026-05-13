import React from "react";
import { useLibrary } from "../hooks/useLibrary";
import LibraryCard from "../components/library/LibraryCard";
import LibraryStats from "../components/library/LibraryStats";
import EmptyState from "../components/common/EmptyState";
import { useNavigate } from "react-router-dom";

export default function Library(){ const { library }=useLibrary(); const nav=useNavigate(); return <div className="page-enter"><LibraryStats library={library} /><div style={{height:12}}/>{library.length===0?<EmptyState title="Your library is empty."/>:<div className="grid cards">{library.map((i)=><LibraryCard key={i.id} item={i} onView={()=>nav(`/titles/${i.id}`)} />)}</div>}</div>; }
