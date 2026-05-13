import { MEDIA_TYPES } from "../constants/mediaTypes";

export const getProgressLabel = (type) => (type === MEDIA_TYPES.ANIME ? "Episode" : "Chapter");
export const getTotalLabel = (type) => (type === MEDIA_TYPES.ANIME ? "Episodes" : "Chapters");
export const getMediaColor = (type) => {
  if (type === MEDIA_TYPES.ANIME) return "#e879f9";
  if (type === MEDIA_TYPES.MANGA) return "#38bdf8";
  return "#a78bfa";
};
export const getProgressPercentage = (progress = 0, total = 0) => {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(progress) / Number(total)) * 100)));
};
export const normalizeExternalTitle = (rawApiTitle = {}) => ({
  id: rawApiTitle.id || rawApiTitle.mal_id || rawApiTitle.external_id,
  title: rawApiTitle.title || rawApiTitle.name || "Untitled",
  alt: rawApiTitle.alt_title || rawApiTitle.title_english || "",
  type: rawApiTitle.type || "Anime",
  status: rawApiTitle.status || "Unknown",
  total: rawApiTitle.total_count || rawApiTitle.episodes || rawApiTitle.chapters || 0,
  rating: rawApiTitle.rating || rawApiTitle.score || 0,
  genres: rawApiTitle.genres || [],
  synopsis: rawApiTitle.synopsis || "",
  cover: rawApiTitle.cover_url || rawApiTitle.image || "https://picsum.photos/seed/fallback/400/580",
  banner: rawApiTitle.banner_url || "https://picsum.photos/seed/fallback-b/1200/420",
  popularity: rawApiTitle.popularity || 0,
  year: rawApiTitle.year || null,
});
