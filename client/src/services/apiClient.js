import { getGuestUserId } from "../utils/guestUser";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const guestUserId = getGuestUserId();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-guest-user-id": guestUserId,
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Request failed");
  return res.json();
}

export const apiClient = { request };
