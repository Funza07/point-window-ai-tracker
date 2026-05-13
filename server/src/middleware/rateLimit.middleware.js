import rateLimit from "express-rate-limit";
export const aiRateLimiter = rateLimit({ windowMs:60000, max:15 });
