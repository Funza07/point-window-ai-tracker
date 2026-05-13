import { mockTitles } from "../services/library.service.js";
export const searchTitles = async (req,res) => { const q=(req.query.q||"").toLowerCase(); const type=req.query.type; let data=mockTitles.filter((t)=>t.title.toLowerCase().includes(q)); if(type) data=data.filter((t)=>t.type===type); res.json({ data }); };
export const getTitle = async (req,res) => res.json({ data: mockTitles.find((t)=>t.id===req.params.id) || null });
export const trendingTitles = async (_req,res) => res.json({ data:[...mockTitles].sort((a,b)=>b.popularity-a.popularity) });
export const similarTitles = async (req,res) => { const base=mockTitles.find((t)=>t.id===req.params.id); const data=mockTitles.filter((t)=>t.id!==req.params.id && t.type===base?.type); res.json({ data }); };
