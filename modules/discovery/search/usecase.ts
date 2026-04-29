"use server";

import { SearchResult } from "./model";
import { searchRepository } from "./repository";

export type SearchProductsResult =
  | { ok: true; data: SearchResult[] }
  | { ok: false; message: string };

export async function searchProducts(
  query: string,
  index: string = "products",
): Promise<SearchProductsResult> {
  const trimmed = query.trim();

  try {
    const data = await searchRepository(trimmed, index);
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      message: "Search failed. Try again later.",
    };
  }
}
