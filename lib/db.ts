import { Pool } from "pg";
import { SCHEMA_STATEMENTS } from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __ff75Pool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __ff75Migration: Promise<void> | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 8000,
    statement_timeout: 10000,
    query_timeout: 10000,
  });
}

export function getPool(): Pool {
  if (!global.__ff75Pool) {
    global.__ff75Pool = createPool();
  }
  return global.__ff75Pool;
}

function ensureSchema(): Promise<void> {
  if (!global.__ff75Migration) {
    const pool = getPool();
    global.__ff75Migration = (async () => {
      for (const statement of SCHEMA_STATEMENTS) {
        await pool.query(statement);
      }
    })().catch((err) => {
      global.__ff75Migration = undefined;
      throw err;
    });
  }
  return global.__ff75Migration;
}

export async function query<T = unknown>(text: string, params?: unknown[]) {
  await ensureSchema();
  const result = await getPool().query(text, params);
  return result.rows as T[];
}
