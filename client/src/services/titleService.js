import { apiClient } from "./apiClient";
import { mockTitles } from "../data/mockTitles";

const normalize = (v = "") => String(v).trim().toLowerCase();
const toGenres = (value) => (Array.isArray(value) ? value : []);

const localSearch = (params = {}) => {
  const q = normalize(params.q);
  const type = normalize(params.type);
  const status = normalize(params.status);
  const genre = normalize(params.genre);
  const sort = params.sort || "Popularity";

  let list = mockTitles.filter((t) => {
    if (!q) return true;
    const hay = `${t.title} ${t.alt} ${t.type} ${t.genres.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
  if (type && type !== "all") list = list.filter((t) => normalize(t.type) === type);
  if (status && status !== "all") list = list.filter((t) => normalize(t.status) === status);
  if (genre && genre !== "all") list = list.filter((t) => t.genres.some((g) => normalize(g) === genre));
  if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
  else if (sort === "Latest") list = [...list].sort((a, b) => b.year - a.year);
  else list = [...list].sort((a, b) => b.popularity - a.popularity);
  return list;
};

export const titleService = {
  async search(params = {}, options = {}) {
    const qp = new URLSearchParams({
      q: params.q || "",
      type: params.type || "",
      status: params.status || "",
      genre: params.genre || "",
      sort: params.sort || "",
    });
    try {
      const res = await apiClient.request(`/titles/search?${qp.toString()}`, options);
      return { success: true, data: Array.isArray(res?.data) ? res.data : [] };
    } catch {
      return { success: true, data: localSearch(params), source: "local" };
    }
  },
  async getById(id) {
    try {
      const res = await apiClient.request(`/titles/${id}`);
      return { success: true, data: res?.data || null };
    } catch {
      return { success: true, data: mockTitles.find((x) => x.id === id) || null, source: "local" };
    }
  },
  async trending() {
    try {
      const res = await apiClient.request("/titles/trending");
      return { success: true, data: Array.isArray(res?.data) ? res.data : [] };
    } catch {
      return { success: true, data: [...mockTitles].sort((a, b) => b.popularity - a.popularity), source: "local" };
    }
  },
  async similar(id) {
    try {
      const res = await apiClient.request(`/titles/${id}/similar`);
      return { success: true, data: Array.isArray(res?.data) ? res.data : [] };
    } catch {
      const base = mockTitles.find((x) => x.id === id);
      const data = mockTitles
        .filter((x) => x.id !== id)
        .filter((x) => (base ? x.type === base.type || toGenres(x.genres).some((g) => toGenres(base.genres).includes(g)) : true))
        .slice(0, 6);
      return { success: true, data, source: "local" };
    }
  },
};
