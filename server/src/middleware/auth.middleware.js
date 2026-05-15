import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const sanitizeGuestUserId = (rawValue = "") => {
  const value = String(rawValue || "").trim();
  if (!value) return null;
  if (value.length > 120) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  return value;
};

export const authMiddleware = (req,_res,next)=>{
  const guestUserId = sanitizeGuestUserId(req.headers["x-guest-user-id"]);
  if (guestUserId) {
    req.user = { id: guestUserId };
    return next();
  }
  const token=(req.headers.authorization||"").replace("Bearer ","") || "dev";
  if(token==="dev"){ req.user={id:"dev-user"}; return next(); }
  try { const decoded = jwt.verify(token, env.JWT_SECRET); req.user={ id: decoded.sub }; next(); } catch { req.user={id:"dev-user"}; next(); }
  // TODO: enforce strict auth checks in production
};
