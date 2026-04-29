"use client";

import { SearchForm } from "@/app/components/search/search-form";
import { SearchResults } from "@/app/components/search/search-results";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Search products
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Type a query and submit to search the catalog.
          </p>
        </header>

        <SearchForm />
        <SearchResults />
      </main>
    </div>
  );
}
