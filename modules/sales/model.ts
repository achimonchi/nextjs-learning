/**
 * Row shape for the `sales` table. Align field names with your PostgreSQL schema.
 */
export interface Sale {
  id: string;
  total_amount: string;
  created_at: Date;
}
