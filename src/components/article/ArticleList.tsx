import { useEffect, useRef } from "react";
import { AlertCircle, Loader2, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types/article";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

function ArticleSkeleton() {
  return (
    <Card className="overflow-hidden p-0 gap-0">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="space-y-2 px-4 pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function ArticleList({
  articles,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ArticleListProps) {
  // Scroll sentinel — triggers loading the next page when it enters the viewport
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" } // trigger 400px before the user reaches the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.message || "Failed to fetch articles. Please try again."}
        </p>
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Newspaper className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No articles found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  // Articles grid with infinite scroll sentinel
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}

        {/* Skeleton placeholders while loading next page */}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <ArticleSkeleton key={`loading-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {/* End of results indicator */}
      {!hasNextPage && articles.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end of the results.
        </p>
      )}

      {/* Loading spinner for next page (visible on slow connections) */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
