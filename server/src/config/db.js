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
export const isDbConfigured = () => hasDbConfig;

export const testDbConnection = async () => {
  if (!pool) {
    return {
      dbConfigured: hasDbConfig,
      dbConnected: false,
      usingFallback: true,
      dbHostPresent: Boolean(env.DB_HOST),
      dbNamePresent: Boolean(env.DB_NAME),
      dbUserPresent: Boolean(env.DB_USER),
      errorCode: hasDbConfig ? "DB_POOL_UNAVAILABLE" : "DB_NOT_CONFIGURED",
      errorMessage: hasDbConfig ? "Database pool is unavailable" : "Database configuration is missing",
    };
  }
  try {
    await pool.query("SELECT 1 AS ok");
    return {
      dbConfigured: true,
      dbConnected: true,
      usingFallback: false,
      dbHostPresent: Boolean(env.DB_HOST),
      dbNamePresent: Boolean(env.DB_NAME),
      dbUserPresent: Boolean(env.DB_USER),
    };
  } catch (err) {
    return {
      dbConfigured: true,
      dbConnected: false,
      usingFallback: true,
      dbHostPresent: Boolean(env.DB_HOST),
      dbNamePresent: Boolean(env.DB_NAME),
      dbUserPresent: Boolean(env.DB_USER),
      errorCode: err?.code || "DB_CONNECTION_FAILED",
      errorMessage: err?.message || "Database connection failed",
    };
  }
};

export const db = {
  pool,
  async query(sql, params = []) {
    if (!pool) throw new Error("DB not configured");
    const [rows] = await pool.query(sql, params);
    return rows;
  },
};
