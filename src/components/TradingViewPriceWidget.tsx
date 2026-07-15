import React, { useEffect, useState } from "react";
import { getTradingViewSymbol } from "./TradingViewWidget";

interface TradingViewPriceWidgetProps {
  symbol: string;
}

export default function TradingViewPriceWidget({ symbol }: TradingViewPriceWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => 
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const tvSymbol = getTradingViewSymbol(symbol);

  // Monitor document.documentElement class list for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Configuration for the TradingView Single Ticker/Quote widget
  const config = {
    symbol: tvSymbol,
    width: "100%",
    colorTheme: isDark ? "dark" : "light",
    isTransparent: true,
    locale: "fr"
  };

  // Construct the secure iframe source URL for the Single Quote embed widget
  const iframeUrl = `https://s.tradingview.com/embed-widget/single-quote/?locale=fr#${encodeURIComponent(
    JSON.stringify(config)
  )}`;

  useEffect(() => {
    setIsLoading(true);
    // Give a small safety timeout to show transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [tvSymbol, isDark]);

  return (
    <div className="relative w-full sm:w-[320px] h-[120px] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center transition-colors duration-250">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 gap-2">
          <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">Initialisation...</span>
        </div>
      )}
      <iframe
        key={`${tvSymbol}-${isDark ? "dark" : "light"}`}
        title={`TradingView Price for ${symbol}`}
        src={iframeUrl}
        className="w-full h-full border-none overflow-hidden"
        scrolling="no"
        allowFullScreen
        onLoad={() => {
          // Add a tiny delay to ensure the widget has rendered inside the iframe
          setTimeout(() => setIsLoading(false), 300);
        }}
      />
    </div>
  );
}
