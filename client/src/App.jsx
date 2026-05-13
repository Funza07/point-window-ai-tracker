import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { aiService } from "./services/aiService";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockTitles = [
  { id:"solo-leveling", title:"Solo Leveling", alt:"Only I Level Up", type:"Manhwa", status:"Ongoing", total:200, rating:9.2, genres:["Action","Fantasy","Adventure"], synopsis:"A weak hunter rises to unmatched power through a mysterious leveling system after surviving a double dungeon.", cover:"https://picsum.photos/seed/solo/400/580", banner:"https://picsum.photos/seed/solo-banner/1200/420", popularity:99, year:2018, reason:"Perfect for overpowered MC fans — explosive pacing with stunning art." },
  { id:"orv", title:"Omniscient Reader", alt:"Omniscient Reader's Viewpoint", type:"Manhwa", status:"Ongoing", total:230, rating:9.1, genres:["Action","Fantasy","Thriller"], synopsis:"A reader of an obscure web novel finds himself thrust into its world — and is the only one who knows how it ends.", cover:"https://picsum.photos/seed/orv/400/580", banner:"https://picsum.photos/seed/orv-b/1200/420", popularity:95, year:2020, reason:"Deep strategic plotting meets emotional gut-punches." },
  { id:"aot", title:"Attack on Titan", alt:"Shingeki no Kyojin", type:"Anime", status:"Completed", total:94, rating:9.1, genres:["Action","Dark","Thriller"], synopsis:"Humanity battles giant titans behind massive walls while uncovering the terrifying truth of their world.", cover:"https://picsum.photos/seed/aot/400/580", banner:"https://picsum.photos/seed/aot-b/1200/420", popularity:97, year:2013, reason:"Masterclass in dark political narrative and shocking revelations." },
  { id:"frieren", title:"Frieren", alt:"Frieren: Beyond Journey's End", type:"Anime", status:"Ongoing", total:28, rating:9.3, genres:["Fantasy","Adventure","Emotional"], synopsis:"An elf mage reflects on centuries of life and loss after the hero's journey has already ended.", cover:"https://picsum.photos/seed/frieren/400/580", banner:"https://picsum.photos/seed/frieren-b/1200/420", popularity:89, year:2023, reason:"Quiet, devastating emotional storytelling unlike anything else airing." },
  { id:"jjk", title:"Jujutsu Kaisen", alt:"Jujutsu Kaisen", type:"Anime", status:"Ongoing", total:47, rating:8.7, genres:["Action","Supernatural","Thriller"], synopsis:"Students exorcise cursed spirits while facing existential threats from elite sorcerers.", cover:"https://picsum.photos/seed/jjk/400/580", banner:"https://picsum.photos/seed/jjk-b/1200/420", popularity:94, year:2020, reason:"Elite battle choreography and a genuinely menacing villain roster." },
  { id:"csm", title:"Chainsaw Man", alt:"Chainsaw Man", type:"Manga", status:"Ongoing", total:180, rating:8.9, genres:["Action","Dark","Comedy"], synopsis:"A broke teen merges with a chainsaw devil and joins a government agency that hunts other devils.", cover:"https://picsum.photos/seed/csm/400/580", banner:"https://picsum.photos/seed/csm-b/1200/420", popularity:93, year:2018, reason:"Chaotic, unpredictable energy with emotional gut-punches every arc." },
  { id:"dn", title:"Death Note", alt:"Death Note", type:"Anime", status:"Completed", total:37, rating:9.0, genres:["Thriller","Supernatural","Smart Plot"], synopsis:"A student discovers a supernatural notebook that can kill anyone whose name is written in it.", cover:"https://picsum.photos/seed/dn/400/580", banner:"https://picsum.photos/seed/dn-b/1200/420", popularity:92, year:2006, reason:"The definitive high-IQ cat-and-mouse psychological thriller." },
  { id:"op", title:"One Piece", alt:"One Piece", type:"Anime", status:"Ongoing", total:1100, rating:9.0, genres:["Adventure","Comedy","Action"], synopsis:"Luffy and his crew sail the Grand Line in search of the ultimate treasure to claim the title of Pirate King.", cover:"https://picsum.photos/seed/op/400/580", banner:"https://picsum.photos/seed/op-b/1200/420", popularity:100, year:1999, reason:"Unmatched worldbuilding and the most rewarding long journey in anime." },
  { id:"demon-slayer", title:"Demon Slayer", alt:"Kimetsu no Yaiba", type:"Anime", status:"Ongoing", total:63, rating:8.8, genres:["Action","Fantasy","Adventure"], synopsis:"A swordsman joins a corps of demon hunters after his family is slaughtered, seeking a cure for his sister.", cover:"https://picsum.photos/seed/ds/400/580", banner:"https://picsum.photos/seed/ds-b/1200/420", popularity:96, year:2019, reason:"Cinematic production values with genuine emotional stakes." },
  { id:"tbate", title:"The Beginning After the End", alt:"TBATE", type:"Manhwa", status:"Ongoing", total:215, rating:8.9, genres:["Fantasy","Adventure","Drama"], synopsis:"A legendary king reincarnates into a new world and vows to forge a different, better life.", cover:"https://picsum.photos/seed/tbate/400/580", banner:"https://picsum.photos/seed/tbate-b/1200/420", popularity:87, year:2018, reason:"Reincarnation done right — real character growth and emotional arcs." },
  { id:"blue-lock", title:"Blue Lock", alt:"Blue Lock", type:"Anime", status:"Ongoing", total:38, rating:8.4, genres:["Sports","Thriller","Action"], synopsis:"Strikers compete in a ruthless zero-sum program to become Japan's most selfish and deadly striker.", cover:"https://picsum.photos/seed/bluelock/400/580", banner:"https://picsum.photos/seed/bl-b/1200/420", popularity:88, year:2022, reason:"Sports anime reinvented as a high-stakes psychological battle." },
  { id:"naruto", title:"Naruto", alt:"Naruto", type:"Anime", status:"Completed", total:220, rating:8.4, genres:["Action","Adventure","Supernatural"], synopsis:"A young ninja outcast dreams of becoming Hokage while mastering powerful forbidden jutsu.", cover:"https://picsum.photos/seed/naruto/400/580", banner:"https://picsum.photos/seed/naruto-b/1200/420", popularity:98, year:2002, reason:"The defining shonen — irreplaceable character bonds and iconic soundtrack." },
  { id:"lookism", title:"Lookism", alt:"Lookism", type:"Manhwa", status:"Ongoing", total:530, rating:8.5, genres:["Drama","Action","School"], synopsis:"A bullied student wakes up able to switch between two bodies — one ugly, one beautiful.", cover:"https://picsum.photos/seed/lookism/400/580", banner:"https://picsum.photos/seed/lk-b/1200/420", popularity:85, year:2014, reason:"Raw social commentary wrapped in escalating underground fighting arcs." },
  { id:"tog", title:"Tower of God", alt:"The Tower", type:"Manhwa", status:"Ongoing", total:620, rating:8.8, genres:["Action","Mystery","Adventure"], synopsis:"A boy climbs an infinite tower filled with deadly tests to find the girl who was his entire world.", cover:"https://picsum.photos/seed/tog/400/580", banner:"https://picsum.photos/seed/tog-b/1200/420", popularity:90, year:2010, reason:"Layered lore and a long-journey progression that rewards patience." },
  { id:"wind-breaker", title:"Wind Breaker", alt:"Wind Breaker", type:"Manhwa", status:"Ongoing", total:510, rating:8.3, genres:["Sports","Drama","Comedy"], synopsis:"A gifted cyclist joins a street crew and discovers what it means to ride for something greater than himself.", cover:"https://picsum.photos/seed/wind/400/580", banner:"https://picsum.photos/seed/wb-b/1200/420", popularity:82, year:2013, reason:"Stylish competition arcs with genuine character chemistry." },
];

const MOODS = ["Action","Emotional","Dark","Funny","Smart Plot","OP MC","Short","Fantasy"];
const NAV = [
  { id:"dashboard", label:"Dashboard", icon:"⊞", emoji:"🏠" },
  { id:"discover", label:"Discover", icon:"◈", emoji:"🔭" },
  { id:"library", label:"My Library", icon:"◳", emoji:"📚" },
  { id:"recommendations", label:"For You", icon:"✦", emoji:"✨" },
  { id:"ai", label:"AI Assistant", icon:"◎", emoji:"🤖" },
  { id:"settings", label:"Settings", icon:"⚙", emoji:"⚙️" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getLib = () => { try { return JSON.parse(localStorage.getItem("pw_lib") || "[]"); } catch { return []; } };
const saveLib = (l) => localStorage.setItem("pw_lib", JSON.stringify(l));
const upsertItem = (item, lib) => { const next = lib.filter(x => x.id !== item.id); next.unshift(item); saveLib(next); return next; };
const removeItem = (id, lib) => { const n = lib.filter(x => x.id !== id); saveLib(n); return n; };
const getChat = () => { try { return JSON.parse(localStorage.getItem("pw_chat") || "[]"); } catch { return []; } };
const saveChat = (c) => localStorage.setItem("pw_chat", JSON.stringify(c));
const typeColor = (type) => type === "Anime" ? "#e879f9" : type === "Manga" ? "#38bdf8" : "#a78bfa";
const typeGlow = (type) => type === "Anime" ? "rgba(232,121,249,0.4)" : type === "Manga" ? "rgba(56,189,248,0.4)" : "rgba(167,139,250,0.4)";

// ─── Animated Orb Background ─────────────────────────────────────────────────
function AmbientBg() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
      <div className="noise-overlay" />
    </div>
  );
}

// ─── Reusable Components ──────────────────────────────────────────────────────
function Badge({ children, color }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 10px", borderRadius:99,
      fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
      background:`${color}20`, color, border:`1px solid ${color}50`,
      boxShadow:`0 0 8px ${color}30`,
    }}>{children}</span>
  );
}

function GenrePill({ genre }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 8px", borderRadius:4,
      fontSize:10, color:"#9d8aac", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)"
    }}>{genre}</span>
  );
}

function StarRating({ value }) {
  return (
    <span style={{ color:"#fbbf24", fontSize:12, letterSpacing:1 }}>
      {"★".repeat(Math.round(value / 2))}{"☆".repeat(5 - Math.round(value / 2))}
      <span style={{ color:"#8a7898", marginLeft:5, fontSize:11 }}>{value}</span>
    </span>
  );
}

function ProgressBar({ pct, color = "#a855f7" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(pct), 100); }, [pct]);
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${width}%`, background:`linear-gradient(90deg, ${color}cc, ${color})`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 6px ${color}66` }} />
    </div>
  );
}

function GlassCard({ children, style = {}, onClick, hover = true, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        backdropFilter:"blur(24px)",
        border:`1px solid ${hov && hover ? "rgba(168,85,247,0.45)" : "rgba(255,255,255,0.07)"}`,
        borderRadius:18, transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hov && hover ? "0 8px 40px rgba(168,85,247,0.18), 0 0 0 1px rgba(168,85,247,0.1)" : "0 2px 12px rgba(0,0,0,0.3)",
        cursor: onClick ? "pointer" : "default",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small = false, disabled = false, style = {} }) {
  const [hov, setHov] = useState(false);
  const [active, setActive] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:6, border:"none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius:10, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.04em",
    transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
    opacity: disabled ? 0.45 : 1,
    padding: small ? "5px 14px" : "9px 22px",
    fontSize: small ? 11 : 13,
    transform: active && !disabled ? "scale(0.96)" : hov && !disabled ? "translateY(-1px)" : "none",
    ...style
  };
  const events = { onMouseEnter:()=>setHov(true), onMouseLeave:()=>{setHov(false);setActive(false);}, onMouseDown:()=>setActive(true), onMouseUp:()=>setActive(false) };
  if (variant === "primary") return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "linear-gradient(135deg,#c026d3,#7c3aed)" : "linear-gradient(135deg,#a855f7,#6d28d9)", color:"#fff", boxShadow: hov ? "0 0 20px rgba(168,85,247,0.6), 0 4px 12px rgba(168,85,247,0.3)" : "0 0 12px rgba(168,85,247,0.35)" }}>
      {children}
    </button>
  );
  if (variant === "cyan") return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "rgba(6,182,212,0.22)" : "rgba(6,182,212,0.1)", color:"#22d3ee", border:"1px solid rgba(6,182,212,0.45)", boxShadow: hov ? "0 0 16px rgba(6,182,212,0.4)" : "none" }}>
      {children}
    </button>
  );
  return (
    <button onClick={!disabled ? onClick : undefined} {...events}
      style={{ ...base, background: hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", color:"#c4b5d0", border:"1px solid rgba(255,255,255,0.11)" }}>
      {children}
    </button>
  );
}

function TitleCard({ title, lib, onAdd, onView, delay = 0 }) {
  const inLib = lib.some(x => x.id === title.id);
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const c = typeColor(title.type);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:16, overflow:"hidden",
        background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border:`1px solid ${hov ? c + "60" : "rgba(255,255,255,0.07)"}`,
        transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hov ? `0 16px 48px ${typeGlow(title.type)}, 0 0 0 1px ${c}20` : "0 4px 16px rgba(0,0,0,0.4)",
        transform: hov ? "translateY(-6px) scale(1.01)" : vis ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        opacity: vis ? 1 : 0,
        backdropFilter:"blur(16px)",
      }}
    >
      <div style={{ position:"relative", height:200, overflow:"hidden" }}>
        <img src={title.cover} alt={title.title} style={{ width:"100%", height:"100%", objectFit:"cover", transform: hov ? "scale(1.08)" : "scale(1)", transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.2) 55%, transparent 100%)" }} />
        {/* Type badge */}
        <div style={{ position:"absolute", top:10, left:10 }}>
          <Badge color={c}>{title.type}</Badge>
        </div>
        {inLib && (
          <div style={{ position:"absolute", top:10, right:10, background:"rgba(6,182,212,0.18)", border:"1px solid rgba(6,182,212,0.5)", borderRadius:99, padding:"2px 8px", fontSize:9, color:"#22d3ee", fontWeight:700, letterSpacing:"0.1em", backdropFilter:"blur(8px)" }}>
            ✓ SAVED
          </div>
        )}
        {/* Hover overlay glow */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 100%, ${c}15 0%, transparent 60%)`, opacity: hov ? 1 : 0, transition:"opacity 0.3s" }} />
        <div style={{ position:"absolute", bottom:8, left:10, right:10 }}>
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:15, color:"#f0ebff", margin:0, lineHeight:1.2, textShadow:"0 1px 8px rgba(0,0,0,0.8)" }}>{title.title}</p>
        </div>
      </div>
      <div style={{ padding:"10px 12px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <StarRating value={title.rating} />
          <span style={{ fontSize:10, color:"#7a6b84" }}>{title.year}</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
          {title.genres.slice(0,3).map(g => <GenrePill key={g} genre={g} />)}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <Btn small onClick={() => onView(title)} variant="ghost" style={{ flex:1, justifyContent:"center" }}>Details</Btn>
          <Btn small onClick={() => !inLib && onAdd(title)} disabled={inLib} variant={inLib ? "ghost" : "primary"} style={{ flex:1, justifyContent:"center" }}>
            {inLib ? "Saved ✓" : "+ Add"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, action, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-8px)", transition:"all 0.4s ease" }}>
      <div>
        <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:20, color:"#f0ebff", margin:"0 0 2px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:20, height:2, background:"linear-gradient(90deg,#a855f7,transparent)", display:"block" }} />
          {title}
        </h2>
        {sub && <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={action.fn} style={{ background:"none", border:"none", color:"#a855f7", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.05em", transition:"color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "#c084fc"}
          onMouseLeave={e => e.target.style.color = "#a855f7"}>
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Dashboard({ lib, setLib, setPage, setDetailTitle }) {
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const trending = [...mockTitles].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  const hero = mockTitles[3];
  const continueItems = lib.slice(0, 4).map(item => ({ item, title: mockTitles.find(t => t.id === item.id) })).filter(x => x.title);
  const searched = search ? mockTitles.filter(t => `${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase().includes(search.toLowerCase())) : [];
  const onAdd = (t) => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = (t) => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:32 }}>
      {/* Search Bar */}
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color: searchFocus ? "#a855f7" : "#7a6b84", transition:"color 0.2s" }}>⊕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="Search anime, manga, manhwa..."
          style={{
            width:"100%", padding:"14px 16px 14px 46px",
            background: searchFocus ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${searchFocus ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.09)"}`,
            borderRadius:14, color:"#f0ebff", fontSize:14, fontFamily:"inherit",
            outline:"none", boxSizing:"border-box",
            boxShadow: searchFocus ? "0 0 24px rgba(168,85,247,0.18)" : "none",
            transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:99, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", color:"#a0899e", cursor:"pointer", fontSize:11 }}>✕</button>
        )}
      </div>

      {/* Search results */}
      {search && (
        <div className="fade-in">
          <p style={{ fontSize:11, color:"#7a6b84", marginBottom:14, letterSpacing:"0.12em" }}>RESULTS FOR "{search.toUpperCase()}" · {searched.length} found</p>
          {searched.length === 0 ? (
            <GlassCard hover={false} style={{ padding:32, textAlign:"center" }}>
              <p style={{ color:"#7a6b84", fontSize:13, margin:0 }}>No titles found for "{search}"</p>
            </GlassCard>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:14 }}>
              {searched.slice(0,8).map((t, i) => <TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i * 50} />)}
            </div>
          )}
        </div>
      )}

      {/* Hero Banner */}
      {!search && (
        <div className="hero-banner" style={{ borderRadius:24, overflow:"hidden", position:"relative", minHeight:300, cursor:"pointer" }} onClick={() => onView(hero)}>
          <img src={hero.banner} alt={hero.title} style={{ width:"100%", height:340, objectFit:"cover" }} className="hero-img" />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.65) 55%, rgba(168,85,247,0.18) 100%)" }} />
          {/* Shimmer line */}
          <div className="hero-shimmer" />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"32px 32px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }} className="hero-tag">
              <div style={{ width:32, height:2, background:"linear-gradient(90deg,#a855f7,#ec4899)" }} />
              <span style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.2em" }}>FEATURED PICK</span>
            </div>
            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:40, fontWeight:900, color:"#f0ebff", margin:"0 0 6px", lineHeight:1.05 }}>{hero.title}</h1>
            <p style={{ fontSize:12, color:"#7a6b84", margin:"0 0 10px" }}>{hero.alt} · {hero.year} · {hero.type}</p>
            <p style={{ fontSize:13, color:"#c4b5d0", maxWidth:480, margin:"0 0 18px", lineHeight:1.7 }}>{hero.synopsis.slice(0,120)}…</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }} onClick={e => e.stopPropagation()}>
              <Btn onClick={() => onView(hero)}>View Details</Btn>
              <Btn variant="ghost" onClick={() => setPage("ai")}>Ask AI About This</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching */}
      {!search && continueItems.length > 0 && (
        <section>
          <SectionHeader title="Continue Watching / Reading" sub="Pick up right where you left off" action={{ label:"Open Library →", fn:() => setPage("library") }} delay={100} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:12 }}>
            {continueItems.map(({ item, title }, i) => (
              <GlassCard key={title.id} style={{ padding:14, display:"flex", gap:12 }} delay={i * 60 + 100}>
                <img src={title.cover} alt={title.title} style={{ width:52, height:72, objectFit:"cover", borderRadius:10, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:15, color:"#f0ebff", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title.title}</p>
                  <Badge color={typeColor(title.type)}>{title.type}</Badge>
                  <p style={{ fontSize:11, color:"#7a6b84", margin:"6px 0 4px" }}>{item.status} · Ep/Ch {item.progress}</p>
                  <ProgressBar pct={title.total ? Math.round((item.progress / title.total) * 100) : 0} color={typeColor(title.type)} />
                  <div style={{ marginTop:8, display:"flex", gap:6 }}>
                    <Btn small onClick={() => onView(title)}>Continue</Btn>
                    {item.link && <Btn small variant="cyan" onClick={() => window.open(item.link, "_blank")}>▶ Link</Btn>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {!search && (
        <section>
          <SectionHeader title="Trending Now" sub="Most-followed titles this season" delay={150} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(90px, 1fr))", gap:10 }}>
            {trending.map((t, i) => (
              <GlassCard key={t.id} onClick={() => onView(t)} style={{ padding:"12px 10px 10px", textAlign:"center" }} delay={i * 50 + 200}>
                <div style={{ width:30, height:30, borderRadius:99, background:`linear-gradient(135deg,${typeColor(t.type)}30,${typeColor(t.type)}10)`, border:`1px solid ${typeColor(t.type)}40`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", fontSize:11, fontWeight:800, color:typeColor(t.type) }}>#{i+1}</div>
                <p style={{ fontSize:11, fontWeight:700, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.2 }}>{t.title}</p>
                <p style={{ fontSize:9, color:"#7a6b84", margin:0 }}>{t.type}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      {!search && (
        <section>
          <SectionHeader title="Recommended For You" sub="AI-curated picks from your taste profile" action={{ label:"See all →", fn:() => setPage("recommendations") }} delay={200} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:14 }}>
            {mockTitles.slice(4, 8).map((t, i) => <TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i * 60 + 250} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Discover({ lib, setLib, setPage, setDetailTitle }) {
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Popularity");
  const FILTERS = ["All","Anime","Manga","Manhwa","Ongoing","Completed"];

  const list = useMemo(() => {
    let out = mockTitles.filter(t => `${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    if (["Anime","Manga","Manhwa"].includes(filter)) out = out.filter(t => t.type === filter);
    if (["Ongoing","Completed"].includes(filter)) out = out.filter(t => t.status === filter);
    if (sort === "Popularity") out = [...out].sort((a,b) => b.popularity - a.popularity);
    if (sort === "Rating") out = [...out].sort((a,b) => b.rating - a.rating);
    if (sort === "Latest") out = [...out].sort((a,b) => b.year - a.year);
    return out;
  }, [search, filter, sort]);

  const onAdd = (t) => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = (t) => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter">
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px", letterSpacing:"-0.01em" }}>Discover</h1>
        <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>Explore the full catalogue of anime, manga &amp; manhwa</p>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
        <div style={{ position:"relative", flex:"1 1 200px" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color: searchFocus ? "#a855f7" : "#7a6b84", transition:"color 0.2s" }}>⊕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)} placeholder="Search titles…"
            style={{ width:"100%", padding:"10px 12px 10px 36px", background: searchFocus ? "rgba(168,85,247,0.07)" : "rgba(255,255,255,0.04)", border:`1px solid ${searchFocus ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius:12, color:"#f0ebff", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", transition:"all 0.3s", boxShadow: searchFocus ? "0 0 20px rgba(168,85,247,0.15)" : "none" }} />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="filter-btn" style={{ padding:"8px 14px", borderRadius:10, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${filter===f ? "#a855f7" : "rgba(255,255,255,0.09)"}`, background: filter===f ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(109,40,217,0.18))" : "rgba(255,255,255,0.03)", color: filter===f ? "#d8b4fe" : "#7a6b84", transition:"all 0.25s", boxShadow: filter===f ? "0 0 12px rgba(168,85,247,0.3)" : "none" }}>{f}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding:"8px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#c4b5d0", fontSize:11, fontFamily:"inherit", cursor:"pointer", outline:"none" }}>
          <option>Popularity</option><option>Rating</option><option>Latest</option>
        </select>
      </div>
      <p style={{ fontSize:10, color:"#7a6b84", marginBottom:18, letterSpacing:"0.1em" }}>{list.length} TITLES FOUND</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:16 }}>
        {list.map((t, i) => <TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i * 40} />)}
      </div>
    </div>
  );
}

function Library({ lib, setLib, setPage, setDetailTitle }) {
  const [tab, setTab] = useState("All");
  const TABS = ["All","Anime","Manga","Manhwa","Watching","Reading","Completed","Planned","Dropped"];
  const rows = lib.map(item => ({ item, title: mockTitles.find(t => t.id === item.id) })).filter(x => x.title);
  const filtered = rows.filter(({ item, title }) => tab === "All" || title.type === tab || item.status?.toLowerCase() === tab.toLowerCase());
  const stats = { total:rows.length, active:rows.filter(x => ["Watching","Reading"].includes(x.item.status)).length, done:rows.filter(x => x.item.status === "Completed").length, planned:rows.filter(x => x.item.status === "Planned").length };
  const onView = (t) => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter">
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px" }}>My Library</h1>
        <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>Track progress, saved links, and status updates</p>
      </div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))", gap:10, marginBottom:24 }}>
        {[["Total",stats.total,"#a855f7"],["Active",stats.active,"#22d3ee"],["Completed",stats.done,"#4ade80"],["Planned",stats.planned,"#fbbf24"]].map(([l,v,c], i) => (
          <GlassCard key={l} hover={false} style={{ padding:"18px 12px", textAlign:"center" }} delay={i * 60}>
            <p style={{ fontSize:28, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", color:c, margin:"0 0 2px", textShadow:`0 0 20px ${c}60` }}>{v}</p>
            <p style={{ fontSize:9, color:"#7a6b84", margin:0, letterSpacing:"0.15em" }}>{l.toUpperCase()}</p>
          </GlassCard>
        ))}
      </div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${tab===t ? "#a855f7" : "rgba(255,255,255,0.08)"}`, background: tab===t ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(109,40,217,0.15))" : "rgba(255,255,255,0.03)", color: tab===t ? "#d8b4fe" : "#7a6b84", transition:"all 0.25s", boxShadow: tab===t ? "0 0 10px rgba(168,85,247,0.25)" : "none" }}>{t}</button>
        ))}
      </div>
      {!rows.length ? (
        <GlassCard hover={false} style={{ padding:48, textAlign:"center" }}>
          <p style={{ fontSize:32, marginBottom:12 }}>◳</p>
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:20, color:"#d8b4fe", marginBottom:6 }}>Library is empty</p>
          <p style={{ fontSize:13, color:"#7a6b84", marginBottom:16 }}>Start adding titles from Discover</p>
          <Btn onClick={() => setPage("discover")}>Browse Titles</Btn>
        </GlassCard>
      ) : filtered.length === 0 ? (
        <p style={{ color:"#7a6b84", fontSize:13 }}>No titles match this filter.</p>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:12 }}>
          {filtered.map(({ item, title }, i) => {
            const c = typeColor(title.type);
            const pct = title.total ? Math.round((item.progress / title.total) * 100) : 0;
            return (
              <GlassCard key={title.id} style={{ padding:14, display:"flex", gap:12 }} delay={i * 50}>
                <img src={title.cover} alt={title.title} style={{ width:60, height:82, objectFit:"cover", borderRadius:10, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:15, color:"#f0ebff", margin:"0 0 4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title.title}</p>
                  <div style={{ display:"flex", gap:4, marginBottom:6 }}>
                    <Badge color={c}>{title.type}</Badge>
                    <Badge color="#8a7898">{item.status || "Watching"}</Badge>
                  </div>
                  <p style={{ fontSize:11, color:"#7a6b84", margin:"0 0 4px" }}>Progress: {item.progress} / {title.total}</p>
                  <ProgressBar pct={pct} color={c} />
                  {item.score && <p style={{ fontSize:11, color:"#fbbf24", margin:"4px 0 0" }}>★ {item.score}/10</p>}
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    <Btn small onClick={() => onView(title)}>Details</Btn>
                    <Btn small variant="ghost" onClick={() => setLib(removeItem(title.id, lib))} style={{ color:"#f87171" }}>Remove</Btn>
                    {item.link && <Btn small variant="cyan" onClick={() => window.open(item.link, "_blank")}>▶</Btn>}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Recommendations({ lib, setLib, setPage, setDetailTitle }) {
  const [mood, setMood] = useState("Action");
  const picks = useMemo(() => mockTitles.filter(t => t.genres.join(" ").toLowerCase().includes(mood.toLowerCase()) || mood === "OP MC").slice(0,8), [mood]);
  const onAdd = (t) => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = (t) => { setDetailTitle(t); setPage("detail"); };
  const getMatch = (t) => Math.min(99, 70 + Math.floor((t.rating - 7) * 8) + Math.floor(Math.random() * 8));

  return (
    <div className="page-enter">
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px" }}>For You</h1>
        <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>AI-powered recommendations based on your taste profile</p>
      </div>
      <GlassCard hover={false} style={{ padding:18, marginBottom:28 }} delay={0}>
        <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:12 }}>SELECT YOUR CURRENT MOOD</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {MOODS.map((m, i) => (
            <button key={m} onClick={() => setMood(m)} style={{ padding:"8px 18px", borderRadius:99, fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.05em", border:`1px solid ${mood===m ? "#a855f7" : "rgba(255,255,255,0.1)"}`, background: mood===m ? "linear-gradient(135deg,rgba(168,85,247,0.32),rgba(109,40,217,0.25))" : "rgba(255,255,255,0.03)", color: mood===m ? "#d8b4fe" : "#7a6b84", boxShadow: mood===m ? "0 0 16px rgba(168,85,247,0.35)" : "none", transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)", transform: mood===m ? "scale(1.05)" : "scale(1)" }}>{m}</button>
          ))}
        </div>
      </GlassCard>
      <SectionHeader title={`Top Picks · ${mood}`} sub="Sorted by compatibility with your watch history" delay={100} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:16 }}>
        {picks.map((t, i) => (
          <div key={t.id} style={{ opacity: 0, animation:`fadeSlideUp 0.4s ease ${i * 60}ms forwards` }}>
            <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.12),rgba(109,40,217,0.08))", border:"1px solid rgba(168,85,247,0.22)", borderRadius:"12px 12px 0 0", padding:"6px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:"#a855f7", fontWeight:700 }}>{getMatch(t)}% MATCH</span>
              <span style={{ fontSize:9, color:"#7a6b84" }}>✦ AI</span>
            </div>
            <div style={{ borderRadius:"0 0 16px 16px", overflow:"hidden" }}>
              <TitleCard title={t} lib={lib} onAdd={onAdd} onView={onView} />
            </div>
          </div>
        ))}
      </div>
      <GlassCard hover={false} style={{ padding:22, marginTop:28 }} delay={300}>
        <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>◎ AI REASONING</p>
        <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>
          These picks are matched to the <strong style={{ color:"#d8b4fe" }}>{mood}</strong> mood tag based on genre overlap, pacing analysis, and sentiment matching against your library. Titles with higher ratings and stronger genre alignment score higher.
        </p>
      </GlassCard>
    </div>
  );
}

function AIAssistant({ lib }) {
  const [messages, setMessages] = useState(getChat);
  const [text, setText] = useState("");
  const [spoiler, setSpoiler] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const prompts = ["Recommend something like Solo Leveling","What should I read next?","Best short completed anime?","Manhwa with OP MC","Compare AoT vs Death Note"];
  const recentTitles = lib.slice(0,3).map(x => mockTitles.find(t => t.id === x.id)?.title).filter(Boolean);

  const send = async (content) => {
    if (!content.trim() || loading) return;
    const newMessages = [...messages, { role:"user", content }];
    setMessages(newMessages);
    setText("");
    setLoading(true);
    try {
      const aiResponse = await aiService.chat({
        message: content,
        context: {
          spoiler_free: spoiler,
          recent_titles: recentTitles,
          library_size: lib.length,
        },
      });
      const reply = aiResponse?.data?.reply || "Error getting response.";
      const updated = [...newMessages, { role:"ai", content: reply }];
      setMessages(updated);
      saveChat(updated);
    } catch {
      const updated = [...newMessages, { role:"ai", content:"Connection error. Please try again." }];
      setMessages(updated);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  return (
    <div className="page-enter" style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:16, alignItems:"start" }}>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px" }}>AI Assistant</h1>
            <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>Powered by Claude · Your personal anime sage</p>
          </div>
          <button onClick={() => setSpoiler(v => !v)} style={{ padding:"8px 16px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${spoiler ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.12)"}`, background: spoiler ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.04)", color: spoiler ? "#22d3ee" : "#7a6b84", transition:"all 0.25s", boxShadow: spoiler ? "0 0 12px rgba(34,211,238,0.2)" : "none" }}>
            {spoiler ? "🛡 Spoiler-Free ON" : "⚠ Spoilers Allowed"}
          </button>
        </div>
        <GlassCard hover={false} style={{ padding:0, overflow:"hidden", marginBottom:12 }}>
          <div style={{ height:400, overflowY:"auto", padding:18, display:"flex", flexDirection:"column", gap:14 }}>
            {!messages.length && (
              <div style={{ textAlign:"center", paddingTop:48, opacity:0, animation:"fadeSlideUp 0.5s ease 0.2s forwards" }}>
                <div style={{ fontSize:52, marginBottom:14, filter:"drop-shadow(0 0 20px rgba(168,85,247,0.6))" }}>◎</div>
                <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:22, color:"#d8b4fe", marginBottom:6 }}>Aetheris is ready</p>
                <p style={{ fontSize:13, color:"#7a6b84" }}>Ask for recommendations, summaries, or anything anime/manga/manhwa</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex", gap:10, justifyContent: m.role === "user" ? "flex-end" : "flex-start", opacity:0, animation:`fadeSlideUp 0.3s ease forwards` }}>
                {m.role === "ai" && (
                  <div style={{ width:32, height:32, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#fff", fontWeight:800, flexShrink:0, boxShadow:"0 0 12px rgba(168,85,247,0.4)" }}>A</div>
                )}
                <div style={{ maxWidth:"78%", padding:"11px 15px", borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: m.role === "user" ? "rgba(6,182,212,0.13)" : "rgba(168,85,247,0.11)", border:`1px solid ${m.role === "user" ? "rgba(6,182,212,0.28)" : "rgba(168,85,247,0.22)"}`, fontSize:13, color:"#e2d9f3", lineHeight:1.7 }}>
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div style={{ width:32, height:32, borderRadius:99, background:"rgba(6,182,212,0.18)", border:"1px solid rgba(6,182,212,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#22d3ee", fontWeight:800, flexShrink:0 }}>B</div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#fff", fontWeight:800 }}>A</div>
                <div style={{ padding:"11px 15px", borderRadius:"4px 16px 16px 16px", background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", fontSize:13, display:"flex", gap:6, alignItems:"center" }}>
                  <span className="dot-1" style={{ width:6, height:6, borderRadius:99, background:"#a855f7", display:"inline-block" }} />
                  <span className="dot-2" style={{ width:6, height:6, borderRadius:99, background:"#a855f7", display:"inline-block" }} />
                  <span className="dot-3" style={{ width:6, height:6, borderRadius:99, background:"#a855f7", display:"inline-block" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding:"0 16px 10px", display:"flex", flexWrap:"wrap", gap:6, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            {prompts.map(p => (
              <button key={p} onClick={() => send(p)} style={{ padding:"5px 12px", borderRadius:99, fontSize:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", color:"#8a7898", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = "rgba(168,85,247,0.4)"; e.target.style.color = "#d8b4fe"; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.color = "#8a7898"; }}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ padding:"10px 16px 16px", display:"flex", gap:8 }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send(text)} placeholder="Ask Aetheris anything…"
              style={{ flex:1, padding:"12px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, color:"#f0ebff", fontSize:13, fontFamily:"inherit", outline:"none", transition:"border 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
            <Btn onClick={() => send(text)} disabled={!text.trim() || loading}>Send</Btn>
          </div>
        </GlassCard>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <GlassCard hover={false} style={{ padding:18 }} delay={100}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>YOUR CONTEXT</p>
          <p style={{ fontSize:11, color:"#7a6b84", marginBottom:6 }}>Library titles:</p>
          {recentTitles.length ? recentTitles.map(t => <p key={t} style={{ fontSize:12, color:"#d8b4fe", margin:"2px 0" }}>· {t}</p>) : <p style={{ fontSize:12, color:"#7a6b84" }}>No tracked titles yet</p>}
        </GlassCard>
        <GlassCard hover={false} style={{ padding:18 }} delay={150}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>AI STATUS</p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span className="status-dot" style={{ width:8, height:8, borderRadius:99, background:"#4ade80", display:"block" }} />
            <span style={{ fontSize:12, color:"#4ade80" }}>Connected to Claude</span>
          </div>
          <p style={{ fontSize:11, color:"#7a6b84", marginTop:6 }}>Powered by Claude Sonnet</p>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:18 }} delay={200}>
          <p style={{ fontSize:10, color:"#fbbf24", fontWeight:700, letterSpacing:"0.15em", marginBottom:8 }}>TIPS</p>
          <p style={{ fontSize:11, color:"#7a6b84", lineHeight:1.7 }}>Try: "What makes Solo Leveling's art style unique?" or "Recommend something with slow-burn romance."</p>
        </GlassCard>
        {messages.length > 0 && <Btn variant="ghost" small onClick={() => { setMessages([]); saveChat([]); }}>Clear Chat</Btn>}
      </div>
    </div>
  );
}

function Settings() {
  const [theme, setTheme] = useState("Ink Dark");
  const [notif, setNotif] = useState(true);
  const [spoiler, setSpoiler] = useState(true);
  const [genres, setGenres] = useState(["Action","Fantasy"]);
  const ALL_GENRES = ["Action","Fantasy","Romance","Dark","Comedy","Thriller","Sports","Drama","Supernatural","Smart Plot"];
  const toggleGenre = (g) => setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width:44, height:24, borderRadius:99, background: on ? "linear-gradient(135deg,#a855f7,#6d28d9)" : "rgba(255,255,255,0.1)", cursor:"pointer", position:"relative", transition:"all 0.3s", flexShrink:0, boxShadow: on ? "0 0 12px rgba(168,85,247,0.4)" : "none" }}>
      <div style={{ position:"absolute", top:3, left: on ? "calc(100% - 21px)" : 3, width:18, height:18, borderRadius:99, background:"#fff", transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
    </div>
  );

  return (
    <div className="page-enter">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:34, color:"#f0ebff", margin:"0 0 4px" }}>Settings</h1>
        <p style={{ fontSize:13, color:"#7a6b84", margin:0 }}>Personalise your Point Window experience</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <GlassCard hover={false} style={{ padding:22 }} delay={0}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>PROFILE</p>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:64, height:64, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", boxShadow:"0 0 24px rgba(168,85,247,0.5)" }}>B</div>
            <div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:20, color:"#f0ebff", margin:"0 0 2px" }}>Bikram</p>
              <p style={{ fontSize:12, color:"#7a6b84", margin:"0 0 10px" }}>Otaku Sage 🔮</p>
              <Btn small variant="ghost">Edit Profile</Btn>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={80}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>PREFERENCES</p>
          {[["Notifications","Get reminded to continue titles", notif, ()=>setNotif(v=>!v)],["Spoiler-Free Mode","Hide spoilers in AI responses", spoiler, ()=>setSpoiler(v=>!v)]].map(([label,desc,on,fn]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <p style={{ fontSize:13, color:"#e2d9f3", margin:"0 0 2px", fontWeight:600 }}>{label}</p>
                <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{desc}</p>
              </div>
              <Toggle on={on} onToggle={fn} />
            </div>
          ))}
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={160}>
          <p style={{ fontSize:10, color:"#fbbf24", fontWeight:700, letterSpacing:"0.15em", marginBottom:14 }}>FAVORITE GENRES</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {ALL_GENRES.map(g => (
              <button key={g} onClick={() => toggleGenre(g)} style={{ padding:"7px 14px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${genres.includes(g) ? "#fbbf24" : "rgba(255,255,255,0.1)"}`, background: genres.includes(g) ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.03)", color: genres.includes(g) ? "#fbbf24" : "#7a6b84", transition:"all 0.25s", boxShadow: genres.includes(g) ? "0 0 10px rgba(251,191,36,0.25)" : "none" }}>{g}</button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function TitleDetail({ title, lib, setLib, setPage }) {
  const [form, setForm] = useState(() => {
    const item = lib.find(x => x.id === title.id);
    return item || { status:"Planning", progress:0, score:"", notes:"", link:"" };
  });
  const [saved, setSaved] = useState("");
  const c = typeColor(title.type);
  const pct = title.total ? Math.round(((form.progress || 0) / title.total) * 100) : 0;
  const similar = mockTitles.filter(t => t.id !== title.id && (t.type === title.type || t.genres.some(g => title.genres.includes(g)))).slice(0, 6);

  const save = () => {
    setLib(upsertItem({ id:title.id, ...form }, lib));
    setSaved("✓ Saved to library!");
    setTimeout(() => setSaved(""), 2500);
  };
  const complete = () => {
    const updated = { ...form, status:"Completed", progress:title.total };
    setForm(updated);
    setLib(upsertItem({ id:title.id, ...updated }, lib));
    setSaved("✓ Marked as Completed!");
    setTimeout(() => setSaved(""), 2500);
  };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <button onClick={() => setPage("discover")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#7a6b84", cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:0, transition:"color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "#d8b4fe"}
        onMouseLeave={e => e.target.style.color = "#7a6b84"}>
        ← Back to Discover
      </button>
      <div style={{ borderRadius:24, overflow:"hidden", position:"relative", minHeight:260 }}>
        <img src={title.banner} alt={title.title} style={{ width:"100%", height:290, objectFit:"cover" }} className="hero-img" />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.6) 60%, transparent 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:26, display:"flex", gap:22, alignItems:"flex-end" }}>
          <img src={title.cover} alt={title.title} style={{ width:106, height:148, objectFit:"cover", borderRadius:14, border:`2px solid ${c}60`, flexShrink:0, boxShadow:`0 12px 32px ${typeGlow(title.type)}` }} />
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:32, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.05 }}>{title.title}</h1>
            <p style={{ fontSize:12, color:"#7a6b84", margin:"0 0 10px" }}>{title.alt} · {title.year}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
              <Badge color={c}>{title.type}</Badge>
              <Badge color={title.status === "Ongoing" ? "#4ade80" : "#8a7898"}>{title.status}</Badge>
              {title.genres.slice(0,3).map(g => <GenrePill key={g} genre={g} />)}
            </div>
            <StarRating value={title.rating} />
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
        <GlassCard hover={false} style={{ padding:22 }} delay={50}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>SYNOPSIS</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.synopsis}</p>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:22 }} delay={100}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>◎ AI REASON</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.reason}</p>
          <div style={{ marginTop:14 }}><Badge color="#22d3ee">AI Recommended</Badge></div>
        </GlassCard>
      </div>

      <GlassCard hover={false} style={{ padding:22 }} delay={150}>
        <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:18 }}>MY PROGRESS</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12, marginBottom:16 }}>
          {[
            { label:"Status", content: <select value={form.status} onChange={e => setForm({...form, status:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#d8b4fe", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none" }}>{["Planning","Watching","Reading","Completed","Dropped"].map(s => <option key={s}>{s}</option>)}</select> },
            { label:`Current ${title.type === "Anime" ? "Episode" : "Chapter"} (of ${title.total})`, content: <input type="number" min={0} max={title.total} value={form.progress} onChange={e => setForm({...form, progress:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
            { label:"Personal Score (1-10)", content: <input type="number" min={1} max={10} value={form.score} onChange={e => setForm({...form, score:e.target.value})} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#fbbf24", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
            { label:"Watch/Read Link", content: <input value={form.link} onChange={e => setForm({...form, link:e.target.value})} placeholder="Paste your streaming link" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box" }} /> },
          ].map(({ label, content }) => (
            <label key={label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <span style={{ fontSize:11, color:"#7a6b84" }}>{label}</span>
              {content}
            </label>
          ))}
        </div>
        <label style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
          <span style={{ fontSize:11, color:"#7a6b84" }}>Notes</span>
          <textarea value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="Track thoughts, key moments, reminders…" style={{ padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", minHeight:72, resize:"vertical", outline:"none" }} />
        </label>
        <ProgressBar pct={pct} color={c} />
        <p style={{ fontSize:11, color:"#7a6b84", margin:"8px 0 16px" }}>{form.progress || 0} / {title.total} · {pct}% complete</p>
        {saved && <p style={{ fontSize:12, color:"#4ade80", marginBottom:12, opacity:0, animation:"fadeSlideUp 0.3s ease forwards" }}>{saved}</p>}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          <Btn onClick={save}>Save Progress</Btn>
          <Btn variant="ghost" onClick={complete}>Mark Completed</Btn>
          {form.link && <Btn variant="cyan" onClick={() => window.open(form.link, "_blank")}>▶ Open Link</Btn>}
        </div>
      </GlassCard>

      <section>
        <SectionHeader title="Similar Titles" sub={`More ${title.type} you might enjoy`} delay={200} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 }}>
          {similar.map((s, i) => (
            <GlassCard key={s.id} style={{ padding:12, cursor:"pointer" }} delay={i * 50 + 220}>
              <img src={s.cover} alt={s.title} style={{ width:"100%", height:100, objectFit:"cover", borderRadius:10, marginBottom:10 }} />
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:13, color:"#f0ebff", margin:"0 0 2px" }}>{s.title}</p>
              <p style={{ fontSize:10, color:"#7a6b84", margin:0 }}>{s.type} · ★{s.rating}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Main App Shell ────────────────────────────────────────────────────────────
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

        /* ── Ambient orbs ── */
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

        /* ── Noise overlay ── */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── Page enter animation ── */
        .page-enter {
          opacity: 0;
          animation: pageEnter 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Fade slide up ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeSlideUp 0.3s ease forwards;
        }

        /* ── Hero banner hover ── */
        .hero-banner { transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
        .hero-banner:hover { transform: scale(1.005); }
        .hero-img { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .hero-banner:hover .hero-img { transform: scale(1.04); }

        /* ── Hero shimmer ── */
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

        /* ── Typing dots ── */
        .dot-1, .dot-2, .dot-3 { animation: dotBounce 1.4s ease-in-out infinite; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }

        /* ── Status dot ── */
        .status-dot {
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }

        /* ── Sidebar nav item hover ── */
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

        /* ── Sidebar active indicator ── */
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

        /* ── Logo glow pulse ── */
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 24px rgba(168,85,247,0.7), 0 0 40px rgba(168,85,247,0.2); }
        }
        .logo-icon { animation: logoPulse 3s ease-in-out infinite; }

        /* ── User badge hover ── */
        .user-badge { transition: all 0.2s; }
        .user-badge:hover { transform: translateX(2px); }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#080610", fontFamily:"'Noto Sans JP', sans-serif", color:"#e2d9f3", position:"relative" }}>
        <AmbientBg />

        {/* Sidebar */}
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
              <div className="logo-icon" style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>⊕</div>
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
              <p style={{ fontSize:10, color:"#6b5b78", margin:0 }}>Otaku Sage 🔮</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ marginLeft:226, flex:1, padding:"32px 32px 48px", position:"relative", zIndex:1, minHeight:"100vh" }}>
          {renderPage()}
        </main>

        {/* Mobile Bottom Nav */}
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
      </div>
    </>
  );
}
