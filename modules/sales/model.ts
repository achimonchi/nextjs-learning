/**
 * Types for `public.orders` dashboard (subset of columns used in UI).
 * Timestamps are ISO strings after crossing the server-action boundary.
 */
export interface OrderSummary {
  id: number;
  salesorder_no: string;
  customer_name: string;
  channel_name: string;
  status: string;
  grand_total: number;
  transaction_date: string | null;
  created_date: string | null;
}

export interface PieSlice {
  channel_name: string;
  order_count: number;
  revenue: number;
}

/** One bucket for the bar+line chart (hour of day, or calendar day). */
export interface TimelinePoint {
  /** Sort key: 0–23 for hourly mode; unused ordering for daily (use label). */
  slot: number;
  label: string;
  order_count: number;
  revenue: number;
  cumulative_revenue: number;
}

export type TimelineUnit = "hour" | "day";

export interface OrdersDashboardPayload {
  top_orders: OrderSummary[];
  pie_by_channel: PieSlice[];
  timeline: TimelinePoint[];
  timeline_unit: TimelineUnit;
}
