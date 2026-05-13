import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { aiService } from "./services/aiService";
import Badge from "./components/common/Badge";
import GenrePill from "./components/common/GenrePill";
import StarRating from "./components/common/StarRating";
import ProgressBar from "./components/common/ProgressBar";
import GlassCard from "./components/common/GlassCard";
import Btn from "./components/common/Button";
import SectionHeader from "./components/common/SectionHeader";
import TitleCard from "./components/titles/TitleCard";
import AppShell from "./layouts/AppShell";
import Settings from "./pages/Settings";
import Recommendations from "./pages/Recommendations";
import Discover from "./pages/Discover";
import { mockTitles } from "./data/mockTitles";
import { NAV } from "./data/navItems";
import { typeColor, typeGlow } from "./utils/titleUtils";
import { getLib, saveLib, upsertItem, removeItem, getChat, saveChat } from "./utils/storageUtils";
// ─── Animated Orb Background ─────────────────────────────────────────────────
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

      <AppShell NAV={NAV} page={page} lib={lib} navigate={navigate}>
        {renderPage()}
      </AppShell>
    </>
  );
}















