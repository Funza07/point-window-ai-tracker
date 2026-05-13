import { apiClient } from "./apiClient";
const KEY = "pw_lib";
const getLocal = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const setLocal = (v) => localStorage.setItem(KEY, JSON.stringify(v));

export const libraryService = {
  async list() { try { return await apiClient.request("/library"); } catch { return { data: getLocal() }; } },
  async upsert(item) {
    try { return await apiClient.request("/library", { method: "POST", body: JSON.stringify(item) }); }
    catch { const list=[item,...getLocal().filter((x)=>x.id!==item.id)]; setLocal(list); return { data: list }; }
  },
  async update(titleId, patch) {
    try { return await apiClient.request(`/library/${titleId}`, { method:"PATCH", body: JSON.stringify(patch) }); }
    catch { const list=getLocal().map((x)=>x.id===titleId?{...x,...patch}:x); setLocal(list); return { data: list }; }
  },
  async remove(titleId) {
    try { return await apiClient.request(`/library/${titleId}`, { method:"DELETE" }); }
    catch { const list=getLocal().filter((x)=>x.id!==titleId); setLocal(list); return { data: list }; }
  },
};
