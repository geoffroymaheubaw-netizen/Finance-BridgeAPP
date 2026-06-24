import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Lock, 
  Search, 
  Calculator, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  PieChart, 
  Coins, 
  Lightbulb, 
  ChevronRight, 
  ChevronDown, 
  Info,
  Calendar,
  Percent,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesTabProps {
  profile: UserProfile;
  lang: string;
  t: (key: string) => string;
}

// Full localized summarizes mapping
interface LessonSummary {
  id: string;
  title: string;
  module: string;
  concept: string;
  points: string[];
  goldenRule: string;
  category: "basics" | "diversification" | "psychology" | "analysis" | "risk";
  formula?: {
    name: string;
    expression: string;
    explanation: string;
  };
}

export default function NotesTab({ profile, lang, t }: NotesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "completed" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("l1_1");

  // Calclulator States
  const [calcType, setCalcType] = useState<"pe" | "dividend" | "dca">("pe");
  // PE Calculator
  const [pePrice, setPePrice] = useState<number>(150);
  const [peEarnings, setPeEarnings] = useState<number>(7.5);
  // Dividend Calculator
  const [divAmount, setDivAmount] = useState<number>(4.2);
  const [divPrice, setDivPrice] = useState<number>(85);
  // DCA Calculator
  const [dcaMonthly, setDcaMonthly] = useState<number>(200);
  const [dcaRate, setDcaRate] = useState<number>(8);
  const [dcaYears, setDcaYears] = useState<number>(10);

  // Summaries localized content
  const summaries: Record<string, LessonSummary[]> = {
    fr: [
      {
        id: "l1_1",
        module: "Niveau 1",
        title: "Qu'est-ce qu'une action ?",
        concept: "Une action représente une fraction du capital d'une entreprise publique ou privée.",
        category: "basics",
        points: [
          "Détention de part : Vous possédez officiellement un morceau de l'entreprise (LVMH, Apple, Schneider, etc.).",
          "Droit de vote : Permet de voter lors des assemblées générales annuelles sur la gouvernance.",
          "Dividende : Part de profit distribuée périodiquement aux actionnaires (non obligatoire).",
          "Responsabilité limitée : Si l'entreprise fait faillite, votre perte maximale est limitée à votre montant investi initial. Personne ne peut s'en prendre à vos biens personnels."
        ],
        goldenRule: "Investir dans une action, c'est acheter une entreprise, pas seulement un ticket de loterie fluctuant."
      },
      {
        id: "l1_2",
        module: "Niveau 1",
        category: "basics",
        title: "La loi de l'offre et de la demande",
        concept: "Le prix des actions oscille selon le rapport de force constant entre acheteurs et vendeurs.",
        points: [
          "Demande excédentaire : S'il y a beaucoup d'acheteurs et peu de vendeurs, le prix monte pour équilibrer le marché.",
          "Offre excédentaire : S'il y a peu d'acheteurs et beaucoup de vendeurs qui paniquent, le prix chute.",
          "Facteurs fondamentaux : Bénéfices, innovations, politique monétaire, de bonnes prévisions futures augmentent la demande.",
          "Confiance géopolitique : Les mauvaises nouvelles créent une méfiance, causant des ventes massives et un vide d'acheteurs."
        ],
        goldenRule: "À court terme, le marché est une machine à voter (émotions) ; à long terme, c'est une balance à peser (la valeur réelle)."
      },
      {
        id: "l1_3",
        module: "Niveau 1",
        category: "basics",
        title: "Indices Nationaux et Mondiaux",
        concept: "Un indice boursier est un panier de valeurs représentatives d'un pays ou d'un secteur d'activité.",
        points: [
          "S&P 500 : Regroupe les 500 plus grandes entreprises américaines, l'indicateur universel.",
          "NASDAQ : Indice à forte dominante technologique (Apple, Nvidia, Microsoft, Alphabet).",
          "CAC 40 : Thermomètre du marché français représentant les 40 champions multinationaux français.",
          "Utilité boursière : Permet de mesurer d'un seul coup d'œil la direction générale d'un pays, et sert de repère pour mesurer la performance des investisseurs."
        ],
        goldenRule: "Les indices reflètent la tendance collective à long terme de l'innovation humaine et de la croissance économique."
      },
      {
        id: "l2_1",
        module: "Niveau 2",
        category: "diversification",
        title: "ETFs : Les portefeuilles instantanés",
        concept: "Un ETF (Exchange Traded Fund ou Tracker) est un fonds d'investissement coté en continu qui réplique la performance d'un indice.",
        points: [
          "Diversification instantanée : Grâce à un seul ETF S&P 500 ou MSCI World, vous investissez d'un coup dans des centaines d'entreprises.",
          "Frais extrêmement limités : Généralement moins de 0.2% par an, comparé à 2% pour les fonds traditionnels gérés activement par des banquiers.",
          "Simplicité d'échange : S'échange en bourse de la même manière qu'une action individuelle.",
          "Performance : Plus de 85% des gestionnaires de fonds professionnels n'arrivent pas à battre un simple ETF de marché sur le long terme."
        ],
        goldenRule: "Arrêtez de chercher l'aiguille dans la botte de foin, achetez carrément la botte de foin grâce aux ETFs."
      },
      {
        id: "l2_2",
        module: "Niveau 2",
        category: "diversification",
        title: "L'art de la diversification",
        concept: "Répartition intelligente du capital pour annihiler ou réduire les risques spécifiques.",
        points: [
          "Les types de secteurs : Équilibrez entre Tech (croissance), Santé (défensif), Consommation de base, Matières premières et Énergie.",
          "Diversification géographique : Évitez de vous limiter à votre pays d'origine (Biais Domestique). Pensez USA, Europe, Asie.",
          "Risque idiosyncratique : Risque propre à une seule entreprise (ex: scandale de fraude, incendie d'usine). La diversification le réduit presque à zéro.",
          "Unité : Même si une action de votre panier sombre de 50%, son impact sur un portefeuille de 25 actions très diversifiées sera inférieur à 2%."
        ],
        goldenRule: "Ne mettez jamais tous vos œufs dans le même panier, même s'il paraît extrêmement solide aujourd'hui."
      },
      {
        id: "l2_3",
        module: "Niveau 2",
        category: "diversification",
        title: "Diversification par classes d'actifs",
        concept: "L'allocation au-delà des actions pour stabiliser la structure globale de votre patrimoine.",
        points: [
          "Les Actions : Moteurs de croissance de votre portefeuille avec une volatilité plus élevée.",
          "Les Obligations : Titres de dette d'État ou d'entreprise générant des revenus fixes d'intérêts (coupons), plus stables que les actions.",
          "L'Or physique : Actif de couverture ultime en cas de krach majeur, de perte de foi dans les devises papier ou de forte inflation.",
          "Liquidités : Réserves en trésorerie ou livrets pour saisir de belles soldes lors des krachs boursiers."
        ],
        goldenRule: "Une bonne classe d'actifs doit monter quand les autres tanguent pour absorber la tempête."
      },
      {
        id: "l3_1",
        module: "Niveau 3",
        category: "psychology",
        title: "Ordre de bourse : Au marché ou Limité ?",
        concept: "Méthodes de transmission pour spécifier la vitesse d'exécution ou les limites de prix exigées.",
        points: [
          "Ordre au marché : Exécution immédiate au premier prix disponible sur le carnet d'ordres. Dangereux en cas de panique ou de faible volatilité.",
          "Ordre limité : Priorise le prix plutôt que la vitesse. Vous fixez un prix maximal pour acheter, ou un prix minimal pour vendre.",
          "Avantage de la Limite : Évite de subir des déviations de prix absurdes ou des 'flash crashes'.",
          "Attente : Si le cours spécifié n'est jamais touché, l'ordre expire simplement sans frais dans la plupart des courtiers."
        ],
        goldenRule: "Utilisez presque exclusivement des ordres limités pour rester maître de votre budget d'acquisition."
      },
      {
        id: "l3_2",
        module: "Niveau 3",
        category: "psychology",
        title: "FOMO et Psychologie comportementale",
        concept: "Contrôle des biais cognitifs qui ruinent la majorité des décisionnaires débutants.",
        points: [
          "FOMO (Fear Of Missing Out) : Peur d'avoir raté la fusée. Elle force à acheter de façon irréfléchie au plus haut d'une bulle.",
          "Panique en baisse : Vendre sous le coup de la douleur après une correction passagère de 10% (vendre bas après avoir acheté haut).",
          "DCA (Dollar Cost Averaging) : Investir une somme fixe chaque mois, quel que soit l'état du marché, pour lisser le coût d'acquisition.",
          "Discipline : Les pires décisions sont prises le soir en observant l'écran. Établissez une stratégie passive à froid."
        ],
        goldenRule: "Le pire ennemi de l'investisseur n'est pas le marché ou la volatilité, c'est le reflet dans son miroir."
      },
      {
        id: "l3_3",
        module: "Niveau 3",
        category: "psychology",
        title: "Horizon d'investissement",
        concept: "Le laps de temps durant lequel vous pouvez laisser votre argent grandir sans y toucher.",
        points: [
          "Court terme (1 à 3 ans) : Inadapté aux actions. Les fluctuations aléatoires peuvent forcer à liquider à perte.",
          "Long terme (10 ans et +) : Les risques de perte en bourses diminuent drastiquement. L'histoire prouve qu'un S&P 500 diversifié sur 15 ans n'a jamais été perdant.",
          "Intérêts composés : Vos gains réinvestis recommencent à leur tour à générer des gains de manière exponentielle.",
          "Tranquillité : Rend inutile d'analyser le marché à la minute. Les vagues de corrections ressemblent à de petits détails sur l'océan."
        ],
        goldenRule: "Le temps passé sur le marché est infiniment plus payant que d'essayer de deviner le timing idéal."
      },
      {
        id: "l4_1",
        module: "Niveau 4",
        category: "analysis",
        title: "Le P/E Ratio (Price-to-Earnings)",
        concept: "Indicateur universel d'évaluation comptable pour savoir si une action est sous-évaluée ou chère.",
        formula: {
          name: "Ratio Price to Earnings (P/E)",
          expression: "P/E = Cours de l'Action / Bénéfice Par Action (BPA)",
          explanation: "Indique combien de fois l'investisseur accepte de payer le bénéfice de l'entreprise. Un P/E de 20 signifie que l'action coûte 20 ans de bénéfices."
        },
        points: [
          "P/E Bas (ex: < 12) : Rejette un profil jugé décoté ou en situation difficile, ou une opportunité d'or sous-évaluée.",
          "P/E Élevé (ex: > 35) : Entreprise technologique à très forte croissance espérée par les marchés, ou entreprise dangereusement surévaluée.",
          "Comparaison indispensable : Comparez toujours le P/E de firmes d'un même secteur (ex: comparer Coca-Cola avec Pepsi, pas avec Tesla).",
          "BPA (Bénéfice par Action) : Se calcule en divisant le bénéfice net global par le nombre total d'actions en circulation."
        ],
        goldenRule: "Un P/E n'est jamais magique; un ratio bas cache parfois un piège de valeur (Value Trap), creusez plus loin."
      },
      {
        id: "l4_2",
        module: "Niveau 4",
        category: "analysis",
        title: "Le Bilan Comptable en Bourse",
        concept: "La photographie instantanée de la santé globale, des forces et faiblesses d'une multinationale.",
        points: [
          "Les Actifs : Tout ce que l'entreprise possède (cash, usines, marques, machines, stocks de marchandises).",
          "Les Passifs : Tout ce que l'entreprise doit (dettes bancaires, dettes fournisseurs, capitaux propres injectés).",
          "Trésorerie nette : Cash disponible après déduction des obligations immédiates. Indispensable pour traverser les grandes récessions.",
          "Ratio d'endettement : S'assurer que les dettes ne dépassent pas largement plusieurs années de bénéfice opérationnel."
        ],
        goldenRule: "Les bénéfices sont une opinion, la trésorerie et la solidité du bilan comptable sont des faits réels."
      },
      {
        id: "l4_3",
        module: "Niveau 4",
        category: "analysis",
        title: "Le Rendement du Dividende (Dividend Yield)",
        concept: "Gage de l'efficacité de la distribution en espèces d'un actif par rapport à un autre placement.",
        formula: {
          name: "Rendement de Dividende (Dividend Yield)",
          expression: "Rendement (%) = (Dividende Annuel / Cours de l'Action) x 100",
          explanation: "Permet de comparer l'efficacité du versement de cash à un livret d'épargne ou à une obligation."
        },
        points: [
          "Rendement durable (2% à 5%) : Sûr, sain et généralement couvert par de réels flux de trésorerie confortables.",
          "Piège de rendement (> 10%) : Souvent une illusion créée par un effondrement récent du cours de l'action. Signal d'une coupe imminente.",
          "Aristocrates du Dividende : Entreprises réputées augmentant leur dividende chaque année consécutive depuis plus de 25 ans (ex: Procter & Gamble, McDonald's).",
          "Payout Ratio (Ratio de distribution) : Pourcentage du bénéfice reversé. Idéalement sous 65% pour que la firme conserve du capital d'autofinancement."
        ],
        goldenRule: "Préfèrez un dividende en croissance constante et entièrement couvert par le trésor à un taux mirobolant intenable."
      },
      {
        id: "l5_1",
        module: "Niveau 5",
        category: "risk",
        title: "Effet de levier et Stop-Loss",
        concept: "Mécanismes avancés de gestion de la marge boursière et clés de préservation contre les baisses sévères.",
        points: [
          "Effet de Levier : Emprunter de l'argent auprès du courtier pour multiplier la taille d'une position. Multiplie les gains, mais aussi les pertes de manière dévastatrice.",
          "Stop-Loss : Seuil de sécurité qui émet un ordre de vente automatique dès que le prix baisse en dessous de votre limite de tolérance au risque.",
          "La Règle du 1% : Ne risquez jamais plus de 1% à 2% de votre capital total sur une seule transaction ouverte.",
          "Appel de Marge (Margin Call) : Scénario d'horreur où le courtier liquide de force vos positions car vos garanties sont insuffisantes."
        ],
        goldenRule: "L'effet de levier est une arme à double tranchant redoutable. Utilisez toujours un Stop-Loss pour couper court aux désastres."
      },
      {
        id: "l5_2",
        module: "Niveau 5",
        category: "risk",
        title: "Cycles de marché : Bull & Bear",
        concept: "L'alternance historique inévitable entre les phases d'euphorie et les phases d'anxiété économique.",
        points: [
          "Bull Market (Marché haussier) : Caractérisé par la confiance, l'accès au crédit facile, une économie énergique et des valorisations haussières.",
          "Bear Market (Marché baissier) : Chute des indices de 20% ou plus par rapport au sommet récent. Phase de pessimisme poussée par la hausse des taux boursiers ou récessions.",
          "Le Taureau et l'Ours : Le Taureau frappe du bas vers le haut avec ses cornes (hausse), tandis que l'Ours griffe du haut vers le bas (baisse).",
          "Outil historique : Les corrections économiques sont périodiques et inévitables. Moins d'un an en moyenne est nécessaire pour initier à nouveau un cycle haussier."
        ],
        goldenRule: "La peur dans la rue est le meilleur moment pour accumuler de somptueux actifs à des prix soldés."
      },
      {
        id: "l5_3",
        module: "Niveau 5",
        category: "risk",
        title: "Allocation d'Actifs Statégique",
        concept: "La conception sur-mesure de votre portefeuille de répartition de capitaux.",
        points: [
          "Profil Conservateur : Privilégie la sécurité (ex: 70% Obligations, 15% Or, 15% Actions résilientes). Conservateur du patrimoine.",
          "Profil Équilibré : Le classique (ex: 50% Actions, 40% Obligations, 10% Or / Matières Premières).",
          "Profil Dynamique : Recherche activement la croissance (ex: 85% Actions de secteur, 10% ETFs, 5% Cryptos alternatives).",
          "Le Rebalancement : Processus annuel visant à vendre une partie des actifs ayant trop monté pour racheter ceux ayant baissé, afin de maintenir votre cible d'origine."
        ],
        goldenRule: "L'allocation d'actifs détermine plus de 90% de la performance à long terme de votre patrimoine, le choix des actions individuelles seulement 10%."
      }
    ],
    en: [
      {
        id: "l1_1",
        module: "Level 1",
        category: "basics",
        title: "What is a Stock?",
        concept: "A stock represents fractional ownership in a corporation.",
        points: [
          "Ownership Share: When you buy a stock (e.g., Apple or LVMH), you officially own a tiny piece of that company.",
          "Voting Rights: Provides the right to participate and vote on major decisions at annual general meetings.",
          "Dividends: A fraction of company net profits distributed to shareholders (not mandatory).",
          "Limited Liability: If the business defaults, your maximum loss is strictly capped at your initial investment. Your personal assets are perfectly safe."
        ],
        goldenRule: "Buying a stock means purchasing a real underlying business, not a mere volatile computer line."
      },
      {
        id: "l1_2",
        module: "Level 1",
        category: "basics",
        title: "The Law of Supply and Demand",
        concept: "Stock prices fluctuate based on the continuous tug-of-war between buyers and sellers.",
        points: [
          "Excess Demand: When many investors wish to buy but few want to sell, the price moves up to seek equilibrium.",
          "Excess Supply: When panic occurs and many sellers flood the exit with few buyers, the price declines.",
          "Underlying Factors: Revenue growth, cost reductions, interest rates, and confidence directly drive demand.",
          "Confidence Gaps: Bad geopolitical or macro news hurts trust, generating sales and evaporating buyer demand."
        ],
        goldenRule: "In the short term, the market is a voting machine (emotions); in the long term, it is a weighing scale (earnings)."
      },
      {
        id: "l1_3",
        module: "Level 1",
        category: "basics",
        title: "National and Global Indices",
        concept: "A stock market index is a select basket of representative stocks measuring a specific country or sector.",
        points: [
          "S&P 500: Groups the 500 largest US corporations, making it the supreme barometer of global equity health.",
          "NASDAQ: A tech-heavy index housing industry giants like Apple, Nvidia, and Microsoft.",
          "CAC 40: Tracks the 40 multinational giants on the French stock market (luxury, industry, energy).",
          "Benchmark Utility: Acts as a standard reference gauge to assess whether custom active portfolios beat passive performance."
        ],
        goldenRule: "Stock market indices reflect the long-term collective growth of human ingenuity and business power."
      },
      {
        id: "l2_1",
        module: "Level 2",
        category: "diversification",
        title: "ETFs: Instant Portfolios",
        concept: "An Exchange Traded Fund (ETF) tracks a market index to provide instant diversification.",
        points: [
          "Broad Diversification: A single S&P 500 ETF deposits hundreds of underlying companies into your account instantly.",
          "Extremely Low Fees: Typically costs <0.2% annually, compared to 2.0% for traditional actively managed bank funds.",
          "Frictionless Trading: Trade in real-time on stock exchanges just like individual company shares.",
          "Superior Returns: Roughly 85%+ of professional money managers fail to beat passive indices over a 15-year horizon."
        ],
        goldenRule: "Don't search for individual needles; buy the entire haystack with ETFs."
      },
      {
        id: "l2_2",
        module: "Level 2",
        category: "diversification",
        title: "The Art of Diversification",
        concept: "Spreading capital carefully to lower concentration risks.",
        points: [
          "Sectors Mix: Align holdings across diverse industries (Tech, Healthcare, Energy, Financials, Consumer Goods).",
          "Geographic Reach: Prevent domestic bias; allocate assets to US, European, and emerging global markets.",
          "Idiosyncratic Risk: Company-specific dangers (e.g., local scandals or fires). Diversification minimizes this to near-zero.",
          "Calculus of Safety: Even if a single position drops 50%, the impact on a 25-stock diversified portfolio is well below 2%."
        ],
        goldenRule: "Never put all your eggs in one single basket, no matter how sturdy it looks."
      },
      {
        id: "l2_3",
        module: "Level 2",
        category: "diversification",
        title: "Diversification by Asset Classes",
        concept: "Managing asset groups beyond stocks to solidify your net wealth.",
        points: [
          "Equities (Stocks): Growth engines with higher historic yields but increased short-term volatility.",
          "Bonds: Certificates of loan paying regular coupon interest; safe shock absorbers for capital.",
          "Physical Gold: The absolute safety buffer when currencies deflate, credit cracks, or inflation spikes.",
          "Cash Deposits: Readily liquid reserves to safely purchase undervalued stocks during severe market slides."
        ],
        goldenRule: "A robust portfolio possesses assets that rise when others sink to balance the overall trend."
      },
      {
        id: "l3_1",
        module: "Level 3",
        category: "psychology",
        title: "Market vs Limit Orders",
        concept: "Trading triggers configured to prioritize either speed of transaction or cost boundaries.",
        points: [
          "Market Order: Executes instantly at whatever random price is available. Very risky inside thin markets or panic.",
          "Limit Order: Prioritizes absolute price. Sets the maximum buying budget or minimum selling boundary.",
          "Slippage Protection: Safely locks execution thresholds to avoid bad surprises during high-volatility sessions.",
          "Patience: If the targeted price is never reached, the order expires harmlessly with zero fees."
        ],
        goldenRule: "Lean on limit orders to safeguard your exact acquisition price."
      },
      {
        id: "l3_2",
        module: "Level 3",
        category: "psychology",
        title: "FOMO & Behavior Dynamics",
        concept: "Mastering the cognitive and emotional pitfalls that sabotage standard retail traders.",
        points: [
          "FOMO (Fear Of Missing Out): The impulse to purchase high during parabolic rallies due to greed.",
          "Loss Aversion: The dangerous urge to sell at market bottoms due to short-term pain, crystallizing paper losses.",
          "DCA Strategy: Splittng investments into monthly fixed amounts to smooth acquisition averages without market timing.",
          "Rules First: Establish passive automatic processes of saving rather than reacting to volatile hourly charts."
        ],
        goldenRule: "The investor's primary risk is never the market itself; it is the person sitting in front of the screen."
      },
      {
        id: "l3_3",
        module: "Level 3",
        category: "psychology",
        title: "Investment Horizon",
        concept: "The duration of time your capital has to compound undisturbed.",
        points: [
          "Short-term (1-3 years): Highly vulnerable to market cycles; bad timing can force liquidation of stocks at double-digit losses.",
          "Long-term (10+ years): Historical cycles smooth out entirely. Over 15-year periods, diversified passive stocks have never lost value.",
          "Compounding Interest: Reinvested capital gains act as new seeds, accelerating the geometric appreciation curve.",
          "Serenity: Renders short-term headlines irrelevant. Day-to-day noise fades into tiny bumps on an upward mountain."
        ],
        goldenRule: "Time in the market beats trying to time the market."
      },
      {
        id: "l4_1",
        module: "Level 4",
        category: "analysis",
        title: "The P/E (Price-to-Earnings) Ratio",
        concept: "An index metric to evaluate if a stock trading price is historically cheap or bloated.",
        formula: {
          name: "Price to Earnings (P/E) Ratio",
          expression: "P/E Ratio = Share Price / Earnings Per Share (EPS)",
          explanation: "Signals the years of net earnings you pay to buy the company. A P/E of 20 means you pay 20x annual earnings."
        },
        points: [
          "Low P/E (e.g., < 12): Denotes value situations, sectors in distress, or excellent bargains on high-cash firms.",
          "High P/E (e.g., > 35): Tech stocks with explosive growth forecasts, or highly overvalued bubbles.",
          "Peer Checks: Only compare within the same industry (e.g., comparing Walmart with Target, never with Nvidia).",
          "EPS (Earnings per Share): Computed by dividing raw net profits by total outstanding share certificates."
        ],
        goldenRule: "A low P/E could be a 'value trap' of decaying business; verify the growth trends carefully."
      },
      {
        id: "l4_2",
        module: "Level 4",
        category: "analysis",
        title: "The Balance Sheet in the Stock Market",
        concept: "The instantaneous snapshot of what a multinational owns (assets) versus what it owes (liabilities).",
        points: [
          "Assets: Properties, factories, patents, inventory, and liquid cash in checking/savings accounts.",
          "Liabilities: Short-term supplier lines, long-term bank bonds, and investor equity capital.",
          "Net Cash: Readily deployable cash minus outstanding debts. A high buffer protects firms during credit squeezes.",
          "Debt-to-Equity: Ensures a firm relies on solid capital reserves rather than leveraged debt to finance operations."
        ],
        goldenRule: "Earnings can be manipulated by accountants; the hard cash and balance sheet reflect literal reality."
      },
      {
        id: "l4_3",
        module: "Level 4",
        category: "analysis",
        title: "Dividend Yield",
        concept: "The annual cash flow generated by an asset compared to its market value.",
        formula: {
          name: "Dividend Yield (%)",
          expression: "Dividend Yield = (Annual Dividend Per Share / Share Price) * 100",
          explanation: "Compares current stock cash return directly against sovereign bond rates or savings accounts."
        },
        points: [
          "Safe Yield (2% to 5%): Supported by deep free cash flows; typical of healthy, mature companies.",
          "Monster Yield (> 10%): Generally a yield trap. Result of a crashing stock price, signalling impending cuts.",
          "Dividend Aristocrats: Blue-chip institutions raising cash distributions for 25+ consecutive years.",
          "Dividend Payout Ratio: The % of net profits disbursed; should generally reside under 60% for future capital security."
        ],
        goldenRule: "Prioritize consistent dividend growth backed by strong cash flow over high but shaky yields."
      },
      {
        id: "l5_1",
        module: "Level 5",
        category: "risk",
        title: "Leverage and Stop-Loss",
        concept: "Adducing tactical debt margins alongside swift protective liquidation targets.",
        points: [
          "Margin Leverage: Borrowing from broker to size up. Multiplies gains but triggers catastrophic wipeouts on slight dips.",
          "Stop-Loss: Automatic stop orders triggering automated sales once a specified downside boundary is breached.",
          "The 1% Standard: Protect capital reserves by never risking more than 1% of total portfolio net value on any open trade.",
          "Margin Call: When assets plummet, the broker liquidates positions automatically to collect their loan back."
        ],
        goldenRule: "Leverage is a dangerous double-edged sword. Put a Stop-Loss in place to prevent complete ruin."
      },
      {
        id: "l5_2",
        module: "Level 5",
        category: "risk",
        title: "Market Cycles and Bull/Bear",
        concept: "The historic rhythm of optimism and anxiety defining world economics.",
        points: [
          "Bull Market: Characterized by confidence, easy credit, climbing earnings, and optimistic price trajectories.",
          "Bear Market: A drop of 20% or more on major indices from peak levels, driven by rate hikes, panics, or recession.",
          "The Mascot Animals: The Bull thrusts upward with its horns (rising prices), while the Bear swipes down with its paws.",
          "Cyclical Context: Downturns are temporary buying sales; history shows equity indices always regain paths to new peaks."
        ],
        goldenRule: "Maximum investor pessimism is historically the safest period to buy solid assets at heavily discounted prices."
      },
      {
        id: "l5_3",
        module: "Level 5",
        category: "risk",
        title: "Strategic Asset Allocation",
        concept: "Structuring a resilient portfolio tailored to your unique financial timeline.",
        points: [
          "Conservative: Focus on preservation (70% Government Bonds, 15% Gold, 15% Blue-Chip Equities).",
          "Balanced: The classic 50/40/10 structure to seek growth while dampening market swings.",
          "Dynamic: Growth emphasis (80%+ Equities, 10% Market Indexes, 5% Alternative Assets like crypto).",
          "Portfolio Rebalancing: Selling high performers to buy lagging assets periodically, restoring your desired target weights."
        ],
        goldenRule: "Strategic asset allocation determines over 90% of long-term returns; stock picks account for under 10%."
      }
    ]
  };

  const getLocalizedList = (): LessonSummary[] => {
    return summaries[lang] || summaries["en"];
  };

  const currentSummaries = getLocalizedList();

  // Categories helper text
  const categoriesList = [
    { id: "all", label: lang === "fr" ? "Toutes les catégories" : "All Categories" },
    { id: "basics", label: lang === "fr" ? "Bases de la Bourse" : "Market Basics" },
    { id: "diversification", label: lang === "fr" ? "Diversification" : "Diversification" },
    { id: "psychology", label: lang === "fr" ? "Psychologie & DCA" : "Psychology & DCA" },
    { id: "analysis", label: lang === "fr" ? "Analyse Fondamentale" : "Fundamental Analysis" },
    { id: "risk", label: lang === "fr" ? "Gestion des Risques" : "Risk Management" }
  ];

  // Filter based on search and selected filter type
  const filteredSummaries = currentSummaries.filter(summary => {
    // 1. Search Query
    const searchString = `${summary.title} ${summary.concept} ${summary.points.join(" ")}`.toLowerCase();
    if (searchQuery && !searchString.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Completion State
    const isCompleted = profile.completedLessons.includes(summary.id);
    if (filterType === "completed" && !isCompleted) return false;
    if (filterType === "locked" && isCompleted) return false;

    // 3. Category Filter
    if (categoryFilter !== "all" && summary.category !== categoryFilter) return false;

    return true;
  });

  // Calculate complete count
  const completedCount = currentSummaries.filter(s => profile.completedLessons.includes(s.id)).length;

  return (
    <div className="space-y-8" id="notes-tab-container">
      {/* Header section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-950/35">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === "fr" ? "Fiches de Révision" : "Study Sheets"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === "fr" ? "Nos Notes de Cours" : "Lecture Summaries"}
            </h1>
            <p className="text-slate-450 dark:text-slate-405 text-sm max-w-xl font-medium leading-relaxed">
              {lang === "fr" 
                ? "Retrouvez ici le condensé stratégique de toutes les notions acquises et formules clés de vos cours de bourse interactifs." 
                : "Browse detailed summaries, guidelines, and formula guides representing everything learned across your modules."}
            </p>
          </div>
          
          {/* Progress Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white relative shadow-md">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {lang === "fr" ? "Statut Global" : "Mastery Status"}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-indigo-300">{completedCount}</span>
                <span className="text-xs text-slate-500 font-semibold">/ {currentSummaries.length} {lang === "fr" ? "acquis" : "mastered"}</span>
              </div>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
                  style={{ width: `${(completedCount / currentSummaries.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Revision Guide & Filters */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Rechercher par mot-clé (ex: P/E, ETF, dividende)..." : "Search notes by keyword..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 text-sm font-semibold transition shadow-inner"
                />
              </div>

              {/* Status Filter Tab */}
              <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-1">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    filterType === "all"
                      ? "bg-slate-900 text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {lang === "fr" ? "Tous" : "All"}
                </button>
                <button
                  onClick={() => setFilterType("completed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    filterType === "completed"
                      ? "bg-slate-900 text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {lang === "fr" ? "Acquis" : "Unlocked"}
                </button>
                <button
                  onClick={() => setFilterType("locked")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    filterType === "locked"
                      ? "bg-slate-900 text-white dark:bg-indigo-600 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-505" />
                  {lang === "fr" ? "À débloquer" : "Locked"}
                </button>
              </div>
            </div>

            {/* Category Filters row */}
            <div className="flex flex-wrap gap-1.5">
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    categoryFilter === cat.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-650 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action on empty */}
          {filteredSummaries.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500">
              <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-base font-extrabold text-slate-750 dark:text-slate-250 mb-1">
                {lang === "fr" ? "Aucune fiche trouvée" : "No summary sheet found"}
              </p>
              <p className="text-xs max-w-xs mx-auto mb-4">
                {lang === "fr" 
                  ? "Modifiez vos filtres de recherche ou complétez des leçons pour générer des notes acquises."
                  : "Try clearing search filters or matching other criteria."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setFilterType("all");
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-850 font-bold text-xs rounded-lg cursor-pointer"
              >
                {lang === "fr" ? "Réinitialiser les filtres" : "Reset Filters"}
              </button>
            </div>
          ) : (
            /* Summaries Accordion List */
            <div className="space-y-4">
              {filteredSummaries.map((summary) => {
                const isCompleted = profile.completedLessons.includes(summary.id);
                const isExpanded = expandedId === summary.id;
                
                return (
                  <div 
                    key={summary.id}
                    className={`bg-white dark:bg-slate-950 border rounded-2xl transition-all overflow-hidden ${
                      isExpanded 
                        ? "border-indigo-500/80 shadow-md ring-1 ring-indigo-500/10" 
                        : "border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 hover:shadow-2xs"
                    }`}
                  >
                    {/* Header line */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : summary.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                            summary.module.includes("1") || summary.module.includes("basics")
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                              : summary.module.includes("2") || summary.category === "diversification"
                              ? "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
                              : summary.module.includes("3")
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                          }`}>
                            {summary.module}
                          </span>

                          {/* Completion Badge */}
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              {lang === "fr" ? "Masterisé" : "Acquired"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                              <Lock className="w-2.5 h-2.5" />
                              {lang === "fr" ? "À valider" : "Locked"}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition truncate-clip">
                          {summary.title}
                        </h3>

                        <p className="text-xs text-slate-450 dark:text-slate-505 font-medium line-clamp-1">
                          {summary.concept}
                        </p>
                      </div>

                      <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-450 self-center">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Expandable summary review template */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeInOut" }}
                        >
                          <div className="border-t border-slate-100 dark:border-slate-850 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
                            {/* Key Concept summary */}
                            <div className="flex items-start gap-3 bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-xs font-black text-slate-505 uppercase tracking-wide">
                                  {lang === "fr" ? "Concept Fondamental" : "Core Concept"}
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-slate-750 dark:text-slate-300">
                                  {summary.concept}
                                </p>
                              </div>
                            </div>

                            {/* Bullet Points of course info */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                                {lang === "fr" ? "Points clés à retenir" : "Key Takeaways"}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {summary.points.map((pt, index) => (
                                  <div 
                                    key={index}
                                    className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-2 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold transition hover:border-slate-200"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                                    <span>{pt}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Render associated mathematical formulas if any */}
                            {summary.formula && (
                              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 space-y-2 border border-indigo-900/40 relative overflow-hidden">
                                <div className="absolute right-2 bottom-0 opacity-10 pointer-events-none">
                                  <Percent className="w-32 h-32" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-indigo-400" />
                                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                                    {lang === "fr" ? "Formule Mathématique clé" : "Key Financial Formula"}
                                  </span>
                                </div>
                                <div className="font-mono text-sm sm:text-base font-bold bg-slate-950/70 py-2.5 px-3.5 rounded-lg inline-block border border-slate-800 shadow-inner">
                                  {summary.formula.expression}
                                </div>
                                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                                  {summary.formula.explanation}
                                </p>
                              </div>
                            )}

                            {/* Golden rule / Summary sentence quote card */}
                            <div className="border-l-4 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/10 p-3.5 rounded-r-xl">
                              <p className="text-xs italic text-indigo-850 dark:text-indigo-300 font-extrabold leading-relaxed">
                                &ldquo; {summary.goldenRule} &rdquo;
                              </p>
                            </div>

                            {/* Help guide message if locked */}
                            {!isCompleted && (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 justify-end">
                                <Info className="w-3.5 h-3.5" />
                                <span>
                                  {lang === "fr" 
                                    ? "Complétez la leçon associée dans l'onglet 'Apprentissage' pour débloquer de l'XP !"
                                    : "Complete this module under the 'Learning' tab for permanent mastery rewards."}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Key Formulas simulator / Playground */}
        <div className="lg:col-span-4 space-y-6">
          {/* Formulator Simulator Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                {lang === "fr" ? "Atelier de Calcul Interactif" : "Interactive Playground"}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-505 font-semibold">
                {lang === "fr"
                  ? "Manipulez les variables financières étudiées en cours pour en assimiler la mécanique réelle."
                  : "Input variables to see how indicators react dynamically in real-world scenarios."}
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => setCalcType("pe")}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  calcType === "pe"
                    ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-xs"
                    : "text-slate-505 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                P/E Ratio
              </button>
              <button
                type="button"
                onClick={() => setCalcType("dividend")}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  calcType === "dividend"
                    ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-xs"
                    : "text-slate-505 hover:text-slate-300"
                }`}
              >
                {lang === "fr" ? "Dividende" : "Dividend"}
              </button>
              <button
                type="button"
                onClick={() => setCalcType("dca")}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  calcType === "dca"
                    ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-xs"
                    : "text-slate-505 hover:text-slate-300"
                }`}
              >
                DCA
              </button>
            </div>

            {/* Calculations Render Container */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-850/60 shadow-inner">
              {calcType === "pe" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                      {lang === "fr" ? "Bénéfice Net : Ratio de valorisation" : "P/E Calculation model"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      P/E = {lang === "fr" ? "Cours de l'action / Bénéfice Par Action" : "Price / Earnings Per Share"}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Input 1 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Cours de l'action (€)" : "Share Price ($)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{pePrice} €</span>
                      </label>
                      <input 
                        type="range"
                        min="5"
                        max="800"
                        step="5"
                        value={pePrice}
                        onChange={(e) => setPePrice(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>

                    {/* Input 2 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Bénéfice Par Action - BPA" : "Earnings Per Share (EPS)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{peEarnings.toFixed(2)} €</span>
                      </label>
                      <input 
                        type="range"
                        min="0.5"
                        max="50"
                        step="0.5"
                        value={peEarnings}
                        onChange={(e) => setPeEarnings(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Result Panel */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3.5 mt-4 text-center">
                    <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-widest">{lang === "fr" ? "Ratio calculé" : "Resulting P/E Ratio"}</p>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono my-1">
                      {(pePrice / peEarnings).toFixed(1)}x
                    </div>
                    
                    {/* Interpretation */}
                    <div className="mt-2.5 inline-block text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 shadow-inner">
                      {pePrice / peEarnings < 12 ? (
                        <span className="text-emerald-500">🍀 {lang === "fr" ? "Décoté / Peut-être bon marché" : "Underpriced / Cheap Value"}</span>
                      ) : pePrice / peEarnings > 30 ? (
                        <span className="text-rose-500">⚠️ {lang === "fr" ? "Très cher / Forte croissance requise" : "Overpriced / Growth justified"}</span>
                      ) : (
                        <span className="text-indigo-500">✓ {lang === "fr" ? "Valorisation standard de marché" : "Fair value model / Average"}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {calcType === "dividend" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                      {lang === "fr" ? "Flux de Trésorerie Passif" : "Passive cashflow model"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {lang === "fr" ? "Versement / Valeur d'entrée" : "Yield = Annual Dividend / Purchase Price"}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Input 1 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Cours d'acquisition de l'action" : "Purchase Price ($)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{divPrice} €</span>
                      </label>
                      <input 
                        type="range"
                        min="10"
                        max="400"
                        step="5"
                        value={divPrice}
                        onChange={(e) => setDivPrice(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>

                    {/* Input 2 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Dividende annuel net par action" : "Annual Dividend Amount ($)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{divAmount.toFixed(2)} €</span>
                      </label>
                      <input 
                        type="range"
                        min="0.25"
                        max="30"
                        step="0.25"
                        value={divAmount}
                        onChange={(e) => setDivAmount(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Result Panel */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3.5 mt-4 text-center">
                    <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-widest">{lang === "fr" ? "Rendement net estimé" : "Calculated Net Yield"}</p>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono my-1">
                      {((divAmount / divPrice) * 100).toFixed(2)}%
                    </div>
                    
                    {/* Interpretation */}
                    <div className="mt-2.5 inline-block text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 shadow-inner">
                      {(divAmount / divPrice) * 100 > 10 ? (
                        <span className="text-rose-500">🔥 {lang === "fr" ? "Alerte : Trop élevé / Piège suspect" : "Yield Trap Alert / Unstable"}</span>
                      ) : (divAmount / divPrice) * 100 >= 2 ? (
                        <span className="text-emerald-500">✓ {lang === "fr" ? "Rendement sain et soutenable" : "Healthy & Sustainable yield"}</span>
                      ) : (
                        <span className="text-slate-400">⚖️ {lang === "fr" ? "Rendement faible (Action Crois.)" : "Low Yield / Typical of growth shares"}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {calcType === "dca" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                      {lang === "fr" ? "La Magie des Intérêts Composés" : "Magic of Compound Interest"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {lang === "fr" ? "Investissement régulier (DCA)" : "Regular Monthly savings model"}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Input 1 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Investissement mensuel" : "Monthly Savings ($)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{dcaMonthly} € / {lang === "fr" ? "mois" : "mo"}</span>
                      </label>
                      <input 
                        type="range"
                        min="25"
                        max="1000"
                        step="25"
                        value={dcaMonthly}
                        onChange={(e) => setDcaMonthly(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>

                    {/* Input 2 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Rendement annuel estimé (%)" : "Estimated Annual return (%)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{dcaRate}% / {lang === "fr" ? "an" : "yr"}</span>
                      </label>
                      <input 
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={dcaRate}
                        onChange={(e) => setDcaRate(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>

                    {/* Input 3 */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-extrabold flex justify-between">
                        <span>{lang === "fr" ? "Nombre d'années" : "Investment Horizon (yrs)"}</span>
                        <span className="font-mono text-indigo-500 font-bold">{dcaYears} {lang === "fr" ? "ans" : "yrs"}</span>
                      </label>
                      <input 
                        type="range"
                        min="2"
                        max="40"
                        step="1"
                        value={dcaYears}
                        onChange={(e) => setDcaYears(Number(e.target.value))}
                        className="w-full accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Calculations math for DCA compounded */}
                  {(() => {
                    const totalMonths = dcaYears * 12;
                    const r = dcaRate / 100 / 12; // monthly rate
                    
                    let finalAmount = 0;
                    for (let m = 0; m < totalMonths; m++) {
                      finalAmount = (finalAmount + dcaMonthly) * (1 + r);
                    }
                    
                    const investedCapital = dcaMonthly * totalMonths;
                    const profitsGenerated = finalAmount - investedCapital;

                    return (
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-3.5 mt-3 space-y-2">
                        <div className="text-center">
                          <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-widest">
                            {lang === "fr" ? "Capital Final Estimé" : "Projected Compounded Value"}
                          </p>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono my-1">
                            {Math.round(finalAmount).toLocaleString()} €
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase text-center mt-2.5">
                          <div className="bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 block">{lang === "fr" ? "Investi" : "Deposits"}</span>
                            <span className="text-slate-700 dark:text-slate-300 font-mono">{Math.round(investedCapital).toLocaleString()} €</span>
                          </div>
                          <div className="bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span className="text-emerald-500 block">{lang === "fr" ? "Intérêts générés" : "Interest earned"}</span>
                            <span className="text-emerald-500 font-mono">+{Math.round(profitsGenerated).toLocaleString()} €</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            {/* Quick tips notice */}
            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {lang === "fr" ? "Astuce de l'IA" : "AI Lesson Prompt"}
                </span>
                <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 leading-relaxed font-semibold">
                  {lang === "fr"
                    ? "Besoin d'approfondir un concept précis ? Copiez-le et interrogez notre 'Conseiller de bourse IA' pour un cours sur-mesure ou une mise en pratique historique interactive."
                    : "Want deeper context? Copy any key ratio or concept and ask your custom AI Advisor for immediate historical stock breakdowns."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
