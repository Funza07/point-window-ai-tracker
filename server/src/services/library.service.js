import { sanitizeLink, sanitizeText } from "../utils/sanitize.js";

export const mockTitles = [
  { id:"solo-leveling", title:"Solo Leveling", type:"Manhwa", total:200, rating:9.2, genres:["Action","Fantasy"], popularity:99 },
  { id:"aot", title:"Attack on Titan", type:"Anime", total:94, rating:9.1, genres:["Action","Thriller"], popularity:97 },
  { id:"frieren", title:"Frieren", type:"Anime", total:28, rating:9.3, genres:["Fantasy","Emotional"], popularity:89 },
  { id:"csm", title:"Chainsaw Man", type:"Manga", total:180, rating:8.9, genres:["Action","Dark"], popularity:93 },
];

const libByUser = new Map();
const VALID_STATUS = new Set(["Planning", "Watching", "Reading", "Completed", "Dropped"]);

const normalizeScore = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (n < 0 || n > 10) return "";
  return n;
};

const normalizeProgress = (value) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
};

export const libraryStore = {
  get: (userId) => libByUser.get(userId) || [],
  upsert: (userId, item) => {
    const now = new Date().toISOString();
    const list = libByUser.get(userId) || [];
    const prev = list.find((x) => x.id === item.id);
    const nextItem = {
      ...prev,
      ...item,
      id: item.id,
      titleId: item.id,
      created_at: prev?.created_at || now,
      updated_at: now,
      link: item.saved_link || item.link || "",
      saved_link: item.saved_link || item.link || "",
      last_opened_at: prev?.last_opened_at || null,
    };
    const next = [nextItem, ...list.filter((x) => x.id !== item.id)];
    libByUser.set(userId, next);
    return next;
  },
  patch: (userId, titleId, patch) => {
    const list = libByUser.get(userId) || [];
    const now = new Date().toISOString();
    const normalizedId = String(titleId);
    const next = list.map((x) =>
      x.id === normalizedId
        ? {
            ...x,
            ...patch,
            id: normalizedId,
            titleId: normalizedId,
            updated_at: now,
            link: patch.saved_link ?? patch.link ?? x.link ?? "",
            saved_link: patch.saved_link ?? patch.link ?? x.saved_link ?? "",
          }
        : x,
    );
    if (!next.some((x) => x.id === normalizedId)) {
      const base = sanitizeLibraryPayload({ id: normalizedId });
      next.unshift({
        ...base,
        id: normalizedId,
        titleId: normalizedId,
        created_at: now,
        updated_at: now,
        last_opened_at: null,
      });
    }
    libByUser.set(userId, next);
    return next;
  },
  remove: (userId, titleId) => libByUser.set(userId, (libByUser.get(userId) || []).filter((x) => x.id !== titleId)),
  markOpened: (userId, titleId) => {
    const now = new Date().toISOString();
    const list = (libByUser.get(userId) || []).map((x) => (x.id === titleId ? { ...x, last_opened_at: now, updated_at: now } : x));
    libByUser.set(userId, list);
    return { list, openedAt: now, item: list.find((x) => x.id === titleId) || null };
  },
};

export const sanitizeLibraryPayload = (payload = {}) => {
  const id = String(payload.id ?? payload.titleId ?? "").trim();
  const status = VALID_STATUS.has(payload.status) ? payload.status : "Planning";
  const notes = sanitizeText(payload.notes || "");
  const saved_link = sanitizeLink(payload.saved_link || payload.link || "");
  return {
    ...payload,
    id,
    titleId: id,
    status,
    progress: normalizeProgress(payload.progress),
    score: normalizeScore(payload.score),
    notes,
    link: saved_link,
    saved_link,
  };
};
