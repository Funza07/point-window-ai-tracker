import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../data/navItems";
import { useLibrary } from "../hooks/useLibrary";

export default function Sidebar() {
  const { library } = useLibrary();
  return <aside className="desktop-only" style={{position:"fixed",left:0,top:0,bottom:0,width:226,background:"rgba(8,6,16,.92)",borderRight:"1px solid rgba(168,85,247,.12)",padding:"24px 14px",zIndex:100}}>
    <p style={{fontFamily:"Rajdhani",fontWeight:900,fontSize:24}}>Point Window</p>
    {NAV_ITEMS.map((n)=><NavLink key={n.id} to={n.id==="dashboard"?"/":"/"+n.id} style={({isActive})=>({display:"flex",padding:"10px",marginBottom:6,borderRadius:12,textDecoration:"none",color:isActive?"#d8b4fe":"#6b5b78",background:isActive?"rgba(168,85,247,.15)":"transparent"})}>{n.icon} <span style={{marginLeft:8}}>{n.label}</span>{n.id==="library"&&library.length>0&&<span style={{marginLeft:"auto"}}>{library.length}</span>}</NavLink>)}
  </aside>;
}
