import dotenv from "dotenv";
dotenv.config();
export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
  DB_HOST: process.env.DB_HOST || "",
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",
  AI_PROVIDER_API_KEY: process.env.AI_PROVIDER_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  ANILIST_API_URL: process.env.ANILIST_API_URL || "https://graphql.anilist.co",
  JIKAN_API_URL: process.env.JIKAN_API_URL || "https://api.jikan.moe/v4",
  MANGADEX_API_URL: process.env.MANGADEX_API_URL || "https://api.mangadex.org",
};
