import { mockTitles } from "../data/mockTitles.js";

const normalize = (v = "") => String(v).trim().toLowerCase();

export const searchTitlesService = ({ q = "", type = "", status = "", genre = "", sort = "Popularity" } = {}) => {
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

export const trendingTitlesService = (limit = 10) => [...mockTitles].sort((a, b) => b.popularity - a.popularity).slice(0, limit);

export const getTitleByIdService = (id) => mockTitles.find((t) => t.id === id) || null;

export const similarTitlesService = (id, limit = 6) => {
  const base = getTitleByIdService(id);
  if (!base) return [];
  return mockTitles
    .filter((t) => t.id !== id)
    .filter((t) => t.type === base.type || t.genres.some((g) => base.genres.includes(g)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};
