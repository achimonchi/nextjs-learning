function parsePoolInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export const config = {
  beesearch: {
    apiKey: process.env.BEESEARCH_API_KEY,
    url: process.env.BEESEARCH_URL,
  },
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      /** Max clients in pool (like max open connections). Default 10. */
      max: Math.max(1, parsePoolInt(process.env.DATABASE_POOL_MAX, 10)),
      /** Min clients kept open. Default 0. Must be <= max. */
      min: parsePoolInt(process.env.DATABASE_POOL_MIN, 0),
      /** Close idle clients after this many ms in the pool. Default 10000. */
      idleTimeoutMillis: parsePoolInt(
        process.env.DATABASE_POOL_IDLE_TIMEOUT_MS,
        10_000,
      ),
      /** Max wait (ms) to acquire a connection from the pool; 0 = wait indefinitely. */
      connectionTimeoutMillis: parsePoolInt(
        process.env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
        0,
      ),
    },
  },
};