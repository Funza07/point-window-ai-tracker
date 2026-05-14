import { env } from "./env.js";

const parseOrigins = () => {
  const defaults = ["http://localhost:5173"];
  const fromClientOrigin = (env.CLIENT_ORIGIN || "").split(",").map((x) => x.trim()).filter(Boolean);
  const fromAllowedOrigins = (env.ALLOWED_ORIGINS || "").split(",").map((x) => x.trim()).filter(Boolean);
  return [...new Set([...defaults, ...fromClientOrigin, ...fromAllowedOrigins])];
};

const allowlist = parseOrigins();

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowlist.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
};
