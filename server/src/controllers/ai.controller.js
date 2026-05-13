import { generateSafeReply } from "../services/aiProvider.service.js";

export const chat = async (req,res)=>res.json({ data: { reply: await generateSafeReply("chat", req.body) } });
export const titleSummary = async (req,res)=>res.json({ data: { reply: await generateSafeReply("title-summary", req.body) } });
export const recommendSimilar = async (req,res)=>res.json({ data: { reply: await generateSafeReply("recommend-similar", req.body) } });
export const storySoFar = async (req,res)=>res.json({ data: { reply: await generateSafeReply("story-so-far", req.body) } });
