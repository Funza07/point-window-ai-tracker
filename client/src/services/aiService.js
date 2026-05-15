import { apiClient } from "./apiClient";
export const aiService = {
  chat: (payload) => apiClient.request("/ai/chat", { method: "POST", body: JSON.stringify(payload) }),
  title: (payload) => apiClient.request("/ai/title", { method: "POST", body: JSON.stringify(payload) }),
  recommendations: (payload) => apiClient.request("/ai/recommendations", { method: "POST", body: JSON.stringify(payload) }),
};
