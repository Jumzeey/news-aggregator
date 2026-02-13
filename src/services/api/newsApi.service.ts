import axios from "axios";
import type { ArticleFilters } from "@/types/article";

// Calls local proxy — the API key is injected server-side (Vite dev proxy)
const BASE_URL = "/api/newsapi/everything";

export interface NewsApiRawResponse {
  status: string;
  totalResults: number;
  articles: NewsApiRawArticle[];
}

export interface NewsApiRawArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function fetchNewsApiArticles(
  filters: ArticleFilters,
  page: number = 1
): Promise<NewsApiRawArticle[]> {
  const params: Record<string, string> = {
    q: filters.keyword || "news",
    sortBy: "publishedAt",
    pageSize: "20",
    page: String(page),
  };

  if (filters.dateFrom) params.from = filters.dateFrom;
  if (filters.dateTo) params.to = filters.dateTo;

  const response = await axios.get<NewsApiRawResponse>(BASE_URL, { params });
  return response.data.articles ?? [];
}
