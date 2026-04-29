"use client";

import { FormEvent } from "react";
import { useSearchStore } from "@/stores/search-store";
import { SearchInput } from "./search-input";

export function SearchForm() {
  const isPending = useSearchStore((s) => s.isPending);
  const runSearch = useSearchStore((s) => s.runSearch);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void runSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <SearchInput />
      <button
        type="submit"
        disabled={isPending}
        className="h-10 shrink-0 rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
