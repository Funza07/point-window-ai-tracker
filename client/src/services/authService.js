import { apiClient } from "./apiClient";
export const authService = { login:(b)=>apiClient.request("/auth/login",{method:"POST",body:JSON.stringify(b)}), register:(b)=>apiClient.request("/auth/register",{method:"POST",body:JSON.stringify(b)}), me:()=>apiClient.request("/auth/me") };
