import React, { useState } from "react";
import { Stock, UserProfile, PortfolioItem } from "../types";
import { ArrowUpRight, ArrowDownRight, DollarSign, Briefcase, History, TrendingUp, Info, Newspaper, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Search, Layers, GraduationCap, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStockMarket, isMarketOpenForStock, getZonedDateTime } from "../utils";
import TradingViewWidget from "./TradingViewWidget";
import TradingViewPriceWidget from "./TradingViewPriceWidget";

// Stable LCG pseudo-random generator
function getSeededRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (h * 31 + seedStr.charCodeAt(i)) | 0;
  }
  return function() {
    h = (h + 0x9e3779b9) | 0;
    let z = h;
    z ^= z >>> 16;
    z = Math.imul(z, 0x21f0aa95);
    z ^= z >>> 15;
    z = Math.imul(z, 0x735a2d97);
    z ^= z >>> 15;
    return (z >>> 0) / 4294967296;
  };
}

// Linear interpolation utility to smooth out curves and make them infinitely more precise
export function interpolateArray(arr: number[], targetLength: number): number[] {
  if (!arr || arr.length === 0) return [];
  if (arr.length === 1) return Array(targetLength).fill(arr[0]);
  const result: number[] = [];
  for (let i = 0; i < targetLength; i++) {
    const rawIndex = (i / (targetLength - 1)) * (arr.length - 1);
    const low = Math.floor(rawIndex);
    const high = Math.min(arr.length - 1, Math.ceil(rawIndex));
    const weight = rawIndex - low;
    result.push(arr[low] * (1 - weight) + arr[high] * weight);
  }
  return result;
}

/**
 * Calculates the index up to which the 1-Day (1J) chart should render,
 * representing only the available trading data up to the current real time.
 */
export function get1DCurrentDayLimit(symbol: string, marketMode: string, totalPoints: number): number {
  const isUS = !symbol.endsWith(".PA") && symbol !== "MC";
  const zone = isUS ? "America/New_York" : "Europe/Paris";
  
  const isOpen = isMarketOpenForStock(symbol, marketMode as any);
  
  if (marketMode === "continuous") {
    const { hour, minute } = getZonedDateTime(zone);
    const currMinutes = hour * 60 + minute;
    const progress = currMinutes / 1440; // 24 hours
    return Math.max(1, Math.min(totalPoints, Math.ceil(progress * totalPoints)));
  } else if (isOpen) {
    const { hour, minute } = getZonedDateTime(zone);
    const currMinutes = hour * 60 + minute;
    const openMinutes = isUS ? 9 * 60 + 30 : 9 * 60;
    const totalDuration = isUS ? 390 : 510; // US: 390 mins, EU: 510 mins
    const elapsed = Math.max(0, currMinutes - openMinutes);
    const progress = Math.min(1, elapsed / totalDuration);
    return Math.max(1, Math.min(totalPoints, Math.ceil(progress * totalPoints)));
  } else {
    // Closed, show entire session completed
    return totalPoints;
  }
}

// Generates incredibly realistic high-density historical curves for all stock tickers
export function getTimeframeData(stock: Stock, tf: string): { prices: number[]; labels: [string, string, string] } {
  const currentPrice = stock.price;
  const historyToUse = stock.history || [];
  const hasRealHistory = historyToUse.length > 30; // Real historical data loaded from Twelve Data has length 350

  const random = getSeededRandom(`${stock.symbol}-${tf}`);

  let N = 60;
  let volatility = 0.005;
  let drift = 0.0001;
  let startFraction = 1.0;
  let labels: [string, string, string] = ["Début", "Milieu", "Aujourd'hui"];

  switch (tf) {
    case "1m":
      N = 60; // 60 data points (every 30s)
      volatility = 0.0006;
      drift = 0;
      labels = ["Il y a 30 min", "Il y a 15 min", "Maintenant"];
      break;
    case "1h":
      N = 48; // 48 data points (every 30 min)
      volatility = 0.001;
      drift = 0;
      labels = ["Il y a 24 h", "Il y a 12 h", "Maintenant"];
      break;
    case "1J":
      N = 390; // 390 data points
      volatility = 0.0008;
      drift = 0.00002;
      labels = stock.symbol.endsWith(".PA") || stock.symbol === "MC" 
        ? ["09:00", "13:15", "17:30"] 
        : ["09:30", "13:00", "16:00"];
      break;
    case "1S":
      N = 70; // 70 data points (high density week)
      volatility = 0.0035;
      drift = 0.0002;
      labels = ["Il y a 7 j", "Il y a 3 j", "Aujourd'hui"];
      break;
    case "1M":
      // Smooth the real stock.history and make it 120 points!
      const history30 = hasRealHistory ? historyToUse.slice(-30) : historyToUse;
      return {
        prices: interpolateArray(history30, 120).map(p => parseFloat(p.toFixed(2))),
        labels: ["Il y a 30 jours", "Il y a 15 jours", "Aujourd'hui"]
      };
    case "3M":
      if (hasRealHistory) {
        return {
          prices: historyToUse.slice(-150).map(p => parseFloat(p.toFixed(2))),
          labels: ["Il y a 3 mois", "Il y a 45 j.", "Aujourd'hui"]
        };
      }
      N = 150; // 150 data points
      volatility = 0.008;
      drift = 0.0004;
      labels = ["Il y a 3 mois", "Il y a 45 j.", "Aujourd'hui"];
      break;
    case "6M":
      if (hasRealHistory) {
        return {
          prices: historyToUse.slice(-180).map(p => parseFloat(p.toFixed(2))),
          labels: ["Il y a 6 mois", "Il y a 3 mois", "Aujourd'hui"]
        };
      }
      N = 180; // 180 data points
      volatility = 0.012;
      drift = 0.0006;
      labels = ["Il y a 6 mois", "Il y a 3 mois", "Aujourd'hui"];
      break;
    case "1A":
      if (hasRealHistory) {
        return {
          prices: historyToUse.slice(-250).map(p => parseFloat(p.toFixed(2))),
          labels: ["Il y a 1 an", "Il y a 6 mois", "Aujourd'hui"]
        };
      }
      N = 250; // 250 trading days
      volatility = 0.018;
      drift = 0.001;
      startFraction = 0.72;
      if (stock.symbol === "NVDA") startFraction = 0.3;
      else if (stock.symbol === "COIN") { startFraction = 0.48; volatility = 0.035; }
      else if (stock.symbol === "TSLA") { startFraction = 0.9; volatility = 0.025; }
      labels = ["Il y a 1 an", "Il y a 6 mois", "Aujourd'hui"];
      break;
    case "Tout":
      if (hasRealHistory) {
        return {
          prices: historyToUse.slice(-350).map(p => parseFloat(p.toFixed(2))),
          labels: ["Entrée en Bourse", "Moyen Terme", "Aujourd'hui"]
        };
      }
      N = 350; // 350 data points
      volatility = 0.024;
      drift = 0.002;
      if (stock.symbol === "AAPL") startFraction = 0.05;
      else if (stock.symbol === "MSFT") startFraction = 0.08;
      else if (stock.symbol === "NVDA") startFraction = 0.01;
      else if (stock.symbol === "TSLA") startFraction = 0.02;
      else if (stock.symbol === "COIN") startFraction = 0.4;
      else startFraction = 0.15;
      labels = ["Entrée en Bourse", "Moyen Terme", "Aujourd'hui"];
      break;
    default:
      N = 60;
  }

  const base: number[] = new Array(N);
  base[N - 1] = 1.0;

  for (let i = N - 2; i >= 0; i--) {
    let stepDrift = drift;
    if (startFraction !== 1.0) {
      const targetAtI = startFraction + (1.0 - startFraction) * (i / (N - 1));
      const currentExpected = base[i + 1];
      stepDrift = (currentExpected - targetAtI) * 0.08;
    }
    const rand = (random() - 0.48) * 2;
    const move = rand * volatility - stepDrift;
    base[i] = Math.max(0.01, base[i + 1] * (1 - move));
  }

  // NVDA Rocket growth representation
  if (tf === "Tout" && stock.symbol === "NVDA") {
    for (let i = 0; i < N; i++) {
      const progress = i / (N - 1);
      base[i] = 0.005 + 0.995 * Math.pow(progress, 4.2) * (0.85 + 0.15 * random());
    }
  }

  const prices = base.map(b => parseFloat((b * currentPrice).toFixed(2)));
  prices[N - 1] = currentPrice;

  return { prices, labels };
}

interface SimulatorTabProps {
  stocks: Stock[];
  profile: UserProfile;
  onTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number, stopLoss?: number | null) => void;
  onUpdateStopLoss: (symbol: string, stopLoss?: number | null) => void;
  lang: string;
  t: (key: string) => string;
  onSelectStock?: (symbol: string) => void;
}

export default function SimulatorTab({ stocks, profile, onTrade, onUpdateStopLoss, lang, t, onSelectStock }: SimulatorTabProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");

  const onSelectStockRef = React.useRef(onSelectStock);
  React.useEffect(() => {
    onSelectStockRef.current = onSelectStock;
  }, [onSelectStock]);

  React.useEffect(() => {
    if (selectedSymbol) {
      const fetchHistory = () => {
        if (onSelectStockRef.current) {
          onSelectStockRef.current(selectedSymbol);
        }
      };

      fetchHistory();

      const interval = setInterval(fetchHistory, 15000);

      return () => clearInterval(interval);
    }
  }, [selectedSymbol]);

  const [guidedLearningActive, setGuidedLearningActive] = useState<boolean>(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [hoveredPrice, setHoveredPrice] = useState<{ price: number; index: number } | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [localNews, setLocalNews] = useState<any[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'LINE' | 'CANDLESTICK' | 'TRADINGVIEW'>('TRADINGVIEW');
  const [compareSymbol, setCompareSymbol] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>("1M");
  
  // Stop-Loss inputs and switches
  const [useStopLoss, setUseStopLoss] = useState<boolean>(false);
  const [stopLossValue, setStopLossValue] = useState<string>("");
  const [stopLossPreset, setStopLossPreset] = useState<'5' | '10' | '15' | '20' | 'custom'>('10');
  const [customPct, setCustomPct] = useState<number>(12); // Default to a custom 12% drop
  const [editStopLossActive, setEditStopLossActive] = useState<boolean>(false);
  const [editStopLossValue, setEditStopLossValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("simulator_watchlist");
    return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "TSLA"];
  });

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem("simulator_watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  // Dynamically calculate stop loss value based on selected preset or custom slide percentage
  React.useEffect(() => {
    if (selectedStock) {
      if (stopLossPreset !== 'custom') {
        const pct = parseInt(stopLossPreset);
        setStopLossValue((selectedStock.price * (1 - pct / 100)).toFixed(2));
      } else {
        setStopLossValue((selectedStock.price * (1 - customPct / 100)).toFixed(2));
      }
      setEditStopLossActive(false);
    }
  }, [selectedSymbol, stopLossPreset, customPct]);

  // Handler for custom text entry to parse percentage and move customPct slider accordingly
  const handleStopLossInputChange = (valStr: string) => {
    setStopLossValue(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0 && selectedStock.price > 0 && parsed < selectedStock.price) {
      const pctValue = ((selectedStock.price - parsed) / selectedStock.price) * 100;
      setStopLossPreset('custom');
      setCustomPct(Math.max(1, Math.min(90, parseFloat(pctValue.toFixed(1)))));
    } else {
      setStopLossPreset('custom');
    }
  };

  // High-fidelity zoom states for fullscreen and interactive scaling
  const [isZoomExpanded, setIsZoomExpanded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // Range from 1x to 8x
  const [panOffsetPercent, setPanOffsetPercent] = useState<number>(100); // 100 means latest data
  const [hoveredZoomPrice, setHoveredZoomPrice] = useState<{ price: number; index: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);

  const position = profile.portfolio.find(p => p.symbol === selectedStock.symbol);
  const marketType = getStockMarket(selectedStock.symbol);
  const isStockMarketOpen = isMarketOpenForStock(selectedStock.symbol, profile.marketMode || 'real');

  // Keep a ref to the latest stocks to reference offline fallback news without triggering re-fetches on price changes
  const stocksRef = React.useRef(stocks);
  React.useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  // Fetch Yahoo Finance Real-time News via dynamic AI Proxy Route
  React.useEffect(() => {
    let active = true;
    setIsNewsLoading(true);
    setLocalNews([]);
    setSelectedNewsId(null);

    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${selectedSymbol}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        if (active) {
          setLocalNews(data);
        }
      } catch (error) {
        console.log("[News Feed] Standard info update - switched to static news fallback.");
        if (active) {
          const currentStock = stocksRef.current.find(s => s.symbol === selectedSymbol);
          setLocalNews(currentStock?.news || []);
        }
      } finally {
        if (active) {
          setIsNewsLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      active = false;
    };
  }, [selectedSymbol]);

  const displayNews = localNews.length > 0 ? localNews : (selectedStock.news || []);

  // Cost estimates
  const estimatedCost = tradeShares * selectedStock.price;
  const isAffordable = profile.cash >= estimatedCost;
  const hasSharesToSell = position ? position.shares >= tradeShares : false;

  const parsedStopLossNum = parseFloat(stopLossValue);
  const isStopLossInvalid = useStopLoss && (isNaN(parsedStopLossNum) || parsedStopLossNum <= 0 || parsedStopLossNum >= selectedStock.price);

  // Render SVG Sparkline
  const renderSparkline = (history: number[], isPositive: boolean) => {
    if (!history || history.length === 0) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * 60;
      const y = 20 - ((val - min) / range) * 15;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-16 h-8 overflow-visible" viewBox="0 0 60 20">
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#f43f5e"}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  // Detailed SVG line or candlestick chart with grids, gradient and ticks
  const renderDetailedChart = (history: number[], isPositive: boolean, chartLabels: string[]) => {
    // Robust cleanup of histories
    const cleanHistory = (history || []).map(h => typeof h === 'number' && !isNaN(h) ? h : selectedStock.price);
    if (cleanHistory.length === 0) return null;

    const width = 540;
    const height = 190;
    const padLeft = 12;
    const padRight = 58; // Dedicate a clean right margin for true vertical axis pricing
    const padTop = 15;
    const padBottom = 22;

    const chartWidth = width - padLeft - padRight;
    const chartHeight = height - padTop - padBottom;

    const comparisonStock = compareSymbol ? stocks.find(s => s.symbol === compareSymbol) : null;
    const comparisonHistory = comparisonStock ? getTimeframeData(comparisonStock, timeframe).prices : [];
    const cleanComparisonHistory = comparisonHistory.map(c => typeof c === 'number' && !isNaN(c) ? c : (comparisonStock ? comparisonStock.price : 1));

    // IF COMPARING TWO ASSETS: NORMALIZED % PERFORMANCE COMPARISON WITH REAL-TIME INDICATORS
    if (comparisonStock && cleanComparisonHistory.length > 0) {
      const primInit = cleanHistory[0] || 1;
      const compInit = cleanComparisonHistory[0] || 1;

      const primPerfs = cleanHistory.map(h => ((h - primInit) / primInit) * 100);
      const compPerfs = cleanComparisonHistory.map(c => ((c - compInit) / compInit) * 100);

      const minPerf = Math.min(...primPerfs, ...compPerfs);
      const maxPerf = Math.max(...primPerfs, ...compPerfs);

      let minPerfVal = minPerf;
      let maxPerfVal = maxPerf;
      if (isNaN(minPerfVal) || !isFinite(minPerfVal)) minPerfVal = -10;
      if (isNaN(maxPerfVal) || !isFinite(maxPerfVal)) maxPerfVal = 10;

      let min = minPerfVal - Math.max(1.5, Math.abs(minPerfVal) * 0.15);
      let max = maxPerfVal + Math.max(1.5, Math.abs(maxPerfVal) * 0.15);
      
      if (isNaN(min) || !isFinite(min)) min = -10;
      if (isNaN(max) || !isFinite(max)) max = 10;
      let range = max - min;
      if (isNaN(range) || range <= 0) range = 1;

      const primLengthMinusOne = Math.max(1, cleanHistory.length - 1);
      const compLengthMinusOne = Math.max(1, cleanComparisonHistory.length - 1);

      const primPoints = primPerfs.map((perf, idx) => {
        const x = padLeft + (idx / primLengthMinusOne) * chartWidth;
        const y = height - padBottom - ((perf - min) / range) * chartHeight;
        return { x, y, perf, idx, rawPrice: cleanHistory[idx] };
      });

      const compPoints = compPerfs.map((perf, idx) => {
        const x = padLeft + (idx / compLengthMinusOne) * chartWidth;
        const y = height - padBottom - ((perf - min) / range) * chartHeight;
        return { x, y, perf, idx, rawPrice: cleanComparisonHistory[idx] };
      });

      // Align 5 horizontal grid levels (0%, 25%, 50%, 75%, 100% height) with exact relative percentage values
      const gridLevels = [0, 0.25, 0.5, 0.75, 1];
      const gridLines = gridLevels.map((ratio) => {
        const y = padTop + ratio * chartHeight;
        const value = max - ratio * range;
        return { y, value };
      });

      const visibleCount = timeframe === "1J" ? get1DCurrentDayLimit(selectedStock.symbol, profile.marketMode || "real", cleanHistory.length) : cleanHistory.length;
      const visiblePrimPoints = primPoints.slice(0, visibleCount);
      const visibleCompPoints = compPoints.slice(0, visibleCount);

      const primPathString = visiblePrimPoints.map(p => `${p.x},${p.y}`).join(" L ");
      const compPathString = visibleCompPoints.map(p => `${p.x},${p.y}`).join(" L ");
      const primAreaString = visiblePrimPoints.length > 0 ? `${visiblePrimPoints[0].x},${height - padBottom} L ${primPathString} L ${visiblePrimPoints[visiblePrimPoints.length - 1].x},${height - padBottom} Z` : "";
      const compAreaString = visibleCompPoints.length > 0 ? `${visibleCompPoints[0].x},${height - padBottom} L ${compPathString} L ${visibleCompPoints[visibleCompPoints.length - 1].x},${height - padBottom} Z` : "";

      const idxHovered = hoveredPrice?.index ?? null;

      // Tooltip translation labels
      const labelForTooltip = timeframe === "1m" ? `Minute ${idxHovered! + 1}` : timeframe === "1h" ? `Heure ${idxHovered! + 1}` : timeframe === "1J" ? `Séance ${idxHovered! + 1}` : `Jour ${idxHovered! + 1}`;

      // Live ending performance value
      const primLatestPerf = primPerfs[visibleCount - 1];
      const compLatestPerf = compPerfs[visibleCount - 1];
      const liveYPrim = height - padBottom - ((primLatestPerf - min) / range) * chartHeight;
      const liveYComp = height - padBottom - ((compLatestPerf - min) / range) * chartHeight;

      return (
        <div className="relative">
          {/* Statistical Header to maximize data precision */}
          <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 bg-slate-50/70 border border-slate-200/30 px-3 py-1.5 rounded-xl mb-2.5">
            <div className="flex gap-4">
              <span>Haut (Rel.): <strong className="text-emerald-600">+{maxPerfVal.toFixed(1)}%</strong></span>
              <span>Bas (Rel.): <strong className="text-rose-600">{minPerfVal.toFixed(1)}%</strong></span>
              <span>Amplitude : <strong className="text-slate-700">{(maxPerfVal - minPerfVal).toFixed(1)}%</strong></span>
            </div>
            <div className="flex gap-2">
              <span className="text-indigo-600 font-bold">{selectedStock.symbol} : {primLatestPerf >= 0 ? "+" : ""}{primLatestPerf.toFixed(2)}%</span>
              <span className="text-amber-500 font-bold">{comparisonStock.symbol} : {compLatestPerf >= 0 ? "+" : ""}{compLatestPerf.toFixed(2)}%</span>
            </div>
          </div>

          <svg className="w-full h-52 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="primGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="compGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid lines with aligned right axis values */}
            {gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={gl.y}
                  x2={width - padRight}
                  y2={gl.y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - padRight + 6}
                  y={gl.y + 3}
                  fill="#64748b"
                  fontSize="8"
                  textAnchor="start"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {gl.value >= 0 ? "+" : ""}{gl.value.toFixed(1)}%
                </text>
              </g>
            ))}

            {/* Area under the curves */}
            <path d={`M ${primAreaString}`} fill="url(#primGlow)" />
            <path d={`M ${compAreaString}`} fill="url(#compGlow)" />

            {/* Zero Base reference dashed line */}
            {(() => {
              const zeroY = height - padBottom - ((0 - min) / range) * chartHeight;
              if (!isNaN(zeroY) && zeroY >= padTop && zeroY <= height - padBottom) {
                return (
                  <line
                    x1={padLeft}
                    y1={zeroY}
                    x2={width - padRight}
                    y2={zeroY}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                );
              }
              return null;
            })()}

            {/* Live Ending Line & Badges for Primary Stock (Indigo) */}
            {!isNaN(liveYPrim) && liveYPrim >= padTop && liveYPrim <= height - padBottom && (
              <g>
                <line
                  x1={padLeft}
                  y1={liveYPrim}
                  x2={width - padRight}
                  y2={liveYPrim}
                  stroke="#818cf8"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.75"
                />
                <rect
                  x={width - padRight}
                  y={liveYPrim - 6.5}
                  width={padRight}
                  height={13}
                  rx={2}
                  fill="#6366f1"
                />
                <text
                  x={width - padRight + 4}
                  y={liveYPrim + 3.5}
                  fill="#ffffff"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {primLatestPerf >= 0 ? "+" : ""}{primLatestPerf.toFixed(1)}%
                </text>
              </g>
            )}

            {/* Live Ending Line & Badges for Comparison Stock (Amber) */}
            {!isNaN(liveYComp) && liveYComp >= padTop && liveYComp <= height - padBottom && (
              <g>
                <line
                  x1={padLeft}
                  y1={liveYComp}
                  x2={width - padRight}
                  y2={liveYComp}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.75"
                />
                <rect
                  x={width - padRight}
                  y={liveYComp - 6.5}
                  width={padRight}
                  height={13}
                  rx={2}
                  fill="#f59e0b"
                />
                <text
                  x={width - padRight + 4}
                  y={liveYComp + 3.5}
                  fill="#ffffff"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {compLatestPerf >= 0 ? "+" : ""}{compLatestPerf.toFixed(1)}%
                </text>
              </g>
            )}

            {/* Curve loop path Primary */}
            <path
              d={`M ${primPathString}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Curve loop path Comparison */}
            <path
              d={`M ${compPathString}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive slices */}
            {visiblePrimPoints.map((p) => {
              const stepX = chartWidth / primLengthMinusOne;
              return (
                <rect
                  key={`slice-${p.idx}`}
                  x={p.x - stepX / 2}
                  y={padTop}
                  width={stepX}
                  height={chartHeight}
                  fill="transparent"
                  stroke="none"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPrice({ price: p.rawPrice, index: p.idx })}
                  onMouseLeave={() => setHoveredPrice(null)}
                />
              );
            })}

            {/* Hover vertical timeline bar */}
            {idxHovered !== null && visiblePrimPoints[idxHovered] && (
              <line
                x1={visiblePrimPoints[idxHovered].x}
                y1={padTop}
                x2={visiblePrimPoints[idxHovered].x}
                y2={height - padBottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
            )}

            {/* Highlighted circles on hover */}
            {idxHovered !== null && visiblePrimPoints[idxHovered] && visibleCompPoints[idxHovered] && (
              <>
                <circle
                  cx={visiblePrimPoints[idxHovered].x}
                  cy={visiblePrimPoints[idxHovered].y}
                  r="5"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle
                  cx={visibleCompPoints[idxHovered].x}
                  cy={visibleCompPoints[idxHovered].y}
                  r="5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Axis grid borders */}
            <line
              x1={padLeft}
              y1={height - padBottom}
              x2={width - padRight}
              y2={height - padBottom}
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <line
              x1={width - padRight}
              y1={padTop}
              x2={width - padRight}
              y2={height - padBottom}
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />

            {/* Timeframe annotations */}
            <text x={padLeft} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="start">
              {chartLabels[0]}
            </text>
            <text x={(width - padRight) / 2} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="middle">
              {chartLabels[1]}
            </text>
            <text x={width - padRight} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="end">
              {chartLabels[2]}
            </text>
          </svg>

          {/* Double Info Tooltip */}
          <div className="absolute top-2 right-[65px] bg-slate-900 border border-slate-800 text-slate-100 text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg shadow-md font-mono flex flex-col min-w-[155px] max-w-[240px] divide-y divide-slate-800 gap-1 pb-1 z-10">
            {idxHovered !== null && primPoints[idxHovered] && compPoints[idxHovered] ? (
              <>
                <div className="font-sans font-bold text-[9px] uppercase text-slate-400 text-center pb-0.5">
                  Perf. relative : {labelForTooltip}
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center gap-4">
                    <span className="flex items-center gap-1 font-sans font-bold text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {selectedStock.symbol}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-indigo-400">{primPoints[idxHovered].rawPrice.toFixed(2)} $</span>
                      <span className="text-[9px] text-slate-400 block font-semibold">
                        ({primPerfs[idxHovered] >= 0 ? "+" : ""}{primPerfs[idxHovered].toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="flex items-center gap-1 font-sans font-bold text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {comparisonStock.symbol}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-amber-400">{compPoints[idxHovered].rawPrice.toFixed(2)} $</span>
                      <span className="text-[9px] text-slate-400 block font-semibold">
                        ({compPerfs[idxHovered] >= 0 ? "+" : ""}{compPerfs[idxHovered].toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="font-sans font-bold text-[9px] uppercase text-slate-400 text-center pb-0.5">
                  Comparaison relative %
                </div>
                <div className="space-y-1 pt-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>{selectedStock.symbol} :</span>
                    <span className="font-bold text-indigo-400">{selectedStock.price.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{comparisonStock.symbol} :</span>
                    <span className="font-bold text-amber-400">{comparisonStock.price.toFixed(2)} $</span>
                  </div>
                  <div className="text-[8px] text-slate-500 font-sans block pt-1 border-t border-slate-800 leading-tight">
                    Survolez les courbes pour voir le détail pas à pas.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // Compute 1D real-time bounds and slice history
    const visibleCount = timeframe === "1J" ? get1DCurrentDayLimit(selectedStock.symbol, profile.marketMode || "real", cleanHistory.length) : cleanHistory.length;
    const visibleHistory = cleanHistory.slice(0, visibleCount);

    // Generate candlesticks data
    const candles = cleanHistory.map((val, idx) => {
      const openPrice = idx === 0 ? val * 0.995 : cleanHistory[idx - 1];
      const closePrice = val;
      const diff = Math.abs(closePrice - openPrice);
      const spread = val * 0.008; // Decreased spread for visual sharpness and precision
      const varFactor = Math.abs(Math.sin(idx)) * 0.5 + 0.2;
      const highPrice = Math.max(openPrice, closePrice) + (diff * 0.1) + (spread * varFactor);
      const lowPrice = Math.min(openPrice, closePrice) - (diff * 0.1) - (spread * varFactor);
      
      return { openPrice, closePrice, highPrice, lowPrice, val, idx };
    });
    const visibleCandles = candles.slice(0, visibleCount);

    // Compute min/max viewport limits based on active chart helper and only visible data points
    let min = 0;
    let max = 0;
    if (chartType === 'CANDLESTICK') {
      const lows = visibleCandles.map(c => c.lowPrice).filter(v => typeof v === 'number' && !isNaN(v));
      const highs = visibleCandles.map(c => c.highPrice).filter(v => typeof v === 'number' && !isNaN(v));
      min = lows.length > 0 ? Math.min(...lows) * 0.99 : selectedStock.price * 0.9;
      max = highs.length > 0 ? Math.max(...highs) * 1.01 : selectedStock.price * 1.1;
    } else {
      min = Math.min(...visibleHistory) * 0.985;
      max = Math.max(...visibleHistory) * 1.015;
    }

    if (isNaN(min) || !isFinite(min)) min = selectedStock.price * 0.9;
    if (isNaN(max) || !isFinite(max)) max = selectedStock.price * 1.1;
    let range = max - min;
    if (isNaN(range) || range <= 0) range = 1;

    // Align 5 horizontal grid price tags (0%, 25%, 50%, 75%, 100% height) for high numeric precision
    const gridLevels = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = gridLevels.map((ratio) => {
      const y = padTop + ratio * chartHeight;
      const value = max - ratio * range;
      return { y, value };
    });

    const historyLengthMinusOne = Math.max(1, cleanHistory.length - 1);
    const liveY = height - padBottom - ((selectedStock.price - min) / range) * chartHeight;

    return (
      <div className="relative">
        {/* Analytical header for extremes and drift metrics */}
        <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 bg-slate-55 bg-slate-50/70 border border-slate-200/30 px-3 py-1.5 rounded-xl mb-2.5">
          <div className="flex gap-4 sm:gap-6">
            <span>Plus Haut : <strong className="text-emerald-700">{max.toFixed(2)} $</strong></span>
            <span>Plus Bas : <strong className="text-rose-700">{min.toFixed(2)} $</strong></span>
            <span>Médiane : <strong className="text-slate-700">{((min + max) / 2).toFixed(2)} $</strong></span>
          </div>
          <div className="flex gap-2">
            <span>Écart total : <strong className="text-indigo-600">{(max - min).toFixed(2)} $</strong></span>
          </div>
        </div>

        <svg className="w-full h-52 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.18" />
              <stop offset="100%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines with precisely aligned price numbers on the right-hand axis only */}
          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={width - padRight}
                y2={gl.y}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={width - padRight + 6}
                y={gl.y + 3}
                fill="#64748b"
                fontSize="8.5"
                textAnchor="start"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {gl.value.toFixed(2)} $
              </text>
            </g>
          ))}

          {/* Live Horizontal Price Line tracking real-time fluctuations with a bright, dynamic axis badge */}
          {!isNaN(liveY) && liveY >= padTop && liveY <= height - padBottom && (
            <g>
              <line
                x1={padLeft}
                y1={liveY}
                x2={width - padRight}
                y2={liveY}
                stroke={isPositive ? "#059669" : "#dc2626"}
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.8"
              />
              <rect
                x={width - padRight}
                y={liveY - 7}
                width={padRight}
                height={14}
                rx={2.5}
                fill={isPositive ? "#10b981" : "#ef4444"}
              />
              <text
                x={width - padRight + 4}
                y={liveY + 3.5}
                fill="#ffffff"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {selectedStock.price.toFixed(2)}
              </text>
            </g>
          )}

          {chartType === 'LINE' ? (
            <>
              {/* AREA UNDER THE CURVE */}
              {(() => {
                const points = cleanHistory.map((val, idx) => {
                  const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
                  const y = height - padBottom - ((val - min) / range) * chartHeight;
                  return { x, y };
                });
                const visiblePoints = points.slice(0, visibleCount);
                const pathString = visiblePoints.map(p => `${p.x},${p.y}`).join(" L ");
                const areaString = visiblePoints.length > 0 
                  ? `${visiblePoints[0].x},${height - padBottom} L ${pathString} L ${visiblePoints[visiblePoints.length - 1].x},${height - padBottom} Z`
                  : "";
                return (
                  <>
                    {areaString && <path d={`M ${areaString}`} fill="url(#chartGlow)" />}
                    {pathString && (
                      <path
                        d={`M ${pathString}`}
                        fill="none"
                        stroke={isPositive ? "#059669" : "#e11d48"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </>
                );
              })()}

              {/* Slices trigger helpers to snap interactive crosshair */}
              {cleanHistory.slice(0, visibleCount).map((val, idx) => {
                const stepX = chartWidth / historyLengthMinusOne;
                const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
                return (
                  <rect
                    key={`main-slice-${idx}`}
                    x={x - stepX / 2}
                    y={padTop}
                    width={stepX}
                    height={chartHeight}
                    fill="transparent"
                    stroke="none"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPrice({ price: val, index: idx })}
                    onMouseLeave={() => setHoveredPrice(null)}
                  />
                );
              })}

              {/* Data Points (Only when hovered for a pristine premium feel) */}
              {cleanHistory.slice(0, visibleCount).map((val, idx) => {
                const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
                const y = height - padBottom - ((val - min) / range) * chartHeight;
                const isHovered = hoveredPrice?.index === idx;
                if (!isHovered) return null;
                return (
                  <circle
                     key={`pt-${idx}`}
                     cx={x}
                     cy={y}
                     r="5"
                     fill={isPositive ? "#059669" : "#e11d48"}
                     stroke="#ffffff"
                     strokeWidth="2.5"
                     className="pointer-events-none"
                  />
                );
              })}
            </>
          ) : (
            <>
              {/* CANDLESTICK PLOT */}
              {candles.slice(0, visibleCount).map((c) => {
                const x = padLeft + (c.idx / historyLengthMinusOne) * chartWidth;
                
                // Map prices to Y coordinates
                const openY = height - padBottom - ((c.openPrice - min) / range) * chartHeight;
                const closeY = height - padBottom - ((c.closePrice - min) / range) * chartHeight;
                const highY = height - padBottom - ((c.highPrice - min) / range) * chartHeight;
                const lowY = height - padBottom - ((c.lowPrice - min) / range) * chartHeight;

                const isBullish = c.closePrice >= c.openPrice;
                const strokeColor = isBullish ? "#059669" : "#e11d48";
                const fillColor = isBullish ? "#10b981" : "#f43f5e";

                const stepX = chartWidth / historyLengthMinusOne;
                const candleWidth = Math.max(2.5, stepX * 0.6);
                const isHovered = hoveredPrice?.index === c.idx;

                return (
                  <g 
                    key={c.idx}
                    className="cursor-pointer transition-all duration-100"
                    onMouseEnter={() => setHoveredPrice({ price: c.val, index: c.idx })}
                    onMouseLeave={() => setHoveredPrice(null)}
                  >
                    {/* Shadow / Wick line */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 2 : 1.2}
                    />

                    {/* Candle Body rect */}
                    <rect
                      x={x - candleWidth / 2}
                      y={Math.min(openY, closeY)}
                      width={candleWidth}
                      height={Math.max(1.5, Math.abs(closeY - openY))}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 1.2 : 0.6}
                      className="transition-all duration-100"
                    />

                    {/* Hover hotspot helper rect */}
                    <rect
                      x={x - stepX / 2}
                      y={padTop}
                      width={stepX}
                      height={chartHeight}
                      fill="transparent"
                      stroke="none"
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Bound borders for pristine terminal alignment */}
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          <line
            x1={width - padRight}
            y1={padTop}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />

          {/* Timeframe annotations */}
          <text x={padLeft} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="start">
            {chartLabels[0]}
          </text>
          <text x={(width - padRight) / 2} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="middle">
            {chartLabels[1]}
          </text>
          <text x={width - padRight} y={height - 6} fill="#94a3b8" fontSize="9" textAnchor="end">
            {chartLabels[2]}
          </text>
        </svg>

        {/* Live Info Tooltip */}
        <div className="absolute top-2 right-[65px] bg-slate-900 text-slate-100 text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg shadow-md font-mono flex flex-col min-w-[124px] max-w-[210px] z-10">
          {chartType === 'LINE' ? (
            <>
              <span>
                {hoveredPrice 
                  ? (timeframe === "1m" ? `Minute ${hoveredPrice.index + 1}` : timeframe === "1h" ? `Heure ${hoveredPrice.index + 1}` : timeframe === "1J" ? `Séc ${hoveredPrice.index + 1}` : `Jour ${hoveredPrice.index + 1}`) 
                  : "Historique du cours"}
              </span>
              <span className="font-bold text-sm text-amber-400">
                {hoveredPrice ? `${hoveredPrice.price.toFixed(2)} $` : `${selectedStock.price.toFixed(2)} $`}
              </span>
            </>
          ) : (
            <>
              {hoveredPrice ? (() => {
                const c = candles[hoveredPrice.index];
                if (!c) return null;
                return (
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-sans block font-bold text-[9px] uppercase border-b border-slate-800 pb-0.5 mb-1 text-center">
                      Bougie : {timeframe === "1m" ? `Minute ${c.idx + 1}` : timeframe === "1h" ? `Heure ${c.idx + 1}` : timeframe === "1J" ? `Séc ${c.idx + 1}` : `Jour ${c.idx + 1}`}
                    </span>
                    <div className="flex justify-between gap-3 text-slate-300">
                      <span className="text-emerald-400">O (Ouvre):</span>
                      <span className="font-bold">{c.openPrice.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-300 font-semibold mb-0.2">
                      <span className="text-amber-400">H (Hau.) :</span>
                      <span className="font-bold">{c.highPrice.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-300 font-semibold mb-0.2">
                      <span className="text-rose-400">L (Bas)  :</span>
                      <span className="font-bold">{c.lowPrice.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between gap-3 font-bold text-white border-t border-slate-800 pt-0.5">
                      <span>C (Clôt.):</span>
                      <span className={c.closePrice >= c.openPrice ? "text-emerald-400" : "text-rose-400"}>{c.closePrice.toFixed(2)} $</span>
                    </div>
                  </div>
                );
              })() : (
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-sans block text-[9px] uppercase border-b border-slate-800 pb-0.5 mb-1 text-center">
                    Suivi Temps Réel
                  </span>
                  <div className="flex justify-between gap-3 text-slate-300">
                    <span>Dernier :</span>
                    <span className="font-bold text-amber-400">{selectedStock.price.toFixed(2)} $</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-sans leading-tight mt-1">
                    Survolez une bougie pour voir ses détails OHLW.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render the zoomed detailed chart inside the overlay modal
  const renderZoomedDetailedChartOnModal = () => {
    const { prices: rawPrices, labels: rawLabels } = getTimeframeData(selectedStock, timeframe);
    const N = rawPrices.length;
    
    // Safety check
    if (N === 0) return null;

    // Calculate dimensions
    const width = 800;
    const height = 340;
    const padLeft = 14;
    const padRight = 65; // dedicated space for vertical prices
    const padTop = 20;
    const padBottom = 25;

    const chartWidth = width - padLeft - padRight;
    const chartHeight = height - padTop - padBottom;

    // Calculate visible window based on zoomLevel and panOffsetPercent
    const visibleCount = Math.max(5, Math.ceil(N / zoomLevel));
    const maxStartIndex = Math.max(0, N - visibleCount);
    // Pan offset is between 0 and 100
    const startIndex = Math.max(0, Math.min(maxStartIndex, Math.round((panOffsetPercent / 100) * maxStartIndex)));
    const endIndex = Math.min(N, startIndex + visibleCount);

    const prices = rawPrices.slice(startIndex, endIndex);
    const historyLengthMinusOne = Math.max(1, prices.length - 1);

    const currentDayLimit = timeframe === "1J" ? get1DCurrentDayLimit(selectedStock.symbol, profile.marketMode || "real", N) : N;
    const activeEndIndex = timeframe === "1J" ? Math.min(endIndex, currentDayLimit) : endIndex;
    const activePointsCount = timeframe === "1J" ? Math.max(0, activeEndIndex - startIndex) : prices.length;
    
    const visibleZoomPrices = prices.slice(0, activePointsCount);

    // Filter comparisons if active
    const comparisonStock = compareSymbol ? stocks.find(s => s.symbol === compareSymbol) : null;
    const comparisonHistory = comparisonStock ? getTimeframeData(comparisonStock, timeframe).prices : [];
    const cleanComparisonHistory = comparisonHistory.map(c => typeof c === 'number' && !isNaN(c) ? c : (comparisonStock ? comparisonStock.price : 1));
    const compPrices = comparisonStock ? cleanComparisonHistory.slice(startIndex, endIndex) : [];

    // Check if positive over the visible interval
    const isIntervalPositive = visibleZoomPrices.length > 0 
      ? visibleZoomPrices[visibleZoomPrices.length - 1] >= visibleZoomPrices[0]
      : true;

    // Compute SVG lines & gradients over this zoomed-in slice
    let min = 0;
    let max = 0;

    // Relative percentage performance if comparison is active
    if (comparisonStock && compPrices.length > 0) {
      const primInit = prices[0] || 1;
      const compInit = compPrices[0] || 1;

      const primPerfs = prices.map(h => ((h - primInit) / primInit) * 100);
      const compPerfs = compPrices.map(c => ((c - compInit) / compInit) * 100);

      const visiblePrimPerfs = primPerfs.slice(0, activePointsCount);
      const visibleCompPerfs = compPerfs.slice(0, activePointsCount);

      const minPerf = Math.min(...visiblePrimPerfs, ...visibleCompPerfs);
      const maxPerf = Math.max(...visiblePrimPerfs, ...visibleCompPerfs);

      let minPerfVal = minPerf;
      let maxPerfVal = maxPerf;
      if (isNaN(minPerfVal) || !isFinite(minPerfVal)) minPerfVal = -10;
      if (isNaN(maxPerfVal) || !isFinite(maxPerfVal)) maxPerfVal = 10;

      min = minPerfVal - Math.max(1.5, Math.abs(minPerfVal) * 0.15);
      max = maxPerfVal + Math.max(1.5, Math.abs(maxPerfVal) * 0.15);
      
      if (isNaN(min) || !isFinite(min)) min = -10;
      if (isNaN(max) || !isFinite(max)) max = 10;
      let range = max - min;
      if (isNaN(range) || range <= 0) range = 1;

      const primPoints = primPerfs.map((perf, idx) => {
        const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
        const y = height - padBottom - ((perf - min) / range) * chartHeight;
        return { x, y, perf, idx, rawPrice: prices[idx] };
      });

      const compPoints = compPerfs.map((perf, idx) => {
        const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
        const y = height - padBottom - ((perf - min) / range) * chartHeight;
        return { x, y, perf, idx, rawPrice: compPrices[idx] };
      });

      const visiblePrimPoints = primPoints.slice(0, activePointsCount);
      const visibleCompPoints = compPoints.slice(0, activePointsCount);

      const gridLevels = [0, 0.25, 0.5, 0.75, 1];
      const gridLines = gridLevels.map((ratio) => {
        const y = padTop + ratio * chartHeight;
        const value = max - ratio * range;
        return { y, value };
      });

      const primPathString = visiblePrimPoints.map(p => `${p.x},${p.y}`).join(" L ");
      const compPathString = visibleCompPoints.map(p => `${p.x},${p.y}`).join(" L ");
      const primAreaString = visiblePrimPoints.length > 0 ? `${visiblePrimPoints[0].x},${height - padBottom} L ${primPathString} L ${visiblePrimPoints[visiblePrimPoints.length - 1].x},${height - padBottom} Z` : "";
      const compAreaString = visibleCompPoints.length > 0 ? `${visibleCompPoints[0].x},${height - padBottom} L ${compPathString} L ${visibleCompPoints[visibleCompPoints.length - 1].x},${height - padBottom} Z` : "";

      const idxHovered = hoveredZoomPrice?.index ?? null;

      const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
      };

      const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) < 1) return;
        
        // Panning direction shifts range start and end point
        const idxShift = (dx / chartWidth) * 100 * zoomLevel;
        setPanOffsetPercent((prev) => {
          const nextVal = prev - idxShift * 0.15;
          return Math.max(0, Math.min(100, nextVal));
        });
        setDragStartX(e.clientX);
      };

      const handleWheelZoom = (e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        setZoomLevel((prev) => Math.max(1, Math.min(10, prev + direction * 0.5)));
      };

      return (
        <div className="relative select-none flex flex-col gap-2 w-full">
          {/* Zoom stats header */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-slate-905 bg-slate-900 text-slate-100 px-4 py-2 rounded-xl mb-1 shadow-sm">
            <div className="flex gap-4">
              <span>Haut (visible) : <span className="text-emerald-400 font-bold">+{maxPerfVal.toFixed(2)}%</span></span>
              <span>Bas (visible) : <span className="text-rose-400 font-bold">{minPerfVal.toFixed(2)}%</span></span>
              <span>Amplitude : <span className="text-slate-300 font-bold">{(maxPerfVal - minPerfVal).toFixed(2)}%</span></span>
            </div>
            <div className="flex gap-2">
              <span className="text-indigo-400 font-bold font-mono">{selectedStock.symbol} : {activePointsCount > 0 && primPerfs[activePointsCount - 1] >= 0 ? "+" : ""}{(activePointsCount > 0 ? primPerfs[activePointsCount - 1] : 0).toFixed(2)}%</span>
              <span className="text-amber-400 font-bold font-mono">{comparisonStock.symbol} : {activePointsCount > 0 && compPerfs[activePointsCount - 1] >= 0 ? "+" : ""}{(activePointsCount > 0 ? compPerfs[activePointsCount - 1] : 0).toFixed(2)}%</span>
            </div>
          </div>

          {/* SVG Canvas */}
          <svg 
            className="w-full h-72 sm:h-80 bg-slate-50 border border-slate-200 rounded-2xl overflow-visible cursor-grab active:cursor-grabbing shadow-xs" 
            viewBox={`0 0 ${width} ${height}`}
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => { setIsDragging(false); setHoveredZoomPrice(null); }}
            onWheel={handleWheelZoom}
          >
            <defs>
              <linearGradient id="zoomPrimGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="zoomCompGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={gl.y}
                  x2={width - padRight}
                  y2={gl.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - padRight + 7}
                  y={gl.y + 3}
                  fill="#475569"
                  fontSize="8.5"
                  textAnchor="start"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {gl.value >= 0 ? "+" : ""}{gl.value.toFixed(2)}%
                </text>
              </g>
            ))}

            <path d={`M ${primAreaString}`} fill="url(#zoomPrimGlow)" />
            <path d={`M ${compAreaString}`} fill="url(#zoomCompGlow)" />

            {/* Curves */}
            <path
              d={`M ${primPathString}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${compPathString}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Mouse over slice trigger helpers */}
            {visiblePrimPoints.map((p) => {
              const stepX = chartWidth / historyLengthMinusOne;
              return (
                <rect
                  key={`zoom-slice-${p.idx}`}
                  x={p.x - stepX / 2}
                  y={padTop}
                  width={stepX}
                  height={chartHeight}
                  fill="transparent"
                  stroke="none"
                  onMouseEnter={() => setHoveredZoomPrice({ price: p.rawPrice, index: p.idx })}
                />
              );
            })}

            {/* Timeline Vertical hover guide line */}
            {idxHovered !== null && visiblePrimPoints[idxHovered] && (
              <line
                x1={visiblePrimPoints[idxHovered].x}
                y1={padTop}
                x2={visiblePrimPoints[idxHovered].x}
                y2={height - padBottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}

            {/* Focused data points */}
            {idxHovered !== null && visiblePrimPoints[idxHovered] && visibleCompPoints[idxHovered] && (
              <>
                <circle
                  cx={visiblePrimPoints[idxHovered].x}
                  cy={visiblePrimPoints[idxHovered].y}
                  r="6"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx={visibleCompPoints[idxHovered].x}
                  cy={visibleCompPoints[idxHovered].y}
                  r="6"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Bounds */}
            <line
              x1={padLeft}
              y1={height - padBottom}
              x2={width - padRight}
              y2={height - padBottom}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <line
              x1={width - padRight}
              y1={padTop}
              x2={width - padRight}
              y2={height - padBottom}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Sub-window Timeline Labels bottom */}
            <text x={padLeft} y={height - 7} fill="#64748b" fontSize="9" textAnchor="start" fontWeight="bold">
              {rawLabels[0]}
            </text>
            <text x={(width - padRight) / 2} y={height - 7} fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="bold">
              Défilement : {(startIndex / N * 100).toFixed(0)}% à {(endIndex / N * 100).toFixed(0)}% de l'historique
            </text>
            <text x={width - padRight} y={height - 7} fill="#64748b" fontSize="9" textAnchor="end" fontWeight="bold">
              {rawLabels[2]}
            </text>
          </svg>

          {/* Interactive Hover Legend / Details HUD inside Modal */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between font-mono text-xs text-slate-700 min-h-[50px]">
            {idxHovered !== null && primPoints[idxHovered] && compPoints[idxHovered] ? (
              <div className="flex justify-between items-center w-full flex-wrap gap-2">
                <span className="font-bold text-slate-500 uppercase">Index sélectionné : #{startIndex + idxHovered + 1}</span>
                <div className="flex gap-4 sm:gap-6 flex-wrap">
                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4 sm:pr-5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="font-bold">{selectedStock.symbol} :</span>
                    <span className="font-semibold text-slate-900">{primPoints[idxHovered].rawPrice.toFixed(2)} $</span>
                    <span className={`text-[10px] font-bold ${primPoints[idxHovered].perf >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      ({primPoints[idxHovered].perf >= 0 ? "+" : ""}{primPoints[idxHovered].perf.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-bold">{comparisonStock.symbol} :</span>
                    <span className="font-semibold text-slate-900">{compPoints[idxHovered].rawPrice.toFixed(2)} $</span>
                    <span className={`text-[10px] font-bold ${compPoints[idxHovered].perf >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      ({compPoints[idxHovered].perf >= 0 ? "+" : ""}{compPoints[idxHovered].perf.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-slate-400 italic text-center w-full">
                Survolez la courbe pour analyser les points de comparaison historiques en direct. Glissez pour faire défiler le temps.
              </span>
            )}
          </div>
        </div>
      );
    }

    // SINGLE ASSET INTERACTIVE DETAILS
    // Generate simulated candlesticks for the subrange
    const candlesList = prices.map((val, idx) => {
      const parentIdx = startIndex + idx;
      const openPrice = parentIdx === 0 ? val * 0.995 : rawPrices[parentIdx - 1] || val * 0.995;
      const closePrice = val;
      const diff = Math.abs(closePrice - openPrice);
      const spread = val * 0.008;
      const varFactor = Math.abs(Math.sin(parentIdx)) * 0.5 + 0.2;
      const highPrice = Math.max(openPrice, closePrice) + (diff * 0.1) + (spread * varFactor);
      const lowPrice = Math.min(openPrice, closePrice) - (diff * 0.1) - (spread * varFactor);
      return { openPrice, closePrice, highPrice, lowPrice, val, idx };
    });

    const visibleCandlesList = candlesList.slice(0, activePointsCount);

    if (chartType === 'CANDLESTICK') {
      const lows = visibleCandlesList.map(c => c.lowPrice);
      const highs = visibleCandlesList.map(c => c.highPrice);
      min = Math.min(...lows) * 0.995;
      max = Math.max(...highs) * 1.005;
    } else {
      min = Math.min(...visibleZoomPrices) * 0.99;
      max = Math.max(...visibleZoomPrices) * 1.01;
    }

    if (isNaN(min) || !isFinite(min)) min = selectedStock.price * 0.9;
    if (isNaN(max) || !isFinite(max)) max = selectedStock.price * 1.1;
    let range = max - min;
    if (isNaN(range) || range <= 0) range = 1;

    const gridLevels = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = gridLevels.map((ratio) => {
      const y = padTop + ratio * chartHeight;
      const value = max - ratio * range;
      return { y, value };
    });

    const idxHovered = hoveredZoomPrice?.index ?? null;

    const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
      setIsDragging(true);
      setDragStartX(e.clientX);
    };

    const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) < 1) return;

      const idxShift = (dx / chartWidth) * 100 * zoomLevel;
      setPanOffsetPercent((prev) => {
        const nextVal = prev - idxShift * 0.15;
        return Math.max(0, Math.min(100, nextVal));
      });
      setDragStartX(e.clientX);
    };

    const handleWheelZoom = (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      setZoomLevel((prev) => Math.max(1, Math.min(10, prev + direction * 0.5)));
    };

    return (
      <div className="relative select-none flex flex-col gap-2 w-full">
        {/* Zoom stats header */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-slate-900 text-slate-100 px-4 py-2 rounded-xl mb-1 shadow-sm">
          <div className="flex gap-4">
            <span>Plus Haut (visible) : <span className="text-emerald-400 font-bold">{max.toFixed(2)} $</span></span>
            <span>Plus Bas (visible) : <span className="text-rose-400 font-bold">{min.toFixed(2)} $</span></span>
            <span>Écart visible : <span className="text-slate-300 font-bold">{(max - min).toFixed(2)} $</span></span>
          </div>
          <div className="flex gap-2">
            <span className={isIntervalPositive ? "text-emerald-405 text-emerald-400 font-bold font-mono" : "text-rose-400 font-bold font-mono"}>
              Tendance : {isIntervalPositive ? "HAUSSIÈRE ▲" : "BAISSIÈRE ▼"}
            </span>
          </div>
        </div>

        {/* SVG Canvas */}
        <svg 
          className="w-full h-72 sm:h-80 bg-slate-50 border border-slate-200 rounded-2xl overflow-visible cursor-grab active:cursor-grabbing shadow-xs" 
          viewBox={`0 0 ${width} ${height}`}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => { setIsDragging(false); setHoveredZoomPrice(null); }}
          onWheel={handleWheelZoom}
        >
          <defs>
            <linearGradient id="zoomChartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isIntervalPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.18" />
              <stop offset="100%" stopColor={isIntervalPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={width - padRight}
                y2={gl.y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={width - padRight + 7}
                y={gl.y + 3}
                fill="#475569"
                fontSize="8.5"
                textAnchor="start"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {gl.value.toFixed(2)} $
              </text>
            </g>
          ))}

          {chartType === 'LINE' ? (
            <>
              {(() => {
                const points = prices.map((val, idx) => {
                  const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
                  const y = height - padBottom - ((val - min) / range) * chartHeight;
                  return { x, y };
                });
                const visiblePoints = points.slice(0, activePointsCount);
                const pathString = visiblePoints.map(p => `${p.x},${p.y}`).join(" L ");
                const areaString = visiblePoints.length > 0 
                  ? `${visiblePoints[0].x},${height - padBottom} L ${pathString} L ${visiblePoints[visiblePoints.length - 1].x},${height - padBottom} Z`
                  : "";
                return (
                  <>
                    {areaString && <path d={`M ${areaString}`} fill="url(#zoomChartGlow)" />}
                    {pathString && (
                      <path
                        d={`M ${pathString}`}
                        fill="none"
                        stroke={isIntervalPositive ? "#059669" : "#e11d48"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </>
                );
              })()}

              {/* Individual circular points on hover (extremely clean line) */}
              {prices.slice(0, activePointsCount).map((val, idx) => {
                const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
                const y = height - padBottom - ((val - min) / range) * chartHeight;
                const isHovered = idxHovered === idx;
                if (!isHovered) return null;
                return (
                  <circle
                    key={`zoom-pt-${idx}`}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={isIntervalPositive ? "#059669" : "#e11d48"}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="pointer-events-none"
                  />
                );
              })}
            </>
          ) : (
            <>
              {visibleCandlesList.map((c) => {
                const x = padLeft + (c.idx / historyLengthMinusOne) * chartWidth;
                const openY = height - padBottom - ((c.openPrice - min) / range) * chartHeight;
                const closeY = height - padBottom - ((c.closePrice - min) / range) * chartHeight;
                const highY = height - padBottom - ((c.highPrice - min) / range) * chartHeight;
                const lowY = height - padBottom - ((c.lowPrice - min) / range) * chartHeight;

                const isBullish = c.closePrice >= c.openPrice;
                const strokeColor = isBullish ? "#059669" : "#e11d48";
                const fillColor = isBullish ? "#10b981" : "#f43f5e";

                const stepX = chartWidth / historyLengthMinusOne;
                const candleWidth = Math.max(3, stepX * 0.75); // wider candles on big plan view
                const isHovered = idxHovered === c.idx;

                return (
                  <g key={`zoom-cand-${c.idx}`}>
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                    />
                    <rect
                      x={x - candleWidth / 2}
                      y={Math.min(openY, closeY)}
                      width={candleWidth}
                      height={Math.max(2, Math.abs(closeY - openY))}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 1.5 : 0.8}
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Slices trigger helpers to snap interactive crosshair */}
          {prices.slice(0, activePointsCount).map((val, idx) => {
            const stepX = chartWidth / historyLengthMinusOne;
            const x = padLeft + (idx / historyLengthMinusOne) * chartWidth;
            return (
              <rect
                key={`zoom-trigger-${idx}`}
                x={x - stepX / 2}
                y={padTop}
                width={stepX}
                height={chartHeight}
                fill="transparent"
                stroke="none"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredZoomPrice({ price: val, index: idx })}
              />
            );
          })}

          {/* Snap crosshair */}
          {idxHovered !== null && idxHovered < activePointsCount && prices[idxHovered] !== undefined && (
            <line
              x1={padLeft + (idxHovered / historyLengthMinusOne) * chartWidth}
              y1={padTop}
              x2={padLeft + (idxHovered / historyLengthMinusOne) * chartWidth}
              y2={height - padBottom}
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          )}

          {/* Canvas boundaries */}
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1={width - padRight}
            y1={padTop}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Timeframe annotations */}
          <text x={padLeft} y={height - 7} fill="#64748b" fontSize="9" textAnchor="start" fontWeight="bold">
            {rawLabels[0]}
          </text>
          <text x={(width - padRight) / 2} y={height - 7} fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="bold">
            Intervalle : #{startIndex + 1} à #{endIndex} du parcours ({timeframe})
          </text>
          <text x={width - padRight} y={height - 7} fill="#64748b" fontSize="9" textAnchor="end" fontWeight="bold">
            {rawLabels[2]}
          </text>
        </svg>

        {/* Dynamic OHLV Tooltip HUD */}
        <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between font-mono text-xs text-slate-700 min-h-[50px]">
          {idxHovered !== null ? (
            chartType === 'LINE' ? (
              <div className="flex justify-between items-center w-full flex-wrap gap-2">
                <span className="font-bold text-slate-500 uppercase">Valeur à l'index n° {startIndex + idxHovered + 1}</span>
                <div className="flex gap-4 items-center">
                  <span className="font-bold">Cours :</span>
                  <span className="font-extrabold text-slate-900 text-sm">{prices[idxHovered].toFixed(2)} $</span>
                  {idxHovered > 0 ? (
                    (() => {
                      const prevPrice = prices[idxHovered - 1];
                      const change = ((prices[idxHovered] - prevPrice) / prevPrice) * 100;
                      return (
                        <span className={`font-bold ${change >= 0 ? "text-emerald-600" : "text-rose-550 text-rose-500"}`}>
                          ({change >= 0 ? "+" : ""}{change.toFixed(2)}% vs préc.)
                        </span>
                      );
                    })()
                  ) : null}
                </div>
              </div>
            ) : (
              (() => {
                const c = candlesList[idxHovered];
                if (!c) return null;
                const isBull = c.closePrice >= c.openPrice;
                return (
                  <div className="flex items-center justify-between w-full flex-wrap gap-2">
                    <span className="font-bold text-slate-500 uppercase">Bougie #{startIndex + idxHovered + 1} :</span>
                    <div className="flex flex-wrap gap-4 text-[11px] sm:text-xs">
                      <div><span className="text-slate-400 font-bold">O (Ouvr.) :</span> <strong className="text-slate-800">{c.openPrice.toFixed(2)} $</strong></div>
                      <div><span className="text-emerald-500 font-bold">H (Haut) :</span> <strong className="text-slate-800">{c.highPrice.toFixed(2)} $</strong></div>
                      <div><span className="text-rose-500 font-bold">L (Bas) :</span> <strong className="text-slate-800">{c.lowPrice.toFixed(2)} $</strong></div>
                      <div className="border-l border-slate-200 pl-3">
                        <span className="text-slate-600 font-bold">C (Clôt.) :</span> 
                        <strong className={`ml-1 text-sm ${isBull ? "text-emerald-600" : "text-rose-600"}`}>{c.closePrice.toFixed(2)} $</strong>
                      </div>
                    </div>
                  </div>
                );
              })()
            )
          ) : (
            <span className="text-slate-400 italic text-center w-full">
              Glissez la souris de gauche à droite sur l'encadré pour naviguer temporellement. Survolez chaque point pour une lecture OHLV de grande précision.
            </span>
          )}
        </div>
      </div>
    );
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeShares <= 0) return;
    if (tradeType === 'BUY' && (!isAffordable || isStopLossInvalid)) return;
    if (tradeType === 'SELL' && !hasSharesToSell) return;

    let finalStopLoss: number | null = null;
    if (tradeType === 'BUY' && useStopLoss) {
      const parsed = parseFloat(stopLossValue);
      if (!isNaN(parsed) && parsed > 0 && parsed < selectedStock.price) {
        finalStopLoss = parseFloat(parsed.toFixed(2));
      } else {
        return;
      }
    }

    onTrade(selectedStock.symbol, tradeType, tradeShares, selectedStock.price, finalStopLoss);
    setTradeShares(1);
    setUseStopLoss(false);
  };

  return (
    <div id="simulator-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List pane */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-4 lg:col-span-1">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-base px-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            {t("marketPrices")}
          </h3>
          <p className="text-slate-400 text-xs px-1 pb-1">
            {t("simulatedFluctuations")}
          </p>
        </div>

        {/* Search input bar */}
        <div className="relative px-1">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50/50 rounded-xl outline-hidden font-medium placeholder:text-slate-400 text-slate-800 transition"
            placeholder="Rechercher une action (ex: AAPL, TSLA...)"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-405 text-slate-400 hover:text-slate-600 hover:scale-110 text-xs transition cursor-pointer font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => {
              const isPos = stock.change >= 0;
              const isSelected = selectedSymbol === stock.symbol;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedSymbol(stock.symbol);
                    setTradeShares(1);
                    setSelectedNewsId(null);
                    if (compareSymbol === stock.symbol) {
                      setCompareSymbol(null);
                    }
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                    isSelected 
                      ? "bg-white border-slate-950 text-slate-950 ring-1 ring-slate-950 dark:bg-indigo-600 dark:border-indigo-650 dark:text-white dark:ring-0" 
                      : "bg-white hover:bg-slate-50/50 border-slate-200 text-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-250"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono text-sm text-slate-950 dark:text-white">{stock.symbol}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                        isPos 
                          ? isSelected ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300" : "bg-emerald-100 text-emerald-800"
                          : isSelected ? "bg-rose-500/20 text-rose-800 dark:text-rose-300" : "bg-rose-100 text-rose-800"
                      }`}>
                        {isPos ? "+" : ""}{stock.change.toFixed(2)}%
                      </span>
                    </div>
                    <p className={`text-[11px] truncate w-28 ${isSelected ? "text-slate-800 dark:text-slate-350" : "text-slate-500"}`}>
                      {stock.name}
                    </p>
                  </div>

                  {/* Micro sparkline */}
                  <div className="hidden sm:block">
                    {renderSparkline(stock.history, isPos)}
                  </div>

                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-sm font-mono text-slate-950 dark:text-white">
                      {stock.price.toFixed(2)} $
                    </p>
                    <p className={`text-[10px] font-sans ${isSelected ? "text-slate-700 dark:text-slate-450" : "text-slate-400"}`}>
                      {stock.volume}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
              <span className="text-lg block mb-1">🔍</span>
              <p className="text-xs font-bold text-slate-600 block">Aucune action trouvée</p>
              <p className="text-[10px] text-slate-400 mt-1">Essayez un autre symbole ou nom de l'entreprise.</p>
            </div>
          )}
        </div>

        {/* Section Actions Suivies (Watchlist) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 dark:text-slate-150 text-xs px-1 flex items-center gap-1.5 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              {lang === "fr" ? "Actions suivies" : "Market watchlist"}
            </h4>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] px-1 pb-1">
              {lang === "fr" ? "Vos favoris suivis en temps réel" : "Your favorites tracked in real-time"}
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
            {watchlist.length > 0 ? (
              stocks.filter(s => watchlist.includes(s.symbol)).map((stock) => {
                const isPos = stock.change >= 0;
                const isSelected = selectedSymbol === stock.symbol;

                return (
                  <div
                    key={`watch-${stock.symbol}`}
                    onClick={() => {
                      setSelectedSymbol(stock.symbol);
                      setTradeShares(1);
                      setSelectedNewsId(null);
                      if (compareSymbol === stock.symbol) {
                        setCompareSymbol(null);
                      }
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                      isSelected 
                        ? "bg-slate-50 border-slate-900 text-slate-900 ring-1 ring-slate-900 dark:bg-slate-900 dark:border-indigo-650 dark:text-white" 
                        : "bg-slate-50/40 hover:bg-slate-50 border-slate-150 text-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-250"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-xs text-slate-950 dark:text-white">{stock.symbol}</span>
                        <span className={`text-[9px] px-1 py-0.1 rounded font-bold ${
                          isPos 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" 
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                        }`}>
                          {isPos ? "+" : ""}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate w-24 dark:text-slate-400">
                        {stock.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-right space-y-0.5">
                        <p className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                          {stock.price.toFixed(2)} $
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="text-amber-500 hover:text-slate-300 dark:hover:text-slate-650 p-1 rounded-md transition hover:scale-110 cursor-pointer"
                        title={lang === "fr" ? "Ne plus suivre l'action" : "Unfollow stock"}
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/10 dark:border-slate-800/60 dark:bg-slate-950/10">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Aucun favori" : "Empty watchlist"}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                  {lang === "fr" ? "Cliquez sur l'étoile ★ d'une action pour la suivre ici." : "Click the ★ star on any action to list it here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main pane (Detailed graph + transaction desk) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-800 font-mono text-xs px-2.5 py-1 rounded font-bold">
                  {selectedStock.symbol}
                </span>
                <h2 className="text-xl font-extrabold text-slate-800">{selectedStock.name}</h2>
                <button
                  onClick={() => toggleWatchlist(selectedStock.symbol)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 group transition cursor-pointer flex items-center justify-center ml-1"
                  title={watchlist.includes(selectedStock.symbol) ? (lang === "fr" ? "Ne plus suivre l'action" : "Unfollow stock") : (lang === "fr" ? "Suivre cette action" : "Follow stock")}
                >
                  <Star 
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      watchlist.includes(selectedStock.symbol) 
                        ? "fill-amber-400 text-amber-405 text-amber-550" 
                        : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                    }`} 
                  />
                </button>
              </div>
              <p className="text-slate-400 text-xs">
                {selectedStock.description}
              </p>

              {/* Market Status and Hours */}
              <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
                <span className={`font-bold px-2 py-0.5 rounded-full border ${
                  profile.marketMode === "continuous"
                    ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                    : isStockMarketOpen
                      ? "bg-emerald-500/10 text-emerald-550 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }`}>
                  {profile.marketMode === "continuous"
                    ? `⚡ ${t("marketModeContinuous")}`
                    : isStockMarketOpen
                      ? `🟢 ${t("marketOpen")}`
                      : `🔴 ${t("marketClosed")}`
                  }
                </span>
                <span className="text-slate-400 font-bold font-sans">
                  {marketType === 'EU'
                    ? "Euronext Paris (Lun-Ven, 09:00 - 17:30 CET)"
                    : "NYSE/NASDAQ (Lun-Ven, 09:30 - 16:00 EST)"
                  }
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <TradingViewPriceWidget symbol={selectedStock.symbol} />
            </div>
          </div>

          {/* Historical detailed graph */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 pb-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Historique du Cours ({timeframe === '1J' ? 'Aujourd\'hui' : timeframe === '1S' ? 'Semaine' : timeframe === '1M' ? '30 jours' : timeframe === '3M' ? '3 Mois' : timeframe === '6M' ? '6 Mois' : timeframe === '1A' ? '1 An' : 'Tout le parcours'})
            </span>
            
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sélecteur de comparaison */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Comparer :</span>
                <select
                  value={compareSymbol || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCompareSymbol(val === "" ? null : val);
                    if (val !== "") {
                      setChartType('LINE');
                    }
                  }}
                  className="bg-transparent border-none text-xs font-bold font-sans text-slate-700 outline-hidden cursor-pointer focus:ring-0 max-w-[130px]"
                >
                  <option value="">-- Aucun --</option>
                  {stocks
                    .filter((s) => s.symbol !== selectedStock.symbol)
                    .map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} ({s.name})
                      </option>
                    ))}
                </select>
                {compareSymbol && (
                  <button
                    type="button"
                    onClick={() => setCompareSymbol(null)}
                    className="text-slate-400 hover:text-rose-500 transition font-bold text-xs"
                    title="Supprimer la comparaison"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Type de graphe */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs bg-white text-slate-950 shadow-xs">
                  <span className="text-xs">📊</span>
                  <span>Graphique TradingView</span>
                </div>
              </div>
            </div>
          </div>

          {/* SÉLECTEUR DE TIMEFRAME */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-1 border-b border-slate-50/50">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Période :</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                {[
                  { id: "1J", label: "1 jour" },
                  { id: "1S", label: "1 sem." },
                  { id: "1M", label: "30 j." },
                  { id: "3M", label: "3 mois" },
                  { id: "6M", label: "6 mois" },
                  { id: "1A", label: "1 an" },
                  { id: "Tout", label: "Tout" }
                ].map((tf) => {
                  const isActive = timeframe === tf.id;
                  return (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => {
                        setTimeframe(tf.id);
                        setHoveredPrice(null);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsZoomExpanded(true);
                setZoomLevel(2);
                setPanOffsetPercent(100);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-indigo-50 text-indigo-700 hover:bg-slate-900 hover:text-white transition-all duration-200 border border-indigo-100/60 shadow-xs cursor-pointer"
              title="Agrandir le graphique et zoomer interactivement"
            >
              <Maximize2 className="w-3.5 h-3.5 text-indigo-500 hover:text-white" />
              <span>Gros plan & Zoom 🔍</span>
            </button>
          </div>
          
          {chartType === 'TRADINGVIEW' ? (
            <div className="py-2">
              <TradingViewWidget symbol={selectedStock.symbol} />
            </div>
          ) : (
            (() => {
              const { prices, labels } = getTimeframeData(selectedStock, timeframe);
              return (
                <div className="py-4">
                  {renderDetailedChart(prices, selectedStock.change >= 0, labels)}
                </div>
              );
            })()
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold mb-0.5">Plus bas (24h)</span>
              <span className="text-slate-800 font-bold">{selectedStock.low24h.toFixed(2)} $</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold mb-0.5">Plus haut (24h)</span>
              <span className="text-slate-800 font-bold">{selectedStock.high24h.toFixed(2)} $</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold mb-0.5">Vol. d'échanges</span>
              <span className="text-slate-800 font-bold">{selectedStock.volume}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold mb-0.5">Cap. Boursière</span>
              <span className="text-slate-800 font-bold">{selectedStock.marketCap}</span>
            </div>
          </div>
        </div>

        {/* Actualités & Analyse de l'action */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                <Newspaper className="w-4.5 h-4.5 text-indigo-505 shadow-2xs text-indigo-500" />
                Actualités Temps Réel : {selectedStock.symbol}
              </h3>
              <p className="text-slate-400 text-[11px]">
                Décryptez l'impact pédagogique des nouvelles financières traduites en direct :
              </p>
            </div>
            
            <div className="flex gap-2">
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide self-start flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Yahoo Finance Live
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isNewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-slate-100 p-4 rounded-xl space-y-4 bg-slate-50/20 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-2 bg-slate-100 roundedIndex w-16" />
                    <div className="h-2 bg-slate-100 roundedIndex w-10" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded-md w-11/12" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-10/12" />
                  </div>
                  <div className="pt-2 border-t border-slate-100/30 flex justify-between items-center">
                    <div className="h-2.5 bg-slate-150 rounded-sm w-16" />
                    <div className="h-2.5 bg-slate-150 rounded-sm w-12" />
                  </div>
                </div>
              ))
            ) : (
              displayNews.map((item) => {
                const isSelected = selectedNewsId === item.id;
                const sentimentStyles = {
                  positive: { bg: "bg-emerald-50 text-emerald-750 border-emerald-100", dot: "bg-emerald-500", text: "Haussier (Positif)" },
                  negative: { bg: "bg-rose-50 text-rose-750 border-rose-100", dot: "bg-rose-500", text: "Baissier (Négatif)" },
                  neutral: { bg: "bg-slate-50 text-slate-750 border-slate-100", dot: "bg-slate-400", text: "Neutre" },
                }[item.sentiment] || { bg: "bg-slate-50 text-slate-755 border-slate-100", dot: "bg-slate-400", text: "Neutre" };

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNewsId(isSelected ? null : item.id)}
                    className={`border p-4 rounded-xl cursor-pointer transition duration-300 flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/25 shadow-xs"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-white"
                    }`}
                  >
                    <div className="space-y-1.55">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{item.source}</span>
                        <span className="shrink-0">{item.timestamp}</span>
                      </div>

                      <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100/50 flex items-center justify-between text-[10px]">
                      <span className="font-bold flex items-center gap-1 text-slate-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${sentimentStyles.dot}`} />
                        {sentimentStyles.text}
                      </span>
                      <span className="text-indigo-600 font-extrabold hover:underline select-none">
                        {isSelected ? "Masquer ↑" : "Décrypter →"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Expanded decipher panel if news is clicked */}
          {selectedNewsId && (() => {
            const activeNews = displayNews.find(n => n.id === selectedNewsId);
            if (!activeNews) return null;

            const explanation = {
              positive: "Ce type de nouvelle positive attire généralement les acheteurs. La loi de l'offre et de la demande veut que lorsque le nombre d'acheteurs augmente fortement face à une offre inchangée, la concurrence pousse le cours de l'action à la hausse.",
              negative: "Les nouvelles négatives inquiètent les investisseurs qui cherchent à limiter leurs pertes en vendant leurs parts. L'afflux de vendeurs face à des acheteurs réticents engendre mécaniquement une baisse du cours de l'action.",
              neutral: "Une nouvelle neutre apporte de l'information importante sur l'état d'activité mais sans bouleverser la valorisation immédiate. Elle se traduit souvent par une stabilisation latérale des volumes ou confirme simplement les prévisions existantes.",
            }[activeNews.sentiment] || "Analyse équilibrée nécessaire : cet événement nécessite de surveiller les prochains résultats d'exploitation trimestriels.";

            return (
              <div className="space-y-4 mt-2">
                {/* Full Article Content Card */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{activeNews.source} • Article Complet</span>
                    <span>{activeNews.timestamp}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{activeNews.title}</h3>
                  <div className="text-slate-700 text-[11px] sm:text-xs leading-relaxed space-y-2 font-sans whitespace-pre-line">
                    {activeNews.fullText || activeNews.summary}
                  </div>
                  {(() => {
                    const articleLink = activeNews.link || `https://news.google.com/search?q=${encodeURIComponent(activeNews.title + " " + activeNews.source)}`;
                    return (
                      <div className="pt-2 border-t border-slate-150/50 mt-2">
                        <a
                          href={articleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-extrabold text-[11px] text-indigo-600 hover:text-indigo-850 transition underline underline-offset-2 hover:no-underline"
                        >
                          Consulter l'article d'origine sur {activeNews.source} →
                        </a>
                      </div>
                    );
                  })()}
                </div>

                {/* Educational Deciphering Explanation Card */}
                <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <strong className="text-indigo-950 font-sans uppercase tracking-wider text-[10px]">
                      💡 Décryptage de Finance Bridge : Comment analyser cet événement ?
                    </strong>
                  </div>
                  <div className="text-slate-700 leading-relaxed space-y-2 font-sans">
                    <p>
                      L'article <em className="font-semibold text-slate-800">« {activeNews.title} »</em> publié par <strong className="text-indigo-900">{activeNews.source}</strong> présage un sentiment <strong className={`font-black ${activeNews.sentiment === 'positive' ? 'text-emerald-700' : activeNews.sentiment === 'negative' ? 'text-rose-700' : 'text-slate-700'}`}>{activeNews.sentiment === 'positive' ? 'HAUSSIER' : activeNews.sentiment === 'negative' ? 'BAISSIER' : 'NEUTRE'}</strong>.
                    </p>
                    <p className="bg-white p-3.5 rounded-lg border border-indigo-50/50 leading-relaxed text-slate-600 shadow-2xs font-sans">
                      {explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Transaction Desk Form & Position summary */}
        {(() => {
          const basePrice = selectedStock.price;
          const spreadPercent = 0.0006; // 0.06%
          const spreadVal = basePrice * spreadPercent;
          const bestBid = parseFloat((basePrice - spreadVal / 2).toFixed(2));
          const bestAsk = parseFloat((basePrice + spreadVal / 2).toFixed(2));
          const tickSize = parseFloat((basePrice * 0.0002).toFixed(2)) || 0.01;

          const askLevels = [
            { price: bestAsk + tickSize * 3, qty: 1250, desc: "Niveau de vente 4" },
            { price: bestAsk + tickSize * 2, qty: 1980, desc: "Niveau de vente 3" },
            { price: bestAsk + tickSize * 1, qty: 840,  desc: "Niveau de vente 2" },
            { price: bestAsk,                qty: 620,  desc: "Meilleure offre (Best Ask)" },
          ].map((lvl, index) => ({
            ...lvl,
            price: parseFloat(lvl.price.toFixed(2)),
            qty: Math.max(10, lvl.qty + Math.floor(Math.sin((basePrice * 10) + index) * 150))
          }));

          const bidLevels = [
            { price: bestBid,                qty: 950,  desc: "Meilleure demande (Best Bid)" },
            { price: bestBid - tickSize * 1, qty: 1540, desc: "Niveau d'achat 2" },
            { price: bestBid - tickSize * 2, qty: 710,  desc: "Niveau d'achat 3" },
            { price: bestBid - tickSize * 3, qty: 2200, desc: "Niveau d'achat 4" },
          ].map((lvl, index) => ({
            ...lvl,
            price: parseFloat(lvl.price.toFixed(2)),
            qty: Math.max(10, lvl.qty + Math.floor(Math.cos((basePrice * 10) + index) * 180))
          }));

          const maxQty = Math.max(...askLevels.map(l => l.qty), ...bidLevels.map(l => l.qty));
          const spreadAmount = parseFloat((bestAsk - bestBid).toFixed(2));
          const spreadPct = parseFloat(((spreadAmount / basePrice) * 100).toFixed(3));

          return (
            <div id="transaction-desk-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
              {/* Order Desk */}
              <div className="bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-slate-800 dark:text-white text-base mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-4.5 h-4.5 text-emerald-600" />
                  {t("orderDesk")}
                </h4>
                <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                      tradeType === 'BUY'
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-slate-50 text-slate-500 dark:bg-slate-850 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {t("buy")} ({selectedStock.symbol})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                      tradeType === 'SELL'
                        ? "bg-rose-500 text-white shadow-xs"
                        : "bg-slate-50 text-slate-500 dark:bg-slate-850 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {t("sell")} ({selectedStock.symbol})
                  </button>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <label htmlFor="shares-input" className="font-semibold">{t("sharesCount")}</label>
                      <span>{t("cashBalance")} : <strong className="text-slate-800 dark:text-slate-200">{profile.cash.toLocaleString(lang === 'zh' ? 'zh-CN' : 'fr-FR', { maximumFractionDigits: 2 })} $</strong></span>
                    </div>
                    <input
                      id="shares-input"
                      type="number"
                      min="1"
                      step="1"
                      value={tradeShares}
                      onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white outline-hidden focus:border-indigo-500 bg-slate-50/50 p-2.5 rounded-xl text-sm font-bold font-mono"
                    />
                  </div>

                  {tradeType === 'BUY' && (
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-805 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="stop-loss-toggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                          <input
                            id="stop-loss-toggle"
                            type="checkbox"
                            checked={useStopLoss}
                            onChange={(e) => setUseStopLoss(e.target.checked)}
                            className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 w-4 h-4 cursor-pointer"
                          />
                          Activer un Stop-Loss protecteur
                        </label>
                      </div>

                      {useStopLoss && (
                        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                          {/* Presets choice */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-500 block">Choisissez la perte maximale tolérée :</span>
                            <div className="grid grid-cols-5 gap-1">
                              {(['5', '10', '15', '20'] as const).map((pct) => (
                                <button
                                  key={pct}
                                  type="button"
                                  onClick={() => setStopLossPreset(pct)}
                                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer border ${
                                    stopLossPreset === pct
                                      ? "bg-slate-900 border-slate-950 text-white dark:bg-indigo-600 dark:border-indigo-600"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/40"
                                  }`}
                                >
                                  -{pct}%
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  setStopLossPreset('custom');
                                  // Pre-fill slider percentage to current drop if visible
                                  const val = parseFloat(stopLossValue);
                                  if (!isNaN(val) && val > 0 && selectedStock.price > 0 && val < selectedStock.price) {
                                    const calculated = ((selectedStock.price - val) / selectedStock.price) * 100;
                                    setCustomPct(Math.max(1, Math.min(90, parseFloat(calculated.toFixed(1)))));
                                  }
                                }}
                                className={`py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                                  stopLossPreset === 'custom'
                                    ? "bg-indigo-600 border-indigo-700 text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                                }`}
                              >
                                Perso
                              </button>
                            </div>
                          </div>

                          {/* Manual / Range sliders */}
                          <div className="space-y-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-semibold text-slate-500">
                                {stopLossPreset === 'custom' ? "💥 Seuil personnalisé" : "🛡️ Seuil sélectionné"}
                              </span>
                              {(() => {
                                const val = parseFloat(stopLossValue);
                                if (!isNaN(val) && val > 0 && selectedStock.price > 0) {
                                  const pct = ((selectedStock.price - val) / selectedStock.price) * 100;
                                  return (
                                    <span className="text-rose-600 font-extrabold font-mono text-[11px]">
                                      Baisse de -{pct.toFixed(pct % 1 === 0 ? 0 : 1)}%
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                            {/* Custom Percentage Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                <span>Ajuster % de baisse</span>
                                <span className="font-mono font-bold text-slate-600 dark:text-slate-350">-{stopLossPreset === 'custom' ? customPct.toFixed(1) : stopLossPreset}%</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="75"
                                step="0.5"
                                value={stopLossPreset === 'custom' ? customPct : parseInt(stopLossPreset)}
                                onChange={(e) => {
                                  const sliderVal = parseFloat(e.target.value);
                                  setStopLossPreset('custom');
                                  setCustomPct(sliderVal);
                                }}
                                className="w-full h-1.5 bg-slate-105 dark:bg-slate-800 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden"
                              />
                            </div>

                            {/* Custom Price Output & Precise input */}
                            <div className="space-y-1">
                              <label htmlFor="stop-loss-input" className="text-[10px] text-slate-400 block font-medium">
                                Ou saisissez le prix exact ($) :
                              </label>
                              <div className="relative">
                                <input
                                  id="stop-loss-input"
                                  type="number"
                                  min="0.01"
                                  max={(selectedStock.price - 0.01).toFixed(2)}
                                  step="0.01"
                                  value={stopLossValue}
                                  onChange={(e) => handleStopLossInputChange(e.target.value)}
                                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50/40 p-2 rounded-xl text-xs font-mono font-extrabold outline-hidden focus:border-indigo-500 focus:bg-white dark:bg-slate-950"
                                  placeholder={`${(selectedStock.price * 0.90).toFixed(2)}`}
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono font-bold">USD</span>
                              </div>
                            </div>

                            {isStopLossInvalid && (() => {
                              const val = parseFloat(stopLossValue);
                              if (!isNaN(val) && val >= selectedStock.price) {
                                return (
                                  <div className="text-[10px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg leading-normal border border-rose-100 pl-2.5">
                                    ⚠️ Le prix de Stop-Loss doit être strictement inférieur au cours d'achat de l'action ({selectedStock.price.toFixed(2)} $).
                                  </div>
                                );
                              }
                              if (!isNaN(val) && val <= 0) {
                                return (
                                  <div className="text-[10px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg leading-normal border border-rose-100 pl-2.5">
                                    ⚠️ Le seuil doit être supérieur à zéro.
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>

                          <p className="text-[10px] text-slate-400 leading-normal">
                            Si le cours descend sous votre seuil protecteur choisi de <strong>{stopLossValue} $</strong>, les actions de <strong>{selectedStock.symbol}</strong> seront vendues instantanément pour sécuriser votre investissement.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Prix unitaire :</span>
                      <span className="font-bold text-slate-705 dark:text-slate-200 font-mono">{selectedStock.price.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimation totale :</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono">{estimatedCost.toFixed(2)} $</span>
                    </div>
                    {tradeType === 'BUY' && (
                      <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">Restant post-achat :</span>
                        <span className={`font-mono font-bold ${isAffordable ? "text-emerald-600" : "text-rose-500"}`}>
                          {(profile.cash - estimatedCost).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status prompt details */}
                  {tradeType === 'BUY' && !isAffordable && (
                    <div className="bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 p-2.5 rounded-lg text-[11px] font-semibold">
                      Solde insuffisant pour couvrir cette transaction boursière.
                    </div>
                  )}
                  {tradeType === 'SELL' && !hasSharesToSell && (
                    <div className="bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 p-2.5 rounded-lg text-[11px] font-semibold">
                      Vous ne possédez pas autant d'actions {selectedStock.symbol} (Possédé : {position?.shares || 0}).
                    </div>
                  )}

                  {profile.marketMode !== "continuous" && !isStockMarketOpen && (
                    <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 p-3 rounded-xl text-[11px] font-semibold leading-relaxed">
                      ⚠️ Le marché sous-jacent est actuellement fermé (cours gelé). Pour vous entraîner hors session, votre ordre virtuel est exécuté immédiatement au dernier cours connu.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={tradeType === 'BUY' ? (!isAffordable || isStopLossInvalid) : !hasSharesToSell}
                    className={`w-full py-3 rounded-xl font-bold text-sm text-white cursor-pointer transition shadow-xs ${
                      tradeType === 'BUY'
                        ? "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                        : "bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
                    }`}
                  >
                    Valider l'Ordre Fictif
                  </button>
                </form>
              </div>

              {/* Live Order Book with Guided Learning */}
              <div className="bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
                      <Layers className="w-4.5 h-4.5 text-indigo-500" />
                      Carnet d'ordres
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedLearningActive(!guidedLearningActive);
                        setActiveTooltip(null);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase font-mono font-bold transition-all border shrink-0 cursor-pointer ${
                        guidedLearningActive
                          ? "bg-indigo-50 border-indigo-150 text-indigo-700 dark:bg-indigo-950/45 dark:border-indigo-900/40 dark:text-indigo-300 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      id="guided-learning-toggle-btn"
                      title="Activer/Désactiver le mode d'apprentissage"
                    >
                      <GraduationCap className={`w-3.5 h-3.5 ${guidedLearningActive ? "animate-pulse" : ""}`} />
                      <span>{guidedLearningActive ? "Apprendre : Oui" : "Apprendre 🎓"}</span>
                    </button>
                  </div>

                  {/* Order Book Table Column Headers */}
                  <div className="grid grid-cols-4 text-[10px] text-slate-400 font-bold uppercase pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="col-span-2">Prix ($)</span>
                    <span className="text-right">Taille (Actions)</span>
                    <span className="text-right relative flex items-center justify-end gap-1">
                      Prof.
                      {guidedLearningActive && (
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === "depth" ? null : "depth")}
                          className="w-3.5 h-3.5 bg-yellow-405 bg-yellow-400 text-yellow-950 rounded-full flex items-center justify-center font-black animate-bounce shrink-0 cursor-pointer text-[9px] hover:bg-yellow-300"
                          title="Explication : Profondeur"
                        >
                          ?
                        </button>
                      )}
                    </span>
                  </div>

                  {/* Ask levels (Sell orders above current price) */}
                  <div className="relative mt-2">
                    {guidedLearningActive && (
                      <div className="absolute -left-1 -top-1 z-10">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === "asks" ? null : "asks")}
                          className="w-4 h-4 bg-rose-500 text-white font-bold rounded-full flex items-center justify-center shadow-md animate-bounce text-[10px] cursor-pointer hover:bg-rose-600"
                          title="Explication : Carnet Vendeur"
                        >
                          ?
                        </button>
                      </div>
                    )}
                    <div className={`space-y-0.5 ${guidedLearningActive && activeTooltip === 'asks' ? 'ring-2 ring-rose-500 rounded-lg p-0.5 bg-rose-500/5' : ''}`}>
                      {askLevels.map((lvl, index) => {
                        const barWidth = `${(lvl.qty / maxQty) * 100}%`;
                        return (
                          <div
                            key={`ask-${index}`}
                            onClick={() => {
                              if (guidedLearningActive) {
                                setActiveTooltip("asks");
                              }
                            }}
                            className="grid grid-cols-4 text-xs font-mono py-1 relative items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded transition cursor-pointer"
                          >
                            {/* Cumulated Depth bar behind rows */}
                            <div
                              className="absolute right-0 top-0 bottom-0 bg-rose-500/8 dark:bg-rose-500/12 pointer-events-none rounded transition-all duration-300"
                              style={{ width: barWidth }}
                            />
                            <span className="col-span-2 text-rose-600 dark:text-rose-450 font-bold px-1.5">
                              {lvl.price.toFixed(2)}
                            </span>
                            <span className="text-right text-slate-600 dark:text-slate-300 font-bold pr-1">
                              {lvl.qty}
                            </span>
                            <span className="text-right text-[10px] text-slate-400 font-sans pr-1.5 font-semibold">
                              {Math.round((lvl.qty / maxQty) * 100)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mid-market / Spread Line */}
                  <div className="relative py-2 my-2 border-y border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex justify-between items-center px-1.5">
                    {guidedLearningActive && (
                      <div className="absolute -left-1 top-2 z-10">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === "spread" ? null : "spread")}
                          className="w-4 h-4 bg-indigo-500 text-white font-bold rounded-full flex items-center justify-center shadow-md animate-bounce text-[10px] cursor-pointer hover:bg-indigo-650"
                          title="Explication : Le Spread"
                        >
                          ?
                        </button>
                      </div>
                    )}
                    <div 
                      onClick={() => {
                        if (guidedLearningActive) {
                          setActiveTooltip("spread");
                        }
                      }}
                      className={`flex flex-1 justify-between items-center cursor-pointer p-0.5 ${guidedLearningActive && activeTooltip === 'spread' ? 'ring-2 ring-indigo-500 rounded bg-indigo-50/10' : ''}`}
                    >
                      <div className="flex items-center gap-1.5 pl-2">
                        <span className="text-slate-800 dark:text-slate-100 font-sans font-black text-[13px] animate-pulse">
                          {basePrice.toFixed(2)} $
                        </span>
                      </div>
                      <div className="text-right flex flex-col pr-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none">
                          SPREAD: {spreadAmount.toFixed(2)} $
                        </span>
                        <span className="text-[9px] font-bold text-indigo-550 dark:text-indigo-400 leading-normal">
                          ({spreadPct.toFixed(3)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bid levels (Buy orders below current price) */}
                  <div className="relative">
                    {guidedLearningActive && (
                      <div className="absolute -left-1 -top-1 z-10">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === "bids" ? null : "bids")}
                          className="w-4 h-4 bg-emerald-500 text-white font-bold rounded-full flex items-center justify-center shadow-md animate-bounce text-[10px] cursor-pointer hover:bg-emerald-600"
                          title="Explication : Carnet Acheteur"
                        >
                          ?
                        </button>
                      </div>
                    )}
                    <div className={`space-y-0.5 ${guidedLearningActive && activeTooltip === 'bids' ? 'ring-2 ring-emerald-500 rounded-lg p-0.5 bg-emerald-500/5' : ''}`}>
                      {bidLevels.map((lvl, index) => {
                        const barWidth = `${(lvl.qty / maxQty) * 100}%`;
                        return (
                          <div
                            key={`bid-${index}`}
                            onClick={() => {
                              if (guidedLearningActive) {
                                setActiveTooltip("bids");
                              }
                            }}
                            className="grid grid-cols-4 text-xs font-mono py-1 relative items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded transition cursor-pointer"
                          >
                            {/* Cumulated Depth bar behind rows */}
                            <div
                              className="absolute right-0 top-0 bottom-0 bg-emerald-500/8 dark:bg-emerald-500/12 pointer-events-none rounded transition-all duration-300"
                              style={{ width: barWidth }}
                            />
                            <span className="col-span-2 text-emerald-600 dark:text-emerald-450 font-bold px-1.5">
                              {lvl.price.toFixed(2)}
                            </span>
                            <span className="text-right text-slate-600 dark:text-slate-300 font-bold pr-1">
                              {lvl.qty}
                            </span>
                            <span className="text-right text-[10px] text-slate-400 font-sans pr-1.5 font-semibold">
                              {Math.round((lvl.qty / maxQty) * 100)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Guided Learning Contextual Message Panel */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <AnimatePresence mode="wait">
                    {guidedLearningActive ? (
                      <motion.div
                        key={activeTooltip || "default-learning"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="p-3 bg-indigo-50/60 dark:bg-slate-800/40 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl"
                      >
                        {(() => {
                          if (activeTooltip === "asks") {
                            return (
                              <div className="space-y-1.5">
                                <strong className="text-xs text-rose-750 dark:text-rose-400 block font-bold leading-tight">
                                  🔴 Carnet Vendeur : Les Offres (Asks)
                                </strong>
                                <p className="text-[10.5px] text-slate-605 text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                                  Les <strong>Asks</strong> répertorient toutes les offres de vente en attente, classées par prix croissant. Le prix le plus bas est la **Meilleure Offre** (*Best Ask*).
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                  C’est la liste d’attente des investisseurs qui disent : « Je ne contracterai pas de vente à moins de ce prix ». Si vous achetez au marché, vous les payez à ce prix.
                                </p>
                              </div>
                            );
                          }
                          if (activeTooltip === "bids") {
                            return (
                              <div className="space-y-1.5">
                                <strong className="text-xs text-emerald-750 dark:text-emerald-400 block font-bold leading-tight">
                                  🟢 Carnet Acheteur : Les Demandes (Bids)
                                </strong>
                                <p className="text-[10.5px] text-slate-605 text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                                  Les <strong>Bids</strong> répertorient toutes les propositions d’achat en attente, classées par prix décroissant. Le prix le plus haut est la **Meilleure Demande** (*Best Bid*).
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                  Ce sont des investisseurs qui patientent à des prix d’exécutions inférieurs pour négocier un rabais boursier. Si vous vendez au marché, vous vendez chez eux.
                                </p>
                              </div>
                            );
                          }
                          if (activeTooltip === "spread") {
                            return (
                              <div className="space-y-1.5">
                                <strong className="text-xs text-indigo-750 dark:text-indigo-400 block font-bold leading-tight">
                                  ⚖️ Le Spread : Fourchette de Cours
                                </strong>
                                <p className="text-[10.5px] text-slate-605 text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                                  C’est la différence numérique exacte entre l’offre de vente la plus basse (Best Ask) et l’offre d’achat la plus haute (Best Bid).
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                  Un **spread de {spreadAmount.toFixed(2)} $** indique un écart très serré, typique d’une excellente liquidité de l’action. Le cours ({basePrice.toFixed(2)} $) fluctue à l’intérieur.
                                </p>
                              </div>
                            );
                          }
                          if (activeTooltip === "depth") {
                            return (
                              <div className="space-y-1.5">
                                <strong className="text-xs text-amber-705 dark:text-amber-400 block font-bold leading-tight">
                                  📊 Profondeur de Marché / Volume
                                </strong>
                                <p className="text-[10.5px] text-slate-605 text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                                  Les barres colorées horizontales en background représentent la quantité cumulée d’actions (le volume) présente à ce palier.
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                  Une barre très longue signale un **mur d’ordres** (support ou résistance fort). Il faudra un très gros volume d’échanges pour repousser ce palier de prix !
                                </p>
                              </div>
                            );
                          }
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <strong className="text-xs text-indigo-950 dark:text-indigo-400 block font-bold leading-tight">
                                  🎓 Mode Apprentissage Activé !
                                </strong>
                              </div>
                              <p className="text-[10.5px] text-slate-605 text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                Touchez les badges jaunes <span className="bg-yellow-400 dark:bg-yellow-550 text-slate-900 font-extrabold px-1.5 py-0.2 rounded text-[10px]">?</span> pour explorer en direct comment s’organise la liquidité secrète de l’action <strong>{selectedStock.symbol}</strong> !
                              </p>
                            </div>
                          );
                        })()}
                      </motion.div>
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800/25 p-3 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 animate-bounce" />
                          <span className="text-[10px] sm:text-[11px] leading-snug">Touchez « Apprendre 🎓 » pour des explications contextuelles de ce carnet.</span>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Current Position Summary */}
              <div className="bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mb-3.5 flex items-center gap-1.5">
                    <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
                    Votre Position Fictive
                  </h4>

                  {position ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl animate-fade-in">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-0.5">Actions Détenues</span>
                          <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">{position.shares}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl animate-fade-in">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-0.5">C.U.M.P (*)</span>
                          <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">{position.avgBuyPrice.toFixed(2)} $</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-805 pt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Valeur actuelle :</span>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">{(position.shares * selectedStock.price).toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total investi s.a :</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{(position.shares * position.avgBuyPrice).toFixed(2)} $</span>
                        </div>
                        {/* Performance calculating */}
                        {(() => {
                          const netProfit = (selectedStock.price - position.avgBuyPrice) * position.shares;
                          const netProfitPercent = ((selectedStock.price - position.avgBuyPrice) / position.avgBuyPrice) * 100;
                          const isProfit = netProfit >= 0;

                          return (
                            <div className="flex justify-between pt-1.5 border-t border-slate-100 dark:border-slate-805">
                              <span className="font-bold text-slate-600 dark:text-slate-350">Plus-value générée :</span>
                              <span className={`font-mono font-extrabold ${isProfit ? "text-emerald-600 animate-pulse" : "text-rose-500"}`}>
                                {isProfit ? "+" : ""}{netProfit.toFixed(2)} $ ({isProfit ? "+" : ""}{netProfitPercent.toFixed(2)}%)
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Stop Loss Management inside the holding position box */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-805 flex flex-col gap-2 mt-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 dark:text-slate-350 flex items-center gap-1 font-semibold">
                            🛡️ Stop-Loss Actif
                          </span>
                          {position.stopLoss ? (
                            <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[10px]">
                              {position.stopLoss.toFixed(2)} $
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Aucun</span>
                          )}
                        </div>

                        {editStopLossActive ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="relative flex-1">
                              <input
                                type="number"
                                step="0.01"
                                value={editStopLossValue}
                                onChange={(e) => setEditStopLossValue(e.target.value)}
                                className="w-full text-xs font-mono font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded outline-hidden focus:border-indigo-500 text-slate-900 dark:text-white"
                                placeholder="Prix protectif ($)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const val = parseFloat(editStopLossValue);
                                if (!isNaN(val) && val > 0) {
                                  onUpdateStopLoss(selectedStock.symbol, parseFloat(val.toFixed(2)));
                                } else {
                                  onUpdateStopLoss(selectedStock.symbol, null);
                                }
                                setEditStopLossActive(false);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-2 py-1 rounded font-bold cursor-pointer transition whitespace-nowrap"
                            >
                              Sauver
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditStopLossActive(false)}
                              className="text-[10px] text-slate-405 dark:text-slate-400 hover:text-slate-600 px-1 hover:underline cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mt-0.5">
                            {position.stopLoss ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStopLoss(selectedStock.symbol, null);
                                }}
                                className="text-[10px] text-slate-400 hover:text-rose-550 dark:hover:text-rose-400 hover:underline cursor-pointer transition font-semibold"
                              >
                                Désactiver le seuil
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 leading-normal">Configurez un Stop-Loss protecteur.</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditStopLossValue(position.stopLoss ? position.stopLoss.toString() : (selectedStock.price * 0.9).toFixed(2));
                                setEditStopLossActive(true);
                              }}
                              className="text-[10px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-extrabold hover:underline cursor-pointer transition"
                            >
                              {position.stopLoss ? "Modifier" : "Définir"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                      <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-xs text-slate-500">Aucun titre détenu sur <strong>{selectedStock.symbol}</strong>.</p>
                      <p className="text-[10px] text-slate-400 max-w-[200px]">Passez votre premier ordre d'achat fictif ci-contre pour débuter !</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 text-[10px] text-slate-400 flex items-start gap-1 pb-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>(*) C.U.M.P : Coût Unitaire Moyen Pondéré. Prix moyen constaté lors de vos multiples ordres d'achats.</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Global Portfolio list & Transaction records */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Briefcase className="w-4.5 h-4.5 text-emerald-600" />
            Résumé de toutes vos positions actuelles
          </h4>

          {profile.portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider">
                    <th className="py-2.5">Action</th>
                    <th className="py-2.5">Quantité</th>
                    <th className="py-2.5">Prix d'Achat</th>
                    <th className="py-2.5">Cours Actuel</th>
                    <th className="py-2.5 text-right">Valeur Actuelle</th>
                    <th className="py-2.5 text-right">+/- Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-mono">
                  {profile.portfolio.map((item) => {
                    const currentStock = stocks.find(s => s.symbol === item.symbol) || selectedStock;
                    const val = currentStock.price * item.shares;
                    const investVal = item.avgBuyPrice * item.shares;
                    const netValDiff = val - investVal;
                    const netValPercent = (netValDiff / investVal) * 100;
                    const isPos = netValDiff >= 0;

                    return (
                      <tr key={item.symbol} className="hover:bg-slate-50/50 transition cursor-pointer" onClick={() => setSelectedSymbol(item.symbol)}>
                        <td className="py-3 font-sans">
                          <span className="font-bold text-slate-800 font-mono">{item.symbol}</span>
                          <span className="text-slate-400 block text-[10px]">{currentStock.name}</span>
                        </td>
                        <td className="py-3 font-bold text-slate-700">{item.shares}</td>
                        <td className="py-3 text-slate-500">{item.avgBuyPrice.toFixed(2)} $</td>
                        <td className="py-3 text-slate-800">{currentStock.price.toFixed(2)} $</td>
                        <td className="py-3 text-right font-bold text-slate-800">{val.toFixed(2)} $</td>
                        <td className={`py-3 text-right font-extrabold ${isPos ? "text-emerald-600" : "text-rose-500"}`}>
                          {isPos ? "+" : ""}{netValDiff.toFixed(2)} $
                          <span className="block text-[10px] font-semibold font-sans">{isPos ? "+" : ""}{netValPercent.toFixed(2)}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Votre portefeuille est vide. Explorez la liste des cours boursiers pour faire votre première simulation boursière !
            </div>
          )}
        </div>

        {/* Ledger Transaction History logs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-800 text-base flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <History className="w-4.5 h-4.5 text-indigo-500" />
            Historique des ordres exécutés
          </h4>

          {profile.transactions.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[180px] pr-1">
              {profile.transactions.map((tx) => {
                const isBuy = tx.type === 'BUY';
                return (
                  <div key={tx.id} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded-[4px] font-extrabold text-[9px] ${
                          isBuy ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {isBuy ? "ACHAT" : "VENTE"}
                        </span>
                        <span className="font-bold font-mono text-slate-800">{tx.symbol}</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">{tx.date}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-700 font-bold">{tx.shares} Actions</span>
                      <p className="text-slate-500 text-[10px]">Moy. {tx.price.toFixed(2)} $</p>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-800">
                      {(tx.shares * tx.price).toFixed(2)} $
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs font-sans">
              Aucune transaction effectuée pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* MODAL ZOOM ULTRA-HAUTE PRÉCISION ET GROS PLAN */}
      {isZoomExpanded && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full p-4 sm:p-6 flex flex-col gap-4 animate-scale-up max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-indigo-650 bg-indigo-600 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold">
                  {selectedStock.symbol} (Zoom {zoomLevel.toFixed(1)}x)
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Graphique Gros Plan Interactif : {selectedStock.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Déplacez-vous sur l'axe du temps, zoomez à la molette ou cliquez/glissez pour naviguer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsZoomExpanded(false);
                  setHoveredZoomPrice(null);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Fermer le plein écran"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Render dynamically our custom zoomed chart view */}
            <div className="w-full">
              {renderZoomedDetailedChartOnModal()}
            </div>

            {/* Interactive sliders & Quick zoom buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
              {/* Zoom setting & slider controls */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-500" />
                    Niveau du Zoom : {zoomLevel.toFixed(1)}x
                  </span>
                  <span className="text-[10px] text-slate-400">Molette de défilement active sur le graphe</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={zoomLevel <= 1}
                    onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-4 h-4 text-slate-605 text-slate-600" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="flex-1 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <button
                    type="button"
                    disabled={zoomLevel >= 10}
                    onClick={() => setZoomLevel(prev => Math.min(10, prev + 0.5))}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Pan offset controls */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                    Position Temporelle (Navigation) : {panOffsetPercent.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-400">Glisser-déposer sur le graphe actif</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400">Ancien</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={panOffsetPercent}
                    onChange={(e) => setPanOffsetPercent(parseFloat(e.target.value))}
                    className="flex-1 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] font-bold text-indigo-600">Récent</span>
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffsetPercent(100);
                  setHoveredZoomPrice(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                title="Rétablir les vues initiales"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser Vues</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsZoomExpanded(false);
                  setHoveredZoomPrice(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-sm cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Retour au Simulateur</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
