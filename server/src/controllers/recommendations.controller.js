import { mockTitles } from "../services/library.service.js";
export const getRecommendations = async (_req,res)=>res.json({ data: mockTitles.slice(0,4) });
export const getRecommendationsByMood = async (req,res)=>{ const mood=(req.body.mood||"").toLowerCase(); const data=mockTitles.filter((t)=>t.genres.some((g)=>g.toLowerCase().includes(mood))); res.json({ data }); };
