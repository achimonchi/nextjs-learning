import { Pool } from "pg";
import { config } from "@/infra/config";

const globalForPool = globalThis as unknown as {
  pgPool?: Pool;
};

function createPool(): Pool {
  const connectionString = config.database.url;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (see env.example).",
    );
  }

  const { max, min, idleTimeoutMillis, connectionTimeoutMillis } =
    config.database.pool;
  const minCapped = Math.min(min, max);

  return new Pool({
    connectionString,
    max,
    min: minCapped,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  });
}

/**
 * Singleton Pool for PostgreSQL. Reuses one pool in dev (HMR) via globalThis.
 *
 * `pg` Pool mapping: **max** ≈ max open connections; **idleTimeoutMillis** = how long
 * a client may sit unused before being closed (there is no separate “max idle count” —
 * pool size is capped by **max**, idle eviction by time).
 */
export function getPool(): Pool {
  if (!globalForPool.pgPool) {
    globalForPool.pgPool = createPool();
  }
  return globalForPool.pgPool;
}
