import type { Article } from "@/types/article";
import type { NewsApiRawArticle } from "@/services/api/newsApi.service";

export const adaptNewsApiArticle = (raw: NewsApiRawArticle): Article => {
  return {
    id: `newsapi-${raw.url}`,
    title: raw.title,
    description: raw.description ?? "",
    author: raw.author ?? undefined,
    source: raw.source.name ?? "NewsAPI",
    publishedAt: raw.publishedAt,
    category: undefined,
    imageUrl: raw.urlToImage ?? undefined,
    url: raw.url,
  };
};

export const adaptNewsApiArticles = (raw: NewsApiRawArticle[]): Article[] => {
  return raw
    .filter((a) => a.title && a.title !== "[Removed]")
    .map(adaptNewsApiArticle);
};
