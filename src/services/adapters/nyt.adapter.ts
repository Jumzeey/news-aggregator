import type { Article } from "@/types/article";
import type { NytRawArticle } from "@/services/api/nyt.service";

export const adaptNytArticle = (raw: NytRawArticle): Article => {
  const imageUrl =
    raw.multimedia?.default?.url ?? raw.multimedia?.thumbnail?.url ?? undefined;

  return {
    id: raw._id,
    title: raw.headline.main,
    description: raw.abstract || raw.snippet || "",
    author: raw.byline?.original?.replace(/^By\s+/i, "") ?? undefined,
    source: "New York Times",
    publishedAt: raw.pub_date,
    category: raw.section_name || raw.news_desk,
    imageUrl,
    url: raw.web_url,
  };
};

export const adaptNytArticles = (raw: NytRawArticle[]): Article[] => {
  return raw.map(adaptNytArticle);
};
