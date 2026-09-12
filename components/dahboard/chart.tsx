"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type SectorAllocation = {
  sector: string;
  color: string;
  value: number;
};

type SectorChartProps = {
  allocations: SectorAllocation[];
  hasLivePrices: boolean;
};

export function SectorChart({ allocations, hasLivePrices }: SectorChartProps) {
  return (
    <div className="flex min-h-31 items-center gap-3 rounded-xl border border-primary/25 bg-card/80 px-4 py-4 text-card-foreground shadow-[0_0_40px_-20px_#53f7ff]">
      <div className="size-25 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasLivePrices ? allocations : []}
              dataKey="value"
              nameKey="sector"
              innerRadius={30}
              outerRadius={40}
              stroke="none"
            >
              {allocations.map((item) => (
                <Cell key={item.sector} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-[10px] tracking-[0.16em] text-muted-foreground">
          Sector Ratios
        </p>
        <p className="font-display text-3xl font-semibold text-primary">
          {allocations.length}
        </p>
      </div>
    </div>
  );
}
