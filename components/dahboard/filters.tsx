"use client";

import { Search } from "lucide-react";

type filterProp = {
  sectors: string[];
  selectedSector: string;
  searchQuery: string;
  secChan: (sector: string) => void;
  searchChan: (query: string) => void;
};

export function PortfolioFilters({
  sectors,
  selectedSector,
  searchQuery,
  secChan,
  searchChan,
}: filterProp) {
  return (
    <div className="mt-5 rounded-xl border border-border/90 bg-card/80 px-4 py-4 text-card-foreground">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              type="button"
              key={sector}
              onClick={() => secChan(sector)}
              className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors lg:h-7 lg:px-2 lg:text-[1rem] ${selectedSector === sector ? "border-primary bg-primary text-white hover:bg-primary/85" : "border-border bg-transparent text-muted-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-primary"}`}
            >
              {sector}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-60">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-primary" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => searchChan(event.target.value)}
            placeholder="Search holdings"
            className="h-10 w-full rounded-lg border border-border bg-background py-1 pr-2 pl-8 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 lg:h-8 lg:text-xs"
          />
        </div>
      </div>
    </div>
  );
}
