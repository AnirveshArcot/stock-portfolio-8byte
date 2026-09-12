"use client";

import { useMemo } from "react";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import {
  calcPortVal,
  gainCol,
  money,
  price,
  type presentAsset,
} from "@/lib/shard_func";

const tableConfig = tableFeatures({});
const column = createColumnHelper<typeof tableConfig, presentAsset>();
const laptopOnlyColumns = new Set([
  "buy",
  "quantity",
  "investment",
  "weight",
  "code",
  "present",
  "pe",
  "earnings",
]);

type SectorTableProps = {
  sector: string;
  items: presentAsset[];
  totalInvestment: number;
};

export function SectorTable({ sector, items, totalInvestment }: SectorTableProps) {
  const summary = calcPortVal(items.filter((item) => item.live));
  const columns = useMemo(
    () =>
      column.columns([
        column.accessor("name", {
          header: "Particulars",
          cell: ({ row }) => (
            <>
              <b className="font-display font-semibold text-foreground">
                {row.original.name}
              </b>
              <small className="block text-[9px] text-muted-foreground">
                {row.original.symbol} · {row.original.exchange}
              </small>
            </>
          ),
        }),
        column.accessor("buy", {
          header: "Purchase price",
          cell: ({ getValue }) => price.format(getValue()),
        }),
        column.accessor("quantity", { header: "Qty." }),
        column.display({
          id: "investment",
          header: "Investment",
          cell: ({ row }) => money.format(row.original.buy * row.original.quantity),
        }),
        column.display({
          id: "weight",
          header: "Portfolio (%)",
          cell: ({ row }) =>
            `${((row.original.buy * row.original.quantity / totalInvestment) * 100).toFixed(1)}%`,
        }),
        column.accessor("code", { header: "NSE/BSE" }),
        column.accessor("price", {
          header: "CMP",
          cell: ({ row }) => (
            <MarketPrice price={row.original.price} error={row.original.error} />
          ),
        }),
        column.display({
          id: "present",
          header: "Present value",
          cell: ({ row }) =>
            row.original.price === null
              ? "—"
              : money.format(row.original.price * row.original.quantity),
        }),
        column.display({
          id: "gain",
          header: "Gain / loss",
          cell: ({ row }) => <GainLoss item={row.original} />,
        }),
        column.accessor("pe", {
          header: "P/E ratio",
          cell: ({ getValue }) => getValue() ?? "—",
        }),
        column.accessor("earnings", {
          header: "Latest EPS",
          cell: ({ getValue }) => getValue() ?? "—",
        }),
      ]),
    [totalInvestment],
  );
  const table = useTable({
    features: tableConfig,
    columns,
    data: items,
    getRowId: (row) => row.symbol,
  });

  return (
    <section className="overflow-hidden rounded-xl border border-border/90 bg-card/85 text-card-foreground">
      <div className="flex flex-col items-start gap-2 border-b border-border bg-[#101a2b] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <span className="font-display text-lg font-semibold text-primary">
          {sector.toUpperCase()}
        </span>
        <div className="flex gap-4 text-right text-[10px]">
          <span className="text-muted-foreground">
            VALUE <b className="ml-1 text-foreground">{summary.presentVal ? money.format(summary.presentVal) : "—"}</b>
          </span>
          <span className={gainCol(summary.gain)}>
            P/L <b className="ml-1">{summary.presentVal ? `${summary.gain >= 0 ? "+" : ""}${money.format(summary.gain)}` : "—"}</b>
          </span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full caption-bottom text-xs lg:min-w-[1120px] [&_th:not(:first-child)]:text-right [&_td:not(:first-child)]:text-right">
          <thead className="bg-background/60 [&_tr]:border-b">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b transition-colors hover:bg-transparent">
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`h-9 px-2 text-left align-middle font-mono text-[9px] font-medium tracking-[0.1em] whitespace-nowrap text-muted-foreground lg:px-3 ${laptopOnlyColumns.has(header.column.id) ? "hidden lg:table-cell" : ""}`}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border/70 transition-colors hover:bg-primary/5">
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-2 py-3 align-middle font-mono text-[11px] whitespace-nowrap text-foreground lg:px-3 ${laptopOnlyColumns.has(cell.column.id) ? "hidden lg:table-cell" : ""}`}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MarketPrice({ price: value, error }: Pick<presentAsset, "price" | "error">) {
  const content = (
    <span className={value === null ? "text-[#303d7a]" : "font-semibold text-primary"}>
      {value === null ? "Unavailable" : price.format(value)}
    </span>
  );

  return error ? (
    <span className="" title={error} aria-label={error}>
      {content}
    </span>
  ) : content;
}

function GainLoss({ item }: { item: presentAsset }) {
  if (item.price === null) return <span>—</span>;

  const investment = item.buy * item.quantity;
  const gain = item.price * item.quantity - investment;

  return (
    <span className={gainCol(gain)}>
      <b>{gain >= 0 ? "+" : ""}{money.format(gain)}</b>
      <small className="ml-1 text-[9px] opacity-75">{(gain / investment * 100).toFixed(1)}%</small>
    </span>
  );
}
