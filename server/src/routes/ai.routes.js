import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chat, titleChat, recommendations } from "../controllers/ai.controller.js";
const limiter=rateLimit({ windowMs: 60_000, max: 15, message: { message: "Too many AI requests" } });
const r=Router();
r.use(authMiddleware);
r.use(limiter);
r.post("/chat", chat);
r.post("/title", titleChat);
r.post("/recommendations", recommendations);

// Backward compatibility aliases
r.post("/title-summary", titleChat);
r.post("/recommend-similar", recommendations);
export default r;
