import { mockTitles } from "../data/mockTitles.js";
import { searchAniListTitles } from "./anilist.service.js";
import { getTitleById } from "./titleCache.service.js";

const normalize = (v = "") => String(v).trim().toLowerCase();

const searchMockTitles = ({ q = "", type = "", status = "", genre = "", sort = "Popularity" } = {}) => {
  const nq = normalize(q);
  const ntype = normalize(type);
  const nstatus = normalize(status);
  const ngenre = normalize(genre);

  let data = mockTitles.filter((t) => {
    if (!nq) return true;
    const hay = `${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase();
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

export const trendingTitlesService = (limit = 10) => [...mockTitles].sort((a, b) => b.popularity - a.popularity).slice(0, limit);

export const getTitleByIdService = async (id) => {
  const fromMock = mockTitles.find((t) => t.id === id) || null;
  if (fromMock) return fromMock;
  return getTitleById(id);
};

export const similarTitlesService = (id, limit = 6) => {
  const base = getTitleByIdService(id);
  if (!base) return [];
  return mockTitles
    .filter((t) => t.id !== id)
    .filter((t) => t.type === base.type || t.genres.some((g) => base.genres.includes(g)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};
