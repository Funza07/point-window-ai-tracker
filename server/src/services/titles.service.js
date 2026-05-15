import { mockTitles } from "../data/mockTitles.js";
import { getAniListTitleById, searchAniListTitles } from "./anilist.service.js";
import {
  getAllCachedTitles,
  getTitleById,
  searchCachedTitles,
  upsertManyTitleSnapshots,
  upsertTitleSnapshot,
} from "./titleCache.service.js";

const normalize = (v = "") => String(v).trim().toLowerCase();
const toText = (v = "") => String(v ?? "").trim();
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeGenres = (value) => {
  if (Array.isArray(value)) return value.map((g) => toText(g)).filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((g) => toText(g)).filter(Boolean);
    } catch {
      // fallback to comma split below
    }
    return trimmed
      .split(",")
      .map((g) => toText(g))
      .filter(Boolean);
  }
  return [];
};

const safeIncludesGenre = (baseGenres, titleGenres) => {
  const base = normalizeGenres(baseGenres).map((g) => normalize(g));
  if (!base.length) return false;
  const target = normalizeGenres(titleGenres).map((g) => normalize(g));
  if (!target.length) return false;
  return target.some((g) => base.includes(g));
};

const normalizeTitleShape = (title = {}) => ({
  ...title,
  id: toText(title?.id),
  title: toText(title?.title),
  alt: toText(title?.alt),
  type: toText(title?.type),
  status: toText(title?.status),
  total: Math.max(0, Math.floor(toNumber(title?.total, 0))),
  rating: toNumber(title?.rating, 0),
  genres: normalizeGenres(title?.genres),
});

const searchMockTitles = ({ q = "", type = "", status = "", genre = "", sort = "Popularity" } = {}) => {
  const nq = normalize(q);
  const ntype = normalize(type);
  const nstatus = normalize(status);
  const ngenre = normalize(genre);

  let data = mockTitles.map(normalizeTitleShape).filter((t) => {
    if (!nq) return true;
    const hay = `${t.title} ${t.alt} ${t.type} ${normalizeGenres(t.genres).join(" ")}`.toLowerCase();
    return hay.includes(nq);
  });

  if (ntype) data = data.filter((t) => normalize(t.type) === ntype);
  if (nstatus) data = data.filter((t) => normalize(t.status) === nstatus);
  if (ngenre) data = data.filter((t) => t.genres.some((g) => normalize(g) === ngenre));

  if (sort === "Rating") data = [...data].sort((a, b) => b.rating - a.rating);
  else if (sort === "Latest") data = [...data].sort((a, b) => b.year - a.year);
  else data = [...data].sort((a, b) => b.popularity - a.popularity);

  return data;
};

const hasSearchIntent = ({ q = "", type = "", status = "", genre = "" } = {}) =>
  Boolean(normalize(q) || normalize(type) || normalize(status) || normalize(genre));

const dedupeByIdPreferLast = (items = [], limit = 20) => {
  const seen = new Set();
  const out = [];
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = normalizeTitleShape(items[i]);
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out.reverse().slice(0, limit);
};

export const searchTitlesService = async ({ q = "", type = "", status = "", genre = "", sort = "Popularity" } = {}) => {
  const input = { q, type, status, genre, sort };
  const mockData = searchMockTitles(input);
  const limit = 20;
  const cacheData = await searchCachedTitles({ ...input, limit });
  const hasIntent = hasSearchIntent(input);

  if (!hasIntent) {
    if (cacheData.length >= 12) return { data: cacheData.slice(0, limit), warning: null };
    try {
      const anilistData = await searchAniListTitles({ q: "", type, status, genre, sort, page: 1, perPage: 16 });
      if (anilistData.length > 0) {
        await upsertManyTitleSnapshots(anilistData);
        const merged = dedupeByIdPreferLast([...cacheData, ...anilistData], limit);
        return { data: merged, warning: null };
      }
    } catch (error) {
      const isRateLimited = error?.code === "ANILIST_RATE_LIMITED" || error?.code === "ANILIST_COOLDOWN";
      if (cacheData.length > 0) {
        return {
          data: cacheData.slice(0, limit),
          warning: isRateLimited ? "AniList temporarily rate-limited; using cached results" : "AniList unavailable. Using cached results.",
        };
      }
    }
    if (cacheData.length > 0) return { data: cacheData.slice(0, limit), warning: "Using cached catalogue fallback." };
    return { data: mockData, warning: "Using local catalogue fallback." };
  }

  if (cacheData.length >= 12) return { data: cacheData.slice(0, limit), warning: null };

  try {
    const anilistData = await searchAniListTitles({ q, type, status, genre, sort, page: 1, perPage: 16 });
    if (anilistData.length > 0) {
      await upsertManyTitleSnapshots(anilistData);
      const merged = dedupeByIdPreferLast([...cacheData, ...anilistData], limit);
      return { data: merged, warning: null };
    }
    if (cacheData.length > 0) return { data: cacheData.slice(0, limit), warning: "Using cached fallback results." };
    return { data: mockData.length > 0 ? mockData.slice(0, limit) : [], warning: mockData.length > 0 ? "Using local fallback results." : null };
  } catch (error) {
    const isRateLimited = error?.code === "ANILIST_RATE_LIMITED" || error?.code === "ANILIST_COOLDOWN";
    if (cacheData.length > 0) {
      return {
        data: cacheData.slice(0, limit),
        warning: isRateLimited ? "AniList temporarily rate-limited; using cached results" : "AniList unavailable. Using cached results.",
      };
    }
    if (isRateLimited) {
      return {
        data: mockData.length > 0 ? mockData.slice(0, limit) : [],
        warning: "AniList temporarily rate-limited; using fallback results",
      };
    }
    return { data: mockData.length > 0 ? mockData.slice(0, limit) : [], warning: "AniList unavailable. Showing fallback results when possible." };
  }
};

export const trendingTitlesService = async (limit = 10) => {
  const safeLimit = Math.max(0, Math.floor(toNumber(limit, 10)));
  const cachedTrending = await searchCachedTitles({ q: "", sort: "Popularity", limit: Math.max(safeLimit, 12) });
  if (cachedTrending.length >= safeLimit && safeLimit > 0) return cachedTrending.slice(0, safeLimit);
  try {
    const anilistData = await searchAniListTitles({ q: "", sort: "Popularity", page: 1, perPage: Math.max(12, safeLimit) });
    if (anilistData.length > 0) {
      await upsertManyTitleSnapshots(anilistData);
      return dedupeByIdPreferLast([...cachedTrending, ...anilistData], safeLimit);
    }
  } catch {
    // fallback below
  }
  if (cachedTrending.length > 0) return cachedTrending.slice(0, safeLimit);
  return [...mockTitles]
    .map(normalizeTitleShape)
    .sort((a, b) => toNumber(b.popularity, 0) - toNumber(a.popularity, 0))
    .slice(0, safeLimit);
};

export const getTitleByIdService = async (id) => {
  const normalizedId = toText(id);
  const fromMock = mockTitles.find((t) => toText(t?.id) === normalizedId) || null;
  if (fromMock) return fromMock;

  const fromCache = await getTitleById(normalizedId);
  if (fromCache) return normalizeTitleShape(fromCache);

  if (normalizedId.startsWith("anilist-")) {
    const externalId = Number(normalizedId.replace("anilist-", ""));
    if (Number.isFinite(externalId) && externalId > 0) {
      const fromAniList = await getAniListTitleById(externalId);
      if (fromAniList) {
        await upsertTitleSnapshot(fromAniList);
        return normalizeTitleShape(fromAniList);
      }
    }
  }

  return null;
};

export const similarTitlesService = async (id, limit = 6) => {
  const normalizedId = toText(id);
  const baseRaw = await getTitleByIdService(normalizedId);
  if (!baseRaw) return [];

  const base = normalizeTitleShape(baseRaw);
  const baseType = normalize(base.type);
  const baseGenres = normalizeGenres(base.genres);

  const cachedTitles = await getAllCachedTitles(250);
  const candidateTitles = [...mockTitles, ...cachedTitles];

  return candidateTitles
    .map(normalizeTitleShape)
    .filter((t) => t.id && t.id !== normalizedId)
    .filter((t, index, arr) => arr.findIndex((x) => x.id === t.id) === index)
    .filter((t) => {
      const sameType = baseType && normalize(t.type) === baseType;
      const genreMatch = safeIncludesGenre(baseGenres, t.genres);
      if (!baseGenres.length) return Boolean(sameType);
      return Boolean(sameType || genreMatch);
    })
    .sort((a, b) => toNumber(b.popularity, 0) - toNumber(a.popularity, 0))
    .slice(0, Math.max(0, Math.floor(toNumber(limit, 6))));
};
