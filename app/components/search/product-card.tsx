import type { SearchResult } from "@/modules/discovery/search/model";
import { StarRating } from "./star-rating";

type Props = { item: SearchResult };

export function ProductCard({ item }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote product URLs vary by host */}
        <img
          src={item.main_image_url}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          {item.title}
        </h2>
        {item.overview ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item.overview}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <StarRating value={item.rating_avg} />
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {item.rating_avg.toFixed(1)}
          </span>
          <span className="text-zinc-500">({item.rating_count})</span>
        </div>
      </div>
    </article>
  );
}
