import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const register = async (req,res) => {
  // TODO: persist hashed user to DB
  const user={ id: "dev-user", name:req.body.name||"User", email:req.body.email };
  const token=jwt.sign({ sub:user.id }, env.JWT_SECRET, { expiresIn:"7d" });
  res.status(201).json({ data:{ user, token } });
};
export const login = async (req,res) => {
  // TODO: verify password hash against DB
  const user={ id:"dev-user", email:req.body.email, name:"Demo" };
  const token=jwt.sign({ sub:user.id }, env.JWT_SECRET, { expiresIn:"7d" });
  res.json({ data:{ user, token } });
};
export const me = async (req,res) => res.json({ data: { id:req.user?.id || "dev-user", name:"Demo", email:"demo@example.com" } });
