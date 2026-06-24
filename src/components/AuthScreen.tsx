import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  auth,
  updateProfile
} from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from "lucide-react";
import FinanceBridgeLogo from "./FinanceBridgeLogo";

interface AuthScreenProps {
  t: (key: string) => string;
  onSuccess: (user: any, isNewUser: boolean, chosenUsername?: string) => void;
}

export default function AuthScreen({ t, onSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Validate and submit Email auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

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
        // Sign Up with Email
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save the chosen display name/username
        await updateProfile(user, { displayName: username });
        
        onSuccess(user, true, username);
      } else {
        // Sign In with Email
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(userCredential.user, false);
      }
    } catch (err: any) {
      console.error(err);
      let message = t("errorAuth");
      if (err.code === "auth/email-already-in-use") {
        message = "Cette email est déjà associé à un compte.";
      } else if (err.code === "auth/invalid-email") {
        message = "Adresse email invalide.";
      } else if (err.code === "auth/weak-password") {
        message = "Le mot de passe est trop faible.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Identifiants ou mot de passe incorrects.";
      } else {
        message = err.message || message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Provider Auth
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // If it's the first time joining, we set isNewUser=true, else false (the success handler checks if a doc exists in Firestore)
      onSuccess(result.user, false);
    } catch (err: any) {
      console.error("Google sign in error code:", err.code, err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg(
          "La fenêtre de connexion Google a été fermée ou bloquée par votre navigateur. " +
          "Si vous utilisez l'application dans l'aperçu AI Studio, nous vous suggérons de créer un compte avec email et mot de passe, ou d'ouvrir l'application dans un nouvel onglet (bouton en haut à droite) pour connecter Google sans contraintes d'iframe."
        );
      } else if (err.code === "auth/popup-blocked") {
        setErrorMsg(
          "Le bloqueur de popups de votre navigateur a bloqué la fenêtre Google. " +
          "Veuillez autoriser les popups ou utiliser l'inscription par e-mail/mot de passe."
        );
      } else {
        setErrorMsg(t("errorAuth") + " (" + (err.message || err.code || "unknown") + ")");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen-container" className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      
      {/* Visual / Brand Hero Sidebar */}
      <div id="auth-hero-sidebar" className="md:w-1/2 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden shrink-0 dark:border-slate-800">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-indigo-650 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 py-1 px-1">
            <FinanceBridgeLogo className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Finance Bridge</h1>
            <p className="text-xs text-indigo-300 font-mono">EDUCATIONAL TRADING SYSTEM</p>
          </div>
        </div>

        {/* Hero Copy / Features */}
        <div className="my-12 md:max-w-md relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 mb-4">
            🎓 ÉDUCATIF & LUDIQUE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Maîtrisez l'art de la bourse.
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
            Rejoignez des milliers d'apprentis investisseurs. Entraînez-vous avec des cours interactifs et un simulateur de marché temps réel ultra-réaliste alimenté par l'IA.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white shrink-0 font-bold border border-white/10">1</div>
              <p className="text-xs text-slate-400"><strong className="text-slate-200">Simulation de Marché Réelle</strong> : Investissez virtuellement 10 000 $ sur des cours authentiques de la bourse mondiale.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white shrink-0 font-bold border border-white/10">2</div>
              <p className="text-xs text-slate-400"><strong className="text-slate-200">Conseils IA Personnalisés</strong> : Dialogue direct avec Gemini, votre mentor attitré qui répond à vos interrogations.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white shrink-0 font-bold border border-white/10">3</div>
              <p className="text-xs text-slate-400"><strong className="text-slate-200">Synchro Cloud & XP</strong> : Vos fiches d'apprentissage, niveaux et portefeuilles sont préservés en toute sécurité.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-500 font-mono relative z-10 flex justify-between">
          <span>PORTAL VER. 4.8.0</span>
          <span>© 2026 FINANCE BRIDGE Inc.</span>
        </div>
      </div>

      {/* Connection Mode / Form Side */}
      <div id="auth-form-side" className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          
          {/* Header tabs toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl w-full">
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
                className={`flex-1 py-2 text-center rounded-lg text-xs font-black tracking-wide uppercase transition cursor-pointer ${
                  isSignUp 
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t("linkSignUp")}
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
                className={`flex-1 py-2 text-center rounded-lg text-xs font-black tracking-wide uppercase transition cursor-pointer ${
                  !isSignUp 
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t("btnSignIn")}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isSignUp ? t("authTitle") : t("btnSignIn")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
              {isSignUp ? t("authSubtitle") : "Veuillez entrer vos identifiants pour accéder à votre console de simulation boursière."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  {t("labelUsername")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("placeholderUsername")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                {t("labelEmail")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholderEmail")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                {t("labelPassword")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("placeholderPassword")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? t("btnSignUp") : t("btnSignIn")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social connection divider */}
          <div className="my-6 flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-1/4" />
            <span>{t("orContinueWith")}</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-1/4" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs tracking-tight text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.06-1.22-.63-1.83-2.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{t("btnGoogle")}</span>
          </button>

          {/* Helper Footnote to switch tab */}
          <div className="mt-8 text-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {isSignUp ? t("haveAccountText") : t("noAccountText")}{" "}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-bold transition cursor-pointer"
            >
              {isSignUp ? t("btnSignIn") : t("linkSignUp")}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
