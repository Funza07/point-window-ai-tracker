export default function MobileNav({ NAV, page, navigate }) {
  return (
    <nav style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, background:"rgba(8,6,16,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(168,85,247,0.12)", padding:"8px 0 12px", zIndex:200, justifyContent:"space-around" }}>
      {NAV.slice(0,5).map(({ id, label, icon }) => {
        const active = page === id;
        return (
          <button key={id} onClick={() => navigate(id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", color: active ? "#d8b4fe" : "#6b5b78", fontFamily:"inherit", transition:"color 0.2s" }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:9, fontWeight: active ? 700 : 400 }}>{label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}
