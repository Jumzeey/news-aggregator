import type { Article, ArticleFilters } from "@/types/article";
import { fetchNewsApiArticles } from "@/services/api/newsApi.service";
import { fetchGuardianArticles } from "@/services/api/guardian.service";
import { fetchNytArticles } from "@/services/api/nyt.service";
import { adaptNewsApiArticles } from "@/services/adapters/newsApi.adapter";
import { adaptGuardianArticles } from "@/services/adapters/guardian.adapter";
import { adaptNytArticles } from "@/services/adapters/nyt.adapter";

interface SourceFetcher {
  id: string;
  fetch: (filters: ArticleFilters, page: number) => Promise<unknown[]>;
  adapt: (raw: unknown[]) => Article[];
}

const SOURCE_FETCHERS: SourceFetcher[] = [
  {
    id: "newsapi",
    fetch: fetchNewsApiArticles,
    adapt: adaptNewsApiArticles as (raw: unknown[]) => Article[],
  },
  {
    id: "guardian",
    fetch: fetchGuardianArticles,
    adapt: adaptGuardianArticles as (raw: unknown[]) => Article[],
  },
  {
    id: "nyt",
    fetch: fetchNytArticles,
    adapt: adaptNytArticles as (raw: unknown[]) => Article[],
  },
];

/**
 * Fetches a page of articles from all configured APIs in parallel and merges
 * them into a single sorted array. Uses Promise.allSettled for graceful
 * degradation when individual APIs fail or have missing keys.
 */
export async function fetchAllArticles(
  filters: ArticleFilters,
  page: number = 1
): Promise<Article[]> {
  const activeSources = SOURCE_FETCHERS.filter(
    (s) => filters.sources.length === 0 || filters.sources.includes(s.id)
  );

  const results = await Promise.allSettled(
    activeSources.map(async (source) => {
      const raw = await source.fetch(filters, page);
      return source.adapt(raw);
    })
  );

  const articles: Article[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.warn("Failed to fetch from source:", result.reason);
    }
  }

  // Sort by publishedAt descending (newest first)
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return articles;
}
