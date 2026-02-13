export interface Article {
  id: string;
  title: string;
  description: string;
  author?: string;
  source: string;
  publishedAt: string;
  category?: string;
  imageUrl?: string;
  url: string;
}

export interface ArticleFilters {
  keyword: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  sources: string[];
}

export const SOURCE_OPTIONS = [
  { id: "newsapi", label: "NewsAPI" },
  { id: "guardian", label: "The Guardian" },
  { id: "nyt", label: "New York Times" },
] as const;

export const CATEGORY_OPTIONS = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
] as const;

export type SourceId = (typeof SOURCE_OPTIONS)[number]["id"];
