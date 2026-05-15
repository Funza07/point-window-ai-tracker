export default function Sidebar({ NAV, page, lib, navigate, isMobile = false }) {
  if (isMobile) return null;

  return (
    <aside style={{
      position:"fixed", left:0, top:0, bottom:0, width:226,
      background:"rgba(8,6,16,0.92)", backdropFilter:"blur(32px)",
      borderRight:"1px solid rgba(168,85,247,0.12)",
      display:"flex", flexDirection:"column", padding:"24px 14px",
      zIndex:100,
    }}>
      {/* Logo */}
      <div style={{ padding:"6px 8px 26px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div className="logo-icon" style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>PW</div>
          <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:19, color:"#f0ebff", letterSpacing:"-0.01em" }}>Point Window</span>
        </div>
        <p style={{ fontSize:9, color:"#6b5b78", margin:0, paddingLeft:44, letterSpacing:"0.15em" }}>AI TRACKER</p>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
        {NAV.map(({ id, label, icon }, idx) => {
          const active = page === id || (page === "detail" && id === "discover");
          return (
            <button
              key={id}
              className="nav-item"
              onClick={() => navigate(id)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"11px 12px", borderRadius:12, border:"none",
                background: active ? "rgba(168,85,247,0.15)" : "transparent",
                color: active ? "#d8b4fe" : "#6b5b78",
                cursor:"pointer", fontFamily:"inherit", fontSize:13,
                fontWeight: active ? 700 : 500,
                textAlign:"left",
                transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
                position:"relative",
                opacity:0,
                animation:`fadeSlideUp 0.35s ease ${idx * 50 + 50}ms forwards`,
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.color = "#c4b5d0")}
              onMouseLeave={e => !active && (e.currentTarget.style.color = "#6b5b78")}
            >
              {active && <div className="nav-active-bar" />}
              <span style={{ fontSize:15, width:20, textAlign:"center", paddingLeft: active ? 4 : 0, transition:"padding 0.2s" }}>{icon}</span>
              {label}
              {id === "library" && lib.length > 0 && (
                <span style={{ marginLeft:"auto", fontSize:10, background:"rgba(168,85,247,0.25)", color:"#d8b4fe", padding:"1px 8px", borderRadius:99, fontWeight:700, minWidth:20, textAlign:"center" }}>{lib.length}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.2),transparent)", margin:"12px 0" }} />

      {/* User */}
      <div className="user-badge" style={{ display:"flex", alignItems:"center", gap:10, padding:"8px", borderRadius:12, cursor:"pointer" }}>
        <div style={{ width:38, height:38, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#fff", boxShadow:"0 0 14px rgba(168,85,247,0.45)", flexShrink:0 }}>B</div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:"#f0ebff", margin:0 }}>Bikram</p>
          <p style={{ fontSize:10, color:"#6b5b78", margin:0 }}>Otaku Sage</p>
        </div>
      </div>
    </aside>
  );
}

