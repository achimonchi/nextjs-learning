"use client";

import { useSearchStore } from "@/stores/search-store";

export function SearchInput() {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
      Search
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. laptop, shoes…"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-600"
        autoComplete="off"
      />
    </label>
  );
}
