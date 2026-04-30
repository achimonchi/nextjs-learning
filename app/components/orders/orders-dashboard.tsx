"use client";

import { type ChangeEvent, useEffect, useRef } from "react";
import { calendarDateInTimeZone } from "@/lib/calendar-date";
import { useOrdersStore } from "@/stores/orders-store";
import { OrdersCharts } from "./orders-charts";
import { OrdersTopTable } from "./orders-top-table";

const TIMEZONE_OPTIONS = [
  "America/Los_Angeles",
  "America/New_York",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/London",
  "Pacific/Honolulu",
  "UTC",
];

export function OrdersDashboard() {
  const loadDashboard = useOrdersStore((s) => s.loadDashboard);
  const dashboardTimeZone = useOrdersStore((s) => s.dashboardTimeZone);
  const startDate = useOrdersStore((s) => s.startDate);
  const endDate = useOrdersStore((s) => s.endDate);
  const isPending = useOrdersStore((s) => s.isPending);
  const error = useOrdersStore((s) => s.error);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = calendarDateInTimeZone(tz);
    void loadDashboard({ timeZone: tz, startDate: today, endDate: today });
  }, [loadDashboard]);

  function handleTimeZoneChange(e: ChangeEvent<HTMLSelectElement>) {
    void loadDashboard({
      timeZone: e.target.value,
      startDate,
      endDate,
    });
  }

  function handleStartDateChange(e: ChangeEvent<HTMLInputElement>) {
    void loadDashboard({
      timeZone: dashboardTimeZone,
      startDate: e.target.value,
      endDate,
    });
  }

  function handleEndDateChange(e: ChangeEvent<HTMLInputElement>) {
    void loadDashboard({
      timeZone: dashboardTimeZone,
      startDate,
      endDate: e.target.value,
    });
  }

  const selectOptions = [...new Set([dashboardTimeZone, ...TIMEZONE_OPTIONS])].sort();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Filters
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Time zone</span>
            <select
              value={dashboardTimeZone}
              onChange={handleTimeZoneChange}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-label="IANA time zone for date range"
            >
              {selectOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[160px] flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <label className="flex min-w-[160px] flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Rows are included when <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">created_date</code>, interpreted in
          the selected zone, falls on a calendar day between start and end (inclusive).
        </p>
      </div>

      {isPending ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading dashboard…</p>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!isPending && !error ? (
        <>
          <OrdersCharts />
          <OrdersTopTable />
        </>
      ) : null}
    </div>
  );
}
