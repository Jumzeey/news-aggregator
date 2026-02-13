import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "@/services/articleAggregator.service";
import type { ArticleFilters } from "@/types/article";

export function useArticles(filters: ArticleFilters) {
  return useInfiniteQuery({
    queryKey: [
      "articles",
      filters.keyword,
      filters.dateFrom,
      filters.dateTo,
      filters.category,
      filters.sources,
    ],
    queryFn: ({ pageParam }) => fetchAllArticles(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled:
      filters.keyword.trim().length > 0 ||
      filters.sources.length > 0 ||
      !!filters.category ||
      !!filters.dateFrom ||
      !!filters.dateTo,
  });
}
