import { useState, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/filters/SearchBar";
import { FiltersPanel, MobileFiltersDrawer } from "@/components/filters/FiltersPanel";
import { ArticleList } from "@/components/article/ArticleList";
import { useArticles } from "@/hooks/useArticles";
import { usePreferencesStore } from "@/features/personalization/preferences.store";
import { PreferencesPanel } from "@/features/personalization/PreferencesPanel";
import type { ArticleFilters } from "@/types/article";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AllNewsView() {
  const [filters, setFilters] = useState<ArticleFilters>({
    keyword: "technology",
    sources: [],
  });

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArticles(filters);

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  const handleKeywordChange = useCallback((keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: ArticleFilters) => {
    setFilters(newFilters);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <div className="space-y-6">
      {/* Search bar with mobile filter trigger */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar value={filters.keyword} onChange={handleKeywordChange} />
        </div>
        {/* Mobile-only filter sheet trigger */}
        <MobileFiltersDrawer filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Content area with desktop sidebar */}
      <div className="flex gap-8">
        <FiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />

        <div className="min-w-0 flex-1">
          <ArticleList
            articles={articles}
            isLoading={isLoading}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
}

function MyFeedView() {
  const { preferredSources, preferredCategories, preferredAuthors } =
    usePreferencesStore();

  const filters = useMemo<ArticleFilters>(
    () => ({
      keyword: "news",
      sources: preferredSources,
      category: preferredCategories[0],
    }),
    [preferredSources, preferredCategories]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArticles(filters);

  const allArticles = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  // Filter by preferred authors if any are set
  const articles = useMemo(() => {
    if (preferredAuthors.length === 0) return allArticles;
    return allArticles.filter(
      (a) =>
        a.author &&
        preferredAuthors.some((pa) =>
          a.author!.toLowerCase().includes(pa.toLowerCase())
        )
    );
  }, [allArticles, preferredAuthors]);

  // If author filter resulted in 0 articles but there were results, show all
  const displayArticles =
    preferredAuthors.length > 0 && articles.length === 0
      ? allArticles
      : articles;

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <div className="space-y-6">
      <PreferencesPanel />

      <ArticleList
        articles={displayArticles}
        isLoading={isLoading}
        isError={isError}
        error={error}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"all" | "feed">("all");

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "all" ? <AllNewsView /> : <MyFeedView />}
      </Layout>
    </QueryClientProvider>
  );
}
