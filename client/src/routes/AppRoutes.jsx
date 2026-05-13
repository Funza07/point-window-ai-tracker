import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Discover from "../pages/Discover";
import Library from "../pages/Library";
import Recommendations from "../pages/Recommendations";
import AIAssistant from "../pages/AIAssistant";
import TitleDetail from "../pages/TitleDetail";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoutes() {
  return <BrowserRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<Dashboard/>}/><Route path="/discover" element={<Discover/>}/><Route path="/library" element={<Library/>}/><Route path="/recommendations" element={<Recommendations/>}/><Route path="/ai" element={<AIAssistant/>}/><Route path="/settings" element={<Settings/>}/><Route path="/titles/:id" element={<TitleDetail/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/></Route></Routes></BrowserRouter>;
}
