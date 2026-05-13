import { apiClient } from "./apiClient";
import { mockTitles } from "../data/mockTitles";

export const titleService = {
  async search(params = {}) {
    try { return await apiClient.request(`/titles/search?q=${encodeURIComponent(params.q || "")}&type=${params.type || ""}`); }
    catch { return { data: mockTitles }; }
  },
  async getById(id) {
    try { return await apiClient.request(`/titles/${id}`); }
    catch { return { data: mockTitles.find((x) => x.id === id) }; }
  },
  async trending() {
    try { return await apiClient.request("/titles/trending"); }
    catch { return { data: mockTitles }; }
  },
  async similar(id) {
    try { return await apiClient.request(`/titles/${id}/similar`); }
    catch { return { data: mockTitles.filter((x) => x.id !== id) }; }
  },
};
