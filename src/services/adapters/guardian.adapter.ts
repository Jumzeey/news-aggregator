import type { Article } from "@/types/article";
import type { GuardianRawArticle } from "@/services/api/guardian.service";

export const adaptGuardianArticle = (raw: GuardianRawArticle): Article => {
  return {
    id: raw.id,
    title: raw.webTitle,
    description: raw.fields?.trailText ?? "",
    author: raw.fields?.byline,
    source: "The Guardian",
    publishedAt: raw.webPublicationDate,
    category: raw.sectionName,
    imageUrl: raw.fields?.thumbnail,
    url: raw.webUrl,
  };
};

export const adaptGuardianArticles = (raw: GuardianRawArticle[]): Article[] => {
  return raw.map(adaptGuardianArticle);
};
