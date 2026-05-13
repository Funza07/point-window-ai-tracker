import { Router } from "express";
import { getRecommendations, getRecommendationsByMood } from "../controllers/recommendations.controller.js";
const r=Router();
r.get("/", getRecommendations);
r.post("/mood", getRecommendationsByMood);
export default r;
