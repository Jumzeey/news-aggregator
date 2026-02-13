import { useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types/article";
import { getRelativeTime } from "@/utils/date.utils";

interface ArticleCardProps {
  article: Article;
}

function PlaceholderImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
      <Newspaper className="h-10 w-10 text-muted-foreground/40" />
    </div>
  );
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = article.imageUrl && !imgError;

  return (
    <Card className="group flex flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {showImage ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>

      <CardHeader className="flex-1 space-y-2 px-4 pt-4 pb-2">
        {/* Source & Category badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {article.source}
          </Badge>
          {article.category && (
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          )}
        </div>

        <CardTitle className="line-clamp-2 text-base leading-snug">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {article.title}
          </a>
        </CardTitle>

        <CardDescription className="line-clamp-3 text-sm">
          {article.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 truncate">
            {article.author && (
              <span className="truncate">{article.author}</span>
            )}
            <span>{getRelativeTime(article.publishedAt)}</span>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Open article"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
