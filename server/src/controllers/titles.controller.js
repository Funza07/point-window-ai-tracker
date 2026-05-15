import { getTitleByIdService, searchTitlesService, similarTitlesService, trendingTitlesService } from "../services/titles.service.js";

export const searchTitles = async (req, res) => {
  const data = await searchTitlesService(req.query || {});
  res.json({ success: true, data });
};

export const getTitle = async (req, res) => {
  const data = getTitleByIdService(req.params.id);
  if (!data) return res.status(404).json({ success: false, data: null, message: "Title not found" });
  res.json({ success: true, data });
};

export const trendingTitles = async (req, res) => {
  const limit = Number(req.query.limit || 10);
  const data = trendingTitlesService(Number.isFinite(limit) ? limit : 10);
  res.json({ success: true, data });
};

export const similarTitles = async (req, res) => {
  const base = getTitleByIdService(req.params.id);
  if (!base) return res.status(404).json({ success: false, data: [], message: "Title not found" });
  const data = similarTitlesService(req.params.id, 6);
  res.json({ success: true, data });
};
