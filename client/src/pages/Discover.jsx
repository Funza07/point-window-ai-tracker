import { useMemo, useState } from "react";
import { mockTitles } from "../data/mockTitles";
import TitleCard from "../components/titles/TitleCard";
import { upsertItem } from "../utils/storageUtils";

export default function Discover({ lib, setLib, setPage, setDetailTitle }) {
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
