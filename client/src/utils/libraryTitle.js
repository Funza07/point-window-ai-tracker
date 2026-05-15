import { mockTitles } from "../data/mockTitles";

export const resolveLibraryTitle = (item) => {
  const fromItem = item && item.title ? item : null;
  return fromItem || mockTitles.find((t) => t.id === item?.id) || null;
};

export const buildLibraryPayload = (title, overrides = {}) => ({
  id: title?.id || overrides.id || "",
  title: title?.title || "",
  alt: title?.alt || "",
  type: title?.type || "",
  status: title?.status || "",
  total: Number(title?.total || 0),
  rating: Number(title?.rating || 0),
  genres: Array.isArray(title?.genres) ? title.genres : [],
  synopsis: title?.synopsis || "",
  cover: title?.cover || "",
  banner: title?.banner || "",
  popularity: Number(title?.popularity || 0),
  year: Number(title?.year || 0),
  reason: title?.reason || "",
  source: title?.source || "mock",
  externalId: title?.externalId ?? null,
  siteUrl: title?.siteUrl || "",
  libraryStatus: overrides.libraryStatus || overrides.status || "Watching",
  progress: Number(overrides.progress || 0),
  score: overrides.score ?? "",
  notes: overrides.notes || "",
  link: overrides.link || "",
});
