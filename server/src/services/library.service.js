import { sanitizeLink, sanitizeText } from "../utils/sanitize.js";
import { db, isDbAvailable, testDbConnection } from "../config/db.js";

const libByUser = new Map();
const VALID_STATUS = new Set(["Planning", "Watching", "Reading", "Completed", "Dropped"]);

const warn = (msg, err) => console.warn(`[library.service] ${msg}${err ? `: ${err.message}` : ""}`);

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
  return Math.floor(n);
};

const mapDbRowToClient = (row) => ({
  id: row.title_id,
  status: row.status || "Planning",
  progress: Number(row.progress || 0),
  score: row.score === null ? "" : Number(row.score),
  notes: row.notes || "",
  link: row.saved_link || "",
  last_opened_at: row.last_opened_at ? new Date(row.last_opened_at).toISOString() : null,
  created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
  updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
});

const memoryStore = {
  list(userId) {
    return libByUser.get(userId) || [];
  },
  upsert(userId, item) {
    const now = new Date().toISOString();
    const list = libByUser.get(userId) || [];
    const prev = list.find((x) => x.id === item.id);
    const nextItem = {
      ...prev,
      ...item,
      id: item.id,
      created_at: prev?.created_at || now,
      updated_at: now,
      link: item.link || "",
      last_opened_at: prev?.last_opened_at || null,
    };
    const next = [nextItem, ...list.filter((x) => x.id !== item.id)];
    libByUser.set(userId, next);
    return next;
  },
  update(userId, titleId, patch) {
    const list = libByUser.get(userId) || [];
    const now = new Date().toISOString();
    const normalizedId = String(titleId);
    const next = list.map((x) =>
      x.id === normalizedId
        ? {
            ...x,
            ...patch,
            id: normalizedId,
            updated_at: now,
          }
        : x,
    );
    libByUser.set(userId, next);
    return next;
  },
  remove(userId, titleId) {
    const next = (libByUser.get(userId) || []).filter((x) => x.id !== String(titleId));
    libByUser.set(userId, next);
    return next;
  },
  openLink(userId, titleId) {
    const now = new Date().toISOString();
    const list = (libByUser.get(userId) || []).map((x) => (x.id === String(titleId) ? { ...x, last_opened_at: now, updated_at: now } : x));
    libByUser.set(userId, list);
    return { list, openedAt: now, item: list.find((x) => x.id === String(titleId)) || null };
  },
};

export const sanitizeLibraryPayload = (payload = {}) => {
  const id = String(payload.id ?? payload.titleId ?? "").trim();
  const status = VALID_STATUS.has(payload.status) ? payload.status : "Planning";
  return {
    id,
    status,
    progress: normalizeProgress(payload.progress),
    score: normalizeScore(payload.score),
    notes: sanitizeText(payload.notes || ""),
    link: sanitizeLink(payload.saved_link || payload.link || ""),
  };
};

export const sanitizeLibraryPatch = (payload = {}) => {
  const out = {};
  if (payload.status !== undefined) out.status = VALID_STATUS.has(payload.status) ? payload.status : "Planning";
  if (payload.progress !== undefined) out.progress = normalizeProgress(payload.progress);
  if (payload.score !== undefined) out.score = normalizeScore(payload.score);
  if (payload.notes !== undefined) out.notes = sanitizeText(payload.notes || "");
  if (payload.saved_link !== undefined || payload.link !== undefined) out.link = sanitizeLink(payload.saved_link || payload.link || "");
  return out;
};

export const listLibrary = async (userId) => {
  if (!isDbAvailable()) return memoryStore.list(userId);
  try {
    const rows = await db.query(
      `SELECT title_id, status, progress, score, notes, saved_link, last_opened_at, created_at, updated_at
       FROM user_library
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [userId],
    );
    return rows.map(mapDbRowToClient);
  } catch (err) {
    warn("MySQL list failed, falling back to in-memory", err);
    return memoryStore.list(userId);
  }
};

export const upsertLibraryItem = async (userId, payload) => {
  if (!isDbAvailable()) return memoryStore.upsert(userId, payload);
  try {
    await db.query(
      `INSERT INTO user_library (user_id, title_id, status, progress, score, notes, saved_link)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         progress = VALUES(progress),
         score = VALUES(score),
         notes = VALUES(notes),
         saved_link = VALUES(saved_link),
         updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        payload.id,
        payload.status,
        payload.progress,
        payload.score === "" ? null : payload.score,
        payload.notes || null,
        payload.link || null,
      ],
    );
    return await listLibrary(userId);
  } catch (err) {
    warn("MySQL upsert failed, falling back to in-memory", err);
    return memoryStore.upsert(userId, payload);
  }
};

export const updateLibraryItem = async (userId, titleId, patch) => {
  if (!isDbAvailable()) return memoryStore.update(userId, titleId, patch);
  try {
    const fields = [];
    const params = [];
    if (patch.status !== undefined) { fields.push("status = ?"); params.push(patch.status); }
    if (patch.progress !== undefined) { fields.push("progress = ?"); params.push(patch.progress); }
    if (patch.score !== undefined) { fields.push("score = ?"); params.push(patch.score === "" ? null : patch.score); }
    if (patch.notes !== undefined) { fields.push("notes = ?"); params.push(patch.notes || null); }
    if (patch.link !== undefined) { fields.push("saved_link = ?"); params.push(patch.link || null); }
    fields.push("updated_at = CURRENT_TIMESTAMP");
    if (fields.length > 1) {
      await db.query(`UPDATE user_library SET ${fields.join(", ")} WHERE user_id = ? AND title_id = ?`, [...params, userId, titleId]);
    }
    return await listLibrary(userId);
  } catch (err) {
    warn("MySQL update failed, falling back to in-memory", err);
    return memoryStore.update(userId, titleId, patch);
  }
};

export const removeLibraryItem = async (userId, titleId) => {
  if (!isDbAvailable()) return memoryStore.remove(userId, titleId);
  try {
    await db.query("DELETE FROM user_library WHERE user_id = ? AND title_id = ?", [userId, titleId]);
    return await listLibrary(userId);
  } catch (err) {
    warn("MySQL delete failed, falling back to in-memory", err);
    return memoryStore.remove(userId, titleId);
  }
};

export const openLibraryLink = async (userId, titleId) => {
  if (!isDbAvailable()) return memoryStore.openLink(userId, titleId);
  try {
    await db.query(
      `UPDATE user_library
       SET last_opened_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND title_id = ?`,
      [userId, titleId],
    );
    const rows = await db.query(
      `SELECT title_id, status, progress, score, notes, saved_link, last_opened_at, created_at, updated_at
       FROM user_library
       WHERE user_id = ? AND title_id = ?
       LIMIT 1`,
      [userId, titleId],
    );
    const item = rows[0] ? mapDbRowToClient(rows[0]) : null;
    const openedAt = item?.last_opened_at || new Date().toISOString();
    return { list: await listLibrary(userId), openedAt, item };
  } catch (err) {
    warn("MySQL open-link failed, falling back to in-memory", err);
    return memoryStore.openLink(userId, titleId);
  }
};

export const getLibrarySourceStatus = async () => {
  const status = await testDbConnection();
  return {
    source: status.dbConnected ? "mysql" : "memory",
    usingFallback: !status.dbConnected,
  };
};
