import { apiClient } from "./apiClient";
import { getLib, saveLib, upsertItem, removeItem } from "../utils/storageUtils";

const normalizeListResponse = (res) => (Array.isArray(res?.data) ? res.data : []);
const toLocalLibraryItem = (item = {}) => ({
  ...item,
  userStatus: item.libraryStatus || item.userStatus || item.status || "Planning",
  status: item.libraryStatus || item.userStatus || item.status || "Planning",
});

export const libraryService = {
  async list() {
    try {
      const res = await apiClient.request("/library");
      const data = normalizeListResponse(res);
      saveLib(data);
      return { success: true, data, source: "backend" };
    } catch {
      return { success: true, data: getLib(), source: "local" };
    }
  },
  async upsert(item) {
    try {
      const res = await apiClient.request("/library", { method: "POST", body: JSON.stringify(item) });
      const data = normalizeListResponse(res);
      saveLib(data);
      return { success: true, data, source: "backend" };
    } catch {
      const data = upsertItem(toLocalLibraryItem(item), getLib());
      return { success: true, data, source: "local" };
    }
  },
  async update(titleId, patch) {
    try {
      const res = await apiClient.request(`/library/${titleId}`, { method: "PATCH", body: JSON.stringify(patch) });
      const data = normalizeListResponse(res);
      saveLib(data);
      return { success: true, data, source: "backend" };
    } catch {
      const data = upsertItem({ id: titleId, ...patch }, getLib());
      return { success: true, data, source: "local" };
    }
  },
  async remove(titleId) {
    try {
      const res = await apiClient.request(`/library/${titleId}`, { method: "DELETE" });
      const data = normalizeListResponse(res);
      saveLib(data);
      return { success: true, data, source: "backend" };
    } catch {
      const data = removeItem(titleId, getLib());
      return { success: true, data, source: "local" };
    }
  },
  async openLink(titleId) {
    try {
      const res = await apiClient.request(`/library/${titleId}/open-link`, { method: "POST" });
      const current = getLib();
      const openedAt = res?.data?.openedAt || new Date().toISOString();
      const data = current.map((x) => (x.id === titleId ? { ...x, last_opened_at: openedAt } : x));
      saveLib(data);
      return { success: true, data, source: "backend" };
    } catch {
      const openedAt = new Date().toISOString();
      const data = getLib().map((x) => (x.id === titleId ? { ...x, last_opened_at: openedAt } : x));
      saveLib(data);
      return { success: true, data, source: "local" };
    }
  },
};
