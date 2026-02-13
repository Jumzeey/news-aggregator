import axios from "axios";
import type { ArticleFilters } from "@/types/article";

// Calls local proxy — the API key is injected server-side (Vite dev proxy)
const BASE_URL = "/api/nyt/articlesearch.json";

export interface NytRawResponse {
  status: string;
  copyright: string;
  response: {
    docs: NytRawArticle[];
    metadata: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export interface NytMultimediaImage {
  url: string;
  height: number;
  width: number;
}

export interface NytRawArticle {
  _id: string;
  abstract: string;
  web_url: string;
  snippet: string;
  source: string;
  headline: {
    main: string;
    kicker?: string;
    print_headline?: string;
  };
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name?: string;
  type_of_material: string;
  word_count: number;
  uri: string;
  byline: {
    original: string | null;
  };
  multimedia: {
    caption?: string;
    credit?: string;
    default?: NytMultimediaImage;
    thumbnail?: NytMultimediaImage;
  } | null;
  keywords: Array<{
    name: string;
    value: string;
    rank: number;
  }>;
}

export async function fetchNytArticles(
  filters: ArticleFilters,
  page: number = 1
): Promise<NytRawArticle[]> {
  const params: Record<string, string> = {
    sort: "newest",
    page: String(page - 1), // NYT API is 0-indexed
  };

  if (filters.keyword) params.q = filters.keyword;
  if (filters.dateFrom) params.begin_date = filters.dateFrom.replace(/-/g, "");
  if (filters.dateTo) params.end_date = filters.dateTo.replace(/-/g, "");
  if (filters.category) params.fq = `section_name:("${filters.category}")`;

  const response = await axios.get<NytRawResponse>(BASE_URL, { params });
  return response.data.response.docs ?? [];
}
