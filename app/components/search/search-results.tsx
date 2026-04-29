"use client";

import { useEffect, useRef } from "react";
import { useSearchStore } from "@/stores/search-store";
import { ProductCard } from "./product-card";

export function SearchResults() {
  const query = useSearchStore((s) => s.query);
  const results = useSearchStore((s) => s.results);
  const error = useSearchStore((s) => s.error);
  const isPending = useSearchStore((s) => s.isPending);
  const runSearch = useSearchStore((s) => s.runSearch);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    void runSearch();
  }, [runSearch]);

  return (
    <>
      {isPending ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading products…</p>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!isPending && !error && results.length === 0 && query.trim() === "" ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No products available.
        </p>
      ) : null}

      {!isPending && results.length > 0 ? (
        <section aria-label="Search results">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isPending && results.length === 0 && query.trim() !== "" && !error ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No products found for &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : null}
    </>
  );
}
