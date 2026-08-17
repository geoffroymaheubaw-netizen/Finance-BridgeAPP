import React, { useState } from "react";
import { UserProfile } from "../types";
import { Language } from "../translations";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Lock, 
  TrendingUp, 
  Bot, 
  Heart, 
  Layers, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  CheckCircle2, 
  Star,
  Users,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubscriptionsTabProps {
  profile: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  lang: Language;
  t: (key: string) => string;
}

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: "free" | "pro" | "elite";
  name: string;
  badge?: string;
  popular?: boolean;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number; // price per month when billed yearly
  yearlyTotal: number;
  description: string;
  features: PlanFeature[];
  accentColor: string;
  buttonLabel: string;
}

export default function SubscriptionsTab({
  profile,
  onUpdateProfile,
  lang,
  t
}: SubscriptionsTabProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PricingPlan | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const currentTier = profile.subscriptionTier || "free";

  const isFr = lang === "fr";

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: isFr ? "Découverte (Gratuit)" : "Free Starter",
      icon: <Sparkles className="w-5 h-5 text-slate-400" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      yearlyTotal: 0,
      description: isFr
        ? "Idéal pour débuter et apprendre les bases de la bourse sans aucun engagement."
        : "Perfect for beginners to learn stock market fundamentals with zero risk.",
      features: [
        { text: isFr ? "Capital virtuel de départ : 10 000 $" : "Virtual initial capital: $10,000", included: true },
        { text: isFr ? "4 cœurs de révision par jour" : "4 learning hearts per day", included: true },
        { text: isFr ? "Simulateur boursier temps réel & 24/7" : "Real-time & 24/7 stock simulator", included: true },
        { text: isFr ? "Conseiller IA standard (10 questions/jour)" : "Standard AI advisor (10 questions/day)", included: true },
        { text: isFr ? "Actualités et sentiment de marché" : "Financial news and sentiment index", included: true },
        { text: isFr ? "Cœurs d'apprentissage illimités" : "Unlimited learning hearts", included: false },
        { text: isFr ? "IA Mentor Illimitée en temps réel" : "Unlimited real-time AI mentor", included: false },
        { text: isFr ? "Multi-portefeuilles & stress tests" : "Multi-portfolios & custom stress tests", included: false },
        { text: isFr ? "Salon Discord VIP & communauté pro" : "VIP Discord lounge & pro community", included: false },
      ],
      accentColor: "slate",
      buttonLabel: currentTier === "free" ? (isFr ? "Plan Actuel" : "Current Plan") : (isFr ? "Passer au Gratuit" : "Downgrade to Free")
    },
    {
      id: "pro",
      name: "PRO Trader",
      badge: isFr ? "⭐ Le Plus Choisi" : "⭐ Most Popular",
      popular: true,
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      monthlyPrice: 9.99,
      yearlyPrice: 6.49,
      yearlyTotal: 77.88,
      description: isFr
        ? "Pour les investisseurs réguliers qui veulent progresser vite avec l'IA illimitée."
        : "For ambitious traders who want fast learning, unlimited AI, and full features.",
      features: [
        { text: isFr ? "Capital virtuel personnalisable jusqu'à 500 000 $" : "Customizable virtual capital up to $500,000", included: true, highlight: true },
        { text: isFr ? "Cœurs d'apprentissage ILLIMITÉS (∞)" : "UNLIMITED learning hearts (∞)", included: true, highlight: true },
        { text: isFr ? "Conseiller IA Gemini Mentor ILLIMITÉ" : "UNLIMITED Gemini AI mentor advisor", included: true, highlight: true },
        { text: isFr ? "Alertes Stop-Loss et Take-Profit prioritaires" : "Priority Stop-Loss & Take-Profit alerts", included: true },
        { text: isFr ? "Ratios financiers détaillés (P/E, PEG, Volatilité)" : "In-depth valuation ratios (P/E, PEG, Beta)", included: true },
        { text: isFr ? "Export de portefeuille & bilans de performance PDF" : "PDF portfolio exports & performance audits", included: true },
        { text: isFr ? "Accès anticipé aux nouveaux modules éducatifs" : "Early access to new lesson modules", included: true },
        { text: isFr ? "Multi-portefeuilles (jusqu'à 10)" : "Multi-portfolios (up to 10)", included: false },
        { text: isFr ? "Salle de trading Discord VIP privée" : "Private VIP Discord trading lounge", included: false },
      ],
      accentColor: "indigo",
      buttonLabel: currentTier === "pro" 
        ? (isFr ? "Plan Actif ⭐" : "Active Plan ⭐") 
        : (isFr ? "Choisir PRO Trader" : "Get PRO Trader")
    },
    {
      id: "elite",
      name: "INSTITUTIONNEL ELITE",
      badge: isFr ? "👑 Élite & VIP" : "👑 Elite & VIP",
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      monthlyPrice: 29.99,
      yearlyPrice: 19.99,
      yearlyTotal: 239.88,
      description: isFr
        ? "L'expérience de finance ultime avec multi-portefeuilles, stress tests et communauté VIP."
        : "The ultimate finance suite with multi-portfolios, stress tests, and VIP lounge.",
      features: [
        { text: isFr ? "Tout ce qui est inclus dans le forfait PRO" : "Everything included in PRO plan", included: true },
        { text: isFr ? "Capital virtuel illimité (jusqu'à 5 000 000 $)" : "Unlimited virtual capital (up to $5,000,000)", included: true, highlight: true },
        { text: isFr ? "Multi-portefeuilles (Crypto, Dividendes, Tech...)" : "Multi-portfolios (Crypto, Dividends, Growth...)", included: true, highlight: true },
        { text: isFr ? "Simulateur de séismes & crises sur-mesure" : "Custom macroeconomic stress test simulator", included: true, highlight: true },
        { text: isFr ? "Accès direct au salon Discord VIP des traders" : "Direct access to private VIP Discord lounge", included: true },
        { text: isFr ? "Analyses de sentiment des insiders & flux institutionnels" : "Insider sentiment & institutional flow insights", included: true },
        { text: isFr ? "Support dédié 24/7 prioritaire" : "Priority 24/7 dedicated support", included: true },
        { text: isFr ? "Badge exclusif 'Elite Trader' sur votre profil" : "Exclusive 'Elite Trader' profile badge", included: true },
        { text: isFr ? "Webinaire mensuel d'analyse de marché en direct" : "Monthly live market strategy webinar", included: true },
      ],
      accentColor: "amber",
      buttonLabel: currentTier === "elite"
        ? (isFr ? "Plan Actif 👑" : "Active Plan 👑")
        : (isFr ? "Passer à l'Élite" : "Upgrade to Elite")
    }
  ];

  const comparisonRows = [
    { name: isFr ? "Capital virtuel de simulation" : "Virtual starting capital", free: "$10,000", pro: "$500,000", elite: "$5,000,000" },
    { name: isFr ? "Cœurs d'apprentissage par jour" : "Learning hearts / day", free: "4 cœurs", pro: "Illimités (∞)", elite: "Illimités (∞)" },
    { name: isFr ? "Questions au Conseiller IA" : "AI Advisor questions", free: "10 / jour", pro: "Illimitées (∞)", elite: "Illimitées (∞)" },
    { name: isFr ? "Accès aux cours et modules" : "Course modules access", free: isFr ? "Complet" : "Full", pro: isFr ? "Complet + Avancé" : "Full + Advanced", elite: isFr ? "Accès VIP Intégral" : "VIP All Access" },
    { name: isFr ? "Alertes Stop-Loss & Take-Profit" : "Stop-Loss alerts", free: isFr ? "Basique" : "Basic", pro: isFr ? "Temps réel" : "Real-time", elite: isFr ? "Instantané + Push" : "Instant + Push" },
    { name: isFr ? "Gestion multi-portefeuilles" : "Multi-portfolios management", free: "1 seul", pro: "3 portefeuilles", elite: "10 portefeuilles" },
    { name: isFr ? "Séismes macroéconomiques personnalisés" : "Custom market shocks", free: isFr ? "1 par jour" : "1 per day", pro: isFr ? "Illimités" : "Unlimited", elite: isFr ? "Paramétrables" : "Full Custom" },
    { name: isFr ? "Exports PDF des transactions & bilans" : "PDF portfolio exports", free: "❌", pro: "✔ Inclus", elite: "✔ Inclus" },
    { name: isFr ? "Communauté & Salon Discord VIP" : "VIP Community Lounge", free: "❌", pro: "❌", elite: "✔ Accès Immédiat" },
    { name: isFr ? "Support client" : "Customer support", free: isFr ? "Standard" : "Standard", pro: isFr ? "Prioritaire" : "Priority", elite: isFr ? "Dédié 24/7" : "24/7 Dedicated" },
  ];

  const faqs = [
    {
      q: isFr ? "Puis-je changer ou annuler mon abonnement à tout moment ?" : "Can I change or cancel my subscription anytime?",
      a: isFr 
        ? "Absolument. Aucun engagement n'est requis. Vous pouvez passer d'un forfait à un autre ou annuler votre abonnement en un clic depuis les paramètres de votre compte sans aucun frais."
        : "Yes, absolutely! There is no commitment. You can switch plans or cancel with a single click in your settings with zero penalty."
    },
    {
      q: isFr ? "L'argent utilisé dans le simulateur est-il réel ?" : "Is the money used in the simulator real?",
      a: isFr
        ? "Non, Finance Bridge est une plateforme 100% éducative. Tout le capital est virtuel pour vous permettre de vous entraîner dans les conditions réelles des marchés sans risquer un seul centime réel."
        : "No, Finance Bridge is 100% educational. All capital is virtual so you can train under real market conditions without any financial risk."
    },
    {
      q: isFr ? "Comment fonctionne le conseiller IA illimité avec PRO et Élite ?" : "How does unlimited AI work with PRO and Elite?",
      a: isFr
        ? "Les abonnés PRO et Élite bénéficient d'un accès sans aucune restriction au modèle Gemini Flash Ultra. Vous pouvez lui poser autant de questions que vous voulez, demander des analyses de portefeuille et décrypter n'importe quelle actualité 24h/24."
        : "PRO and Elite members enjoy unrestricted access to the ultra-fast Gemini model to ask unlimited questions, audit portfolios, and decode news 24/7."
    },
    {
      q: isFr ? "Quels sont les moyens de paiement acceptés ?" : "Which payment methods are accepted?",
      a: isFr
        ? "Nous acceptons toutes les principales cartes bancaires (Visa, Mastercard, American Express), ainsi qu'Apple Pay, Google Pay et PayPal via une passerelle de paiement sécurisée et cryptée SSL 256 bits."
        : "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and PayPal with 256-bit SSL encrypted security."
    },
    {
      q: isFr ? "Y a-t-il une garantie satisfait ou remboursé ?" : "Is there a money-back guarantee?",
      a: isFr
        ? "Oui ! Nous proposons une garantie satisfait ou remboursé de 14 jours sans poser de questions si vous n'êtes pas pleinement conquis par l'expérience Finance Bridge PRO."
        : "Yes! We offer a 14-day 100% money-back guarantee with no questions asked."
    }
  ];

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlanForModal(plan);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlanForModal) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newTier = selectedPlanForModal.id;
      
      // Update profile
      if (onUpdateProfile) {
        onUpdateProfile({
          subscriptionTier: newTier,
          subscriptionPeriod: billingPeriod,
          learningHearts: newTier === "free" ? 4 : 999
        });
      }

      setIsSuccessModalOpen(true);
    }, 1200);
  };

  return (
    <div id="subscriptions-tab-container" className="space-y-10 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner with value props */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/20 p-6 sm:p-10 text-white shadow-2xl">
        {/* Glow accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-400/30">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFr ? "FORFAITS & ABONNEMENTS FINANCE BRIDGE" : "FINANCE BRIDGE SUBSCRIPTION TIERS"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {isFr ? (
              <>
                Accélérez votre maîtrise de la bourse avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">Finance Bridge PRO</span>
              </>
            ) : (
              <>
                Supercharge your trading mastery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">Finance Bridge PRO</span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {isFr
              ? "Débloquez l'IA mentor sans limite, les cœurs d'apprentissage infinis, le capital personnalisable jusqu'à 5 000 000 $ et l'accès exclusif aux analyses institutionnelles."
              : "Unlock unlimited AI mentoring, infinite learning hearts, customizable virtual capital up to $5,000,000, and institutional-grade analytics."}
          </p>

          {/* Current Tier Display Pill */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono">
              <span className="text-slate-400">{isFr ? "Votre statut actuel :" : "Current status:"}</span>
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                {currentTier === "elite" && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                {currentTier === "pro" && <Zap className="w-3.5 h-3.5 text-indigo-400" />}
                {currentTier === "free" && <Sparkles className="w-3.5 h-3.5 text-slate-400" />}
                <span className={currentTier === "elite" ? "text-amber-400 font-black" : currentTier === "pro" ? "text-indigo-400 font-black" : "text-slate-200"}>
                  {currentTier === "elite" ? "ÉLITE VIP" : currentTier === "pro" ? "PRO TRADER" : "DÉCOUVERTE (GRATUIT)"}
                </span>
              </span>
            </div>

            {currentTier !== "free" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isFr ? "Avantages Débloqués" : "Perks Active"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Billing Switcher Toggle */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              billingPeriod === "monthly"
                ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-md font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {isFr ? "Facturation Mensuelle" : "Monthly Billing"}
          </button>
          
          <button
            type="button"
            onClick={() => setBillingPeriod("yearly")}
            className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-md font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>{isFr ? "Facturation Annuelle" : "Annual Billing"}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs animate-pulse">
              {isFr ? "-35% ÉCONOMISÉS" : "-35% OFF"}
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {billingPeriod === "yearly" 
            ? (isFr ? "✨ 2 mois offerts + engagement au tarif réduit garanti" : "✨ 2 months free + locked-in lowest pricing")
            : (isFr ? "Sans engagement, résiliable chaque mois en 1 clic" : "No commitment, cancel monthly with 1 click")}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = currentTier === plan.id;
          const displayPrice = billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 dark:from-indigo-950/60 dark:to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/15 lg:-translate-y-2"
                  : plan.id === "elite"
                  ? "bg-white dark:bg-slate-900 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-xl"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
              }`}
            >
              {/* Popular / Elite Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider shadow-lg ${
                    plan.popular
                      ? "bg-indigo-600 text-white border border-indigo-400"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300 font-black"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      plan.id === "pro"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : plan.id === "elite"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {plan.id === "free" ? (isFr ? "Accès à vie" : "Lifetime access") : (isFr ? "Accès Pro illimité" : "Full Pro Access")}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {plan.monthlyPrice === 0 ? "0 €" : `${displayPrice.toFixed(2).replace(".", ",")} €`}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {plan.monthlyPrice === 0 ? (isFr ? "/ toujours" : "/ forever") : (isFr ? "/ mois" : "/ month")}
                    </span>
                  </div>

                  {plan.monthlyPrice > 0 && billingPeriod === "yearly" && (
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      {isFr ? `Facturé ${plan.yearlyTotal.toFixed(2).replace(".", ",")} € par an (économie de 35%)` : `Billed ${plan.yearlyTotal.toFixed(2)} € annually (save 35%)`}
                    </p>
                  )}
                  {plan.monthlyPrice > 0 && billingPeriod === "monthly" && (
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      {isFr ? "Facturé chaque mois sans engagement" : "Billed monthly, cancel anytime"}
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {isFr ? "Ce qui est inclus :" : "What's included:"}
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            feat.highlight
                              ? "bg-indigo-600 text-white"
                              : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                          </div>
                        )}
                        <span className={`${
                          !feat.included
                            ? "text-slate-400 dark:text-slate-500 line-through opacity-70"
                            : feat.highlight
                            ? "text-slate-900 dark:text-white font-bold"
                            : "text-slate-700 dark:text-slate-200"
                        }`}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isSelected}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 ${
                    isSelected
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-default opacity-80"
                      : plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 border border-indigo-400"
                      : plan.id === "elite"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-amber-500/20"
                      : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  <span>{plan.buttonLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {isFr ? "Garantie 14 Jours" : "14-Day Money Back"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFr ? "Satisfait ou 100% remboursé sans justification" : "100% satisfaction guarantee, no questions asked"}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {isFr ? "Paiement 100% Sécurisé" : "100% Secure Checkout"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFr ? "Chiffrement SSL 256 bits, Stripe & Apple Pay" : "256-bit SSL, Stripe & Apple Pay certified"}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {isFr ? "Sans Engagement" : "No Lock-in"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFr ? "Résiliation instantanée en 1 clic à tout moment" : "Cancel anytime in 1 click from your settings"}
            </p>
          </div>
        </div>
      </div>

      {/* In-depth Features Comparison Table */}
      <div className="space-y-4 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isFr ? "Tableau Comparatif des Fonctionnalités" : "Detailed Feature Comparison"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isFr ? "Comparez point par point chaque forfait pour choisir celui qui correspond à vos objectifs." : "Compare every tier point-by-point to find your ideal match."}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-extrabold text-slate-700 dark:text-slate-300 w-2/5">
                  {isFr ? "Fonctionnalités" : "Features"}
                </th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-400 text-center w-1/5">
                  {isFr ? "Découverte (0€)" : "Free (0€)"}
                </th>
                <th className="p-4 font-black text-indigo-600 dark:text-indigo-400 text-center w-1/5 bg-indigo-500/5">
                  PRO Trader
                </th>
                <th className="p-4 font-black text-amber-600 dark:text-amber-400 text-center w-1/5">
                  INSTITUTIONNEL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    {row.name}
                  </td>
                  <td className="p-4 text-center text-slate-500 dark:text-slate-400 font-semibold">
                    {row.free}
                  </td>
                  <td className="p-4 text-center text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-500/5">
                    {row.pro}
                  </td>
                  <td className="p-4 text-center text-amber-600 dark:text-amber-300 font-bold">
                    {row.elite}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4 pt-6 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isFr ? "Foire Aux Questions (FAQ)" : "Frequently Asked Questions"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isFr ? "Tout ce que vous devez savoir avant de passer au niveau supérieur." : "Everything you need to know about our plans."}
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  className="w-full p-4.5 sm:p-5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-xs sm:text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition gap-4"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4.5 pb-4.5 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout / Subscription Simulation Modal */}
      <AnimatePresence>
        {selectedPlanForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setSelectedPlanForModal(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    {selectedPlanForModal.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedPlanForModal.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {billingPeriod === "yearly" ? (isFr ? "Formule Annuelle (-35%)" : "Annual Plan (-35%)") : (isFr ? "Formule Mensuelle" : "Monthly Plan")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedPlanForModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Order summary box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{isFr ? "Forfait sélectionné :" : "Selected Plan:"}</span>
                  <span className="font-bold text-white">{selectedPlanForModal.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>{isFr ? "Période de facturation :" : "Billing cycle:"}</span>
                  <span className="font-bold text-white">
                    {billingPeriod === "yearly" ? (isFr ? "12 mois (Annuel)" : "12 months (Annual)") : (isFr ? "1 mois (Sans engagement)" : "1 month (No lock-in)")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">{isFr ? "Total à régler :" : "Total Due:"}</span>
                  <span className="font-black text-emerald-400 text-lg">
                    {selectedPlanForModal.monthlyPrice === 0
                      ? "0,00 €"
                      : billingPeriod === "yearly"
                      ? `${selectedPlanForModal.yearlyTotal.toFixed(2).replace(".", ",")} €`
                      : `${selectedPlanForModal.monthlyPrice.toFixed(2).replace(".", ",")} €`}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Mockup */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 font-mono">
                  {isFr ? "Moyen de paiement sécurisé (Simulation instantanée) :" : "Secure Payment Method (Instant Simulation):"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-indigo-600/20 border-2 border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <CreditCard className="w-5 h-5 text-indigo-300" />
                    <span className="text-[10px] font-bold text-white">Carte Bancaire</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-1 opacity-70">
                    <span className="text-sm">Pay</span>
                    <span className="text-[10px] text-slate-400">Apple Pay</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-1 opacity-70">
                    <span className="text-sm font-bold text-blue-400">GPay</span>
                    <span className="text-[10px] text-slate-400">Google Pay</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? "Simulation active : Les privilèges seront débloqués immédiatement sur votre compte." : "Simulation active: Your privileges will be unlocked instantly."}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedPlanForModal(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmSubscription}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isFr ? "Validation en cours..." : "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isFr ? "Confirmer et Activer" : "Confirm & Activate"}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Celebration Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSuccessModalOpen(false);
                setSelectedPlanForModal(null);
              }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0e1630] to-[#0a0f20] border border-indigo-500/40 p-6 sm:p-8 text-center text-white shadow-2xl space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-400 p-0.5 mx-auto shadow-xl shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-amber-400">
                  <Crown className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {isFr ? "Félicitations ! 🎉" : "Congratulations! 🎉"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? "Votre abonnement a été activé avec succès. Tous vos avantages et fonctionnalités exclusives sont désormais débloqués !"
                    : "Your subscription has been activated successfully. All exclusive perks and features are now fully unlocked!"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-800/50 text-xs font-mono text-indigo-200 text-left space-y-1.5">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? "Cœurs de révision infinis activés" : "Infinite learning hearts active"}</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? "Conseiller IA Gemini illimité" : "Unlimited Gemini AI advisor"}</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? "Statut VIP & insignes de profil" : "VIP status & profile badges"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setSelectedPlanForModal(null);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/40 transition cursor-pointer"
              >
                {isFr ? "Profiter de mes avantages 🚀" : "Enjoy My Perks 🚀"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
