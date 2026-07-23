import React from "react";

interface StockPriceBadgeWidgetProps {
  symbol: string;
  compact?: boolean;
  price?: number;
  change?: number;
}

export default function StockPriceBadgeWidget({ symbol, compact = false, price, change }: StockPriceBadgeWidgetProps) {
  const isEuro = symbol.endsWith(".PA") || symbol === "MC" || symbol.startsWith("EURONEXT:");
  const currency = isEuro ? "€" : "$";
  const exchange = isEuro ? "EURONEXT" : symbol === "BABA" ? "NYSE" : "NASDAQ";

  const isPos = (change ?? 0) >= 0;
  const formattedPrice = typeof price === "number" ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
  const formattedChange = typeof change === "number" ? `${isPos ? "+" : ""}${change.toFixed(2)}%` : "";

  // Get stock full names for the large version
  const getStockName = (sym: string) => {
    switch (sym) {
      case "AAPL": return "Apple Inc.";
      case "MSFT": return "Microsoft Corporation";
      case "NVDA": return "NVIDIA Corporation";
      case "TSLA": return "Tesla, Inc.";
      case "AMZN": return "Amazon.com, Inc.";
      case "META": return "Meta Platforms, Inc.";
      case "GOOGL": return "Alphabet Inc.";
      case "NFLX": return "Netflix, Inc.";
      case "SAN.PA": return "Sanofi S.A.";
      case "AIR.PA": return "Airbus SE";
      case "MC": return "LVMH Moët Hennessy";
      case "OR.PA": return "L'Oréal S.A.";
      case "ASML": return "ASML Holding N.V.";
      default: return `${sym} Stock`;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col items-end justify-center h-full pr-1 ml-auto">
        <span className="font-bold text-sm font-mono text-slate-950 dark:text-slate-100 leading-none">
          {formattedPrice} {currency}
        </span>
        {formattedChange && (
          <span className={`text-[10px] font-bold font-mono mt-1 leading-none ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {formattedChange}
          </span>
        )}
      </div>
    );
  }

  // Large version for ticker display
  return (
    <div className="w-full sm:w-[320px] h-[120px] rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between transition-all duration-250 hover:shadow-md shadow-xs">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base font-mono text-slate-950 dark:text-white tracking-tight">{symbol}</span>
            <span className="text-[9px] px-1 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-400 font-bold font-sans tracking-wider uppercase">
              {exchange}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[170px] font-medium">
            {getStockName(symbol)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold font-mono text-slate-950 dark:text-white block leading-none">
            {formattedPrice} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-0.5">{currency}</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-sans mt-1.5 block">
            {isEuro ? "EUR" : "USD"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-1.5">
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Variation (24h)</span>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono ${
          isPos 
            ? "bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
            : "bg-rose-50/60 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
        }`}>
          <span>{isPos ? "▲" : "▼"}</span>
          <span>{formattedChange}</span>
        </div>
      </div>
    </div>
  );
}
