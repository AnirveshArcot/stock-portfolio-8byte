import { assets } from "../../data";

export const dynamic = "force-dynamic";
const serpApiCooldown = 60 * 60 * 1_000;
type PortfolioResp = {
    assets : Array<(typeof assets)[number] & { price: number | null; pe: number | null; earnings: number | null; live: boolean; error: string | null }>;
    updateTime : string;
    liveCount : number;
    sourceFailure: boolean;
}
let cached: PortfolioResp = { assets: assets.map(asset => ({ ...asset, price: null, pe: null, earnings: null, live: false, error: null })), updateTime: new Date().toISOString(), liveCount: 0, sourceFailure: false };
let refreshing = false;
let lastSerpApiRequestAt = 0;

const number = (value?: string) => {
  const parsed = Number(value?.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};


const readMetric = (html: string, label: string) => {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(
      `<div[^>]*>\\s*${escapedLabel}\\s*<\\/div>\\s*<div[^>]*>([^<]+)<\\/div>`,
      "i",
    ),
  );
  return number(match?.[1]);
};


const fundamentals = async (symbol: string, exchange: string) => {
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${exchange}?hl=en`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; LedgerPortfolio/1.0)" },
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`Google Finance responded ${response.status}`);
  const html = await response.text();
  return {
    pe: readMetric(html, "P/E ratio"),
    earnings: readMetric(html, "EPS"),
  };
};


const marketPrice = async (symbol: string, exchange: string) => {
  const suffix = exchange === "NSE" ? "NS" : "BO";
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}.${suffix}?range=1d&interval=1m`, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`yahoo resp ${response.status}`);
  const data = await response.json();
  const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (typeof price !== "number") throw new Error("yahoo  did not return a market price");
  return price;
};

const serpApiFallback = async (symbol: string, exchange: string) => {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) throw new Error("SERP_API_KEY is not configured");

  if (Date.now() - lastSerpApiRequestAt < serpApiCooldown) {
    throw new Error("SerpApi fallback is limited to one request per hour");
  }
  lastSerpApiRequestAt = Date.now();

  const query = new URLSearchParams({
    engine: "google_finance",
    q: `${symbol}:${exchange}`,
    hl: "en",
    api_key: apiKey,
  });
  const response = await fetch(`https://serpapi.com/search.json?${query}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error ?? `SerpApi responded ${response.status}`);

  const stats = data.knowledge_graph?.key_stats?.stats ?? [];
  const stat = (label: string) => stats.find((item: { label?: string }) => item.label === label)?.value;

  return {
    price: data.summary?.extracted_price ?? null,
    pe: number(stat("P/E ratio")),
    earnings: number(stat("EPS")),
  };
};


const refreshPortfolio = async (): Promise<PortfolioResp> => {
  const updated = await Promise.all(assets.map(async assets => {
    const [price, metrics] = await Promise.allSettled([
      marketPrice(assets.symbol, assets.exchange),
      fundamentals(assets.symbol, assets.exchange)
    ]);
    const sourceFailure = price.status === "rejected" || metrics.status === "rejected";
    const fallback = sourceFailure
      ? await Promise.allSettled([serpApiFallback(assets.symbol, assets.exchange)])
      : null;
    const serpApi = fallback?.[0].status === "fulfilled" ? fallback[0].value : null;
    const errors = [price, metrics].filter(result => result.status === "rejected").map(result => result.status === "rejected" ? result.reason.message : "");
    return {
      ...assets,
      price: price.status === "fulfilled" ? price.value : serpApi?.price ?? null,
      pe: metrics.status === "fulfilled" ? metrics.value.pe : serpApi?.pe ?? null,
      earnings: metrics.status === "fulfilled" ? metrics.value.earnings : serpApi?.earnings ?? null,
      live: price.status === "fulfilled" || typeof serpApi?.price === "number",
      error: errors.length ? errors.join(" · ") : null
    };
  }));
  return {
    assets: updated,
    updateTime: new Date().toISOString(),
    liveCount: updated.filter(assets => assets.live).length,
    sourceFailure: updated.some(asset => asset.error !== null),
  };
};
const refresh = () => {
  if (refreshing) return;
  refreshing = true;
  void refreshPortfolio().then(value => { cached = value; }).catch(() => {}).finally(() => { refreshing = false; });
};
refresh();
setInterval(refresh, 15_000);

export async function GET() {
  return Response.json(cached, { headers: { "Cache-Control": "no-store" } });
}
