import { useState } from "react";
import {
  Plus,
  X,
  Settings2,
  RotateCcw,
  Rss,
  Grid3x3,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePreferencesStore } from "./preferences.store";
import { SOURCE_OPTIONS, CATEGORY_OPTIONS } from "@/types/article";

function PreferencesContent() {
  const {
    preferredSources,
    preferredCategories,
    preferredAuthors,
    setPreferredSources,
    setPreferredCategories,
    addPreferredAuthor,
    removePreferredAuthor,
    resetPreferences,
  } = usePreferencesStore();

  const [authorInput, setAuthorInput] = useState("");

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    if (checked) {
      setPreferredSources([...preferredSources, sourceId]);
    } else {
      setPreferredSources(preferredSources.filter((s) => s !== sourceId));
    }
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setPreferredCategories([...preferredCategories, category]);
    } else {
      setPreferredCategories(
        preferredCategories.filter((c) => c !== category)
      );
    }
  };

  const handleAddAuthor = () => {
    const trimmed = authorInput.trim();
    if (trimmed) {
      addPreferredAuthor(trimmed);
      setAuthorInput("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Preferred Sources */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Rss className="h-4 w-4 text-muted-foreground" />
          Sources
        </div>
        <div className="grid grid-cols-1 gap-1">
          {SOURCE_OPTIONS.map((source) => (
            <label
              key={source.id}
              htmlFor={`pref-source-${source.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent"
            >
              <Checkbox
                id={`pref-source-${source.id}`}
                checked={preferredSources.includes(source.id)}
                onCheckedChange={(checked) =>
                  handleSourceToggle(source.id, checked === true)
                }
              />
              <span className="text-sm">{source.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Grid3x3 className="h-4 w-4 text-muted-foreground" />
          Categories
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = preferredCategories.includes(cat);
            return (
              <Badge
                key={cat}
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer select-none capitalize transition-colors"
                onClick={() => handleCategoryToggle(cat, !isActive)}
              >
                {cat}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Preferred Authors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <UserPen className="h-4 w-4 text-muted-foreground" />
          Authors
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. John Smith"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddAuthor()}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="secondary"
            onClick={handleAddAuthor}
            disabled={!authorInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {preferredAuthors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferredAuthors.map((author) => (
              <Badge
                key={author}
                variant="secondary"
                className="gap-1 py-1 pl-2.5 pr-1.5"
              >
                {author}
                <button
                  onClick={() => removePreferredAuthor(author)}
                  className="rounded-full p-0.5 transition-colors hover:bg-destructive/20 hover:text-destructive"
                  aria-label={`Remove ${author}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {preferredAuthors.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add author names to prioritize their articles in your feed.
          </p>
        )}
      </div>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-foreground"
        onClick={resetPreferences}
      >
        <RotateCcw className="mr-2 h-3.5 w-3.5" />
        Reset to defaults
      </Button>
    </div>
  );
}

export function PreferencesPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Your Personalized Feed</CardTitle>
            <CardDescription>
              Articles are filtered based on your preferences.
            </CardDescription>
          </div>

          {/* Sheet for preferences */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Preferences
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Feed Preferences</SheetTitle>
                <SheetDescription>
                  Customize which articles appear in your personalized feed.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 px-4">
                <PreferencesContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      {/* Desktop: inline preferences (hidden on small screens) */}
      <CardContent className="hidden lg:block">
        <PreferencesContent />
      </CardContent>
    </Card>
  );
}
