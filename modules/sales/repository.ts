import { getPool } from "@/infra/db/postgres";
import type { Sale } from "./model";

const DEFAULT_LIMIT = 100;

type SaleRow = {
  id: string;
  total_amount: string;
  created_at: Date;
};

function mapRow(row: SaleRow): Sale {
  return {
    id: row.id,
    total_amount: row.total_amount,
    created_at: row.created_at,
  };
}

/**
 * Lists sales rows ordered by newest first. Adjust SQL if your table/columns differ.
 */
export async function listSales(limit: number = DEFAULT_LIMIT): Promise<Sale[]> {
  const pool = getPool();
  const capped = Math.min(Math.max(1, limit), 500);

  const { rows } = await pool.query<SaleRow>(
    `
    SELECT id, total_amount, created_at
    FROM sales
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [capped],
  );

  return rows.map(mapRow);
}
