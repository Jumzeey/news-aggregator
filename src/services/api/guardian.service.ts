import axios from "axios";
import type { ArticleFilters } from "@/types/article";

// Calls local proxy — the API key is injected server-side (Vite dev proxy)
const BASE_URL = "/api/guardian/search";

export interface GuardianRawResponse {
  response: {
    status: string;
    total: number;
    results: GuardianRawArticle[];
  };
}

export interface GuardianRawArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    trailText?: string;
    byline?: string;
    thumbnail?: string;
  };
}

export async function fetchGuardianArticles(
  filters: ArticleFilters,
  page: number = 1
): Promise<GuardianRawArticle[]> {
  const params: Record<string, string> = {
    "show-fields": "trailText,byline,thumbnail",
    "page-size": "20",
    "order-by": "newest",
    page: String(page),
  };

  if (filters.keyword) params.q = filters.keyword;
  if (filters.dateFrom) params["from-date"] = filters.dateFrom;
  if (filters.dateTo) params["to-date"] = filters.dateTo;
  if (filters.category) params.section = filters.category;

  const response = await axios.get<GuardianRawResponse>(BASE_URL, { params });
  return response.data.response.results ?? [];
}
