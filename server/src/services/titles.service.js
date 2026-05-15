import { mockTitles } from "../data/mockTitles.js";
import { searchAniListTitles } from "./anilist.service.js";
import { getTitleById } from "./titleCache.service.js";

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

export const searchTitlesService = async ({ q = "", type = "", status = "", genre = "", sort = "Popularity" } = {}) => {
  const input = { q, type, status, genre, sort };
  const mockData = searchMockTitles(input);
  const nq = normalize(q);

  if (!hasSearchIntent(input)) return { data: mockData, warning: null };

  try {
    const anilistData = await searchAniListTitles({ q, type, status, genre, sort, page: 1, perPage: 20 });
    if (anilistData.length > 0) return { data: anilistData, warning: null };

    const hasQueryMatch = nq && mockData.length > 0;
    return { data: hasQueryMatch ? mockData : [], warning: hasQueryMatch ? "Using local fallback results." : null };
  } catch (error) {
    console.warn("[titles.search] AniList search failed; using mock fallback.", error?.message || error);
    if (!nq) return { data: mockData, warning: "AniList unavailable. Showing local catalogue." };
    return { data: mockData.length > 0 ? mockData : [], warning: "AniList unavailable. Showing fallback results when possible." };
  }
};

export const trendingTitlesService = (limit = 10) =>
  [...mockTitles]
    .map(normalizeTitleShape)
    .sort((a, b) => toNumber(b.popularity, 0) - toNumber(a.popularity, 0))
    .slice(0, Math.max(0, Math.floor(toNumber(limit, 10))));

export const getTitleByIdService = async (id) => {
  const normalizedId = toText(id);
  const fromMock = mockTitles.find((t) => toText(t?.id) === normalizedId) || null;
  if (fromMock) return fromMock;
  return getTitleById(normalizedId);
};

export const similarTitlesService = async (id, limit = 6) => {
  const normalizedId = toText(id);
  const baseRaw = await getTitleByIdService(normalizedId);
  if (!baseRaw) return [];

  const base = normalizeTitleShape(baseRaw);
  const baseType = normalize(base.type);
  const baseGenres = normalizeGenres(base.genres);

  return mockTitles
    .map(normalizeTitleShape)
    .filter((t) => t.id && t.id !== normalizedId)
    .filter((t) => {
      const sameType = baseType && normalize(t.type) === baseType;
      const genreMatch = safeIncludesGenre(baseGenres, t.genres);
      if (!baseGenres.length) return Boolean(sameType);
      return Boolean(sameType || genreMatch);
    })
    .sort((a, b) => toNumber(b.popularity, 0) - toNumber(a.popularity, 0))
    .slice(0, Math.max(0, Math.floor(toNumber(limit, 6))));
};
