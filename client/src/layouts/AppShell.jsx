import AmbientBg from "../components/background/AmbientBg";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ NAV, page, lib, navigate, children, isMobile = false }) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#080610", fontFamily:"'Noto Sans JP', sans-serif", color:"#e2d9f3", position:"relative", overflowX:"hidden", width:"100%" }}>
      <AmbientBg />
      <Sidebar isMobile={isMobile} NAV={NAV} page={page} lib={lib} navigate={navigate} />
      <main style={{ marginLeft:isMobile ? 0 : 226, flex:1, padding:isMobile ? "18px 14px 96px" : "32px 32px 48px", position:"relative", zIndex:1, minHeight:"100vh", width:"100%", maxWidth:"100vw", overflowX:"hidden" }}>
        {children}
      </main>
      <MobileNav isMobile={isMobile} NAV={NAV} page={page} navigate={navigate} />
    </div>
  );
}
