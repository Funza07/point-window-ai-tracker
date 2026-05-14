import { useState } from "react";
import AppShell from "./layouts/AppShell";
import Settings from "./pages/Settings";
import Recommendations from "./pages/Recommendations";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import TitleDetail from "./pages/TitleDetail";
import { NAV } from "./data/navItems";
import { getLib } from "./utils/storageUtils";
// ?? Animated Orb Background ???????????????????????????????????????????????????????????????????????????????????
// â”€â”€â”€ Main App Shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lib, setLib] = useState(getLib);
  const [detailTitle, setDetailTitle] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (p) => { setPage(p); setSidebarOpen(false); };

  const renderPage = () => {
    if (page === "detail" && detailTitle) return <TitleDetail title={detailTitle} lib={lib} setLib={setLib} setPage={setPage} />;
    if (page === "discover") return <Discover lib={lib} setLib={setLib} setPage={setPage} setDetailTitle={setDetailTitle} />;
    if (page === "library") return <Library lib={lib} setLib={setLib} setPage={setPage} setDetailTitle={setDetailTitle} />;
    if (page === "recommendations") return <Recommendations lib={lib} setLib={setLib} setPage={setPage} setDetailTitle={setDetailTitle} />;
    if (page === "ai") return <AIAssistant lib={lib} />;
    if (page === "settings") return <Settings />;
    return <Dashboard lib={lib} setLib={setLib} setPage={setPage} setDetailTitle={setDetailTitle} />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700;800&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.35); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.6); }
        input, textarea, select { outline: none; }
        option { background: #12101e; color: #e2d9f3; }

        /* â”€â”€ Ambient orbs â”€â”€ */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: orbFloat 12s ease-in-out infinite;
        }
        .orb1 {
          width: 600px; height: 600px;
          top: -20%; left: -10%;
          background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%);
          animation-duration: 14s;
        }
        .orb2 {
          width: 500px; height: 500px;
          bottom: 5%; right: -8%;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%);
          animation-duration: 18s;
          animation-delay: -4s;
        }
        .orb3 {
          width: 400px; height: 400px;
          top: 45%; left: 40%;
          background: radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 65%);
          animation-duration: 22s;
          animation-delay: -8s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }

        /* â”€â”€ Noise overlay â”€â”€ */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* â”€â”€ Page enter animation â”€â”€ */
        .page-enter {
          opacity: 0;
          animation: pageEnter 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* â”€â”€ Fade slide up â”€â”€ */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeSlideUp 0.3s ease forwards;
        }

        /* â”€â”€ Hero banner hover â”€â”€ */
        .hero-banner { transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
        .hero-banner:hover { transform: scale(1.005); }
        .hero-img { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .hero-banner:hover .hero-img { transform: scale(1.04); }

        /* â”€â”€ Hero shimmer â”€â”€ */
        .hero-shimmer {
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { left: -60%; }
          100% { left: 130%; }
        }

        /* â”€â”€ Typing dots â”€â”€ */
        .dot-1, .dot-2, .dot-3 { animation: dotBounce 1.4s ease-in-out infinite; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }

        /* â”€â”€ Status dot â”€â”€ */
        .status-dot {
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }

        /* â”€â”€ Sidebar nav item hover â”€â”€ */
        .nav-item { position: relative; overflow: hidden; }
        .nav-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(168,85,247,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nav-item:hover::after { opacity: 1; }

        /* â”€â”€ Sidebar active indicator â”€â”€ */
        .nav-active-bar {
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 2px;
          background: linear-gradient(180deg, #a855f7, #ec4899);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(168,85,247,0.8);
        }

        /* â”€â”€ Logo glow pulse â”€â”€ */
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 24px rgba(168,85,247,0.7), 0 0 40px rgba(168,85,247,0.2); }
        }
        .logo-icon { animation: logoPulse 3s ease-in-out infinite; }

        /* â”€â”€ User badge hover â”€â”€ */
        .user-badge { transition: all 0.2s; }
        .user-badge:hover { transform: translateX(2px); }
      `}</style>

      <AppShell NAV={NAV} page={page} lib={lib} navigate={navigate}>
        {renderPage()}
      </AppShell>
    </>
  );
}























