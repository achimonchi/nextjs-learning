export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  main_image_url: string;
  merchant_id: string;
  overview: string;
  rating_avg: number;
  rating_count: number;
  category_ids: string[];
  /** Shape TBD when API contract is fixed; narrow later */
  variants: unknown[];
}
