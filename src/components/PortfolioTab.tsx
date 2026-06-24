import React, { useState } from "react";
import { Stock, UserProfile } from "../types";
import { 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Shield,
  HelpCircle,
  TrendingDown,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  Folder
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-lg font-sans">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-black text-slate-850 dark:text-slate-100 mt-1 font-mono">
          {parseFloat(payload[0].value).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
        </p>
      </div>
    );
  }
  return null;
};

interface PortfolioTabProps {
  stocks: Stock[];
  profile: UserProfile;
  onTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number, stopLoss?: number | null) => void;
  onUpdateStopLoss: (symbol: string, stopLoss?: number | null) => void;
  lang: string;
  t: (key: string) => string;
}

export default function PortfolioTab({ stocks, profile, onTrade, onUpdateStopLoss, lang, t }: PortfolioTabProps) {
  const [selectedSellStock, setSelectedSellStock] = useState<string | null>(null);
  const [sellSharesStr, setSellSharesStr] = useState<string>("");
  const [sellSuccessMessage, setSellSuccessMessage] = useState<string | null>(null);
  const [editStopLossSymbol, setEditStopLossSymbol] = useState<string | null>(null);
  const [stopLossValueStr, setStopLossValueStr] = useState<string>("");

  // Multi-portfolio Custom management
  const [customPortfolios, setCustomPortfolios] = useState<{
    id: string;
    name: string;
    description?: string;
    items: {
      symbol: string;
      shares: number;
      avgBuyPrice: number;
    }[];
  }[]>(() => {
    try {
      const saved = localStorage.getItem("simulator_custom_portfolios");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out the demo portfolio with id "port-demo"
        const filtered = Array.isArray(parsed) ? parsed.filter((p: any) => p.id !== "port-demo") : [];
        if (parsed.length !== filtered.length) {
          localStorage.setItem("simulator_custom_portfolios", JSON.stringify(filtered));
        }
        return filtered;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activePortfolioId, setActivePortfolioId] = useState<string>("main");

  // Custom portfolio modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioDesc, setNewPortfolioDesc] = useState("");

  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [addStockSymbol, setAddStockSymbol] = useState("AAPL");
  const [addStockShares, setAddStockShares] = useState("10");
  const [addStockBuyPrice, setAddStockBuyPrice] = useState("");

  const [editingStockSymbol, setEditingStockSymbol] = useState<string | null>(null);
  const [editingStockShares, setEditingStockShares] = useState("");
  const [editingStockBuyPrice, setEditingStockBuyPrice] = useState("");

  const saveCustomPortfolios = (updated: any[]) => {
    setCustomPortfolios(updated);
    localStorage.setItem("simulator_custom_portfolios", JSON.stringify(updated));
  };

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) {
      alert(lang === "fr" ? "Veuillez entrer un nom de portefeuille." : "Please enter a portfolio name.");
      return;
    }
    const newP = {
      id: "port-" + Date.now(),
      name: newPortfolioName.trim(),
      description: newPortfolioDesc.trim(),
      items: []
    };
    const updated = [...customPortfolios, newP];
    saveCustomPortfolios(updated);
    setActivePortfolioId(newP.id);
    setNewPortfolioName("");
    setNewPortfolioDesc("");
    setShowCreateModal(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm(lang === "fr" ? "Êtes-vous sûr de vouloir supprimer ce portefeuille ?" : "Are you sure you want to delete this portfolio?")) {
      const updated = customPortfolios.filter(p => p.id !== id);
      saveCustomPortfolios(updated);
      setActivePortfolioId("main");
    }
  };

  const handleAddStockToPortfolio = () => {
    const sharesNum = parseInt(addStockShares);
    const priceNum = parseFloat(addStockBuyPrice);

    if (!addStockSymbol) {
      alert(lang === "fr" ? "Veuillez choisir un symbole." : "Please choose a symbol.");
      return;
    }
    if (isNaN(sharesNum) || sharesNum <= 0) {
      alert(lang === "fr" ? "Veuillez entrer un nombre d'actions valide." : "Please enter a valid number of shares.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert(lang === "fr" ? "Veuillez entrer un prix d'achat valide." : "Please enter a valid purchase price.");
      return;
    }

    const updated = customPortfolios.map(p => {
      if (p.id === activePortfolioId) {
        const existingIndex = p.items.findIndex(item => item.symbol === addStockSymbol);
        let updatedItems = [...p.items];
        if (existingIndex >= 0) {
          const existing = p.items[existingIndex];
          const totalShares = existing.shares + sharesNum;
          const totalCost = (existing.shares * existing.avgBuyPrice) + (sharesNum * priceNum);
          updatedItems[existingIndex] = {
            symbol: addStockSymbol,
            shares: totalShares,
            avgBuyPrice: parseFloat((totalCost / totalShares).toFixed(2))
          };
        } else {
          updatedItems.push({
            symbol: addStockSymbol,
            shares: sharesNum,
            avgBuyPrice: priceNum
          });
        }
        return { ...p, items: updatedItems };
      }
      return p;
    });

    saveCustomPortfolios(updated);
    setShowAddStockModal(false);
  };

  const handleSaveEditStock = () => {
    if (!editingStockSymbol) return;
    const sharesNum = parseInt(editingStockShares);
    const priceNum = parseFloat(editingStockBuyPrice);

    if (isNaN(sharesNum) || sharesNum <= 0) {
      alert(lang === "fr" ? "Nombre d'actions invalide." : "Invalid number of shares.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert(lang === "fr" ? "Prix d'achat invalide." : "Invalid buy price.");
      return;
    }

    const updated = customPortfolios.map(p => {
      if (p.id === activePortfolioId) {
        const updatedItems = p.items.map(item => {
          if (item.symbol === editingStockSymbol) {
            return {
              ...item,
              shares: sharesNum,
              avgBuyPrice: priceNum
            };
          }
          return item;
        });
        return { ...p, items: updatedItems };
      }
      return p;
    });

    saveCustomPortfolios(updated);
    setEditingStockSymbol(null);
  };

  const handleDeleteStockFromPortfolio = (symbol: string) => {
    if (confirm(lang === "fr" ? `Supprimer la position ${symbol} du portefeuille ?` : `Delete ${symbol} position from this portfolio?`)) {
      const updated = customPortfolios.map(p => {
        if (p.id === activePortfolioId) {
          return {
            ...p,
            items: p.items.filter(item => item.symbol !== symbol)
          };
        }
        return p;
      });
      saveCustomPortfolios(updated);
    }
  };

  // Helpers for calculation
  const getStockDetails = (symbol: string) => {
    return stocks.find(s => s.symbol === symbol);
  };

  const getPortfolioValues = () => {
    let totalStockValue = 0;
    const itemsWithPerformance = profile.portfolio.map(item => {
      const currentStock = getStockDetails(item.symbol);
      const currentPrice = currentStock ? currentStock.price : item.avgBuyPrice;
      const totalCost = item.shares * item.avgBuyPrice;
      const currentValue = item.shares * currentPrice;
      const gainLoss = currentValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
      totalStockValue += currentValue;

      return {
        ...item,
        currentPrice,
        stockName: currentStock ? currentStock.name : item.symbol,
        totalCost,
        currentValue,
        gainLoss,
        gainLossPercent
      };
    });

    const netAsset = profile.cash + totalStockValue;
    const initialFunds = 10000;
    const overallGainLoss = netAsset - initialFunds;
    const overallGainLossPercent = (overallGainLoss / initialFunds) * 100;

    return {
      itemsWithPerformance,
      totalStockValue,
      netAsset,
      overallGainLoss,
      overallGainLossPercent
    };
  };

  const { itemsWithPerformance, totalStockValue, netAsset, overallGainLoss, overallGainLossPercent } = getPortfolioValues();

  const getActivePortfolioDetails = () => {
    if (activePortfolioId === "main") {
      return {
        id: "main",
        name: lang === "fr" ? "Portefeuille Principal (Simulateur)" : "Main Simulator Portfolio",
        description: lang === "fr" ? "Vos positions basées sur vos ordres simulés." : "Positions bought with your virtual simulator balance.",
        items: itemsWithPerformance,
        isCustom: false,
        totalStockValue,
        netAsset,
        overallGainLoss,
        overallGainLossPercent
      };
    }

    const currentP = customPortfolios.find(p => p.id === activePortfolioId);
    if (!currentP) {
      return {
        id: "unknown",
        name: "Inconnu",
        description: "",
        items: [],
        isCustom: true,
        totalStockValue: 0,
        netAsset: 0,
        overallGainLoss: 0,
        overallGainLossPercent: 0
      };
    }

    let totStockValue = 0;
    let totCostValue = 0;
    const computedItems = currentP.items.map(item => {
      const currentStock = getStockDetails(item.symbol);
      const currentPrice = currentStock ? currentStock.price : item.avgBuyPrice;
      const totalCost = item.shares * item.avgBuyPrice;
      const currentValue = item.shares * currentPrice;
      const gainLoss = currentValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
      totStockValue += currentValue;
      totCostValue += totalCost;

      return {
        ...item,
        currentPrice,
        stockName: currentStock ? currentStock.name : item.symbol,
        totalCost,
        currentValue,
        gainLoss,
        gainLossPercent
      };
    });

    const gainLossSum = totStockValue - totCostValue;
    const gainLossPercentSum = totCostValue > 0 ? (gainLossSum / totCostValue) * 100 : 0;

    return {
      id: currentP.id,
      name: currentP.name,
      description: currentP.description,
      items: computedItems,
      isCustom: true,
      totalStockValue: totStockValue,
      netAsset: totStockValue,
      overallGainLoss: gainLossSum,
      overallGainLossPercent: gainLossPercentSum
    };
  };

  const activePort = getActivePortfolioDetails();

  // Handle slide/action to sell
  const openSellModal = (symbol: string) => {
    setSelectedSellStock(symbol);
    const item = profile.portfolio.find(p => p.symbol === symbol);
    // Default sell shares to 100% owned for speed
    setSellSharesStr(item ? item.shares.toString() : "");
    setSellSuccessMessage(null);
  };

  const closeSellModal = () => {
    setSelectedSellStock(null);
    setSellSharesStr("");
    setSellSuccessMessage(null);
  };

  const handleConfirmSell = () => {
    if (!selectedSellStock) return;
    const item = profile.portfolio.find(p => p.symbol === selectedSellStock);
    if (!item) return;

    const sharesToSell = parseInt(sellSharesStr);
    if (isNaN(sharesToSell) || sharesToSell <= 0) {
      alert(lang === "fr" ? "Veuillez entrer un nombre de parts valide." : "Please enter a valid number of shares.");
      return;
    }

    if (sharesToSell > item.shares) {
      alert(lang === "fr" ? "Vous ne pouvez pas vendre plus d'actions que vous n'en possédez !" : "You cannot sell more shares than you own!");
      return;
    }

    const currentStock = getStockDetails(selectedSellStock);
    const sellPrice = currentStock ? currentStock.price : item.avgBuyPrice;

    // Call parents trade engine
    onTrade(selectedSellStock, "SELL", sharesToSell, sellPrice);

    const gainFromSale = sharesToSell * sellPrice;
    setSellSuccessMessage(
      lang === "fr" 
        ? `Vente réussie de ${sharesToSell} actions ${selectedSellStock} pour un total de ${gainFromSale.toFixed(1)} $ !` 
        : `Successfully sold ${sharesToSell} shares of ${selectedSellStock} for a total of $${gainFromSale.toFixed(1)}!`
    );

    // Refresh default values or auto close later
    setSellSharesStr("");
    setTimeout(() => {
      closeSellModal();
    }, 2200);
  };

  // Stop loss management
  const openStopLossEditor = (symbol: string, currentStopLoss?: number) => {
    setEditStopLossSymbol(symbol);
    setStopLossValueStr(currentStopLoss ? currentStopLoss.toString() : "");
  };

  const closeStopLossEditor = () => {
    setEditStopLossSymbol(null);
    setStopLossValueStr("");
  };

  const handleUpdateStopLossValue = () => {
    if (!editStopLossSymbol) return;

    if (stopLossValueStr === "") {
      onUpdateStopLoss(editStopLossSymbol, null);
      closeStopLossEditor();
      return;
    }

    const slValue = parseFloat(stopLossValueStr);
    if (isNaN(slValue) || slValue <= 0) {
      alert(lang === "fr" ? "Veuillez insérer un prix de protection positif ou effacer le champ." : "Please insert a positive protection price or clear the field.");
      return;
    }

    onUpdateStopLoss(editStopLossSymbol, slValue);
    closeStopLossEditor();
  };

  return (
    <div id="portfolio-tab" className="space-y-6">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in duration-200">
        
        {/* Total portfolio net worth */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              {lang === "fr" ? "Valeur Portefeuille" : "Net Asset Value"}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-100 tracking-tight mt-1 font-mono">
              {netAsset.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold">
            <span className={overallGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}>
              {overallGainLoss >= 0 ? "+" : ""}
              {overallGainLoss.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </span>
            <span className={`px-1.5 py-0.5 rounded ${overallGainLoss >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" : "bg-rose-50 dark:bg-rose-950/40 text-rose-500"}`}>
              {overallGainLoss >= 0 ? "+" : ""}
              {overallGainLossPercent.toFixed(2)} %
            </span>
          </div>
        </div>

        {/* Total Stock value (Assets) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              {lang === "fr" ? "Actions Possédées" : "Stocks Value"}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mt-1 font-mono">
              {totalStockValue.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 leading-normal">
            {lang === "fr" ? `${itemsWithPerformance.length} lignes d'actifs boursiers` : `${itemsWithPerformance.length} distinct stock assets`}
          </p>
        </div>

        {/* Free raw cash */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              {lang === "fr" ? "Liquidités Disponibles" : "Available Cash"}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-605 text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 font-mono">
              {profile.cash.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 leading-normal">
            {lang === "fr" ? "Prêtes à être réinvesties" : "Sized for immediate buying"}
          </p>
        </div>

        {/* Standard reference banner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">Portefeuille Éducatif</h4>
            <p className="text-[11px] text-slate-350 leading-relaxed mt-1.5">
              {lang === "fr" 
                ? "Simulez vos arbitrages en temps réel avec un suivi précis de vos performances."
                : "Manage and liquidate positions instantly with advanced risk control tracking."}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-15">
            <Briefcase className="w-24 h-24 text-white" />
          </div>
        </div>
      </div>

      {/* Portfolio Value Progression Chart */}
      {(() => {
        const rawHistory = profile.portfolioHistory || [];
        // If we only have 1 or 0 points, backfill locally for rendering so the chart is styled immediately
        const chartData = rawHistory.length >= 2 
          ? rawHistory 
          : [
              { date: "06/06", value: 10000 },
              { date: "07/06", value: 10050 },
              { date: "08/06", value: 9940 },
              { date: "09/06", value: 10120 },
              { date: "10/06", value: 10080 },
              { date: "11/06", value: 10180 },
              { date: new Date().toLocaleDateString("fr-FR").substring(0, 5), value: netAsset }
            ];

        const historyValues = chartData.map(d => d.value);
        const minHistoryVal = Math.min(...historyValues) * 0.995;
        const maxHistoryVal = Math.max(...historyValues) * 1.005;

        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-105 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  {lang === "fr" ? "Évolution de la Valeur Totale" : "Portfolio Value Trend"}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {lang === "fr" 
                    ? "Historique de vos performances en fonction des liquidités et des cours du marché."
                    : "Historical track record of your virtual net assets over time."}
                </p>
              </div>
              
              {/* Quick Metrics display */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 mr-1.5">{lang === "fr" ? "Plus Bas :" : "Lowest:"}</span>
                  <span className="font-mono text-slate-800 dark:text-slate-350">{Math.round(minHistoryVal).toLocaleString()} $</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 mr-1.5">{lang === "fr" ? "Plus Haut :" : "Highest:"}</span>
                  <span className="font-mono text-slate-850 dark:text-slate-105">{Math.round(maxHistoryVal).toLocaleString()} $</span>
                </div>
              </div>
            </div>

            {/* Standard Recharts responsive container */}
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false}
                    stroke="#94a3b8" 
                    fontSize={10}
                    dy={10}
                  />
                  <YAxis 
                    domain={[minHistoryVal, maxHistoryVal]}
                    tickLine={false} 
                    axisLine={false}
                    stroke="#94a3b8" 
                    fontSize={10}
                    dx={-10}
                    tickFormatter={(val) => `${Math.round(val)} $`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPortfolio)" 
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Multi-Portfolio Selector Deck */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-2 rounded-2xl border border-slate-150 dark:border-slate-800/85 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 shadow-2xs">
          <Folder className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-350 uppercase tracking-widest">
            {lang === "fr" ? "Mes Portefeuilles" : "My Portfolios"}
          </span>
        </div>
        
        <button
          onClick={() => setActivePortfolioId("main")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activePortfolioId === "main"
              ? "bg-slate-900 border border-slate-900 text-white dark:bg-indigo-650 dark:border-indigo-650"
              : "text-slate-500 hover:text-slate-750 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-905"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{lang === "fr" ? "Portefeuille Principal" : "Main Portfolio"}</span>
          <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
            activePortfolioId === "main" ? "bg-slate-800 text-white dark:bg-indigo-750" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            {profile.portfolio.length}
          </span>
        </button>

        {customPortfolios.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePortfolioId(p.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activePortfolioId === p.id
                ? "bg-slate-900 border border-slate-900 text-white dark:bg-indigo-650 dark:border-indigo-650"
                : "text-slate-500 hover:text-slate-755 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60"
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="truncate max-w-[130px]">{p.name}</span>
            <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
              activePortfolioId === p.id ? "bg-slate-800 text-white dark:bg-indigo-755" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}>
              {p.items.length}
            </span>
          </button>
        ))}

        <button
          onClick={() => {
            setNewPortfolioName("");
            setNewPortfolioDesc("");
            setShowCreateModal(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer ml-auto transition border border-dashed border-indigo-200 dark:border-indigo-805"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>{lang === "fr" ? "Nouveau Portefeuille" : "New Portfolio"}</span>
        </button>
      </div>

      {/* Actual holdings table list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="font-extrabold text-slate-850 dark:text-slate-105 text-base flex items-center gap-2">
              {activePort.isCustom ? (
                <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10" />
              ) : (
                <Briefcase className="w-5 h-5 text-indigo-500" />
              )}
              {activePort.name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {activePort.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activePort.isCustom && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAddStockSymbol(stocks[0]?.symbol || "AAPL");
                    setAddStockShares("10");
                    setAddStockBuyPrice((stocks[0]?.price || 150).toString());
                    setShowAddStockModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === "fr" ? "Ajouter une action" : "Add Stock"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePortfolio(activePortfolioId)}
                  className="flex items-center justify-center p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-950"
                  title={lang === "fr" ? "Supprimer le portefeuille" : "Delete portfolio"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Custom Portfolios mini stats widget */}
        {activePort.isCustom && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-150/60 dark:border-slate-805">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 block">{lang === "fr" ? "Valeur Estimée" : "Estimated Value"}</span>
              <span className="text-base font-black text-slate-850 dark:text-slate-100 font-mono mt-0.5 block">
                {activePort.totalStockValue.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 block">{lang === "fr" ? "Actifs Suivis" : "Tracked Stocks"}</span>
              <span className="text-base font-black text-slate-850 dark:text-slate-100 font-mono mt-0.5 block">
                {activePort.items.length} {lang === "fr" ? "lignes" : "positions"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 block">{lang === "fr" ? "Plus/Moins-Value" : "Overall Return"}</span>
              <span className={`text-base font-mono font-black mt-0.5 flex items-center gap-1.5 ${activePort.overallGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                <span>{activePort.overallGainLoss >= 0 ? "+" : ""}{activePort.overallGainLoss.toFixed(2)} $</span>
                <span className="text-[10.5px] font-bold">
                  ({activePort.overallGainLoss >= 0 ? "+" : ""}{activePort.overallGainLossPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          </div>
        )}

        {activePort.items.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-350 dark:text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {activePort.isCustom ? <Folder className="w-8 h-8 text-amber-500/60" /> : <Briefcase className="w-8 h-8" />}
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
              {activePort.isCustom 
                ? (lang === "fr" ? "Portefeuille vide" : "This customized portfolio is empty") 
                : (lang === "fr" ? "Aucune action en cours" : "Your portfolio is empty")}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
              {activePort.isCustom
                ? (lang === "fr" ? "Cliquez sur 'Ajouter une action' ci-dessus pour simuler et suivre des investissements personnalisés." : "Use the 'Add Stock' button above to simulate custom assets to monitor inside this workspace.")
                : (lang === "fr" ? "Pour acheter des actions, rendez-vous dans la section Simulateur bourse pour passer vos premiers ordres." : "Buy fractional shares from our real-time stocks feed inside the Market Simulator module first.")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-2 text-center w-12">#</th>
                  <th className="py-3 px-2">{lang === "fr" ? "Actif & Symbole" : "Asset & Symbol"}</th>
                  <th className="py-3 px-2 text-right">{lang === "fr" ? "Parts Possédées" : "Shares Owned"}</th>
                  <th className="py-3 px-2 text-right">{lang === "fr" ? "Prix d'Achat" : "Avg Purchase Price"}</th>
                  <th className="py-3 px-2 text-right">{lang === "fr" ? "Cours Actuel" : "Current Rate"}</th>
                  <th className="py-3 px-2 text-right">{lang === "fr" ? "Valeur Actuelle" : "Total Value"}</th>
                  <th className="py-3 px-2 text-right font-bold">{lang === "fr" ? "Plus/Moins-Value" : "Profit/Loss"}</th>
                  {!activePort.isCustom && <th className="py-3 px-2 text-center">{lang === "fr" ? "Stop-Loss Actif" : "Stop-Loss Set"}</th>}
                  <th className="py-3 px-3 text-right">{lang === "fr" ? "Actions" : "Execute"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {activePort.items.map((item, idx) => {
                  const isPos = item.gainLoss >= 0;
                  return (
                    <tr key={item.symbol} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition duration-100 group">
                      <td className="py-4 px-2 text-center font-mono text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 border border-indigo-100/30 dark:border-slate-700 flex items-center justify-center font-bold font-mono text-slate-800 dark:text-slate-200">
                            {item.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 block font-mono">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] text-slate-400 block max-w-[140px] truncate">
                              {item.stockName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-black font-mono text-slate-800 dark:text-slate-100">
                        {item.shares}
                      </td>
                      <td className="py-4 px-2 text-right font-mono font-medium text-slate-500 dark:text-slate-400">
                        {item.avgBuyPrice.toFixed(2)} $
                      </td>
                      <td className="py-4 px-2 text-right font-bold font-mono text-slate-700 dark:text-slate-200">
                        {item.currentPrice.toFixed(2)} $
                      </td>
                      <td className="py-4 px-2 text-right font-black font-mono text-slate-850 dark:text-slate-100">
                        {item.currentValue.toFixed(2)} $
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className={`font-black font-mono text-xs flex items-center justify-end gap-1 ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
                          {isPos ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                          <span>{isPos ? "+" : ""}{item.gainLoss.toFixed(2)} $</span>
                        </div>
                        <span className={`text-[10px] font-bold font-mono block ${isPos ? "text-emerald-500/80" : "text-rose-500/80"}`}>
                          ({isPos ? "+" : ""}{item.gainLossPercent.toFixed(2)}%)
                        </span>
                      </td>
                      
                      {/* Only render Stop-loss column for primary simulation portfolio */}
                      {!activePort.isCustom && (
                        <td className="py-4 px-2 text-center">
                          {editStopLossSymbol === item.symbol ? (
                            <div className="flex items-center justify-center gap-1.5 max-w-[124px] mx-auto">
                              <input
                                type="number"
                                step="0.01"
                                value={stopLossValueStr}
                                onChange={(e) => setStopLossValueStr(e.target.value)}
                                className="w-16 px-1.5 py-1 text-center font-mono rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden"
                                placeholder="Prix $"
                              />
                              <button
                                onClick={handleUpdateStopLossValue}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded p-1 shadow-xs cursor-pointer text-[10px]"
                                title={lang === "fr" ? "Confirmer" : "Confirm"}
                              >
                                ✓
                              </button>
                              <button
                                onClick={closeStopLossEditor}
                                className="bg-slate-300 dark:bg-slate-850 hover:bg-slate-400 text-slate-800 dark:text-white rounded p-1 cursor-pointer text-[10px]"
                                title={lang === "fr" ? "Annuler" : "Cancel"}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              {item.stopLoss ? (
                                <button
                                  onClick={() => openStopLossEditor(item.symbol, item.stopLoss)}
                                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded border border-amber-500/20 font-bold font-mono text-[10.5px] cursor-pointer"
                                  title={lang === "fr" ? "Seuil stop loss actif. Cliquez pour le modifier." : "Active protection. Click to adjust."}
                                >
                                  {item.stopLoss.toFixed(2)} $
                                </button>
                              ) : (
                                <button
                                  onClick={() => openStopLossEditor(item.symbol)}
                                  className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline px-2 py-1 transition cursor-pointer"
                                >
                                  {lang === "fr" ? "+ Configurer" : "+ Set Stop-Loss"}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      )}

                      <td className="py-4 px-3 text-right">
                        {activePort.isCustom ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStockSymbol(item.symbol);
                                setEditingStockShares(item.shares.toString());
                                setEditingStockBuyPrice(item.avgBuyPrice.toString());
                              }}
                              className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl font-bold transition text-[11px] cursor-pointer"
                            >
                              {lang === "fr" ? "Modifier" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStockFromPortfolio(item.symbol)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openSellModal(item.symbol)}
                            className="bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-950/40 hover:text-white text-rose-500 dark:text-rose-450 border border-rose-500/20 font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer text-xs group-hover:scale-102"
                          >
                            {lang === "fr" ? "Vendre" : "Sell"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sell Modal Slider Frame Overlay */}
      <AnimatePresence>
        {selectedSellStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={closeSellModal}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-slate-850 dark:text-slate-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">
                    {lang === "fr" ? "Vendre vos actions" : "Sell your holdings"}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {selectedSellStock} — {getStockDetails(selectedSellStock)?.name || selectedSellStock}
                  </p>
                </div>
                <button
                  onClick={closeSellModal}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-full text-slate-400 cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Action content form */}
              <div className="py-5 space-y-4">
                {sellSuccessMessage ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 dark:border-emerald-900/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-200">
                      {sellSuccessMessage}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Share Stats */}
                    {(() => {
                      const item = profile.portfolio.find(p => p.symbol === selectedSellStock);
                      const currentStock = getStockDetails(selectedSellStock);
                      const rate = currentStock ? currentStock.price : (item?.avgBuyPrice || 0);
                      const totalOwned = item ? item.shares : 0;
                      const enteredShares = parseInt(sellSharesStr) || 0;
                      const estimatedSum = enteredShares * rate;

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === "fr" ? "Possédé" : "Owned"}</span>
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5 block">{totalOwned} parts</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === "fr" ? "Cours du Marché" : "Market Price"}</span>
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5 block">{rate.toFixed(2)} $</span>
                            </div>
                          </div>

                          {/* How many shares to sell */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {lang === "fr" ? "Parts à vendre :" : "Shares to sell:"}
                            </label>
                            
                            <div className="relative">
                              <input
                                type="number"
                                min="1"
                                max={totalOwned}
                                value={sellSharesStr}
                                onChange={(e) => setSellSharesStr(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white font-black font-mono text-base focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                              />

                              {/* Quick selection flags */}
                              <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSellSharesStr(Math.max(1, Math.round(totalOwned * 0.5)).toString())}
                                  className="px-2 py-1 bg-slate-150 hover:bg-slate-200 dark:bg-slate-805 dark:hover:bg-slate-800 text-[10px] font-black rounded-lg cursor-pointer transition text-slate-650 bg-slate-100 dark:bg-slate-800 dark:text-slate-350"
                                >
                                  50%
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSellSharesStr(totalOwned.toString())}
                                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900 text-[10px] font-black rounded-lg cursor-pointer transition text-indigo-600 dark:text-indigo-400"
                                >
                                  MAX
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Estimates */}
                          <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/30 dark:border-indigo-950/50 rounded-2xl flex justify-between items-center">
                            <span className="text-xs font-bold text-indigo-750 dark:text-indigo-455">
                              {lang === "fr" ? "Crédit d'espèces estimé :" : "Estimated Credit value:"}
                            </span>
                            <span className="font-extrabold text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-mono">
                              {estimatedSum ? estimatedSum.toFixed(2) : "0.00"} $
                            </span>
                          </div>

                          {/* Validate and submit action */}
                          <button
                            type="button"
                            onClick={handleConfirmSell}
                            disabled={!enteredShares || enteredShares <= 0 || enteredShares > totalOwned}
                            className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all duration-150 cursor-pointer text-center text-white ${
                              (!enteredShares || enteredShares <= 0 || enteredShares > totalOwned)
                                ? "bg-slate-200 dark:bg-slate-800 cursor-not-allowed text-slate-400 dark:text-slate-600"
                                : "bg-rose-500 hover:bg-rose-600 hover:scale-[1.01] shadow-md shadow-rose-500/10 active:scale-[0.99]"
                            }`}
                          >
                            {lang === "fr" ? "Valider la vente d'actions" : "Execute Sell Trade"}
                          </button>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction History Sub-Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
          <History className="w-4.5 h-4.5 text-indigo-500" />
          {lang === "fr" ? "Historique des Transactions Récentes" : "Recent Transaction Records"}
        </h4>

        {profile.transactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 dark:text-slate-500 text-center">
            {lang === "fr" ? "Aucune transaction enregistrée." : "No records to display yet."}
          </p>
        ) : (
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-805 tracking-wider">
                <tr>
                  <th className="py-2.5 px-2">{lang === "fr" ? "Date" : "Datetime"}</th>
                  <th className="py-2.5 px-2">{lang === "fr" ? "ID" : "TXID"}</th>
                  <th className="py-2.5 px-2 text-center">{lang === "fr" ? "Ordre" : "Order"}</th>
                  <th className="py-2.5 px-2">{lang === "fr" ? "Symbole" : "Symbol"}</th>
                  <th className="py-2.5 px-2 text-right">{lang === "fr" ? "Parts" : "Shares"}</th>
                  <th className="py-2.5 px-2 text-right">{lang === "fr" ? "Exécution" : "Exec Rate"}</th>
                  <th className="py-2.5 px-2 text-right font-bold">{lang === "fr" ? "Montant Total" : "Cash stream"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850/50">
                {profile.transactions.map((tx) => {
                  const isBuy = tx.type === "BUY";
                  const totalAmountStr = (tx.shares * tx.price).toFixed(2);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10">
                      <td className="py-3 px-2 font-mono text-[10.5px] text-slate-400">
                        {tx.date}
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-slate-400">
                        {tx.id}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase text-center ${
                          isBuy 
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30" 
                            : "bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-100/30"
                        }`}>
                          {isBuy ? (lang === "fr" ? "Achat" : "Buy") : (lang === "fr" ? "Vente" : "Sell")}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-black font-mono text-slate-800 dark:text-slate-100">
                        {tx.symbol}
                      </td>
                      <td className="py-3 px-2 text-right font-bold font-mono">
                        {tx.shares}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500 dark:text-slate-400">
                        {tx.price.toFixed(2)} $
                      </td>
                      <td className="py-3 px-2 text-right font-black font-mono">
                        <span className={isBuy ? "text-slate-800 dark:text-slate-100" : "text-emerald-505 text-emerald-600"}>
                          {isBuy ? "-" : "+"}{totalAmountStr} $
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div id="create-portfolio-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs animate-fade-in" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">
                {lang === "fr" ? "Créer un nouveau portefeuille" : "Create New Portfolio"}
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer">✕</button>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Nom du portefeuille :" : "Portfolio Name:"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Tech, Crypto..."
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Description (Optionnelle) :" : "Description (Optional):"}
                </label>
                <textarea
                  placeholder="e.g. Suivi à long terme de mes valeurs technologiques."
                  value={newPortfolioDesc}
                  onChange={(e) => setNewPortfolioDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleCreatePortfolio}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition cursor-pointer shadow-sm mt-2"
              >
                {lang === "fr" ? "Créer le portefeuille" : "Create Portfolio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Custom Modal */}
      {showAddStockModal && (
        <div id="add-stock-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setShowAddStockModal(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-155">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">
                {lang === "fr" ? "Ajouter une action à suivre" : "Add Stock to Track"}
              </h3>
              <button type="button" onClick={() => setShowAddStockModal(false)} className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer">✕</button>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Sélectionner l'action :" : "Select Stock:"}
                </label>
                <select
                  value={addStockSymbol}
                  onChange={(e) => {
                    const sym = e.target.value;
                    setAddStockSymbol(sym);
                    const stockPrice = stocks.find(s => s.symbol === sym)?.price || 100;
                    setAddStockBuyPrice(stockPrice.toString());
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-extrabold cursor-pointer"
                >
                  {stocks.map(s => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} — {s.name} ({s.price.toFixed(2)} $)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {lang === "fr" ? "Parts :" : "Shares:"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addStockShares}
                    onChange={(e) => setAddStockShares(e.target.value)}
                    className="w-full px-4 py-2 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold font-mono rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {lang === "fr" ? "Prix d'achat ($) :" : "Purchase Price ($):"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={addStockBuyPrice}
                    onChange={(e) => setAddStockBuyPrice(e.target.value)}
                    className="w-full px-4 py-2 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold font-mono rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddStockToPortfolio}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition cursor-pointer shadow-sm mt-2"
              >
                {lang === "fr" ? "Confirmer l'ajout" : "Confirm Addition"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tracked Stock Modal */}
      {editingStockSymbol && (
        <div id="edit-stock-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setEditingStockSymbol(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">
                {lang === "fr" ? `Modifier la position ${editingStockSymbol}` : `Modify ${editingStockSymbol} Position`}
              </h3>
              <button type="button" onClick={() => setEditingStockSymbol(null)} className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer">✕</button>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Modifier le nombre d'actions :" : "Edit Shares Amount:"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingStockShares}
                  onChange={(e) => setEditingStockShares(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-extrabold font-mono text-center focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === "fr" ? "Modifier le prix d'achat moyen ($) :" : "Edit Avg Buy Price ($):"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editingStockBuyPrice}
                  onChange={(e) => setEditingStockBuyPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white font-extrabold font-mono text-center focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveEditStock}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition cursor-pointer shadow-sm mt-2"
              >
                {lang === "fr" ? "Appliquer les modifications" : "Apply Modifications"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
