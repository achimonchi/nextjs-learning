"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useOrdersStore } from "@/stores/orders-store";

const PIE_COLORS = [
  "#27272a",
  "#52525b",
  "#71717a",
  "#a1a1aa",
  "#d4d4d8",
  "#78716c",
  "#44403c",
];

function formatIdr(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function OrdersCharts() {
  const pieByChannel = useOrdersStore((s) => s.pieByChannel);
  const timeline = useOrdersStore((s) => s.timeline);
  const timelineUnit = useOrdersStore((s) => s.timelineUnit);
  const dashboardTimeZone = useOrdersStore((s) => s.dashboardTimeZone);
  const startDate = useOrdersStore((s) => s.startDate);
  const endDate = useOrdersStore((s) => s.endDate);

  const pieData = pieByChannel.map((p) => ({
    name: p.channel_name,
    revenue: p.revenue,
    orders: p.order_count,
  }));

  const rangeLabel =
    startDate === endDate ? startDate : `${startDate} → ${endDate}`;

  const barChartTitle =
    timelineUnit === "hour"
      ? `Orders per hour & cumulative revenue (${rangeLabel}, ${dashboardTimeZone})`
      : `Orders per day & cumulative revenue (${rangeLabel}, ${dashboardTimeZone})`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section
        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        aria-label="Revenue by channel for selected range"
      >
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Revenue by channel ({rangeLabel})
        </h2>
        {pieData.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No orders in this range.</p>
        ) : (
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) =>
                    `${String(name).slice(0, 18)}${String(name).length > 18 ? "…" : ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={`${i}-${pieByChannel[i]?.channel_name ?? "slice"}`}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const num = typeof value === "number" ? value : Number(value) || 0;
                    const payload = item?.payload as { orders?: number } | undefined;
                    const orders = payload?.orders ?? 0;
                    return [`${formatIdr(num)} · ${orders} order(s)`, "Revenue"];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section
        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        aria-label="Orders and cumulative revenue timeline"
      >
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{barChartTitle}</h2>
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={timelineUnit === "hour" ? 2 : 0}
                angle={timelineUnit === "day" && timeline.length > 14 ? -35 : 0}
                textAnchor={timelineUnit === "day" && timeline.length > 14 ? "end" : "middle"}
                height={timelineUnit === "day" && timeline.length > 14 ? 56 : 30}
                className="text-zinc-600"
              />
              <YAxis
                yAxisId="left"
                allowDecimals={false}
                tick={{ fontSize: 10 }}
                width={36}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}k`)}
                width={44}
              />
              <Tooltip
                labelFormatter={(label) => (timelineUnit === "hour" ? `Hour ${label}` : `Day ${label}`)}
                formatter={(value, name) => {
                  const num = typeof value === "number" ? value : Number(value) || 0;
                  if (name === "order_count") return [num, "Orders"];
                  if (name === "cumulative_revenue") return [formatIdr(num), "Cumulative revenue"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="order_count"
                name="Orders"
                fill="#71717a"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative_revenue"
                name="Cumulative revenue"
                stroke="#3f3f46"
                strokeWidth={2}
                dot={timelineUnit === "day"}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
