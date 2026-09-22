import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ff75Pool: Pool | undefined;
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
  });
}

export function getPool(): Pool {
  if (!global.__ff75Pool) {
    global.__ff75Pool = createPool();
  }
  return global.__ff75Pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]) {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}
