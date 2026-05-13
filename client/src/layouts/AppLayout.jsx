import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import AmbientBg from "../components/background/AmbientBg";

export default function AppLayout() {
  return <div className="app-shell"><AmbientBg /><Sidebar /><main className="main-area"><Outlet /></main><MobileNav /></div>;
}
