import { db, isDbAvailable } from "../config/db.js";
import { sanitizeText } from "../utils/sanitize.js";

const titleMemoryCache = new Map();

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalize = (v = "") => String(v ?? "").trim().toLowerCase();

export const normalizeTitleSnapshot = (title = {}) => {
  const id = String(title.id || "").trim();
  if (!id) return null;

  const genresInput = Array.isArray(title.genres) ? title.genres : [];
  const genres = genresInput.map((g) => String(g).trim()).filter(Boolean);

  return {
    id,
    externalId: title.externalId === undefined || title.externalId === null ? null : String(title.externalId),
    source: String(title.source || "mock").trim() || "mock",
    title: sanitizeText(title.title || ""),
    alt: sanitizeText(title.alt || ""),
    type: sanitizeText(title.type || ""),
    status: sanitizeText(title.status || ""),
    total: Math.max(0, Math.floor(toNumber(title.total, 0))),
    rating: (() => {
      const rating = toNumber(title.rating, null);
      if (rating === null) return null;
      if (rating < 0 || rating > 10) return null;
      return Math.round(rating * 10) / 10;
    })(),
    genres,
    synopsis: sanitizeText(title.synopsis || ""),
    cover: String(title.cover || "").trim(),
    banner: String(title.banner || "").trim(),
    popularity: Math.max(0, Math.floor(toNumber(title.popularity, 0))),
    year: Math.max(0, Math.floor(toNumber(title.year, 0))),
    reason: sanitizeText(title.reason || ""),
    siteUrl: String(title.siteUrl || "").trim(),
  };
};

export const normalizeCachedTitleRow = (row = {}) => ({
  id: row.id,
  externalId: row.external_id === null ? null : Number.isFinite(Number(row.external_id)) ? Number(row.external_id) : row.external_id,
  source: row.source || "mock",
  title: row.title || "",
  alt: row.alt_title || "",
  type: row.type || "",
  status: row.status || "",
  total: Number(row.total_count || 0),
  rating: row.rating === null ? null : Number(row.rating),
  genres: (() => {
    if (Array.isArray(row.genres)) return row.genres;
    if (!row.genres) return [];
    try {
      const parsed = typeof row.genres === "string" ? JSON.parse(row.genres) : row.genres;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })(),
  synopsis: row.synopsis || "",
  cover: row.cover_url || "",
  banner: row.banner_url || "",
  popularity: Number(row.popularity || 0),
  year: Number(row.year || 0),
  reason: row.reason || "",
  siteUrl: row.site_url || "",
});

const mapRowToTitle = (row) => normalizeCachedTitleRow(row);

export const upsertTitleSnapshot = async (titleInput) => {
  const title = normalizeTitleSnapshot(titleInput);
  if (!title || !title.title || !title.type) return null;

  titleMemoryCache.set(title.id, title);

  if (!isDbAvailable()) return title;
  try {
    await db.query(
      `INSERT INTO titles (
         id, external_id, source, title, alt_title, type, status, total_count, rating, genres, synopsis,
         cover_url, banner_url, popularity, year, reason, site_url
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         external_id = VALUES(external_id),
         source = VALUES(source),
         title = VALUES(title),
         alt_title = VALUES(alt_title),
         type = VALUES(type),
         status = VALUES(status),
         total_count = VALUES(total_count),
         rating = VALUES(rating),
         genres = VALUES(genres),
         synopsis = VALUES(synopsis),
         cover_url = VALUES(cover_url),
         banner_url = VALUES(banner_url),
         popularity = VALUES(popularity),
         year = VALUES(year),
         reason = VALUES(reason),
         site_url = VALUES(site_url),
         updated_at = CURRENT_TIMESTAMP`,
      [
        title.id,
        title.externalId,
        title.source,
        title.title,
        title.alt || null,
        title.type,
        title.status || null,
        title.total,
        title.rating,
        JSON.stringify(title.genres || []),
        title.synopsis || null,
        title.cover || null,
        title.banner || null,
        title.popularity,
        title.year,
        title.reason || null,
        title.siteUrl || null,
      ],
    );
    return title;
  } catch {
    return title;
  }
};

export const upsertManyTitleSnapshots = async (titles = []) => {
  const items = Array.isArray(titles) ? titles : [];
  const saved = [];
  for (const item of items) {
    const normalized = await upsertTitleSnapshot(item);
    if (normalized) saved.push(normalized);
  }
  return saved;
};

export const getTitleById = async (id) => {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) return null;

  if (isDbAvailable()) {
    try {
      const rows = await db.query("SELECT * FROM titles WHERE id = ? LIMIT 1", [normalizedId]);
      if (rows[0]) return mapRowToTitle(rows[0]);
    } catch {
      // fallback below
    }
  }
  return titleMemoryCache.get(normalizedId) || null;
};

export const getTitlesByIds = async (ids = []) => {
  const uniqueIds = [...new Set((ids || []).map((id) => String(id || "").trim()).filter(Boolean))];
  if (!uniqueIds.length) return [];

  if (isDbAvailable()) {
    try {
      const placeholders = uniqueIds.map(() => "?").join(", ");
      const rows = await db.query(`SELECT * FROM titles WHERE id IN (${placeholders})`, uniqueIds);
      return rows.map(mapRowToTitle);
    } catch {
      // fallback below
    }
  }

  return uniqueIds.map((id) => titleMemoryCache.get(id)).filter(Boolean);
};

export const getTitleCacheCount = async () => {
  if (isDbAvailable()) {
    try {
      const rows = await db.query("SELECT COUNT(*) AS count FROM titles");
      return Number(rows?.[0]?.count || 0);
    } catch {
      // fallback below
    }
  }
  return titleMemoryCache.size;
};

export const getAllCachedTitles = async (limit = 200) => {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 200, 1000));
  if (isDbAvailable()) {
    try {
      const rows = await db.query(
        "SELECT * FROM titles ORDER BY updated_at DESC LIMIT ?",
        [safeLimit],
      );
      return rows.map(mapRowToTitle);
    } catch {
      // fallback below
    }
  }
  return [...titleMemoryCache.values()].slice(0, safeLimit);
};

export const searchCachedTitles = async ({ q = "", type = "", status = "", genre = "", sort = "Popularity", limit = 20 } = {}) => {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  const nq = normalize(q);
  const ntype = normalize(type);
  const nstatus = normalize(status);
  const ngenre = normalize(genre);

  const applyLocalFilter = (rows = []) => {
    let list = rows.map((row) => normalizeCachedTitleRow(row)).filter((t) => t?.id);
    if (nq) {
      list = list.filter((t) => {
        const hay = `${t.title} ${t.alt} ${t.type} ${Array.isArray(t.genres) ? t.genres.join(" ") : ""} ${t.synopsis}`.toLowerCase();
        return hay.includes(nq);
      });
    }
    if (ntype && ntype !== "all") list = list.filter((t) => normalize(t.type) === ntype);
    if (nstatus && nstatus !== "all") list = list.filter((t) => normalize(t.status) === nstatus);
    if (ngenre && ngenre !== "all") {
      list = list.filter((t) => (Array.isArray(t.genres) ? t.genres : []).some((g) => normalize(g) === ngenre));
    }

    if (sort === "Rating") list = [...list].sort((a, b) => toNumber(b.rating, 0) - toNumber(a.rating, 0));
    else if (sort === "Latest") list = [...list].sort((a, b) => toNumber(b.year, 0) - toNumber(a.year, 0));
    else list = [...list].sort((a, b) => toNumber(b.popularity, 0) - toNumber(a.popularity, 0));
    return list.slice(0, safeLimit);
  };

  if (isDbAvailable()) {
    try {
      const where = [];
      const params = [];
      if (nq) {
        where.push("(LOWER(title) LIKE ? OR LOWER(COALESCE(alt_title, '')) LIKE ? OR LOWER(COALESCE(type, '')) LIKE ? OR LOWER(COALESCE(synopsis, '')) LIKE ? OR LOWER(COALESCE(CAST(genres AS CHAR), '')) LIKE ?)");
        const like = `%${nq}%`;
        params.push(like, like, like, like, like);
      }
      if (ntype && ntype !== "all") {
        where.push("LOWER(COALESCE(type, '')) = ?");
        params.push(ntype);
      }
      if (nstatus && nstatus !== "all") {
        where.push("LOWER(COALESCE(status, '')) = ?");
        params.push(nstatus);
      }
      if (ngenre && ngenre !== "all") {
        where.push("LOWER(COALESCE(CAST(genres AS CHAR), '')) LIKE ?");
        params.push(`%${ngenre}%`);
      }

      const orderClause =
        sort === "Rating"
          ? "ORDER BY COALESCE(rating, 0) DESC, updated_at DESC"
          : sort === "Latest"
            ? "ORDER BY COALESCE(year, 0) DESC, updated_at DESC"
            : "ORDER BY COALESCE(popularity, 0) DESC, updated_at DESC";

      const sql = `SELECT * FROM titles ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ${orderClause} LIMIT ?`;
      const rows = await db.query(sql, [...params, safeLimit]);
      return applyLocalFilter(rows);
    } catch {
      return [];
    }
  }

  return applyLocalFilter([...titleMemoryCache.values()]);
};
