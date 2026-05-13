import { Router } from "express";
import { searchTitles, getTitle, trendingTitles, similarTitles } from "../controllers/titles.controller.js";
const r=Router();
r.get("/search", searchTitles);
r.get("/trending", trendingTitles);
r.get("/:id/similar", similarTitles);
r.get("/:id", getTitle);
export default r;
