export default function MobileNav({ NAV, page, navigate, isMobile = false }) {
  if (!isMobile) return null;
  const labelMap = {
    dashboard: "Home",
    discover: "Search",
    library: "Library",
    recommendations: "For You",
    ai: "AI",
  };

  return (
    <nav style={{ display:"flex", position:"fixed", bottom:0, left:0, right:0, background:"rgba(8,6,16,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(168,85,247,0.12)", padding:"8px 0 12px", zIndex:200, justifyContent:"space-around", gap:4 }}>
      {NAV.slice(0,5).map(({ id, label }) => {
        const active = page === id || (page === "detail" && id === "discover");
        return (
          <button key={id} onClick={() => navigate(id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, background:"none", border:"none", cursor:"pointer", color: active ? "#d8b4fe" : "#6b5b78", fontFamily:"inherit", transition:"color 0.2s", minWidth:62, minHeight:42, WebkitTapHighlightColor:"transparent", boxSizing:"border-box", padding:"2px 4px" }}>
            <span style={{ fontSize:10, fontWeight: active ? 700 : 500, whiteSpace:"nowrap" }}>{labelMap[id] || label}</span>
          </button>
        );
      })}
    </nav>
  );
}
