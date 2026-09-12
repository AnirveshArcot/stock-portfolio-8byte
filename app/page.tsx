"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CircleDot, RefreshCw } from "lucide-react";
import { Card } from "@/components/dahboard/card";
import { PortfolioFilters } from "@/components/dahboard/filters";
import { SectorChart } from "@/components/dahboard/chart";
import { SectorTable } from "@/components/dahboard/table";
import {
  calcPortVal,
  gainCol,
  money,
  type presentAsset,
} from "@/lib/shard_func";
import { assets as seed } from "./data";

const emptyHoldings: presentAsset[] = seed.map((asset) => ({
  ...asset,
  price: null,
  pe: null,
  earnings: null,
  live: false,
  error: null,
}));

const colors = ["#53f7ff", "#e7ff51", "#a68cff", "#ff4f87", "#ffae5e", "#55e1a9"];

export default function Home() {
  const [items, setItems] = useState(emptyHoldings);
  const [selectedSector, setSelectedSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  async function refresh() {
    setLoading(true);

    try {
      const response = await fetch("/api/portfolio", { cache: "no-store" });
      const data = await response.json();

      setItems(data.assets);
      setUpdatedAt(data.updateTime);
      setLiveCount(data.liveCount);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const intervalId = window.setInterval(refresh, 15_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.sector)))],
    [items],
  );
  const visibleItems = useMemo(
    () => items.filter((item) =>
      (selectedSector === "All" || item.sector === selectedSector) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    [items, searchQuery, selectedSector],
  );
  const liveItems = items.filter((item) => item.live);
  const totals = calcPortVal(liveItems);
  const groups = sectors
    .slice(1)
    .map((sector) => ({
      sector,
      items: visibleItems.filter((item) => item.sector === sector),
    }))
    .filter((group) => group.items.length);
  const allocations = sectors.slice(1).map((sector, index) => ({
    sector,
    color: colors[index],
    value: calcPortVal(liveItems.filter((item) => item.sector === sector)).presentVal,
  }));
  const status = liveCount === items.length ? "LIVE" : "DEGRADED";

  return (
    <main className="mx-auto min-h-svh max-w-[1560px] px-4 py-4 sm:px-8 sm:py-8">
      <section className="grid gap-3 lg:grid-cols-4">
        <Card
          label="Live portfolio value"
          value={liveCount ? money.format(totals.presentVal) : "—"}
          subtext={`${liveCount}/${items.length} price feeds online`}
        />
        <Card
          label="Capital Invested"
          value={money.format(totals.investment)}
        />
        <Card
          label="Unrealised return"
          value={liveCount ? `${totals.gain >= 0 ? "+" : ""}${money.format(totals.gain)}` : "—"}
          subtext={liveCount ? `${(totals.gain / totals.investment * 100).toFixed(2)}% live positions` : "Waiting for source data"}
          tone={gainCol(totals.gain)}
        />
        <SectorChart allocations={allocations} hasLivePrices={Boolean(liveCount)} />
      </section>

      <PortfolioFilters
        sectors={sectors}
        selectedSector={selectedSector}
        searchQuery={searchQuery}
        secChan={setSelectedSector}
        searchChan={setSearchQuery}
      />

      <section className="mt-8">

        <hr className="border-0 border-t border-primary/30" />
        <div className="mt-4 space-y-4">
          {groups.map((group) => (
            <SectorTable
              key={group.sector}
              sector={group.sector}
              items={group.items}
              totalInvestment={totals.investment}
            />
          ))}
          {!groups.length && (
            <div className="rounded-xl border border-dashed border-border bg-card/70 py-10 text-center text-sm text-muted-foreground">
              No holdings match that signal.
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
