import type { ReactNode } from "react";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: ReactNode;
  activeTab: "all" | "feed";
  onTabChange: (tab: "all" | "feed") => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              News Aggregator
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("all")}
            >
              All News
            </Button>
            <Button
              variant={activeTab === "feed" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("feed")}
            >
              My Feed
            </Button>
          </nav>
        </div>
      </header>

      <Separator />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
