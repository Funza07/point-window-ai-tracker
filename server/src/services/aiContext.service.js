import { listLibrary } from "./library.service.js";
import { getTitleById } from "./titleCache.service.js";

const toText = (value = "", max = 240) => String(value ?? "").trim().slice(0, max);
const toInt = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
};

const compactTitle = (title = {}) => ({
  id: toText(title.id, 80),
  title: toText(title.title, 160),
  alt: toText(title.alt, 160),
  type: toText(title.type, 40),
  status: toText(title.status, 40),
  total: toInt(title.total, 0),
  rating: Number.isFinite(Number(title.rating)) ? Number(title.rating) : null,
  genres: Array.isArray(title.genres) ? title.genres.map((g) => toText(g, 40)).filter(Boolean).slice(0, 8) : [],
  year: toInt(title.year, 0),
  synopsis: toText(title.synopsis, 700),
});

export async function buildAiContext({ userId, titleId, title, spoilerSafe = true } = {}) {
  const resolvedSpoilerSafe = spoilerSafe !== false;
  const library = userId ? await listLibrary(userId) : [];
  const recentLibrary = Array.isArray(library)
    ? library.slice(0, 8).map((item) => ({
        id: toText(item.id, 80),
        title: toText(item.title, 160),
        type: toText(item.type, 40),
        status: toText(item.userStatus || item.status, 40),
        progress: toInt(item.progress, 0),
        total: toInt(item.total, 0),
        score: item.score === "" ? null : (Number.isFinite(Number(item.score)) ? Number(item.score) : null),
      }))
    : [];

  let selectedTitle = null;
  if (titleId) {
    const fromCache = await getTitleById(String(titleId).trim());
    if (fromCache) selectedTitle = compactTitle(fromCache);
  }
  if (!selectedTitle && title && typeof title === "object") {
    selectedTitle = compactTitle(title);
  }

  return {
    spoilerSafe: resolvedSpoilerSafe,
    libraryCount: Array.isArray(library) ? library.length : 0,
    recentLibrary,
    selectedTitle,
  };
}
