import React, { useState, useEffect } from "react";
import { UserProfile, Stock, ChatMessage, Conversation } from "./types";
import { INITIAL_STOCKS, LESSON_MODULES } from "./data";
import { getZonedDateTime, isMarketOpenForStock, isMarketOpenForType, getStockMarket } from "./utils";
import DashboardTab from "./components/DashboardTab";
import SimulatorTab from "./components/SimulatorTab";
import PortfolioTab from "./components/PortfolioTab";
import LearningTab from "./components/LearningTab";
import AiAdvisorTab from "./components/AiAdvisorTab";
import NewsTab from "./components/NewsTab";
import NotesTab from "./components/NotesTab";
import { Landmark, TrendingUp, BookOpen, Bot, Newspaper, Award, Clock, Settings, Sun, Moon, Flame, Briefcase, GraduationCap, LogOut, RotateCcw, Trash2 } from "lucide-react";
import { Language, LANGUAGES, TRANSLATIONS } from "./translations";
import { motion, AnimatePresence } from "motion/react";
import AuthScreen from "./components/AuthScreen";
import FinanceBridgeLogo from "./components/FinanceBridgeLogo";
import { getSupabaseClient } from "./lib/supabase";

const STORAGE_KEY = "finance_bridge_user_profile";
const CHAT_STORAGE_KEY = "finance_bridge_chat_history";

const TICKER_CITIES = [
  { name: "New York", emoji: "🇺🇸", tz: "America/New_York", code: "NYSE" },
  { name: "Chicago", emoji: "🇺🇸", tz: "America/Chicago", code: "CBOE" },
  { name: "Los Angeles", emoji: "🇺🇸", tz: "America/Los_Angeles", code: "LMX" },
  { name: "Toronto", emoji: "🇨🇦", tz: "America/Toronto", code: "TSX" },
  { name: "São Paulo", emoji: "🇧🇷", tz: "America/Sao_Paulo", code: "B3" },
  { name: "Londres", emoji: "🇬🇧", tz: "Europe/London", code: "LSE" },
  { name: "Paris", emoji: "🇫🇷", tz: "Europe/Paris", code: "CAC" },
  { name: "Francfort", emoji: "🇩🇪", tz: "Europe/Berlin", code: "DAX" },
  { name: "Zurich", emoji: "🇨🇭", tz: "Europe/Zurich", code: "SIX" },
  { name: "Genève", emoji: "🇨🇭", tz: "Europe/Zurich", code: "DXTS" },
  { name: "Dubaï", emoji: "🇦🇪", tz: "Asia/Dubai", code: "DFM" },
  { name: "Riyad", emoji: "🇸🇦", tz: "Asia/Riyadh", code: "TADAWUL" },
  { name: "Mumbai", emoji: "🇮🇳", tz: "Asia/Kolkata", code: "NSE" },
  { name: "Singapour", emoji: "🇸🇬", tz: "Asia/Singapore", code: "SGX" },
  { name: "Hong Kong", emoji: "🇭🇰", tz: "Asia/Hong_Kong", code: "HKEX" },
  { name: "Shanghai", emoji: "🇨🇳", tz: "Asia/Shanghai", code: "SSE" },
  { name: "Séoul", emoji: "🇰🇷", tz: "Asia/Seoul", code: "KRX" },
  { name: "Tokyo", emoji: "🇯🇵", tz: "Asia/Tokyo", code: "TSE" },
  { name: "Sydney", emoji: "🇦🇺", tz: "Australia/Sydney", code: "ASX" },
  { name: "Johannesbourg", emoji: "🇿🇦", tz: "Africa/Johannesburg", code: "JSE" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Subscribe to Supabase auth state changes with a robust failsafe timeout
  useEffect(() => {
    let subscription: any = null;
    let failsafeTimeout: any = null;

    try {
      // Check if user previously logged in as guest
      try {
        const storedAuthMode = localStorage.getItem("finance_bridge_auth_mode");
        if (storedAuthMode === "guest") {
          setAuthUser({
            uid: "guest-user",
            email: "guest@example.com",
            displayName: "Invité (Mode Local)",
            isGuest: true
          });
          setAuthLoading(false);
          return;
        }
      } catch (e) {
        console.error("Local storage read error in useEffect:", e);
      }

      const supabase = getSupabaseClient();
      if (!supabase || !supabase.auth) {
        setAuthLoading(false);
        return;
      }

      // Failsafe timeout: if Supabase state check hangs or takes too long (unreachable, CORS issues, etc.)
      // we bypass the loading screen to allow offline/guest mode access
      failsafeTimeout = setTimeout(() => {
        console.warn("Supabase auth check timed out (3.5s). Bypassing loader for offline/guest usage.");
        setAuthLoading(false);
      }, 3500);

      const res = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          const user = session?.user;
          if (user) {
            const metadata = user.user_metadata || {};
            const finalUsername = metadata.username || user.email?.split("@")[0] || "Trader";
            const supabaseUser = {
              uid: user.id,
              email: user.email,
              displayName: finalUsername,
              isSupabase: true
            };
            setAuthUser(supabaseUser);

            // Fetch profile from Supabase
            try {
              const { data, error } = await supabase
                .from("profiles" as any)
                .select("*")
                .eq("id", user.id)
                .single();

              const profileData = data as any;

              if (profileData) {
                setProfile(prev => ({
                  ...prev,
                  username: profileData.username || finalUsername,
                  xp: Number(profileData.xp || 0),
                  level: Number(profileData.level || 1),
                  streak: Number(profileData.streak || 1),
                  lastActive: profileData.lastActive || new Date().toISOString(),
                  cash: Number(profileData.cash || 10000),
                  completedLessons: profileData.completed_lessons || [],
                  portfolio: profileData.portfolio || [],
                  transactions: profileData.transactions || [],
                  portfolioHistory: profileData.portfolio_history || [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
                  marketMode: profileData.marketMode || "real",
                  learningHearts: Number(profileData.learning_hearts || 4),
                  lastHeartsResetDate: profileData.last_hearts_reset_date || new Date().toISOString().substring(0, 10)
                }));
              } else {
                const today = new Date().toISOString().substring(0, 10);
                const initialProfile: UserProfile = {
                  username: finalUsername,
                  xp: 0,
                  level: 1,
                  streak: 1,
                  lastActive: new Date().toISOString(),
                  cash: 10000,
                  completedLessons: [],
                  portfolio: [],
                  transactions: [],
                  portfolioHistory: [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
                  marketMode: "real",
                  learningHearts: 4,
                  lastHeartsResetDate: today
                };
                
                // Write initial profile to Supabase
                await supabase.from("profiles" as any).upsert({
                  id: user.id,
                  username: initialProfile.username,
                  xp: initialProfile.xp,
                  level: initialProfile.level,
                  streak: initialProfile.streak,
                  cash: initialProfile.cash,
                  completed_lessons: initialProfile.completedLessons,
                  portfolio: initialProfile.portfolio,
                  transactions: initialProfile.transactions,
                  portfolio_history: initialProfile.portfolioHistory,
                  marketMode: initialProfile.marketMode,
                  learning_hearts: initialProfile.learningHearts,
                  last_hearts_reset_date: initialProfile.lastHeartsResetDate,
                  updated_at: new Date().toISOString()
                } as any);
                setProfile(prev => ({
                  ...prev,
                  ...initialProfile
                }));
              }
            } catch (err) {
              console.error("Failed loading Supabase user profile:", err);
            }
          } else {
            setAuthUser(null);
          }
        } catch (callbackErr) {
          console.error("Error in Supabase auth state callback:", callbackErr);
        } finally {
          clearTimeout(failsafeTimeout);
          setAuthLoading(false);
        }
      });

      subscription = res?.data?.subscription || res;
    } catch (globalErr) {
      console.error("Global Supabase subscription setup failed:", globalErr);
      setAuthLoading(false);
    }

    return () => {
      if (failsafeTimeout) clearTimeout(failsafeTimeout);
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe();
        } catch (unsubErr) {
          console.error("Failed to unsubscribe:", unsubErr);
        }
      }
    };
  }, []);

  const handleAuthSuccess = async (user: any, isNewUser: boolean, chosenUsername?: string) => {
    setAuthUser(user);
    if (user.isGuest) {
      localStorage.setItem("finance_bridge_auth_mode", "guest");
      // Load from localStorage if present
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        } catch {}
      }
      return;
    }

    localStorage.setItem("finance_bridge_auth_mode", "supabase");
    const today = new Date().toISOString().substring(0, 10);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("profiles" as any)
          .select("*")
          .eq("id", user.uid)
          .single();

        const profileData = data as any;

        if (profileData) {
          setProfile(prev => ({
            ...prev,
            username: profileData.username || user.displayName || chosenUsername || "Trader",
            xp: Number(profileData.xp || 0),
            level: Number(profileData.level || 1),
            streak: Number(profileData.streak || 1),
            lastActive: profileData.lastActive || new Date().toISOString(),
            cash: Number(profileData.cash || 10000),
            completedLessons: profileData.completed_lessons || [],
            portfolio: profileData.portfolio || [],
            transactions: profileData.transactions || [],
            portfolioHistory: profileData.portfolio_history || [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
            marketMode: profileData.marketMode || "real",
            learningHearts: Number(profileData.learning_hearts || 4),
            lastHeartsResetDate: profileData.last_hearts_reset_date || today
          }));
        } else {
          const initialProfile: UserProfile = {
            username: chosenUsername || user.displayName || user.email?.split("@")[0] || "Trader",
            xp: 0,
            level: 1,
            streak: 1,
            lastActive: new Date().toISOString(),
            cash: 10000,
            completedLessons: [],
            portfolio: [],
            transactions: [],
            portfolioHistory: [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
            marketMode: "real",
            learningHearts: 4,
            lastHeartsResetDate: today
          };
          
          await supabase.from("profiles" as any).upsert({
            id: user.uid,
            username: initialProfile.username,
            xp: initialProfile.xp,
            level: initialProfile.level,
            streak: initialProfile.streak,
            cash: initialProfile.cash,
            completed_lessons: initialProfile.completedLessons,
            portfolio: initialProfile.portfolio,
            transactions: initialProfile.transactions,
            portfolio_history: initialProfile.portfolioHistory,
            marketMode: initialProfile.marketMode,
            learning_hearts: initialProfile.learningHearts,
            last_hearts_reset_date: initialProfile.lastHeartsResetDate,
            updated_at: new Date().toISOString()
          } as any);
          setProfile(prev => ({
            ...prev,
            ...initialProfile
          }));
        }
      } catch (e) {
        console.error("Error setting Supabase success profile:", e);
      }
    }
  };

  // Load language from storage
  const [lang, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("finance_bridge_language");
      if (stored && ['fr', 'en', 'pt', 'es', 'de', 'zh'].includes(stored)) {
        return stored as Language;
      }
    } catch {}
    return "fr";
  });

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  };

  // Load profile from localStorage or fallback to customized default
  const [profile, setProfile] = useState<UserProfile>(() => {
    const today = new Date().toISOString().substring(0, 10);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.marketMode) {
          parsed.marketMode = "real";
        }
        if (parsed.learningHearts === undefined) {
          parsed.learningHearts = 4;
        }
        if (parsed.aiMode === undefined) {
          parsed.aiMode = "backend";
        }
        if (parsed.geminiApiKey === undefined) {
          parsed.geminiApiKey = "";
        }
        if (!parsed.lastHeartsResetDate) {
          parsed.lastHeartsResetDate = today;
        } else if (parsed.lastHeartsResetDate !== today) {
          parsed.learningHearts = 4;
          parsed.lastHeartsResetDate = today;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
    }
    return {
      username: "Geoffroy",
      xp: 0,
      level: 1,
      streak: 1,
      lastActive: new Date().toISOString(),
      cash: 10000,
      completedLessons: [],
      portfolio: [],
      transactions: [],
      portfolioHistory: [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
      marketMode: "real",
      learningHearts: 4,
      lastHeartsResetDate: today
    };
  });

  // Load and manage multiple conversations with backward-compatible migration
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const storedConvs = localStorage.getItem("finance_bridge_conversations");
      if (storedConvs) return JSON.parse(storedConvs);

      // Migrating old single chat history if it exists
      const storedLegacy = localStorage.getItem(CHAT_STORAGE_KEY);
      if (storedLegacy) {
        const legacyMsgs = JSON.parse(storedLegacy);
        if (Array.isArray(legacyMsgs) && legacyMsgs.length > 0) {
          const firstUserText = legacyMsgs.find(m => m.sender === 'user')?.text || "";
          const computedTitle = firstUserText 
            ? (firstUserText.length > 25 ? firstUserText.substring(0, 25) + "..." : firstUserText)
            : "Conversation #1";

          return [{
            id: "legacy",
            title: computedTitle,
            messages: legacyMsgs,
            createdAt: new Date().toISOString()
          }];
        }
      }
    } catch (e) {
      console.error("Failed to initialize conversations:", e);
    }

    return [{
      id: "default",
      title: "Conversation #1",
      messages: [],
      createdAt: new Date().toISOString()
    }];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    try {
      const storedActiveId = localStorage.getItem("finance_bridge_active_conv_id");
      if (storedActiveId && storedActiveId !== "undefined") return storedActiveId;
    } catch {}
    return "default";
  });

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0] || {
    id: "default",
    title: "Conversation #1",
    messages: [],
    createdAt: new Date().toISOString()
  };

  const chatHistory = activeConversation.messages;

  // Live stock ticker rates
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [stocksApiSource, setStocksApiSource] = useState<string>("fetching");

  interface StopLossAlert {
    id: string;
    symbol: string;
    shares: number;
    price: number;
    stopLossPrice: number;
    date: string;
  }
  const [stopLossAlerts, setStopLossAlerts] = useState<StopLossAlert[]>([]);

  // Automated stop-loss processing effect
  useEffect(() => {
    let triggeredSales: { symbol: string; shares: number; price: number; stopLossPrice: number }[] = [];

    profile.portfolio.forEach((item) => {
      if (item.stopLoss && item.shares > 0) {
        const currentStock = stocks.find(s => s.symbol === item.symbol);
        if (currentStock && currentStock.price <= item.stopLoss) {
          triggeredSales.push({
            symbol: item.symbol,
            shares: item.shares,
            price: currentStock.price,
            stopLossPrice: item.stopLoss
          });
        }
      }
    });

    if (triggeredSales.length > 0) {
      setProfile((prev) => {
        let nextCash = prev.cash;
        const updatedPortfolio = [...prev.portfolio];
        let newTransactions = [...prev.transactions];
        const newAlerts: StopLossAlert[] = [];

        triggeredSales.forEach((sale) => {
          const matchIdx = updatedPortfolio.findIndex(item => item.symbol === sale.symbol);
          if (matchIdx >= 0) {
            const item = updatedPortfolio[matchIdx];
            const sharesSold = item.shares;
            const saleAmount = sharesSold * sale.price;
            nextCash += saleAmount;
            
            // Remove position
            updatedPortfolio.splice(matchIdx, 1);

            // Create transaction
            const txId = Math.random().toString(36).substring(2, 9).toUpperCase();
            const dateStr = new Date().toLocaleString("fr-FR");
            const stopLossTx = {
              id: txId,
              symbol: sale.symbol,
              type: 'SELL' as const,
              shares: sharesSold,
              price: sale.price,
              date: `${dateStr} (Stop-Loss Déclenché)`
            };
            newTransactions = [stopLossTx, ...newTransactions];

            // Build alert
            newAlerts.push({
              id: txId,
              symbol: sale.symbol,
              shares: sharesSold,
              price: sale.price,
              stopLossPrice: sale.stopLossPrice,
              date: dateStr
            });
          }
        });

        if (newAlerts.length > 0) {
          setStopLossAlerts(prevAlerts => [...newAlerts, ...prevAlerts]);
        }

        return {
          ...prev,
          cash: parseFloat(nextCash.toFixed(2)),
          portfolio: updatedPortfolio,
          transactions: newTransactions
        };
      });
    }
  }, [stocks, profile.portfolio]);

  // Synchronise total assets in the portfolio historical record (portfolioHistory)
  useEffect(() => {
    const totalAssets = profile.cash + profile.portfolio.reduce((sum, item) => {
      const stock = stocks.find(s => s.symbol === item.symbol);
      const currentPrice = stock ? stock.price : item.avgBuyPrice;
      return sum + (item.shares * currentPrice);
    }, 0);

    const todayStr = new Date().toLocaleDateString("fr-FR");
    const roundedAssets = parseFloat(totalAssets.toFixed(2));

    setProfile((prev) => {
      let history = prev.portfolioHistory ? [...prev.portfolioHistory] : [];
      
      if (history.length <= 1) {
        history = [
          { date: "06/06", value: 10000 },
          { date: "07/06", value: 10050 },
          { date: "08/06", value: 9940 },
          { date: "09/06", value: 10120 },
          { date: "10/06", value: 10080 },
          { date: "11/06", value: 10180 },
          { date: todayStr.substring(0, 5), value: roundedAssets }
        ];
        return {
          ...prev,
          portfolioHistory: history
        };
      }

      const lastEntryIdx = history.length - 1;
      const lastEntry = history[lastEntryIdx];
      const normalizedTodayStr = todayStr.substring(0, 5); 

      if (lastEntry.date === normalizedTodayStr || lastEntry.date === todayStr) {
        if (Math.abs(lastEntry.value - roundedAssets) > 0.1) {
          history[lastEntryIdx] = {
            ...lastEntry,
            value: roundedAssets
          };
          return {
            ...prev,
            portfolioHistory: history
          };
        }
      } else {
        return {
          ...prev,
          portfolioHistory: [...history, { date: normalizedTodayStr, value: roundedAssets }]
        };
      }

      return prev;
    });
  }, [stocks, profile.cash, profile.portfolio]);

  // Synchronise stock prices with actual real-life values from Yahoo Finance via server proxy (with client-side fallback for static GitHub Pages)
  useEffect(() => {
    let active = true;
    let isFetching = false;

    const fetchRealStocksClientFallback = async () => {
      try {
        const yahooSymbolsMap: Record<string, string> = {
          AAPL: "AAPL", MSFT: "MSFT", AMZN: "AMZN", NVDA: "NVDA", GOOGL: "GOOGL",
          META: "META", TSLA: "TSLA", NKE: "NKE", DIS: "DIS", MC: "MC.PA",
          OR: "OR.PA", KER: "KER.PA", ASML: "ASML", SAP: "SAP", V: "V", MA: "MA",
          KO: "KO", PEP: "PEP", PG: "PG", WMT: "WMT", COST: "COST", NFLX: "NFLX",
          ADBE: "ADBE", CSCO: "CSCO", SBUX: "SBUX", "TTE.PA": "TTE.PA", "AIR.PA": "AIR.PA"
        };
        
        const uniqueSymbols = Array.from(new Set(Object.values(yahooSymbolsMap)));
        const batchSize = 10;
        const batches: string[][] = [];
        for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
          batches.push(uniqueSymbols.slice(i, i + batchSize));
        }

        const allResults: any[] = [];

        await Promise.all(
          batches.map(async (batch) => {
            const symbolsList = batch.join(",");
            const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbolsList}`;
            
            const proxies = [
              `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
              `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
              `https://cors.lol/?url=${encodeURIComponent(url)}`,
              `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
              url
            ];

            for (const proxyUrl of proxies) {
              try {
                const res = await fetch(proxyUrl);
                if (res.ok) {
                  const data = await res.json();
                  const result = data?.quoteResponse?.result;
                  if (result && Array.isArray(result) && result.length > 0) {
                    allResults.push(...result);
                    return; // Succeeded for this batch!
                  }
                }
              } catch (e) {
                // Try next proxy
              }
            }
          })
        );

        if (allResults.length === 0) {
          console.warn("All proxies failed to fetch quoteResponse in client fallback");
          return;
        }

        const quotesBySymbol = new Map<string, any>();
        for (const quote of allResults) {
          if (quote?.symbol) {
            quotesBySymbol.set(quote.symbol, quote);
          }
        }

        if (active) {
          setStocksApiSource("client-fallback");
          setStocks(prevStocks => {
            return prevStocks.map(stock => {
              const yahooSymbol = yahooSymbolsMap[stock.symbol] || stock.symbol;
              const quote = quotesBySymbol.get(yahooSymbol);
              if (!quote) return stock;

              const price = quote.regularMarketPrice ? parseFloat(quote.regularMarketPrice.toFixed(2)) : null;
              if (price === null) return stock;

              const change = quote.regularMarketChangePercent !== undefined 
                ? parseFloat(quote.regularMarketChangePercent.toFixed(2)) 
                : stock.change;
              const low24h = quote.regularMarketDayLow ? parseFloat(quote.regularMarketDayLow.toFixed(2)) : price;
              const high24h = quote.regularMarketDayHigh ? parseFloat(quote.regularMarketDayHigh.toFixed(2)) : price;
              const volumeNum = quote.regularMarketVolume;

              let volume = "";
              if (volumeNum) {
                if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                else volume = volumeNum.toString();
              }

              const originalStock = INITIAL_STOCKS.find(s => s.symbol === stock.symbol) || stock;
              const scale = price / originalStock.price;
              const history = originalStock.history.map((hPrice) => parseFloat((hPrice * scale).toFixed(2)));

              return {
                ...stock,
                price,
                change,
                low24h,
                high24h,
                volume: volume || stock.volume,
                history
              };
            });
          });
        }
      } catch (err) {
        console.warn("Could not sync real-time stocks from client fallback:", err);
      }
    };

    const fetchRealStocks = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const response = await fetch("/api/stocks");
        if (response.ok) {
          const src = response.headers.get("X-Prices-Source") || "server";
          if (active) setStocksApiSource(src);
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (active && Array.isArray(data) && data.length > 0) {
              setStocks(data);
              isFetching = false;
              return;
            }
          }
        }
        
        // If server API did not return JSON, use client-side fallback
        await fetchRealStocksClientFallback();
      } catch (error) {
        console.warn("Could not sync real-time stocks via server proxy, using client fallback:", error);
        await fetchRealStocksClientFallback();
      } finally {
        isFetching = false;
      }
    };

    fetchRealStocks();
    
    // Periodically fetch live rates from the server every 15 seconds
    const interval = setInterval(fetchRealStocks, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const fetchStockHistory = async (symbol: string) => {
    // Find stock and check if real history (>30 points) has already been fetched
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock || stock.history.length > 30) return;

    try {
      const response = await fetch(`/api/stocks/history/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.history) && data.history.length > 0) {
          setStocks((prevStocks) =>
            prevStocks.map((s) =>
              s.symbol === symbol ? { ...s, history: data.history } : s
            )
          );
        }
      }
    } catch (err) {
      console.warn(`[History Sync] Failed to fetch history for ${symbol}:`, err);
    }
  };

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [parisTime, setParisTime] = useState<any>(() => getZonedDateTime("Europe/Paris"));
  const [nyTime, setNyTime] = useState<any>(() => getZonedDateTime("America/New_York"));
  const [liveDate, setLiveDate] = useState<Date>(() => new Date());

  const isCityMarketOpen = (tz: string, code: string, date: Date): boolean => {
    if (profile.marketMode === 'continuous') return true;
    try {
      const zoned = getZonedDateTime(tz, date);
      const { dayOfWeek, hour, minute } = zoned;
      if (dayOfWeek === 0 || dayOfWeek === 6) return false;
      
      const totalMins = hour * 60 + minute;
      switch (code) {
        case "NYSE": // 09:30 - 16:00
          return totalMins >= (9 * 60 + 30) && totalMins < 16 * 60;
        case "LSE": // 08:00 - 16:30
          return totalMins >= 8 * 60 && totalMins < (16 * 60 + 30);
        case "CAC":
        case "DAX":
        case "SIX": // 09:00 - 17:30
          return totalMins >= 9 * 60 && totalMins < (17 * 60 + 30);
        case "TSE": // 09:00 - 15:00
          return totalMins >= 9 * 60 && totalMins < 15 * 60;
        case "HKEX": // 09:30 - 16:00
          return totalMins >= (9 * 60 + 30) && totalMins < 16 * 60;
        case "SGX": // 09:00 - 17:00
          return totalMins >= 9 * 60 && totalMins < 17 * 60;
        case "DFM": // 10:00 - 15:00
          return totalMins >= 10 * 60 && totalMins < 15 * 60;
        case "NSE": // 09:15 - 15:30
          return totalMins >= (9 * 60 + 15) && totalMins < (15 * 60 + 30);
        case "ASX": // 10:00 - 16:00
          return totalMins >= 10 * 60 && totalMins < 16 * 60;
        default:
          return totalMins >= 9 * 60 && totalMins < 17 * 60;
      }
    } catch {
      return false;
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem("finance_bridge_theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    return "light";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem("finance_bridge_welcome_seen") !== "true";
    } catch {
      return true;
    }
  });
  const [lostStreakInfo, setLostStreakInfo] = useState<{ amount: number } | null>(null);

  const handleSimulateStreakLoss = () => {
    const currentStreak = profile.streak;
    setProfile(prev => ({
      ...prev,
      streak: 1,
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }));
    setLostStreakInfo({ amount: currentStreak > 1 ? currentStreak : 5 });
  };

  const handleCloseWelcomeModal = () => {
    try {
      localStorage.setItem("finance_bridge_welcome_seen", "true");
    } catch {}
    setShowWelcomeModal(false);
  };

  // Sync theme with HTML document class
  useEffect(() => {
    try {
      localStorage.setItem("finance_bridge_theme", theme);
    } catch {}
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Update streak on mount based on last active day
  useEffect(() => {
    const todayStr = new Date().toISOString().substring(0, 10);
    const lastActiveStr = profile.lastActive ? profile.lastActive.substring(0, 10) : null;
    
    if (lastActiveStr !== todayStr) {
      let isLost = false;
      let oldStreakVal = 1;

      setProfile(prev => {
        let newStreak = prev.streak || 1;
        if (lastActiveStr) {
          const lastActiveDate = new Date(lastActiveStr + "T00:00:00");
          const todayDate = new Date(todayStr + "T00:00:00");
          const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            if (prev.streak > 1) {
              isLost = true;
              oldStreakVal = prev.streak;
            }
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
        
        if (isLost) {
          setTimeout(() => {
            setLostStreakInfo({ amount: oldStreakVal });
          }, 800);
        }
        
        return {
          ...prev,
          streak: newStreak,
          lastActive: new Date().toISOString()
        };
      });
    }
  }, []);

  // Save profile to storage and Supabase whenever it updates
  useEffect(() => {
    if (authUser && !authUser.isGuest) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const saveToSupabase = async () => {
          try {
            await supabase.from("profiles" as any).upsert({
              id: authUser.uid,
              username: profile.username,
              xp: profile.xp,
              level: profile.level,
              streak: profile.streak,
              cash: profile.cash,
              completed_lessons: profile.completedLessons,
              portfolio: profile.portfolio,
              transactions: profile.transactions,
              portfolio_history: profile.portfolioHistory,
              marketMode: profile.marketMode,
              learning_hearts: profile.learningHearts,
              last_hearts_reset_date: profile.lastHeartsResetDate,
              updated_at: new Date().toISOString()
            } as any);
          } catch (error) {
            console.error("Error saving profile to Supabase:", error);
          }
        };
        saveToSupabase();
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, authUser]);

  // Save conversations to storage
  useEffect(() => {
    try {
      localStorage.setItem("finance_bridge_conversations", JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  // Save active conversation id
  useEffect(() => {
    try {
      localStorage.setItem("finance_bridge_active_conv_id", activeConversationId);
    } catch {}
  }, [activeConversationId]);

  // Real-time clock to show UTC/Live feedback
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveDate(now);
      setCurrentTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setParisTime(getZonedDateTime("Europe/Paris", now));
      setNyTime(getZonedDateTime("America/New_York", now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic visual Stock tick adjustments to simulate live trading hours
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Check if market is currently open for this stock
          const isStockOpen = isMarketOpenForStock(stock.symbol, profile.marketMode || "real");
          if (!isStockOpen) {
            return stock; // Freeze position changes when market is closed
          }

          // Volatility factor based on ticker: higher for COIN/TSLA, lower for MSFT/AAPL
          const volFactor = stock.symbol === "COIN" ? 0.015 : stock.symbol === "TSLA" ? 0.012 : 0.006;
          const percentageMove = (Math.random() - 0.49) * 2 * volFactor; // slight upward drift
          const rawNewPrice = stock.price * (1 + percentageMove);
          const newPrice = parseFloat(rawNewPrice.toFixed(2));

          // Today change recalculating
          const todayDelta = percentageMove * 100 + stock.change;
          const cappedDelta = parseFloat(Math.min(15, Math.max(-15, todayDelta)).toFixed(2));

          // Update the last element of the 30-day history (today's live price)
          // instead of shifting and sliding the array. Shifting would discard daily close data
          // and cause visual snapping when the 15-second Yahoo Finance sync scales the base history.
          const newHistory = [...stock.history];
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = newPrice;
          }

          return {
            ...stock,
            price: newPrice,
            change: cappedDelta,
            history: newHistory,
            low24h: newPrice < stock.low24h ? newPrice : stock.low24h,
            high24h: newPrice > stock.high24h ? newPrice : stock.high24h,
          };
        })
      );
    }, 5000);

    return () => clearInterval(tickInterval);
  }, [profile.marketMode]);

  // Trade engine function
  const handleTrade = (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number, stopLoss?: number | null) => {
    const totalCost = shares * price;

    setProfile((prev) => {
      const nextCash = type === 'BUY' ? prev.cash - totalCost : prev.cash + totalCost;
      const updatedPortfolio = [...prev.portfolio];
      const matchIdx = updatedPortfolio.findIndex((item) => item.symbol === symbol);

      if (type === 'BUY') {
        if (matchIdx >= 0) {
          const item = updatedPortfolio[matchIdx];
          const combinedShares = item.shares + shares;
          const combinedAvgPrice = ((item.shares * item.avgBuyPrice) + (shares * price)) / combinedShares;
          updatedPortfolio[matchIdx] = {
            symbol,
            shares: combinedShares,
            avgBuyPrice: parseFloat(combinedAvgPrice.toFixed(2)),
            stopLoss: stopLoss !== undefined ? (stopLoss || undefined) : item.stopLoss
          };
        } else {
          updatedPortfolio.push({
            symbol,
            shares,
            avgBuyPrice: price,
            stopLoss: stopLoss || undefined
          });
        }
      } else {
        // SELL
        if (matchIdx >= 0) {
          const item = updatedPortfolio[matchIdx];
          if (item.shares === shares) {
            updatedPortfolio.splice(matchIdx, 1);
          } else {
            updatedPortfolio[matchIdx] = {
              ...item,
              shares: item.shares - shares
            };
          }
        }
      }

      const txId = Math.random().toString(36).substring(2, 9).toUpperCase();
      const newTransaction = {
        id: txId,
        symbol,
        type,
        shares,
        price,
        date: new Date().toLocaleString("fr-FR")
      };

      return {
        ...prev,
        cash: parseFloat(nextCash.toFixed(2)),
        portfolio: updatedPortfolio,
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  };

  const handleUpdateStopLoss = (symbol: string, stopLoss?: number | null) => {
    setProfile((prev) => {
      const updatedPortfolio = prev.portfolio.map((item) => {
        if (item.symbol === symbol) {
          return {
            ...item,
            stopLoss: stopLoss || undefined
          };
        }
        return item;
      });
      return {
        ...prev,
        portfolio: updatedPortfolio
      };
    });
  };

  // Completion criteria for Duolingo lessons
  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    setProfile((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev; // avoid double rewards

      const nextXp = prev.xp + xpReward;
      // Formula for level progression: level threshold is level * 250 XP
      const getThreshold = (lvl: number) => lvl * 250;
      let nextLevel = prev.level;
      while (nextXp >= getThreshold(nextLevel)) {
        nextLevel += 1;
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  };

  const handleUpdateHearts = (hearts: number) => {
    setProfile((prev) => ({
      ...prev,
      learningHearts: hearts,
    }));
  };

  // Gemini AI Chat integration
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    // Find the current messages
    const currentConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
    const originalMessages = currentConv ? currentConv.messages : [];

    // Check if it's the very first user message we send in this conversation
    const isFirstUserMsg = !originalMessages.some(m => m.sender === 'user');
    
    // Updates
    const updatedUserMessages = [...originalMessages, userMsg];

    setConversations((prev) => 
      prev.map((c) => {
        if (c.id === (currentConv ? currentConv.id : activeConversationId)) {
          let updatedTitle = c.title;
          if (isFirstUserMsg) {
            updatedTitle = text.length > 25 ? text.substring(0, 25).trim() + "..." : text;
          }
          return {
            ...c,
            title: updatedTitle,
            messages: updatedUserMessages
          };
        }
        return c;
      })
    );
    setIsGenerating(true);

    const isGitHubPages = window.location.hostname.endsWith("github.io");
    const isVercel = window.location.hostname.includes("vercel.app");
    // Ensure that Vite's build-time search-and-replace matches these exactly, without any optional chaining (?) that would prevent substitution
    const envGeminiKey = 
      ((import.meta as any).env || {}).VITE_GEMINI_API_KEY || 
      process.env.VITE_GEMINI_API_KEY || 
      process.env.GEMINI_API_KEY || 
      "";
    const useClientSide = profile.aiMode === "client" || isGitHubPages || isVercel || !!envGeminiKey;

    try {
      let response: Response;

      if (useClientSide) {
        const apiKey = (profile.geminiApiKey && profile.geminiApiKey.trim()) || (envGeminiKey && envGeminiKey.trim());
        if (!apiKey) {
          throw new Error("CLIENT_KEY_MISSING");
        }

        const systemInstruction = `Vous êtes "Finance Bridge AI", un assistant financier virtuel de haute performance et hautement pédagogue. Vos rôles :
1. Aider et guider les utilisateurs dans l'apprentissage de l'investissement en bourse.
2. Expliquer de manière simple, claire et accessible les concepts financiers (valeur refuge, dividende, PE Ratio, volatilité, ETF, obligations, ordres au marché/limite).
3. Rendre la bourse engageante, amusante et décomplexée pour les débutants.
4. Ajouter un court rappel à la fin si des conseils d'achat d'actions spécifiques sont demandés ("Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels.").

Veuillez répondre exclusivement en français. Soyez chaleureux et encourageant, comme l'oiseau de Duolingo de la finance. Rédigez des réponses bien espacées en Markdown avec de jolies listes à puces.`;

        const contents: any[] = [];
        if (updatedUserMessages.length > 1) {
          // Add context up to 10 previous messages
          updatedUserMessages.slice(-11, -1).forEach((msg) => {
            contents.push({
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.text }]
            });
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: text }]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`;
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.7
            }
          })
        });
      } else {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: updatedUserMessages.slice(-10) // provide context of past 10 exchanges
          })
        });
      }

      if (!response.ok) {
        throw new Error("L'API a retourné un statut invalide.");
      }

      const initialAiReply: ChatMessage = {
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };

      // Put placeholder in state immediately
      setConversations((prev) => 
        prev.map((c) => {
          if (c.id === (currentConv ? currentConv.id : activeConversationId)) {
            return {
              ...c,
              messages: [...updatedUserMessages, initialAiReply]
            };
          }
          return c;
        })
      );

      const contentType = response.headers.get("content-type");
      if (contentType && (contentType.includes("text/event-stream") || contentType.includes("application/json"))) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) throw new Error("Impossible de lire le flux de réponse.");

        let streamingText = "";
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // Handle standard SSE line or raw line
            let dataStr = trimmed;
            if (trimmed.startsWith("data: ")) {
              dataStr = trimmed.substring(6).trim();
            } else if (trimmed.startsWith("data:")) {
              dataStr = trimmed.substring(5).trim();
            } else {
              // Might be a direct JSON chunk in some streaming environments
              if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
                continue;
              }
            }

            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              let textChunk = "";
              if (parsed.text) {
                textChunk = parsed.text;
              } else if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
                textChunk = parsed.candidates[0].content.parts[0].text;
              }

              if (textChunk) {
                streamingText += textChunk;
                setConversations((prev) => 
                  prev.map((c) => {
                    if (c.id === (currentConv ? currentConv.id : activeConversationId)) {
                      return {
                        ...c,
                        messages: [...updatedUserMessages, {
                          sender: 'ai',
                          text: streamingText,
                          timestamp: initialAiReply.timestamp
                        }]
                      };
                    }
                    return c;
                  })
                );
              } else if (parsed.error) {
                throw new Error(parsed.error?.message || JSON.stringify(parsed.error));
              }
            } catch (err) {
              // Non-fatal parse issue or incomplete chunk, can be ignored
            }
          }
        }
      } else {
        const data = await response.json();
        let fallbackText = "Pardon, je n'ai pas pu analyser la question.";
        if (data.text) {
          fallbackText = data.text;
        } else if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          fallbackText = data.candidates[0].content.parts[0].text;
        }
        setConversations((prev) => 
          prev.map((c) => {
            if (c.id === (currentConv ? currentConv.id : activeConversationId)) {
              return {
                ...c,
                messages: [...updatedUserMessages, {
                  sender: 'ai',
                  text: fallbackText,
                  timestamp: initialAiReply.timestamp
                }]
              };
            }
            return c;
          })
        );
      }
    } catch (e: any) {
      console.error(e);
      let errMsg = "Oups ! Je rencontre un problème technique temporaire pour interroger Gemini AI. Veuillez vérifier que votre clé GEMINI_API_KEY est bien renseignée dans le panel Secrets de l'application.";
      if (e.message === "CLIENT_KEY_MISSING") {
        errMsg = lang === "fr"
          ? "Bienvenue sur la version statique de Finance Bridge (publiée sur GitHub Pages) ! 🚀\n\nPour pouvoir échanger avec le Conseiller IA, vous devez simplement renseigner votre clé API Gemini personnelle (gratuite et hautement sécurisée) dans l'onglet de Configuration ⚙️ en haut à droite de l'application.\n\n*Note : Votre clé reste conservée uniquement dans votre navigateur local (localStorage) et n'est jamais transmise à aucun tiers.*"
          : "Welcome to the static GitHub Pages version of Finance Bridge! 🚀\n\nTo interact with the AI Advisor, you just need to provide your personal Gemini API Key (free and highly secure) in the Configuration tab ⚙️ at the top right of the application.\n\n*Note: Your key is saved strictly in your local browser storage (localStorage) and is never shared with any third-party.*";
      } else if (useClientSide) {
        errMsg = lang === "fr"
          ? "Erreur de connexion directe à Gemini. Veuillez vérifier la validité de votre clé API Gemini personnelle renseignée dans les options de configuration ⚙️."
          : "Failed to connect to the Gemini API directly. Please verify the validity of your personal Gemini API Key provided in your configuration ⚙️.";
      }
      const errReply: ChatMessage = {
        sender: 'ai',
        text: errMsg,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };
      setConversations((prev) => 
        prev.map((c) => {
          if (c.id === (currentConv ? currentConv.id : activeConversationId)) {
            return {
              ...c,
              messages: [...updatedUserMessages, errReply]
            };
          }
          return c;
        })
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleCreateConversation = () => {
    const newId = "conv_" + Math.random().toString(36).substring(2, 9);
    const count = conversations.length + 1;
    const localizedTitle = `${t("newConversationTitle")} #${count}`;
    const newConv: Conversation = {
      id: newId,
      title: localizedTitle,
      messages: [],
      createdAt: new Date().toISOString()
    };
    setConversations((prev) => [...prev, newConv]);
    setActiveConversationId(newId);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      setConversations([{
        id: "default",
        title: `${t("newConversationTitle")} #1`,
        messages: [],
        createdAt: new Date().toISOString()
      }]);
      setActiveConversationId("default");
      return;
    }

    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        const remainingActive = filtered[0]?.id || "default";
        setActiveConversationId(remainingActive);
      }
      return filtered;
    });
  };

  const isParisOpen = isMarketOpenForType("EU", profile.marketMode || "real");
  const isNyOpen = isMarketOpenForType("US", profile.marketMode || "real");

  if (authLoading) {
    return (
      <div id="finance-bridge-auth-loading-screen" className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-505 border-indigo-500 border-t-teal-400 rounded-full animate-spin" />
          <h1 className="text-xl font-black tracking-wider text-slate-100 uppercase">FINANCE BRIDGE</h1>
          <p className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">Synchronisation Cloud en cours...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <AuthScreen
        t={t}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-250 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans selection:bg-indigo-500 selection:text-white`}>
      {/* Top Banner Header layout */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white">
        {/* Infinite Scrolling Timezone Ticker */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 py-2.5 overflow-hidden relative select-none text-[11px] font-medium tracking-wide text-white !text-white">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee-tz flex items-center gap-12 whitespace-nowrap">
            {[...TICKER_CITIES, ...TICKER_CITIES, ...TICKER_CITIES].map((city, idx) => {
              const isOpen = isCityMarketOpen(city.tz, city.code, liveDate);
              const zoned = getZonedDateTime(city.tz, liveDate);
              return (
                <div key={idx} className="flex items-center gap-2.5 !text-white hover:!text-white transition duration-150 cursor-pointer shrink-0">
                  <span className="text-sm">{city.emoji}</span>
                  <span className="font-bold !text-white">{city.name}</span>
                  <span className="font-mono bg-slate-800 !text-white px-2 py-0.5 rounded font-extrabold text-[10.5px] tracking-normal">
                    {zoned ? zoned.timeString : "--:--:--"}
                  </span>
                  <span className="text-[9.5px] font-bold !text-white font-mono tracking-wider">({city.code})</span>
                  {isOpen ? (
                    <span className="flex items-center gap-1 text-[9px] font-extrabold !text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      {t("marketOpenShort")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-extrabold !text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      {t("marketClosedShort")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Infinite Scrolling Stocks Ticker */}
        <div className="bg-slate-900 border-b border-slate-800/50 py-2.5 overflow-hidden relative select-none text-[11px] font-medium tracking-wide text-white !text-white">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee-stocks flex items-center gap-12 whitespace-nowrap">
            {(() => {
              const importantSymbols = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN", "META", "BTC", "ETH"];
              const filteredStocksForTicker = stocks.filter(s => importantSymbols.includes(s.symbol));
              const displayStocks = filteredStocksForTicker.length > 0 ? filteredStocksForTicker : stocks.slice(0, 8);
              return [...displayStocks, ...displayStocks, ...displayStocks].map((stock, idx) => {
                const isPos = stock.change >= 0;
                return (
                  <div key={idx} className="flex items-center gap-2.5 !text-white hover:!text-white transition duration-150 cursor-pointer shrink-0">
                    <span className="font-black !text-white font-mono text-xs">{stock.symbol}</span>
                    <span className="!text-white text-[10px] hidden sm:inline max-w-[100px] truncate">{stock.name}</span>
                    <span className="font-mono bg-slate-800 !text-white px-2 py-0.5 rounded font-extrabold text-[10.5px]">
                      {stock.price.toFixed(2)} $
                    </span>
                    {isPos ? (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold !text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                        ▲ +{stock.change.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold !text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                        ▼ {stock.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md font-bold py-1 px-1">
              <FinanceBridgeLogo className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5 font-sans">
                Finance Bridge
              </h1>
              <span className="text-[10px] text-slate-400 block tracking-wide uppercase font-semibold">{t("motto")}</span>
            </div>
          </div>

          {/* Quick status board details */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* User credentials */}
            <div className="flex items-center gap-2.5 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700/50">
              <span className="font-extrabold text-slate-200">{profile.username}</span>
              <span className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1" title={`${profile.streak} ${t("streakSuffix")}`}>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="font-mono text-amber-400 font-extrabold">{profile.streak}</span>
              </div>
              <span className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-indigo-300 font-extrabold">{t("level")} {profile.level}</span>
              </div>
            </div>

            {/* Settings Button & Theme Popover Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-xl transition-all border cursor-pointer flex items-center justify-center ${
                  isSettingsOpen 
                    ? "bg-indigo-600 border-indigo-500 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
                }`}
                title={t("configTitle")}
                id="app-settings-toggle"
              >
                <Settings className={`w-4 h-4 ${isSettingsOpen ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-50 text-slate-800 dark:text-slate-100 animate-in fade-in duration-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{t("configTitle")}</span>
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      {t("close")}
                    </button>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {t("languageLabel")}
                    </label>
                    <select
                      value={lang}
                      onChange={(e) => {
                        const selected = e.target.value as Language;
                        setLang(selected);
                        try {
                          localStorage.setItem("finance_bridge_language", selected);
                        } catch {}
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme Switcher Layout */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("themeLabel")}</label>
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          theme === "light"
                            ? "bg-white text-indigo-650 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250"
                        }`}
                      >
                        <Sun className={`w-3.5 h-3.5 ${theme === "light" ? "text-amber-500" : ""}`} />
                        <span>{t("themeLight")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          theme === "dark"
                            ? "bg-slate-800 text-indigo-400 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        <Moon className={`w-3.5 h-3.5 ${theme === "dark" ? "text-indigo-400" : ""}`} />
                        <span>{t("themeDark")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Username editing */}
                  <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("investorNameLabel")}</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-white font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      placeholder={t("placeholderName")}
                    />
                  </div>

                  {/* Market Simulation Mode Selector */}
                  <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {t("marketModeLabel")}
                    </label>
                    <select
                      value={profile.marketMode || "real"}
                      onChange={(e) => {
                        const val = e.target.value as "real" | "continuous";
                        setProfile((prev) => ({ ...prev, marketMode: val }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-white font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="real">⏱️ {t("marketModeReal")}</option>
                      <option value="continuous">⚡ {t("marketModeContinuous")}</option>
                    </select>
                  </div>


                  {/* Reset Local Progress Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const btn = document.getElementById("local-reset-btn");
                        if (btn) {
                          if (btn.getAttribute("data-confirm") === "yes") {
                            // Perform reset
                            const today = new Date().toISOString().substring(0, 10);
                            const resetProfile: UserProfile = {
                              username: profile.username || "Geoffroy",
                              xp: 0,
                              level: 1,
                              streak: 1,
                              lastActive: new Date().toISOString(),
                              cash: 10000,
                              completedLessons: [],
                              portfolio: [],
                              transactions: [],
                              portfolioHistory: [{ date: new Date().toLocaleDateString("fr-FR"), value: 10000 }],
                              marketMode: "real",
                              learningHearts: 4,
                              lastHeartsResetDate: today,
                              aiMode: profile.aiMode,
                              geminiApiKey: profile.geminiApiKey
                            };
                            setProfile(resetProfile);
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProfile));
                            
                            btn.setAttribute("data-confirm", "no");
                            btn.innerHTML = `<span>✔ ${lang === "fr" ? "Réinitialisé !" : "Reset Success!"}</span>`;
                            setTimeout(() => {
                              const icn = lang === "fr" ? "Réinitialiser la progression" : "Reset Progress";
                              btn.innerHTML = `<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg><span>${icn}</span>`;
                            }, 2000);
                          } else {
                            // First click
                            btn.setAttribute("data-confirm", "yes");
                            btn.innerHTML = `<span>⚠️ ${lang === "fr" ? "Confirmer ? Re-cliquez" : "Confirm? Click again"}</span>`;
                            setTimeout(() => {
                              if (btn.getAttribute("data-confirm") === "yes") {
                                btn.setAttribute("data-confirm", "no");
                                const icn = lang === "fr" ? "Réinitialiser la progression" : "Reset Progress";
                                btn.innerHTML = `<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg><span>${icn}</span>`;
                              }
                            }, 4000);
                          }
                        }
                      }}
                      id="local-reset-btn"
                      data-confirm="no"
                      className="w-full py-2 px-3 focus:outline-hidden rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-black tracking-wide uppercase transition flex items-center justify-center gap-2 cursor-pointer mb-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === "fr" ? "Réinitialiser la progression" : "Reset Progress"}</span>
                    </button>
                  </div>

                  {/* Sign Out Button */}
                  {authUser && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const supabase = getSupabaseClient();
                            if (supabase) {
                              await supabase.auth.signOut();
                            }
                          } catch (err) {
                            console.error("Error logging out from Supabase:", err);
                          }
                          localStorage.removeItem("finance_bridge_auth_mode");
                          setAuthUser(null);
                        }}
                        className="w-full py-2 px-3 focus:outline-hidden rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black tracking-wide uppercase transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === "fr" ? "Se déconnecter" : "Sign Out"}</span>
                      </button>
                    </div>
                  )}

                  {/* Delete Account Button */}
                  {authUser && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                      <button
                        type="button"
                        id="delete-account-btn"
                        data-confirm="no"
                        onClick={async () => {
                          const btn = document.getElementById("delete-account-btn");
                          if (btn) {
                            if (btn.getAttribute("data-confirm") === "yes") {
                              // Perform deletion
                              try {
                                const supabase = getSupabaseClient();
                                if (supabase) {
                                  await supabase.from("profiles").delete().eq("id", authUser.uid);
                                  await supabase.auth.signOut();
                                }
                              } catch (err) {
                                console.error("Error deleting Supabase profile:", err);
                              }
                              localStorage.removeItem("finance_bridge_auth_mode");
                              localStorage.removeItem(STORAGE_KEY);
                              setAuthUser(null);
                              btn.setAttribute("data-confirm", "no");
                              btn.innerHTML = `<span>✔ ${lang === "fr" ? "Compte supprimé !" : "Account Deleted!"}</span>`;
                            } else {
                              // First click
                              btn.setAttribute("data-confirm", "yes");
                              btn.innerHTML = `<span>⚠️ ${lang === "fr" ? "Confirmer la suppression ?" : "Confirm Deletion?"}</span>`;
                              setTimeout(() => {
                                if (btn.getAttribute("data-confirm") === "yes") {
                                  btn.setAttribute("data-confirm", "no");
                                  const label = lang === "fr" ? "Supprimer mon compte" : "Delete My Account";
                                  btn.innerHTML = `<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg><span>${label}</span>`;
                                }
                              }, 4000);
                            }
                          }
                        }}
                        className="w-full py-2 px-3 focus:outline-hidden rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-black tracking-wide uppercase transition flex items-center justify-center gap-2 cursor-pointer mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === "fr" ? "Supprimer mon compte" : "Delete My Account"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Primary tabs navigations panel inside wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {stopLossAlerts.length > 0 && (
          <div className="space-y-3">
            {stopLossAlerts.map((alert) => (
              <div key={alert.id} className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                <span className="p-1.5 bg-rose-105 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 rounded-lg shrink-0 text-xs">🔔</span>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-extrabold text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                    Stop-Loss Déclenché Automatiquement !
                    <span className="font-normal font-mono text-[10px] text-rose-400 dark:text-rose-400">({alert.date})</span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Vos <strong>{alert.shares}</strong> actions <strong>{alert.symbol}</strong> ont été vendues automatiquement à un cours de <strong>{alert.price.toFixed(2)} $</strong> suite au franchissement de votre seuil boursier de protection fixé à <strong>{alert.stopLossPrice.toFixed(2)} $</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setStopLossAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-full text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition shrink-0 cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Navigation Selector Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "dashboard"
                ? "bg-slate-990 bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <span>{t("tabDashboard")}</span>
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "simulator"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>{t("tabSimulator")}</span>
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "portfolio"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>{t("tabPortfolio")}</span>
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "learning"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{t("tabLearning")}</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "notes"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>{t("tabNotes")}</span>
          </button>
          <button
            onClick={() => setActiveTab("advisor")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "advisor"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span>{t("tabAdvisor")}</span>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 cursor-pointer duration-100 ${
              activeTab === "news"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Newspaper className="w-4 h-4 shrink-0" />
            <span>{t("tabNews")}</span>
          </button>
        </div>

        {/* Tab display pane */}
        <div className="focus-mode-view">
          {activeTab === "dashboard" && (
            <DashboardTab
              profile={profile}
              stocks={stocks}
              setTab={setActiveTab}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === "simulator" && (
            <SimulatorTab
              stocks={stocks}
              profile={profile}
              onTrade={handleTrade}
              onUpdateStopLoss={handleUpdateStopLoss}
              lang={lang}
              t={t}
              onSelectStock={fetchStockHistory}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioTab
              stocks={stocks}
              profile={profile}
              onTrade={handleTrade}
              onUpdateStopLoss={handleUpdateStopLoss}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === "learning" && (
            <LearningTab
              modules={LESSON_MODULES}
              profile={profile}
              onCompleteLesson={handleCompleteLesson}
              onUpdateHearts={handleUpdateHearts}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === "notes" && (
            <NotesTab
              profile={profile}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === "advisor" && (
            <AiAdvisorTab
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              lang={lang}
              t={t}
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onCreateConversation={handleCreateConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          )}

          {activeTab === "news" && (
            <NewsTab
              lang={lang}
              t={t}
            />
          )}
        </div>
      </main>

      {/* Footer Disclaimer and Credits */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
        <p className="font-semibold text-slate-500 dark:text-slate-400 font-sans text-[11px] uppercase tracking-wider">
          Finance Bridge — La clé de l'éducation boursière
        </p>
        <p className="max-w-xl mx-auto px-4 leading-relaxed">
          Simulations de bourse avec valeurs actualisées sous fortes variations. L'IA de l'application utilise l'intelligence artificielle pour simplifier la pédagogie financière sans conseil direct.
        </p>
      </footer>

      {/* Welcome Modal Dialog for First-Time Users */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              onClick={handleCloseWelcomeModal}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-y-auto max-h-[90vh] text-slate-850 dark:text-slate-100"
            >
              {/* Header */}
              <div className="text-center space-y-3 mb-8">
                <div className="w-18 h-18 mx-auto bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce duration-1000 py-1.5 px-1.5">
                  <FinanceBridgeLogo className="w-14 h-14" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {t("welcomeModalTitle")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {t("welcomeModalSubtitle")}
                </p>
              </div>

              {/* Grid of 4 Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Feature 1 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/30 border border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-100/50 dark:hover:bg-slate-950/60 transition-all duration-150">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {t("welcomeModalFeature1Title")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("welcomeModalFeature1Desc")}
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/30 border border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-100/50 dark:hover:bg-slate-950/60 transition-all duration-150">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {t("welcomeModalFeature2Title")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("welcomeModalFeature2Desc")}
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/30 border border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-100/50 dark:hover:bg-slate-950/60 transition-all duration-150">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {t("welcomeModalFeature3Title")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("welcomeModalFeature3Desc")}
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/30 border border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-100/50 dark:hover:bg-slate-950/60 transition-all duration-150">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {t("welcomeModalFeature4Title")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t("welcomeModalFeature4Desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleCloseWelcomeModal}
                  className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
                >
                  {t("welcomeModalButton")}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {lostStreakInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              onClick={() => setLostStreakInfo(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center z-10"
              id="streak-lost-modal"
            >
              {/* Ash/Spark Simulation Particles floating up */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-2 h-2 bg-slate-400 rounded-full animate-ping" />
                <div className="absolute top-20 right-12 w-3 h-3 bg-slate-500 rounded-full animate-bounce duration-1000" />
                <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
              </div>

              {/* Spectacular animated Dying Flame graphics */}
              <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
                {/* Wind slash animations overlay */}
                <motion.div
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ 
                    x: [ -50, 50, -50 ], 
                    opacity: [ 0, 0.8, 0 ],
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute w-12 h-0.5 bg-sky-200 dark:bg-sky-950/50 rounded-full top-1/2 left-0 z-20 pointer-events-none"
                />
                <motion.div
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ 
                    x: [ 50, -50, 50 ], 
                    opacity: [ 0, 0.6, 0 ],
                  }}
                  transition={{ 
                    duration: 2.5, 
                    delay: 0.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute w-8 h-0.5 bg-sky-100 dark:bg-sky-900/40 rounded-full top-1/3 right-0 z-20 pointer-events-none"
                />

                {/* Smoke particles rising upwards */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, x: 0, opacity: 0.8, scale: 0.5 }}
                    animate={{ 
                      y: -65, 
                      x: Math.sin(i * 1.5) * 15 + (Math.random() - 0.5) * 8,
                      opacity: 0, 
                      scale: [0.5, 1.3, i === 2 ? 1.8 : 1.5] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      delay: i * 0.4, 
                      repeat: Infinity, 
                      ease: "easeOut" 
                    }}
                    className="absolute bottom-3 w-3 h-3 bg-slate-400 dark:bg-slate-500 rounded-full blur-[3px] pointer-events-none mix-blend-screen"
                  />
                ))}

                {/* Sputtering and sparks representation */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`spark-${i}`}
                    initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                    animate={{ 
                      y: (Math.random() - 0.6) * 40 - 15, 
                      x: (Math.random() - 0.5) * 50, 
                      opacity: 0, 
                      scale: 0.25 
                    }}
                    transition={{ 
                      duration: 1.1, 
                      delay: i * 0.5, 
                      repeat: Infinity 
                    }}
                    className="absolute bottom-6 w-1 h-1 bg-amber-500 rounded-full pointer-events-none"
                  />
                ))}

                {/* Dying Flame Shape */}
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-20 h-20 relative z-10 filter drop-shadow-md"
                  initial={{ scale: 1.05 }}
                  animate={{ 
                    scale: [0.95, 1.05, 0.95],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 1.6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <defs>
                    <linearGradient id="coldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                  </defs>
                  
                  {/* Backdrop grey shadow */}
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    className="fill-slate-100 dark:fill-slate-900 opacity-30"
                  />

                  {/* Flame shape colored cold slate grey */}
                  <path
                    d="M12 2C9.5 6.5 6 10 6 13.5A6 6 0 0018 13.5C18 10 14.5 6.5 12 2z"
                    fill="url(#coldGradient)"
                    className="stroke-slate-300 dark:stroke-slate-700 stroke-0.5"
                  />

                  {/* Remains of a small orange embers inside */}
                  <motion.path
                    d="M12 11.5c-0.6 1.1-1.5 1.8-1.5 2.5a1.5 1.5 0 003 0c0-0.7-0.9-1.4-1.5-2.5z"
                    fill="#f97316"
                    animate={{ 
                      scale: [1, 0, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ duration: 2.0, repeat: Infinity }}
                  />
                </motion.svg>
              </div>

              {/* Title and subtitle */}
              <div className="space-y-3 mt-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider border border-slate-200/55 dark:border-slate-800">
                  🔥 {lostStreakInfo.amount} {lostStreakInfo.amount > 1 ? t("days") : t("daySingle")} {t("activitySeries")}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans">
                  {t("streakLostTitle")}
                </h3>
                
                <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  {t("streakLostSubtitle")}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 my-2 text-center text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  {t("streakLostDesc").replace("{streak}", lostStreakInfo.amount.toString())}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("learning");
                    setLostStreakInfo(null);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-650 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition duration-150 hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t("streakLostButton")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLostStreakInfo(null)}
                  className="w-full py-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-xs transition duration-100 cursor-pointer"
                >
                  {t("close")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
