import { apiClient } from "./apiClient";
export const aiService = {
  chat: (payload) => apiClient.request("/ai/chat", { method: "POST", body: JSON.stringify(payload) }),
  titleSummary: (payload) => apiClient.request("/ai/title-summary", { method: "POST", body: JSON.stringify(payload) }),
  recommendSimilar: (payload) => apiClient.request("/ai/recommend-similar", { method: "POST", body: JSON.stringify(payload) }),
  storySoFar: (payload) => apiClient.request("/ai/story-so-far", { method: "POST", body: JSON.stringify(payload) }),
};
