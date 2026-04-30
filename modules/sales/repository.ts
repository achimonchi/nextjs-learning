import { getPool } from "@/infra/db/postgres";
import { eachDateInclusive } from "@/lib/calendar-date";
import type {
  OrderSummary,
  OrdersDashboardPayload,
  PieSlice,
  TimelinePoint,
  TimelineUnit,
} from "./model";

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function toIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toYmd(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

type OrderTopRow = {
  id: number;
  salesorder_no: string;
  customer_name: string;
  channel_name: string;
  status: string;
  grand_total: number;
  transaction_date: Date | null;
  created_date: Date | null;
};

function mapOrderSummary(row: OrderTopRow): OrderSummary {
  return {
    id: row.id,
    salesorder_no: row.salesorder_no,
    customer_name: row.customer_name,
    channel_name: row.channel_name,
    status: row.status,
    grand_total: toNumber(row.grand_total),
    transaction_date: toIso(row.transaction_date),
    created_date: toIso(row.created_date),
  };
}

export async function listTopOrdersInRange(
  timeZone: string,
  startDate: string,
  endDate: string,
  limit: number = 10,
): Promise<OrderSummary[]> {
  const pool = getPool();
  const capped = Math.min(Math.max(1, limit), 100);

  const { rows } = await pool.query<OrderTopRow>(
    `
    SELECT
      o.id,
      o.salesorder_no,
      o.customer_name,
      o.channel_name,
      o.status,
      o.grand_total,
      o.transaction_date,
      o.created_date
    FROM public.orders o
    WHERE o.created_date IS NOT NULL
      AND (o.created_date AT TIME ZONE $2)::date BETWEEN $3::date AND $4::date
    ORDER BY o.grand_total DESC
    LIMIT $1
    `,
    [capped, timeZone, startDate, endDate],
  );

  return rows.map(mapOrderSummary);
}

type PieRow = {
  channel_name: string;
  order_count: string | number;
  revenue: string | number | null;
};

export async function getPieByChannelInRange(
  timeZone: string,
  startDate: string,
  endDate: string,
): Promise<PieSlice[]> {
  const pool = getPool();

  const { rows } = await pool.query<PieRow>(
    `
    SELECT
      o.channel_name,
      COUNT(*)::int AS order_count,
      COALESCE(SUM(o.grand_total), 0) AS revenue
    FROM public.orders o
    WHERE o.created_date IS NOT NULL
      AND (o.created_date AT TIME ZONE $1)::date BETWEEN $2::date AND $3::date
    GROUP BY o.channel_name
    ORDER BY order_count DESC
    `,
    [timeZone, startDate, endDate],
  );

  return rows.map((r) => ({
    channel_name: r.channel_name,
    order_count: toNumber(r.order_count),
    revenue: toNumber(r.revenue),
  }));
}

type HourlyRow = {
  hour: string | number;
  order_count: string | number;
  hour_revenue: string | number | null;
};

async function getTimelineHourly(timeZone: string, dayDate: string): Promise<TimelinePoint[]> {
  const pool = getPool();

  const { rows } = await pool.query<HourlyRow>(
    `
    SELECT
      (EXTRACT(HOUR FROM (o.created_date AT TIME ZONE $1)))::int AS hour,
      COUNT(*)::int AS order_count,
      COALESCE(SUM(o.grand_total), 0) AS hour_revenue
    FROM public.orders o
    WHERE o.created_date IS NOT NULL
      AND (o.created_date AT TIME ZONE $1)::date = $2::date
    GROUP BY 1
    ORDER BY 1
    `,
    [timeZone, dayDate],
  );

  const byHour = new Map<number, { order_count: number; revenue: number }>();
  for (const r of rows) {
    const h = Math.min(23, Math.max(0, Math.floor(toNumber(r.hour))));
    byHour.set(h, {
      order_count: toNumber(r.order_count),
      revenue: toNumber(r.hour_revenue),
    });
  }

  const timeline: TimelinePoint[] = [];
  let cumulative = 0;
  for (let hour = 0; hour < 24; hour += 1) {
    const slot = byHour.get(hour) ?? { order_count: 0, revenue: 0 };
    cumulative += slot.revenue;
    timeline.push({
      slot: hour,
      label: `${hour.toString().padStart(2, "0")}:00`,
      order_count: slot.order_count,
      revenue: slot.revenue,
      cumulative_revenue: cumulative,
    });
  }

  return timeline;
}

type DailyRow = {
  bucket_date: Date | string;
  order_count: string | number;
  day_revenue: string | number | null;
};

async function getTimelineDaily(
  timeZone: string,
  startDate: string,
  endDate: string,
): Promise<TimelinePoint[]> {
  const pool = getPool();

  const { rows } = await pool.query<DailyRow>(
    `
    SELECT
      (o.created_date AT TIME ZONE $1)::date AS bucket_date,
      COUNT(*)::int AS order_count,
      COALESCE(SUM(o.grand_total), 0) AS day_revenue
    FROM public.orders o
    WHERE o.created_date IS NOT NULL
      AND (o.created_date AT TIME ZONE $1)::date BETWEEN $2::date AND $3::date
    GROUP BY 1
    ORDER BY 1
    `,
    [timeZone, startDate, endDate],
  );

  const byDay = new Map<string, { order_count: number; revenue: number }>();
  for (const r of rows) {
    const key = toYmd(r.bucket_date);
    byDay.set(key, {
      order_count: toNumber(r.order_count),
      revenue: toNumber(r.day_revenue),
    });
  }

  const days = eachDateInclusive(startDate, endDate);
  const timeline: TimelinePoint[] = [];
  let cumulative = 0;
  let slot = 0;
  for (const day of days) {
    const d = byDay.get(day) ?? { order_count: 0, revenue: 0 };
    cumulative += d.revenue;
    timeline.push({
      slot,
      label: day,
      order_count: d.order_count,
      revenue: d.revenue,
      cumulative_revenue: cumulative,
    });
    slot += 1;
  }

  return timeline;
}

export async function getOrdersDashboardPayload(input: {
  timeZone: string;
  startDate: string;
  endDate: string;
}): Promise<OrdersDashboardPayload> {
  const { timeZone, startDate, endDate } = input;
  const singleDay = startDate === endDate;
  const timeline_unit: TimelineUnit = singleDay ? "hour" : "day";

  const [top_orders, pie_by_channel, timeline] = await Promise.all([
    listTopOrdersInRange(timeZone, startDate, endDate, 10),
    getPieByChannelInRange(timeZone, startDate, endDate),
    singleDay
      ? getTimelineHourly(timeZone, startDate)
      : getTimelineDaily(timeZone, startDate, endDate),
  ]);

  return { top_orders, pie_by_channel, timeline, timeline_unit };
}
