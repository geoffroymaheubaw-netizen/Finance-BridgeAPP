import React, { useEffect, useState } from "react";
import { Maximize2, Minimize2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// Tickers to map accurately from our application to standard TradingView formats
export function getTradingViewSymbol(symbol: string): string {
  if (!symbol) return "NASDAQ:AAPL";
  
  // Custom mappings for specific stocks
  if (symbol === "MC") return "EURONEXT:MC";
  if (symbol.endsWith(".PA")) {
    const base = symbol.replace(".PA", "");
    return `EURONEXT:${base}`;
  }
  
  const nasdaqTickers = [
    "AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN", "NFLX", "COIN", "META", 
    "AMD", "ASML", "LLY", "ADBE", "CRM", "TSM", "AVGO", "QCOM", "ORCL", "INTC", "CSCO"
  ];
  
  if (nasdaqTickers.includes(symbol)) {
    return `NASDAQ:${symbol}`;
  }
  
  const nyseTickers = [
    "DIS", "V", "JPM", "WMT", "JNJ", "PG", "XOM", "COST", "MA", "CVX", "BAC", 
    "PEP", "KO", "MRK", "NKE", "MCD", "IBM", "GE", "SBUX"
  ];
  if (nyseTickers.includes(symbol)) {
    return `NYSE:${symbol}`;
  }
  
  return symbol;
}

interface TradingViewWidgetProps {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLargeHeight, setIsLargeHeight] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tvSymbol = getTradingViewSymbol(symbol);

  // Build the sandboxed iframe URL for safe, error-free loading
  // We enable the side toolbar and allow full drawing/analysis tools by setting hide_side_toolbar=0
  const iframeUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    tvSymbol
  )}&interval=D&theme=light&style=3&timezone=Europe%2FParis&locale=fr&hide_side_toolbar=0&allow_symbol_change=0&saveimage=1&studies=%5B%5D`;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [tvSymbol]);

  // Lock scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const renderWidgetContent = (heightClass: string) => (
    <div className={`relative w-full ${heightClass} bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 flex flex-col`}>
      {/* Widget Custom Tool Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-150 z-20">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700 font-sans tracking-wide">
            Analyse Pro: {symbol} ({tvSymbol})
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Toggle inline height button */}
          {!isFullscreen && (
            <button
              onClick={() => setIsLargeHeight(!isLargeHeight)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title={isLargeHeight ? "Vue compacte (450px)" : "Agrandir le plan de travail (700px)"}
            >
              {isLargeHeight ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Hauteur Standard</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Agrandir Hauteur</span>
                </>
              )}
            </button>
          )}

          {/* Toggle Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer hover:shadow-md"
            title={isFullscreen ? "Réduire à la taille normale" : "Passer en grand écran immersif"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Quitter Plein Écran</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Plein Écran</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 top-[42px] flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-xs z-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-3 text-xs font-semibold text-slate-500 font-sans">
            Chargement de l'environnement TradingView...
          </span>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 w-full bg-slate-50">
        <iframe
          title={`TradingView Chart for ${symbol}`}
          src={iframeUrl}
          className="w-full h-full border-none"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Standard embedded layout */}
      {!isFullscreen && renderWidgetContent(isLargeHeight ? "h-[700px]" : "h-[460px]")}

      {/* Immersive high-definition Fullscreen layout */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div className="w-full h-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {renderWidgetContent("h-full")}
          </div>
        </div>
      )}
    </>
  );
}
