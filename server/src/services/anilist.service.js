const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const REQUEST_TIMEOUT_MS = 8000;

const TYPE_MAP = {
  anime: "ANIME",
  manga: "MANGA",
  manhwa: "MANGA",
};

const SORT_MAP = {
  Popularity: "POPULARITY_DESC",
  Rating: "SCORE_DESC",
  Latest: "START_DATE_DESC",
};

const STATUS_IN_MAP = {
  ongoing: "RELEASING",
  completed: "FINISHED",
  upcoming: "NOT_YET_RELEASED",
};

const stripHtml = (text = "") => String(text).replace(/<[^>]*>/g, " ");
const collapseWhitespace = (text = "") => String(text).replace(/\s+/g, " ").trim();

const decodeHtmlEntities = (text = "") =>
  String(text)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const cleanText = (text = "") => collapseWhitespace(decodeHtmlEntities(stripHtml(text)));

const mapStatus = (anilistStatus = "") => {
  if (anilistStatus === "FINISHED") return "Completed";
  if (anilistStatus === "RELEASING") return "Ongoing";
  if (anilistStatus === "NOT_YET_RELEASED") return "Upcoming";
  return "Ongoing";
};

const toTitleType = (anilistType = "", countryOfOrigin = "") => {
  if (anilistType === "ANIME") return "Anime";
  if (anilistType === "MANGA") return String(countryOfOrigin || "").toUpperCase() === "KR" ? "Manhwa" : "Manga";
  return "Anime";
};

const pickTitle = (titles = {}) => titles.userPreferred || titles.english || titles.romaji || titles.native || "Untitled";

const pickAltTitle = (titles = {}, pickedTitle = "") => {
  const options = [titles.english, titles.romaji, titles.native].filter(Boolean);
  return options.find((value) => value !== pickedTitle) || pickedTitle;
};

const toRating = (averageScore) => {
  const score = Number(averageScore || 0);
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.round(score) / 10;
};

const toTotal = (itemType, episodes, chapters) => {
  if (itemType === "Anime") return Number(episodes || 0);
  return Number(chapters || 0);
};

const normalizeAniListMedia = (media) => {
  const itemType = toTitleType(media.type, media.countryOfOrigin);
  const title = pickTitle(media.title);
  return {
    id: `anilist-${media.id}`,
    externalId: media.id,
    source: "anilist",
    title,
    alt: pickAltTitle(media.title, title),
    type: itemType,
    status: mapStatus(media.status),
    total: toTotal(itemType, media.episodes, media.chapters),
    rating: toRating(media.averageScore),
    genres: Array.isArray(media.genres) ? media.genres : [],
    synopsis: cleanText(media.description || ""),
    cover: media.coverImage?.extraLarge || media.coverImage?.large || "",
    banner: media.bannerImage || "",
    popularity: Number(media.popularity || 0),
    year: Number(media.seasonYear || 0),
    reason: `Matched AniList search for "${title}"`,
    siteUrl: media.siteUrl || "",
  };
};

const toType = (type = "") => {
  const key = String(type || "").trim().toLowerCase();
  return TYPE_MAP[key] || null;
};

const toStatus = (status = "") => {
  const key = String(status || "").trim().toLowerCase();
  return STATUS_IN_MAP[key] || null;
};

export async function searchAniListTitles({ q, type, status, genre, sort, page = 1, perPage = 20 } = {}) {
  const searchValue = q ? String(q).trim() : null;
  const typeValue = toType(type);
  const statusValue = toStatus(status);
  const genreValue = genre ? String(genre).trim() : null;
  const sortValue = SORT_MAP[sort] || SORT_MAP.Popularity;

  const baseVars = ["$page: Int", "$perPage: Int"];
  const pageArgs = ["page: $page", "perPage: $perPage"];
  const mediaArgs = [];
  const variables = {
    page: Number(page) || 1,
    perPage: Number(perPage) || 20,
  };

  if (searchValue) {
    baseVars.push("$search: String");
    mediaArgs.push("search: $search");
    variables.search = searchValue;
  }
  if (typeValue) {
    baseVars.push("$type: MediaType");
    mediaArgs.push("type: $type");
    variables.type = typeValue;
  }
  if (statusValue) {
    baseVars.push("$status: MediaStatus");
    mediaArgs.push("status: $status");
    variables.status = statusValue;
  }
  if (genreValue) {
    baseVars.push("$genre: String");
    mediaArgs.push("genre: $genre");
    variables.genre = genreValue;
  }
  if (sortValue) {
    baseVars.push("$sort: [MediaSort]");
    mediaArgs.push("sort: $sort");
    variables.sort = [sortValue];
  }

  const query = `
    query SearchMedia(${baseVars.join(", ")}) {
      Page(${pageArgs.join(", ")}) {
        media(${mediaArgs.join(", ")}) {
          id
          idMal
          title { romaji english native userPreferred }
          type
          status
          description(asHtml: false)
          coverImage { large extraLarge color }
          bannerImage
          episodes
          chapters
          averageScore
          popularity
          genres
          seasonYear
          countryOfOrigin
          siteUrl
        }
      }
    }
  `;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`AniList request failed with HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
      throw new Error(payload.errors[0]?.message || "AniList GraphQL error");
    }

    const media = payload?.data?.Page?.media;
    if (!Array.isArray(media)) return [];
    if (media.length > 0) return media.map(normalizeAniListMedia);

    if (searchValue) {
      const retryVariables = { ...variables };
      delete retryVariables.sort;
      const retryBaseVars = baseVars.filter((v) => !v.includes("$sort"));
      const retryMediaArgs = mediaArgs.filter((a) => a !== "sort: $sort");
      const retryQuery = `
        query SearchMedia(${retryBaseVars.join(", ")}) {
          Page(${pageArgs.join(", ")}) {
            media(${retryMediaArgs.join(", ")}) {
              id
              idMal
              title { romaji english native userPreferred }
              type
              status
              description(asHtml: false)
              coverImage { large extraLarge color }
              bannerImage
              episodes
              chapters
              averageScore
              popularity
              genres
              seasonYear
              countryOfOrigin
              siteUrl
            }
          }
        }
      `;
      const retryResponse = await fetch(ANILIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: retryQuery, variables: retryVariables }),
        signal: controller.signal,
      });
      if (!retryResponse.ok) return [];
      const retryPayload = await retryResponse.json();
      const retryMedia = retryPayload?.data?.Page?.media;
      if (!Array.isArray(retryMedia)) return [];
      return retryMedia.map(normalizeAniListMedia);
    }

    return [];
  } finally {
    clearTimeout(timer);
  }
}
