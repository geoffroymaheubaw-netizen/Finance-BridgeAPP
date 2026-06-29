import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { Award, Zap, Flame, TrendingUp, BookOpen, ChevronRight } from "lucide-react";

interface DashboardTabProps {
  profile: UserProfile;
  stocks: any[];
  setTab: (tab: string) => void;
  lang: string;
  t: (key: string) => string;
}

export default function DashboardTab({ profile, stocks, setTab, lang, t }: DashboardTabProps) {
  // Calculate total portfolio value
  const totalStockValue = profile.portfolio.reduce((sum, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    const price = stock ? stock.price : item.avgBuyPrice;
    return sum + (price * item.shares);
  }, 0);

  const totalPortfolioValue = profile.cash + totalStockValue;
  const initialFunds = 10000;
  const overallProfitLoss = totalPortfolioValue - initialFunds;
  const overallProfitLossPercent = (overallProfitLoss / initialFunds) * 100;

  // Level progress bar calculations
  const getXpThreshold = (lvl: number) => lvl * 250;
  const currentLevelMax = getXpThreshold(profile.level);
  const prevLevelMax = getXpThreshold(profile.level - 1 || 0);
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, ((profile.xp - prevLevelMax) / (currentLevelMax - prevLevelMax)) * 100)
  );

  const getXpBadgeLabel = (xp: number) => {
    if (xp > 800) return t("xpPro");
    if (xp > 400) return t("xpIntermediate");
    return t("xpBeginner");
  };

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white md:p-8 relative overflow-hidden shadow-md animate-in fade-in duration-200">
        <div className="relative z-10 space-y-2">
          <span className="bg-emerald-500/35 border border-emerald-400/35 text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
            Finance Bridge Pro
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {t("welcome")}, {profile.username || "Investisseur"} !
          </h2>
          <p className="text-teal-100 max-w-xl text-sm md:text-base">
            {t("welcomeMotto")}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setTab("learning")}
              className="bg-white text-teal-800 hover:bg-teal-50 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-teal-700" />
              {t("continueLearning")}
            </button>
            <button
              onClick={() => setTab("simulator")}
              className="bg-teal-900/30 border border-teal-400/40 hover:bg-teal-900/40 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center gap-1.5"
            >
              {t("simulateMarket")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Abstract background graphics representing market line grids */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-4">
          <svg className="w-96 h-48" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0,80 Q25,20 50,70 T100,10" />
            <path d="M0,90 Q30,50 60,80 T100,30" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portefeuille Solde Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">{t("netAsset")}</p>
              <h3 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight mt-1">
                {totalPortfolioValue.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${overallProfitLoss >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
            <span className={overallProfitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}>
              {overallProfitLoss >= 0 ? "+" : ""}
              {overallProfitLoss.toLocaleString(lang === "zh" ? "zh-CN" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${overallProfitLoss >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-750 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/40 text-rose-750 dark:text-rose-400"}`}>
              {overallProfitLoss >= 0 ? "+" : ""}
              {overallProfitLossPercent.toFixed(2)} %
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-normal text-xs ml-auto">{t("initialFunds")} : 10 000 $</span>
          </div>
        </div>

        {/* Duolingo XP Progress Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">{t("investLevel")}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-sans">{t("level")} {profile.level}</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 animate-pulse">
                  <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {getXpBadgeLabel(profile.xp)}
                </span>
              </div>
            </div>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400">{profile.xp} / {currentLevelMax} XP</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{Math.round(levelProgressPercent)}% {t("progressLabel")}</span>
            </div>
            <div className="w-full bg-slate-105 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden bg-slate-100">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Flame Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 dark:text-slate-505 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">{t("activitySeries")}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1 flex items-center gap-1.5 font-sans">
                {profile.streak} {profile.streak > 1 ? t("days") : t("daySingle")}
                <Flame className={`w-7 h-7 ${profile.streak > 0 ? "text-orange-500 animate-pulse fill-orange-500" : "text-slate-300 dark:text-slate-700"}`} />
              </h3>
            </div>
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 flex-1">
            {profile.streak > 0 
              ? t("streakActive")
              : t("streakInactive")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 animate-in fade-in duration-300">
        {/* Market Movers Preview Widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs lg:col-span-2">
          <h4 className="font-bold text-slate-850 dark:text-slate-100 text-base mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            {t("mockTrend")}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stocks.slice(0, 4).map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => setTab("simulator")}
                className="border border-slate-100 dark:border-slate-800/60 hover:border-indigo-150 dark:hover:border-indigo-900 hover:bg-slate-50 dark:hover:bg-indigo-950/30 p-3.5 rounded-xl transition cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm font-mono">{stock.symbol}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${stock.change >= 0 ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400"}`}>
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{stock.name}</span>
                  <p className="text-base font-bold text-slate-855 dark:text-slate-100 mt-0.5 font-mono">
                    {stock.price.toFixed(2)} $
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quests & Targets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-3.5">{t("dailyQuests")}</h4>
          <div className="space-y-3.5">
            {/* Quest 1 */}
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border-2 ${
                profile.completedLessons.length > 0
                  ? "bg-emerald-500 border-emerald-500 text-white animate-bounce"
                  : "border-slate-350 dark:border-slate-700"
              }`}>
                {profile.completedLessons.length > 0 && <span className="text-[10px] font-bold">✓</span>}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-750 dark:text-slate-300">{t("quest1")}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs">{t("quest1Desc")}{profile.completedLessons.length > 0 ? "1/1" : "0/1"}</p>
              </div>
              <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-955 px-2 py-0.5 rounded-md shrink-0">+100 XP</span>
            </div>

            {/* Quest 2 */}
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border-2 ${
                profile.portfolio.length > 0
                  ? "bg-emerald-500 border-emerald-500 text-white animate-bounce"
                  : "border-slate-350 dark:border-slate-700"
              }`}>
                {profile.portfolio.length > 0 && <span className="text-[10px] font-bold">✓</span>}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-755 dark:text-slate-300">{t("quest2")}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs">{t("quest2Desc")}</p>
              </div>
              <span className="ml-auto text-xs font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md shrink-0">Sim</span>
            </div>

            {/* Quest 3 */}
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border-2 ${
                profile.transactions.length >= 3
                  ? "bg-emerald-500 border-emerald-500 text-white animate-bounce"
                  : "border-slate-350 dark:border-slate-700"
              }`}>
                {profile.transactions.length >= 3 && <span className="text-[10px] font-bold">✓</span>}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-755 dark:text-slate-300">{t("quest3")}</p>
                <p className="text-slate-400 dark:text-slate-505 text-xs">{t("quest3Desc")}</p>
              </div>
              <span className="ml-auto text-xs font-bold text-slate-400 dark:text-slate-500 font-mono shrink-0">({Math.min(3, profile.transactions.length)}/3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
