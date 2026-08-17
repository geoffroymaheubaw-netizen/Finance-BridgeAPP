import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  GraduationCap,
  ChevronDown,
  Check
} from "lucide-react";
import FinanceBridgeLogo from "./FinanceBridgeLogo";
import { Language, LANGUAGES } from "../translations";

interface LandingPageProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onStartGuest?: () => void;
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const LANGUAGE_DATA: Record<Language, { flag: string; name: string; short: string }> = {
  fr: { flag: "🇫🇷", name: "Français", short: "FR" },
  en: { flag: "🇬🇧", name: "English", short: "EN" },
  es: { flag: "🇪🇸", name: "Español", short: "ES" },
  pt: { flag: "🇵🇹", name: "Português", short: "PT" },
  de: { flag: "🇩🇪", name: "Deutsch", short: "DE" },
  zh: { flag: "🇨🇳", name: "中文", short: "ZH" },
};

interface LandingTexts {
  tagline: string;
  navAcademy: string;
  login: string;
  signup: string;
  liveMarkets: string;
  liveShort: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle1: string;
  heroSubtitleBold: string;
  heroSubtitle2: string;
  startFree: string;
  langTitle: string;
  // Highlights
  pillRisk: string;
  pillCapital: string;
  pillAI: string;
  // Mockup preview
  mockupTitle: string;
  mockupLiveTrading: string;
  mockupActivePortfolio: string;
  mockupTotalGain: string;
  mockupChartPerformance: string;
  mockupMarketScope: string;
  mockupAiAnalysisTitle: string;
  mockupAiAnalysisQuote: string;
  mockupOpenPositions: string;
  mockupShares: string;
  // Features section
  featuresBadge: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresExplore: string;
  feat1Badge: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Badge: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Badge: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Badge: string;
  feat4Title: string;
  feat4Desc: string;
  // How it works / Academy
  howBadge: string;
  howTitle: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  // Footer
  footerDisclaimer: string;
  footerLogin: string;
}

const LANDING_TEXTS: Record<Language, LandingTexts> = {
  fr: {
    tagline: "Éducation & Simulation Boursière",
    navAcademy: "Académie",
    login: "Se connecter",
    signup: "Créer un compte",
    liveMarkets: "MARCHÉS EN DIRECT (SIMULATION) :",
    liveShort: "EN DIRECT :",
    heroBadge: "SIMULATEUR DE TRADING V4.8 • PROPULSÉ PAR GEMINI AI",
    heroTitle1: "Maîtrisez la Bourse & les Marchés",
    heroTitle2: "sans risquer un seul centime.",
    heroSubtitle1: "Entraînez-vous à l'investissement boursier avec ",
    heroSubtitleBold: "10 000 $ virtuels",
    heroSubtitle2: " calqués sur les cotations réelles du marché, guidé en temps réel par notre mentor IA et un parcours pédagogique interactif.",
    startFree: "Commencer Gratuitement",
    langTitle: "Changer la langue",
    pillRisk: "0 € de Risque Financier",
    pillCapital: "10 000 $ de Capital Virtuel",
    pillAI: "Coaching IA Gemini 24/7",
    mockupTitle: "Finance Bridge Pro Terminal — Aperçu Interactif",
    mockupLiveTrading: "● Live Trading",
    mockupActivePortfolio: "Portefeuille Actif",
    mockupTotalGain: "Plus-Value Totale",
    mockupChartPerformance: "Performance de Simulation (30 Jours)",
    mockupMarketScope: "CAC 40 + NASDAQ",
    mockupAiAnalysisTitle: "Analyse IA Gemini :",
    mockupAiAnalysisQuote: "« Excellente gestion du risque ! Votre exposition sur les puces mémoires (NVDA) porte ses fruits. Pensez à sécuriser un Stop-Loss à $120.00. »",
    mockupOpenPositions: "Positions Ouvertes",
    mockupShares: "actions",
    featuresBadge: "FONCTIONNALITÉS CLÉS",
    featuresTitle: "Tout ce dont vous avez besoin pour devenir un investisseur.",
    featuresSubtitle: "Une suite complète d'outils professionnels vulgarisés pour vous faire progresser pas à pas.",
    featuresExplore: "Explorer",
    feat1Badge: "SIMULATEUR TEMPS RÉEL",
    feat1Title: "Trading Virtuel Ultra-Réaliste",
    feat1Desc: "Passez des ordres d'Achat, Vente et Stop-Loss avec un capital virtuel de 10 000 $ sur les plus grandes actions mondiales (AAPL, NVDA, LVMH, CAC 40, Crypto).",
    feat2Badge: "MENTOR IA GEMINI",
    feat2Title: "Conseiller Financier IA 24/7",
    feat2Desc: "Posez toutes vos questions à l'IA Gemini. Obtenez une analyse personnalisée de votre portefeuille, des explications claires et des stratégies de gestion du risque.",
    feat3Badge: "ACADÉMIE LUDIQUE",
    feat3Title: "Formations & Quiz de Niveau",
    feat3Desc: "Progresse pas à pas avec des leçons interactives, débloque des points d'expérience (XP), monte en niveau et conserve ta série quotidienne d'apprentissage.",
    feat4Badge: "FLUX & BLOC-NOTES",
    feat4Title: "Actualités & Prise de Notes",
    feat4Desc: "Restez informé en direct des actualités boursières mondiales et notez vos observations d'analyse technique dans votre journal d'investisseur.",
    howBadge: "PARCOURS D'APPRENTISSAGE",
    howTitle: "Comment ça marche ?",
    howSubtitle: "Trois étapes simples pour débuter la simulation sans aucun prérequis.",
    step1Title: "Création de Compte",
    step1Desc: "Inscrivez-vous en 10 secondes pour recevoir instantanément vos 10 000 $ de portefeuille fictif sécurisé.",
    step2Title: "Apprentissage & Simulation",
    step2Desc: "Consultez les modules de formation interactifs, testez vos achats/ventes et observez les mouvements de marchés.",
    step3Title: "Analyse & Progression",
    step3Desc: "Échangez avec l'IA Gemini pour comprendre vos résultats, accumuler des points XP et franchir de nouveaux niveaux.",
    ctaTitle: "Prêt à faire vos premiers pas en Bourse ?",
    ctaSubtitle: "Rejoignez la communauté Finance Bridge dès aujourd'hui. Aucune carte bancaire requise, aucun risque financier.",
    ctaButton: "Accéder à la plateforme",
    footerDisclaimer: "Finance Bridge est un environnement de simulation à but purement éducatif. Les fonds virtuels et analyses fournies ne constituent aucun conseil financier professionnel.",
    footerLogin: "Connexion",
  },
  en: {
    tagline: "Financial Education & Stock Simulation",
    navAcademy: "Academy",
    login: "Sign in",
    signup: "Sign up",
    liveMarkets: "LIVE MARKETS (SIMULATION):",
    liveShort: "LIVE:",
    heroBadge: "TRADING SIMULATOR V4.8 • POWERED BY GEMINI AI",
    heroTitle1: "Master the Stock Market & Trading",
    heroTitle2: "without risking a single penny.",
    heroSubtitle1: "Practice stock market investing with ",
    heroSubtitleBold: "$10,000 in virtual cash",
    heroSubtitle2: " mapped to real market quotes, guided in real time by our AI mentor and an interactive curriculum.",
    startFree: "Start for Free",
    langTitle: "Change language",
    pillRisk: "$0 Financial Risk",
    pillCapital: "$10,000 Virtual Capital",
    pillAI: "24/7 Gemini AI Coaching",
    mockupTitle: "Finance Bridge Pro Terminal — Interactive Preview",
    mockupLiveTrading: "● Live Trading",
    mockupActivePortfolio: "Active Portfolio",
    mockupTotalGain: "Total Profit",
    mockupChartPerformance: "Simulation Performance (30 Days)",
    mockupMarketScope: "S&P 500 + NASDAQ",
    mockupAiAnalysisTitle: "Gemini AI Analysis:",
    mockupAiAnalysisQuote: "“Excellent risk management! Your position in semiconductor stocks (NVDA) is paying off. Consider securing a Stop-Loss at $120.00.”",
    mockupOpenPositions: "Open Positions",
    mockupShares: "shares",
    featuresBadge: "KEY FEATURES",
    featuresTitle: "Everything you need to become a skilled investor.",
    featuresSubtitle: "A complete suite of professional tools simplified to help you progress step by step.",
    featuresExplore: "Explore",
    feat1Badge: "REAL-TIME SIMULATOR",
    feat1Title: "Ultra-Realistic Virtual Trading",
    feat1Desc: "Place Buy, Sell, and Stop-Loss orders with $10,000 in virtual funds across leading global stocks (AAPL, NVDA, LVMH, S&P 500, Crypto).",
    feat2Badge: "GEMINI AI MENTOR",
    feat2Title: "24/7 AI Financial Advisor",
    feat2Desc: "Ask Gemini AI anything. Get personalized portfolio insights, clear explanations, and risk management strategies in real time.",
    feat3Badge: "GAMIFIED ACADEMY",
    feat3Title: "Interactive Courses & Quizzes",
    feat3Desc: "Progress step by step with interactive lessons, earn experience points (XP), level up, and maintain your daily learning streak.",
    feat4Badge: "NEWS & JOURNAL",
    feat4Title: "Live Market News & Journal",
    feat4Desc: "Stay informed with real-time global financial news and record your technical analysis and thoughts in your investor trading journal.",
    howBadge: "LEARNING PATH",
    howTitle: "How Does It Work?",
    howSubtitle: "Three simple steps to start simulated trading with zero prerequisites.",
    step1Title: "Create Your Account",
    step1Desc: "Sign up in 10 seconds to instantly receive your $10,000 virtual risk-free portfolio.",
    step2Title: "Learn & Simulate",
    step2Desc: "Explore interactive courses, test real-time buy/sell executions, and observe live market movements.",
    step3Title: "Analyze & Level Up",
    step3Desc: "Chat with Gemini AI to understand your results, earn XP points, and achieve new mastery levels.",
    ctaTitle: "Ready to take your first steps in the stock market?",
    ctaSubtitle: "Join the Finance Bridge community today. No credit card required, zero financial risk.",
    ctaButton: "Access the Platform",
    footerDisclaimer: "Finance Bridge is a simulation environment for educational purposes only. Virtual funds and AI analysis do not constitute professional financial advice.",
    footerLogin: "Sign in",
  },
  es: {
    tagline: "Educación y Simulación Bursátil",
    navAcademy: "Academia",
    login: "Iniciar sesión",
    signup: "Crear una cuenta",
    liveMarkets: "MERCADOS EN VIVO (SIMULACIÓN):",
    liveShort: "EN VIVO:",
    heroBadge: "SIMULADOR DE TRADING V4.8 • CON GEMINI AI",
    heroTitle1: "Domina la Bolsa y los Mercados",
    heroTitle2: "sin arriesgar un solo centavo.",
    heroSubtitle1: "Practica la inversión en bolsa con ",
    heroSubtitleBold: "$10 000 virtuales",
    heroSubtitle2: " calados en cotizaciones reales del mercado, guiado en tiempo real por nuestro mentor IA.",
    startFree: "Empezar Gratis",
    langTitle: "Cambiar idioma",
    pillRisk: "0 € de Riesgo Financiero",
    pillCapital: "$10 000 de Capital Virtual",
    pillAI: "Coaching IA Gemini 24/7",
    mockupTitle: "Finance Bridge Pro Terminal — Vista Previa Interactiva",
    mockupLiveTrading: "● Live Trading",
    mockupActivePortfolio: "Cartera Activa",
    mockupTotalGain: "Ganancia Total",
    mockupChartPerformance: "Rendimiento de Simulación (30 Días)",
    mockupMarketScope: "IBEX 35 + NASDAQ",
    mockupAiAnalysisTitle: "Análisis IA Gemini:",
    mockupAiAnalysisQuote: "« ¡Excelente gestión del riesgo! Su exposición a los semiconductores (NVDA) está dando frutos. Considere asegurar un Stop-Loss a $120.00. »",
    mockupOpenPositions: "Posiciones Abiertas",
    mockupShares: "acciones",
    featuresBadge: "CARACTERÍSTICAS CLAVE",
    featuresTitle: "Todo lo que necesitas para convertirte en inversor.",
    featuresSubtitle: "Una suite completa de herramientas profesionales simplificadas para avanzar paso a paso.",
    featuresExplore: "Explorar",
    feat1Badge: "SIMULADOR EN TIEMPO REAL",
    feat1Title: "Trading Virtual Ultra-Realista",
    feat1Desc: "Realice órdenes de Compra, Venta y Stop-Loss con $10 000 de capital virtual en las principales acciones mundiales (AAPL, NVDA, LVMH, Cripto).",
    feat2Badge: "MENTOR IA GEMINI",
    feat2Title: "Asesor Financiero IA 24/7",
    feat2Desc: "Haga todas sus preguntas a la IA Gemini. Obtenga un análisis personalizado de su cartera, explicaciones claras y estrategias de riesgo.",
    feat3Badge: "ACADEMIA INTERACTIVA",
    feat3Title: "Cursos y Cuestionarios",
    feat3Desc: "Avanza paso a paso con lecciones interactivas, desbloquea puntos de experiencia (XP), sube de nivel y mantén tu racha diaria.",
    feat4Badge: "NOTICIAS Y DIARIO",
    feat4Title: "Noticias en Vivo y Apuntes",
    feat4Desc: "Manténgase informado con noticias financieras globales en tiempo real y anote sus análisis técnicos en su diario de inversor.",
    howBadge: "RUTA DE APRENDIZAJE",
    howTitle: "¿Cómo funciona?",
    howSubtitle: "Tres pasos sencillos para comenzar la simulación sin requisitos previos.",
    step1Title: "Creación de Cuenta",
    step1Desc: "Regístrate en 10 segundos para recibir al instante tus $10 000 de cartera virtual protegida.",
    step2Title: "Aprendizaje y Simulación",
    step2Desc: "Explora módulos interactivos, prueba compras/ventas y observa los movimientos reales del mercado.",
    step3Title: "Análisis y Progresión",
    step3Desc: "Habla con Gemini AI para entender tus resultados, ganar XP y subir de nivel.",
    ctaTitle: "¿Listo para dar tus primeros pasos en la Bolsa?",
    ctaSubtitle: "Únete a la comunidad de Finance Bridge hoy mismo. Sin tarjeta de crédito y sin riesgo financiero.",
    ctaButton: "Acceder a la plataforma",
    footerDisclaimer: "Finance Bridge es un entorno de simulación exclusivamente educativo. Los fondos virtuales y análisis no constituyen asesoramiento financiero.",
    footerLogin: "Iniciar sesión",
  },
  pt: {
    tagline: "Educação e Simulação Financeira",
    navAcademy: "Academia",
    login: "Entrar",
    signup: "Criar conta",
    liveMarkets: "MERCADOS AO VIVO (SIMULAÇÃO):",
    liveShort: "AO VIVO:",
    heroBadge: "SIMULADOR DE TRADING V4.8 • COM GEMINI AI",
    heroTitle1: "Domine a Bolsa e os Mercados",
    heroTitle2: "sem arriscar um único centavo.",
    heroSubtitle1: "Pratique o investimento em ações com ",
    heroSubtitleBold: "$10.000 virtuais",
    heroSubtitle2: " baseados em cotações reais, guiado em tempo real pelo nosso mentor de IA.",
    startFree: "Começar Gratuitamente",
    langTitle: "Mudar idioma",
    pillRisk: "0 € de Risco Financeiro",
    pillCapital: "$10.000 de Saldo Virtual",
    pillAI: "Coaching IA Gemini 24/7",
    mockupTitle: "Finance Bridge Pro Terminal — Prévia Interativa",
    mockupLiveTrading: "● Live Trading",
    mockupActivePortfolio: "Portfólio Ativo",
    mockupTotalGain: "Lucro Total",
    mockupChartPerformance: "Desempenho da Simulação (30 Dias)",
    mockupMarketScope: "IBOVESPA + NASDAQ",
    mockupAiAnalysisTitle: "Análise IA Gemini:",
    mockupAiAnalysisQuote: "“Excelente gestão de risco! Sua exposição a semicondutores (NVDA) está trazendo resultados. Considere definir um Stop-Loss em $120.00.”",
    mockupOpenPositions: "Posições Abertas",
    mockupShares: "ações",
    featuresBadge: "PRINCIPAIS RECURSOS",
    featuresTitle: "Tudo o que você precisa para se tornar um investidor.",
    featuresSubtitle: "Um conjunto completo de ferramentas profissionais simplificadas para você progredir passo a passo.",
    featuresExplore: "Explorar",
    feat1Badge: "SIMULADOR EM TEMPO REAL",
    feat1Title: "Trading Virtual Ultra-Realista",
    feat1Desc: "Execute ordens de Compra, Venda e Stop-Loss com $10.000 virtuais nas maiores ações do mundo (AAPL, NVDA, LVMH, Cripto).",
    feat2Badge: "MENTOR IA GEMINI",
    feat2Title: "Consultor Financeiro IA 24/7",
    feat2Desc: "Tire todas as suas dúvidas com a IA Gemini. Receba análises personalizadas do seu portfólio, explicações claras e estratégias de risco.",
    feat3Badge: "ACADEMIA INTERATIVA",
    feat3Title: "Cursos e Quizzes Práticos",
    feat3Desc: "Evolua passo a passo com aulas práticas, ganhe pontos de experiência (XP), suba de nível e mantenha sua sequência diária de estudos.",
    feat4Badge: "NOTÍCIAS E NOTAS",
    feat4Title: "Notícias em Tempo Real e Notas",
    feat4Desc: "Fique atualizado com notícias globais do mercado financeiro e registre suas análises técnicas no seu diário de investimentos.",
    howBadge: "TRILHA DE APRENDIZADO",
    howTitle: "Como funciona?",
    howSubtitle: "Três passos simples para iniciar a simulação sem pré-requisitos.",
    step1Title: "Criar Conta",
    step1Desc: "Cadastre-se em 10 segundos para receber instantaneamente seus $10.000 em saldo virtual seguro.",
    step2Title: "Aprenda e Simule",
    step2Desc: "Acesse os módulos interativos, teste ordens de compra/venda e acompanhe os movimentos do mercado.",
    step3Title: "Analise e Evolua",
    step3Desc: "Converse com a Gemini AI para analisar seus resultados, acumular XP e subir de nível.",
    ctaTitle: "Pronto para dar seus primeiros passos no mercado?",
    ctaSubtitle: "Junte-se à comunidade Finance Bridge hoje. Sem cartão de crédito, sem risco financeiro.",
    ctaButton: "Acessar a plataforma",
    footerDisclaimer: "O Finance Bridge é um ambiente de simulação para fins puramente educacionais. Saldos virtuais e análises não constituem consultoria financeira.",
    footerLogin: "Entrar",
  },
  de: {
    tagline: "Finanzbildung & Börsensimulation",
    navAcademy: "Akademie",
    login: "Anmelden",
    signup: "Konto erstellen",
    liveMarkets: "LIVE-MÄRKTE (SIMULATION):",
    liveShort: "LIVE:",
    heroBadge: "TRADING-SIMULATOR V4.8 • POWERED BY GEMINI AI",
    heroTitle1: "Meistern Sie die Börse & Märkte",
    heroTitle2: "ohne einen einzigen Cent zu riskieren.",
    heroSubtitle1: "Üben Sie das Investieren an der Börse mit ",
    heroSubtitleBold: "10.000 $ virtuellem Startkapital",
    heroSubtitle2: " basierend auf echten Marktkursen, begleitet von unserem KI-Mentor.",
    startFree: "Kostenlos starten",
    langTitle: "Sprache ändern",
    pillRisk: "0 € Finanzielles Risiko",
    pillCapital: "10.000 $ Virtuelles Startkapital",
    pillAI: "Gemini KI-Coaching 24/7",
    mockupTitle: "Finance Bridge Pro Terminal — Interaktive Vorschau",
    mockupLiveTrading: "● Live Trading",
    mockupActivePortfolio: "Aktives Portfolio",
    mockupTotalGain: "Gesamtgewinn",
    mockupChartPerformance: "Simulations-Performance (30 Tage)",
    mockupMarketScope: "DAX 40 + NASDAQ",
    mockupAiAnalysisTitle: "Gemini KI-Analyse:",
    mockupAiAnalysisQuote: "„Hervorragendes Risikomanagement! Ihre Halbleiter-Position (NVDA) zahlt sich aus. Sichern Sie ggf. mit einem Stop-Loss bei 120,00 $ ab.“",
    mockupOpenPositions: "Offene Positionen",
    mockupShares: "Aktien",
    featuresBadge: "HAUPTFUNKTIONEN",
    featuresTitle: "Alles, was Sie brauchen, um ein erfolgreicher Investor zu werden.",
    featuresSubtitle: "Eine umfassende Suite professioneller Tools, verständlich aufbereitet für Ihren stetigen Fortschritt.",
    featuresExplore: "Entdecken",
    feat1Badge: "ECHTZEIT-SIMULATOR",
    feat1Title: "Ultra-realistisches virtuelles Trading",
    feat1Desc: "Platzieren Sie Kauf-, Verkaufs- und Stop-Loss-Orders mit 10.000 $ Startkapital auf führende weltweite Aktien (AAPL, NVDA, LVMH, DAX, Krypto).",
    feat2Badge: "GEMINI KI-MENTOR",
    feat2Title: "24/7 KI-Finanzberater",
    feat2Desc: "Fragen Sie die Gemini KI jederzeit. Erhalten Sie maßgeschneiderte Portfolio-Analysen, klare Erklärungen und Strategien zum Risikomanagement.",
    feat3Badge: "SPIELERISCHE AKADEMIE",
    feat3Title: "Interaktive Kurse & Quiz",
    feat3Desc: "Lernen Sie Schritt für Schritt mit interaktiven Lektionen, sammeln Sie XP, steigen Sie im Level auf und halten Sie Ihren täglichen Lernstreak.",
    feat4Badge: "NACHRICHTEN & NOTIZEN",
    feat4Title: "Live-Nachrichten & Notizbuch",
    feat4Desc: "Bleiben Sie mit Echtzeit-Finanznachrichten auf dem Laufenden und halten Sie Ihre Marktanalysen in Ihrem Anleger-Tagebuch fest.",
    howBadge: "LERNPFAD",
    howTitle: "Wie funktioniert es?",
    howSubtitle: "Drei einfache Schritte zum Starten der Simulation ohne Vorkenntnisse.",
    step1Title: "Konto Erstellen",
    step1Desc: "Melden Sie sich in 10 Sekunden an und erhalten Sie sofort 10.000 $ risikofreies Startguthaben.",
    step2Title: "Lernen & Simulieren",
    step2Desc: "Erkunden Sie interaktive Lektionen, testen Sie Kauf- und Verkaufsorders und beobachten Sie Kursbewegungen.",
    step3Title: "Analysieren & Aufsteigen",
    step3Desc: "Tauschen Sie sich mit der Gemini KI aus, sammeln Sie XP und steigen Sie in neue Stufen auf.",
    ctaTitle: "Bereit für Ihre ersten Schritte an der Börse?",
    ctaSubtitle: "Werden Sie noch heute Teil der Finance Bridge Community. Keine Kreditkarte erforderlich, null finanzielles Risiko.",
    ctaButton: "Zur Plattform wechseln",
    footerDisclaimer: "Finance Bridge ist eine Simulationsumgebung für reine Bildungszwecke. Virtuelle Gelder und KI-Analysen stellen keine Finanzberatung dar.",
    footerLogin: "Anmelden",
  },
  zh: {
    tagline: "金融教育与股市模拟平台",
    navAcademy: "学院",
    login: "登录",
    signup: "创建账号",
    liveMarkets: "实时市场行情（模拟）：",
    liveShort: "实时：",
    heroBadge: "交易模拟器 V4.8 • 由 GEMINI AI 驱动",
    heroTitle1: "掌握股市与全球金融市场",
    heroTitle2: "零风险，零资金损失。",
    heroSubtitle1: "利用 ",
    heroSubtitleBold: "10,000 美元虚拟资金",
    heroSubtitle2: " 体验实时真实股市行情交易，并在 AI 导师和互动课程的实时指导下稳步提升。",
    startFree: "免费开始",
    langTitle: "更改语言",
    pillRisk: "0 资金风险",
    pillCapital: "10,000 美元虚拟资金",
    pillAI: "24/7 Gemini AI 智能辅导",
    mockupTitle: "Finance Bridge 专业终端 — 交互式预览",
    mockupLiveTrading: "● 实时交易",
    mockupActivePortfolio: "活跃投资组合",
    mockupTotalGain: "总收益",
    mockupChartPerformance: "模拟收益表现（30天）",
    mockupMarketScope: "标普500 + 纳斯达克",
    mockupAiAnalysisTitle: "Gemini AI 智能分析：",
    mockupAiAnalysisQuote: "“出色的风险管理！您在半导体板块（NVDA）的布局正在获得良好收益，建议在 120.00 美元设置止损保护。”",
    mockupOpenPositions: "持仓明细",
    mockupShares: "股",
    featuresBadge: "核心功能",
    featuresTitle: "助您成为专业投资者所需的一切工具。",
    featuresSubtitle: "简单易用的全套专业金融工具，助您循序渐进掌握投资技巧。",
    featuresExplore: "探索",
    feat1Badge: "实时模拟器",
    feat1Title: "超拟真虚拟交易",
    feat1Desc: "利用 10,000 美元虚拟资金，在包括苹果、英伟达、LVMH 及加密资产在内的全球市场上执行买入、卖出和止损订单。",
    feat2Badge: "GEMINI AI 导师",
    feat2Title: "24/7 AI 专属金融顾问",
    feat2Desc: "随时向 Gemini AI 提问。获得针对您投资组合的个性化深度分析、通俗易懂的知识解析与风控策略指导。",
    feat3Badge: "趣味互动学院",
    feat3Title: "进阶课程与测验",
    feat3Desc: "通过互动式课程循序渐进学习，赢取 XP 经验值、升级勋章并保持每日学习打卡。",
    feat4Badge: "实时资讯与投资笔记",
    feat4Title: "市场新闻与复盘笔记",
    feat4Desc: "实时掌握全球财经快讯，并在您的专属投资者交易日记中记录技术分析与心得复盘。",
    howBadge: "学习路径",
    howTitle: "如何开始？",
    howSubtitle: "无需任何前置门槛，只需三步即可开启无风险模拟交易。",
    step1Title: "快速注册账号",
    step1Desc: "10秒快速注册，即刻获得 10,000 美元专属虚拟安全模拟账户。",
    step2Title: "学习与实操模拟",
    step2Desc: "学习互动课程模块，体验实时挂单买入卖出，观察真实市场走势。",
    step3Title: "智能复盘与进阶",
    step3Desc: "与 Gemini AI 深入复盘每一笔交易，赢取经验值并解锁更高投资段位。",
    ctaTitle: "准备好开启您的股市投资之旅了吗？",
    ctaSubtitle: "立即加入 Finance Bridge 投资社区。无需绑定信用卡，零任何资金风险。",
    ctaButton: "立即进入平台",
    footerDisclaimer: "Finance Bridge 仅用于金融教育与模拟演练。平台内虚拟资金与 AI 生成分析不构成任何专业投资咨询建议。",
    footerLogin: "登录",
  }
};

export default function LandingPage({ onOpenAuth, onStartGuest, lang = "en", onLanguageChange }: LandingPageProps) {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = lang in LANDING_TEXTS ? lang : "en";
  const texts = LANDING_TEXTS[currentLang];
  const activeLangInfo = LANGUAGE_DATA[currentLang] || LANGUAGE_DATA.en;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    try {
      localStorage.setItem("finance_bridge_language", code);
    } catch {}
    setIsLangOpen(false);
  };

  const features = [
    {
      icon: BarChart3,
      badge: texts.feat1Badge,
      title: texts.feat1Title,
      description: texts.feat1Desc,
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-400"
    },
    {
      icon: Bot,
      badge: texts.feat2Badge,
      title: texts.feat2Title,
      description: texts.feat2Desc,
      color: "from-indigo-500 to-purple-600",
      accent: "text-purple-400"
    },
    {
      icon: GraduationCap,
      badge: texts.feat3Badge,
      title: texts.feat3Title,
      description: texts.feat3Desc,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400"
    },
    {
      icon: Newspaper,
      badge: texts.feat4Badge,
      title: texts.feat4Title,
      description: texts.feat4Desc,
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
          
          {/* Left: Logo, Brand Name & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
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
                <p className="text-[10px] text-white font-mono tracking-wider uppercase" style={{ color: "#ffffff" }}>{texts.tagline}</p>
              </div>
            </div>

            {/* Language Selector Dropdown Button (Left Positioned) */}
            <div className="relative ml-1 sm:ml-2" ref={langDropdownRef}>
              <button
                type="button"
                id="landing-language-selector-btn"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all cursor-pointer shadow-xs"
                title={texts.langTitle}
                aria-label={texts.langTitle}
                aria-expanded={isLangOpen}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? "rotate-180 text-indigo-400" : ""}`} />
              </button>

              {/* Language Dropdown Popover */}
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-48 bg-[#0b1021] border border-slate-700/90 rounded-2xl p-1.5 shadow-2xl shadow-black/80 z-50 overflow-hidden"
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        {texts.langTitle}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {LANGUAGES.map((l) => {
                        const isCurrent = l.code === currentLang;
                        const data = LANGUAGE_DATA[l.code] || { flag: "🌐", name: l.label, short: l.code.toUpperCase() };
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => handleSelectLanguage(l.code)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                                : "text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm leading-none">{data.flag}</span>
                              <span className="font-sans">{data.name}</span>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            <a href="#academy" onClick={scrollToSection("academy")} className="hover:text-indigo-400 transition cursor-pointer">{texts.navAcademy}</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              {texts.login}
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5 sm:gap-2"
              style={{ color: "#ffffff" }}
            >
              <span>{texts.signup}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Live Ticker Banner */}
      <div className="bg-[#0b1021] border-b border-slate-800/80 py-2.5 overflow-hidden select-none flex items-center">
        <div className="shrink-0 z-10 bg-[#0b1021] pl-4 pr-5 py-0.5 border-r border-slate-800/80 flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-white" style={{ color: "#ffffff" }}>{texts.liveMarkets}</span>
          <span className="sm:hidden text-white" style={{ color: "#ffffff" }}>{texts.liveShort}</span>
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
          <span style={{ color: "#ffffff" }}>{texts.heroBadge}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          {texts.heroTitle1} <br className="hidden sm:inline" />
          <span className="text-white font-black" style={{ color: "#ffffff" }}>
            {texts.heroTitle2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-white text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal" style={{ color: "#ffffff" }}>
          {texts.heroSubtitle1}<strong className="text-white font-bold" style={{ color: "#ffffff" }}>{texts.heroSubtitleBold}</strong>{texts.heroSubtitle2}
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onOpenAuth("signup")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 border border-indigo-400/30"
            style={{ color: "#ffffff" }}
          >
            <span style={{ color: "#ffffff" }}>{texts.startFree}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Highlights Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span style={{ color: "#ffffff" }}>{texts.pillRisk}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <DollarSign className="w-4 h-4 text-indigo-400" />
            <span style={{ color: "#ffffff" }}>{texts.pillCapital}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Bot className="w-4 h-4 text-purple-400" />
            <span style={{ color: "#ffffff" }}>{texts.pillAI}</span>
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
              <span className="ml-2 text-white font-bold hidden sm:inline" style={{ color: "#ffffff" }}>{texts.mockupTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {texts.mockupLiveTrading}
              </span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 text-left">
            
            {/* Left Column: Portfolio Stat Card & Chart */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0a0f22] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">{texts.mockupActivePortfolio}</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">$11 420,50 USD</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">{texts.mockupTotalGain}</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">+14.20% (+$1 420,50)</div>
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="p-5 rounded-2xl bg-[#0a0f22] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{texts.mockupChartPerformance}</span>
                  <span className="text-indigo-400 font-bold">{texts.mockupMarketScope}</span>
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
                  <span>{texts.mockupAiAnalysisTitle}</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                  {texts.mockupAiAnalysisQuote}
                </p>
              </div>

              {/* Positions List */}
              <div className="p-4 rounded-2xl bg-[#0a0f22] border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-bold pb-1">{texts.mockupOpenPositions}</div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div>
                    <span className="text-white font-bold block">AAPL</span>
                    <span className="text-[10px] text-slate-400">10 {texts.mockupShares}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">$2 245,00 (+8.2%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div>
                    <span className="text-white font-bold block">NVDA</span>
                    <span className="text-[10px] text-slate-400">15 {texts.mockupShares}</span>
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
              {texts.featuresBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              {texts.featuresTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4">
              {texts.featuresSubtitle}
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
                    <span>{texts.featuresExplore}</span>
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
            {texts.howBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            {texts.howTitle}
          </h2>
          <p className="text-slate-300 text-sm mt-3">
            {texts.howSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              01
            </div>
            <h3 className="text-xl font-bold text-white">{texts.step1Title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {texts.step1Desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              02
            </div>
            <h3 className="text-xl font-bold text-white">{texts.step2Title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {texts.step2Desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center font-mono">
              03
            </div>
            <h3 className="text-xl font-bold text-white">{texts.step3Title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {texts.step3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-700/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10">
            {texts.ctaTitle}
          </h2>
          
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed relative z-10">
            {texts.ctaSubtitle}
          </p>

          <div className="pt-2 flex justify-center relative z-10">
            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 hover:from-indigo-400 hover:to-indigo-400 shadow-2xl shadow-indigo-500/40 transition-all transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center gap-3 border border-indigo-300/40"
              style={{ color: "#ffffff" }}
            >
              <span>{texts.ctaButton}</span>
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
            {texts.footerDisclaimer}
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 Finance Bridge</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="hover:text-white transition cursor-pointer"
            >
              {texts.footerLogin}
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
