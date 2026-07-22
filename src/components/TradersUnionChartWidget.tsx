import React, { useEffect, useRef, useState } from 'react';

interface TradersUnionChartWidgetProps {
  symbol: string;
  height?: number;
  interval?: 'day' | 'hour' | 'week' | 'month';
  barType?: 'lines' | 'candles' | 'bars';
}

export function getTradersUnionSymbol(symbol: string): string {
  if (!symbol) return 'BTC/USD';
  const clean = symbol.trim().toUpperCase();
  if (clean.includes('/')) return clean;
  if (clean.endsWith('.PA')) {
    const base = clean.replace('.PA', '');
    return `${base}/EUR`;
  }
  return `${clean}/USD`;
}

export default function TradersUnionChartWidget({
  symbol,
  height = 480,
  interval = 'day',
  barType = 'lines'
}: TradersUnionChartWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const tuSymbol = getTradersUnionSymbol(symbol);

  useEffect(() => {
    setIsLoading(true);
    if (!containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';

    // Create the exact placeholder div required by Traders Union
    const placeholder = document.createElement('div');
    placeholder.className = 'tu-widget-placeholder tu-widget-quotes-placeholder';
    placeholder.setAttribute('data-widget', 'tu-widget-chart');
    placeholder.setAttribute('data-bar-type', barType);
    placeholder.setAttribute('data-interval', interval);
    placeholder.setAttribute('data-symbol', tuSymbol);
    placeholder.style.width = '100%';
    placeholder.style.height = `${height}px`;
    placeholder.style.minHeight = `${height}px`;

    containerRef.current.appendChild(placeholder);

    // Call init on window.tuQuotesPageWidgetsService as shown in the Traders Union Vue code
    const triggerInit = () => {
      const service = (window as any).tuQuotesPageWidgetsService;
      if (service && typeof service.init === 'function') {
        service.init();
        setTimeout(() => setIsLoading(false), 400);
        return true;
      }
      return false;
    };

    if (!triggerInit()) {
      // Poll briefly if the global service is initializing from index.html
      const checkTimer = setInterval(() => {
        if (triggerInit()) {
          clearInterval(checkTimer);
        }
      }, 150);

      const timeoutId = setTimeout(() => {
        clearInterval(checkTimer);
        setIsLoading(false);
      }, 4000);

      return () => {
        clearInterval(checkTimer);
        clearTimeout(timeoutId);
      };
    }
  }, [tuSymbol, height, interval, barType]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs my-2">
      {/* Header Badge */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            Widget Officiel Traders Union
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 font-mono">
            {tuSymbol}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
            Traders Union Quotes
          </span>
        </div>
      </div>

      {/* Embedded Container */}
      <div className="relative w-full" style={{ minHeight: `${height}px` }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs transition-opacity duration-300">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Chargement du graphique Traders Union...
              </span>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          style={{ minHeight: `${height}px` }}
          className="w-full relative min-h-[400px] bg-white dark:bg-slate-900"
        />
      </div>
    </div>
  );
}
