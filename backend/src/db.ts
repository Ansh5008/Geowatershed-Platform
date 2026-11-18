import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://watershed:watershed@localhost:5432/watershed",
  connectionTimeoutMillis: 3000,
});

// Avoid crashing server if postgres is offline or disconnects
pool.on("error", (err) => {
  console.warn("PostgreSQL Pool Notice:", err.message);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
