import { Router } from "express";
import { isDbConfigured, testDbConnection } from "../config/db.js";
import { getLibrarySourceStatus, listLibrary } from "../services/library.service.js";
import { searchAniListTitles } from "../services/anilist.service.js";
import { getAniListSearchStatus } from "../services/anilist.service.js";
import { getTitleCacheCount, searchCachedTitles } from "../services/titleCache.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { similarTitlesService } from "../services/titles.service.js";
import { getTitleByIdService } from "../services/titles.service.js";
import { getTitleById } from "../services/titleCache.service.js";
import { mockTitles } from "../data/mockTitles.js";
import { getAiProviderStatus } from "../services/aiProvider.service.js";

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

r.get("/title-cache/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const type = String(req.query.type || "").trim();
    const status = String(req.query.status || "").trim();
    const genre = String(req.query.genre || "").trim();
    const sort = String(req.query.sort || "Popularity").trim();
    const data = await searchCachedTitles({ q, type, status, genre, sort, limit: 20 });
    res.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      data: Array.isArray(data) ? data : [],
    });
  } catch {
    res.status(200).json({ success: true, count: 0, data: [] });
  }
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

r.get("/anilist-status", async (_req, res) => {
  const status = getAniListSearchStatus();
  res.json({
    success: true,
    cacheSize: status.cacheSize,
    inFlightCount: status.inFlightCount,
    cooldownActive: status.cooldownActive,
    ...(status.cooldownUntil ? { cooldownUntil: status.cooldownUntil } : {}),
    timestamp: new Date().toISOString(),
  });
});

r.get("/title/:id", async (req, res) => {
  const id = String(req.params.id || "").trim();
  if (!id) return res.json({ success: true, foundIn: "none", data: null });
  const fromMock = mockTitles.find((t) => t.id === id) || null;
  const fromCache = await getTitleById(id);
  const data = await getTitleByIdService(id);
  const foundIn = fromMock ? "mock" : fromCache ? "cache" : id.startsWith("anilist-") && data ? "anilist" : "none";
  res.json({ success: true, foundIn, data: data || null });
});

r.get("/ai", (_req, res) => {
  const status = getAiProviderStatus();
  res.json({
    success: true,
    providerConfigured: status.providerConfigured,
    provider: status.provider,
    model: status.model,
    timestamp: new Date().toISOString(),
  });
});

export default r;
