import React, { useState } from 'react';
import { Globe, TrendingUp, RefreshCw, ExternalLink, ShieldCheck, BarChart3 } from 'lucide-react';

interface InvestingWidgetProps {
  symbol?: string;
  height?: number;
}

// Pair IDs mapping for Investing.com widgets
const INVESTING_PAIRS: Record<string, { id: number; name: string; country: string }> = {
  AAPL: { id: 6408, name: 'Apple Inc', country: 'USA' },
  MSFT: { id: 252, name: 'Microsoft Corp', country: 'USA' },
  NVDA: { id: 6497, name: 'NVIDIA Corp', country: 'USA' },
  TSLA: { id: 13994, name: 'Tesla Inc', country: 'USA' },
  AMZN: { id: 6435, name: 'Amazon.com Inc', country: 'USA' },
  META: { id: 26490, name: 'Meta Platforms', country: 'USA' },
  GOOGL: { id: 6369, name: 'Alphabet Inc', country: 'USA' },
  NFLX: { id: 13063, name: 'Netflix Inc', country: 'USA' },
  'SAN.PA': { id: 23073, name: 'Sanofi SA', country: 'France' },
  'AIR.PA': { id: 23141, name: 'Airbus SE', country: 'France' },
  MC: { id: 23068, name: 'LVMH Moet Hennessy', country: 'France' },
  'OR.PA': { id: 23069, name: "L'Oreal SA", country: 'France' },
  ASML: { id: 41062, name: 'ASML Holding', country: 'Europe' }
};

export default function InvestingWidget({
  symbol = 'AAPL',
  height = 550
}: InvestingWidgetProps) {
  const [activeView, setActiveView] = useState<'QUOTES' | 'TECHNICAL' | 'INDICES'>('QUOTES');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'US' | 'FRANCE'>('ALL');
  const [key, setKey] = useState(0);

  const cleanSymbol = symbol.replace('EURONEXT:', '');
  const pairInfo = INVESTING_PAIRS[cleanSymbol] || { id: 6408, name: cleanSymbol, country: 'Global' };

  // Generate clean widget iframe URLs for Investing.com
  // 1. Live Market Quotes Widget
  const quotesCountryId = marketFilter === 'FRANCE' ? '22' : '5'; // 5 = US, 22 = France
  const quotesWidgetUrl = `https://fr.widgets.investing.com/top-stocks?theme=darkTheme&country_id=${quotesCountryId}&roundedCorners=true`;

  // 2. Technical Summary Widget
  const technicalWidgetUrl = `https://fr.widgets.investing.com/technical-summary?theme=darkTheme&roundedCorners=true&pairs=6408,252,6497,13994,6435,26490,23068,23073,23141,13063`;

  // 3. Global Major Indices Widget
  const indicesWidgetUrl = `https://fr.widgets.investing.com/major-indices?theme=darkTheme&roundedCorners=true`;

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs my-2">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-500" />
            Investing.com Live Market Data 🌐
          </span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView('QUOTES')}
              className={`px-3 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                activeView === 'QUOTES'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cotations Actions</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('TECHNICAL')}
              className={`px-3 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                activeView === 'TECHNICAL'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analyse Technique</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('INDICES')}
              className={`px-3 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                activeView === 'INDICES'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Indices Mondiaux</span>
            </button>
          </div>

          {activeView === 'QUOTES' && (
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMarketFilter('ALL')}
                className={`px-2 py-0.5 rounded ${marketFilter === 'ALL' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setMarketFilter('US')}
                className={`px-2 py-0.5 rounded ${marketFilter === 'US' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
              >
                🇺🇸 US (Wall St)
              </button>
              <button
                type="button"
                onClick={() => setMarketFilter('FRANCE')}
                className={`px-2 py-0.5 rounded ${marketFilter === 'FRANCE' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
              >
                🇫🇷 Euronext Paris
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Rafraîchir les flux Investing.com"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://fr.investing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center gap-1 text-xs"
            title="Ouvrir sur Investing.com"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 font-mono">
            {symbol} ({pairInfo.name})
          </span>
        </div>
      </div>

      {/* Widget Frame Container */}
      <div className="relative w-full bg-slate-950 flex flex-col items-center justify-center" style={{ minHeight: `${height}px` }}>
        {activeView === 'QUOTES' && (
          <iframe
            key={`investing-quotes-${marketFilter}-${key}`}
            src={quotesWidgetUrl}
            style={{
              border: 'none',
              width: '100%',
              height: `${height}px`,
              display: 'block'
            }}
            title="Investing.com Cotations Boursières"
          />
        )}

        {activeView === 'TECHNICAL' && (
          <iframe
            key={`investing-tech-${key}`}
            src={technicalWidgetUrl}
            style={{
              border: 'none',
              width: '100%',
              height: `${height}px`,
              display: 'block'
            }}
            title="Investing.com Analyse Technique"
          />
        )}

        {activeView === 'INDICES' && (
          <iframe
            key={`investing-indices-${key}`}
            src={indicesWidgetUrl}
            style={{
              border: 'none',
              width: '100%',
              height: `${height}px`,
              display: 'block'
            }}
            title="Investing.com Indices Boursiers Mondiaux"
          />
        )}
      </div>

      {/* Footer Info Banner */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Flux certifié Investing.com Live Data — Bourses de New York (NASDAQ/NYSE) & Euronext
        </span>
        <span className="font-mono text-[10px]">MAJ en temps réel</span>
      </div>
    </div>
  );
}
