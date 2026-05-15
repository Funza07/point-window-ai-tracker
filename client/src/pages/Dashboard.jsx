import { useEffect, useState } from "react";
import { mockTitles } from "../data/mockTitles";
import GlassCard from "../components/common/GlassCard";
import Badge from "../components/common/Badge";
import ProgressBar from "../components/common/ProgressBar";
import Btn from "../components/common/Button";
import SectionHeader from "../components/common/SectionHeader";
import TitleCard from "../components/titles/TitleCard";
import { typeColor } from "../utils/titleUtils";
import { upsertItem } from "../utils/storageUtils";
import { titleService } from "../services/titleService";
import { buildLibraryPayload, resolveLibraryTitle } from "../utils/libraryTitle";

export default function Dashboard({ lib, setLib, setPage, setDetailTitle, onAdd, onOpenLink }) {
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [trending, setTrending] = useState([...mockTitles].sort((a, b) => b.popularity - a.popularity).slice(0, 5));
  const [catalog, setCatalog] = useState(mockTitles);
  const hero = catalog[0] || mockTitles[0];
  const continueItems = lib.slice(0, 4).map((item) => ({ item, title: resolveLibraryTitle(item) })).filter((x) => x.title);
  const searched = search
    ? catalog.filter((t) => `${t.title} ${t.alt} ${t.type} ${(Array.isArray(t.genres) ? t.genres : []).join(" ")}`.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleAdd = (t) => {
    const item = buildLibraryPayload(t, { libraryStatus: "Watching" });
    if (onAdd) return onAdd(item);
    setLib(upsertItem({ ...item, titleStatus: item.status, status: item.libraryStatus, userStatus: item.libraryStatus }, lib));
  };

  const onView = (t) => {
    setDetailTitle(t);
    setPage("detail");
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [trendRes, catalogRes] = await Promise.all([titleService.trending(), titleService.search({ sort: "Popularity" })]);
      if (!mounted) return;
      if (Array.isArray(trendRes.data) && trendRes.data.length) setTrending(trendRes.data.slice(0, 5));
      if (Array.isArray(catalogRes.data) && catalogRes.data.length) setCatalog(catalogRes.data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: searchFocus ? "#a855f7" : "#7a6b84", transition: "color 0.2s" }}>Q</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="Search anime, manga, manhwa..."
          style={{
            width: "100%",
            padding: "14px 16px 14px 46px",
            background: searchFocus ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${searchFocus ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: 14,
            color: "#f0ebff",
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: searchFocus ? "0 0 24px rgba(168,85,247,0.18)" : "none",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "#a0899e", cursor: "pointer", fontSize: 11 }}
          >
            x
          </button>
        )}
      </div>

      {search && (
        <div className="fade-in">
          <p style={{ fontSize: 11, color: "#7a6b84", marginBottom: 14, letterSpacing: "0.12em" }}>RESULTS FOR "{search.toUpperCase()}" - {searched.length} found</p>
          {searched.length === 0 ? (
            <GlassCard hover={false} style={{ padding: 32, textAlign: "center" }}>
              <p style={{ color: "#7a6b84", fontSize: 13, margin: 0 }}>No titles found for "{search}"</p>
            </GlassCard>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14 }}>
              {searched.slice(0, 8).map((t, i) => <TitleCard key={t.id} title={t} lib={lib} onAdd={handleAdd} onView={onView} delay={i * 50} />)}
            </div>
          )}
        </div>
      )}

      {!search && (
        <div className="hero-banner" style={{ borderRadius: 24, overflow: "hidden", position: "relative", minHeight: 300, cursor: "pointer" }} onClick={() => onView(hero)}>
          <img src={hero.banner} alt={hero.title} style={{ width: "100%", height: 340, objectFit: "cover" }} className="hero-img" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.65) 55%, rgba(168,85,247,0.18) 100%)" }} />
          <div className="hero-shimmer" />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 32px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }} className="hero-tag">
              <div style={{ width: 32, height: 2, background: "linear-gradient(90deg,#a855f7,#ec4899)" }} />
              <span style={{ fontSize: 10, color: "#a855f7", fontWeight: 700, letterSpacing: "0.2em" }}>FEATURED PICK</span>
            </div>
            <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 40, fontWeight: 900, color: "#f0ebff", margin: "0 0 6px", lineHeight: 1.05 }}>{hero.title}</h1>
            <p style={{ fontSize: 12, color: "#7a6b84", margin: "0 0 10px" }}>{hero.alt} - {hero.year} - {hero.type}</p>
            <p style={{ fontSize: 13, color: "#c4b5d0", maxWidth: 480, margin: "0 0 18px", lineHeight: 1.7 }}>{String(hero.synopsis || "").slice(0, 120)}...</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} onClick={(e) => e.stopPropagation()}>
              <Btn onClick={() => onView(hero)}>View Details</Btn>
              <Btn variant="ghost" onClick={() => setPage("ai")}>Ask AI About This</Btn>
            </div>
          </div>
        </div>
      )}

      {!search && continueItems.length > 0 && (
        <section>
          <SectionHeader title="Continue Watching / Reading" sub="Pick up right where you left off" action={{ label: "Open Library", fn: () => setPage("library") }} delay={100} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {continueItems.map(({ item, title }, i) => (
              <GlassCard key={title.id} style={{ padding: 14, display: "flex", gap: 12 }} delay={i * 60 + 100}>
                <img src={title.cover} alt={title.title} style={{ width: 52, height: 72, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: 15, color: "#f0ebff", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title.title}</p>
                  <Badge color={typeColor(title.type)}>{title.type}</Badge>
                  <p style={{ fontSize: 11, color: "#7a6b84", margin: "6px 0 4px" }}>{item.userStatus || item.status} - Ep/Ch {item.progress}</p>
                  <ProgressBar pct={title.total ? Math.round((item.progress / title.total) * 100) : 0} color={typeColor(title.type)} />
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <Btn small onClick={() => onView(title)}>Continue</Btn>
                    {item.link && <Btn small variant="cyan" onClick={async () => { if (onOpenLink) await onOpenLink(title.id); window.open(item.link, "_blank"); }}>Link</Btn>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {!search && (
        <section>
          <SectionHeader title="Trending Now" sub="Most-followed titles this season" delay={150} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
            {trending.map((t, i) => (
              <GlassCard key={t.id} onClick={() => onView(t)} style={{ padding: "12px 10px 10px", textAlign: "center" }} delay={i * 50 + 200}>
                <div style={{ width: 30, height: 30, borderRadius: 99, background: `linear-gradient(135deg,${typeColor(t.type)}30,${typeColor(t.type)}10)`, border: `1px solid ${typeColor(t.type)}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 11, fontWeight: 800, color: typeColor(t.type) }}>#{i + 1}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#f0ebff", margin: "0 0 4px", lineHeight: 1.2 }}>{t.title}</p>
                <p style={{ fontSize: 9, color: "#7a6b84", margin: 0 }}>{t.type}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {!search && (
        <section>
          <SectionHeader title="Recommended For You" sub="AI-curated picks from your taste profile" action={{ label: "See all", fn: () => setPage("recommendations") }} delay={200} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14 }}>
            {catalog.slice(4, 8).map((t, i) => <TitleCard key={t.id} title={t} lib={lib} onAdd={handleAdd} onView={onView} delay={i * 60 + 250} />)}
          </div>
        </section>
      )}
    </div>
  );
}

