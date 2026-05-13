import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const authMiddleware = (req,_res,next)=>{
  const token=(req.headers.authorization||"").replace("Bearer ","") || "dev";
  if(token==="dev"){ req.user={id:"dev-user"}; return next(); }
  try { const decoded = jwt.verify(token, env.JWT_SECRET); req.user={ id: decoded.sub }; next(); } catch { req.user={id:"dev-user"}; next(); }
  // TODO: enforce strict auth checks in production
};
