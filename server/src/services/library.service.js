import { sanitizeLink, sanitizeText } from "../utils/sanitize.js";

export const mockTitles = [
  { id:"solo-leveling", title:"Solo Leveling", type:"Manhwa", total:200, rating:9.2, genres:["Action","Fantasy"], popularity:99 },
  { id:"aot", title:"Attack on Titan", type:"Anime", total:94, rating:9.1, genres:["Action","Thriller"], popularity:97 },
  { id:"frieren", title:"Frieren", type:"Anime", total:28, rating:9.3, genres:["Fantasy","Emotional"], popularity:89 },
  { id:"csm", title:"Chainsaw Man", type:"Manga", total:180, rating:8.9, genres:["Action","Dark"], popularity:93 },
];

const libByUser = new Map();

export const libraryStore = {
  get: (userId) => libByUser.get(userId) || [],
  upsert: (userId, item) => {
    const list = libByUser.get(userId) || [];
    const next = [item, ...list.filter((x) => x.id !== item.id)];
    libByUser.set(userId, next);
    return next;
  },
  patch: (userId, titleId, patch) => {
    const list = (libByUser.get(userId) || []).map((x) => (x.id === titleId ? { ...x, ...patch } : x));
    libByUser.set(userId, list);
    return list;
  },
  remove: (userId, titleId) => libByUser.set(userId, (libByUser.get(userId) || []).filter((x) => x.id !== titleId)),
};

export const sanitizeLibraryPayload = (payload = {}) => ({
  ...payload,
  notes: sanitizeText(payload.notes || ""),
  saved_link: sanitizeLink(payload.saved_link || payload.link || ""),
});
