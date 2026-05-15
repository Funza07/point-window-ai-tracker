export const typeColor = (type) => type === "Anime" ? "#e879f9" : type === "Manga" ? "#38bdf8" : "#a78bfa";
export const typeGlow = (type) => type === "Anime" ? "rgba(232,121,249,0.4)" : type === "Manga" ? "rgba(56,189,248,0.4)" : "rgba(167,139,250,0.4)";
export const progressLabel = (type) => (type === "Anime" ? "Episode" : type === "Manga" || type === "Manhwa" ? "Chapter" : "Progress");

