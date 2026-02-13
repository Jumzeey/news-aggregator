import { useState } from "react";
import { CalendarIcon, SlidersHorizontal, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { SourceSelector } from "./SourceSelector";
import { CATEGORY_OPTIONS } from "@/types/article";
import type { ArticleFilters } from "@/types/article";
import { toISODateString } from "@/utils/date.utils";

interface FiltersPanelProps {
  filters: ArticleFilters;
  onFiltersChange: (filters: ArticleFilters) => void;
}

function FilterControls({ filters, onFiltersChange }: FiltersPanelProps) {
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: date ? toISODateString(date) : undefined,
    });
    setDateFromOpen(false);
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateTo: date ? toISODateString(date) : undefined,
    });
    setDateToOpen(false);
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value === "all" ? undefined : value,
    });
  };

  const handleSourcesChange = (sources: string[]) => {
    onFiltersChange({ ...filters, sources });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      ...filters,
      dateFrom: undefined,
      dateTo: undefined,
      category: undefined,
      sources: [],
    });
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.category ||
    filters.sources.length > 0;

  return (
    <div className="space-y-4">
      {/* Category Select */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Category</p>
        <Select
          value={filters.category ?? "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_OPTIONS.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Date From */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">From date</p>
        <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom
                ? format(new Date(filters.dateFrom), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.dateFrom ? new Date(filters.dateFrom) : undefined
              }
              onSelect={handleDateFromChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date To */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">To date</p>
        <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo
                ? format(new Date(filters.dateTo), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
              onSelect={handleDateToChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Source Selector */}
      <SourceSelector
        selected={filters.sources}
        onChange={handleSourcesChange}
      />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleClearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </>
      )}
    </div>
  );
}

/** Desktop sidebar filters — hidden on mobile */
export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <FilterControls filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </aside>
  );
}

/** Mobile filters drawer — hidden on desktop */
export function MobileFiltersDrawer({
  filters,
  onFiltersChange,
}: FiltersPanelProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 px-4">
            <FilterControls
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
