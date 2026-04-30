"use client";

import { useOrdersStore } from "@/stores/orders-store";

function formatIdr(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWhen(iso: string | null, timeZone: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrdersTopTable() {
  const topOrders = useOrdersStore((s) => s.topOrders);
  const dashboardTimeZone = useOrdersStore((s) => s.dashboardTimeZone);
  const startDate = useOrdersStore((s) => s.startDate);
  const endDate = useOrdersStore((s) => s.endDate);

  return (
    <section
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      aria-label="Top 10 orders by grand total in range"
    >
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Top 10 transactions{" "}
        {startDate === endDate ? `on ${startDate}` : `from ${startDate} to ${endDate}`} (by grand total)
      </h2>
      {topOrders.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No rows in this range.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3">Order no.</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Grand total</th>
                <th className="py-2 pr-0">Created ({dashboardTimeZone})</th>
              </tr>
            </thead>
            <tbody>
              {topOrders.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="py-2 pr-3 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    {row.salesorder_no}
                  </td>
                  <td className="max-w-[180px] truncate py-2 pr-3 text-zinc-700 dark:text-zinc-300">
                    {row.customer_name}
                  </td>
                  <td className="max-w-[160px] truncate py-2 pr-3 text-zinc-600 dark:text-zinc-400">
                    {row.channel_name}
                  </td>
                  <td className="py-2 pr-3 text-zinc-600 dark:text-zinc-400">{row.status}</td>
                  <td className="py-2 pr-3 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatIdr(row.grand_total)}
                  </td>
                  <td className="py-2 pr-0 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                    {formatWhen(row.created_date, dashboardTimeZone)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
