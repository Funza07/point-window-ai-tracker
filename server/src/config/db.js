import mysql from "mysql2/promise";
import { env } from "./env.js";

const hasDbConfig = Boolean(env.DB_HOST && env.DB_USER && env.DB_NAME);

let pool = null;
if (hasDbConfig) {
  pool = mysql.createPool({
    host: env.DB_HOST,
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER,
    password: env.DB_PASSWORD || "",
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const isDbAvailable = () => Boolean(pool);

export const db = {
  pool,
  async query(sql, params = []) {
    if (!pool) throw new Error("DB not configured");
    const [rows] = await pool.query(sql, params);
    return rows;
  },
};
