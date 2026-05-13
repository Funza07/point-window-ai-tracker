import AmbientBg from "../components/background/AmbientBg";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ NAV, page, lib, navigate, children }) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#080610", fontFamily:"'Noto Sans JP', sans-serif", color:"#e2d9f3", position:"relative" }}>
      <AmbientBg />
      <Sidebar NAV={NAV} page={page} lib={lib} navigate={navigate} />
      <main style={{ marginLeft:226, flex:1, padding:"32px 32px 48px", position:"relative", zIndex:1, minHeight:"100vh" }}>
        {children}
      </main>
      <MobileNav NAV={NAV} page={page} navigate={navigate} />
    </div>
  );
}
