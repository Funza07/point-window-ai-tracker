import { getTitleByIdService, searchTitlesService, similarTitlesService, trendingTitlesService } from "../services/titles.service.js";

export const searchTitles = async (req, res) => {
  const result = await searchTitlesService(req.query || {});
  res.json({ success: true, data: result.data || [], ...(result.warning ? { warning: result.warning } : {}) });
};

export const getTitle = async (req, res) => {
  try {
    const data = await getTitleByIdService(req.params.id);
    if (!data) return res.status(404).json({ success: false, data: null, message: "Title not found" });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, data: null, message: "Title lookup failed" });
  }
};

export const trendingTitles = async (req, res) => {
  const limit = Number(req.query.limit || 10);
  const data = await trendingTitlesService(Number.isFinite(limit) ? limit : 10);
  res.json({ success: true, data });
};

export const similarTitles = async (req, res) => {
  try {
    const base = await getTitleByIdService(req.params.id);
    if (!base) return res.status(200).json({ success: true, data: [] });
    const data = await similarTitlesService(req.params.id, 6);
    res.json({ success: true, data: Array.isArray(data) ? data : [] });
  } catch {
    res.status(200).json({ success: true, data: [], warning: "Similar titles unavailable" });
  }
};
