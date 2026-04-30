"use client";

import { OrdersDashboard } from "@/app/components/orders/orders-dashboard";

export default function OrdersPage() {
  return (
    <div className="min-h-full bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Performance from <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">public.orders</code>
            . Pick a time zone, start date, and end date; charts aggregate rows whose{" "}
            <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">created_date</code> falls on those calendar days
            in that zone (inclusive).
          </p>
        </header>

        <OrdersDashboard />
      </main>
    </div>
  );
}
