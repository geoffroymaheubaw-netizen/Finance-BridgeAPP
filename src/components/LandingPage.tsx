import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Bot, 
  BookOpen, 
  Newspaper, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  Award, 
  ChevronRight,
  Activity,
  Globe,
  Lock,
  GraduationCap
} from "lucide-react";
import FinanceBridgeLogo from "./FinanceBridgeLogo";

interface LandingPageProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onStartGuest?: () => void;
}

export default function LandingPage({ onOpenAuth, onStartGuest }: LandingPageProps) {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features = [
    {
      icon: BarChart3,
      badge: "SIMULATEUR TEMPS RÉEL",
      title: "Trading Virtuel Ultra-Réaliste",
      description: "Passez des ordres d'Achat, Vente et Stop-Loss avec un capital virtuel de 10 000 $ sur les plus grandes actions mondiales (AAPL, NVDA, LVMH, CAC 40, Crypto).",
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-400"
    },
    {
      icon: Bot,
      badge: "MENTOR IA GEMINI",
      title: "Conseiller Financier IA 24/7",
      description: "Posez toutes vos questions à l'IA Gemini. Obtenez une analyse personnalisée de votre portefeuille, des explications claires et des stratégies de gestion du risque.",
      color: "from-indigo-500 to-purple-600",
      accent: "text-purple-400"
    },
    {
      icon: GraduationCap,
      badge: "ACADÉMIE LUDIQUE",
      title: "Formations & Quiz de Niveau",
      description: "Progresse pas à pas avec des leçons interactives, débloque des points d'expérience (XP), monte en niveau et conserve ta série quotidienne d'apprentissage.",
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400"
    },
    {
      icon: Newspaper,
      badge: "FLUX & BLOC-NOTES",
      title: "Actualités & Prise de Notes",
      description: "Restez informé en direct des actualités boursières mondiales et notez vos observations d'analyse technique dans votre journal d'investisseur.",
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400"
    }
  ];

  const marketTickers = [
    { symbol: "S&P 500", val: "5 480.20", change: "+0.85%", pos: true },
    { symbol: "NASDAQ", val: "17 320.10", change: "+1.24%", pos: true },
    { symbol: "CAC 40", val: "7 620.45", change: "-0.15%", pos: false },
    { symbol: "AAPL", val: "$224.50", change: "+1.80%", pos: true },
    { symbol: "NVDA", val: "$128.90", change: "+3.25%", pos: true },
    { symbol: "BTC/USD", val: "$64 250", change: "+2.10%", pos: true },
  ];

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="landing-page-container" className="min-h-screen bg-[#070b18] text-white font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden antialiased">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />

      {/* Top Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#070b18]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-xl shadow-indigo-600/30">
              <div className="w-full h-full bg-[#0b1021] rounded-[14px] flex items-center justify-center">
                <FinanceBridgeLogo className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white" style={{ color: "#ffffff" }}>Finance Bridge</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO TERMINAL
                </span>
              </div>
              <p className="text-[10px] text-white font-mono tracking-wider uppercase" style={{ color: "#ffffff" }}>Éducation & Simulation Boursière</p>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            <a href="#academy" onClick={scrollToSection("academy")} className="hover:text-indigo-400 transition cursor-pointer">Académie</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              Se connecter
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
              style={{ color: "#ffffff" }}
            >
              <span>Créer un compte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Live Ticker Banner */}
      <div className="bg-[#0b1021] border-b border-slate-800/80 py-2.5 overflow-hidden select-none flex items-center">
        <div className="shrink-0 z-10 bg-[#0b1021] pl-4 pr-5 py-0.5 border-r border-slate-800/80 flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-white" style={{ color: "#ffffff" }}>MARCHÉS EN DIRECT (SIMULATION) :</span>
          <span className="sm:hidden text-white" style={{ color: "#ffffff" }}>EN DIRECT :</span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-stocks flex items-center gap-6 pl-6 text-xs font-mono">
            {[...marketTickers, ...marketTickers, ...marketTickers].map((t, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
                <span className="font-bold text-white" style={{ color: "#ffffff" }}>{t.symbol}</span>
                <span className="text-white" style={{ color: "#ffffff" }}>{t.val}</span>
                <span className={`font-bold ${t.pos ? "stock-change-pos text-emerald-400" : "stock-change-neg text-rose-400"}`} style={{ color: t.pos ? "#34d399" : "#fb7185" }}>{t.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold text-white bg-indigo-500/15 border border-indigo-500/30 mb-8 shadow-inner">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span style={{ color: "#ffffff" }}>SIMULATEUR DE TRADING V4.8 • PROPULSÉ PAR GEMINI AI</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Maîtrisez la Bourse & les Marchés <br className="hidden sm:inline" />
          <span className="text-white font-black" style={{ color: "#ffffff" }}>
            sans risquer un seul centime.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-white text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal" style={{ color: "#ffffff" }}>
          Entraînez-vous à l'investissement boursier avec <strong className="text-white font-bold" style={{ color: "#ffffff" }}>10 000 $ virtuels</strong> sur des cours authentiques, guidé en temps réel par notre mentor IA de pointe et une académie de cours interactifs.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onOpenAuth("signup")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 border border-indigo-400/30"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>Commencer Gratuitement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Highlights Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span style={{ color: "#ffffff" }}>0 € de Risque Financier</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <DollarSign className="w-4 h-4 text-indigo-400" />
            <span style={{ color: "#ffffff" }}>10 000 $ de Capital Virtuel</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Bot className="w-4 h-4 text-purple-400" />
            <span style={{ color: "#ffffff" }}>Coaching IA Gemini 24/7</span>
          </div>
        </div>

        {/* TERMINAL PREVIEW MOCKUP */}
        <div id="simulator" className="mt-16 relative max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-700/70 p-4 sm:p-6 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
          
          {/* Top Mockup Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-white font-bold hidden sm:inline" style={{ color: "#ffffff" }}>Finance Bridge Pro Terminal — Aperçu Interactif</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ● Live Trading
              </span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 text-left">
            
            {/* Left Column: Portfolio Stat Card & Chart */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0a0f22] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Portefeuille Actif</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">$11 420,50 USD</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Plus-Value Totale</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">+14.20% (+$1 420,50)</div>
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="p-5 rounded-2xl bg-[#0a0f22] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Performance de Simulation (30 Jours)</span>
                  <span className="text-indigo-400 font-bold">CAC 40 + NASDAQ</span>
                </div>
                
                <div className="h-32 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="landingChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,70 Q 50,60 100,65 T 200,40 T 300,50 T 400,20 T 500,28 L 500,100 L 0,100 Z"
                      fill="url(#landingChartGrad)"
                    />
                    <path
                      d="M 0,70 Q 50,60 100,65 T 200,40 T 300,50 T 400,20 T 500,28"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant & Positions */}
            <div className="space-y-4">
              {/* AI Mentor Box */}
              <div id="ai-mentor" className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>Analyse IA Gemini :</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                  "Excellente gestion du risque ! Votre exposition sur les puces mémoires (NVDA) porte ses fruits. Pensez à sécuriser un Stop-Loss à $120.00."
                </p>
              </div>

              {/* Positions List */}
              <div className="p-4 rounded-2xl bg-[#0a0f22] border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-bold pb-1">Positions Ouvertes</div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div>
                    <span className="text-white font-bold block">AAPL</span>
                    <span className="text-[10px] text-slate-400">10 actions</span>
                  </div>
                  <span className="text-emerald-400 font-bold">$2 245,00 (+8.2%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div>
                    <span className="text-white font-bold block">NVDA</span>
                    <span className="text-[10px] text-slate-400">15 actions</span>
                  </div>
                  <span className="text-emerald-400 font-bold">$1 933,50 (+18.5%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#0b1021] border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              FONCTIONNALITÉS CLÉS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Tout ce dont vous avez besoin pour devenir un investisseur.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4">
              Une suite complète d'outils professionnels vulgarisés pour vous faire progresser pas à pas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFeature(idx)}
                  className={`p-6 rounded-3xl bg-slate-900/90 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    selectedFeature === idx
                      ? "border-indigo-500 shadow-xl shadow-indigo-950/50 scale-[1.02]"
                      : "border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${f.accent}`}>
                      {f.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-2 tracking-tight">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {f.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>Explorer</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="academy" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            PARCOURS D'APPRENTISSAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Comment ça marche ?
          </h2>
          <p className="text-slate-300 text-sm mt-3">
            Trois étapes simples pour débuter la simulation sans aucun prérequis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              01
            </div>
            <h3 className="text-xl font-bold text-white">Création de Compte</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inscrivez-vous en 10 secondes pour recevoir instantanément vos 10 000 $ de portefeuille fictif sécurisé.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              02
            </div>
            <h3 className="text-xl font-bold text-white">Apprentissage & Simulation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez les modules de formation interactifs, testez vos achats/ventes et observez les mouvements de marchés.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              03
            </div>
            <h3 className="text-xl font-bold text-white">Analyse & Progression</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Échangez avec l'IA Gemini pour comprendre vos résultats, accumuler des points XP et franchir de nouveaux niveaux.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-700/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10">
            Prêt à faire vos premiers pas en Bourse ?
          </h2>
          
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed relative z-10">
            Rejoignez la communauté Finance Bridge dès aujourd'hui. Aucune carte bancaire requise, aucun risque financier.
          </p>

          <div className="pt-2 flex justify-center relative z-10">
            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 hover:from-indigo-400 hover:to-indigo-400 shadow-2xl shadow-indigo-500/40 transition-all transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center gap-3 border border-indigo-300/40"
              style={{ color: "#ffffff" }}
            >
              <span>Accéder à la plateforme</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#050812] py-10 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <FinanceBridgeLogo className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-extrabold text-slate-300 font-sans text-sm">Finance Bridge</span>
          </div>

          <p className="text-center max-w-md text-[11px] text-slate-400 leading-relaxed font-sans">
            Finance Bridge est un environnement de simulation à but purement éducatif. Les fonds virtuels et analyses fournies ne constituent aucun conseil financier professionnel.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 Finance Bridge</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="hover:text-white transition cursor-pointer"
            >
              Connexion
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
