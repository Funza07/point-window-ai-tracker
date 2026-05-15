import { Router } from "express";
import { isDbConfigured, testDbConnection } from "../config/db.js";
import { getLibrarySourceStatus, listLibrary } from "../services/library.service.js";
import { searchAniListTitles } from "../services/anilist.service.js";
import { getTitleCacheCount } from "../services/titleCache.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { similarTitlesService } from "../services/titles.service.js";

const r = Router();

r.get("/db", async (_req, res) => {
  const status = await testDbConnection();
  res.json({
    success: true,
    dbConfigured: isDbConfigured(),
    dbConnected: status.dbConnected,
    usingFallback: status.usingFallback,
    dbHostPresent: status.dbHostPresent,
    dbNamePresent: status.dbNamePresent,
    dbUserPresent: status.dbUserPresent,
    ...(status.errorCode ? { errorCode: status.errorCode } : {}),
    ...(status.errorMessage ? { errorMessage: status.errorMessage } : {}),
    timestamp: new Date().toISOString(),
  });
});

r.get("/library-source", async (_req, res) => {
  const sourceStatus = await getLibrarySourceStatus();
  const items = await listLibrary("dev-user");
  res.json({
    success: true,
    source: sourceStatus.source,
    itemCount: Array.isArray(items) ? items.length : 0,
    timestamp: new Date().toISOString(),
  });
});

r.get("/anilist", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const data = await searchAniListTitles({ q, page: 1, perPage: 10 });
    res.json({
      success: true,
      count: data.length,
      sample: data.slice(0, 3),
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: 0,
      sample: [],
      warning: error?.message || "AniList debug query failed",
    });
  }
});

r.get("/title-cache", async (_req, res) => {
  const itemCount = await getTitleCacheCount();
  res.json({
    success: true,
    itemCount,
    timestamp: new Date().toISOString(),
  });
});

r.get("/request-user", authMiddleware, async (req, res) => {
  res.json({
    success: true,
    userId: req.user?.id || "dev-user",
  });
});

r.get("/similar-test", async (req, res) => {
  try {
    const id = String(req.query.id || "").trim();
    const data = id ? await similarTitlesService(id, 6) : [];
    res.json({ success: true, data: Array.isArray(data) ? data : [] });
  } catch {
    res.status(200).json({ success: true, data: [], warning: "Similar titles unavailable" });
  }
});

export default r;
