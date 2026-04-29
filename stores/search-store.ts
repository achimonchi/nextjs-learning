import { create } from "zustand";
import type { SearchResult } from "@/modules/discovery/search/model";
import { searchProducts } from "@/modules/discovery/search/usecase";

type SearchStore = {
  query: string;
  results: SearchResult[];
  error: string | null;
  isPending: boolean;
  setQuery: (query: string) => void;
  runSearch: () => Promise<void>;
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: "",
  results: [],
  error: null,
  isPending: true,

  setQuery: (query) => set({ query }),

  runSearch: async () => {
    const q = get().query.trim();

    set({ isPending: true, error: null });

    const res = await searchProducts(q);
    if (res.ok) {
      set({ results: res.data, isPending: false });
    } else {
      set({ results: [], error: res.message, isPending: false });
    }
  },
}));
