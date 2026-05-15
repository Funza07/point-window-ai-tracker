import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
  { id:"dashboard", label:"Home",      icon:"⊞" },
  { id:"discover",  label:"Discover",  icon:"◈" },
  { id:"library",   label:"Library",   icon:"◳" },
  { id:"recommendations", label:"For You", icon:"✦" },
  { id:"ai",        label:"AI",        icon:"◎" },
];
const NAV_FULL = [...NAV, { id:"settings", label:"Settings", icon:"⚙" }];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getLib  = () => { try { return JSON.parse(localStorage.getItem("pw_lib")  || "[]"); } catch { return []; } };
const saveLib = l  => localStorage.setItem("pw_lib",  JSON.stringify(l));
const getChat = () => { try { return JSON.parse(localStorage.getItem("pw_chat") || "[]"); } catch { return []; } };
const saveChat = c => localStorage.setItem("pw_chat", JSON.stringify(c));
const upsertItem = (item, lib) => { const n = lib.filter(x => x.id !== item.id); n.unshift(item); saveLib(n); return n; };
const removeItem = (id,   lib) => { const n = lib.filter(x => x.id !== id);       saveLib(n); return n; };
const typeColor = t => t==="Anime"?"#e879f9":t==="Manga"?"#38bdf8":"#a78bfa";
const typeGlow  = t => t==="Anime"?"rgba(232,121,249,0.4)":t==="Manga"?"rgba(56,189,248,0.4)":"rgba(167,139,250,0.4)";

// ─── useIsMobile ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mob;
}

// ─── AmbientBg ────────────────────────────────────────────────────────────────
function AmbientBg() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      <div className="noise-overlay" />
    </div>
  );
}

// ─── Badge / GenrePill / StarRating / ProgressBar ────────────────────────────
function Badge({ children, color }) {
  return <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:`${color}20`, color, border:`1px solid ${color}50`, boxShadow:`0 0 8px ${color}25` }}>{children}</span>;
}
function GenrePill({ genre }) {
  return <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:6, fontSize:10, color:"#9d8aac", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }}>{genre}</span>;
}
function StarRating({ value }) {
  return <span style={{ color:"#fbbf24", fontSize:12, letterSpacing:1 }}>{"★".repeat(Math.round(value/2))}{"☆".repeat(5-Math.round(value/2))}<span style={{ color:"#8a7898", marginLeft:5, fontSize:11 }}>{value}</span></span>;
}
function ProgressBar({ pct, color="#a855f7" }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 120); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg,${color}99,${color})`, borderRadius:99, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 6px ${color}55` }} />
    </div>
  );
}

// ─── GlassCard ────────────────────────────────────────────────────────────────
function GlassCard({ children, style={}, onClick, hover=true, delay=0 }) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov&&hover ? "rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)", backdropFilter:"blur(24px)", border:`1px solid ${hov&&hover?"rgba(168,85,247,0.4)":"rgba(255,255,255,0.07)"}`, borderRadius:18, transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: hov&&hover?"0 8px 40px rgba(168,85,247,0.16)":"0 2px 12px rgba(0,0,0,0.3)", cursor: onClick?"pointer":"default", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(12px)", ...style }}>
      {children}
    </div>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", small=false, disabled=false, style={} }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const base = { display:"inline-flex", alignItems:"center", gap:6, border:"none", cursor: disabled?"not-allowed":"pointer", borderRadius:12, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.04em", transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)", opacity: disabled?0.45:1, padding: small?"6px 16px":"11px 24px", fontSize: small?12:13, transform: press&&!disabled?"scale(0.95)":hov&&!disabled?"translateY(-1px)":"none", WebkitTapHighlightColor:"transparent", ...style };
  const ev = { onMouseEnter:()=>setHov(true), onMouseLeave:()=>{setHov(false);setPress(false);}, onMouseDown:()=>setPress(true), onMouseUp:()=>setPress(false), onTouchStart:()=>setPress(true), onTouchEnd:()=>setPress(false) };
  if (variant==="primary") return <button onClick={!disabled?onClick:undefined} {...ev} style={{ ...base, background:hov?"linear-gradient(135deg,#c026d3,#7c3aed)":"linear-gradient(135deg,#a855f7,#6d28d9)", color:"#fff", boxShadow:hov?"0 0 22px rgba(168,85,247,0.65)":"0 0 12px rgba(168,85,247,0.35)" }}>{children}</button>;
  if (variant==="cyan")    return <button onClick={!disabled?onClick:undefined} {...ev} style={{ ...base, background:hov?"rgba(6,182,212,0.22)":"rgba(6,182,212,0.1)", color:"#22d3ee", border:"1px solid rgba(6,182,212,0.45)", boxShadow:hov?"0 0 16px rgba(6,182,212,0.4)":"none" }}>{children}</button>;
  return <button onClick={!disabled?onClick:undefined} {...ev} style={{ ...base, background:hov?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.05)", color:"#c4b5d0", border:"1px solid rgba(255,255,255,0.11)" }}>{children}</button>;
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:48, height:26, borderRadius:99, background: on?"linear-gradient(135deg,#a855f7,#6d28d9)":"rgba(255,255,255,0.1)", cursor:"pointer", position:"relative", transition:"all 0.3s", flexShrink:0, boxShadow: on?"0 0 12px rgba(168,85,247,0.4)":"none", WebkitTapHighlightColor:"transparent" }}>
      <div style={{ position:"absolute", top:3, left: on?"calc(100% - 23px)":3, width:20, height:20, borderRadius:99, background:"#fff", transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action, delay=0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14, opacity: vis?1:0, transform: vis?"translateX(0)":"translateX(-8px)", transition:"all 0.4s ease" }}>
      <div>
        <h2 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:18, color:"#f0ebff", margin:"0 0 2px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:18, height:2, background:"linear-gradient(90deg,#a855f7,transparent)", display:"block", flexShrink:0 }} />{title}
        </h2>
        {sub && <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{sub}</p>}
      </div>
      {action && <button onClick={action.fn} style={{ background:"none", border:"none", color:"#a855f7", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700, letterSpacing:"0.05em", WebkitTapHighlightColor:"transparent" }}>{action.label}</button>}
    </div>
  );
}

// ─── HorizontalScroll (touch-swipeable row) ───────────────────────────────────
function HScrollRow({ children, gap=12 }) {
  return (
    <div style={{ display:"flex", gap, overflowX:"auto", paddingBottom:8, scrollSnapType:"x mandatory", WebkitOverflowScrolling:"touch", msOverflowStyle:"none", scrollbarWidth:"none" }}
      className="hide-scrollbar">
      {children}
    </div>
  );
}

// ─── TitleCard ────────────────────────────────────────────────────────────────
function TitleCard({ title, lib, onAdd, onView, delay=0, width }) {
  const inLib = lib.some(x => x.id === title.id);
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const c = typeColor(title.type);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:16, overflow:"hidden", background: hov?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.025)", border:`1px solid ${hov?c+"55":"rgba(255,255,255,0.07)"}`, transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)", boxShadow: hov?`0 16px 48px ${typeGlow(title.type)}`:"0 4px 16px rgba(0,0,0,0.4)", transform: hov?"translateY(-5px) scale(1.01)":vis?"translateY(0)":"translateY(16px)", opacity: vis?1:0, backdropFilter:"blur(16px)", flexShrink:0, width: width||"auto", scrollSnapAlign:"start", WebkitTapHighlightColor:"transparent" }}>
      <div style={{ position:"relative", height:190, overflow:"hidden" }}>
        <img src={title.cover} alt={title.title} style={{ width:"100%", height:"100%", objectFit:"cover", transform: hov?"scale(1.08)":"scale(1)", transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.15) 55%, transparent 100%)" }} />
        <div style={{ position:"absolute", top:9, left:9 }}><Badge color={c}>{title.type}</Badge></div>
        {inLib && <div style={{ position:"absolute", top:9, right:9, background:"rgba(6,182,212,0.18)", border:"1px solid rgba(6,182,212,0.5)", borderRadius:99, padding:"2px 8px", fontSize:9, color:"#22d3ee", fontWeight:700, backdropFilter:"blur(8px)" }}>✓ SAVED</div>}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 100%,${c}12 0%,transparent 60%)`, opacity: hov?1:0, transition:"opacity 0.3s" }} />
        <div style={{ position:"absolute", bottom:8, left:10, right:10 }}>
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:14, color:"#f0ebff", margin:0, lineHeight:1.2 }}>{title.title}</p>
        </div>
      </div>
      <div style={{ padding:"10px 12px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
          <StarRating value={title.rating} />
          <span style={{ fontSize:10, color:"#7a6b84" }}>{title.year}</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
          {title.genres.slice(0,2).map(g => <GenrePill key={g} genre={g} />)}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <Btn small onClick={()=>onView(title)} variant="ghost" style={{ flex:1, justifyContent:"center" }}>Details</Btn>
          <Btn small onClick={()=>!inLib&&onAdd(title)} disabled={inLib} variant={inLib?"ghost":"primary"} style={{ flex:1, justifyContent:"center" }}>{inLib?"Saved ✓":"+ Add"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── HeroCarousel ─────────────────────────────────────────────────────────────
function HeroCarousel({ items, onView, isMobile }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const touchStart = useRef(null);

  const go = useCallback(i => setIdx((i + items.length) % items.length), [items.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => go(idx + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [idx, go]);

  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(idx + (diff > 0 ? 1 : -1));
    touchStart.current = null;
  };

  const hero = items[idx];
  const c = typeColor(hero.type);

  return (
    <div style={{ position:"relative", borderRadius: isMobile?0:24, overflow:"hidden", minHeight: isMobile?480:360 }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* BG image */}
      <img key={hero.id} src={hero.banner} alt={hero.title}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"opacity 0.6s", animation:"heroFade 0.6s ease" }} />
      {/* Gradient overlays */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(8,6,15,0.96) 0%, rgba(8,6,15,0.6) 60%, rgba(8,6,15,0.3) 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 0% 100%, ${c}18 0%, transparent 55%)` }} />
      {/* Shimmer */}
      <div className="hero-shimmer" />

      {/* Content */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding: isMobile?"24px 20px 28px":"32px 36px 30px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <div style={{ width:28, height:2, background:`linear-gradient(90deg,${c},transparent)` }} />
          <span style={{ fontSize:9, color:c, fontWeight:700, letterSpacing:"0.2em" }}>FEATURED PICK</span>
        </div>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize: isMobile?30:42, fontWeight:900, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.05, textShadow:"0 2px 20px rgba(0,0,0,0.8)" }}>{hero.title}</h1>
        <p style={{ fontSize:11, color:"#7a6b84", margin:"0 0 10px" }}>{hero.alt} · {hero.year} · <Badge color={c}>{hero.type}</Badge></p>
        <p style={{ fontSize:13, color:"#c4b5d0", maxWidth: isMobile?"100%":500, margin:"0 0 20px", lineHeight:1.7, display: isMobile?"-webkit-box":undefined, WebkitLineClamp: isMobile?2:undefined, WebkitBoxOrient: isMobile?"vertical":undefined, overflow: isMobile?"hidden":undefined }}>{hero.synopsis}</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Btn onClick={()=>onView(hero)} style={{ minHeight:44 }}>View Details</Btn>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position:"absolute", bottom: isMobile?96:16, right:20, display:"flex", gap:6 }}>
        {items.map((_,i) => (
          <button key={i} onClick={()=>go(i)} style={{ width: i===idx?22:6, height:6, borderRadius:99, background: i===idx?c:"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.3s", padding:0, WebkitTapHighlightColor:"transparent" }} />
        ))}
      </div>

      {/* Desktop arrows */}
      {!isMobile && (
        <>
          <button onClick={()=>go(idx-1)} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:40, height:40, borderRadius:99, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.12)", color:"#f0ebff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>‹</button>
          <button onClick={()=>go(idx+1)} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", width:40, height:40, borderRadius:99, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.12)", color:"#f0ebff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>›</button>
        </>
      )}
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder="Search..." }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, color: focus?"#a855f7":"#6b5b78", transition:"color 0.2s", pointerEvents:"none" }}>⊕</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{ width:"100%", padding:"13px 42px", background: focus?"rgba(168,85,247,0.07)":"rgba(255,255,255,0.04)", border:`1px solid ${focus?"rgba(168,85,247,0.45)":"rgba(255,255,255,0.08)"}`, borderRadius:14, color:"#f0ebff", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", boxShadow: focus?"0 0 24px rgba(168,85,247,0.15)":"none", transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)", WebkitAppearance:"none" }} />
      {value && <button onClick={()=>onChange("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)", border:"none", borderRadius:99, width:22, height:22, color:"#a0899e", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>}
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Dashboard({ lib, setLib, setPage, setDetailTitle, isMobile }) {
  const [search, setSearch] = useState("");
  const heroTitles = [...mockTitles].sort((a,b)=>b.popularity-a.popularity).slice(0,5);
  const trending   = heroTitles;
  const continueItems = lib.slice(0,4).map(item=>({ item, title:mockTitles.find(t=>t.id===item.id) })).filter(x=>x.title);
  const searched = search ? mockTitles.filter(t=>`${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase().includes(search.toLowerCase())) : [];
  const onAdd  = t => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = t => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap: isMobile?0:28 }}>

      {/* ── Mobile: full-bleed hero carousel right at top ── */}
      {isMobile && (
        <div style={{ margin:"0 -16px" }}>
          <HeroCarousel items={heroTitles} onView={onView} isMobile={true} />
        </div>
      )}

      {/* ── Search (below hero on mobile, at top on desktop) ── */}
      <div style={{ padding: isMobile?"16px 0 0":0}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search anime, manga, manhwa…" />
      </div>

      {/* Search results */}
      {search && (
        <div className="fade-in">
          <p style={{ fontSize:10, color:"#7a6b84", marginBottom:12, letterSpacing:"0.12em" }}>RESULTS FOR "{search.toUpperCase()}" · {searched.length} found</p>
          {searched.length === 0
            ? <GlassCard hover={false} style={{ padding:28, textAlign:"center" }}><p style={{ color:"#7a6b84", fontSize:13, margin:0 }}>No titles found</p></GlassCard>
            : isMobile
              ? <HScrollRow gap={12}>{searched.slice(0,8).map((t,i)=><TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i*40} width={148} />)}</HScrollRow>
              : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:14 }}>{searched.slice(0,8).map((t,i)=><TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i*40} />)}</div>
          }
        </div>
      )}

      {/* ── Desktop hero ── */}
      {!search && !isMobile && (
        <HeroCarousel items={heroTitles} onView={onView} isMobile={false} />
      )}

      {/* Continue Watching */}
      {!search && continueItems.length > 0 && (
        <section style={{ paddingTop: isMobile?20:0 }}>
          <SectionHeader title="Continue Watching" sub="Pick up where you left off" action={{ label:"Library →", fn:()=>setPage("library") }} delay={80} />
          {isMobile
            ? <HScrollRow gap={12}>{continueItems.map(({ item, title },i) => (
                <GlassCard key={title.id} style={{ padding:12, display:"flex", gap:10, minWidth:260, flexShrink:0, scrollSnapAlign:"start" }} delay={i*60+80}>
                  <img src={title.cover} alt={title.title} style={{ width:48, height:66, objectFit:"cover", borderRadius:8, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:14, color:"#f0ebff", margin:"0 0 4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title.title}</p>
                    <Badge color={typeColor(title.type)}>{title.type}</Badge>
                    <p style={{ fontSize:10, color:"#7a6b84", margin:"5px 0 3px" }}>Ep/Ch {item.progress}</p>
                    <ProgressBar pct={title.total?Math.round((item.progress/title.total)*100):0} color={typeColor(title.type)} />
                    <Btn small onClick={()=>onView(title)} style={{ marginTop:8, width:"100%", justifyContent:"center" }}>Continue</Btn>
                  </div>
                </GlassCard>
              ))}</HScrollRow>
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
                {continueItems.map(({ item, title },i) => (
                  <GlassCard key={title.id} style={{ padding:14, display:"flex", gap:12 }} delay={i*60+80}>
                    <img src={title.cover} alt={title.title} style={{ width:52, height:72, objectFit:"cover", borderRadius:10, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:15, color:"#f0ebff", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title.title}</p>
                      <Badge color={typeColor(title.type)}>{title.type}</Badge>
                      <p style={{ fontSize:11, color:"#7a6b84", margin:"5px 0 4px" }}>{item.status} · Ep/Ch {item.progress}</p>
                      <ProgressBar pct={title.total?Math.round((item.progress/title.total)*100):0} color={typeColor(title.type)} />
                      <div style={{ marginTop:8, display:"flex", gap:6 }}>
                        <Btn small onClick={()=>onView(title)}>Continue</Btn>
                        {item.link && <Btn small variant="cyan" onClick={()=>window.open(item.link,"_blank")}>▶ Link</Btn>}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
          }
        </section>
      )}

      {/* Trending Now */}
      {!search && (
        <section style={{ paddingTop: isMobile?20:0 }}>
          <SectionHeader title="Trending Now" sub="Most-followed this season" delay={140} />
          <HScrollRow gap={10}>
            {trending.map((t,i) => (
              <GlassCard key={t.id} onClick={()=>onView(t)} style={{ padding:"12px 14px", textAlign:"center", flexShrink:0, minWidth:96, scrollSnapAlign:"start" }} delay={i*40+160}>
                <div style={{ width:30, height:30, borderRadius:99, background:`${typeColor(t.type)}22`, border:`1px solid ${typeColor(t.type)}44`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", fontSize:11, fontWeight:800, color:typeColor(t.type) }}>#{i+1}</div>
                <p style={{ fontSize:11, fontWeight:700, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.2, whiteSpace:"nowrap" }}>{t.title}</p>
                <p style={{ fontSize:9, color:"#7a6b84", margin:0 }}>{t.type}</p>
              </GlassCard>
            ))}
          </HScrollRow>
        </section>
      )}

      {/* Recommended */}
      {!search && (
        <section style={{ paddingTop: isMobile?20:0, paddingBottom: isMobile?90:0 }}>
          <SectionHeader title="Recommended For You" sub="AI-curated picks" action={{ label:"See all →", fn:()=>setPage("recommendations") }} delay={200} />
          {isMobile
            ? <HScrollRow gap={12}>{mockTitles.slice(4,10).map((t,i)=><TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i*50+220} width={148} />)}</HScrollRow>
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:14 }}>{mockTitles.slice(4,8).map((t,i)=><TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i*60+230} />)}</div>
          }
        </section>
      )}
    </div>
  );
}

function Discover({ lib, setLib, setPage, setDetailTitle, isMobile }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Popularity");
  const FILTERS = ["All","Anime","Manga","Manhwa","Ongoing","Completed"];
  const list = useMemo(() => {
    let out = mockTitles.filter(t=>`${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    if (["Anime","Manga","Manhwa"].includes(filter)) out=out.filter(t=>t.type===filter);
    if (["Ongoing","Completed"].includes(filter)) out=out.filter(t=>t.status===filter);
    if (sort==="Popularity") out=[...out].sort((a,b)=>b.popularity-a.popularity);
    if (sort==="Rating")     out=[...out].sort((a,b)=>b.rating-a.rating);
    if (sort==="Latest")     out=[...out].sort((a,b)=>b.year-a.year);
    return out;
  }, [search, filter, sort]);
  const onAdd  = t => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = t => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile?90:0 }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?28:34, color:"#f0ebff", margin:"0 0 4px" }}>Discover</h1>
        <p style={{ fontSize:12, color:"#7a6b84", margin:0 }}>Browse the full catalogue</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search titles…" />
      {/* Filters */}
      <div style={{ marginTop:14, marginBottom:10 }}>
        <HScrollRow gap={8}>
          {FILTERS.map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"9px 16px", borderRadius:99, fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${filter===f?"#a855f7":"rgba(255,255,255,0.09)"}`, background: filter===f?"linear-gradient(135deg,rgba(168,85,247,0.28),rgba(109,40,217,0.18))":"rgba(255,255,255,0.03)", color: filter===f?"#d8b4fe":"#7a6b84", transition:"all 0.25s", boxShadow: filter===f?"0 0 12px rgba(168,85,247,0.3)":"none", flexShrink:0, whiteSpace:"nowrap", WebkitTapHighlightColor:"transparent", minHeight:42 }}>{f}</button>
          ))}
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:"9px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:99, color:"#c4b5d0", fontSize:12, fontFamily:"inherit", cursor:"pointer", outline:"none", flexShrink:0, minHeight:42 }}>
            <option>Popularity</option><option>Rating</option><option>Latest</option>
          </select>
        </HScrollRow>
      </div>
      <p style={{ fontSize:10, color:"#7a6b84", marginBottom:16, letterSpacing:"0.1em" }}>{list.length} TITLES</p>
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(auto-fill,minmax(140px,1fr))":"repeat(auto-fill,minmax(155px,1fr))", gap: isMobile?12:16 }}>
        {list.map((t,i)=><TitleCard key={t.id} title={t} lib={lib} onAdd={onAdd} onView={onView} delay={i*30} />)}
      </div>
    </div>
  );
}

function Library({ lib, setLib, setPage, setDetailTitle, isMobile }) {
  const [tab, setTab] = useState("All");
  const TABS = ["All","Watching","Reading","Completed","Planned","Dropped"];
  const rows = lib.map(item=>({ item, title:mockTitles.find(t=>t.id===item.id) })).filter(x=>x.title);
  const filtered = rows.filter(({ item, title }) => tab==="All" || title.type===tab || item.status?.toLowerCase()===tab.toLowerCase());
  const stats = { total:rows.length, active:rows.filter(x=>["Watching","Reading"].includes(x.item.status)).length, done:rows.filter(x=>x.item.status==="Completed").length, planned:rows.filter(x=>x.item.status==="Planned").length };
  const onView = t => { setDetailTitle(t); setPage("detail"); };

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile?90:0 }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?28:34, color:"#f0ebff", margin:"0 0 4px" }}>My Library</h1>
        <p style={{ fontSize:12, color:"#7a6b84", margin:0 }}>Track your progress</p>
      </div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[["Total",stats.total,"#a855f7"],["Active",stats.active,"#22d3ee"],["Done",stats.done,"#4ade80"],["Planned",stats.planned,"#fbbf24"]].map(([l,v,c],i) => (
          <GlassCard key={l} hover={false} style={{ padding: isMobile?"12px 8px":"16px 12px", textAlign:"center" }} delay={i*60}>
            <p style={{ fontSize: isMobile?22:26, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", color:c, margin:"0 0 2px", textShadow:`0 0 16px ${c}55` }}>{v}</p>
            <p style={{ fontSize: isMobile?9:10, color:"#7a6b84", margin:0, letterSpacing:"0.1em" }}>{l}</p>
          </GlassCard>
        ))}
      </div>
      {/* Tabs */}
      <HScrollRow gap={6}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"9px 14px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${tab===t?"#a855f7":"rgba(255,255,255,0.08)"}`, background: tab===t?"linear-gradient(135deg,rgba(168,85,247,0.25),rgba(109,40,217,0.15))":"rgba(255,255,255,0.03)", color: tab===t?"#d8b4fe":"#7a6b84", transition:"all 0.25s", flexShrink:0, whiteSpace:"nowrap", boxShadow: tab===t?"0 0 10px rgba(168,85,247,0.25)":"none", WebkitTapHighlightColor:"transparent", minHeight:42 }}>{t}</button>
        ))}
      </HScrollRow>
      <div style={{ marginTop:16 }}>
        {!rows.length ? (
          <GlassCard hover={false} style={{ padding:48, textAlign:"center" }}>
            <p style={{ fontSize:32, marginBottom:12 }}>◳</p>
            <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:18, color:"#d8b4fe", marginBottom:6 }}>Library is empty</p>
            <p style={{ fontSize:12, color:"#7a6b84", marginBottom:16 }}>Add titles from Discover</p>
            <Btn onClick={()=>setPage("discover")}>Browse Titles</Btn>
          </GlassCard>
        ) : filtered.length===0 ? <p style={{ color:"#7a6b84", fontSize:13 }}>No titles match this filter.</p>
        : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(({ item, title },i) => {
              const c = typeColor(title.type);
              const pct = title.total?Math.round((item.progress/title.total)*100):0;
              return (
                <GlassCard key={title.id} style={{ padding:14, display:"flex", gap:12 }} delay={i*40}>
                  <img src={title.cover} alt={title.title} style={{ width: isMobile?52:60, height: isMobile?72:82, objectFit:"cover", borderRadius:10, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:14, color:"#f0ebff", margin:"0 0 4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title.title}</p>
                    <div style={{ display:"flex", gap:4, marginBottom:5, flexWrap:"wrap" }}>
                      <Badge color={c}>{title.type}</Badge>
                      <Badge color="#8a7898">{item.status||"Watching"}</Badge>
                    </div>
                    <p style={{ fontSize:11, color:"#7a6b84", margin:"0 0 4px" }}>{item.progress}/{title.total}</p>
                    <ProgressBar pct={pct} color={c} />
                    <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                      <Btn small onClick={()=>onView(title)}>Details</Btn>
                      <Btn small variant="ghost" onClick={()=>setLib(removeItem(title.id,lib))} style={{ color:"#f87171" }}>Remove</Btn>
                      {item.link && <Btn small variant="cyan" onClick={()=>window.open(item.link,"_blank")}>▶</Btn>}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Recommendations({ lib, setLib, setPage, setDetailTitle, isMobile }) {
  const [mood, setMood] = useState("Action");
  const picks = useMemo(() => mockTitles.filter(t=>t.genres.join(" ").toLowerCase().includes(mood.toLowerCase())||mood==="OP MC").slice(0,8), [mood]);
  const onAdd  = t => setLib(upsertItem({ id:t.id, status:"Watching", progress:0, score:"", notes:"", link:"" }, lib));
  const onView = t => { setDetailTitle(t); setPage("detail"); };
  const getMatch = t => Math.min(99, 70+Math.floor((t.rating-7)*8)+Math.floor(Math.random()*6));

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile?90:0 }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?28:34, color:"#f0ebff", margin:"0 0 4px" }}>For You</h1>
        <p style={{ fontSize:12, color:"#7a6b84", margin:0 }}>AI-powered picks for your taste</p>
      </div>
      <GlassCard hover={false} style={{ padding:16, marginBottom:24 }} delay={0}>
        <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:12 }}>YOUR CURRENT MOOD</p>
        <HScrollRow gap={8}>
          {MOODS.map(m=>(
            <button key={m} onClick={()=>setMood(m)} style={{ padding:"10px 18px", borderRadius:99, fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${mood===m?"#a855f7":"rgba(255,255,255,0.1)"}`, background: mood===m?"linear-gradient(135deg,rgba(168,85,247,0.32),rgba(109,40,217,0.22))":"rgba(255,255,255,0.03)", color: mood===m?"#d8b4fe":"#7a6b84", boxShadow: mood===m?"0 0 16px rgba(168,85,247,0.35)":"none", transition:"all 0.25s", flexShrink:0, whiteSpace:"nowrap", transform: mood===m?"scale(1.05)":"scale(1)", WebkitTapHighlightColor:"transparent", minHeight:44 }}>{m}</button>
          ))}
        </HScrollRow>
      </GlassCard>
      <SectionHeader title={`Top Picks · ${mood}`} sub="Sorted by compatibility" delay={100} />
      {isMobile
        ? <HScrollRow gap={12}>{picks.map((t,i)=>(
            <div key={t.id} style={{ flexShrink:0, scrollSnapAlign:"start", opacity:0, animation:`fadeSlideUp 0.4s ease ${i*60}ms forwards` }}>
              <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.12),rgba(109,40,217,0.08))", border:"1px solid rgba(168,85,247,0.22)", borderRadius:"12px 12px 0 0", padding:"6px 10px", display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#a855f7", fontWeight:700 }}>{getMatch(t)}% MATCH</span>
                <span style={{ fontSize:9, color:"#7a6b84" }}>✦ AI</span>
              </div>
              <div style={{ borderRadius:"0 0 16px 16px", overflow:"hidden" }}>
                <TitleCard title={t} lib={lib} onAdd={onAdd} onView={onView} width={148} />
              </div>
            </div>
          ))}</HScrollRow>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:16 }}>
            {picks.map((t,i)=>(
              <div key={t.id} style={{ opacity:0, animation:`fadeSlideUp 0.4s ease ${i*60}ms forwards` }}>
                <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.12),rgba(109,40,217,0.08))", border:"1px solid rgba(168,85,247,0.22)", borderRadius:"12px 12px 0 0", padding:"6px 10px", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:10, color:"#a855f7", fontWeight:700 }}>{getMatch(t)}% MATCH</span>
                  <span style={{ fontSize:9, color:"#7a6b84" }}>✦ AI</span>
                </div>
                <div style={{ borderRadius:"0 0 16px 16px", overflow:"hidden" }}>
                  <TitleCard title={t} lib={lib} onAdd={onAdd} onView={onView} />
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

function AIAssistant({ lib, isMobile }) {
  const [messages, setMessages] = useState(getChat);
  const [text, setText] = useState("");
  const [spoiler, setSpoiler] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const prompts = ["Recommend like Solo Leveling","What should I read next?","Best short anime?","Manhwa with OP MC"];
  const recentTitles = lib.slice(0,3).map(x=>mockTitles.find(t=>t.id===x.id)?.title).filter(Boolean);

  const send = async content => {
    if (!content.trim()||loading) return;
    const newMsgs = [...messages, { role:"user", content }];
    setMessages(newMsgs); setText(""); setLoading(true);
    try {
      const sys = `You are Aetheris, an AI companion for anime, manga, and manhwa fans. Enthusiastic and knowledgeable. Keep responses concise (2-4 sentences). Spoiler-free: ${spoiler?"ENABLED":"disabled"}. Library: ${recentTitles.join(", ")||"empty"}.`;
      const resp = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:sys, messages:newMsgs.map(m=>({ role:m.role==="ai"?"assistant":"user", content:m.content })) }) });
      const data = await resp.json();
      const reply = data.content?.map(b=>b.text||"").join("")||"Error.";
      const updated = [...newMsgs, { role:"ai", content:reply }];
      setMessages(updated); saveChat(updated);
    } catch { setMessages([...newMsgs, { role:"ai", content:"Connection error." }]); }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile?90:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?28:34, color:"#f0ebff", margin:"0 0 4px" }}>AI Assistant</h1>
          <p style={{ fontSize:12, color:"#7a6b84", margin:0 }}>Your personal anime sage · Aetheris</p>
        </div>
        <button onClick={()=>setSpoiler(v=>!v)} style={{ padding:"9px 16px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${spoiler?"rgba(34,211,238,0.5)":"rgba(255,255,255,0.12)"}`, background: spoiler?"rgba(34,211,238,0.1)":"rgba(255,255,255,0.04)", color: spoiler?"#22d3ee":"#7a6b84", transition:"all 0.25s", minHeight:42, WebkitTapHighlightColor:"transparent" }}>
          {spoiler?"🛡 Spoiler-Free":"⚠ Spoilers"}
        </button>
      </div>
      <GlassCard hover={false} style={{ padding:0, overflow:"hidden" }}>
        {/* Chat messages */}
        <div style={{ height: isMobile?320:400, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
          {!messages.length && (
            <div style={{ textAlign:"center", paddingTop:40, opacity:0, animation:"fadeSlideUp 0.5s ease 0.2s forwards" }}>
              <div style={{ fontSize:48, marginBottom:12, filter:"drop-shadow(0 0 20px rgba(168,85,247,0.6))" }}>◎</div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:20, color:"#d8b4fe", marginBottom:6 }}>Aetheris is ready</p>
              <p style={{ fontSize:12, color:"#7a6b84" }}>Ask for recs, summaries, or anything anime</p>
            </div>
          )}
          {messages.map((m,i) => (
            <div key={i} style={{ display:"flex", gap:8, justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
              {m.role==="ai" && <div style={{ width:30, height:30, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:800, flexShrink:0, boxShadow:"0 0 10px rgba(168,85,247,0.4)" }}>A</div>}
              <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius: m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px", background: m.role==="user"?"rgba(6,182,212,0.13)":"rgba(168,85,247,0.11)", border:`1px solid ${m.role==="user"?"rgba(6,182,212,0.28)":"rgba(168,85,247,0.22)"}`, fontSize:13, color:"#e2d9f3", lineHeight:1.7 }}>{m.content}</div>
              {m.role==="user" && <div style={{ width:30, height:30, borderRadius:99, background:"rgba(6,182,212,0.18)", border:"1px solid rgba(6,182,212,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#22d3ee", fontWeight:800, flexShrink:0 }}>B</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:800 }}>A</div>
              <div style={{ padding:"10px 14px", borderRadius:"4px 16px 16px 16px", background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", display:"flex", gap:5, alignItems:"center" }}>
                <span className="dot-1" style={{ width:6,height:6,borderRadius:99,background:"#a855f7",display:"inline-block" }}/>
                <span className="dot-2" style={{ width:6,height:6,borderRadius:99,background:"#a855f7",display:"inline-block" }}/>
                <span className="dot-3" style={{ width:6,height:6,borderRadius:99,background:"#a855f7",display:"inline-block" }}/>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {/* Prompt chips */}
        <div style={{ padding:"0 14px 10px", display:"flex", flexWrap:"nowrap", gap:6, overflowX:"auto", borderTop:"1px solid rgba(255,255,255,0.05)", scrollbarWidth:"none" }}>
          {prompts.map(p=>(
            <button key={p} onClick={()=>send(p)} style={{ padding:"7px 14px", borderRadius:99, fontSize:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", color:"#8a7898", cursor:"pointer", fontFamily:"inherit", flexShrink:0, minHeight:38, WebkitTapHighlightColor:"transparent", whiteSpace:"nowrap" }}>{p}</button>
          ))}
        </div>
        {/* Input */}
        <div style={{ padding:"6px 14px 14px", display:"flex", gap:8 }}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(text)} placeholder="Ask Aetheris anything…"
            style={{ flex:1, padding:"13px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, color:"#f0ebff", fontSize:13, fontFamily:"inherit", outline:"none", minHeight:48 }}
            onFocus={e=>e.target.style.borderColor="rgba(168,85,247,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.09)"} />
          <Btn onClick={()=>send(text)} disabled={!text.trim()||loading} style={{ minHeight:48, minWidth:70 }}>Send</Btn>
        </div>
      </GlassCard>
      {messages.length>0 && <div style={{ marginTop:10 }}><Btn variant="ghost" small onClick={()=>{setMessages([]);saveChat([]);}}>Clear Chat</Btn></div>}
    </div>
  );
}

function Settings({ isMobile }) {
  const [notif, setNotif] = useState(true);
  const [spoiler, setSpoiler] = useState(true);
  const [genres, setGenres] = useState(["Action","Fantasy"]);
  const ALL_GENRES = ["Action","Fantasy","Romance","Dark","Comedy","Thriller","Sports","Drama","Supernatural","Smart Plot"];
  const toggleGenre = g => setGenres(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g]);

  return (
    <div className="page-enter" style={{ paddingBottom: isMobile?90:0 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?28:34, color:"#f0ebff", margin:"0 0 4px" }}>Settings</h1>
        <p style={{ fontSize:12, color:"#7a6b84", margin:0 }}>Personalise your experience</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <GlassCard hover={false} style={{ padding:20 }} delay={0}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>PROFILE</p>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:60, height:60, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff", boxShadow:"0 0 22px rgba(168,85,247,0.5)", flexShrink:0 }}>B</div>
            <div>
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:18, color:"#f0ebff", margin:"0 0 2px" }}>Bikram</p>
              <p style={{ fontSize:11, color:"#7a6b84", margin:"0 0 10px" }}>Otaku Sage 🔮</p>
              <Btn small variant="ghost">Edit Profile</Btn>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:20 }} delay={80}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:14 }}>PREFERENCES</p>
          {[["Notifications","Get reminded to continue titles",notif,()=>setNotif(v=>!v)],["Spoiler-Free Mode","Hide spoilers in AI responses",spoiler,()=>setSpoiler(v=>!v)]].map(([label,desc,on,fn])=>(
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ paddingRight:12 }}>
                <p style={{ fontSize:13, color:"#e2d9f3", margin:"0 0 2px", fontWeight:600 }}>{label}</p>
                <p style={{ fontSize:11, color:"#7a6b84", margin:0 }}>{desc}</p>
              </div>
              <Toggle on={on} onToggle={fn} />
            </div>
          ))}
        </GlassCard>
        <GlassCard hover={false} style={{ padding:20 }} delay={160}>
          <p style={{ fontSize:10, color:"#fbbf24", fontWeight:700, letterSpacing:"0.15em", marginBottom:14 }}>FAVORITE GENRES</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {ALL_GENRES.map(g=>(
              <button key={g} onClick={()=>toggleGenre(g)} style={{ padding:"9px 16px", borderRadius:99, fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", border:`1px solid ${genres.includes(g)?"#fbbf24":"rgba(255,255,255,0.1)"}`, background: genres.includes(g)?"rgba(251,191,36,0.14)":"rgba(255,255,255,0.03)", color: genres.includes(g)?"#fbbf24":"#7a6b84", transition:"all 0.25s", boxShadow: genres.includes(g)?"0 0 10px rgba(251,191,36,0.25)":"none", minHeight:42, WebkitTapHighlightColor:"transparent" }}>{g}</button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function TitleDetail({ title, lib, setLib, setPage, isMobile }) {
  const [form, setForm] = useState(() => lib.find(x=>x.id===title.id) || { status:"Planning", progress:0, score:"", notes:"", link:"" });
  const [saved, setSaved] = useState("");
  const c = typeColor(title.type);
  const pct = title.total?Math.round(((form.progress||0)/title.total)*100):0;
  const similar = mockTitles.filter(t=>t.id!==title.id&&(t.type===title.type||t.genres.some(g=>title.genres.includes(g)))).slice(0,6);
  const save = () => { setLib(upsertItem({ id:title.id, ...form }, lib)); setSaved("✓ Saved!"); setTimeout(()=>setSaved(""),2500); };
  const complete = () => { const u={ ...form, status:"Completed", progress:title.total }; setForm(u); setLib(upsertItem({ id:title.id, ...u }, lib)); setSaved("✓ Completed!"); setTimeout(()=>setSaved(""),2500); };

  const inputStyle = { padding:"11px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f0ebff", fontSize:13, fontFamily:"inherit", width:"100%", outline:"none", boxSizing:"border-box", minHeight:44 };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:18, paddingBottom: isMobile?90:0 }}>
      <button onClick={()=>setPage("discover")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#7a6b84", cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:"8px 0", WebkitTapHighlightColor:"transparent", minHeight:44 }}>← Back</button>

      {/* Hero */}
      <div style={{ borderRadius: isMobile?16:22, overflow:"hidden", position:"relative", minHeight: isMobile?260:280 }}>
        <img src={title.banner} alt={title.title} style={{ width:"100%", height: isMobile?260:290, objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background: isMobile?"linear-gradient(to top, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.5) 50%, transparent 100%)":"linear-gradient(90deg, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.6) 60%, transparent 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding: isMobile?"18px 16px":"24px 26px", display:"flex", gap: isMobile?14:22, alignItems:"flex-end" }}>
          <img src={title.cover} alt={title.title} style={{ width: isMobile?70:100, height: isMobile?100:140, objectFit:"cover", borderRadius:12, border:`2px solid ${c}55`, flexShrink:0, boxShadow:`0 10px 28px ${typeGlow(title.type)}` }} />
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize: isMobile?22:30, color:"#f0ebff", margin:"0 0 4px", lineHeight:1.1 }}>{title.title}</h1>
            <p style={{ fontSize:11, color:"#7a6b84", margin:"0 0 8px" }}>{title.alt} · {title.year}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
              <Badge color={c}>{title.type}</Badge>
              <Badge color={title.status==="Ongoing"?"#4ade80":"#8a7898"}>{title.status}</Badge>
            </div>
            <StarRating value={title.rating} />
          </div>
        </div>
      </div>

      {/* Synopsis + AI */}
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 270px", gap:14 }}>
        <GlassCard hover={false} style={{ padding:20 }} delay={50}>
          <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>SYNOPSIS</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.synopsis}</p>
        </GlassCard>
        <GlassCard hover={false} style={{ padding:20 }} delay={100}>
          <p style={{ fontSize:10, color:"#22d3ee", fontWeight:700, letterSpacing:"0.15em", marginBottom:10 }}>◎ AI REASON</p>
          <p style={{ fontSize:13, color:"#c4b5d0", lineHeight:1.8, margin:0 }}>{title.reason}</p>
          <div style={{ marginTop:12 }}><Badge color="#22d3ee">AI Pick</Badge></div>
        </GlassCard>
      </div>

      {/* Progress tracker */}
      <GlassCard hover={false} style={{ padding:20 }} delay={150}>
        <p style={{ fontSize:10, color:"#a855f7", fontWeight:700, letterSpacing:"0.15em", marginBottom:16 }}>MY PROGRESS</p>
        <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:14 }}>
          <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:11, color:"#7a6b84" }}>Status</span>
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{ ...inputStyle, color:"#d8b4fe" }}>
              {["Planning","Watching","Reading","Completed","Dropped"].map(s=><option key={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:11, color:"#7a6b84" }}>Chapter/Ep (of {title.total})</span>
            <input type="number" min={0} max={title.total} value={form.progress} onChange={e=>setForm({...form,progress:e.target.value})} style={inputStyle} />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:11, color:"#7a6b84" }}>Score (1-10)</span>
            <input type="number" min={1} max={10} value={form.score} onChange={e=>setForm({...form,score:e.target.value})} style={{ ...inputStyle, color:"#fbbf24" }} />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:11, color:"#7a6b84" }}>Stream/Read Link</span>
            <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Paste link…" style={inputStyle} />
          </label>
        </div>
        <label style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
          <span style={{ fontSize:11, color:"#7a6b84" }}>Notes</span>
          <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Track thoughts…" style={{ ...inputStyle, minHeight:72, resize:"vertical" }} />
        </label>
        <ProgressBar pct={pct} color={c} />
        <p style={{ fontSize:11, color:"#7a6b84", margin:"8px 0 14px" }}>{form.progress||0}/{title.total} · {pct}%</p>
        {saved && <p style={{ fontSize:12, color:"#4ade80", marginBottom:10 }}>{saved}</p>}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          <Btn onClick={save} style={{ minHeight:46 }}>Save Progress</Btn>
          <Btn variant="ghost" onClick={complete} style={{ minHeight:46 }}>Mark Completed</Btn>
          {form.link && <Btn variant="cyan" onClick={()=>window.open(form.link,"_blank")} style={{ minHeight:46 }}>▶ Open</Btn>}
        </div>
      </GlassCard>

      {/* Similar */}
      <section>
        <SectionHeader title="Similar Titles" sub={`More ${title.type} to explore`} delay={200} />
        {isMobile
          ? <HScrollRow gap={12}>{similar.map((s,i)=>(
              <GlassCard key={s.id} style={{ padding:12, minWidth:130, scrollSnapAlign:"start" }} delay={i*40+220}>
                <img src={s.cover} alt={s.title} style={{ width:"100%", height:90, objectFit:"cover", borderRadius:8, marginBottom:8 }} />
                <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:12, color:"#f0ebff", margin:"0 0 2px" }}>{s.title}</p>
                <p style={{ fontSize:10, color:"#7a6b84", margin:0 }}>★{s.rating}</p>
              </GlassCard>
            ))}</HScrollRow>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12 }}>
              {similar.map((s,i)=>(
                <GlassCard key={s.id} style={{ padding:12 }} delay={i*50+220}>
                  <img src={s.cover} alt={s.title} style={{ width:"100%", height:100, objectFit:"cover", borderRadius:10, marginBottom:10 }} />
                  <p style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:800, fontSize:13, color:"#f0ebff", margin:"0 0 2px" }}>{s.title}</p>
                  <p style={{ fontSize:10, color:"#7a6b84", margin:0 }}>{s.type} · ★{s.rating}</p>
                </GlassCard>
              ))}
            </div>
        }
      </section>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lib, setLib] = useState(getLib);
  const [detailTitle, setDetailTitle] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigate = p => { setPage(p); setDrawerOpen(false); };

  const renderPage = () => {
    const props = { lib, setLib, setPage, setDetailTitle, isMobile };
    if (page==="detail"&&detailTitle) return <TitleDetail title={detailTitle} {...props} />;
    if (page==="discover")      return <Discover {...props} />;
    if (page==="library")       return <Library {...props} />;
    if (page==="recommendations") return <Recommendations {...props} />;
    if (page==="ai")            return <AIAssistant {...props} />;
    if (page==="settings")      return <Settings {...props} />;
    return <Dashboard {...props} />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-text-size-adjust: 100%; }
        body { overscroll-behavior: none; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.35); border-radius: 99px; }
        input, textarea, select { outline: none; -webkit-appearance: none; }
        option { background: #12101e; color: #e2d9f3; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Orbs ── */
        .orb { position:absolute; border-radius:50%; filter:blur(80px); animation:orbFloat 14s ease-in-out infinite; }
        .orb1 { width:600px; height:600px; top:-20%; left:-10%; background:radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%); }
        .orb2 { width:500px; height:500px; bottom:5%; right:-8%; background:radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 65%); animation-duration:19s; animation-delay:-5s; }
        .orb3 { width:400px; height:400px; top:45%; left:40%; background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%); animation-duration:24s; animation-delay:-9s; }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(28px,-18px) scale(1.05);} 66%{transform:translate(-18px,14px) scale(0.97);} }

        .noise-overlay { position:absolute; inset:0; opacity:0.025; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px; }

        /* ── Animations ── */
        .page-enter { opacity:0; animation:pageEnter 0.4s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes pageEnter { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .fade-in { opacity:0; animation:fadeSlideUp 0.3s ease forwards; }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes heroFade { from{opacity:0;} to{opacity:1;} }

        /* ── Hero shimmer ── */
        .hero-shimmer { position:absolute; top:0; left:-60%; width:35%; height:100%; background:linear-gradient(105deg,transparent,rgba(255,255,255,0.04),transparent); animation:shimmer 5s ease-in-out infinite; }
        @keyframes shimmer { 0%{left:-60%;} 100%{left:130%;} }

        /* ── Typing dots ── */
        .dot-1,.dot-2,.dot-3 { animation:dotBounce 1.4s ease-in-out infinite; }
        .dot-2 { animation-delay:0.2s; } .dot-3 { animation-delay:0.4s; }
        @keyframes dotBounce { 0%,80%,100%{transform:scale(1);opacity:0.5;} 40%{transform:scale(1.5);opacity:1;} }

        /* ── Status dot ── */
        .status-dot { animation:statusPulse 2s ease-in-out infinite; }
        @keyframes statusPulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5);} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0);} }

        /* ── Logo pulse ── */
        .logo-icon { animation:logoPulse 3s ease-in-out infinite; }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 10px rgba(168,85,247,0.4);} 50%{box-shadow:0 0 22px rgba(168,85,247,0.7),0 0 40px rgba(168,85,247,0.2);} }

        /* ── Sidebar nav ── */
        .nav-item { position:relative; overflow:hidden; }
        .nav-item::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(168,85,247,0.1),transparent); opacity:0; transition:opacity 0.2s; }
        .nav-item:hover::after { opacity:1; }
        .nav-active-bar { position:absolute; left:0; top:20%; height:60%; width:2px; background:linear-gradient(180deg,#a855f7,#ec4899); border-radius:0 2px 2px 0; box-shadow:0 0 8px rgba(168,85,247,0.8); }

        /* ── Drawer overlay ── */
        .drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdropFilter:blur(4px); z-index:150; animation:fadeSlideUp 0.2s ease forwards; }

        /* ── Mobile bottom nav ── */
        .mobile-nav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; background:none; border:none; cursor:pointer; font-family:inherit; padding:6px 8px; border-radius:10px; transition:all 0.2s; min-width:52px; -webkit-tap-highlight-color:transparent; }
        .mobile-nav-btn:active { transform:scale(0.92); }

        /* ── Mobile top bar ── */
        .mobile-topbar { position:fixed; top:0; left:0; right:0; z-index:120; background:rgba(8,6,16,0.92); backdropFilter:blur(24px); border-bottom:1px solid rgba(168,85,247,0.1); padding:12px 16px; display:flex; align-items:center; justify-content:space-between; }

        /* ── Desktop sidebar ── */
        .desktop-sidebar { position:fixed; left:0; top:0; bottom:0; width:224px; background:rgba(8,6,16,0.92); backdropFilter:blur(32px); border-right:1px solid rgba(168,85,247,0.12); display:flex; flex-direction:column; padding:24px 14px; z-index:100; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#080610", fontFamily:"'Noto Sans JP',sans-serif", color:"#e2d9f3", position:"relative" }}>
        <AmbientBg />

        {/* ── MOBILE LAYOUT ── */}
        {isMobile ? (
          <>
            {/* Mobile top bar */}
            <div className="mobile-topbar">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div className="logo-icon" style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⊕</div>
                <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:17, color:"#f0ebff" }}>Point Window</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {/* Library badge */}
                {lib.length>0 && <div style={{ fontSize:10, background:"rgba(168,85,247,0.25)", color:"#d8b4fe", padding:"2px 8px", borderRadius:99, fontWeight:700 }}>{lib.length}</div>}
                {/* Hamburger → opens drawer with Settings & full nav */}
                <button onClick={()=>setDrawerOpen(true)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"7px 10px", cursor:"pointer", color:"#c4b5d0", fontSize:16, WebkitTapHighlightColor:"transparent" }}>☰</button>
              </div>
            </div>

            {/* Drawer */}
            {drawerOpen && (
              <>
                <div className="drawer-overlay" onClick={()=>setDrawerOpen(false)} />
                <div style={{ position:"fixed", top:0, right:0, bottom:0, width:260, background:"rgba(10,8,18,0.97)", backdropFilter:"blur(32px)", borderLeft:"1px solid rgba(168,85,247,0.15)", zIndex:200, padding:"24px 16px", display:"flex", flexDirection:"column", animation:"slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards" }}>
                  <style>{`@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
                    <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:16, color:"#f0ebff" }}>Menu</span>
                    <button onClick={()=>setDrawerOpen(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:99, width:32, height:32, color:"#c4b5d0", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                  </div>
                  {/* User */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 10px", background:"rgba(168,85,247,0.08)", borderRadius:14, marginBottom:20, border:"1px solid rgba(168,85,247,0.12)" }}>
                    <div style={{ width:40, height:40, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff", boxShadow:"0 0 12px rgba(168,85,247,0.45)" }}>B</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#f0ebff", margin:0 }}>Bikram</p>
                      <p style={{ fontSize:10, color:"#7a6b84", margin:0 }}>Otaku Sage 🔮</p>
                    </div>
                  </div>
                  {/* All nav items */}
                  <nav style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    {NAV_FULL.map(({ id, label, icon }) => {
                      const active = page===id||(page==="detail"&&id==="discover");
                      return (
                        <button key={id} onClick={()=>navigate(id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderRadius:12, border:"none", background: active?"rgba(168,85,247,0.18)":"transparent", color: active?"#d8b4fe":"#7a6b84", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight: active?700:500, textAlign:"left", transition:"all 0.2s", position:"relative", minHeight:50, WebkitTapHighlightColor:"transparent" }}>
                          {active && <div className="nav-active-bar" />}
                          <span style={{ fontSize:17, width:22, textAlign:"center" }}>{icon}</span>
                          {label}
                          {id==="library"&&lib.length>0 && <span style={{ marginLeft:"auto", fontSize:10, background:"rgba(168,85,247,0.25)", color:"#d8b4fe", padding:"2px 8px", borderRadius:99, fontWeight:700 }}>{lib.length}</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </>
            )}

            {/* Main content */}
            <main style={{ paddingTop:62, paddingBottom:80, paddingLeft:16, paddingRight:16, position:"relative", zIndex:1, minHeight:"100vh" }}>
              {renderPage()}
            </main>

            {/* Bottom nav */}
            <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(8,6,16,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(168,85,247,0.12)", padding:"6px 8px 10px", zIndex:120, display:"flex", justifyContent:"space-around", alignItems:"flex-end" }}>
              {NAV.map(({ id, label, icon }) => {
                const active = page===id||(page==="detail"&&id==="discover");
                return (
                  <button key={id} onClick={()=>navigate(id)} className="mobile-nav-btn" style={{ color: active?"#d8b4fe":"#6b5b78" }}>
                    {/* Active pill bg */}
                    <div style={{ position:"relative", width:40, height:34, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:12, background: active?"rgba(168,85,247,0.18)":"transparent", transition:"background 0.25s" }}>
                      {active && <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:20, height:2, background:"linear-gradient(90deg,#a855f7,#ec4899)", borderRadius:99 }} />}
                      <span style={{ fontSize:20 }}>{icon}</span>
                    </div>
                    <span style={{ fontSize:9, fontWeight: active?700:400, letterSpacing:"0.03em" }}>{label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        ) : (
          /* ── DESKTOP LAYOUT ── */
          <>
            {/* Sidebar */}
            <aside className="desktop-sidebar">
              <div style={{ padding:"6px 8px 26px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <div className="logo-icon" style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>⊕</div>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:900, fontSize:19, color:"#f0ebff", letterSpacing:"-0.01em" }}>Point Window</span>
                </div>
                <p style={{ fontSize:9, color:"#6b5b78", margin:0, paddingLeft:44, letterSpacing:"0.15em" }}>AI TRACKER</p>
              </div>
              <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
                {NAV_FULL.map(({ id, label, icon }, idx) => {
                  const active = page===id||(page==="detail"&&id==="discover");
                  return (
                    <button key={id} className="nav-item" onClick={()=>navigate(id)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 12px", borderRadius:12, border:"none", background: active?"rgba(168,85,247,0.15)":"transparent", color: active?"#d8b4fe":"#6b5b78", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight: active?700:500, textAlign:"left", transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)", position:"relative", opacity:0, animation:`fadeSlideUp 0.35s ease ${idx*50+50}ms forwards`, WebkitTapHighlightColor:"transparent" }}
                      onMouseEnter={e=>!active&&(e.currentTarget.style.color="#c4b5d0")}
                      onMouseLeave={e=>!active&&(e.currentTarget.style.color="#6b5b78")}>
                      {active && <div className="nav-active-bar" />}
                      <span style={{ fontSize:15, width:20, textAlign:"center", paddingLeft: active?4:0, transition:"padding 0.2s" }}>{icon}</span>
                      {label}
                      {id==="library"&&lib.length>0 && <span style={{ marginLeft:"auto", fontSize:10, background:"rgba(168,85,247,0.25)", color:"#d8b4fe", padding:"1px 8px", borderRadius:99, fontWeight:700 }}>{lib.length}</span>}
                    </button>
                  );
                })}
              </nav>
              <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.2),transparent)", margin:"12px 0" }} />
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px", borderRadius:12, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateX(2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                <div style={{ width:38, height:38, borderRadius:99, background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#fff", boxShadow:"0 0 14px rgba(168,85,247,0.45)", flexShrink:0 }}>B</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#f0ebff", margin:0 }}>Bikram</p>
                  <p style={{ fontSize:10, color:"#6b5b78", margin:0 }}>Otaku Sage 🔮</p>
                </div>
              </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft:224, flex:1, padding:"32px 32px 48px", position:"relative", zIndex:1, minHeight:"100vh" }}>
              {renderPage()}
            </main>
          </>
        )}
      </div>
    </>
  );
}
