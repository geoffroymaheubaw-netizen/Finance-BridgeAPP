import React, { useState } from "react";
import { getSupabaseClient } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, ArrowDown, Eye, EyeOff, TrendingUp, Sparkles, ShieldCheck, BarChart3, Bot, CheckCircle2, ArrowLeft } from "lucide-react";
import FinanceBridgeLogo from "./FinanceBridgeLogo";

interface AuthScreenProps {
  t: (key: string) => string;
  onSuccess: (user: any, isNewUser: boolean, chosenUsername?: string) => void;
  onBackToLanding?: () => void;
  defaultSignUp?: boolean;
}

export default function AuthScreen({ t, onSuccess, onBackToLanding, defaultSignUp = false }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(defaultSignUp);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Validate and submit Email auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg("Veuillez configurer Supabase dans les variables d'environnement.");
      return;
    }

    if (!email || !password || (isSignUp && !username)) {
      setErrorMsg("Veuillez remplir tous les champs requis.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          localStorage.setItem("finance_bridge_auth_mode", "supabase");
          onSuccess({
            uid: data.user.id,
            email: data.user.email,
            displayName: username,
            isSupabase: true
          }, true, username);
        } else {
          throw new Error("Une erreur s'est produite lors de l'inscription.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          localStorage.setItem("finance_bridge_auth_mode", "supabase");
          const metadata = data.user.user_metadata || {};
          const finalUsername = metadata.username || data.user.email?.split("@")[0] || "Trader";
          onSuccess({
            uid: data.user.id,
            email: data.user.email,
            displayName: finalUsername,
            isSupabase: true
          }, false, finalUsername);
        } else {
          throw new Error("Une erreur s'est produite lors de la connexion.");
        }
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Erreur d'authentification Supabase.";
      if (err.status === 400 || err.status === 422) {
        errMsg = "Identifiants invalides ou mot de passe incorrect.";
      }
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen-container" className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-[#080d1a] text-white overflow-y-auto scroll-smooth font-sans antialiased">
      
      {/* Visual / Brand Hero Sidebar */}
      <div id="auth-hero-sidebar" className="lg:w-7/12 bg-gradient-to-br from-[#0a1024] via-[#0f172a] to-[#080c18] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-6 sm:p-8 lg:p-14 flex flex-col justify-between relative overflow-y-auto lg:h-full shrink-0">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-blue-600/10 blur-[110px] pointer-events-none" />

        {/* Top Header & Brand */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-xl shadow-indigo-500/25">
              <div className="w-full h-full bg-[#0b1021] rounded-[14px] flex items-center justify-center">
                <FinanceBridgeLogo className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">Finance Bridge</h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO TERMINAL</span>
              </div>
              <p className="text-[11px] text-white/80 font-mono tracking-wider">PLATEFORME ÉDUCATIVE TRADING & IA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                style={{ color: "#ffffff" }}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-300" />
                <span>Accueil</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                document.getElementById("auth-form-side")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="lg:hidden text-xs font-mono font-bold text-indigo-200 hover:text-white bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <span>Se connecter</span>
              <ArrowDown className="w-3.5 h-3.5 text-indigo-300" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Marchés en Direct (Simulé)</span>
            </div>
          </div>
        </div>

        {/* Hero Section Main Content */}
        <div className="my-10 lg:my-12 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-indigo-200 bg-indigo-500/15 border border-indigo-400/25 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Simulateur Boursier V4.8 • Propulsé par Gemini AI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Maîtrisez les marchés financiers sans aucun risque.
          </h2>
          
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Entraînez-vous à l'investissement boursier avec 10 000 $ virtuels, analysez des cours temps réel et soyez guidé par un mentor IA interactif.
          </p>

          {/* Simulated Trading Terminal Preview Card */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Portefeuille Virtuel</div>
                  <div className="text-lg font-black text-white font-mono">$10 000,00 USD</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +14,2% (+$1 420,00)
                </span>
              </div>
            </div>

            {/* Sparkline chart SVG mockup */}
            <div className="h-16 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,45 Q 40,35 80,42 T 160,25 T 240,30 T 320,10 T 400,18 L 400,60 L 0,60 Z"
                  fill="url(#chartGlow)"
                />
                <path
                  d="M 0,45 Q 40,35 80,42 T 160,25 T 240,30 T 320,10 T 400,18"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Live Ticker Pills & AI Hint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 font-bold">AAPL</span>
                <span className="text-emerald-400 font-bold">$224.50 (+1,8%)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300 font-bold">NVDA</span>
                <span className="text-emerald-400 font-bold">$128.90 (+3,2%)</span>
              </div>
            </div>

            {/* Mentor IA Chip */}
            <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center gap-2.5 text-xs">
              <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-indigo-200">
                <strong className="text-white">Mentor IA Gemini :</strong> "Stratégie équilibrée. Opportunité identifiée sur le secteur technologie."
              </span>
            </div>
          </div>

          {/* Key Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">0% de Risque Réel</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Conseils IA Temps Réel</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Synchronisation Cloud</span>
            </div>
          </div>

          {/* Quick Mobile Scroll CTA to Form */}
          <button
            type="button"
            onClick={() => {
              document.getElementById("auth-form-side")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="lg:hidden mt-6 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 border border-indigo-400/30 shadow-xl shadow-indigo-600/25 transition cursor-pointer active:scale-[0.98]"
          >
            <span>Accéder à la connexion</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-indigo-200" />
          </button>
        </div>

        {/* Footer info */}
        <div className="text-xs font-mono text-slate-400 relative z-10 flex flex-wrap justify-between items-center gap-2 pt-6 border-t border-slate-800/60">
          <span>Finance Bridge Terminal v4.8.0</span>
          <span>© 2026 Finance Bridge Inc. Tous droits réservés.</span>
        </div>
      </div>

      {/* Connection Form Side */}
      <div id="auth-form-side" className="lg:w-5/12 min-h-screen lg:min-h-0 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 relative overflow-y-auto bg-[#070b16] shrink-0 lg:shrink">
        <div className="w-full max-w-md my-auto">
          
          {/* Header Segmented Control Switch */}
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 flex items-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                !isSignUp 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/50 text-white hover:bg-slate-800"
              }`}
              style={{ color: "#ffffff" }}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
              className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                isSignUp 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "bg-slate-800/50 text-white hover:bg-slate-800"
              }`}
              style={{ color: "#ffffff" }}
            >
              Créer un compte
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ color: "#ffffff" }}>
              {isSignUp ? "Créer un compte" : "Bon retour parmi nous"}
            </h3>
            <p className="text-white text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: "#ffffff" }}>
              {isSignUp 
                ? "Inscrivez-vous gratuitement pour commencer à simuler vos investissements et débloquer vos formations."
                : "Entrez vos identifiants pour accéder à votre terminal de trading éducatif."}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs rounded-2xl flex items-start gap-3 shadow-lg"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input (Sign Up mode) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider font-mono" style={{ color: "#ffffff" }}>
                  Nom d'utilisateur <span className="text-rose-400" style={{ color: "#f43f5e" }}>*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ex: TraderPro99"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider font-mono" style={{ color: "#ffffff" }}>
                Adresse e-mail <span className="text-rose-400" style={{ color: "#f43f5e" }}>*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 uppercase tracking-wider font-mono" style={{ color: "#ffffff" }}>
                Mot de passe <span className="text-rose-400" style={{ color: "#f43f5e" }}>*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Créer mon compte gratuit" : "Se connecter au terminal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Switch Prompt */}
          <div className="mt-8 text-center text-xs">
            <span className="text-white" style={{ color: "#ffffff" }}>
              {isSignUp ? "Vous disposez déjà d'un compte ?" : "Vous n'avez pas encore de compte ?"}
            </span>{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition underline underline-offset-4 cursor-pointer"
            >
              {isSignUp ? "Se connecter" : "S'inscrire gratuitement"}
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authentification Sécurisée & Données Chiffrées</span>
          </div>

        </div>
      </div>

    </div>
  );
}

