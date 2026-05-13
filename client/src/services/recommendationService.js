import { apiClient } from "./apiClient";
export const recommendationService = { async list(){ return apiClient.request("/recommendations").catch(()=>({data:[]})); }, async byMood(mood){ return apiClient.request("/recommendations/mood",{method:"POST",body:JSON.stringify({mood})}).catch(()=>({data:[]})); } };
