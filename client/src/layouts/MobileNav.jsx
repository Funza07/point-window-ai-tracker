import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../data/navItems";
export default function MobileNav(){return <nav className="mobile-only" style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(8,6,16,.97)",borderTop:"1px solid rgba(168,85,247,.12)",padding:"8px 0 12px",justifyContent:"space-around",zIndex:200}}>{NAV_ITEMS.slice(0,5).map((n)=><NavLink key={n.id} to={n.id==="dashboard"?"/":"/"+n.id} style={({isActive})=>({color:isActive?"#d8b4fe":"#6b5b78",textDecoration:"none"})}>{n.icon}</NavLink>)}</nav>;}
