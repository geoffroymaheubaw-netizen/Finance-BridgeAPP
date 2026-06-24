import React, { useState, useMemo } from "react";
import { 
  Search, 
  Newspaper, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  BookOpen,
  LineChart,
  DollarSign,
  Maximize2,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface NewsTabProps {
  lang: string;
  t: (key: string) => string;
}

interface NewsArticle {
  id: string;
  category: "macro" | "markets" | "crypto" | "learning" | "commodities" | "forex";
  title: Record<string, string>;
  summary: Record<string, string>;
  fullContent: Record<string, string>;
  expertTakeaway: Record<string, string>;
  source: string;
  timestamp: Record<string, string>;
  sentiment: "positive" | "negative" | "neutral";
  isShockNews?: boolean;
}

// Highly educational stock tickers simulation inside news for visual learning
interface MiniTicker {
  symbol: string;
  name: string;
  normalPrice: number;
  shockPrice: number;
  changeNormal: number;
  changeShock: number;
}

const MINI_TICKERS: MiniTicker[] = [
  { symbol: "AAPL", name: "Apple", normalPrice: 182.50, shockPrice: 164.25, changeNormal: 1.45, changeShock: -10.00 },
  { symbol: "MSFT", name: "Microsoft", normalPrice: 415.20, shockPrice: 382.10, changeNormal: -0.62, changeShock: -7.95 },
  { symbol: "NVDA", name: "NVIDIA", normalPrice: 875.12, shockPrice: 717.60, changeNormal: 4.82, changeShock: -18.00 },
  { symbol: "COIN", name: "Coinbase", normalPrice: 242.10, shockPrice: 154.90, changeNormal: 3.20, changeShock: -36.00 }
];

// Helper to resolve highly relevant educational and news source URLs based on article metadata
const getArticleUrl = (article: NewsArticle, lang: string): string => {
  const category = article.category;
  const title = article.title[lang] || article.title["en"] || "";
  const titleLower = title.toLowerCase();
  
  if (category === "crypto" || titleLower.includes("crypto") || titleLower.includes("bitcoin") || titleLower.includes("actifs numériques")) {
    if (titleLower.includes("halving") || titleLower.includes("division")) {
      return "https://www.coindesk.com/learn/bitcoin-halvings-history-and-why-they-matter/";
    }
    if (titleLower.includes("sec") || titleLower.includes("etf")) {
      return "https://www.coindesk.com/policy/2024/01/10/sec-approves-first-regulated-spot-bitcoin-etfs-in-us/";
    }
    return `https://www.coindesk.com/search?s=${encodeURIComponent(title)}`;
  }
  
  if (category === "forex" || titleLower.includes("forex") || titleLower.includes("dollar") || titleLower.includes("euro") || titleLower.includes("eur/usd") || titleLower.includes("taux de change")) {
    return `https://www.dailyfx.com/search?q=${encodeURIComponent(title)}`;
  }
  
  if (category === "learning" || titleLower.includes("ratio") || titleLower.includes("p/e") || titleLower.includes("per") || titleLower.includes("diversification") || titleLower.includes("dollar cost averaging") || titleLower.includes("calcul") || titleLower.includes("dividende")) {
    if (titleLower.includes("p/e") || titleLower.includes("per") || titleLower.includes("ratio")) {
      return "https://www.investopedia.com/terms/p/price-earningsratio.asp";
    }
    if (titleLower.includes("diversif") || titleLower.includes("panier")) {
      return "https://www.investopedia.com/investing/importance-diversification/";
    }
    if (titleLower.includes("dividende") || titleLower.includes("coupon") || titleLower.includes("yield")) {
      return "https://www.investopedia.com/terms/d/dividend.asp";
    }
    if (titleLower.includes("dca") || titleLower.includes("dollar-cost") || titleLower.includes("moyen")) {
      return "https://www.investopedia.com/terms/d/dollarcostaveraging.asp";
    }
    if (titleLower.includes("etf") || titleLower.includes("tracker")) {
      return "https://www.investopedia.com/terms/e/etf.asp";
    }
    return `https://www.investopedia.com/search?q=${encodeURIComponent(title)}`;
  }

  if (category === "commodities" || titleLower.includes("or ") || titleLower.includes("gold") || titleLower.includes("matières premières") || titleLower.includes("pétrole") || titleLower.includes("cuivre")) {
    if (titleLower.includes("or ") || titleLower.includes("gold")) {
      return "https://www.cnbc.com/gold-commodities/";
    }
    if (titleLower.includes("pétrole") || titleLower.includes("oil")) {
      return "https://www.cnbc.com/oil-commodities/";
    }
    return `https://www.cnbc.com/search/?query=${encodeURIComponent(title)}&q=commodities`;
  }
  
  if (category === "macro" || titleLower.includes("fed") || titleLower.includes("bce") || titleLower.includes("inflation") || titleLower.includes("taux d'intérêt") || titleLower.includes("dette")) {
    if (titleLower.includes("fed") || titleLower.includes("fomc") || titleLower.includes("réserve fédérale")) {
      return "https://www.cnbc.com/federal-reserve/";
    }
    if (titleLower.includes("bce") || titleLower.includes("ecb") || titleLower.includes("banque centrale européenne")) {
      return "https://www.cnbc.com/european-central-bank/";
    }
    if (titleLower.includes("inflation") || titleLower.includes("prix")) {
      return "https://www.cnbc.com/inflation/";
    }
    return `https://www.cnbc.com/search/?query=${encodeURIComponent(title)}`;
  }
  
  return `https://news.google.com/search?q=${encodeURIComponent(title + " " + article.source)}`;
};

export default function NewsTab({ lang, t }: NewsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("_default_all_news_");
  const [activeShock, setActiveShock] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Set default search bar string to blank and handle correctly
  const displaySearchQuery = searchQuery === "_default_all_news_" ? "" : searchQuery;

  // Rich database of dual-state translated financial news
  const newsDatabase: NewsArticle[] = useMemo(() => [

  {
    "id": "std_1",
    "category": "macro",
    "title": {
      "fr": "La Fed maintient temporairement les taux d'intérêt inchangés : espoir d'un atterrissage en douceur",
      "en": "Fed holds key interest rates steady: growing hopes for a soft landing of the global economy",
      "pt": "Fed mantém taxas de juros inalteradas: cresce esperança de pouso suave na economia",
      "es": "La Fed mantiene las tasas de interés estables: crecen esperanzas de un aterrizaje suave",
      "de": "Fed belässt Leitzinsen unverändert: wachsende Hoffnung auf weiche Landung der Wirtschaft",
      "zh": "美聯準會宣布維持利率不變：全球經濟實現「軟著陸」希望大增"
    },
    "summary": {
      "fr": "La banque centrale américaine conforte l'espoir d'instaurer un contrôle durable de l'inflation globale sans provoquer de récession immédiate.",
      "en": "The US central bank confirms attempts to establish steady control over global inflation without triggering an immediate industrial recession.",
      "pt": "O banco central dos EUA confirma tentativas de estabilizar a inflação global de maneira sustentada, evitando recessão imediata.",
      "es": "El banco central de EE.UU. confirma esfuerzos para controlar la inflación global de manera sostenida, sin causar una recesión severa.",
      "de": "Die US-Notenbank versucht, die weltweite Inflation nachhaltig zu dämpfen, ohne eine unmittelbare Rezession auszulösen.",
      "zh": "美聯準會維持利率不變，旨在在不引致實體經濟立即陷入衰退的情況下，冷卻高企的通貨膨脹率。"
    },
    "fullContent": {
      "fr": "Le Comité de politique monétaire (FOMC) a unanimement voté pour maintenir son taux d'intérêt de référence dans la fourchette de 5,25% à 5,50%. Cette pause stratégique offre aux marchés mondiaux une stabilité précieuse, tandis que l'inflation sous-jacente s'oriente progressivement vers l'objectif de 2% de long terme. Les économistes décryptent cette manœuvre comme l'évitement progressif de la récession, favorisant des opportunités d'épargne d'intérêt composés pour les investisseurs avisés.",
      "en": "The Federal Open Market Committee (FOMC) unanimously voted to maintain its benchmark interest rate in the 5.25%-5.50% range. This strategic pause injects welcome stability into global stock indices while core inflation trends slowly down toward the 2% target. Analysts describe this pattern as the perfect 'goldilocks scenario' for passive capital assets and compound interest growth.",
      "pt": "O Comitê Federal de Mercado Aberto (FOMC) votou por manter a taxa básica de juros no intervalo de 5,25% a 5,50%. Essa pausa estratégica injeta estabilidade nos mercados mundiais, enquanto a inflação núcleo ruma em direção à meta de 2%. Analistas descrevem esse padrão como o cenário ideal para ativos passivos e investimentos de longo prazo.",
      "es": "El Comité Federal de Mercado Abierto (FOMC) votó por unanimidad mantener las tasas de interés en el rango de 5.25%-5.50%. Esta pausa estratégica inyecta estabilidad en los índices mundiales, mientras la inflación subyacente desciende lentamente hacia la meta del 2%. Los analistas describen este escenario como ideal para el interés compuesto a largo plazo.",
      "de": "Der Offenmarktausschuss der Fed (FOMC) hat einstimmig beschlossen, den Leitzins im Bereich von 5,25 % bis 5,50 % zu belassen. Diese strategische Pause sorgt für willkommene Stabilität an den internationalen Aktienmärkten, während sich die Kerninflation allmählich dem 2%-Ziel nähert. Ökonomen werten dies als Anzeichen für ein erfolgreiches Rezessionsvermeidungsszenario.",
      "zh": "聯邦公開市場委員會（FOMC）投票決定維持 5.25% 至 5.50% 年利率目標區間不變。這項決策為股票指數注入了穩定性，核心通膨也往 2% 長期目標穩步滑落。分析師指出這可謂完美的「金髮女孩經濟」，對定期定額及被動指數投資極為有利。"
    },
    "expertTakeaway": {
      "fr": "Les taux d'intérêt sont le prix de l'argent. Quand ils arrêtent de monter, la pression sur les actions diminue car le coût d'endettement des entreprises cesse de s'alourdir.",
      "en": "Interest rates are the baseline cost of borrowing money. When central rates stabilize, pressure on tech stocks decreases because business expanding expense stops growing.",
      "pt": "As taxas de juros representam o custo do dinheiro. Quando param de subir, a pressão sobre as ações diminui, pois o custo de endividamento empresarial cessa de encarecer.",
      "es": "Las tasas de interés representan el costo del dinero prestado. Cuando las tasas se estabilizan, la presión sobre las acciones tecnológicas cede debido a que el costo de deuda no aumenta.",
      "de": "Zinsen sind die 'Kosten für Geld'. Wenn der Zinsgipfel erreicht ist, lässt der Abwärtsdruck auf Aktien nach, da sich die Refinanzierungskosten der Unternehmen nicht weiter verteuern.",
      "zh": "利率本質上是銀行的借款成本。當基準利率不再攀升，企業擴張時的融資利息負擔停止增加，這通常利多科技股與指數型資產走勢。"
    },
    "source": "FinTech Insight",
    "timestamp": {
      "fr": "Il y a 1 heure",
      "en": "1 hour ago",
      "pt": "Há 1 hora",
      "es": "Hace 1 hora",
      "de": "Vor 1 Stunde",
      "zh": "1 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_2",
    "category": "markets",
    "title": {
      "fr": "La diversification s'avère plus rentable que la spéculation brute sur indices selon une étude",
      "en": "Academic study reveals asset diversification outperforms raw speculative single-name picks on average",
      "pt": "Estudo acadêmico revela que diversificação sistemática supera a especulação concentrada na maioria dos casos",
      "es": "Un estudio revela que la diversificación sistemática supera la especulación concentrada de acciones",
      "de": "Akademische Studie belegt: Breite Risikostreuung übertrifft konzentrierte Spekulation langfristig deutlich",
      "zh": "學術追蹤研究證實：長期而言，分散風險投資組合勝率遠高於單押個股投機"
    },
    "summary": {
      "fr": "Analyser 50 ans d'histoire de bourse montre que les portefeuilles construits par briques d'ETF globaux battent 91% des spéculateurs de court terme.",
      "en": "Analyzing 50 years of data demonstrates that global diversified portfolios holding index ETFs consistently beat 91% of short-term traders.",
      "pt": "Análises de 50 anos de bolsa demonstram que carteiras diversificadas segurando ETFs de índice superam 91% dos traders de curto prazo.",
      "es": "El análisis de 50 años de datos de bolsa demuestra que carteras diversificadas de ETFs globales superan a más del 91% de traders a corto plazo.",
      "de": "Die Auswertung von 50 Jahren Börsendaten zeigt, dass diversifizierte Index-Portfolios über 91% aller kurzfristig agierenden Spekulanten schlagen.",
      "zh": "追蹤 50 年美股市歷史數據顯示，透過全球 ETF 組建的分散型配置組合，其長期回報擊敗了超過 91% 的短線當沖投機者。"
    },
    "fullContent": {
      "fr": "Une chaire de recherche en gestion de patrimoine a publié son rapport sur les comportements des particuliers. Les résultats confirment l'importance de s'écarter du bruit quotidien du marché. La détention d'une pluralité de titres mondiaux de manière passive, combinée aux dividendes réinvestis, garantit le plein potentiel de l'intérêt composé. Les investisseurs actifs sous-performent l'indice de référence à cause des frais de courtage et du stress psychologique des fluctuations.",
      "en": "A leading financial research center published a major study tracking retail investor returns over 50 years. The evidence solidifies the passive index investing model. Holding diverse global companies while reinvesting yields leverages the mathematical power of compound interest. Meanwhile, hyperactive speculative trading hurts long-term wealth because of transaction fees and emotional decisions.",
      "pt": "Um prestigiado de pesquisa financeira demonstrou que investir em índices globais passivos gera riqueza estável no longo prazo. Reinvestir lucros e dividendos permite que os juros compostos atuem exponencialmente sobre o capital inicial. O ato de comprar e vender freneticamente corrói os ganhos via taxas operacionais.",
      "es": "Un importante centro de investigación financiera demostró que poseer índices globales pasivos genera riqueza de forma sólida. Reinvertir dividendos permite el despegue exponencial del interés compuesto. Por el contrario, la compraventa frenética destruye valor debido a las comisiones y emociones.",
      "de": "Eine umfassende wissenschaftliche Untersuchung hat das Verhalten von Privatanlegern analysiert. Die Ergebnisse bestätigen die mathematische Überlegenheit passiver Indexfonds (ETFs). Durch die Reinvestition von Ausschüttungen wird der Zinseszins-Effekt maximiert, während hyperaktiver Handel durch Transaktionskosten die Performance schmälert.",
      "zh": "一項頂尖金融研究追蹤散戶績效長達半個世紀，結果再次證實了「被動指數投資」的巨大優勢。持有追蹤大盤的分散型 ETF，並將配息持續滾入再投資，最能發揮複利的指數級增長魔力；而過度頻繁的當沖與個股跟風，則常常在手續費與情緒起伏中侵蝕本金。"
    },
    "expertTakeaway": {
      "fr": "Ne mettez jamais tous vos œufs dans le même panier. Posséder un mélange diversifié de secteurs (Tech, Santé, Énergie) protège votre épargne en cas de crash sectoriel.",
      "en": "Don't put all your eggs in one basket. Owning a diverse blend of industrial segments (Tech, Healthcare, Energy) acts as your shields when one sector experiences crashes.",
      "pt": "Não coloque todos os ovos na mesma cesta. Possuir uma mistura diversificada de setores garante segurança e protege suas poupanças no caso de quebras locais.",
      "es": "No pongas todos tus huevos en la misma canasta. Tener una mezcla diversificada de sectores económicos blinda tu patrimonio si un sector sufre caídas abruptas.",
      "de": "Legen Sie niemals alle Eier in einen Korb. Eine ausgewogene Verteilung über verschiedene Branchen hinweg schützt Ihr Vermögen, wenn eine Branche einbricht.",
      "zh": "千萬不要把雞蛋放在同一個籃子裡。平均配置到科技、醫療、金融等不同產業塊，能在大盤板塊輪動或單一產業重挫時化身為最堅實的防護傘。"
    },
    "source": "Academic Fund",
    "timestamp": {
      "fr": "Il y a 3 heures",
      "en": "3 hours ago",
      "pt": "Há 3 horas",
      "es": "Hace 3 horas",
      "de": "Vor 3 Stunden",
      "zh": "3 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_3",
    "category": "crypto",
    "title": {
      "fr": "Adoption institutionnelle des actifs numériques : le rôle grandissant des dépositaires d'envergure",
      "en": "Institutional digital assets integration grows as multi-billion dollar custody solutions go online",
      "pt": "Adoção institucional de criptoativos acelera após o lançamento de custódias reguladas globais",
      "es": "La adopción institucional de criptoactivos se acelera con custodios de alta escala",
      "de": "Institutionelle Krypto-Adoption schreitet voran: Milliarden-Entitäten etablieren regulierte Verwahrung",
      "zh": "傳統金融巨人進軍數位資產：百億美元規模受規管託管解決方案相繼開辦"
    },
    "summary": {
      "fr": "Les banques d'investissement proposent désormais des placements en cryptomonnaies à leurs clients fortunés, créant un pont entre finance traditionnelle et décentralisée.",
      "en": "Major investment conglomerates now offer crypto exposure products to high-net-worth clients, bridging legacy institutions with decentralized assets.",
      "pt": "Grandes conglomerados bancários passam a oferecer exposição a criptoativos para clientes private, conectando a finança legado ao mundo digital.",
      "es": "Grandes bancos de inversión comienzan a ofrecer exposición en criptoactivos estructurados a clientes premium, tendiendo puentes hacia la tecnología blockchain.",
      "de": "Namhafte Banken-Konglomerate offerieren vermögenden Privatkunden nun regulierte Krypto-Portfolios, um Legacy-Finanzen mit dezentralen Assets zu vernetzen.",
      "zh": "全球知名投資銀行開始向頂端資產階級與機構法人提供合規數位資產產品，這是傳統金融圈與去中心化鏈上技術整合的重要里程碑。"
    },
    "fullContent": {
      "fr": "L'univers crypto traverse sa mutation structurelle la plus forte. Les flux financiers ne proviennent plus seulement des spéculateurs individuels, mais de fonds de pension et d'assureurs qui y allouent de faibles pourcentages pour générer de l'Alpha. Néanmoins, la conformité réglementaire de ces infrastructures reste l'élément critique à surveiller à moyen terme.",
      "en": "The digital asset space is going through its most impactful structural change. Liquidity inflows no longer emerge primarily from retail swing traders, but from capital allocators and insurance funds designating small percentages for alpha generation. Regulators keep monitoring custody validation deeply to guarantee security.",
      "pt": "O espaço de ativos digitais passa por forte amadurecimento institucional. O fluxo financeiro não decorre meramente de traders varejistas em busca de swings rápidos, mas sim de tesourarias corporativas acumulando frações pequenas. Governos impõem regras estritas nestas operações.",
      "es": "Los activos digitales viven una madurez sin precedentes. El capital ya no es meramente minorista e informal, sino de fondos de capital soberanos y tesorerías. La regulación exhaustiva sigue siendo el eje que brindará certeza legal a largo plazo.",
      "de": "Der Markt für digitale Vermögenswerte reift weiter. Liquiditätszuflüsse stammen nicht mehr fast ausschließlich von Kleinanlegern, sondern zunehmend von Pensionskassen und Versicherungen. Regulierungsbehörden fordern hierbei maximal transparente Verwahrstandards.",
      "zh": "數位貨幣市場正經歷長遠的結構性蛻變。資金流入不再單靠散戶跟風，而有越來越多退休基金與主權金庫，配置微幅比率以優化投資組合。各國合規審核是投資人未來最需要密切追蹤的項目。"
    },
    "expertTakeaway": {
      "fr": "Les crypto-actifs sont réputés extrêmement volatils. S'ils offrent de réels relais d'accélération, ils doivent se limiter à une part marginale (ex: 2 à 5%) du capital pour éviter la foudre financière.",
      "en": "Crypto assets are extremely volatile. While offering strong potential tailwinds, they should generally be confined to small fractions (2% to 5%) of your total capital limits.",
      "pt": "Criptoativos possuem extrema volatilidade. Enquanto podem turbinar investimentos, devem estar limitados a frações modestas (2% a 5% máximo) para atenuar o risco estrito.",
      "es": "Los criptoactivos son altamente volátiles. Aunque pueden propulsar tu portafolio, deben limitarse a un pequeño margen (2% a 5%) para evitar pérdidas devastadoras.",
      "de": "Kryptowährungen sind hochgradig volatil. Während sie Kursbeschleuniger sein können, sollten sie auf kleinstmögliche Anteile (2% bis 5%) Ihres Gesamtkapitals beschränkt bleiben.",
      "zh": "加密貨幣以超高波動性著稱。雖然其爆發力誘人，但穩健的投資人一般會將此類高風險資產控制在總部位的 2% 至 5% 內，以免本金大失血。"
    },
    "source": "Decentralized Daily",
    "timestamp": {
      "fr": "Hier",
      "en": "Yesterday",
      "pt": "Ontem",
      "es": "Ayer",
      "de": "Gestern",
      "zh": "昨天"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_4",
    "category": "learning",
    "title": {
      "fr": "Le mystère du P/E Ratio (Price-to-Earnings) : comment savoir si une action est trop chère ?",
      "en": "Cracking the Price-to-Earnings (P/E) Ratio: how to determine if a stock has become overpriced",
      "pt": "Desvendando o Índice P/L (Preço sobre Lucro): saiba como descobrir se uma ação está cara",
      "es": "Entendiendo el Ratio Per (Precio-Beneficio): descubre si una acción está sobrevalorada",
      "de": "Das KGV (Kurs-Gewinn-Verhältnis) entschlüsselt: So erkennen Sie, ob eine Aktie überbewertet ist",
      "zh": "白話解析本益比（P/E Ratio）：一分鐘看懂一檔熱門股到底是昂貴還是超值？"
    },
    "summary": {
      "fr": "Le ratio cours sur bénéfices est la formule de base de l'analyse fondamentale. Apprenez à diviser le cours de l'action par son profit annuel pour évaluer son titre.",
      "en": "The price-to-earnings ratio is a fundamental concept in investing metrics. Learn how dividing stock values by annual profits reveals valuation depths.",
      "pt": "O múltiplo Preço/Lucro é o segredo central da análise fundamentalista. Dividir a cotação pelo ganho líquido anual ajuda a precificar o negócio.",
      "es": "El multiplicador Precio-Beneficio (PER) es el núcleo de la valoración del valor. Dividir el precio por las ganancias anuales permite comparar empresas.",
      "de": "Das Kurs-Gewinn-Verhältnis (KGV) ist die Kennzahl der Fundamentalanalyse. Dividieren Sie einfach den Aktienkurs durch den jährlichen Gewinn.",
      "zh": "本益比（P/E Ratio）是基本面分析最經典的入門公式。只要用股價除以每股盈餘（EPS），就能輕鬆算出需要多少年才能完全回收投資成本。"
    },
    "fullContent": {
      "fr": "Si une entreprise s'échange à un P/E de 30, cela signifie que les investisseurs acceptent de payer 30 fois ses gains annuels actuels pour détenir une part. Dans la haute technologie, les fortes perspectives de croissance justifient des P/E gonflés (parfois supérieurs à 40). En revanche, pour les valeurs bancaires traditionnelles, un P/E supérieur à 15 est plutôt considéré comme onéreux. Il faut toujours comparer les ratios au sein d'un même secteur industriel.",
      "en": "When a corporation trades at a P/E of 30, it indicates market buyers are paying 30 times its current profit per share. Technology fields historically support high P/E multiples (sometimes over 40) owing to projected exponential income expansion. Traditional companies in banking or utilities rarely exceed a P/E of 12. Context is key: never evaluate a software manufacturer's ratio using industrial hardware metrics.",
      "pt": "Se uma empresa negocia a um P/L de 30, significa que o mercado paga 30 vezes o seu lucro líquido correspondente por ação. Setores inovadores sustentam índices altos (mais de 40) devido à velocidade de expansão tecnológica vendida para o futuro. Bancos tradicionais raramente superam o múltiplo de 12.",
      "es": "Cuando una empresa cotiza a un PER de 30, el mercado paga 30 veces sus ganancias anuales. Las tecnológicas tienen ratios más elevados (a veces superiores a 40) debido a su rápido crecimiento proyectado. Sectores típicos como bancos operan a un PER de 10 a 12.",
      "de": "Ein KGV von 30 bedeutet, dass Anleger bereit sind, das 30-Fache des Jahresgewinns für die Aktie zu zahlen. Wachstumswerte im Technologiesektor weisen oft extrem hohe KGVs auf (manchmal über 40), während solide Banktitel oft nur ein KGV von 10 besitzen. Vergleichen Sie KGVs daher immer nur innerhalb derselben Branche.",
      "zh": "當一家公司的本益比為 30 倍時，代表投資人要花 30 元來換取該公司目前產出的 1 元淨利。高成長性的科技公司（如晶片巨擘）常因未來盈餘看漲而享有高於 40 倍的本益比；反之傳統公用事業或銀行股的本益比多在 10 到 15 倍。跨產業評估本益比是散戶常見的致命盲點。"
    },
    "expertTakeaway": {
      "fr": "Un P/E bas n'indique pas forcément une bonne affaire (il peut cacher une entreprise en déclin), et un P/E élevé n'indique pas une bulle financière. Utilisez ce ratio pour comparer Microsoft avec Google, pas avec Walmart.",
      "en": "A low P/E ratio doesn't strictly signal a bargain (it can indicate businesses in decay), nor does high P/E guarantee a tech bubble. Apply P/E to compare direct competitors, not different sectors.",
      "pt": "Um P/L baixo não significa barganha infalível (pode expressar decadência do negócio), nem P/L alto garante bolha. Compare competidores próximos (ex: Microsoft com Google, nunca com varejo tradicional).",
      "es": "Un PER bajo no siempre es ganga (puede haber declive oculto), ni un PER alto es burbuja. Aplícalo para comparar competidores directos, por ejemplo Google con Microsoft.",
      "de": "Ein niedriges KGV ist kein Garant für ein Schnäppchen (Gefahr einer Value-Falle), und ein hohes KGV bedeutet nicht automatisch eine Spekulationsblase. Vergleichen Sie Apple stets mit Microsoft, nicht mit Walmart.",
      "zh": "低本益比不代表撿到便宜（小心夕陽產業衰退陷阱），高本益比也不等於即將泡沫化。使用本益比時，請務必橫向對比同業競爭對手（如英特爾之於 NVIDIA，切勿將其與可口可樂進行跨界比較）。"
    },
    "source": "Educate & Grow",
    "timestamp": {
      "fr": "Il y a 3 jours",
      "en": "3 days ago",
      "pt": "Há 3 dias",
      "es": "Hace 3 dias",
      "de": "Vor 3 Tagen",
      "zh": "3 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_5",
    "category": "commodities",
    "title": {
      "fr": "L'Or atteint un sommet historique : les investisseurs cherchent un rempart solide face à l'inflation",
      "en": "Gold hits all-time highs: investors look for a robust protective shield against persistent inflation",
      "pt": "Ouro atinge recorde histórico: investidores buscam proteção robusta contra a inflação de preços",
      "es": "El Oro alcanza máximos históricos: inversores se refugian ante la inflación mundial",
      "de": "Goldpreis klettert auf Allzeithoch: Anleger suchen Schutz vor schleichender Geldentwertung",
      "zh": "黃金價格創歷史新高：全球資金尋求實體防護以對抗長期通膨與地緣風險"
    },
    "summary": {
      "fr": "Le métal jaune franchit de nouveaux records. Face à l'inflation persistante et aux doutes monétaires, l'or confirme son statut millénaire de réserve de valeur protectrice.",
      "en": "The precious yellow metal scales new record heights. Amidst persistent global inflation and concerns over paper money values, gold proves its safe-haven status.",
      "pt": "Metal precioso quebra recordes sucessivos. Frente aos temores inflacionários e de desvalorização das moedas fiduciárias, o ouro confirma seu status de porto seguro.",
      "es": "El metal precioso supera cotas nunca vistas. Frente al alza persistente del coste de vida, el oro ratifica su histórica condición de activo refugio.",
      "de": "Das Edelmetall markiert neue historische Höchststände. Getrieben von hartnäckiger Inflation und geopolitischen Krisen bestätigt Gold seine Funktion als Krisenwährung.",
      "zh": "貴金屬價格再度突破歷史高點。在惡性通膨壓力及信用貨幣購買力下降背景下，實體黃金再度擦亮其千百年来無可替代的資產保值避風港招牌。"
    },
    "fullContent": {
      "fr": "La ruée vers l'or s'intensifie sur les marchés mondiaux des matières premières. Les banques centrales continuent d'acheter massivement des lingots physiques pour diversifier leurs réserves de change. Bien que l'or ne verse aucun dividende ni intérêt (rendement réel nul en soi), sa rareté physique intrinsèque l'empêche d'être dévalué à l'infini par les planches à billets mondiales. En période d'incertitude macroéconomique, posséder de l'or fait office de pivot stabilisateur d'un portefeuille.",
      "en": "The golden rush accelerates across leading physical commodity exchanges. Sovereign reserve banks are heavily accumulating bullion bars to diversify away from unstable fiat reserves. Even though gold pays zero dividends, its ultimate scarcity prevents it from being reproduced or inflated away. In times of severe financial and monetary turbulence, holding physical assets acts as an indispensable, stabilizing pivot inside a balanced portfolios.",
      "pt": "A corrida pelo ouro físico acelera em escala internacional. Bancos centrais ao redor do mundo aumentam suas compras líquidas para diversificar as reservas estatais. Embora o metal não gere dividendos, sua escassez inerente o protege de impressões cambiais descontroladas, fornecendo um porto de paz em períodos de alta volatilidade.",
      "es": "El fervor por el oro físico se dispara. Los bancos emisores adquieren toneladas métricas de lingotes para blindar sus reservas de divisas. Aunque el metal precioso carece de cupones de dividendo, su escasez absoluta imposibilita que la emisión monetaria destruya su valor intrínseco. Poseer metales actúa como un ancla táctica en tu cuenta.",
      "de": "Die Nachfrage nach physischem Gold beschleunigt sich weltweit. Notenbanken kaufen in Rekordtempo Barren auf, um sich von Papiergeldreserven zu diversifizieren. Da Gold im Gegensatz zu Aktien keine Dividenden ausschüttet, basiert sein Wert auf physischer Verknappung. In turbulenten Börsenzeiten sichert eine Goldbeimischung das Vermögen effektiv ab.",
      "zh": "全球商品交易所對實體黃金的擠兌式買盤急遽增溫。各國中央銀行持續大手筆購入金條，以減少對不穩定主權信用貨幣的依賴。儘管黃金本身並不配發股利或孳息，但其地殼中極其有限的稀缺性，使其無法被無限量印製或稀釋。在股債雙跌的宏觀風暴中，實體保值資產是多資產配置防禦的核心。"
    },
    "expertTakeaway": {
      "fr": "L'or n'est pas un actif de rendement rapide, mais une police d'assurance. Allouer une petite part (ex: 5%) de son capital dans les matières premières permet de réduire la volatilité globale de votre épargne virtuelle face aux secousses.",
      "en": "Gold is not a hyper-growth speculative asset, but rather an insurance policy. Designating a small percentage (e.g. 5%) to precious physical commodities trims your portfolio's complete volatility.",
      "pt": "O ouro não serve para enriquecimento veloz, mas funciona como uma apólice de seguro blindada. Alocar 5% em metais ajuda a amaciar as oscilações mais brutas do simulador.",
      "es": "El oro no está pensado para la especulación rápida de capital, sino como un escudo financiero. Destinar cerca de un 5% a materias primas absorbe los golpes de caídas bursátiles de tus divisas.",
      "de": "Gold ist kein Instrument für schnelle Spekulationsgewinne, sondern eine Versicherungskarte. Eine moderate Beimischung (z.B. 5 %) schirmt Ihr Gesamtvermögen vor extremen Verlustwellen ab.",
      "zh": "黃金從來不是用來追求暴利的跟風投機工具，而是一張資產保了險的保單。在資產籃子中提撥 5% 左右配置於黃金等大宗原材料，能為你對抗大盤未知下挫時發揮避震功能。"
    },
    "source": "Commodity Watch",
    "timestamp": {
      "fr": "Il y a 6 heures",
      "en": "6 hours ago",
      "pt": "Há 6 horas",
      "es": "Hace 6 horas",
      "de": "Vor 6 Stunden",
      "zh": "6 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_6",
    "category": "forex",
    "title": {
      "fr": "Le Dollar US renforce sa suprématie : décryptage du réseau d'exportation pour l'investisseur",
      "en": "The US Dollar strengthens its grip: decoding currency value impacts on global trading firms",
      "pt": "Dólar Americano demonstra força global de refúgio: desvendando os impactos do câmbio no comércio",
      "es": "El súper dólar se consolida en el mercado Forex: claves del tipo de cambio sobre tus empresas",
      "de": "Der US-Dollar triumphiert am Devisenmarkt: Wie die Währungsstärke Exportunternehmen beeinflusst",
      "zh": "強勢美元席捲外匯市場：一文看懂匯率波動如何重塑跨國出口與股利收益"
    },
    "summary": {
      "fr": "Les écarts de taux entre l'Europe et les États-Unis poussent la paire EUR/USD à la baisse. Une aubaine pour les exportations, un défi pour les importations.",
      "en": "Diverging economic benchmarks drive the EUR/USD forex cross values lower. A massive boon for local exporters, but high costs for imports.",
      "pt": "A disparidade de rumos monetários pressiona o par de divisas EUR/USD. Cenário impulsiona companhias que vendem ao exterior, mas encarece combustíveis.",
      "es": "La divergencia de estímulos presiona la cotización de la pareja euro/dólar. Es un gran impulso para exportadoras locales pero castiga los bienes importados.",
      "de": "Die geldpolitische Kluft drückt das Devisenpaar EUR/USD nach unten. Dies beflügelt exportorientierte Unternehmen, verteuert jedoch Energieimporte.",
      "zh": "美聯儲與歐盟央行的政策差異拖累歐元兌美元匯率低迷。強勢美元對美國進口商來說是個福音，但對海外跨國企業則面臨巨大的換匯業外減損。"
    },
    "fullContent": {
      "fr": "Le marché du Forex (Foreign Exchange) est le plus grand marché financier du globe par le volume d'échange. Actuellement, la force relative du dollar par rapport aux autres devises s'explique par les taux d'intérêt élevés des obligations américaines. Pour des multinationales vendant leurs produits en Europe, cette variation de change réduit la valeur de leurs gains rapatriés. À l'inverse, les entreprises exportatrices européennes voient leurs coûts de production réduits et leurs produits devenir ultra-compétitifs aux USA.",
      "en": "The Forex (Foreign Exchange) is the single largest financial market in existence by daily volumes. Currently, the relative dominance of the US Dollar is supported by strong yields on US sovereign treasuries. When multinational corporations make European sales, converting those soft currencies back to strong dollars decreases nominal earnings statistics. Conversely, international exporters gain immediate competitive margins when trade barriers favor foreign operations.",
      "pt": "O mercado Forex (moedas) movimenta trilhões diariamente. O vigor do dólar decorre das taxas atrativas pagas pelos títulos federais norte-americanos. Para grandes gigantes tecnológicas que lucram fora dos EUA, a conversão de moedas locais desvalorizadas para o câmbio americano gera prejuízos contábeis, mostrando o papel de risco de mercado.",
      "es": "El mercado Forex (intercambio de divisas) determina el balance del comercio internacional. La tasa de rendimiento de los bonos atrae capital global al billete verde. Para corporaciones globales, un dólar fuerte devalúa proporcionalmente los beneficios extranjeros consolidados en balances anuales. El Forex exige siempre coberturas monetarias.",
      "de": "Der Forex-Markt ist der umsatzstärkste Finanzmarkt der Welt. Die Stärke des Dollars resultiert aus dem Zinsvorsprung der US-Staatsanleihen. US-Multis, die Gewinne in Europa erzielen, verzeichnen durch die Währungsumrechnung Performance-Dämpfer, während europäische Exporteure vom schwachen Euro profitieren.",
      "zh": "外匯（Forex）市場是全球日均交易量最為龐大的金融運作中樞。美元的主導地位主要受美國國債較高收益率所吸引的套利資金支持。對於在歐洲有大量營收的美股上市公司，當歐元走弱時，將盈餘匯回折算成強勢美元時會蒙受「匯兌損失（Forex Loss）」；反而歐洲本土出口商則因貨幣便宜，使商品在美國市場更具競爭力。"
    },
    "expertTakeaway": {
      "fr": "Le taux de change (Forex) est une force invisible de l'analyse fondamentale. Un investisseur averti ne regarde pas seulement les profits d'une entreprise, mais aussi la devise dans laquelle elle gagne son argent pour se protéger.",
      "en": "Exchange rate spreads (Forex) are pivotal invisible structures in global value metrics. Analysts track export footprints as thoroughly as physical profits to avoid surprise currency losses.",
      "pt": "O câmbio atua como um dreno invisível na contabilidade. Estudar a receita por moeda de origem ajuda a escolher empresas bem protegidas contra flutuações cambiais.",
      "es": "Los tipos de cambio operan como una corriente silenciosa en la valoración. Un inversor fundamentalistas estudia qué porcentaje de ventas de Apple o NVIDIA ocurre en moneda foránea.",
      "de": "Die Wechselkurse (Forex) sind ein oft unterschätzter Hebel der Fundamentalanalyse. Privatanleger sollten darauf achten, in welchen Währungsräumen Portfoliounternehmen ihre Umsätze generieren.",
      "zh": "貨幣匯率（Forex）是基本面分析中極為關鍵的隱形推手。成熟的投資人在檢視跨國財報（如 Apple 或高通）時，除了看營收增長，還必須考量美元指數對海外營收折算後的影響。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 10 heures",
      "en": "10 hours ago",
      "pt": "Há 10 horas",
      "es": "Hace 10 horas",
      "de": "Vor 10 Minuten",
      "zh": "10 小時前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_7",
    "category": "macro",
    "title": {
      "fr": "L'inflation ralentit en zone euro : vers une baisse imminente des taux de la BCE",
      "en": "Eurozone inflation slows down: ECB rate cuts highly anticipated by market strategists",
      "pt": "Inflação na zona do euro desacelera: cortes de juros do BCE são amplamente antecipados",
      "es": "La inflación en la eurozona se modera: analistas anticipan recortes de tasas por el BCE",
      "de": "Inflation in der Eurozone verlangsamt sich: EZB-Zinssenkungen rücken in greifbare Nähe",
      "zh": "歐元區通膨超預期降溫：分析師一致預期歐洲央行即將開啟降息通道"
    },
    "summary": {
      "fr": "Le ralentissement de la hausse des prix au détail à 2,1% offre une marge de manœuvre cruciale pour relancer l'activité économique européenne.",
      "en": "The retreat of retail consumer price indexes to 2.1% delivers crucial wiggle room to bolster European business expansion.",
      "pt": "O recuo do índice de preços para 2,1% abre espaço crucial para impulsionar a recuperação econômica europeia.",
      "es": "La moderación de la subida de precios al 2,1% ofrece margen de maniobra clave para reanimar la economía en Europa.",
      "de": "Der Rückgang der Teuerungsrate auf 2,1 % verschafft der Notenbank Handlungsspielraum zur Stützung der Wirtschaft.",
      "zh": "歐元區零售通膨回落至 2.1%，為歐洲央行提供了推動實體經濟復甦與借貸寬鬆的黃金窗口。"
    },
    "fullContent": {
      "fr": "L'Office européen des statistiques a confirmé un ralentissement progressif de l'inflation sous-jacente. Cette dynamique réconfortante conforte les analystes dans leurs prévisions d'une réduction imminente du coût du crédit. Pour les marchés boursiers, une baisse des taux directeurs réduira le coût de la dette des entreprises et renforcera l'attrait des actions à dividendes élevés.",
      "en": "The European Statistics Office announced a systematic decline in core price markers. Analysts solidify forecasts scheduling aggressive credit ease. For stock market index tracking, downward interest movements trim capital-expense liabilities, reinforcing high-yield dividend payouts and premium equity demand.",
      "pt": "A agência de estatísticas da UE confirmou a desaceleração sustentada dos preços. Economistas consolidam apostas em cortes imponentes nos juros do crédito. Essa dinâmica reduz a pressão sobre as tesourarias corporativas das empresas cotadas.",
      "es": "La oficina europea de estadísticas ratifica el descenso gradual de los precios básicos. Los inversores descuentan ya bajadas de tipos de interés, lo que aliviará las deudas de compañías de crecimiento.",
      "de": "Das europäische Statistikamt berichtet von einem spürbaren Rückgang der Kerninflation. Viele Analysten rechnen nun mit baldigen Zinssenkungen. Niedrigere Zinsen verringern die Finanzierungslasten börsennotierter Konzerne.",
      "zh": "歐盟統計局指出，核心通膨率已展現清晰的降溫趨勢。跨國金融機構普遍預測借貸利息政策將轉向寬鬆，這無疑將直接削減上市企業的融資持有成本，提升高股息股票與增長股的估值溢價。"
    },
    "expertTakeaway": {
      "fr": "La baisse des taux de la Banque Centrale Européenne soutient les marchés d'actions car l'argent devient moins cher à emprunter pour stimuler les investissements.",
      "en": "Downtrends in ECB direct rates foster recovery since capital becomes cheaper to borrow, encouraging industrial investments.",
      "pt": "A descida dos juros estimula as bolsas. Com o crédito mais farto e barato, as companhias retomam planos agressivos de crescimento.",
      "es": "El declive de los tipos de interés aviva la renta variable debido a que las corporaciones acceden a financiación mucho más económica.",
      "de": "Zinssenkungen der EZB wirken wie Katalysatoren für den Aktienmarkt, da sich Unternehmen günstiger für zukünftiges Wachstum finanzieren können.",
      "zh": "歐洲央行的調降利率通常是股票市場的中期強心針。當借貸資金成本下滑，上市企業能更容易發行債券籌集低成本資金，以此回購股票 ou 加速擴張。"
    },
    "source": "Euro Markets",
    "timestamp": {
      "fr": "Il y a 12 heures",
      "en": "12 hours ago",
      "pt": "Há 12 horas",
      "es": "Hace 12 horas",
      "de": "Vor 12 Stunden",
      "zh": "12 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_8",
    "category": "macro",
    "title": {
      "fr": "Dette publique mondiale : Les sommets historiques inquiètent les agences de notation",
      "en": "Global sovereign debt levels hit record highs, raising ratings red flags",
      "pt": "Dívida pública global atinge picos históricos e acende alerta em agências de rating",
      "es": "La deuda soberana global marca récords y reaviva temores de sostenibilidad monetaria",
      "de": "Globale Staatsverschuldung erreicht Rekordwerte: Ratingagenturen warnen vor Risiken",
      "zh": "全球政府主權債務再創歷史新高：信用評等機構相繼發出減赤警告"
    },
    "summary": {
      "fr": "Le cumul mondial de la dette souveraine dépasse désormais le PIB mondial cumulé, ce qui ravive les débats sur la viabilité macroéconomique.",
      "en": "Total sovereign debt burdens now outpace cumulative global GDP, triggering macroeconomic debates on physical fiscal capacity and growth.",
      "pt": "A soma total dos passivos soberanos mundiais supera o PIB agregado do planeta, reacendendo discussões sobre a insolvência fiscal.",
      "es": "El volumen total de deuda pública supera el PIB agregado del planeta, abriendo debates en torno a la sostenibilidad de los estímulos fiscales.",
      "de": "Die weltweiten Staatsschulden übersteigen mittlerweile das globale Bruttoinlandsprodukt, was Ökonomen über die langfristige Schuldentragfähigkeit besorgt.",
      "zh": "全球各國累計主權債務總額已打破全球一年GDP的加總，引發學術界針對財政可持續性與長期通膨結構的激烈辯論。"
    },
    "fullContent": {
      "fr": "Le Fonds Monétaire International a mis en garde contre l'accumulation de passifs financiers chez les grandes puissances. Les agences de notation préviennent que des révisions à la baisse pourraient intervenir si les taux réels restent élevés. Les investisseurs surveillent de fait les rendements des obligations d'État qui servent de référence pour l'évaluation de tous les autres actifs de croissance.",
      "en": "The International Monetary Fund cautioned about mounting legacy liabilities among global titans. Rating agencies warn that adjustments could emerge if real-term rates remain high. Asset managers track sovereign yields closely, as they set reference benchmarks for pricing risk assets and tech stocks.",
      "pt": "O Fundo Monetário Internacional alertou sobre o acúmulo desmedido de passivos fiscais nas grandes potências. Agências de avaliação de crédito avisam que rebaixamentos de rating são possíveis. Gestores acompanham de perto os yields dos títulos públicos.",
      "es": "El Fondo Monetario Internacional advirtió sobre la acumulación excesiva de pasivos en economías avanzadas. Las agencias de calificación crediticia alertan de rebajas de solvencia, impulsando al alza el tipo de interés mínimo exigido.",
      "de": "Der Internationale Währungsfonds mahnt zu eiserner Haushaltsdisziplin. Sollten die Realzinsen hoch bleiben, drohen Bonitätsabstufungen. Anleiherenditen steigen daraufhin oft signifikant, was teurere Kredite für alle Marktteilnehmer bedeutet.",
      "zh": "國際貨幣基金組織（IMF）針對已開發經濟體的債務膨脹提出警告。評等機構指出，在高利率環境下，缺乏減赤措施可能招致信評降級，這會顯著推升國債殖利率，並進一步拉高全球社會融資底線。"
    },
    "expertTakeaway": {
      "fr": "Une dette publique élevée augmente la sensibilité des marchés aux taux d'intérêt. Quand les États empruntent cher, cela pèse indirectement sur les lignes de crédit privées.",
      "en": "High sovereign debt lifts system sensitivity to rate shifts. When governments borrow expensively, private corporate credit lines tighten indirectly.",
      "pt": "Passivos estatais pesados tornam as economias mais frágeis para enfrentar crises de crédito. A volatilidade dos juros se propaga rapidamente para as debêntures.",
      "es": "La elevada deuda encarece el coste de capital general. Cuando el Estado paga más por endeudarse, la banca restringe las condiciones a multinacionales.",
      "de": "Ausufernde Staatsschulden erhöhen das Zinsrisiko. Wenn die Refinanzierung des Staates teurer wird, steigen auch die Kapitalkosten für Unternehmen.",
      "zh": "主權債務高企會加劇市場對匯率和通膨的敏感度。當各國財政債台高築，銀行在核發新信貸時會更加保守，間接擠壓中小型科技股的增長空間。"
    },
    "source": "Fiscal Policy Watch",
    "timestamp": {
      "fr": "Il y a 1 jour",
      "en": "1 day ago",
      "pt": "Há 1 dia",
      "es": "Hace 1 día",
      "de": "Vor 1 Tag",
      "zh": "1 天前"
    },
    "sentiment": "negative"
  },
  {
    "id": "std_9",
    "category": "markets",
    "title": {
      "fr": "Transition verte et investissements ESG : Vers une réallocation mondiale des capitaux",
      "en": "Green transition and ESG assets trigger massive capital reallocations",
      "pt": "Transição energética e ativos ESG: onda de aportes provoca realocação maciça de capital",
      "es": "Transición ecológica y criterios ESG: reajuste de flujos de capital a escala internacional",
      "de": "Grüne Wende und ESG-Investments: Gewaltige Kapitalströme werden neu geordnet",
      "zh": "綠色能源轉型與 ESG 指標政策：全球數萬億美元投資足跡面臨重構"
    },
    "summary": {
      "fr": "L'obligation d'engager des rapports durables contraint les investisseurs institutionnels à privilégier les énergies renouvelables et les technologies propres.",
      "en": "Mandatory double-materiality disclosure rules force fund complexes to prioritize clean energy and sustainable technologies.",
      "pt": "Regras rígidas de transparência e sustentabilidade forçam fundos de pensão de ponta a focar em ESG e redução de carbono.",
      "es": "Leyes de reporte de sotenibilidad obligan a los grandes fondos europeos a orientar su liquidez hacia la energía solar y eólica.",
      "de": "Verschärfte Offenlegungsvorschriften zwingen institutionelle Großanleger, verstärkt in erneuerbare Energien und Klimatech zu investieren.",
      "zh": "隨著各大交易所推行嚴格的永續報告準則，機構投資法人正大舉調倉，將資金傾注於再生能源、碳捕捉與關鍵原材料領域。"
    },
    "fullContent": {
      "fr": "La finance durable se dote de règles strictes. Les gestionnaires de portefeuille réorientent des centaines de milliards de dollars vers des entreprises respectant des critères environnementaux, sociaux et de gouvernance (ESG). Cette tendance structurelle favorise des hausses durables pour les valeurs liées aux infrastructures électriques, au recyclage et à l'hydrogène.",
      "en": "Sustainable finance structures are implementing strict compliance audits. Fund managers are shifting trillions towards enterprises scoring high on Environmental, Social, and Governance (ESG) metrics. This structural shift supports sustained valuation multiples for power grids, lithium recycling, and clean tech.",
      "pt": "A conformidade com as finanças verdes está redesenhando as abordagens tradicionais. Multidões de fundos alocam fatias volumosas em empresas de inovação ecológica e reciclagem eletrônica, reduzindo o custo de capital desses negócios sustentáveis.",
      "es": "Las normativas exigentes sobre emisiones obligan a reescribir las carteras. Los gestores mueven presupuestos sustanciales hacia compañías de reciclaje de litio e infraestructuras eléctricas inteligentes, acelerando el flujo de liquidez.",
      "de": "Die Standards für nachhaltige Investments werden immer strenger. Fondsmanager lenken Hunderte Milliarden Euro gezielt in Konzerne mit erstklassigem ESG-Scoring. Davon profitieren u.a. Smart-Grid-Betreiber und Recyclingspezialisten.",
      "zh": "永續金融的合規審核正日趨严密。全球資金託管商正重新評估傳統工業與高耗能產業的配重，並注入數萬億美元支持在環境（E）、社會責任（S）與組織治理（G）等構面得分優秀的領先品牌，顯著推升相關企業的長期估值。"
    },
    "expertTakeaway": {
      "fr": "L'essor de l'ESG crée de nouvelles opportunités de croissance. Toutefois, attention au 'greenwashing' : apprenez à analyser la rentabilité réelle derrière les labels écologiques.",
      "en": "The ESG expansion delivers new options, but beware of greenwashing. Serious portfolios track real profit cash flows alongside clean labels.",
      "pt": "ESG abre vetores espetaculares de investimento, mas exija balanços sólidos. Evite empresas com rótulo ecológico puramente estético e margens de lucro negativas.",
      "es": "El auge ESG genera industrias prometedoras. Aún así, un inversor prudente debe vigilar la rentabilidad real del negocio y no solo los discursos de marketing verde.",
      "de": "ESG-Investments bieten exzellente Renditechancen, erfordern aber genaue Recherche. Achten Sie auf echte Erträge statt auf Lippenbekenntnisse im Geschäftsbericht.",
      "zh": "綠色投資浪潮催生了可觀的成長板塊，然而投資人仍須小心防範虛假的「綠色包裝（Greenwashing）」。務必仔細檢視企業的實質營收與現金流，而非僅看行銷宣傳標籤。"
    },
    "source": "Green Wealth",
    "timestamp": {
      "fr": "Il y a 14 heures",
      "en": "14 hours ago",
      "pt": "Há 14 horas",
      "es": "Hace 14 horas",
      "de": "Vor 14 Stunden",
      "zh": "14 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_10",
    "category": "markets",
    "title": {
      "fr": "Concentration extrême sur l'indice S&P 500 : Le poids des 'Magnificent Seven' inquiète certains gérants",
      "en": "Extreme index concentration: S&P 500 dependency on 'Magnificent Seven' triggers volatility alerts",
      "pt": "Concentração extrema no S&P 500: peso colossal das 'Magnificent Seven' acende alerta de volatilidade",
      "es": "Concentración en Wall Street: El dominio de las 'Siete Magníficas' plantea retos a la diversificación",
      "de": "Extreme Klumpenrisiken im S&P 500: Macht der 'Magnificent Seven' alarmiert Portfoliomanager",
      "zh": "美股大盤結構隱憂？「科技七巨頭」權重直逼30%，引發指數化投資風險論戰"
    },
    "summary": {
      "fr": "Sept valeurs technologiques représentent plus de 30 % de la capitalisation de l'indice de référence, créant un risque systémique en cas d'accident de parcours.",
      "en": "Seven elite technology companies now command over 30% of key market benchmarks, raising risk levels if industry trends switch.",
      "pt": "Apenas sete gigantes de inteligência artificial representam um terço do índice S&P 500, elevando as oscilações para carteiras conservadoras.",
      "es": "Un puñado de valores de crecimiento determina la suerte de los fondos indexados globales, incrementando la volatilidad agregada.",
      "de": "Lediglich sieben Tech-Giganten machen über 30 % des gesamten US-Leitindex aus, was die Anfälligkeit für Branchen-Korrekturen drastisch erhöht.",
      "zh": "科技板塊近年漲勢驚人，這也使得美股代表性大盤中僅僅 7 家最大科技股的權重加總即將突破三成，形成不容忽視的「板塊集中風險」。"
    },
    "fullContent": {
      "fr": "La domination d'entreprises comme Microsoft, Apple et NVIDIA sur l'indice S&P 500 n'a jamais été aussi forte. Bien que leur croissance soit alimentée par l'intelligence artificielle et des flux de trésorerie gigantesques, la moindre déception lors de leurs publications trimestrielles peut entrainer l'ensemble du marché dans une correction. Les gérants recommandent une saine diversification sur des valeurs moyennes.",
      "en": "The sheer dominance of conglomerates like Microsoft, Apple, and NVIDIA over stock indices has set historical precedents. While supported by artificial intelligence and massive balance sheets, a single earnings miss among them can trigger broad corrections. Financial advisers emphasize spreading core risks to mid-cap assets.",
      "pt": "O domínio das big tech em Wall Street está redefinindo as métricas de segurança. Sendo impulsionadas pela febre de IA, as suas avaliações incorporam metas extremamente exigentes. Qualquer surpresa na divulgação de balanços trimestrais pode punir o mercado em bloco.",
      "es": "La influencia de corporaciones tecnológicas sobre el parqué de Nueva York marca picos históricos. Su valoración descuenta flujos de caja perfectos en la inteligencia artificial, por lo que una modesta pérdida de ingresos provoca grandes retrocesos sistemáticos.",
      "de": "Das Übergewicht einiger Megacaps am US-Markt ist historisch einmalig. Da deren Bewertungen ein hohes KGV annehmen, reagieren die Kurse extrem empfindlich auf minimale Abweichungen von den Analystenschätzungen bei den Quartalszahlen.",
      "zh": "美股市值版圖目前高度仰賴微軟、蘋果、NVIDIA 等超大型集團。儘長其營收核心均有強悍的現金流與人工智慧市佔率支持，但在極高估值期待下，單一巨星的財報微幅落後也極易引發大盤整體回檔，配置中型股成避雷方針。"
    },
    "expertTakeaway": {
      "fr": "Quand l'indice dépend de trop peu d'entreprises, la diversification classique devient trompeuse. Posséder un ETF S&P 500 revient en réalité à miser très lourdement sur la Tech.",
      "en": "When index weights concentrate heavily, standard diversification buffers decrease. Buying an S&P 500 ETF essentially means placing massive bets on technology giants.",
      "pt": "A passividade cega de comprar ETFs amplos sem ler a lâmina expõe você ao risco de concentração. Considere diversificar fora da bolha tecnológica de IA.",
      "es": "Si posees un ETF indexado del S&P 500, estás invertido sustancialmente en tecnología. Equilíbralo con industrias tradicionales como energía o salud.",
      "de": "Ein simpler S&P 500 ETF schützt Sie heute nicht mehr automatisch vor konzentrierten Kursrisiken. Behalten Sie das Branchengewicht im Auge.",
      "zh": "對於定時定額 S&P 500 指數的投資人而言，你的配置實質上已高度傾斜至科技巨擘（Tech Overweight）。可視個人風險偏好，納入防禦性民生板塊以達最佳平衡。"
    },
    "source": "Wall Street Digest",
    "timestamp": {
      "fr": "Il y a 16 heures",
      "en": "16 hours ago",
      "pt": "Há 16 horas",
      "es": "Hace 16 horas",
      "de": "Vor 16 Stunden",
      "zh": "16 小時前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_11",
    "category": "crypto",
    "title": {
      "fr": "Le Bitcoin s'installe au cœur des allocations de portefeuille traditionnelles",
      "en": "Bitcoin establishes holding space inside traditional portfolio allocations",
      "pt": "Bitcoin consolida seu espaço nas carteiras e fundos de investimento tradicionais",
      "es": "Bitcoin se consolida en las carteras tradicionales impulsado por flujos en ETFs",
      "de": "Bitcoin etabliert sich als feste Beimischung im traditionellen Vermögensaufbau",
      "zh": "比特幣躍升為成熟另類資產：主權與機構法人正式納入投資基準考量"
    },
    "summary": {
      "fr": "Avec les flux d'entrées réguliers sur les ETF spot, la reine des cryptomonnaies s'impose comme un outil alternatif de diversification.",
      "en": "Sustained net inflows into spot products are normalizing the digital asset class as an alternative tool for long-term managers.",
      "pt": "Com aportes frequentes em fundos regulados, a principal criptomoeda se consolida para amenizar perdas inflacionárias no longo prazo.",
      "es": "Los flujos consistentes hacia fideicomisos regulados normalizan al criptoactivo como un diversificador viable de renta variable.",
      "de": "Stetige Kapitalzuflüsse in börsennotierte Spot-Produkte etablieren Krypto zunehmend als anerkannte alternative Assetklasse.",
      "zh": "隨著美歐合規比特幣現貨 ETF 的源源不絕資金注入，該數位資產的市場角色正加速轉趨為穩健的另類避險物資。"
    },
    "fullContent": {
      "fr": "Les ETF Bitcoin Spot ont enregistré des volumes d'achat record ce trimestre. Désormais, des conseillers financiers américains intègrent des petites allocations (1% à 3%) dans des plans de retraite classiques. Cet afflux constant de liquidités institutionnelles soutient le prix contre les ventes spéculatives, bien que la volatilité intrinsèque reste supérieure aux actions.",
      "en": "Spot Bitcoin funds posted record-setting net inflows this fiscal quarter. Regulated retirement plans are incorporating tiny holdings (1% to 3%) to maximize yield curves. This stream of institutional dry powder helps stabilize price floors against typical retail emotional selling, though baseline volatility remains high.",
      "pt": "Os fundos de índice focados em Bitcoin ganharam tração sem precedentes globais. Planejamentos de herança e contas de investimento alocam fatias bem calibradas (1-2%) em busca de alfa. Esse movimento constrói tetos de suporte robustos contra quedas abruptas.",
      "es": "Los fondos cotizados han generado una inyección institucional sin precedentes históricos. Múltiples corporaciones colocan porcentajes pequeños de su excedente corporativo en tesorería para blindarse de la expansión fiduciaria.",
      "de": "Die Bitcoin-Spot-ETFs verzeichneten in diesem Quartal Nettozuflüsse in Milliardenhöhe. Selbst Pensionskassen widmen der Kryptowährung nun kleine Anteile (1 % bis 3 %) zur Renditeoptimierung, was den Kurs stützt, obgleich Krypto volatil bleibt.",
      "zh": "比特幣現貨 ETF 規模於本會計年度迎來爆炸性陡升。傳統財務顧問和退休金信託基金也開始加入配置 1% 至 3% 以優化風險溢酬利潤。合規買方的源源不絕承接力，為比特幣築起了比以往更為堅固的市場底部，但波動率依舊不低。"
    },
    "expertTakeaway": {
      "fr": "Le Bitcoin n'est plus un actif marginal. Cependant, fixez des règles de rééquilibrage strictes pour éviter qu'une hausse crypto ne déséquilibre votre profil de risque global.",
      "en": "Bitcoin is transitioning from experimental to mainstream. Apply strict rebalancing rules to make sure crypto gains do not overload overall portfolio risk boundaries.",
      "pt": "A classe cripto amadureceu, contudo, o controle rígido de limites é primordial. Mantenha o percentual no nível definido para não descaracterizar sua estratégia.",
      "es": "El ecosistema criptográfico es ya un elemento de peso. Sin embargo, establece disciplina de venta automática cuando su escalada sobrepase tu tolerancia.",
      "de": "Bitcoin ist erwachsen geworden. Nutzen Sie jedoch strikte Rebalancing-Regeln, damit Krypto-Kursgewinne Ihr Portfolio-Risikoprofil nicht unbeabsichtigt dominieren.",
      "zh": "加密資產已非昔日的非主流邊緣物。在實際追求溢酬的同時，務必搭配嚴格的「資產再平衡」紀律，當加密幣比重因漲幅過大時，適時賣出獲利了結並回流至大盤指數。"
    },
    "source": "Crypto Trust",
    "timestamp": {
      "fr": "Il y a 18 heures",
      "en": "18 hours ago",
      "pt": "Há 18 horas",
      "es": "Hace 18 horas",
      "de": "Vor 18 Stunden",
      "zh": "18 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_12",
    "category": "crypto",
    "title": {
      "fr": "Régulation MiCA en Europe : Un cadre strict mais rassurant pour l'industrie crypto",
      "en": "MiCA regulatory standard: strict but secure frameworks reshape digital finance in Europe",
      "pt": "Regulação MiCA na Europa: diretrizes exigentes geram segurança jurídica para criptoativos",
      "es": "Regulación MiCA en Europa: Un marco firme que brinda certeza jurídica al inversor",
      "de": "MiCA-Regulierung in Europa: Klarer Rechtsrahmen stärkt Vertrauen in digitale Assets",
      "zh": "歐盟區《加密資產市場法》（MiCA）上路：嚴格法規為合規交易所帶來劃時代保障"
    },
    "summary": {
      "fr": "L'entrée en vigueur de la réglementation européenne sur les crypto-actifs contraint les courtiers à plus de transparence financière.",
      "en": "The official rollout of Europe's Markets in Crypto-Assets rules forces digital exchanges to bolster capital reserves and auditing.",
      "pt": "O início da lei MiCA obriga exchanges de moeda digital a manter reservas de capitais segregadas, varrendo fraudes locais.",
      "es": "La activación del reglamento de intercambio de tokens exige a intermediarios demostrar solvencia en reservas líquidas transparentes.",
      "de": "Das Inkrafttreten des EU-Regelwerks MiCA verlangt von Kryptobörsen hohe Transparenz und solide Eigenkapitalpuffer.",
      "zh": "歐盟正式實施涵蓋所有數位 token 運作的綜合監管框架，要求提供穩定幣及交易服務的境外平台必須取得本地合規授權與儲備透明審計。"
    },
    "fullContent": {
      "fr": "L'Union européenne instaure des exigences de transparence élevées pour les émetteurs de stablecoins et les plateformes de trading. Ce cadre réglementaire, baptisé MiCA, élimine les acteurs non conformes mais offre une sécurité juridique inédite aux banques traditionnelles qui souhaitent proposer des services de garde de jetons numériques.",
      "en": "The European Union is rolling out strict capital reserves and auditing formulas under the comprehensive MiCA framework. This regulatory system filters out compliance-dodging operators while delivering deep legal safety for legacy banks preparing custody services.",
      "pt": "A UE determinou processos rigorosos para emissores de stablecoins e provedores de carteiras. Chamado popularmente de MiCA, o regulamento extingue provedores fraudulentos enquanto sedimenta clareza legal para bancos tradicionais fornecerem serviços baseados em blockchain.",
      "es": "La zona euro da la bienvenida al marco regulatorio de custodios financieros. Al penalizar la falta de transparencia, se abren las compuertas para que la banca comience a incorporar monederos electrónicos integrados en sus herramientas móviles estándar.",
      "de": "Die Europäische Union fordert hohe Standards von Kryptodienstleistern. Während unregulierte Nischenanbieter verdrängt werden, schafft das neue MiCA-Gesetz Rechtssicherheit für namhafte Finanzinstitute, die in die Krypto-Verwahrung einsteigen.",
      "zh": "這項名為 MiCA 的龐大合規架構正重新塑造歐盟金融秩序。它全面提高了穩定幣發行和虛擬貨幣交易所的透明度要求，儘管增加了中小企業的營運負擔，卻為大型傳統證券與商業銀行入局開拓了暢行無阻的法律坦途。"
    },
    "expertTakeaway": {
      "fr": "La régulation réduit temporairement l'anonymat et l'effet de levier spéculatif, mais elle est indispensable pour attirer la confiance et la liquidité à long terme.",
      "en": "While rules might limit speculative leverage options, they compose the foundational highway to attract long-term institutional portfolios and volume.",
      "pt": "Mais regramento acalma os maximalistas, mas possibilita que fundos institucionais bilionários comecem a colocar dinheiro no ecossistema.",
      "es": "El control reduce la volatilidad de corta duración. Aun así, favorece la llegada de los grandes inversionistas pasivos con capital constante.",
      "de": "Regulierung beseitigt vielleicht scheinbar unbegrenzte Freiheiten, ist jedoch der entscheidende Wegbereiter für den Einstieg großer Institutionen.",
      "zh": "法規健全化意味著先前缺乏約束的高倍槓桿與空無監管將被壓縮；但在大局觀下，這才是讓主流資金、傳統企業財政儲備能夠安全配置加密資產的真正基石。"
    },
    "source": "Blockchain Ledger",
    "timestamp": {
      "fr": "Il y a 2 jours",
      "en": "2 days ago",
      "pt": "Há 2 dias",
      "es": "Hace 2 días",
      "de": "Vor 2 Tagen",
      "zh": "2 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_13",
    "category": "learning",
    "title": {
      "fr": "Comprendre la courbe des taux inversée : Un indicateur historique de récession",
      "en": "Unlocking the inverted yield curve: a historical signal for economic recessions",
      "pt": "Entendendo a curva de juros invertida: o maior presságio teórico de recessões",
      "es": "Entendiendo la curva de tipos invertida: el indicador clásico de recesiones macro",
      "de": "Die invertierte Zinskurve erklärt: Der zuverlässigste Vorbote einer Wirtschaftskrise",
      "zh": "新手的必修金融指標：什麼es「國債收益率曲線倒掛」，為何它與經濟衰退如影隨形？"
    },
    "summary": {
      "fr": "Découvrez pourquoi le rendement d'une obligation d'État à court terme supérieur à celui à long terme inquiète les investisseurs.",
      "en": "Discover why short-term government treasury yields paying more than long-term bonds flags distress for macro practitioners.",
      "pt": "Descubra o motivo de títulos públicos de curto prazo pagarem taxas melhores que papéis de longo ciclo, revelando perturbação no mercado creditício.",
      "es": "Descubre por qué un mayor interés en bonos estatales de 2 años en comparación con los de 10 años enciende las alertas de fondos de inversión.",
      "de": "Erfahren Sie, warum es Ökonomen alarmiert, wenn kurzfristige Staatsanleihen plötzlich höhere Renditen abwerfen als langfristige Papiere.",
      "zh": "在正常市場下，借錢越久利息應越高。一文看懂當短期國債收益率居然反常超越長期限債券時，這背後代表了投資人何種悲觀預期。"
    },
    "fullContent": {
      "fr": "En finance de marché, prêter de l'argent à long terme (ex: 10 ans) doit logiquement rapporter plus que prêter à court terme (ex: 2 ans), à cause de l'incertitude liée à l'avenir. Or, quand la courbe s'inverse, cela signifie que les investisseurs anticipent des baisses de taux à cause d'un ralentissement économique. Historiquement, cet indicateur a précédé la majorité des crises économiques modernes.",
      "en": "In bond markets, lending capital for a decade naturally yields higher interest than a brief 2-year period owing to long-horizon risks. When this logic flips (inverted yield curve), the system indicates that market participants expect severe near-term stress and subsequent rate cuts. Historically, this anomaly preceded most recessions.",
      "pt": "Em finanças, estender fundos para 10 anos deve remunerar melhor que 2 anos, devido à incerteza. Porém, se a curva se inverte, significa que os traders aguardam cortes de juros devido ao congelamento da economia real. Esse termômetro previu a maior parte das contrações mundiais.",
      "es": "Prestar a largo plazo exige un premio por riesgo inflacionario. Cuando la curva se invierte, la renta fija anticipa caídas rápidas del tipo de interés por congelación del consumo. Históricamente, la inversión de la curva de rendimientos (yield curve) ha anticipado más del 90% de las contracciones del S&P 500.",
      "de": "Normalerweise verlangen Anleger für längere Laufzeiten höhere Risikoprämien. Wenn kurzfristige Anleihen jedoch besser verzinst werden, rechnet der Markt mit fallenden Zinsen als Reaktion auf ein stark abkühlendes Wirtschaftswachstum. Diese Anomalie gilt als präziser Krisenindikator.",
      "zh": "一般而言，把資金鎖定 10 年（長期債券）的債權人，應該要獲得比鎖定 2 年（短期債券）更高的利息回報，以彌補對未來通膨和信用風險的忽視。然而當政策出現扭曲或景氣即將反轉，債券買家會瘋狂搶購長期債券鎖定利潤，進而造成短期回報超越長期回報的反常倒掛，此特徵在前幾次金融風暴前皆頻繁出現過。"
    },
    "expertTakeaway": {
      "fr": "Une courbe inversée n'a pas de pouvoir magique, mais elle reflète le pessimisme collectif des grands fonds obligataires. Restez prudent et renforcez vos positions défensives.",
      "en": "The inversion is not an absolute oracle, but it accurately maps the collective worry of large debt specialists. It signals a good time to review defensive hedges.",
      "pt": "A inversão de rendimento desenha o comportamento do mercado profissional de dívidas. Reforce posições estáveis de renda combinadas com diversificação sólida.",
      "es": "La anomalía no causa una crisis física por sí sola, pero expresa el consenso del mercado de deuda. Protege tus ganancias de trading asignando una parte a sectores defensivos.",
      "de": "Die Zinsinversion ist kein unfehlbares Orakel, spiegelt jedoch die kollektive Besorgnis im Rentenmarkt wider. Bringen Sie etwas Ruhe in Ihr Aktienportfolio.",
      "zh": "倒掛指標並非絕對會引發即時衰退，但它生動揭示了債券大戶與專業法人對景氣中短期的深沉擔憂，此時宜審慎檢視自己的融資和高槓桿倉位。"
    },
    "source": "Investing Basics",
    "timestamp": {
      "fr": "Il y a 4 jours",
      "en": "4 days ago",
      "pt": "Há 4 dias",
      "es": "Hace 4 días",
      "de": "Vor 4 Tagen",
      "zh": "4 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_14",
    "category": "learning",
    "title": {
      "fr": "La capitalisation boursière expliquée : Large-Cap, Mid-Cap et Small-Cap",
      "en": "Market capitalization decoded: Large-Cap, Mid-Cap, and Small-Cap classifications",
      "pt": "Entendendo a capitalização de mercado: as diferenças entre Large, Mid e Small Caps",
      "es": "Capitalización Bursátil: Aprende a categorizar acciones por su magnitud de valor",
      "de": "Marktkapitalisierung verständlich erklärt: Large-Caps, Mid-Caps und Small-Caps",
      "zh": "玩轉持股篩選：一文搞懂何謂大盤股（Large-Cap）、中盤股與高風險的小盤股（Small-Cap）"
    },
    "summary": {
      "fr": "Apprenez à calculer la valeur totale d'une entreprise et à choisir vos cibles selon votre appétit pour le risque.",
      "en": "Learn how multiplying share counts by market rates reveals total valuation size, guiding your strategic asset class decisions.",
      "pt": "Aprenda a mapear o tamanho financeiro das empresas e descubra como equilibrar sua estabilidade patrimonial conforme o seu perfil.",
      "es": "Aprende a valorar una acción según sus títulos vigentes y comprende por qué el tamaño determina tu ratio de riesgo.",
      "de": "Erfahren Sie, wie Sie den Gesamtwert eines Konzerns ermitteln und Ihre Investitionswerte an Ihre Risikotoleranz anpassen.",
      "zh": "明白如何將公司發行的總股票張數乘以目前成交價格，以此定位其在市值金字塔中的層級，並做出相對應 of 風險配置。"
    },
    "fullContent": {
      "fr": "La capitalisation s'obtient en multipliant le nombre d'actions en circulation par le cours unitaire. Les 'Large-Caps' (plus de 10 milliards $) offrent de la stabilité et souvent des dividendes. Les 'Mid-Caps' (2 à 10 milliards $) allient croissance et risque modéré. Enfin, les 'Small-Caps' sont très volatiles mais recèlent un fort potentiel de gains rapides en cas d'innovation majeure.",
      "en": "Market capitalization is simple: multiply outstanding shares by the current market rate. Large-Caps ($10B+) provide business stability and secure yields. Mid-Caps ($2B-$10B) couple expansion with moderate risks. Small-Caps ($300M-$2B) are highly volatile but house rapid upside options if strategic pivots or breakthroughs succeed.",
      "pt": "A capitalização é calculada com o número total de ações emitidas multiplicado pela cotação corrente. Large-Caps (empresas colossais) garantem resiliência. Mid-Caps oferecem robustez com motores promissores de vendas. Small-Caps (menores) oscilam ferozmente, porém reservam valorizações espetaculares no sucesso de novas frentes de produtos.",
      "es": "Calculamos el tamaño multiplicando el volumen de acciones ordinarias por la cotización de mercado. Las Large-Caps (grandes corporaciones) proveen balances robustos. Las Mid-Caps ofrecen el punto óptimo entre innovación y estabilidad. Las Small-Caps son líquidas pero explotan de precio si patentan una innovación ganadora.",
      "de": "Die Marktkapitalisierung errechnet sich als Produkt aus Aktienkurs und der Zahl der umlaufenden Papiere. Große Large-Caps (über 10 Mrd. $) stehen für Krisenfestigkeit und Dividendenstärke. Mid-Caps (2 bis 10 Mrd. $) bieten oft dynamischeres Wachstum, während die kleineren Small-Caps hochgradig spekulativ sind.",
      "zh": "市值公式十分簡易：發行股票總數乘以每股現價。Large-Cap（大盤股，通常超過百億美元規模，如 Apple、微軟）具備雄厚資金堡壘與配息紀錄；Mid-Cap（中盤股）兼顧成長動力與平衡體質；Small-Cap（小盤股）抗震力弱但在核心研發成功或被收購時常能展現翻倍的爆發力。"
    },
    "expertTakeaway": {
      "fr": "La taille d'une entreprise influence fortement sa volatilité. Un portefeuille équilibré combine la sécurité des géants avec le potentiel de croissance des valeurs moyennes.",
      "en": "A company's scale heavily charts its default price fluctuations. Dynamic portfolios mix blue-chip anchors with mid-cap growth engines for balanced metrics.",
      "pt": "Volume de mercado dita a liquidez operacional. Equilibre sua exposição diluindo aportes entre líderes estáveis de mercado e ativos ágeis de menor porte.",
      "es": "La envergadura de una compañía condiciona las fluctuaciones de precio. Un portafolio sensato coloca un bloque mayoritario en líderes estables de dividendos.",
      "de": "Die Unternehmensgröße prägt das Kursschwenk-Verhalten. Strukturierte Depots vereinen die Stabilität von Branchenführern mit der Renditedynamik aufstrebender Nebenwerte.",
      "zh": "市值大小是股價波動屬性的最基礎分野。健康的策略通常會將較大份額部署在穩定、具抗禦力的大藍籌股，再提撥部分份額主動追求小盤股的超額回報。"
    },
    "source": "Wealth School",
    "timestamp": {
      "fr": "Il y a 5 jours",
      "en": "5 days ago",
      "pt": "Há 5 dias",
      "es": "Hace 5 días",
      "de": "Vor 5 Tagen",
      "zh": "5 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_15",
    "category": "commodities",
    "title": {
      "fr": "Le Cuivre s'envole : la demande de l'électrification mondiale surpasse l'offre",
      "en": "Copper prices rally: rising green energy grids and EV demand trigger supply deficits",
      "pt": "Cobre em rali histórico: eletrificação global por energia limpa supera limites de oferta",
      "es": "El cobre se dispara en bolsa: la infraestructura ecológica supera las reservas físicas",
      "de": "Kupferpreis explodiert: Starker Bedarf der Green Economy übersteigt Bergwerkskapazitäten",
      "zh": "「紅金」銅價狂飆：電動車與再生能源網基礎設施擴建引發大宗商品供需缺口"
    },
    "summary": {
      "fr": "Surnommé 'Docteur Cuivre' pour sa capacité à mesurer la santé industrielle, le métal rouge est indispensable à la transition verte mondiale.",
      "en": "Dubbed 'Dr. Copper' due to its status as an economic health indicator, the red industrial metal is vital for green global electrification projects.",
      "pt": "Conhecido teoricamente como 'Dr. Cobre' devido à sua correlação estreita com a atividade fabril, o metal vermelho disparou estimulado por baterias de carros de nova geração.",
      "es": "El apodado 'Doctor Cobre' por reflejar perfectamente la salud fabril acelera su escalada mundial debido al tendido de Smart Grids y servidores de IA.",
      "de": "Das auch als 'Dr. Kupfer' bekannte Industriemetall gilt als Wirtschaftsbarometer. Nun treibt die Netzinfrastruktur für KI-Zentren und E-Autos den Preis an.",
      "zh": "經濟學界常將具有景氣風向標屬性的銅金屬尊稱為「銅醫生」。得益於全球高壓電網更新、電動車及人工智慧機房的巨大耗銅熱潮，其期貨價格迎來爆發潮。"
    },
    "fullContent": {
      "fr": "L'extension des réseaux haute tension, la fabrication de voitures électriques et le câblage des centres de données IA nécessitent des quantités colossales de cuivre. En parallèle, l'ouverture de nouvelles mines de cuivre prend plus de dix ans. Cette incompatibilité fondamentale de calendrier pousse les cours à la hausse, menaçant de créer une crise d'approvisionnement globale.",
      "en": "Building power infrastructures, electric vehicles, and AI data centers consumes enormous amounts of copper. Since launching new digging channels takes over a decade, structural shortfalls are materializing. This supply-demand gap has triggered a commodities uptrend, squeezing manufacturers globally.",
      "pt": "A ampliação de malhas elétricas e condutores estruturais em data centers requer quantidades expressivas de commodities metálicas. Diante de relatórios mostrando que desenvolver novos complexos de mineração no Chile ou Peru consome em média 12 anos, a escassez se instalou no pregão.",
      "es": "Sistemas de recarga rápida y transformadores exigen un suministro continuo. Dado que abrir un nuevo yacimiento minero toma unos diez años para lograr su producción inicial, el mercado vive una escasez estructural de cátodos de mineral.",
      "de": "Die Modernisierung von Stromnetzen, der Bau von Elektromotoren und die Kabellieferungen für KI-Rechenzentren verschlingen enorme Mengen Kupfer. Weil die Erschließung neuer Erzlagerstätten oft ein Jahrzehnt dauert, droht ein langanhaltendes Kupferdefizit auf dem Weltmarkt.",
      "zh": "建設區域超高壓輸電網路、電動車馬達線圈及生成式 AI 伺服器纜線均需要耗用巨量特高純度精煉銅。然而，在全球主要產銅國開採一處全新大型礦脈平均需要十年以上的環評與開發週期，此基礎物資的瓶頸使得國際精鍊銅現貨價在金屬交易所強勁攀上波段新高。"
    },
    "expertTakeaway": {
      "fr": "Investir indirectement dans les métaux industriels par le biais de sociétés minières est une excellente couverture contre l'inflation des coûts industriels.",
      "en": "Targeting industrial metals, either directly or via mining stocks, delivers excellent defensive hedges against overall raw material cost inflation.",
      "pt": "A exposição estratégica ao cobre via empresas produtoras gera robustez contra o avanço dos custos de bens de produção.",
      "es": "El cobre es el pilar de la infraestructura de energía. Poseer mineras productoras líderes en tu lista de inversiones complementa tu blindaje anti-inflación.",
      "de": "Eine Investition in Industriemetalle, beispielsweise über weltweit führende Bergbaukonzerne, bietet verlässlichen Schutz vor steigenden Gestehungskosten der Tech-Unternehmen.",
      "zh": "若想佈局基礎原料，除直接投資期貨外，關注掌握實體優質礦山、開採成本低於同業平均的主力礦業股，通常能在商品牛市中享有高額槓桿溢酬與配息。"
    },
    "source": "Resource Ledger",
    "timestamp": {
      "fr": "Il y a 20 heures",
      "en": "20 hours ago",
      "pt": "Há 20 horas",
      "es": "Hace 20 horas",
      "de": "Vor 20 Stunden",
      "zh": "20 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_16",
    "category": "commodities",
    "title": {
      "fr": "Matières premières agricoles : prix instables face aux dérèglements climatiques",
      "en": "Agricultural commodities: extreme weather structures trigger grain market price swings",
      "pt": "Commodities agrícolas: anomalias de clima criam forte instabilidade no valor dos grãos",
      "es": "Sector Agrícola: Inestabilidad y choques de oferta en los precios del trigo y la soja",
      "de": "Agrarrohstoffe unter Druck: Wetterextreme belasten Getreidemärkte",
      "zh": "農業大宗商品：極端乾旱與反聖嬰現象使得全球糧食期貨價格震盪劇烈"
    },
    "summary": {
      "fr": "Le blé et le soja subissent de fortes hausses de prix à Chicago à cause de sécheresses prolongées dans les zones d'exportation.",
      "en": "Wheat and soybean futures soar as prolonged heat waves in main export corridors restrict crop yields.",
      "pt": "Trigo e soja registram altas térmicas de preço no mercado de Chicago decorrente de estiagens fora de época no cinturão produtor americano.",
      "es": "Futuros de cereales cotizan con variabilidad severa por sequías en rutas de flete fluviales ralentizando los despachos del campo.",
      "de": "Weizen- und Sojafutures legen an den US-Warenterminbörsen aufgrund anhaltender Hitzeperioden in den Weizenanbaugebieten spürbar zu.",
      "zh": "芝加哥期貨交易所（CBOT）穀物期貨遭遇極端熱浪跟隨造成的作物良率下調，導致小麥和大豆期貨價格短期內迎來了急劇拉升。"
    },
    "fullContent": {
      "fr": "La bourse des matières premières de Chicago (CBOT) enregistre des pics de volatilité. Des vagues de chaleur intenses affectent les rendements céréaliers en Amérique du Nord et du Sud. Bien que de bonnes récoltes alternatives limitent temporairement les pénuries mondiales, les consommateurs d'agroalimentaire subissent des augmentations répercutées par les importateurs.",
      "en": "The Chicago Board of Trade (CBOT) reports elevated trading volatility. Thermal stress compromises crop volumes in critical agricultural regions. While secondary local crops prevent direct shortfalls, processing conglomerates are passing raw expense additions straight to final retail consumers.",
      "pt": "A bolsa do agronegócio de Chicago vivenciou nova onda especulativa. A estiagem persistente impactou as plantações de grãos nos principais produtores mundiais. Apesar do suporte de produções locais alternativas atenuar os prêmios imediatos de risco, faturamentos de marcas do ramo alimentício mostram margens parciais menores.",
      "es": "Las transacciones agrarias asimilan revisiones a la baja de rindes en Sudamérica y llanuras norteamericanas. Los consorcios de transformación alimentaria comienzan a anunciar reajustes hacia arriba en los productos empacados finales en estantes.",
      "de": "Das Chicago Board of Trade vermeldet Rekordschwankungen. Intensive Hitzewellen beeinträchtigen die Ernteerträge in wichtigen Agrarregionen. Die Lebensmittelkonzerne versuchen nun, die gestiegenen Beschaffungskosten eins zu eins an die Endverbraucher weiterzugeben.",
      "zh": "芝加哥期貨交易所（CBOT）的農產品期貨走勢正面臨供貨修正。由於美洲中部平原局部灌溉短缺，推升全球糧食加工商的收購成本。雖然南半球其他大宗產地的替補性豐收在宏觀層面略微舒緩了極端危機，但零售終端的食品通膨挑戰依然顯著。"
    },
    "expertTakeaway": {
      "fr": "Les matières premières agricoles sont de précieux outils de diversification, mais leur nature saisonnière les rend très vulnérables aux chocs imprévisibles.",
      "en": "Agricultural products are solid diversification tools, but weather seasonality exposes them to extreme, unpredictable volatility swings.",
      "pt": "Grãos e proteínas compõem balanços de trading úteis, entretanto a dependência estrita do clima exige stops cirúrgicos.",
      "es": "La tierra responde a fluctuaciones naturales. El trading agrícola exige cautela porque no puedes modelar de forma matemática el clima estacional con absoluta fidelidad.",
      "de": "Agrar-Investments sind gute Diversifikationsmittel, unterliegen jedoch aufgrund ihrer Natur unberechenbaren Risiken wie Dürren oder Ernteschäden.",
      "zh": "軟性農產品（Soft Commodities）是大宗商品領域中重要的多元配置板塊；然而氣候因素的不可預測性極高，不建議以短線高槓桿方式重倉跟風。"
    },
    "source": "Agri Markets",
    "timestamp": {
      "fr": "Il y a 1 jour",
      "en": "1 day ago",
      "pt": "Há 1 dia",
      "es": "Hace 1 día",
      "de": "Vor 1 Tag",
      "zh": "1 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_17",
    "category": "forex",
    "title": {
      "fr": "L'Euro stabilise sa valeur face à la Livre Sterling après les annonces de la BCE",
      "en": "Euro steady against British Pound following central bank policy meetings",
      "pt": "Euro demonstra estabilidade contra Libra Esterlina após relatórios de inflação europeia",
      "es": "El euro consolida su posición ante la libra esterlina en un ambiente de prudencia monetaria",
      "de": "Euro stabilisiert sich zum britischen Pfund nach Zinsentscheidungen",
      "zh": "歐元兌英鎊在外匯市場持穩：歐洲與英國央行貨幣政策分歧逐漸撫平"
    },
    "summary": {
      "fr": "La paire EUR/GBP fluctue dans une fourchette étroite après le maintien des politiques monétaires des deux côtés de la Manche.",
      "en": "The EUR/GBP exchange cross settles in a narrow margin as European and UK central bankers keep policy plans matched.",
      "pt": "O cruzamento cambial EUR/GBP manteve um canal de lateralização após decisões conjuntas de estabilidade de juros na Europa e Reino Unido.",
      "es": "La cotización de la pareja de divisas fluctúa lateralmente en un rango ajustado ante la decisión de contener variaciones abruptas directas.",
      "de": "Das Devisenpaar EUR/GBP verharrt in einer engen Handelsspanne, nachdem beide Notenbanken signalisieren, die Zinssätze vorerst stabil zu halten.",
      "zh": "在英吉利海峽兩端央行政策相對契合下，歐元與英鎊在外匯交易盤中落入極窄幅的防守性箱體，匯率震盪幅度落入五個月低位。"
    },
    "fullContent": {
      "fr": "Sur le Forex, la paire Euro / Livre Sterling fait l'objet de transactions de couverture continues. Les investisseurs estiment que l'activité macroéconomique des deux blocs se stabilise de concert. La Banque d'Angleterre maintient également une posture de taux élevés pour contrôler l'inflation locale, ce qui crée un équilibre temporaire stable pour les transactions régionales.",
      "en": "Over liquid Forex networks, the Euro/Pound cross rate continues to see active hedging operations. Institutions view broad business indicators in both economic zones as stabilizing symmetrically. Since the Bank of England aligns with a restrictive stance, a temporary valuation equilibrium has formed.",
      "pt": "No dinâmico mercado de moedas Forex, o par EUR/GBP opera sem rumos definidos nos últimos dias. Ambas as representações mostram dinâmicas de arrefecimento interno ordenadas, diminuindo incentivos para grandes saídas táticas de arbitragem entre as duas praças.",
      "es": "Los operadores de Forex registran transacciones contenidas en el tipo eur/gbp. Las condiciones de empleo y consumo a ambos lados muestran resiliencia, lo que estabiliza el diferencial de rentabilidades nominales de sus respectivos instrumentos de tesorería.",
      "de": "Am Forex-Markt zeigt das Paar EUR/GBP eine ausgeprägte relative Kursruhe. Marktteilnehmer gehen davon aus, dass sich die Wirtschaftsdaten dies- und jenseits des Ärmelkanals vorerst parallel entwickeln. Dies mindert den Handlungsbedarf für spekulative Carry-Trades.",
      "zh": "在外匯（Forex）市場中，歐元兌英鎊匯率近期面臨窄幅波動。兩大貨幣發行國的宏觀指標均落入穩健區間，使大型進出口結匯機構的操作主要以「防禦性遠期鎖匯」為主，缺乏主動單邊狙擊的量能，維持橫盤整理。"
    },
    "expertTakeaway": {
      "fr": "Quand deux banques centrales synchronisent leurs politiques, la paire de devises associée se stabilise. C'est l'occasion idéale pour utiliser des stratégies de 'carry trade' à faible risque.",
      "en": "When central banks harmonize policies, currency pairs typically exhibit low volatility, opening opportunities for strategic range traders.",
      "pt": "Sincronia cambial diminui as oportunidades rápidas com o spread, porém fornece conforto financeiro para exportadoras planejassem orçamentos.",
      "es": "Los periodos de un tipo de cambio plano facilitan el flujo comercial transfronterizo tradicional al mitigar los riesgos latentes de devaluación.",
      "de": "Harmonieren Notenbanken in ihren Strategien, dämmt das die Kursschwankungen der Devisen ein. Dies erleichtert Import- und Exportkalkulationen.",
      "zh": "兩大重要貨幣發行體政策如果高度同步，相關匯率匯率即容易長時間「貼地爬行（Low Volatility Range）」。這有利於該區域跨國供應商降低外匯避險的保費支出。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 22 heures",
      "en": "22 hours ago",
      "pt": "Há 22 heures",
      "es": "Hace 22 horas",
      "de": "Vor 22 Stunden",
      "zh": "22 小時前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_18",
    "category": "forex",
    "title": {
      "fr": "Chute du Yen Japonais : possible intervention directe du Ministère des Finances à Tokyo",
      "en": "Japanese Yen weakens further, raising intervention warnings from finance ministry in Tokyo",
      "pt": "Iene Japonês atinge mínima crítica: Ministério das Finanças acena com intervenção direta",
      "es": "Debilidad del yen japonés: Tokio amaga con intervenir el par USD/JPY de manera inmediata",
      "de": "Yen-Divergenz verschärft sich: Finanzministerium in Tokio droht mit Devisenmarkt-Intervention",
      "zh": "日圓匯率跌跌不休：日本財務省宣布隨時可能啟動外匯市場拋售美元干預"
    },
    "summary": {
      "fr": "La faiblesse historique du Yen face au Dollar américain commence à peser l'importation d'énergie et appauvrit le pouvoir d'achat japonais.",
      "en": "The persistent decline of the Yen against the US Dollar pressures energy importing parameters, triggering trade deficit alerts.",
      "pt": "A continuada depreciação do Iene encarece as importações de combustíveis e cria discussões profundas sobre as taxas soberanas no Japão.",
      "es": "Un yen en mínimos históricos encarece la importación de gas y recursos naturales, arrastrando la solvencia y balances comerciales habituales.",
      "de": "Die extreme Abwertung des Yen verteuert die Energieimporte für Japan massiv und schürt Spekulationen über direkte Stützungskäufe der BoJ.",
      "zh": "由於利差因素，日圓兌美元再次逼近歷史低位。這對於依賴進口液化天然氣和原油的日本企業帶來了沉重換匯壓力。"
    },
    "fullContent": {
      "fr": "Le taux USD/JPY a franchi des seuils critiques. Malgré la sortie historique de la politique des taux d'intérêt négatifs par la Banque du Japon (BoJ), l'écart persistant avec les taux d'intérêt d'épargne américains maintient une pression baissière sur la devise nipponne. Le ministère des finances a déclaré surveiller le Forex avec le plus haut niveau d'attention pour intervenir s'il le faut.",
      "en": "The USD/JPY exchange cross surpassed historic alert zones. Even though the Bank of Japan (BoJ) officially abandoned its zero-rate policy, the wide gap versus high US yields continues to pressure the Yen. Tokyo policymakers announced they are on standby to execute direct interventions to guard values.",
      "pt": "A cotação do par USD/JPY cruzou barreiras estressantes. Apesar de a autoridade de Tóquio ter anunciado o fim da sua longeva política de taxas negativas, o diferencial imenso comparado à taxa do Federal Reserve drena recursos do arquipélago, exigindo ações urgentes de contenção.",
      "es": "La paridad dólar/yen sobrepasa cotas límite en las pantallas de contratación de divisas. Aunque el emisor BoJ devaluó sutilmente su inyección, el imponente rendimiento de los bonos norteamericanos motiva a inversores a vender yenes masivamente para ganar rendimientos reales en América.",
      "de": "Der Wechselkurs USD/JPY durchbrach wichtige psychologische Unterstützungen. Obwohl die Bank of Japan ihre Ära der Negativzinsen beendet hat, treibt das immense Renditegefälle zu den US-Treasuries japanisches Kapital ins amerikanische Ausland.",
      "zh": "儘管日本銀行（BoJ）已正式終結了長達十幾年的負利率時代，但由於美日兩國資產利差依然極其寬闊，導致在套利交易驅使下，美元兌日圓（USD/JPY）依然面臨嚴重的單邊拋售壓制，東京政策制定層警告隨時拋售外匯儲備干預匯價。"
    },
    "expertTakeaway": {
      "fr": "Une devise ultra-faible stimule les constructeurs automobiles de l'archipel qui exportent, mais elle appauvrit le pouvoir d'achat interne des résidents du pays.",
      "en": "An ultra-weak currency acts as a double-edged sword: boosting local auto exporters while eroding domestic consumer purchasing power.",
      "pt": "O iene depreciado facilita faturamentos globais de montadoras locais de veículos, mas pressiona a margem real das importadoras internas de grãos.",
      "es": "Una divisa devaluada abarata el turismo corporativo extranjero e impulsa a las automotrices exportadoras locales de Toyota u Honda, mermando el salario medio nacional.",
      "de": "Ein extrem schwacher Yen kurbelt zwar die Exporte der heimischen Industrie an, entgleitet aber im Hinblick auf die Importkosten für wertvolle Konsumgüter.",
      "zh": "超弱勢貨幣本質上是一把雙刃劍：它能顯著推高日本跨國汽車巨頭（如 Toyota）折算回本國 of 海外營收；但卻會無情吞噬國內受薪職工購買進口燃料與糧食時的實質生活水準。"
    },
    "source": "Tokyo Forex Desk",
    "timestamp": {
      "fr": "Il y a 1 jour",
      "en": "1 day ago",
      "pt": "Há 1 dia",
      "es": "Hace 1 día",
      "de": "Vor 1 Tag",
      "zh": "1 天前"
    },
    "sentiment": "negative"
  },
  {
    "id": "std_19",
    "category": "macro",
    "title": {
      "fr": "Tensions commerciales sino-américaines : impact des nouveaux tarifs sur les supply chains",
      "en": "Sino-US Trade Tensions: impact of strategic tariffs on global supply chains",
      "pt": "Tensões comerciais entre EUA e China: impacto das tarifas na cadeia",
      "es": "Tensiones comerciales EE.UU.-China: impacto de nuevos aranceles",
      "de": "Handelsspannungen zwischen USA und China: Auswirkungen neuer Zölle",
      "zh": "中美貿易局勢再度緊繃：戰略關稅對全球供應鏈的影響"
    },
    "summary": {
      "fr": "L'imposition de barrières douanières sur les technologies de pointe rehausse les coûts industriels.",
      "en": "The implementation of protective tariffs on key tech imports raises hardware cost barriers.",
      "pt": "A imposição de novas tarifas em tecnologia aumenta os custos industriais.",
      "es": "Nuevos aranceles en tecnologías avanzadas elevan los costos de producción.",
      "de": "Neue Zölle auf High-Tech-Importe erhöhen die Herstellungskosten.",
      "zh": "對先進科技創新建行保護主義關稅，推升了工業成本。"
    },
    "fullContent": {
      "fr": "La rivalité économique entre les deux puissances s'exprime par des tarifs accrus sur les semi-conducteurs et composants de batteries. Les entreprises diversifient leurs fournisseurs vers d'autres pays d'Asie du Sud-Est ou d'Europe, mais cette délocalisation génère des frictions inflationnistes temporaires à l'échelle macroéconomique.",
      "en": "Strategic trade competition results in new duties on microchips and battery components. Companies reorganize supply networks toward emerging Asian countries, but this re-shoring creates transition expenses and structural inflation pressures.",
      "pt": "A rivalidade estratégica resulta em tarifas sobre chips e baterias. Empresas buscam parceiros na Ásia ou América Latina, gerando custos de ajuste temporários.",
      "es": "Aranceles a microchips y baterías obligan a redirigir cadenas de suministro a mercados emergentes de América Latina, generando volatilidad de precios.",
      "de": "Handelsbeschränkungen für Halbleiter zwingen Unternehmen zu teuren Ausweichrouten über europäische Partner, was inflationäre Tendenzen fördert.",
      "zh": "兩國對晶片與關鍵電池材料互加關稅，推動製造業向中立新興市場重整，這雖創造了在地就業，但也帶來了過渡期成本。"
    },
    "expertTakeaway": {
      "fr": "Le protectionnisme augmente les barrières commerciales et agit comme un impôt sur la productivité des multinationales, limitant les baisses de taux futures.",
      "en": "Trade protectionism increases production expenses, acting as a slow drag on corporate margins and limiting central bank options.",
      "pt": "O protecionismo eleva despesas de produção, afetando margens corporativas e mantendo juros sob rédea curta.",
      "es": "El proteccionismo encarece componentes básicos, limitando el espacio político para bajar tasas de interés.",
      "de": "Protektionismus wirkt wie eine Steuer auf wirtschaftliche Effizienz und erschwert lockere Notenbankzinsen.",
      "zh": "貿易保衛戰本質上對跨國生產體系加課了印花稅，限制了央行快速降息的空間。"
    },
    "source": "Macro Global Review",
    "timestamp": {
      "fr": "Il y a 1 jour",
      "en": "1 day ago",
      "pt": "Há 1 dia",
      "es": "Hace 1 día",
      "de": "Vor 1 Tag",
      "zh": "1 天前"
    },
    "sentiment": "negative"
  },
  {
    "id": "std_20",
    "category": "markets",
    "title": {
      "fr": "Rachats d'actions massifs : décryptage de l'effet haussier sur le bénéfice par action",
      "en": "Stock Buybacks Surge: how corporate buyback budgets boost earnings metrics",
      "pt": "Recompras de Ações crescem: entenda o impacto no Lucro por Ação",
      "es": "Aceleran las recompras de acciones: el impulso al beneficio de Wall Street",
      "de": "Aktienrückkäufe steigen: Auswirkung auf den Gewinn je Aktie erklärt",
      "zh": "庫藏股回購狂潮：一文拆解每股盈餘的「增值密碼」"
    },
    "summary": {
      "fr": "Les entreprises retirent leurs actions du marché, augmentant la valeur de chaque part restante.",
      "en": "Corporations deploy dry powder to buy back shares, shrinking the total stock count.",
      "pt": "Empresas usam caixa para recomprar títulos mundiais, reduzindo a oferta líquida.",
      "es": "Las firmas cotizadas retiran títulos en circulación, elevando la escasez del valor.",
      "de": "Unternehmen erwerben eigene Anteile am Markt zurück, um das Nettoangebot zu senken.",
      "zh": "上市巨頭投入資金回購自家股份，使得在外的流通股份計數收縮。"
    },
    "fullContent": {
      "fr": "Les programmes de rachat réduisent le nombre de titres en circulation chez les géants technologiques. Dans l'équation du Bénéfice Par Action (BPA), le dénominateur diminue. Le BPA augmente ainsi mécaniquement, renforçant l'attractivité des actions pour les algorithmes sans nécessiter de surcroît d'activité.",
      "en": "Buyback programs shrink outstanding stock pools among high-cash tech giants. Subtracting shares from the divisor raises Earnings Per Share (EPS) mathematically. This creates demand support across exchange order books even during flat revenue quarters.",
      "pt": "Programas de recompras reduzem papéis no mercado. Isso diminui o divisor do Lucro Por Ação (LPA), que sobe automaticamente, atraindo capitais institucionais.",
      "es": "La recompra de acciones disminuye el divisor del Beneficio Por Acción (BPA). Esto eleva el ratio financiero del valor sin exigir un aumento de ventas reales.",
      "de": "Rückkaufprogramme reduzieren die ausstehenden Anteile. Dies erhöht den Gewinn je Aktie (EPS) rein rechnerisch, was automatische Anlage-Screener positiv bewerten.",
      "zh": "回購使得分母流通股減少。哪怕公司利潤平盤，每股盈餘（EPS）也會被等比拉伸。此舉深受量化演算法的青睞，為股價提供防禦性買盤。"
    },
    "expertTakeaway": {
      "fr": "Les rachats d'actions indiquent souvent une excellente santé financière et soutiennent de manière structurelle la hausse des indices boursiers.",
      "en": "Corporate buybacks indicate deep capital surpluses and act as a reliable tailwind for long-term equity index performance.",
      "pt": "A recomposição de tesouraria indica caixa farto e atua como pilar de valorização no mercado acionário.",
      "es": "La recompra táctica demuestra acumulación de ganancias líquidas, apoyando el avance del patrimonio.",
      "de": "Rückkäufe sind ein Zeichen von Cashflow-Stärke und stützen die langfristige Entwicklung der Aktienmärkte.",
      "zh": "庫藏股回購通常說明自由現金流充沛，是美股大盤指數長線走升的關鍵推手。"
    },
    "source": "Wall Street Digest",
    "timestamp": {
      "fr": "Il y a 2 jours",
      "en": "2 days ago",
      "pt": "Há 2 dias",
      "es": "Hace 2 días",
      "de": "Vor 2 Tagen",
      "zh": "2 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_21",
    "category": "crypto",
    "title": {
      "fr": "Choix de consensus : Preuve d'Enjeu (PoS) vs Preuve de Travail (PoW)",
      "en": "Consensus Battle: Proof-of-Stake vs Proof-of-Work blockchain mechanics",
      "pt": "Prova de Participação (PoS) vs Prova de Trabalho (PoW) nas Blockchains",
      "es": "Prueba de Participación (PoS) frente a Trabajo (PoW) en la Red Blockchain",
      "de": "Sicherheitsmodelle im Vergleich: Proof-of-Stake contra Proof-of-Work",
      "zh": "共識機制之爭：徹底搞懂 PoS 權益證明與 PoW 工作量證明"
    },
    "summary": {
      "fr": "La méthode de validation façonne l'impact écologique et le degré de décentralisation des devises.",
      "en": "The chosen consensus framework outlines energy consumption and network control.",
      "pt": "O formato de consenso determina o gasto energético e a governança das redes.",
      "es": "El mecanismo de acuerdo pauta el consumo eléctrico y la resistencia a la censura.",
      "de": "Das gewählte Verfahren bestimmt den Stromverbrauch und die Verteilung der Kontrolle.",
      "zh": "區塊鏈驗證方式決定了其去中心化安全堡壘的高低與節能成效。"
    },
    "fullContent": {
      "fr": "Bitcoin utilise la Preuve de Travail (PoW), exigeant une puissance électrique massive pour sécuriser le réseau. Ethereum utilise désormais la Preuve d'Enjeu (PoS), déléguant le contrôle aux personnes détenant et déposant leurs pièces en gage, réduisant l'électricité consommée de 99,9% au prix de risques de concentration de pouvoir financiers.",
      "en": "Bitcoin relies on Proof-of-Work (PoW), requiring computational mining energy for immutability. Ethereum implements Proof-of-Stake (PoS), letting token-staking nodes sign blocks, reducing energy footprint by 99.9% while raising questions on system wealth accumulation.",
      "pt": "O Bitcoin repousa sob a Prova de Trabalho (PoW), consumindo eletricidade em troca de segurança física. O Ethereum atua via Prova de Participação (PoS), cortando o uso ambiental em 99,9% mas beneficiando grandes detentores de moedas.",
      "es": "Bitcoin se ampara en Prueba de Trabajo (PoW), usando electricidad para lograr inmunidad estatal. Ethereum viró a Prueba de Participación (PoS), reduciendo la huella de carbono un 99% a cambio de dar mayor peso corporativo al capital.",
      "de": "Bitcoin setzt auf Proof-of-Work (PoW), was physischen Energieaufwand erfordert. Ethereum nutzt Proof-of-Stake (PoS): Staking ersetzt teure Mining-Hardware und spart 99,9 % Strom, erhöht aber das Mitspracherecht reicher Adressen.",
      "zh": "比特幣採用 PoW 工作量證明，依靠強大算力解密，能耗高但安全性極其穩固。以太坊轉向 PoS 權益證明，依靠代幣質押節省了 99.9% 能耗，但權益分配更偏向富人階級。"
    },
    "expertTakeaway": {
      "fr": "Le PoW est un rempart immuable adapté à l'or numérique, tandis que le PoS est plus agile pour développer l'écosystème d'applications décentralisées.",
      "en": "PoW remains the standard for digital gold storage safety, whereas PoS scales faster for dApp software ecosystems.",
      "pt": "O PoW atua como abóbora de proteção ao ouro digital, enquanto o PoS suporta alta velocidade de processamento.",
      "es": "PoW encarna la seguridad inexpugnable del oro digital, mientras PoS escala la velocidad de la utilidad programable.",
      "de": "PoW gilt als unzerstörbares Fundament für digitales Gold, während PoS die Anwendungsgeschwindigkeit erhöht.",
      "zh": "PoW 適合做為保存價值的「數位黃金金庫」，PoS 則極利於高速擴建智慧合約應用網路。"
    },
    "source": "Decentralized Daily",
    "timestamp": {
      "fr": "Il y a 3 jours",
      "en": "3 days ago",
      "pt": "Há 3 dias",
      "es": "Hace 3 días",
      "de": "Vor 3 Tagen",
      "zh": "3 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_22",
    "category": "learning",
    "title": {
      "fr": "Comprendre les bases des dividendes : évitez le piège du rendement trompeur",
      "en": "Dividend Investing Basics: avoiding the high-yield value traps",
      "pt": "Introdução aos Dividendos: evite as armadilhas de yields inflacionados",
      "es": "Bases de la Inversión en Dividendos: cuidado con las trampas de alto yield",
      "de": "Dividenden-Grundwissen: So meiden Sie fatale Renditefallen im Depot",
      "zh": "新手股息入門：如何避開高年化率的「配息黑天鵝」"
    },
    "summary": {
      "fr": "Le dividende est la rétribution offerte aux actionnaires. Mais un pourcentage démesuré cache souvent une épave financière.",
      "en": "Dividends distribute profits to investors, but extreme yields often highlight failing business structures.",
      "pt": "Os dividendos remuneram os sócios. Mas rendimentos extremos costumam sinalizar apuros corporativos.",
      "es": "Los dividendos retribuyen al ahorrador, pero yields sobre el 10% ocultan problemas contables.",
      "de": "Ausschüttungen beteiligen Eigner an Gewinnen. Extrem hohe Sätze verbergen jedoch oft kriselnde Bilanzen.",
      "zh": "股息是分發給股東的真金白銀，但過度畸高的收益率背後往往是營收惡化。"
    },
    "fullContent": {
      "fr": "Le Dividend Yield se calcule en divisant le coupon annuel par le prix de l'action. Si le cours s'effondre pour cause de faillite imminente, le pourcentage affiché sur les simulateurs grimpe en flèche. Un investisseur averti s'assure d'un taux de distribution (Payout Ratio) inférieur à 70% pour garantir la pérennité.",
      "en": "The Dividend Yield divides yearly payouts by the current stock price. If an enterprise faces bankruptcy and its price crashes, the mathematical percentage spikes. Experienced investors scan the Payout Ratio (retained profit percentage) keeping it below 70% as security indicators.",
      "pt": "O Dividend Yield divide o provento pelo preço da ação. Se a empresa caminha para o colapso e o papel desaba, o rendimento percentual sobe. Verifique sempre o Payout Ratio abaixo de 70%.",
      "es": "El dividendo real exige ganancias saneadas. Si el valor de la acción se derrumba, el yield nominal aumenta de golpe. Vigila de cerca que el Payout Ratio (tasa de reparto) no supere el 70%.",
      "de": "Die Rendite sinkt oder steigt antiproportional zum Kurs. Rutscht eine Aktie ab, blinken Screener mit hohem Yield. Ein Payout-Ratio von unter 70 % indiziert gesundes Dividendenwachstum.",
      "zh": "股息率是用年配息除以當前股格。如果公司面臨重創導致股價暴跌，分母變小，公式算出的配息率便會暴拉。成熟投資人會嚴查「盈餘分配率（Payout Ratio）」是否低於 70%。"
    },
    "expertTakeaway": {
      "fr": "Privilégiez la croissance constante et la régularité du dividende plutôt qu'un pourcentage astronomique insoutenable à long terme.",
      "en": "Prioritize consistent payout growth over unsustainable, hyper-elevated dividend rates that risk being cut.",
      "pt": "Foque na consistência histórica do crescimento dos proventos em vez de yields inflacionados temporários.",
      "es": "Prioriza el crecimiento consistente y seguro del dividendo anual a las promesas de retornos excesivos.",
      "de": "Bevorzugen Sie stetiges und stabiles Ausschüttungswachstum gegenüber riskanten, überhöhten Einmalrenditen.",
      "zh": "優先布局連續十幾年健康、穩定調升股息的優質股，切忌被短期的高息噱頭吞噬本金。"
    },
    "source": "Wealth School",
    "timestamp": {
      "fr": "Il y a 4 jours",
      "en": "4 days ago",
      "pt": "Há 4 dias",
      "es": "Hace 4 días",
      "de": "Vor 4 Tagen",
      "zh": "4 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_23",
    "category": "commodities",
    "title": {
      "fr": "La course aux métaux de transition : la bataille du Lithium et du Cobalt",
      "en": "The Green Metal Rush: geopolitical control over Lithium and Cobalt refining",
      "pt": "A Corrida dos Metais Verdes: controle geopolítico do Lítio e do Cobalto",
      "es": "La Ruta del Litio y Cobalto: la competencia por el control de las baterías",
      "de": "Die Schlacht um Technologiemetalle: Engpässe bei Lithium und Kobalt",
      "zh": "新能源金屬戰役：鋰與鈷的地緣精煉話語權爭端"
    },
    "summary": {
      "fr": "La transition vers les voitures électriques fait s'envoler l'importance stratégique des métaux critiques de batteries.",
      "en": "The global automotive electric transition elevates the strategic value of lithium and cobalt key ingredients.",
      "pt": "A transição global para veículos elétricos eleva a relevância geopolítica do lítio e cobalto purificados.",
      "es": "La transición mundial del motor eléctrico impulsa la importância geoestratégica del refinamiento de litio y cobalto.",
      "de": "Der weltweite Übergang zu Elektrofahrzeugen erhöht die strategische Bedeutung kritischer Batteriemetalle wie Lithium und Kobalt.",
      "zh": "全球汽車電氣化轉型，將鋰與鈷等電池關鍵材料的戰略價值提升到了前所未有的地緣政治高度。"
    },
    "fullContent": {
      "fr": "La lutte pour la domination des batteries de véhicules s'intensifie. Alors que l'Europe et les États-Unis tentent de sécuriser leurs chaînes, le traitement du cobalt et du lithium reste concentré dans des zones à risque de blocus logistique. Des accords entre constructeurs et raffineries tentent d'éviter une pénurie mondiale durable.",
      "en": "The global scramble for lithium and cobalt assets has sparked intense mining debates. While western manufacturing centers promote battery gigafactories, mineral refining remains heavily concentrated in single administrative regions, raising critical logistics vulnerability issues across EV supply lines.",
      "pt": "A disputa pelo suprimento de minerais refinados mobiliza montadoras de automóveis. Embora a demanda industrial por células químicas dispare, a infraestrutura de refino de lítio continua centralizada, forçando alianças estratégicas com produtores da América Latina.",
      "es": "La competencia por asegurar contratos de litio y cobalto marca la agenda industrial global. Conseguir un abastecimiento seguro de cátodos de metal es indispensable para las marcas de automoción, que buscan diversificar sus acuerdos comerciales.",
      "de": "Der Wettbewerb um Lithium- und Kobaltressourcen verschärft sich zusehends. Während Automobilhersteller neue Gigafactories errichten, ist die Veredelung dieser Rohstoffe hochgradig konzentriert, was geopolitische Versorgungsrisiken birgt.",
      "zh": "爭奪鋰和鈷等關鍵資源的戰役正在全球汽車巨頭間秘密上演。儘管歐美全力建設電池超級工廠，但全球近八成的金屬精煉產能依然高度集中於少數特定區域，使車企面臨潛在的供應鏈封鎖與零配件短缺風險。"
    },
    "expertTakeaway": {
      "fr": "Les constructeurs de batteries sont à la merci des approvisionnements de matières premières. Les accords directs à long terme protègent les bilans de trésorerie.",
      "en": "Industrial EV builders remain exposed to raw metallurgy supply chains. Early, direct long-term resource purchase agreements represent crucial corporate defense lines.",
      "pt": "Montadoras dependem intimamente do refino químico de base. Parcerias de longo prazo integradas garantem segurança contra solavancos de preços.",
      "es": "La automoción limpia depende directamente de la refinación geolocalizada. Los contratos directos a largo plazo con mineras actúan como el mejor seguro.",
      "de": "Hersteller von Elektrofahrzeugen sind direkt von Rohstoff-Lieferketten abhängig. Langfristige Abnahmeverträge mit Bergbauunternehmen sind geschäftskritisch.",
      "zh": "新能源車企的利潤空間極易受上游精鍊冶金週期的劇烈波動影響。與資源開採商直接簽訂長期包銷協議（Offtake Agreements），是構建供應鏈安全穩定的唯一途徑。"
    },
    "source": "Resource Ledger",
    "timestamp": {
      "fr": "Il y a 5 jours",
      "en": "5 days ago",
      "pt": "Há 5 dias",
      "es": "Hace 5 días",
      "de": "Vor 5 Tagen",
      "zh": "5 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_24",
    "category": "forex",
    "title": {
      "fr": "Refuge par excellence : pourquoi le Franc Suisse s'apprécie face aux tempêtes",
      "en": "The Flight to Safety: unraveling Swiss Franc strength in market risk-off phases",
      "pt": "A Força do Franco Suíço: por que a moeda helvética cresce no estresse mundial",
      "es": "El Secreto del Franco Suizo: por qué se aprecia ante el desplome de bolsas",
      "de": "Die Schweizer Franken-Stärke: Warum der CHF als Fels im Forex-Markt agiert",
      "zh": "資金的黃金防空洞：瑞士法郎（CHF）何以在風暴中屹立不倒？"
    },
    "summary": {
      "fr": "La neutralité historique, l'absence de déficit et les réserves d'or suisses font du CHF l'ancrage ultime.",
      "en": "Switzerland's strict neutrality, low debts, and physical gold backings support Swiss currency indexes.",
      "pt": "A neutralidade, contas públicas organizadas e lastro de ouro transformam o CHF em escudo de capitais.",
      "es": "La neutralidad de la confederación, sumada a bajas deudas estatales, blinda la cotización del franco suizo.",
      "de": "Strikte politische Neutralität und niedrige Staatsschulden machen den Schweizer Franken in Krisen unschlagbar.",
      "zh": "瑞士永恆的中立地位、低赤字紀律以及龐大的實體黃金儲備，共同構築了法郎的安全網。"
    },
    "fullContent": {
      "fr": "Lors des tensions géopolitiques majeures ou d'une crise bancaire en zone euro, le Franc Suisse (CHF) attire irrésistiblement les fonds de prévoyance. Les investisseurs n'y cherchent pas un haut rendement fictif, mais une conservation absolue du pouvoir d'achat, faisant monter la valeur du CHF par rapport au dollar et à l'euro.",
      "en": "Whenever trade tensions or stock default threats expand, defensive capital moves quickly into Swiss Franc banks. Institutions do not demand high yields here, but rather absolute preservation of purchasing power, pushing CHF rates up against major currencies.",
      "pt": "Sempre que a aversão ao risco avança, capitais defensivos buscam depósitos em Zurique. Investidores não pedem juros generosos, apenas a proteção do patrimônio real.",
      "es": "Al estallar fricciones o deudas masivas, el capital inteligente se resguarda en francos suizos. Se busca la salvaguarda absoluta de la riqueza real ante la inflación.",
      "de": "In Phasen geopolitischer Krisen verzeichnet der CHF kräftige Zuflüsse der Family Offices, da Vermögensschutz über Renditegier gestellt wird, was den Franken stärkt.",
      "zh": "每當股市恐慌、地緣局勢惡化，避險主力資金會繞開高收益承諾，全速調撥進入法郎。其目的旨在資產購買力的絕對防禦，進而自然推升法郎相較歐元、美元的匯價。"
    },
    "expertTakeaway": {
      "fr": "Dans une approche multi-devises sur le Forex, allouer une part permanente au Franc Suisse permet de lisser intelligemment la volatilité de votre épargne globale.",
      "en": "Adding a stable, strategic portion of Swiss Francs to global portfolios acts as a smooth, durable shock absorber for currency changes.",
      "pt": "Adicionar uma fração de CHF na sua cesta de moedas protege sua poupança de desvalorizações bruscas do câmbio.",
      "es": "Mantener una presencia prudente de franco suizo diluye de manera eficaz la devaluación silenciosa de las divisas.",
      "de": "Die gezielte Beimischung des Schweizer Frankens glättet Währungsschwankungen und sichert langfristig Ihre Kaufkraft.",
      "zh": "在多幣種外匯配置中，常態配比少量的瑞士法郎資產，能為你組建高抗禦、穩健的避震盾牌。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 6 jours",
      "en": "6 days ago",
      "pt": "Há 6 dias",
      "es": "Hace 6 días",
      "de": "Vor 6 Tagen",
      "zh": "6 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_25",
    "category": "macro",
    "title": {
      "fr": "La croissance résiliente des marchés émergents dynamise l'activité mondiale",
      "en": "Resilient growth in emerging markets boosts global industrial activity",
      "pt": "Crescimento resiliente nos mercados emergentes impulsiona atividade global",
      "es": "El crecimiento resiliente de los mercados emergentes impulsa la economía global",
      "de": "Resilientes Wachstum in Schwellenländern kurbelt die Weltwirtschaft an",
      "zh": "新興市場經濟展現強勁韌性：推動全球消費與工業版圖持續擴張"
    },
    "summary": {
      "fr": "Les pays en développement affichent une croissance solide de leur PIB, portée par une consommation intérieure dynamique et d'importants investissements d'infrastructures.",
      "en": "Developing economies post solid GDP expansion, driven by robust domestic spending and substantial infrastructure investments.",
      "pt": "Economias em desenvolvimento registram forte avanço do PIB, impulsionado por consumo interno vigoroso e infraestrutura.",
      "es": "Las economías en desarrollo registran una expansión sólida del PIB, impulsada por un consumo interno robusto e infraestructuras.",
      "de": "Entwicklungsländer verzeichnen ein solides BIP-Wachstum, das durch starke Binnennachfrage und Infrastrukturprojekte gestützt wird.",
      "zh": "新興國家得益於本土內需市場的爆發與大規模基礎建設投資，其季度 GDP 增速超出大部分已開發經濟體。"
    },
    "fullContent": {
      "fr": "Les derniers rapports macroéconomiques confirment que plusieurs nations émergentes d'Asie et d'Amérique latine dépassent les prévisions de croissance initiales. L'urbanisation rapide, l'émergence d'une large classe moyenne et la libéralisation des échanges favorisent une demande stable. Cette vitalité offre un débouché précieux aux multinationales exportatrices de biens d'équipement.",
      "en": "Recent macroeconomic surveys confirm that leading emerging nations in Asia and Latin America are outperforming early growth projections. Rapid urbanization, the expansion of a solid consumer class, and trade liberalization are supporting manufacturing demands, offering excellent opportunities for global exporters.",
      "pt": "Acompanhamentos mostram que nações emergentes na Ásia e América Latina superam as projeções do início do ano. A urbanização acelerada, a expansão da classe média de consumo e as parcerias comerciais sustentam a demanda por maquinários, estimulando exportações globais.",
      "es": "Informes recientes confirman que las naciones emergentes de Asia y América Latina están superando los pronósticos iniciales de crecimiento. La urbanización constante, la expansión de la clase trabajadora y la apertura de fronteras comerciales motivan al alza la demanda multilateral.",
      "de": "Neuere Wirtschaftsberichte belegen, dass führende Schwellenländer in Asien und Lateinamerika die Erwartungen übertreffen. Voranschreitende Urbanisierung, eine wachsende Mittelschicht und Handelsabkommen stützen die Industrienachfrage nachhaltig.",
      "zh": "最新宏觀統計報告證實，亞洲與拉丁美洲的多個主要新興經濟體正展現出超乎預期的成長軌跡。快速的都市化、新興中產階級的崛起，以及貿易自由化進程，為全球跨國設備出口商與消費性品牌注入了最迫切需要的外部動力。"
    },
    "expertTakeaway": {
      "fr": "Investir dans des entreprises exposées aux marchés émergents permet de capter des relais de croissance plus dynamiques que ceux des économies matures.",
      "en": "Holding equity exposed to emerging markets taps into faster growth engines compared to mature, slow-paced legacy economies.",
      "pt": "Ter alocação em companhias atuantes em mercados emergentes permite surfar taxas de expansão maiores que naquelas economias envelhecidas.",
      "es": "Añadir exposición a corporaciones enfocadas en el consumo emergente captura oportunidades de rendimiento mayores que en plazas maduras ordinarias.",
      "de": "Eine moderate Depot-Exposition gegenüber Schwellenländern fängt die dortigen Wachstumsimpulse ein, die in reifen Märkten oft fehlen.",
      "zh": "在多資產配置中，適度選擇布局新興市場營收佔比高的龍頭企業，常能捕捉到比飽和、低增速的已開發國家更具張力的超額增長。"
    },
    "source": "Macro Global Review",
    "timestamp": {
      "fr": "Il y a 2 jours",
      "en": "2 days ago",
      "pt": "Há 2 dias",
      "es": "Hace 2 días",
      "de": "Vor 2 Tagen",
      "zh": "2 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_26",
    "category": "macro",
    "title": {
      "fr": "Monnaies numériques de banque centrale (MNBC) : vers un nouveau système financier",
      "en": "Central Bank Digital Currency (CBDC) trials prepare the next financial system shift",
      "pt": "Moedas digitais de banco central (CBDC) desenham a nova arquitetura financeira",
      "es": "Monedas digitales de banco central (CBDC): hacia un nuevo paradigma monetario",
      "de": "Digitale Zentralbankwährungen (CBDC): Auf dem Weg zu einer neuen Geldordnung",
      "zh": "央行數位貨幣 (CBDC) 進展速報：智慧合約與法幣體系合流的試驗探索"
    },
    "summary": {
      "fr": "La BCE et la Réserve fédérale accélèrent les protocoles de tests de leurs futures monnaies numériques souveraines pour simplifier les paiements.",
      "en": "The ECB and Federal Reserve accelerate testing schedules for sovereign digital tokens to streamline cross-border payments.",
      "pt": "Bancos centrais aceleram testes de ativos soberanos criptografados para baratear liquidações de remessas e transações.",
      "es": "El BCE y la Fed avanzan en sus propuestas piloto de divisas soberanas digitales para agilizar los intercambios financieros.",
      "de": "EZB und Fed forcieren Pilotprojekte für souveräne Digital-Token, um globale Zahlungsströme effizienter zu gestalten.",
      "zh": "歐洲央行與美聯準會相繼擴大主權數位法幣（CBDC）的先導計劃，旨在提升跨國清算效率並降低社會交易摩擦。"
    },
    "fullContent": {
      "fr": "Concevoir et fabriquer des puces de dernière génération demande des infrastructures hautement sophistiquées. Les concepteurs de puces et leurs fondeurs de silicium voient la demande de grappes graphiques s'envoler de 150 % d'une année sur l'autre. Cette tension sur l'offre d'équipements de photolithographie avancés garantit des prix élevés et des marges bénéficiaires colossales à moyen terme.",
      "en": "Designing and fabrication methods of ultra-advanced graphics processors demand unparalleled manufacturing structures. Chip providers and silicon foundries see direct micro-processing demands climbing up over 150% YoY. Stretched capacity across top suppliers maintains high product pricing and high operating margins.",
      "pt": "A manufatura de processadores de última génération de échelle moléculaire exija équipements exclusifs ao monde. Projetistas de semicondutores registram faturamento acelerado. A barreira de entrada nesse setor impede concorrência fácil, protegendo as altas rentabilidades atuais.",
      "es": "La fabricación de componentes lógicos micrométricos requiere maquinaria de difracción láser única e inaccesible para nuevos participantes. Por tanto, las corporaciones líderes des silicio disfrutan de incrementos de ganancia sin competencia latente.",
      "de": "Die Produktion modernster Halbleiter erfordert hochkomplexe Fertigungszyklen. Die Nachfrage nach High-End-Prozessoren steigt im Vorjahresvergleich um über 150 %. Hohe Markteintrittsbarrieren bescheren den Branchenführern hervorragende Gewinnmargen.",
      "zh": "生產先進奈米級邏輯處理元件，仰賴極高科技壁壘與精密設備（如極紫外線光刻機）。這道大自然及商業的巨大壁壘，使得處於壟斷地位的晶圓大廠能享有極強訂價權，在訂單飽和下維持近六成的超高營業毛利率。"
    },
    "expertTakeaway": {
      "fr": "Les semi-conducteurs sont le nouveau pétrole de l'ère numérique. Ce secteur est au cœur de l'innovation boursière, bien qu'il présente un fort caractère cyclique.",
      "en": "Semiconductors represent the modern oil of the computer age. This segment drives capital indexes broadly, though it contains elevated cyclical elements.",
      "pt": "Componentes de silício atuam no world moderno com a relevância que o petróleo possuía na era fabril. Use aportes pequenos para gerenciar o calor das variações.",
      "es": "El silicio es el combustible estratégico de la economía de red. Semicondutores son indispensables, si bien admiten variaciones de inventario rápidas de corto plazo.",
      "de": "Halbleiter sind das Rohöl der Digitalisierung. Die fundamentale Wichtigkeit dieser Branche ist unantastbar, doch die zyklischen Nachfrageschwankungen müssen beachtet werden.",
      "zh": "半導體已成為數位革命時代無可置疑的「核心大宗原料」。其商業護城河極深，但具有獨特的供需調整庫存週期（Hardware Cycles），建議切忌在波段高點盲目追漲。"
    },
    "source": "Wall Street Digest",
    "timestamp": {
      "fr": "Il y a 5 jours",
      "en": "5 days ago",
      "pt": "Há 5 dias",
      "es": "Hace 5 días",
      "de": "Vor 5 Tagen",
      "zh": "5 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_30",
    "category": "markets",
    "title": {
      "fr": "Accélération du marché des introductions en bourse (IPO) de la Tech",
      "en": "Technology IPO pipeline accelerates as markets welcome new growth candidates",
      "pt": "Onda de aberturas de capital (IPO) acelera com apetite por novas marcas",
      "es": "Resurgen las salidas a bolsa (IPO) tecnológicas apoyadas por la liquidez acumulada",
      "de": "Zahl der Tech-Börsengänge (IPOs) steigt durch verbesserte Finanzierungsbedingungen",
      "zh": "科技初創公司掀起 IPO 掛牌上市潮：融資市場流動性解凍引發首發募資熱"
    },
    "summary": {
      "fr": "La réouverture des guichets de cotation permet aux pépites de la cybersécurité et du cloud de lever des capitaux significatifs auprès des institutionnels.",
      "en": "The revival of exchange listings enables cybersecurity and cloud service firms to command premium valuations in new share creations.",
      "pt": "A reativação do mercado secundário permite que promessas de computação de nuvem e segurança cibernética alcancem listagens expressivas nas bolsas.",
      "es": "La reactivación del mercado secundario facilita a firmas de ciberseguridad y servicios en la nube captar capital de alta escala con primas de emisión atractivas.",
      "de": "Das verbesserte Marktumfeld ermöglicht es Cloud- und Cyber-Security-Spezialisten, erfolgreich frisches Kapital über Erstnotierungen aufzunehmen.",
      "zh": "IPO 新股市場重奪量能，數家專攻雲端儲存安全、軟體即服務（SaaS）的獨角獸公司宣告成功掛牌，超額認購熱度顯示市場風險偏好正在回溫。"
    },
    "fullContent": {
      "fr": "Après une période de relative léthargie causée par les hausses de taux passées, le marché des introductions en bourse (IPO) renoue avec des volumes robustes. Les banques d'investissement observent une forte demande institutionnelle pour les profils présentant une rentabilité claire et une croissance supérieure à 20 %. Cette dynamique réinjecte du sang neuf sous forme d'actifs valorisables pour les indices.",
      "en": "Following periods of dry trading caused by restrictive regulatory periods, initial public offerings (IPO) are processing at solid paces. Deal arrangers highlight deep queues for companies combining clean balance tracks with over 20% growth. This flow infuses fresh assets into major indices.",
      "pt": "Depois de longo período morno gerado pelo crédito inacessível, as ofertas iniciais (IPO) voltam ao noticiário. Bancos financeiros revelam alta demanda por empresas lucrativas de TI apresentando expansão anualizada acima de 20%, gerando fôlego novo às bolsas.",
      "es": "Tras meses de letargo derivados del tensionamiento en tasas de interés, las colocaciones iniciales de acciones recuperan tracción. Las mesas de contratación confirman un fuerte interés por compañías con flujos recurrentes de caja e ingresos consistentes.",
      "de": "Nach einer Phase relativer Zurückhaltung im IPO-Markt zeichnet sich eine deutliche Belebung ab. Investmentbanken berichten von regem Interesse an profitablen Technologie-Anbieten, was das Angebot an investierbaren Vermögenswerten verbreitert.",
      "zh": "在經歷了先前緊縮利率導致新股融資冰封期後，今年夏天 IPO（首次公開招股）活動正迅速解凍。各大投行承銷部門接獲數家營運體質健全、具獲利能力且年增長率高於 20% 的優質軟體獨角獸新股申請案，認購情況普遍熱絡，激勵了一級市場回流機制。"
    },
    "expertTakeaway": {
      "fr": "Une nouvelle vague d'introductions dynamise les marchés d'actions, mais restez prudent : n'achetez pas aveuglément au cours de premier jour, attendez souvent que la poussière baisse.",
      "en": "A rising IPO volume injects dynamic variety, but keep cautions: avoiding buying on opening day hype and waiting for price consolidation is generally safer.",
      "pt": "Novos IPOs oxigenam o ecossistema acionário, no entanto exija prudência. Comprar na estreia do pregão (hype) costuma expor você a derretimentos bruscos.",
      "es": "La llegada de nuevos proyectos atrae el apetito comprador. Aun así, conviene vigilar la volatilidad del primer día y aguardar estabilización de precios.",
      "de": "IPO-Wellen bringen Dynamik, verlangen Anlegern aber auch Disziplin ab. Ein vorsichtiger Blick auf die ersten Quartalszahlen schützt vor überteuerten Erstkäufen.",
      "zh": "新股上市固然能擴充大盤可支配的資產板塊，但散戶切忌盲目參與「首日開盤飆車（IPO Opening Day Hype）」。等待幾期財報透明化、股價回歸安定的盤整區，是老練投資人的避雷基本功。"
    },
    "source": "Wall Street Digest",
    "timestamp": {
      "fr": "Il y a 6 jours",
      "en": "6 days ago",
      "pt": "Há 6 dias",
      "es": "Hace 6 días",
      "de": "Vor 6 Tagen",
      "zh": "6 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_31",
    "category": "crypto",
    "title": {
      "fr": "Fusions de protocoles Web3 et essor de la propriété virtuelle : l'usage l'emporte sur l'effet de mode",
      "en": "Web3 protocols consolidation and digital ownership progress: real utility beats hype cycles",
      "pt": "Fusão de protocols Web3 e soberania digital: utilidade real se destaca das modas",
      "es": "Fusiones en redes Web3 y propiedad digital nativa: la utilidad real se impone sobre el ruido",
      "de": "Konsolidierung bei Web3-Protokollen: Echte Anwendungsfälle setzen sich gegen Werbehype durch",
      "zh": "Web3 生態協定兼併與鏈上資產確權：真實技術應用正替代純概念投機炒作"
    },
    "summary": {
      "fr": "L'écosystème réorienté vers les infrastructures de jeux et les systèmes de gestion de droits d'auteur élimine les concepts spéculatifs stériles.",
      "en": "The digital ecosystem redirects efforts toward stable gaming structures and intellectual assets tracking, clearing out hype.",
      "pt": "O ecossistema acelera a transição para estruturas práticas de entretenimento e autenticação de arquivos de alto valor.",
      "es": "El ecosistema blockchain se orienta decididamente a plataformas de entretenimiento digital y verificación infalsificable de propiedad intelectual.",
      "de": "Die Blockchain-Entwicklerszene konzentriert sich zunehmend auf skalierbare Spieleplattformen und die digitale Rechteverwaltung.",
      "zh": "區塊鏈生態加速將應用場景鎖定在虛擬資產、版權溯源及數位確權上，逐漸排除先前無實質支撐的虛妄概念炒作，代之以真實的使用者留存率與 Gas 消耗數據。"
    },
    "fullContent": {
      "fr": "Les alliances stratégiques récentes entre protocoles de niveau 1 unifient les marchés de jetons. L'attention industrielle s'écarte de la pure spéculation d'art numérique pour s'implanter sur les réseaux décentralisés de rendu graphique, la distribution de puissance CPU distribuée et la protection cryptographique de l'identité des utilisateurs.",
      "en": "Strategic partnerships among leading layer-1 networks unify digital token ecosystems. Focus is pivoting away from purely speculative digital assets to practical distributed graphics acceleration, and privacy infrastructure layer developments.",
      "pt": "A unificação de ecossistemas principais reduz barriers de usabilidade para utilizadores finais. Cientistas computacionais dedicam esforços na infraestrutura descentralizada de processamento visual para inteligência artificial, conferindo sustentabilidade ao setor.",
      "es": "Fusiones estratégicas entre redes de primera línea abaratan la comunicación entre blockchains. La atención ya no está en las modas efímeras sino en la creación de nubes descentralizadas de procesamiento de datos y verificación de identidad.",
      "de": "Kooperationen führender Blockchains ermöglichen einen nahtlosen Asset-Transfer. Der Branchenfokus verschiebt sich von spekulativen Sammler-Tokens hin zu realen dezentralen Diensten wie Cloud-Computing und dezentralen IDs.",
      "zh": "幾大一線公鏈的跨鏈協議推進了資產流動性的統一整合。市場目光已不再糾結於炒作虛擬圖片與空頭概念，而是真正轉向去中心化圖形渲染算力儲存、邊緣計算，以及高安全性數位身分驗證（DID）等實用基礎設施構建。"
    },
    "expertTakeaway": {
      "fr": "Recherchez des jetons associés à des protocoles générant de réels flux de trésorerie issus des frais d'utilisation pour pérenniser votre épargne virtuelle.",
      "en": "Look for digital tokens backed by networks executing real usage billing to guarantee structural stability for your virtual investment options.",
      "pt": "Dê preferência a tokens associados a ecossistemas com contínua demanda por combustível (gas fees) legítima decorrente de utilização do público.",
      "es": "Centras tu análisis en tokens útiles que financian transacciones de red recurrentes y reales en lugar de meras promesas de revalorización especulativa.",
      "de": "Fokussieren Sie sich im Krypto-Sektor auf Protokolle mit etablierter Gebühreneinnahme-Struktur, da diese fundamentalen Wert ausdrücken.",
      "zh": "在數字資產配置中，建議鎖定那些具有真實用戶群體、能穩定通過智慧合約收取並燃燒手續費（Gas Fees）流動通證，這才是對抗估值泡沫的堅實依據。"
    },
    "source": "Decentralized Daily",
    "timestamp": {
      "fr": "Il y a 5 jours",
      "en": "5 days ago",
      "pt": "Há 5 dias",
      "es": "Hace 5 días",
      "de": "Vor 5 Tagen",
      "zh": "5 天前"
    },
    "sentiment": "neutral"
  },
  {
    "category": "learning",
    "title": {
      "fr": "Comprendre le Ratio de Sharpe : comment évaluer le rendement ajusté au risque ?",
      "en": "Cracking the Sharpe Ratio: how to measure volatility-adjusted returns correctly",
      "pt": "A importância do Índice de Sharpe: aprenda a calcular o retorno ajustado ao risco",
      "es": "Entendiendo el Ratio de Sharpe: valora tu rentabilidad real ajustada al risque",
      "de": "Das Sharpe-Ratio entschlüsselt: So messen Sie risikobereinigte Renditen richtig",
      "zh": "專業法人的評估神棒：一分鐘看懂「夏普值 (Sharpe Ratio)」與風險回報比"
    },
    "summary": {
      "fr": "Le rendement brut ne suffit pas : apprenez à calculer si la volatilité subie pour générer vos gains en valait vraiment la peine.",
      "en": "Raw return metrics are not enough. Discover how to calculate whether the price volatility survived was worth the investment gains.",
      "pt": "Rentabilidade nominal não é tudo. Aprenda se as variações bruscas que seu capital enfrentou no simulador realmente valeram os lucros finais obtidos.",
      "es": "El rendimiento porcentual simple resulta incompleto. Aprende a descifrar si la volatilidad que soportó tu cartera compensó el beneficio anual obtenido.",
      "de": "Die nackte prozentuale Performance greift oft zu kurz. Nutzen Sie diese Kennzahl, um zu ermitteln, ob die Erträge im Verhältnis zu den Kursschwankungen stehen.",
      "zh": "高回報並不等於優秀。夏普值能協助你拆解：在承擔同等波動風險的代價下，你所賺取的「超額收益」是否高過安全無風險利息，還是僅僅是好運使然。"
    },
    "fullContent": {
      "fr": "Inventé par le prix Nobel William Sharpe, ce ratio divise l'excès de rendement d'un actif (par rapport au taux sans risque) par la volatilité de son cours. Un ratio supérieur à 1 est considéré comme excellent, car il démontre que les gains s'obtiennent grâce à des choix d'allocation solides et non par une prise de risque spéculative démesurée. Cela permet de comparer l'efficacité de deux portefeuilles.",
      "en": "Created by Nobel laureate William Sharpe, this formula divides a portfolio's excess returns (relative to safe risk-free sovereign assets) by its annualized volatility. A ratio above 1.0 points to exceptional management efficiency, proving that gains occur via solid choices rather than reckless high-stakes speculation. It facilitates comparing portfolio performance.",
      "pt": "Desenvolvido pelo prêmio Nobel William Sharpe, esse múltiplo subtrai do seu rendimento nominal a taxa básica e divide o saldo pela volatilidade suportada. Um fator acima de 1,0 indica excelente técnica operacional, provando que o lucro é decorrência de boas alocações e não de apostas frenéticas sem freio.",
      "es": "Diseñado por el laureado premio Nobel William Sharpe, el ratio descuenta el interés libre de riesgo de la ganancia global del activo, dividiendo el resultado por su volatilidad anual. Si el número resultant supera 1.0, el portafolio goza de una eficiencia soberbia, reflejando maestría técnica frente a la imprudencia.",
      "de": "Der vom Nobelpreisträger William Sharpe entwickelte Quotient teilt die Überrendite eines Depots (Performance abzüglich des risikofreien Zinssatzes) durch die Volatilität. Ein Wert über 1,0 gilt als erstklassig, da er belegt, dass der Ertrag auf einer systematischen Selektion beruht, nicht auf blindem Spekulationsrisiko.",
      "zh": "夏普比例由諾貝爾得主威廉·夏普提出。它用投資組合的實際年化收益減去無風險資產收益，再除以該資產的年化波動率（標準差）。夏普值大於 1.0，即代表投資人在承受可控波動的代價下獲取了極佳的超額溢酬；若夏普值低於 0.5，說明每多賺 1 元本金都需要承受常人難忍的驚濤駭浪。"
    },
    "expertTakeaway": {
      "fr": "Ne cherchez pas le portefeuille le plus rentable, mais le plus efficace. Un ratio de Sharpe élevé garantit une progression sereine et pérenne de votre capital.",
      "en": "Do not search purely for hyper-volatile yields, buy efficient portfolios. High Sharpe ratios support peaceful long-term compound growth of capital assets.",
      "pt": "A meta ideal do investidor maduro é a eficiência e não as oscilações extremas. Índices de Sharpe robustos garantem segurança na evolução diária de metas.",
      "es": "Evita obsesionarte únicamente con el mayor porcentaje latente; prioriza la eficiencia. Un ratio de Sharpe sostenido y alto propicia un crecimiento tranquilo.",
      "de": "Verwechseln Sie Renditegier nicht mit Investitionseffizienz. Ein hohes Sharpe-Ratio ist das Kennzeichen professioneller Anlageportfolios.",
      "zh": "成熟配置不盲信「高收益率」，而是追求「高夏普效率」。高效率的資產配置組合能協助投資人在震盪市場中穩健前行。"
    },
    "source": "Academic Finance Journal",
    "timestamp": {
      "fr": "Il y a 3 jours",
      "en": "3 days ago",
      "pt": "Há 3 dias",
      "es": "Hace 3 días",
      "de": "Vor 3 Tagen",
      "zh": "3 天前"
    },
    "sentiment": "positive",
    "id": "std_32"
  },
  {
    "id": "std_37",
    "category": "commodities",
    "title": {
      "fr": "La transition verte stimule la demande d'argent physique pour les panneaux solaires",
      "en": "Green transition drives massive physical silver demand for solar panels",
      "pt": "Transição ecológica impulsiona forte demanda por prata física em painéis solares",
      "es": "La transición verde impulsa demanda masiva de plata física para paneles solares",
      "de": "Grüne Energiewende treibt Nachfrage nach physischem Silber für Solarpanels an",
      "zh": "清潔能源與太陽能板熱潮帶動實物白銀工業需求噴發"
    },
    "summary": {
      "fr": "La transition vers les énergies renouvelables nécessite des volumes massifs d'argent physique pour fabriquer les cellules photovoltaïques, tendant le marché.",
      "en": "The rapid push for global solar panel arrays consumes substantial volumes of physical silver, triggering severe mine delivery shortages.",
      "pt": "A transição ecológica acelera drasticamente o consumo industrial de prata física devido aos painéis solares, criando gargalos de oferta e alta de preços.",
      "es": "La transición energética consume cantidades masivas de plata para celdas solares, reduciendo inventarios globales y disparando la cotización hacia máximos.",
      "de": "Die globale Solar-Initiative benötigt Rekordmengen an physischem Silber für Photovoltaik-Zellen, was zu einer akuten Verknappung auf dem Rohstoffmarkt führt.",
      "zh": "隨著全球太陽能光電板和高效能電子元件部署量暴增，白銀實物工業需求出現歷史性缺口，庫存快速去化引發供需吃緊與價格飆升。"
    },
    "fullContent": {
      "fr": "L'argent physique est un métal hybride, à la fois précieux et hautement industriel. L'industrie des énergies renouvelables, notamment les panneaux solaires, utilise des milliers de tonnes d'argent en raison de sa conductivité électrique parfaite. Alors que la production minière stagne, la demande industrielle crée des tensions d'approvisionnement majeures, poussant les prix à la hausse.",
      "en": "Physical silver is a unique hybrid asset: a precious metal of historic worth, and a vital industrial element for green hardware. Photovoltaic cells are highly dependent on silver for electric conduction. As mining output remains inflexible, massive clean-tech growth triggers structural supply deficits, elevating silver spot valuations on commodity exchanges.",
      "pt": "A prata é um metal híbrido essencial para a transição energética: além de ativo de proteção clássico, possui a maior condutividade elétrica entre todos os metais, sendo indispensável para as placas solares. Com a produção de mineração global estagnada, a demanda da indústria verde pressiona de forma contínua as cotações internacionais para níveis recordes.",
      "es": "La plata física ostenta un doble rol de resguardo financiero y materia prima indispensable para la tecnología ecológica. El sector fotovoltaico demanda toneladas métricas anuales del metal por su inigualable conductividad térmica y eléctrica. La rigidez de la oferta minera frente al auge de paneles solares cimenta un déficit que impulsa los precios.",
      "de": "Silber ist sowohl ein wertvolles Edelmetall als auch ein unersetzlicher Rohstoff für die Energiewende. Aufgrund seiner exzellenten elektrischen Leitfähigkeit wird physisches Silber in enormen Mengen für die Beschichtung von Solarzellen benötigt. Da die Bergbauproduktion seit Jahren stagniert, führt der Solarboom zu anhaltenden strukturellen Defiziten.",
      "zh": "實物白銀兼具貨幣防禦與工業戰略金屬雙重屬性。由於擁有無與聯比的導電與導熱效能，白銀是太陽能光電板、半導體組裝中最無可替代的核心原材料。在全球礦產產量剛性見頂的局勢下，綠色科技與清潔能源產業對白銀實物的瘋狂採購，建立了長期的結構性供需赤字，推升期貨現貨白銀價格大漲。"
    },
    "expertTakeaway": {
      "fr": "L'argent est un excellent moyen de participer indirectement à la transition énergétique. Contrairement à d'autres métaux industriels, il garde une valeur monétaire refuge intrinsèque lors des crises boursières ou monétaires.",
      "en": "Silver offers an attractive exposure to clean technology. Unlike lithium or cobalt, it keeps a strong precious-metal backup value that stabilizes portfolios during macro currency depreciation.",
      "pt": "Investir em prata permite se expor à transição ecológica global com um colchão de segurança clássico. Diferente de metais estritamente industriais, a prata retém valor como reserva monetária resiliente.",
      "es": "La plata brinda una doble vía de revalorización en carteras diversificadas. Aúna el empuje de la tecnología ecológica limpia con el valor de reserva tangible clásico de los metales preciosos.",
      "de": "Silber bietet Anlegern eine interessante Kombination aus industrieller Wachstumsstory und klassischem Inflationsschutz. Es verhält sich in Krisenzeiten stabiler als rein industrielle Industriemetalle.",
      "zh": "白銀兼有清潔能源科技需求增長紅利與貴金屬避險屬性。與價格暴起暴落的鋰或鈷不同，白銀保留了強大的貨幣保值底層價值，能夠在通膨狂潮或信用法幣貶值期為投資人提供優質的安全邊際。"
    },
    "source": "Commodity Intelligence",
    "timestamp": {
      "fr": "Il y a 6 jours",
      "en": "6 days ago",
      "pt": "Há 6 dias",
      "es": "Hace 6 días",
      "de": "Vor 6 Tagen",
      "zh": "6 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_38",
    "category": "forex",
    "title": {
      "fr": "Comprendre le Carry Trade : maximiser la différence de taux d'intérêt",
      "en": "Understanding the Carry Trade: capturing interest rate spreads in foreign exchange",
      "pt": "A estratégia de Carry Trade: lucrando com o diferencial de juros no Forex de moedas",
      "es": "Carry Trade en Forex: cómo rentabilizar los diferenciales de tipos de interés",
      "de": "Der Carry-Trade im Detail: Renditevorteile durch Zinsdifferenzen nutzen",
      "zh": "拆解跨境利差交易（Carry Trade）：如何借入低息貨幣套取高息資產息差"
    },
    "summary": {
      "fr": "Cette stratégie historique consiste à emprunter dans une devise à taux faible pour investir dans une devise à rendement élevé, capturant la différence.",
      "en": "This historic FX strategy involves borrowing in a low-yield currency to invest in a higher-yielding one, capturing the net spread.",
      "pt": "Essa técnica consagrada consiste em captar empréstimos em moedas com juros baixos para aplicar em divisas de alto rendimento.",
      "es": "Esta disciplina clásica consiste en financiarse mediante préstamos en divisas baratas para invertirlas en activos con altas tasas de interés.",
      "de": "Bei dieser klassischen Methode leihen sich Händler Liquidität in einer zinsgünstigen Währung und investieren sie in höher verzinsten Räumen.",
      "zh": "這項外匯套利模式是指借入超低利率的貨幣，再換匯投資於高利息的國家資產。只要匯率不劇烈逆轉，即可持續獲得穩定的利息收益。"
    },
    "fullContent": {
      "fr": "Le 'Carry Trade' est la technique historique des grands fonds de change Forex. Le principe consiste à vendre une devise 'finançante' à taux d'intérêt minime (le Yen) et d'acheter simultanément une devise 'cible' rémunérant fortement l'épargne. Tant que les taux de change restent relativement stables, cette différence nette de taux rapporte un profit continu, accumulant de la valeur sans effort direct, bien que le risque de retournement de change reste la menace invisible à maîtriser.",
      "en": "The classic carry trade is an evergreen blueprint across speculative macro entities. Fund managers borrow funds in ultra-low rate environments, immediately swapping them for high-rate currencies to collect the direct net interest income spread. If currencies remain stable, the operation yields effortless passive returns, though sudden currency appreciation can spark severe margin calls.",
      "pt": "A estratégia de carry trade é o pilar de rentabilidade de mesas de câmbio profissionais. O investidor contrai empréstimos em divisas com juros quase nulos e aloca simultaneamente em países pagando dois dígitos de juros. Se o câmbio mantiver estabilidade, ganha-se a diferença líquida de taxas.",
      "es": "El carry trade es una de las prácticas más consolidadas de especulación monetaria mundial. Se basa en financiarse en divisas de bajo rendimiento para convertirlas y colocarlas en depósitos remunerativos de otras naciones. El peligro latente reside en una devaluación que deprima el diferencial de interés.",
      "de": "Das Prinzip des Carry-Trades ist simpel, aber mächtig: Ein Händler leiht sich Liquidität in einer zinsgünstigen Währung und investiert sie auf einem Devisenmarkt mit hoher Verzinsung. Sofern sich die Wechselkurse nicht drastisch verschieben, vereinnahmen Händler die Zinsdifferenz, was jedoch mit Devisenrisiken einhergeht.",
      "zh": "外匯跨境利差交易（Carry Trade）是全球主權和宏觀套利基金獲取長期穩定收益的頂級密技。操作時，交易員在低利率環境下借入貨幣（如貼地零利率日圓），隨後將其在外匯期貨盤換成高收益國家的定存。只要匯率不發生急遽逆變撤退，投資人便可坐享巨額利差利潤；但一旦日圓因避險需求急劇升值，則極易發生災難性平倉潮。"
    },
    "expertTakeaway": {
      "fr": "Le carry trade offre des rendements passifs élevés, mais attention à la tempête de change : s'apprécier de quelques centimes sur la devise d'emprunt peut effacer un an de gain.",
      "en": "Carry trades deliver high passive cash-flows, but beware currency reversals. Sudden appreciation of the borrowing currency can quickly erase annual gains.",
      "pt": "A operação sustenta volumoso fluxo constante, contudo respeite o risco cambial. A alta impetuosa da moeda tomada emprestada pode corroer anos de arbitragem.",
      "es": "El carry trade genera flujos pasivos de gran escala, pero exige extremo control. Una apreciación fortuita del tipo emisor arrasaría con el rendimiento acumulado.",
      "de": "Der Carry-Trade ist ertragreich, gleicht aber dem Aufsammeln von Münzen vor einer Dampfwalze. Dreht der Devisenkurs des Nehmerlandes nach oben, drohen Verluste.",
      "zh": "跨境利差交易是極佳的被動現金流來源，但高回報伴隨高風險——即「匯率突變風險」。一旦借款國貨幣（如日圓）受地緣衝突影響升值 5%，將在數小時內侵蝕一整年的利息所得。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 1 semaine",
      "en": "1 week ago",
      "pt": "Há 1 semana",
      "es": "Hace 1 semaine",
      "de": "Vor 1 Woche",
      "zh": "1 週前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_43",
    "category": "learning",
    "title": {
      "fr": "Qu'est-ce qu'un ordre Trailing Stop ? Sécuriser ses gains automatiquement",
      "en": "What is a Trailing Stop Order? Lock in profits and limit downside risk automatically",
      "pt": "Entendendo a ordem Trailing Stop: como travar lucros de forma inteligente e sem emoção",
      "es": "Trailing Stop en Bolsa: resguarda tus beneficios automáticamente ante caídas del mercado",
      "de": "Der Trailing-Stop erklärt: Gewinne sichern und Verluste begrenzen im Autopiloten",
      "zh": "移動滑動止損（Trailing Stop）：免盯盤自動鎖定利潤與防守的機構級神器"
    },
    "summary": {
      "fr": "Découvrez le fonctionnement de l'ordre stop suiveur pour accompagner les hausses de cours tout en liquidant automatiquement votre position en cas de chute.",
      "en": "Learn how trailing stop mechanisms work to track upward rallies and execute automatic liquidations when assets reverse trend.",
      "pt": "Aprenda a utilizar ordens dinâmicas de venda para acompanhar tendências de alta e proteger seu saldo contra reversões rápidas de preço.",
      "es": "Conoce el funcionamiento de los stops dinámicos para capturar rentabilidad alcista y blindar tu capital ante correcciones rápidas.",
      "de": "Erfahren Sie, wie ein dynamischer Stoppverlust Kursrallyes begleitet und Ihre Gewinne bei plötzlichen Marktwenden absichert.",
      "zh": "一分鐘看懂移動止損：在股價多頭時跟隨上調防衛線，一旦高檔拉回達到預設百分比時全自動賣出避險。"
    },
    "fullContent": {
      "fr": "L'ordre trailing stop (ou stop suiveur) est l'un des outils de gestion des risques les plus sophistiqués pour l'investisseur. Contrairement à un stop loss fixe qui reste bloqué à son seuil initial, le trailing stop s'ajuste continuellement à la hausse à mesure que le cours de l'actif augmente. Il maintient une distance de sécurité constante. Si le marché se retourne et franchit ce seuil dynamique, l'ordre de vente est immédiatement déclenché.",
      "en": "The trailing stop is a premier automated defensive mechanism for institutional and retail traders. Unlike a static stop limit, trailing orders dynamically recalculate their activation trigger upwards in a pre-defined distance behind the asset price high. If market trends turn negative, the order executes automatically, sealing accumulated gains.",
      "pt": "A ordem trailing stop representa uma das melhores salvaguardas para o especulador profissional. Diferente de um limite estático, o stop móvel recalcula o limiar de ativação para cima de acordo com a máxima atingida, de forma que se derreter o preço ocorre a venda veloz automática, blindando os rendimentos do investidor.",
      "es": "La orden trailing stop representa una de la mejores defensas del especulador racional. A diferencia de un límite convencional congelado, esta instrucción recalcula su umbral de activación hacia arriba según el máximo alcanzado, resguardando un margen de caída prudente. Al quebrar la cotización el porcentaje definido desde máximos, se liquida la posición reteniendo dividendos virtuales acumulados.",
      "de": "Ein Trailing-Stop ist das ultimative Werkzeug für disziplinierte Risiko-Manager. Im Gegensatz zur statischen Verlustbegrenzung zieht der Auslösewert bei Kursgewinnen automatisch in einem vordefinierten prozentualen Abstand (z. B. 5 % unter dem Höchststand) mit. Dreht der Markt ins Negative und fällt die Aktie um 5 % unter das Hoch, wird die Position liquidiert und der Buchgewinn realisiert.",
      "zh": "移動滑動止損是機構級投資人風險控制中最常用的自動化防守武器。與一般的固定止損點不同，它在設定好波動間距（如偏離最高價 5%）後，會跟隨股價的上攻而不斷上推止損線。然而，一旦股價攻頂回落達到 5% 時，系統會強制自動執行出脫避險，在無需人工盯盤介入下保留大部分波段獲利。"
    },
    "expertTakeaway": {
      "fr": "Il s'agit de laisser courir vos gains tout en fixant une limite stricte à la baisse. C'est l'outil indispensable pour chasser les émotions négatives du simulateur.",
      "en": "Let your profits run while cutting short-term risks tightly. It represents a vital digital mechanism to strip fear and greed from trading indices.",
      "pt": "Permita que o lucro cresça livremente, estabelecendo uma barreira rápida para retiradas automáticas. Domar o medo é o segredo do sucesso do simulador.",
      "es": "Permite acompañar el repunte alcista maximizando el beneficio latente, cortando de raíz pérdidas excesivas. Es una herramienta clave para neutralizar las decisiones impulsivas.",
      "de": "Lassen Sie Gewinne laufen, während Sie Verlustrisiken eng begrenzen. Dieses Tool entzieht emotionalen Trading-Fehlentscheidungen die Grundlage.",
      "zh": "「讓利潤奔跑，讓虧損截斷」的精髓即在於此。移動止損能協助投資人在股價狂飆時不必提早下車，且能徹底剔除貪婪與恐懼這兩大最阻礙收益的人性弱點。"
    },
    "source": "Central Board News",
    "timestamp": {
      "fr": "Il y a 2 minutes (BREAKING)",
      "en": "2 minutes ago (BREAKING)",
      "pt": "Há 2 minutes (BREAKING)",
      "es": "Hace 2 minutes (BREAKING)",
      "de": "Vor 2 Minuten (BREAKING)",
      "zh": "剛剛 (突發快訊)"
    },
    "sentiment": "negative",
    "isShockNews": true
  },
  {
    "id": "shk_2",
    "category": "markets",
    "title": {
      "fr": "Tensions géopolitiques majeures : l'or s'envole, le baril de pétrole grimpe de 18% en 24h",
      "en": "Geopolitical flashpoint triggered: gold spikes, crude oil futures execute unprecedented 18% spike",
      "pt": "Crise geopolítica internacional: ouro atinge recorde historique e barril de petróleo salta 18% em horas",
      "es": "Conflicto Geopolítico Global: El oro alcanza récord histórico y el petróleo sube un 18% extra",
      "de": "Geopolitische Eskalation: Goldpreis erreicht Rekordhoch, Rohöl verteuert sich in Rekordzeit um 18%",
      "zh": "地緣政治衝突急遽惡化！黃金避險資金破表創歷史新高，原油期貨 24 小時瘋狂飆升 18%！"
    },
    "summary": {
      "fr": "La fermeture temporaire d'un détroit d'approvisionnement stratégique provoque une panique collective sur l'énergie. L'indice VIX de la volatilité prend 50 points.",
      "en": "The structural supply disruption across main transport routes generates global panic. The stock volatility VIX index shoots up by 50 points.",
      "pt": "O bloqueio temporário de canais logísticos vitais desencadeia pânico em escala global nos contratos de derivados. O VIX (índice do medo) explode.",
      "es": "La interrupción de canales de fletes marítimos desata temores inflacionistas masivos. Las refinerías alertan de un desabastecimiento, elevando volatilidad.",
      "de": "Die Blockade eines wesentlichen Schifffahrtskanals löst weltweite Panik aus. Der Volatilitätsindex VIX schießt urplötzlich nach oben.",
      "zh": "由於一處極具戰略戰地的全球能源及零組件運物航道受阻，激起商品交易所原物料價格狂飆潮，期貨倉位全面嘎空，恐慌指數 VIX 一天狂拉超過 50 點。"
    },
    "fullContent": {
      "fr": "La paralysie d'un corridor d'expédition maritime stratégique alimente la panique inflationniste mondiale. Les raffineries de pétrole anticipent des pénuries de brut, et le prix des matières premières de base suit cette trajectoire. Cela pénalise immédiatement la rentabilité des entreprises aéronautiques, automobiles et manufacturières.",
      "en": "The shutdown of a strategic sea lane sparks global inflationary panics. Refineries anticipate severe crude shortages, forcing raw commodity valuations to skyrocket. This macro environment heavily penalties transport, aviation, and heavy manufacturing sectors.",
      "pt": "A paralisação de um canal de navegação marítimo estratégico alimenta o pânico inflacionário global. Refinarias antecipam severas escassezes de petróleo, elevando as cotações de commodities. Esse contexto penaliza severamente a rentabilidade de transporte, aviação e manufatura.",
      "es": "El cierre de un canal marítimo clave desata pánico inflacionario global. Las refinerías anticipan bloqueos de cruto, elevando costo de materias primas e impactando industries.",
      "de": "Die Blockade einer strategischen Schifffahrtsroute schürt globale Inflationsängste. Raffinerien befürchten akute Engpässe, was Rohstoffpreise explodieren lässt. Dies belastet die Profitabilität im Transport- und Industriesektor massiv.",
      "zh": "極具關鍵性的全球航運海峽受阻停航，引發空前的全球通膨與供應鏈短缺恐慌。各大煉油廠預期原油斷炊，推動基本大宗商品物價井噴。這使航空、物流及汽車製造等重工業面臨極具摧毀性的成本上升壓力。"
    },
    "expertTakeaway": {
      "fr": "En période de chocs géopolitiques extrêmes, l'or reste le refuge d'excellence, tandis que l'énergie pèse durablement sur les portefeuilles d'actions.",
      "en": "During severe geopolitical disruptions, gold reigns as the ultimate safe haven, whereas surging energy costs will compress stock market multiples.",
      "pt": "Em tempos de graves choques geopolíticos, o ouro atua como porto seguro definitivo, enquanto custos de energia pesam enormemente sobre índices de ações.",
      "es": "Ante la escalada geopolítica extrema, el oro consolida su estatus defensivo indiscutible, mientras que la suba de la energía ahoga el avance de la bolsa.",
      "de": "In Phasen extremer geopolitischer Konflikte erweist sich Gold als ultimativer sicherer Hafen, während explodierende Energiekosten die Aktienmärkte belasten.",
      "zh": "地緣政治極端交火期，黃金依然是最終極的防禦性資產；急升的能源成本將對股票估值倍數造成持續性的緊縮壓力。"
    },
    "source": "Global Intelligence Bulletin",
    "timestamp": {
      "fr": "Il y a 10 minutes",
      "en": "10 minutes ago",
      "pt": "Há 10 minutes",
      "es": "Hace 10 minutos",
      "de": "Vor 10 Minuten",
      "zh": "10 分鐘前"
    },
    "sentiment": "negative",
    "isShockNews": true
  },
  {
    "id": "std_39",
    "category": "commodities",
    "title": {
      "fr": "Avancée majeure dans le recyclage : extraction de 95% de lithium à partir de batteries usées",
      "en": "Battery Recycling Breakthrough: Extracting up to 95% of active lithium from spent cells",
      "pt": "Avanço histórico na reciclagem: recuperação de 95% de lítio ativo de células degradadas",
      "es": "Hito en el reciclaje de baterías: reactivan el 95% del litio contenido en baterías muertas",
      "de": "Technologischer Durchbruch beim Recycling: Gewinnung von 95% des Lithiums aus Altbatterien",
      "zh": "電池回收重大技術突破：新型濕法冶金提純製程成功提取 95% 廢電池活性鋰"
    },
    "summary": {
      "fr": "De nouveaux processus permettent d'extraire jusqu'à 95% du lithium contenu dans les anciennes batteries, limitant la dépendance aux mines à ciel ouvert.",
      "en": "Evolving industrial processes retrieve up to 95% of active lithium from spent cells, mitigating default dependency on primary mining sites.",
      "pt": "Processadoras lograram recuperar 95% de minerais nobres das células degradadas, amenizando as necessidades extremas de abertura de novas jazidas.",
      "es": "Un nuevo hito químico de procesamiento reactiva el 95% del litio contenido en baterías de descarte, aliviando las tensiones de suministro primario de cantera.",
      "de": "Eine neuartige hydrometallurgische Methode ermöglicht die Rückgewinnung von 95 % des Lithiums aus Altbatterien und schont primäre Ressourcen.",
      "zh": "新型濕法冶金提純製程宣告成功，能以低能耗提取高達 95% 的廢舊電池活性鋰。這項成果對於減少對原礦開採的過度依賴具有里程碑之意。"
    },
    "fullContent": {
      "fr": "Le défi environnemental complexe des voitures électriques s'améliore. Des entreprises technologiques d'Europe ont breveté des systèmes fermés de purification permettant de extraire des matériaux de cathode usés avec une pureté adaptée aux composants automobiles d'origine. Cette percée soutient le développement de chaînes d'approvisionnement circulaires et limite les risques politiques d'approvisionnement de matières premières.",
      "en": "The environmental loop of electric mobility is improving significantly. European green-tech operators patented circular filtration steps enabling recovery of high-grade cathode metals. This breakthrough fosters localized supply security and trims sovereign dependency on raw material imports.",
      "pt": "O calcanhar de Aquiles dos veículos sustentáveis começa a ser equacionado de forma brilhante. Fabricantes registraram patentes que refinam pilhas gastas em grau idêntico ao extraído de solo. Essa cadeia de reciclagem reduz bloqueio geopolíticos ou embargos de fronteira mercantis.",
      "es": "El talón de Aquiles de la transición de vehículos limpios asume progresos incuestionables. Patentes de refino local consiguen dar nova vida a las celdas muertas. El hito abre compuertas de autonomía comercial a ensambladoras occidentales de automóviles.",
      "de": "Die Umweltbilanz der Elektromobilität verbessert sich beträchtlich. Europäische Cleantech-Unternehmen patentierten geschlossene Kreislaufverfahren zur Gewinnung hochreiner Kathodenmetalle, was die Abhängigkeit von überseeischen Bergbauregionen senkt.",
      "zh": "以往備受爭議的電動車電池回收難題迎來關鍵進展。西歐綠色材料大廠成功研發出閉環淨化專利，能將退役電池中的鋰、鈷、鎳等組件化學重組為車規級的原始正極材料。這不僅縮減了環境污染，更令車企能建立自主合規的本地循環供應鏈。"
    },
    "expertTakeaway": {
      "fr": "Le recyclage des métaux est un secteur à forte valeur ajoutée technologique. À long terme, ces brevets supplanteront les simples exploitants de mines.",
      "en": "Advanced metal sorting and refining is a premium software-enhanced sector. Circulating patents are highly valuable and hold superior margins than raw miners.",
      "pt": "A reciclagem molecular concentra valiosas patentes de engenharia. No horizonte, essas patentes acumularão maiores retribuições que companhias puras de mineração.",
      "es": "El reciclaje de materias primas valiosas ampara patentes cerradas de alta rentabilidad. A largo plazo, estas patentes cotizarán con múltiplos más exigentes.",
      "de": "Spezialiserte Recycling-Anbieter vereinen hohe Technologiekompetenz mit exzellenten Wachstumschancen, wodurch sie langfristig Bergbauunternehmen übertreffen könnten.",
      "zh": "電池金屬與稀土循環回收 is 典型的高附加值技術拼圖。長遠來看，掌握專利化學精煉回收技術的先驅，其市場溢價和毛利率將顯著超越單純開採原礦的採礦巨頭。"
    },
    "source": "Resource Ledger",
    "timestamp": {
      "fr": "Il y a 1 semaine",
      "en": "1 week ago",
      "pt": "Há 1 semana",
      "es": "Hace 1 semaine",
      "de": "Vor 1 Woche",
      "zh": "1 週前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_36",
    "category": "learning",
    "title": {
      "fr": "Le Dollar-Cost Averaging (DCA) : l'arme fatale pour vaincre la volatilité",
      "en": "Dollar-Cost Averaging (DCA) explained: the ultimate long-term compounding habit",
      "pt": "A força do Dollar-Cost Averaging (DCA): como investir de forma constante e inteligente",
      "es": "Dollar-Cost Averaging (DCA): la estrategia infalible de inversión recurrente automatizada",
      "de": "Dollar-Cost Averaging (DCA): Die beruhigendste und beste Strategie für langfristige Anleger",
      "zh": "定期定額法 (DCA) 拆解：為何平庸的紀律往往能完爆天才的擇時交易"
    },
    "summary": {
      "fr": "Investir une somme fixe à intervalles réguliers vous évite d'essayer de deviner le point bas du marché, tout en maximisant l'intérêt composé.",
      "en": "Allocating a set amount of cash at fixed frequencies removes market timing anxiety while maximizing long-term compounding effects.",
      "pt": "Aportar quantias fixas de forma disciplinada ao longo de meses remove a ânsia de tentar adivinhar fundos de bolsa, otimizando o preço médio.",
      "es": "Asignar un presupuesto constante de ahorros en fechas fijas elimina la ansiedad de intentar comprar en mínimos mundiales, equilibrando el costo medio.",
      "de": "Das regelmäßige und zeitlich gestaffelte Investieren fester Geldbeträge mindert emotionale Einstiegsängste und glättet den Einstiegspreis über Zeit.",
      "zh": "透過不論價格起伏、固定週期投入固定本金的紀律，協助散戶在價格便宜時多買、溢價時自動少買，組建出無懈可擊的低持股平均成本。"
    },
    "fullContent": {
      "fr": "Le Dollar-Cost Averaging (DCA) neutralise le stress psychologique. En achetant mécaniquement des ETF ou des actions tous les mois, vous achetez plus de parts quand le marché baisse et moins de parts quand il s'enflamme. Sur le long terme, cette technique mathématique garantit un prix de revient moyen extrêmement compétitif, permettant aux intérêts composés d'agir à plein régime sur votre capital.",
      "en": "Dollar-Cost Averaging (DCA) acts as an emotional stabilizing shield. By investing a static amount in diversified index ETFs every month, you acquire more holdings when prices are low and fewer when they are high. Over long horizons, this mathematical discipline delivers a highly competitive average cost, empowering compounding interest to work full-force on your assets.",
      "pt": "O Dollar-Cost Averaging (DCA) neutraliza completamente as amarras psicológicas da flutuação. Ao comprar ações ou ETFs mensalmente de forma mecânica, você acumula mais frações de cotas na baixa e menos na alta. No longo prazo, esse hábito matemático assegura um custo de aquisição extremamente competitivo.",
      "es": "El Dollar-Cost Averaging (DCA) reduce el impacto emocional. Al comprar automáticamente acciones o fondos de forma mensual, adquieres más títulos cuando las cotizaciones bajan y menos cuando suben. Con el paso de los años, esta táctica asegura un costo unitario promedio óptimo.",
      "de": "Dollar-Cost Averaging (DCA) schaltet die Emotionen der Anleger systematisch aus. Durch automatische monatliche Zuzahlungen in ETFs sichern Sie sich bei fallenden Kursen mehr Anteile und bei steigenden Kursen weniger. Langfristig führt diese Methodik zu einem hervorragenden Einstiegspreis.",
      "zh": "DCA定期定額法能有效消除投資人的擇時心理負擔。透過不問價格高低、按月紀律扣款 ETF，投資人能在價格下挫時累積更多股數，並於高檔時自動減少認購。長遠來看，這項數學規律能平滑持股成本，讓無私的時間複利在你的資產積累中發揮最大價值。"
    },
    "expertTakeaway": {
      "fr": "Ne cherchez pas à battre le marché ou à deviner son timing. Le DCA est l'outil ultime des investisseurs intelligents pour bâtir un patrimoine sereinement.",
      "en": "Do not attempt to time the markets. Regular automated DCA is the ultimate weapon for retail investors to construct robust long-term wealth assets.",
      "pt": "Esqueça a busca frenética pela hora exata de comprar. O DCA é o pilar operacional dos investidores inteligentes para consolidar patrimônio.",
      "es": "Evita predecir el rumbo diario de los precios. El DCA recurrente y disciplinado es la herramienta maestra para constituir patrimonio con seguridad.",
      "de": "Versuchen Sie nicht, den Markt zu schlagen. Regelmäßiges DCA ist die unschlagbare Geheimwaffe für Privatanleger, um entspannt Vermögen aufzubauen.",
      "zh": "擇時交易對九成以上的散戶來說是資產毀滅的開端。唯有將 DCA 定期定額內化為紀律習慣，才能在毫無壓力下，享受到景氣牛市長線成長的豐碩果實。"
    },
    "source": "Wealth Education Bureau",
    "timestamp": {
      "fr": "Il y a 3 semaines",
      "en": "3 weeks ago",
      "pt": "Há 3 semanas",
      "es": "Hace 3 semanas",
      "de": "Vor 3 Wochen",
      "zh": "3 週前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_40",
    "category": "forex",
    "title": {
      "fr": "Le Dollar Australien (AUD) résiste, épaulé par la remontée des cours des métaux",
      "en": "Australian Dollar (AUD) displays resilience, supported by high mining and metal export values",
      "pt": "Dólar Australiano (AUD) ganha impulso com decolagem das commodities metálicas",
      "es": "El dólar australiano (AUD) brilla en Forex gracias a la fortaleza de sus materias primas",
      "de": "Australischer Dollar (AUD) profitiert von anhaltend hohen Exporten im Bergbausektor",
      "zh": "資源型外匯亮眼：澳大利亞元 (AUD) 匯率受大宗鐵礦石與工業金屬買盤拉動上挺"
    },
    "summary": {
      "fr": "En tant que monnaie de ressource par excellence, la devise de Sydney s'apprécie face à l'euro grâce aux exportations de fer et de charbon minier.",
      "en": "As a leading commodity-driven currency, Sydney's currency gains ground against peer soft currencies owing to strong iron and coal trade balances.",
      "pt": "Sendo uma divisa altamente sensível à exportação de recursos naturais, a moeda de Sydney se valorizou contra competidores devido à demanda de minério.",
      "es": "En su rol de divisa ligada a materias primas, el dólar de Sídney acumula avances notables contra divisas de consumo gracias a las compras de carbón y hierro.",
      "de": "Als führende Rohstoffwährung legt die Währung des rohstoffreichen Staates dank solider Exporte von Erzen und Kohle im internationalen Vergleich deutlich zu.",
      "zh": "作為最典型的「大宗商品貨幣（Commodity Currency）」，澳洲元匯率受惠於出口鐵礦砂、精煉銅及鋰精礦的旺盛海外結匯買盤，展現其獨樹一格的抗跌性。"
    },
    "fullContent": {
      "fr": "Sur le Forex, le dollar australien (AUD) démontre une forte corrélation positive avec l'indice des prix des métaux de base. Lorsque la transition écologique accélère l'activité industrielle lourde en Asie, l'Australie accumule des excédents commerciaux historiques. Ce flux permanent de capitaux acheteurs de devises nationales soutient activement l'AUD sur les pupitres Forex.",
      "en": "In currency markets, the Aussie dollar (AUD) displays a robust historical correlation with raw metal pricing. As ecological hardware transitions amplify heavy industrial manufacturing inside Asia, Australia posts record-setting trade balance surpluses, requiring international buyers to exchange fiat for AUD.",
      "pt": "No mercado Forex, o AUD opera de forma amarrada aos relatórios de mineração. Con o avanço das compras de minérios e carvão por indústrias asiáticas, a balança comercial da Austrália colheu superávits vultosos, gerando refluxo natural comprador para a moeda local.",
      "es": "En las mesas Forex, el AUD se comporta como la prolongación natural de los índices de la cantera de hierro. Si las fundiciones pesadas de Asia aceleran el ritmo de compra de mineral, la balanza de importación de Sídney registra flujos récord de acumulación.",
      "de": "Am Devisenmarkt zeigt der Aussie-Dollar eine historisch ausgeprägte positive Korrelation mit den Weltmarktpreisen für Primärrohstoffe. Da asiatische Partner in großem Umfang Metalle aus Australien importieren, verzeichnet das Land exzellente Leistungsbilanzüberschüsse.",
      "zh": "在外匯市場交易中，澳洲元（AUD）走勢與國際工業原材料、鐵礦砂價格指數呈現極高正相關性。每當新興地區擴建大型運輸與製造網，澳洲龐大的自然資源出口便能創下鉅額貿易順差，驅使跨國進口商在結匯時大量買入澳元，為其匯率提供強勁大宗商品護城河支持。"
    },
    "expertTakeaway": {
      "fr": "L'AUD est un thermomètre de l'économie réelle mondiale. Posséder des actifs en AUD est un excellent moyen de lier indirectement votre épargne Forex à la force des matières premières.",
      "en": "The Australian Dollar represents an infallible yardstick of global physical demand. Holding AUD exposures binds your assets to physical commodities strengths.",
      "pt": "A divisa australiana atua como termômetro das indústrias de base globais. Ter parte do capital alocado em AUD protege sua carteira da diluição fiduciária.",
      "es": "El cruce AUD es un fiel termómetro de los bienes tangibles. Colocar una porción de tu cuenta en activos de Sídney aporta cobertura real sin ingresar en contratos complejos de futuros.",
      "de": "Der Austral-Dollar ist ein hervorragender Indikator für den Welthandel. Anlagen im AUD-Raum binden das Devisendepot direkt an die Stärke des globalen Rohstoffzyklus.",
      "zh": "澳洲元在國際融資盤中是反映實體大宗商品景氣循環的最佳試金石。如果想讓自己的外匯部位與實體金屬、礦物牛市綁定，配置澳元資產（澳元定存或澳股）是一項極佳、低摩擦的外匯避風港策略。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 1 semaine",
      "en": "1 week ago",
      "pt": "Há 1 semana",
      "es": "Hace 1 semaine",
      "de": "Vor 1 Woche",
      "zh": "1 週前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_41",
    "category": "forex",
    "title": {
      "fr": "La Livre Sterling démontre une résilience surprise face à l'ajustement monétaire",
      "en": "British Pound (GBP) outperforms peers as bank rates remain restrictive of inflation",
      "pt": "Libra Esterlina (GBP) surpreende mercado com vigor diante de taxas prolongadas",
      "es": "La libra esterlina (GBP) se consolida en Forex apoyada en la prudencia de su banco central",
      "de": "Britisches Pfund (GBP) zeigt unerwartete Stärke durch straffe Geldpolitik",
      "zh": "英鎊 (GBP) 在外匯市場展現韌性：英國央行維持高抗通膨警戒指引"
    },
    "summary": {
      "fr": "La Banque d'Angleterre maintient une posture vigilante. Cet écart de taux positif soutient la rémunération et le cours du GBP par rapport aux autres devises d'Europe.",
      "en": "The Bank of England keeps a restrictive tight posture. Higher borrowing yields attract international money to London exchanges, lifting GBP rates.",
      "pt": "A autoridade monetária de Londres adota rigidez operacional prolongada contra a elevação de preços locais, atraindo capitais para depósitos na City.",
      "es": "El banco central de Inglaterra mantiene alto el costo de préstamo para drenar la inflación interna, atrayendo capitales especulativos en libras GBP.",
      "de": "Die Bank of England verfolgt einen strikten Inflationsbekämpfungskurs. Die dadurch im Vergleich höheren Anleiherenditen stützen das Pfund.",
      "zh": "英國央行採取偏向緊縮、嚴防工資與核心通膨黏性的貨幣指引，其引發之較高利差空間吸引全球套利資金進駐倫敦市場，推英鎊匯率至波段高位。"
    },
    "fullContent": {
      "fr": "La Livre Sterling (GBP) s'affiche comme l'une des devises les plus résilientes ce semestre. Face à une inflation sous-jacente domestique persistante, la Banque d'Angleterre a dû maintenir ses taux directeurs inchangés, ralentissant le rythme de la baisse du loyer de l'argent. Ce décalage temporel avec les autres banques occidentales crée une opportunité de rendement de dépôt séduisante.",
      "en": "The British Pound (GBP) has become one of the top-performing currencies this quarter. With persistent domestic service inflation, the Bank of England is maintaining interest benchmarks at peak levels. This policy discrepancy versus global peers creates excellent deposit return alternatives in London.",
      "pt": "A Libra Esterlina (GBP) confirmou seu caráter de destaque nas mesas de operações da Europa. Com a persistividade da elevação de custos no setor de serviços, a autoridade de Londres mantém os rendimentos locais atrativos por período superior, direcionando fluxos de capitais.",
      "es": "La libra británica firma un desempeño sobresaliente ante sus parejas de divisas ordinarias. Debido a la resistencia de la inflación de servicios, Londres se ve forzada a consolidar tipos rígidos, motivando un flujo continuo de capitales a su tesorería pública.",
      "de": "Das britische Pfund behauptet sich stabil am Devisenmarkt. Da sich die Inflation im Dienstleistungssektor auf der Insel hartnäckig zeigt, hält die Notenbank länger an repressiven Zinsen fest als ihre europäischen Partner, was Anlegergelder anlockt.",
      "zh": "英鎊（GBP）已成今季歐盟周邊最耀眼的儲備貨幣。受限於英國境內具黏性的服務業工資增長，英格蘭銀行（BoE）不得不維持高峰利率，放緩降息預期。此一利差優勢使得倫敦同業拆借與短期政府國庫券充滿套利吸引力，推動英鎊兌美元強悍防守。"
    },
    "expertTakeaway": {
      "fr": "La divergence monétaire gouverne le Forex. Lorsque le taux directeur d'une zone reste élevé plus longtemps, sa devise s'apprécie mécaniquement à court terme.",
      "en": "Monetary divergence is the ultimate rule of Forex. Whichever central bank preserves higher rates for longer secures native currency strength.",
      "pt": "Divergência de taxas decide a sorte no câmbio Forex. A nação que sustentar seus yields elevados capta capitais imediatos de mesas multilaterais.",
      "es": "La divergencia de políticas dirige las olas del Forex. La moneda del banco que sostiene un interés de préstamo más costoso se revaloriza en corto plazo.",
      "de": "Zinsdivergenz steuert den Devisenmarkt. Ein Land, dessen Zinssätze länger hoch verbleiben, gewinnt für Carry-Trader temporär an Attraktivität.",
      "zh": "「貨幣利差分歧（Monetary Divergence）」是外匯交易最核心的黃金聖經。哪個國家的基準利率在高位支撐得更久，該國貨幣往往在短期內最抗跌、最吸金。"
    },
    "source": "Forex Live Bulletin",
    "timestamp": {
      "fr": "Il y a 1 semaine",
      "en": "1 week ago",
      "pt": "Há 1 semana",
      "es": "Hace 1 semaine",
      "de": "Vor 1 Woche",
      "zh": "1 週前"
    },
    "sentiment": "positive"
  },
  {
    "id": "shk_3",
    "category": "crypto",
    "title": {
      "fr": "Crash éclair de la Tech & de la Crypto : Liquidation forcée en cascade de 12 milliards de $ de positions spéculatives",
      "en": "Crypto-Tech Flash Crash: Cascading margin calls trigger $12 billion leverage liquidation on exchanges",
      "pt": "Flash Crash de Ativos Tecnológicos: Liquidação em cascata atinge recorde de 12 bilhões $",
      "es": "Efecto Dominó en la Tecnología: Liquidación forzada barre 12,000 millones $ en horas",
      "de": "Flash-Crash bei Tech & Krypto: Kaskadierende Nachschusspflichten vernichten 12 Milliarden Dollar",
      "zh": "🚨 衍生商品嘎多狂殺：全球多頭保證金遭連環斷頭，十二小時狂暴清算百億美元槓桿部位！"
    },
    "summary": {
      "fr": "La remontée des taux d'intérêt a déclenché des ordres de vente automatiques chez les investisseurs très endettés, créant un phénomène d'aspiration des prix vers le bas.",
      "en": "The abrupt spike in interest rates triggered computerized automated selling models among high-debt hedge funds, generating severe downward spirals.",
      "pt": "A disparada drástica das taxas provocou o disparo sistêmico de ordens robóticas de venda forçada, varrendo a liquidez de mesa em mesa.",
      "es": "El alza de tipos de interés obligó a algoritmos automatizados a ejecutar liquidaciones por falta de balance, succionando la liquidez en su descenso.",
      "de": "Die steigenden Zinsen lösten automatisierte algorithmische Verkaufsorders aus, was Lawinenverkäufe an den Krypto- und Tech-Märkten nach sich zog.",
      "zh": "由於在先前的熱絡氛圍中累積了過大的融資融券，此番突發利空崩跌引爆了大批量化的程式化委託賣單，市場內呈現多殺多的流動性枯竭螺旋。"
    },
    "fullContent": {
      "fr": "L'effet de levier (investir avec de l'argent emprunté) se retourne violemment contre les traders. Alors que les cours fléchissaient suite à l'annonce de la Fed, les garanties exigées pour maintenir les positions de trading spéculatif sont devenues insuffisantes. Les courtiers ont vendu d'office les jetons et actions technologiques des comptes concernés sans avertissement, accélérant le dérapage.",
      "en": "Leverage (trading with borrowed credit) turns extremely dangerous. As prices dipped following the Federal Reserve's shock, assets held in brokerage balances failed to cover safety buffers. Exchanges liquidated tech equities and crypto contracts automatically over the computers, accelerating the waterfall slide.",
      "pt": "A alavancagem de capitais (operar com capital tomado de empréstimo) cobra seu preço severo. Com as quedas generalizadas, margens de garantia derreteram, forçando a liquidações.",
      "es": "El apalancamiento (operar con el dinero de otros) revela su riesgo letal. Con las caídas, las cuentas carecieron del margen indispensable. Los brokers liquidaron las carteras de forma fulminante.",
      "de": "Der Hebeleffekt (Handel auf Kredit) entfaltet seine zerstörerische Wirkung. Mit fallenden Kursen reichten Hinterlegungen nicht mehr aus, wodurch Broker Positionen automatisch schlossen.",
      "zh": "這揭示了「財務槓桿（Leverage）」的致命雙刃劍特性。當股價暴跌，高融資帳戶的維持率瞬間跌破斷頭警戒線，系統毫不留情地強制執行市價平倉拋售，進一步加劇了崩盤的深度。"
    },
    "expertTakeaway": {
      "fr": "L'effet de levier amplifie vos gains mais également vos pertes. Une perte de 10% sur le cours est multipliée par 5 avec un levier x5, anéantissant la moitié de votre investissement. C'est pourquoi un investisseur sérieux privilégie toujours l'achat sans endettement sur le long terme.",
      "en": "Leveraging amplifies gains but equally multiplies capital destruction. A standard 10% decline turns into a massive 50% wipeout when trading with a 5x multiplier. Serious investors avoid loans.",
      "pt": "A alavancagem amplifica as vitórias, mas multiplica as derrotas de igual forma. Uma queda de 10% do preço vira -50% se alavancado em 5x, destruindo metade do seu dinheiro em instantes.",
      "es": "El apalancamiento agiganta las ganancias pero multiplica tus pérdidas con igual violencia. Un retroceso ordinario del 10% se transforma en pérdida del 50% con un apalancamiento de 5x.",
      "de": "Der Hebel vervielfacht Gewinne, aber auch Verluste. Ein scheinbar milder Kurssturz um 10 % wird bei einem Hebel von 5x zu einem fatalen Verlust von 50 % des eingesetzten Kapitals.",
      "zh": "財務槓桿放大了獲利，但也等比放大了致命性虧損。原始標的下跌 10%，在 5 倍槓桿操作下即等同於 50% 的驚人虧損！此案例深入展示了被動分散配置的避險重要性。"
    },
    "source": "Leverage Tracker",
    "timestamp": {
      "fr": "Il y a 15 minutes",
      "en": "15 minutes ago",
      "pt": "Há 15 minutos",
      "es": "Hace 15 minutos",
      "de": "Vor 15 Minuten",
      "zh": "15 分鐘前"
    },
    "sentiment": "negative",
    "isShockNews": true
  },
  {
    "id": "std_44",
    "category": "macro",
    "title": {
      "fr": "La consommation des ménages soutient fermement l'activité mondiale",
      "en": "Household consumption firmly supports global economic activity",
      "pt": "Consumo das famílias apoia fortemente a atividade econômica global",
      "es": "El consumo de los hogares respalda firmemente la actividad mundial",
      "de": "Konsum der privaten Haushalte stützt die globale Wirtschaftsentwicklung",
      "zh": "家庭消費需求表現強勁，為全球經濟穩定增長提供強大支撐"
    },
    "summary": {
      "fr": "Malgré l'inflation, les dépenses de consommation restent vigoureuses, évitant ainsi une récession mondiale globale.",
      "en": "Despite historic inflationary pressure, solid consumer spendings prevent a global industrial slowdown.",
      "pt": "Apesar das pressões inflacionárias, os gastos robustos das famílias afastam riscos de recessão mundial.",
      "es": "Pese a la presión inflacionaria, el consumo sostenido aleja temores de una contracción global.",
      "de": "Trotz inflationärer Tendenzen stabilisiert der private Konsum die Weltwirtschaft und verhindert Krisen.",
      "zh": "儘管面臨高通膨壓力，強韌的民間消費支出依然抵消了部分負面衝擊，避免全球陷入衰退。"
    },
    "fullContent": {
      "fr": "Les derniers rapports sur les ventes au détail indiquent une progression globale de la demande des ménages. Ce dynamique de la consommation de services et de biens durables rassure les banquiers centraux quant à la résistance des infrastructures financières. Bien que l'épargne ait légèrement fondu, le niveau de l'emploi soutient les perspectives positives de croissance.",
      "en": "Latest retail sales indicators point to persistent household demand. This momentum in durable goods and essential services reassures policy makers regarding structural financial stability. While residual savings are trending down, tight labor markets continue to fuel optimistic expansion outlooks.",
      "pt": "Indicadores recentes mostram robustecimento no comércio e serviços. Esse dynamism do consumo sustenta a saúde financeira geral. Com emprego em alta, analistas projetam cenários expansivos para o PIB.",
      "es": "Sondeos recientes de ventas minoristas de bienes de capital e insumos exponen resiliencia. El avance del consumo despeja nubarrones macroeconómicos y asegura el optimismo de los inversores.",
      "de": "Die jüngsten Einzelhandelsberichte deuten auf eine anhaltende Nachfrage der Verbraucher hin. Diese Stabilität stützt die Gesamtwirtschaft und sorgt für anhaltend positive Signale für das Wirtschaftswachstum.",
      "zh": "最新零售銷售與消費者支出數據顯示，家庭需求保持活躍。消費端對耐久財與生活服務的強勁需求，向政策制定者傳遞了經濟體系健康的積極信號。儘管儲蓄略微回落，但就業市場的緊俏將繼續為經濟增長提供推力。"
    },
    "expertTakeaway": {
      "fr": "Le consommateur est le moteur ultime de la croissance. Tant que l'activité reste solide, les entreprises maintiennent leurs ventes et leurs valorisations boursières.",
      "en": "Consumers are the main engines of macro growth. Persistent retail activity preserves stable corporate earnings and shields stock indices during uncertainty.",
      "pt": "O consumo das famílias governa mais de metade do PIB global. A saúde do varejo blinda as cotações corporativas contra pressões externes.",
      "es": "El consumidor final lidera el avance del PIB. Mientras el empleo rinda, las empresas protegerán sus ingresos y la confianza de los mercados.",
      "de": "Konsum steuert das Bruttoinlandsprodukt. Solange Arbeitsplätze sicher sind, bleiben Unternehmensgewinne stabil und stützen Aktienkurse.",
      "zh": "消費者支出正是實體經濟最核心的永動機。只要家庭需求不發生大滑坡，企業營收就能維持穩定，進而為估值提供防護墊。"
    },
    "source": "Global Macro Advisor",
    "timestamp": {
      "fr": "Il y a 6 heures",
      "en": "6 hours ago",
      "pt": "Há 6 horas",
      "es": "Hace 6 horas",
      "de": "Vor 6 Stunden",
      "zh": "6 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_45",
    "category": "markets",
    "title": {
      "fr": "Le marché des obligations d'entreprises attire des capitaux record",
      "en": "Corporate bond markets attract record investment inflows",
      "pt": "Mercado de títulos corporativos atrai fluxos de capitais recordes",
      "es": "El mercado de bonos corporativos captura volúmenes récord de capitales",
      "de": "Anleihenmarkt verzeichnet rekordverdächtige Zuflüsse von Investoren",
      "zh": "公司債配發與殖利率誘人，全球固定收益市場吸引歷史性資金湧入"
    },
    "summary": {
      "fr": "La stabilisation des taux d'intérêt incite les investisseurs à bloquer des rendements élevés sur la dette des grandes entreprises.",
      "en": "Steady baseline interest rates encourage global funds to lock in high yields on investment-grade corporate debts.",
      "pt": "Taxas estáveis motivam gestores de fundos a garantir cupons elevados de emissões de grandes corporações de alta qualidade.",
      "es": "Tipos de referencia estables impulsan a inversores a congelar tasas elevadas en renta fija corporativa de alta calidad.",
      "de": "Stabile Zinsen bewegen Großinvestoren dazu, sich attraktive Kupons erstklassiger Industrieunternehmen langfristig zu sichern.",
      "zh": "由於在基準利率保持穩定的背景下，投資等級公司債回報誘人，全球避險資金正大舉鎖定優質公司債券殖利率。"
    },
    "fullContent": {
      "fr": "Avec des taux d'intérêt de référence stabilisés, les obligations d'entreprises de premier plan offrent d'excellentes opportunités. Les investisseurs à long terme accumulent des titres de dette à taux fixe pour maximiser le versement d'intérêts réguliers avant le début anticipé d'un cycle de baisse des taux. Cette ruée renforce la structure financière des entreprises émettrices.",
      "en": "Following the central bank rate freeze, prime corporate debt instruments deliver remarkable yield generation. Long-term institutions accumulate high-coupon sovereign and corporate bonds to guarantee income stream before a future rate-cutting phase. This trend solidifies financing capabilities for blue-chip companies.",
      "pt": "A estabilização monetária impulsionou títulos de crédito privado de grau de investimento. Institucionais correm para travar retornos de dois dígitos antes de eventuais quedas de juros, otimizando o fluxo de caixa.",
      "es": "La meseta de tipos impulsó primas en deuda privada de grado de inversión. Los fondos bloquean rendimientos nominales excepcionales antes de flexibilizaciones alcistas, mitigando riesgos de crédito.",
      "de": "Die Stabilisierung der Notenbankpolitik stärkt den Markt für Unternehmensanleihen bester Bonität. Investoren nutzen die Gelegenheit, um sich hohe Kupons für die Zukunft zu sichern, was die Unternehmensfinanzierung erleichtert.",
      "zh": "基準利率停留在高原期，使頂級企業發行的投資等級債券深具吸引力。長期配置型機構爭相在未來降息循環開啟前，大舉鎖定高信用等債券，進一步優化了發債企業的財務結構。"
    },
    "expertTakeaway": {
      "fr": "Les obligations offrent une alternative moins risquée aux actions. Bloquer des taux élevés permet de générer un flux de trésorerie prévisible.",
      "en": "Bonds provide secure, low-volatility income streams. Securing elevated coupon rates generates predictable cash flow for portfolios.",
      "pt": "Crédito corporativo garante distribuições periódicas líquidas superiores à renda fixa tradicional, agregando solidez defensiva à carteira.",
      "es": "La renta fija mitiga riesgos y suaviza la curva del capital global. Fijar beneficios estables equilibra el portafolio frente a acciones volátiles.",
      "de": "Anleihen reduzieren das Portfoliorisiko und liefern planbare Erträge. Eine ideale Ergänzung zu dividendenstarken Sachwerten.",
      "zh": "債券資產是平衡股市高波動的必備沙包。在降息周期前鎖定高票息，能為資產組合注入高度可預測的穩定現金流。"
    },
    "source": "Bond Weekly",
    "timestamp": {
      "fr": "Il y a 12 heures",
      "en": "12 hours ago",
      "pt": "Há 12 horas",
      "es": "Hace 12 horas",
      "de": "Vor 12 Stunden",
      "zh": "12 小時前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_48",
    "category": "crypto",
    "title": {
      "fr": "Réseaux de seconde couche (Layer-2) : la solution technique pour démocratiser la blockchain",
      "en": "Scaling Networks (Layer-2): the ultimate technical solution to lower transaction fees",
      "pt": "Canais de Segunda Camada (Layer-2): a solução tecnológica definitiva para zerar taxas",
      "es": "Redes de Segunda Capa (Layer-2): el despegue técnico para masificar el uso de dApps",
      "de": "Layer-2-Netzwerke: Der technologische Durchbruch zu pfeilschnellen und günstigen Transaktionen",
      "zh": "鏈上基礎設施擴容戰：第二層網路（Layer-2 Rollups）爆發，交易手續費銳減 99%"
    },
    "summary": {
      "fr": "Les architectures secondaires regroupent des milliers de transactions hors du réseau principal, abaissant les frais de gaz de près de 99%.",
      "en": "Secondary network rollups bundle thousands of operations off main chains, lowering gas and execution costs by 99%.",
      "pt": "Protocolos auxiliares agrupam milhares de assinaturas de dados fora da cadeia principal, poupando até 99% das taxas operacionais.",
      "es": "Plataformas paralelas procesan miles de operaciones fuera de la cadena base, logrando rebajar comisiones récord por encima del 99%.",
      "de": "Skalierungslösungen bündeln Transaktionen außerhalb der Haupt-Blockchain und senken die Netzwerkgebühren um fast 99 Prozent.",
      "zh": "全新 Layer-2 擴容架構能將數千筆交易 en 鏈下進行打包壓縮，隨後再安全提交至以太坊主網，使鏈上手續費下降達 99%。"
    },
    "fullContent": {
      "fr": "La congestion chronique des réseaux de première couche comme Ethereum a longtemps pénalisé l'expérience utilisateur. Les nouvelles solutions de scalabilité (Optimistic et Zero-Knowledge Rollups) déplacent le calcul intensif hors de la chaîne principale tout en conservant sa sécurité cryptographique. L'activité migre massivement vers ces autoroutes technologiques à bas coût.",
      "en": "Sustained congestion across Layer-1 primary ledgers has periodically hurt usability. Emerging rollups technology (Optimistic and Zero-Knowledge variants) handles complex execution calculations separate from main validators but inherits the underlying chain safety. Capital pools are rotating toward these low-fee high-throughput networks.",
      "pt": "Férias e picos de tráfego na rede principal do Ethereum historicamente repeliram usuários comuns. Os rollups de escalabilidade processam milhares de transferências em paralelo sob garantias matemáticas idênticas, reduzindo filas.",
      "es": "El colapso de canales en Ethereum alejó a pequeños ahorristas. Los desarrollos modernos de rollup empaquetan transacciones independientes, garantizando descentralización a un centavo de dólar por operación.",
      "de": "Die chronische Überlastung etablierter Blockchains bremste die Akzeptanz von Krypto-Anwendungen aus. Moderne Zero-Knowledge- und Optimistic-Rollups verlagern Transaktionen kostengünstig auf verlässliche Nebengleise, ohne das Sicherheitsniveau der Haupt-Blockchain aufzugeben.",
      "zh": "以太坊 Layer-1 主網的常態性壅塞與動輒數十美元的 Gas 費用，阻礙著去中心化應用的普及。Rollup 擴容方案（包括 ZK 零知識與 Optimistic 樂觀卷積技術）成功將繁雜的智能合約運算移至主鏈外執行，僅將結果存回主鏈。手續費的崩跌正重塑整個代幣金融生態。"
    },
    "expertTakeaway": {
      "fr": "La scalabilité résout le trilemme de la blockchain. Ces réseaux secondaires sont indispensables pour permettre des millions de transactions quotidiennes.",
      "en": "Scalability solves the classic blockchain trilemma. These secondary rollups are necessary infrastructure to host mass micro-payment volumes.",
      "pt": "A escalabilidade resolve os limites do trilema clássico. Redes secundárias viabilizam a utilidade prática para microatividades financeiras rápidas.",
      "es": "Reducir la fricción monetaria derriba barreras de adopción técnica. Les redes auxiliares serán la base de millones de microtransacciones habituales.",
      "de": "Skalierbarkeit löst das klassische Blockchain-Trilemma. Diese sekundären Netzwerke bilden das Rückgrat für die weltweite Nutzung digitaler Vermögenswerte.",
      "zh": "擴容技術解決了區塊鏈「去中心化、安全、擴容」看似不可調和的三難困境（Trilemma）。這類高速、廉價的第二層網路是百萬級用戶鏈上活動的重要基石。"
    },
    "source": "Web3 Engineering",
    "timestamp": {
      "fr": "Il y a 4 jours",
      "en": "4 days ago",
      "pt": "Há 4 jours",
      "es": "Hace 4 jours",
      "de": "Vor 4 Tagen",
      "zh": "4 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_49",
    "category": "learning",
    "title": {
      "fr": "Comprendre le Ratio Price-to-Book (P/B) : évaluer la valeur réelle des actifs d'une entreprise",
      "en": "Unlocking the Price-to-Book (P/B) Ratio: how to value a company's tangible assets correctly",
      "pt": "Desmistificando o Múltiplo P/VP (Preço sobre Valor Patrimonial): saiba como calcular",
      "es": "El Ratio Precio-Valor Libros (P/B) descifrado: aprende a valorar activos reales",
      "de": "Das Kurs-Buchwert-Verhältnis (KBV) erklärt: So berechnen Sie die innere Substanz eines Unternehmens",
      "zh": "一分鐘學會股價淨值比（P/B Ratio）：教你如何避開昂貴泡沫，尋找被低估的「價值股」"
    },
    "summary": {
      "fr": "Découvrez comment ce ratio compare la valeur boursière d'une société à sa valeur comptable pour dénicher des entreprises sous-évaluées.",
      "en": "Learn how the P/B ratio aligns market capitalization against balance sheet book equity to discover undervalued value opportunities.",
      "pt": "Entenda como a relação P/VP ajuda a avaliar o valor de liquidação líquido de companhias em busca de barganhas na bolsa.",
      "es": "Descubre cómo esta relación asocia el valor de cotización de une empresa con sus actifs contables netos para detectar ofertas de inversión.",
      "de": "Lernen Sie, wie das KBV den Börsenwert eines Unternehmens ins Verhältnis zu den Nettoaktiva setzt, um unterbewertete Substanzwerte aufzuspüren.",
      "zh": "了解股價淨值（P/B）如何透過比較公司的市值與報表上的淨資產價值，協助投資人避開沒有資產支撐的投機炒作。"
    },
    "fullContent": {
      "fr": "Le ratio Cours/Valeur comptable compare la capitalisation boursière à la valeur de l'ensemble des actifs tangibles d'une entreprise, une fois ses douzaines de dettes soustraites. Un ratio inférieur à 1 indique théoriquement qu'une action se négocie sous sa valeur de liquidation. C'est l'indicateur favori des investisseurs 'Value' à la recherche de marges de sécurité confortables, particulièrement utile pour analyser les secteurs bancaire et industriel.",
      "en": "The Price-to-Book ratio matches corporate market valuation relative to its tangible book assets minus liabilities. A P/B factor below 1.0 implies that shares trade cheaper than their theoretical liquidation value. This is a primary compass for classic 'Value' investors seeking margin of safety buffers, especially inside banking networks and heavy asset industries.",
      "pt": "O indicador Preço sobre Valor Patrimonial (P/VP) compara o valor de mercado ao patrimônio líquido contábil. Um fator menor que 1,0 aponta que a empresa é vendida por menos do que seus bens físicos somados. É o queridinho da análise fundamentalista de dividendos.",
      "es": "La métrica compara la capitalización con el balance del patrimonio contable líquido tangible. Un número menor que 1.0 expresa que la acción cotiza por debajo de su patrimonio real de fábrica y oficinas. Representa el indicador insignia de los buscadores de gangas boursátiles.",
      "de": "Das Kurs-Buchwert-Verhältnis (KBV) vergleicht den aktuellen Marktwert einer Aktie mit dem Buchwert der Nettoaktiva je Aktie. Liegt der Wert unter 1,0, notiert die Aktie unter ihrem rechnerischen Liquidationswert. Substanzinvestoren nutzen diese Kennzahl, um verlässliche Schnäppchen am Markt zu finden.",
      "zh": "股價淨值比（P/B Ratio）是用公司的總市值除以股東權益（即總資產扣除總負債後的淨值）。理論上，當 P/B 低於 1.0 時，代表這檔股票的交易價格比其公司清算時의真實資產價值還要便宜。這是經典「價值投資人」尋找安全邊際的必備量規，在分析銀行和鋼琴等重資產製造業時特別精確可靠。"
    },
    "expertTakeaway": {
      "fr": "Le ratio P/B est un bouclier pour l'investisseur fondamental. Acheter sous la valeur comptable offre une excellente marge de sécurité sur le long terme.",
      "en": "P/B delivers structural safety for fundamental investors. Buying stocks below book equity establishes strong defensive margins when markets decline.",
      "pt": "Investir focado no P/VP protege seu dinheiro de bolhas infladas sem fundamentação produtiva. Uma barreira matemática contra excessos de euforia.",
      "es": "La relación P/B entrega solidez invaluable al inversor de largo plazo. Comprar cerca o debajo de libros blinda tu capital contra quiebras repentinas.",
      "de": "Das KBV ist ein bewährtes Werkzeug zur Sicherheitsanalyse. Es schützt Anleger davor, übermäßig hohe Preise für reine Wachstumshoffnungen zu bezahlen.",
      "zh": "股價淨值比是穩健配置者的重要護城河。以低於淨值的價格買入實體資產，能在市場大跌時為長期投資建立極佳的防禦底座。"
    },
    "source": "Value Academy",
    "timestamp": {
      "fr": "Il y a 6 jours",
      "en": "6 days ago",
      "pt": "Há 6 dias",
      "es": "Hace 6 días",
      "de": "Vor 6 Tagen",
      "zh": "6 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_46",
    "category": "markets",
    "title": {
      "fr": "L'intelligence artificielle transforme l'analyse financière quantitative",
      "en": "Artificial intelligence transforms quantitative modern market analysis",
      "pt": "Inteligência artificial transforma a análise quantitativa de mercados",
      "es": "La inteligencia artificial revoluciona el análisis cuantitativo de mercados",
      "de": "Künstliche Intelligenz revolutioniert die quantitative Finanzanalyse",
      "zh": "人工智慧和大數據建模加速導入，量化高頻交易與市場預測迎來革命"
    },
    "summary": {
      "fr": "Les modèles de machine learning prédisent avec précision les tendances à court terme, automatisant les décisions d'investissement complexes.",
      "en": "Advanced machine learning protocols predict short-term fluctuations, automating complex investment models.",
      "pt": "Modelos avançados de machine learning antecipam tendências estocásticas de liquidez, automatizando execuções complexas.",
      "es": "Modelos de machine learning predicen anomalías de corto plazo y automatizan ejecuciones en mercados líquidos.",
      "de": "Moderne Algorithmen erkennen Handelsmuster in Millisekunden und optimieren automatisierte Anlageentscheidungen.",
      "zh": "新一代機器學習量化模型能精確捕捉毫秒級的價格異常，為複雜的資產配置提供高效自主的交易決策。"
    },
    "fullContent": {
      "fr": "L'usage des algorithmes basés sur l'intelligence artificielle se généralise chez les gestionnaires d'actifs. Ces systèmes traitent des téraoctets de données financières pour repérer des opportunités négligées par l'analyse humaine traditionnelle. Bien que les critiques pointent un risque de corrélation automatique des transactions, l'innovation favorise une liquidité accrue et des spreads d'achat-vente extrêmement réduits.",
      "en": "Algorithmic pipelines driven by machine learning are scaling fast among top money managers. These systems digest terabytes of structured order book and sentiment data to locate mispricings. Although skeptics voice concerns around unified behavior risks, AI-driven flows enhance overall market liquidity and shrink trading spreads.",
      "pt": "Algoritmos quantitativos de aprendizado de máquina resolveram a tomada de decisão no buy-side. Esses cérebros digitais processam terabytes de dados históricos buscando ineficiências em milissegundos, gerando maior liquidez.",
      "es": "Los sistemas automatizados de inteligencia de mercados dominan las mesas institucionales. Analizan terabytes de balances y noticias para hallar arbitrajes, disminuyendo diferenciales de oferta y demanda.",
      "de": "Der Einsatz von künstlicher Intelligenz gehört bei professionellen Vermögensverwaltern längst zum Standard. Riesige Datenmengen werden in Echtzeit ausgewertet, um Marktanomalien gewinnbringend zu nutzen und Spreads zu minimieren.",
      "zh": "由機器學習與分析引擎驅動的自動化系統正迅速重塑資產管理格局。這些數位模型能在數毫秒內吞吐數 TB 的即時新聞與訂單簿數據，尋求套利空間。這雖然引發了同質化交易的擔憂，但確實大幅提升了市場流動性並縮小了買賣點差。"
    },
    "expertTakeaway": {
      "fr": "La technologie accélère le marché. Comprendre la dynamique des algorithmes aide les investisseurs réguliers à éviter d'acheter sur des excès de court terme.",
      "en": "Technology drives volatility but also efficiency. Realizing how automated algorithms trade helps retail investors avoid chasing short-term extremes.",
      "pt": "A tecnologia acelera a velocidade das ordens de mercado. Compreender os fluxos algorítmicos protege o investidor físico de armadilhas de liquidez.",
      "es": "La automatización acelera el mercado de valores. Conocer el comportamiento algorítmico previene a inversores minoristas comprar en máximos históricos.",
      "de": "Algorithmen gestalten Preise hocheffizient. Langfristige Investoren sollten sich nicht von kurzfristigem, algorithmengetriebenem Rauschen irritieren lassen.",
      "zh": "科技雖然加劇了瞬時波動，但也使訂單定價更有效率。了解量化模型的交易慣性，有助於一般的散戶投資人避免在極端高位踩雷追漲。"
    },
    "source": "Alpha Analytics",
    "timestamp": {
      "fr": "Il y a 1 jour",
      "en": "1 day ago",
      "pt": "Há 1 dia",
      "es": "Hace 1 día",
      "de": "Vor 1 Tag",
      "zh": "1 天前"
    },
    "sentiment": "neutral"
  },
  {
    "id": "std_47",
    "category": "crypto",
    "title": {
      "fr": "Sécurisation des crypto-actifs : l'essor indispensable des portefeuilles physiques (cold storage)",
      "en": "Securing Digital Assets: the rapid expansion of hardware-based cold wallets",
      "pt": "Segurança de Criptoativos: investidores correm para soluções físicas de custódia privada",
      "es": "Resguardo Cripto: inversores mueven fondos hacia carteras frías en busca de inmunidad",
      "de": "Hardware-Wallets im Aufwind: Privater Vermögensschutz wird im Krypto-Bereich essenziell",
      "zh": "資產主權不容妥協：全球主流投資人大量將加密資產轉入「硬體冷錢包」自主託管"
    },
    "summary": {
      "fr": "Face aux risques de piratage des plateformes en ligne, la conservation hors-ligne via des clés physiques devient le standard.",
      "en": "In response to online custody hack risks, offline backup using dedicated hardware keys cements itself as the baseline standard.",
      "pt": "Frente a hacks severos de corretoras online, armazenar chaves fora da internet (cold storage) vira o padrão indispensável.",
      "es": "Ante la seguidilla de ataques a plataformas de intercambio en línea, la custodia fuera de internet vía dispositivos físicos se vuelve norma.",
      "de": "Als Reaktion auf Hackerangriffe auf Online-Börsen etabliert sich die Offline-Speicherung auf Hardware-Wallets als Sicherheitsstandard.",
      "zh": "面對線上交易所或熱錢包接連發生的資安駭客風險，將私鑰離線保存在專用硬體冷錢包中，已成為業界公認的黃金安全準則。"
    },
    "fullContent": {
      "fr": "La conservation autonome est au cœur de la philosophie de la blockchain. Les failles répétées d'intermédiaires non réglementés ont convaincu les investisseurs institutionnels et particuliers de posséder physiquement leurs clés privées. Les portefeuilles matériels (hardware wallets) coupés de tout réseau d'ordinateurs garantissent une protection inégalée contre les logiciels malveillants.",
      "en": "Self-custody is the foundational pillar of distributed ledger networks. Cyber vulnerabilities among unregulated exchanges have convinced global asset holders to secure their private keys directly. Dedicated hardware security modules, completely isolated from internet access, provide mathematically proven defense setups.",
      "pt": "A autocustódia soberana traduz o lema puro da tecnologia blockchain. Vulnerabilidades em custodiantes vulneráveis ensinaram investidores a deter suas chaves. Dispositivos USB de padrão militar isolam assinaturas criptográficas de qualquer malware.",
      "es": "La autogestión es la tesis base de la criptografía aplicada. Hackeos a intermediarios obligaron a usuarios a responsabilizarse de sus palabras de recuperación. Unidades flash aisladas imposibilitan vaciados automáticos de saldo.",
      "de": "Selbstverwaltung ist das Leitprinzip dezentraler Netzwerke. Sicherheitslücken bei unregulierten Börsen haben gezeigt, wie wichtig der eigene Besitz der privaten Schlüssel ist. Physisch isolierte Sicherheitsbausteine bieten maximalen Schutz vor Online-Angriffen.",
      "zh": "自主託管（Self-Custody）是分散式帳本網路不變的核心精神。鑑於中心化交易所頻傳的安全漏洞，大批用戶選擇把私鑰導出。專用的硬體冷錢包在簽署交易時與網路完全隔離，能徹底杜絕木馬程式與遠端竊取風險。"
    },
    "expertTakeaway": {
      "fr": "Pas vos clés, pas vos cryptos. La sécurité absolue passe par la conservation directe de vos phrases de récupération hors de portée du réseau internet.",
      "en": "Not your keys, not your crypto. Safe long-term storage requires offline protection of seed words, far away from any cloud connection.",
      "pt": "Sem as chaves, as criptos não são suas cotidianamente. Manter palavras semente offline blinda seu saldo tecnológico de forma infalível.",
      "es": "Si no posees las llaves, no posees las criptomonedas. La inmunidad se construye escribiendo tus palabras clave en papel, fuera de la nube.",
      "de": "Nicht Ihre Schlüssel, nicht Ihre Kryptos. Wer langfristig investiert, sichert seine Wiederherstellungswörter ausschließlich offline auf Metall oder Papier.",
      "zh": "「非子其鑰，非群其幣（Not your keys, not your coins）」是區塊鏈世界唯一的生存法則。請務必將私鑰助記詞離線手抄保存，絕對不要上傳雲端。"
    },
    "source": "Sovereign Ledger",
    "timestamp": {
      "fr": "Il y a 2 jours",
      "en": "2 days ago",
      "pt": "Há 2 dias",
      "es": "Hace 2 días",
      "de": "Vor 2 Tagen",
      "zh": "2 天前"
    },
    "sentiment": "positive"
  },
  {
    "id": "std_50",
    "category": "commodities",
    "title": {
      "fr": "Le marché de l'argent physique soutenu par la transition industrielle",
      "en": "Silver Markets rally as industrial solar transitions spark supply shortages",
      "pt": "Prata física em alta: demanda para semicondutores e painéis solares aperta a oferta",
      "es": "La plata escala posiciones debido al auge de celdas solares e insumos industriales",
      "de": "Silberpreis steigt aufgrund extrem hoher industrieller Nachfrage nach Solarmodulen",
      "zh": "白銀兼具貨幣與工業雙屬性，隨綠能太陽能與半導體導電需求升溫而量價齊揚"
    },
    "summary": {
      "fr": "La consommation industrielle d'argent pour les technologies vertes surpasse la production minière, créant des tensions sur les stocks mondiaux.",
      "en": "Industrial solar panel and semiconductor assembly outpaces mining inventory growth, squeezing physical silver vaults.",
      "pt": "O consumo industrial de metal precioso para energias verdes supera as extrações correntes de mineração, gerando tensões globais.",
      "es": "El procesamiento tecnológico de plata de uso industrial supera el ritmo de cantera, estresando los almacenes de metales mundiales.",
      "de": "Die industrielle Nachfrage nach Silber zur Fertigung von Solarzellen übersteigt die Minenproduktion und führt zu Engpässen.",
      "zh": "綠色光電板與車載電子的導電漿料白銀需求，大副超越全球銀礦開採產出增速，正造成庫存持續緊縮。"
    },
    "fullContent": {
      "fr": "L'argent n'est pas seulement un précieux refuge de fortune, c'est un ingrédient industriel central dans l'électrification mondiale. La fabrication de millions de cellules de panneaux solaires photovoltaïques exige d'immenses tonnages de poudre d'argent hautement purifiée. Alors que la production des mines d'extraction montre des signes d'essoufflement, les réserves physiques s'amenuisent, stimulant les cours de l'once sur le marché spot.",
      "en": "Silver is the ultimate hybrid precious asset, widely utilized across heavy electrical setups. Modern high-efficiency photovoltaic array construction consumes tons of ultra-pure raw silver powder yearly. As central mining supply lines plateau, stockpiles available in major institutional vaults are dropping rapidly, creating robust tailwinds for spot oz valuations.",
      "pt": "A prata atua como um refúgio duplo, unindo o valor clássico de proteção com a essencialidade de componentes de alta condução elétrica. A revolução sustentável de chips acelerou a drenagem das reservas de balcão.",
      "es": "El metal plateado ostenta un valor doble en la economía moderna. Ante la escasez de extracción, la cotización de la onza de plata física spot acelera su tendencia alcista en búsqueda de nuevos máximos.",
      "de": "Silber profitiert von einer einzigartigen Doppelrolle als wertbeständige Anlage und unverzichtbarer Industrierohstoff. Die Herstellung von Photovoltaikanlagen verbraucht enorme Mengen Feinsilber. Da die weltweite Minenförderung stagniert, schrumpfen die Lagerbestände und stützen den Silberpreis im Spot-Handel.",
      "zh": "白銀兼具避險防禦與工業關鍵原料的雙重基因，是電子工業中導電性首屈一指的重物。光電板的大規模鋪設每年消耗數千噸超高純度白銀，而傳統主要銀礦開採因投資不足增速放緩，庫存快速減少，正引發白銀現貨（Spot Oz）的強勁補漲趨勢。"
    },
    "expertTakeaway": {
      "fr": "L'argent offre une exposition directe à l'économie réelle et à la transition écologique, se comportant souvent comme un amplificateur des mouvements de l'or.",
      "en": "Silver yields exposure to real industrial demand. When gold moves up, silver historically behaves like a leveraged high-beta play on the precious metals sector.",
      "pt": "A prata oferece o motor de uso real que o ouro não possui nas fábricas. É uma opção dinâmica para períodos de revolução sustentável global.",
      "es": "Este metal proporciona excelente exposición al repunte verde. Tiende a operar con mayor volatilidad y potencial de revalorización acelerada que el oro.",
      "de": "Silber ist der 'kleine Bruder des Goldes', verhält sich aber durch die industrielle Koppelung oft dynamischer und volatiler in Aufwärtsphasen.",
      "zh": "白銀既享有黃金的貨幣對抗通膨屬性，又具備強固的工業增長基本面支撐。傳統上當黃金發動漲勢時，白銀因具備高波動度（High-Beta）往往表現得更為耀眼。"
    },
    "source": "Precious Metals News",
    "timestamp": {
      "fr": "Il y a 6 jours",
      "en": "6 days ago",
      "pt": "Há 6 jours",
      "es": "Hace 6 jours",
      "de": "Vor 6 Tagen",
      "zh": "6 天前"
    },
    "sentiment": "positive"
  }

  ], []);

  // Filter based on search query and category tab selector
  const filteredArticles = useMemo(() => {
    let list = [...newsDatabase];
    
    // Sort so shock news appear first if shock is active, or omit them if shock is inactive
    if (activeShock) {
      list = list.sort((a, b) => {
        if (a.isShockNews && !b.isShockNews) return -1;
        if (!a.isShockNews && b.isShockNews) return 1;
        return 0;
      });
    } else {
      list = list.filter(art => !art.isShockNews);
    }

    // Limit each category to exactly 7 news items to respect user intent of "7 nouvelles pour chaque catégorie"
    const categoriesList = ["macro", "markets", "crypto", "learning", "commodities", "forex"];
    const limitedList: typeof newsDatabase = [];
    categoriesList.forEach((cat) => {
      const catElements = list.filter(art => art.category === cat).slice(0, 7);
      limitedList.push(...catElements);
    });
    const limitedIds = new Set(limitedList.map(art => art.id));
    list = list.filter(art => limitedIds.has(art.id));

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter(art => art.category === selectedCategory);
    }

    // Search query query filter
    if (searchQuery !== "_default_all_news_" && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(art => {
        const titleText = (art.title[lang] || art.title["en"] || "").toLowerCase();
        const summaryText = (art.summary[lang] || art.summary["en"] || "").toLowerCase();
        const sourceText = art.source.toLowerCase();
        return titleText.includes(q) || summaryText.includes(q) || sourceText.includes(q);
      });
    }

    return list;
  }, [newsDatabase, selectedCategory, searchQuery, activeShock, lang]);

  // Handle preset simulated shock buttons
  const toggleMarketShock = () => {
    setActiveShock(prev => !prev);
    setSelectedArticle(null); // Reset detail preview on shock toggle
  };

  // Determine market sentiment rating pill
  const sentimentStats = useMemo(() => {
    // Base score is set based on whether we are in a massive market shock state or normal state
    let baseScore = activeShock ? 18 : 78;
    
    // Adjust base based on real sentiment composition of currently displayed articles
    if (filteredArticles.length > 0) {
      let positiveCount = 0;
      let negativeCount = 0;
      
      filteredArticles.forEach(art => {
        if (art.sentiment === "positive") positiveCount++;
        else if (art.sentiment === "negative") negativeCount++;
      });
      
      const total = filteredArticles.length;
      const netSentiment = (positiveCount - negativeCount) / total;
      
      // Shift up to +/- 12% depending on the ratio of bullish vs bearish news in this category
      baseScore += Math.round(netSentiment * 12);
    }
    
    // Introduce high-precision micro-fluctuation based on search parameters to mimic tick-by-tick noise
    const seedText = (searchQuery === "_default_all_news_" ? "" : searchQuery) + selectedCategory;
    let seedVal = 0;
    for (let i = 0; i < seedText.length; i++) {
      seedVal += seedText.charCodeAt(i) * (i + 1);
    }
    const pseudoNoise = Math.sin(seedVal || 42) * 4;
    
    let finalPercentage = Math.round(baseScore + pseudoNoise);
    // Boundary clamps between 3% and 97%
    finalPercentage = Math.max(3, Math.min(97, finalPercentage));
    
    // Determine overall market tone category
    let sentimentType: "positive" | "negative" | "neutral" = "neutral";
    if (finalPercentage >= 60) {
      sentimentType = "positive";
    } else if (finalPercentage <= 35) {
      sentimentType = "negative";
    }
    
    const label = sentimentType === "positive" 
      ? t("newsSentimentBullish") 
      : sentimentType === "negative"
        ? t("newsSentimentBearish")
        : (lang === "fr" ? "Neutre" : "Neutral");
        
    const color = sentimentType === "positive" 
      ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50" 
      : sentimentType === "negative"
        ? "text-red-500 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50"
        : "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50";

    return {
      type: sentimentType,
      label,
      color,
      percentage: finalPercentage
    };
  }, [activeShock, filteredArticles, searchQuery, selectedCategory, lang, t]);

  return (
    <div id="finance-news-tab" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Shock Alert Flash Bar Banner */}
      {activeShock && (
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-3xl p-5 shadow-lg border border-red-500/30 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-black text-sm tracking-wider uppercase flex items-center gap-2 justify-center md:justify-start">
              <AlertTriangle className="w-5 h-5 text-yellow-300 animate-bounce" />
              {t("newsShockTitle")}
            </h4>
            <p className="text-xs text-red-100 max-w-3xl leading-relaxed">
              {t("newsShockDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleMarketShock}
            className="px-4 py-2 border border-white/30 bg-white/10 hover:bg-white/25 rounded-xl text-xs font-extrabold tracking-tight transition cursor-pointer shrink-0"
          >
            {t("newsShockNormal")}
          </button>
        </div>
      )}

      {/* Grid Layout containing Main Column and Right Column Side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main interactive news listing */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Header Controls (Tabs & Search Bar) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-850 dark:text-slate-200 text-base tracking-tight">{t("tabNews")}</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none">{t("newsTitle")} Global Real-time feed</p>
                </div>
              </div>

              {/* Dynamic Live Status Tag */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/80">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeShock ? "bg-red-500" : "bg-emerald-500"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${activeShock ? "bg-red-500" : "bg-emerald-500"}`}></span>
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  {activeShock ? "MARKET DISTURBANCE ACTIVE" : "STABLE PEDAGOGICAL RATE"}
                </span>
              </div>
            </div>

            {/* Selector Categories Tab List */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: "all", label: t("newsCategoryAll") },
                  { code: "macro", label: t("newsCategoryMacro") },
                  { code: "markets", label: t("newsCategoryMarkets") },
                  { code: "crypto", label: t("newsCategoryCryptoTech") },
                  { code: "learning", label: t("newsCategoryLearning") },
                  { code: "commodities", label: t("newsCategoryCommodities") },
                  { code: "forex", label: t("newsCategoryForex") }
                ].map((cat) => (
                  <button
                    key={cat.code}
                    type="button"
                    onClick={() => setSelectedCategory(cat.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-100 cursor-pointer ${
                      selectedCategory === cat.code
                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Input text search box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("newsSearchPlaceholder")}
                  value={displaySearchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val === "" ? "_default_all_news_" : val);
                  }}
                  className="w-full sm:w-56 pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* List display matching matches */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <Newspaper className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold">Aucune actualité ne correspond à vos filtres de recherche.</p>
                <button 
                  type="button" 
                  onClick={() => { setSelectedCategory("all"); setSearchQuery("_default_all_news_"); }}
                  className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => {
                const categoryLabels: Record<string, string> = {
                  macro: t("newsCategoryMacro"),
                  markets: t("newsCategoryMarkets"),
                  crypto: t("newsCategoryCryptoTech"),
                  learning: t("newsCategoryLearning"),
                  commodities: t("newsCategoryCommodities"),
                  forex: t("newsCategoryForex")
                };

                const titleText = article.title[lang] || article.title["en"];
                const summaryText = article.summary[lang] || article.summary["en"];
                const timestampText = article.timestamp[lang] || article.timestamp["en"];
                const fullContentText = article.fullContent[lang] || article.fullContent["en"];
                const expertTakeawayText = article.expertTakeaway[lang] || article.expertTakeaway["en"];

                const isFlash = article.isShockNews;
                const isExpanded = expandedArticleId === article.id;

                const collapseLabels: Record<string, string> = {
                  fr: "Réduire l'article",
                  en: "Collapse article",
                  pt: "Recolher artigo",
                  es: "Contraer artículo",
                  de: "Artikel schließen",
                  zh: "收起文章"
                };
                const collapseText = collapseLabels[lang] || collapseLabels["en"];

                return (
                  <div
                    key={article.id}
                    onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between gap-4 ${
                      isFlash 
                        ? "border-red-150 dark:border-red-950/40 bg-gradient-to-br from-white to-red-50/10 dark:from-slate-900 dark:to-red-950/5 hover:border-red-300"
                        : "border-slate-100 dark:border-slate-800 hover:border-indigo-150 dark:hover:border-indigo-900/40"
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Top Metadata Header list */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold">
                        <div className="flex items-center gap-1.5">
                          {isFlash ? (
                            <span className="px-2 py-0.5 bg-red-600 text-white rounded-full uppercase tracking-wider text-[9px] animate-pulse">
                              BREAKING
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/20 uppercase tracking-wider text-[9px]">
                              {categoryLabels[article.category]}
                            </span>
                          )}
                          <span className="text-slate-450 dark:text-slate-500">•</span>
                          <span className="text-slate-500 dark:text-slate-450 uppercase">{article.source}</span>
                        </div>

                        {/* Sentiment indicator badge component */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 dark:text-slate-550 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {timestampText}
                          </span>
                          <span className="text-slate-355">•</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-tight border ${
                            article.sentiment === "positive"
                              ? "text-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30"
                              : article.sentiment === "negative"
                              ? "text-red-500 bg-red-50/40 dark:bg-red-950/20 border-red-100/50 dark:border-red-900/30"
                              : "text-slate-550 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 border-slate-200/50 dark:border-slate-800/50"
                          }`}>
                            {article.sentiment}
                          </span>
                        </div>
                      </div>

                      <h4 className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        isFlash ? "text-red-650 dark:text-red-400 font-extrabold" : "text-slate-800 dark:text-slate-100"
                      }`}>
                        {titleText}
                      </h4>

                      {isExpanded ? (
                        <div className="space-y-4 pt-1.5 text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                          <p className="font-semibold text-slate-800 dark:text-slate-150">
                            {summaryText}
                          </p>
                          <p className="border-l-4 border-indigo-500 pl-4 py-1 text-slate-700 dark:text-slate-300">
                            {fullContentText}
                          </p>

                          {/* Interactive Expert Educational Takeaway box directly inline */}
                          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 rounded-2xl p-4.5 space-y-2">
                            <h5 className="font-extrabold text-indigo-700 dark:text-indigo-350 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                              {t("newsExpertTakeaway") || "Avis de l'expert éducatif"}
                            </h5>
                            <p className="text-[11px] sm:text-xs text-indigo-900/80 dark:text-indigo-300 font-semibold leading-relaxed">
                              {expertTakeawayText}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {summaryText}
                        </p>
                      )}
                    </div>

                    {/* Expand card click action */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedArticleId(isExpanded ? null : article.id);
                          }}
                          className="text-slate-500 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-350 flex items-center gap-1.5 cursor-pointer transition select-none"
                        >
                          <span>{isExpanded ? collapseText : (lang === "fr" ? "Aperçu rapide" : "Quick preview")}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-indigo-500 transition" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-400 transition" />
                          )}
                        </button>
                        
                        <span className="text-slate-200 dark:text-slate-800 font-normal">|</span>

                        <a
                          href={getArticleUrl(article, lang)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(article);
                          }}
                          className="text-indigo-650 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-center gap-1.5 cursor-pointer transition font-black select-none"
                        >
                          <span>{lang === "fr" ? "Lire l'article complet ↗" : "Read full article ↗"}</span>
                        </a>
                      </div>

                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-tight">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        Avis de l'IA Tutoriel inclus
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right sidebar containing Sentiment indicators & Black Swan trigger button */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Sentiment Gauge Card with dynamic dials */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-xs uppercase tracking-wider text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500 shrink-0" />
              {t("newsMarketSentiment")}
            </h4>

            <div className="py-4 text-center space-y-4">
              {/* Dial Arc Meter Simulation SVG */}
              <div className="relative w-36 h-20 mx-auto">
                {/* SVG Gauge Path */}
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path 
                    d="M 10 45 A 40 40 0 0 1 90 45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <path 
                    d="M 10 45 A 40 40 0 0 1 90 45" 
                    fill="none" 
                    stroke="url(#sentimentGrad)" 
                    strokeWidth="8" 
                    strokeDasharray="126"
                    strokeDashoffset={126 - (126 * sentimentStats.percentage) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="sentimentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Needle indicator pivot */}
                <div 
                  className="absolute bottom-0 left-[47%] w-1.5 h-12 bg-indigo-600 dark:bg-indigo-400 origin-bottom transition-all duration-1000 ease-out rounded-full"
                  style={{
                    transform: `rotate(${((sentimentStats.percentage / 100) * 180) - 90}deg)`
                  }}
                />
              </div>

              {/* Sentiment Pill Label details */}
              <div className="space-y-1">
                <p className={`text-xs font-black uppercase tracking-wider py-1 px-3 rounded-xl border max-w-max mx-auto ${sentimentStats.color}`}>
                  {sentimentStats.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Indice de confiance pondéré : <strong className="font-mono text-slate-700 dark:text-slate-350">{sentimentStats.percentage}%</strong>
                </p>
              </div>
            </div>

            <p className="border-t border-slate-50 dark:border-slate-850 pt-3 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed text-center">
              Mises à jour calculées dynamiquement d'après les rapports macroéconomiques en direct du simulateur.
            </p>
          </div>

          {/* Local Simulated Mini Tickers with Shock Impact */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3.5">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-xs uppercase tracking-wider text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-indigo-500 shrink-0" />
              Impact sur les Actifs
            </h4>
            <span className="text-[10px] text-slate-450 dark:text-slate-500 block leading-tight">
              Aperçu de la dépréciation des titres en direct lors du choc financier pour comprendre la volatilité :
            </span>

            <div className="space-y-2.5">
              {MINI_TICKERS.map((ticker) => {
                const price = activeShock ? ticker.shockPrice : ticker.normalPrice;
                const change = activeShock ? ticker.changeShock : ticker.changeNormal;
                const isLoss = change < 0;

                return (
                  <div key={ticker.symbol} className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/10 hover:bg-slate-50 dark:hover:bg-slate-950 transition">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-250 block leading-none">{ticker.symbol}</span>
                      <span className="text-[9px] text-slate-400 leading-none">{ticker.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block leading-none">{price.toFixed(2)} $</span>
                      <span className={`inline-flex items-center gap-0.5 font-mono text-[9px] font-extrabold ${isLoss ? "text-red-500" : "text-emerald-500"}`}>
                        {isLoss ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                        {isLoss ? "" : "+"}{change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Shock Simulator Trigger Button Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-990 bg-indigo-950 text-white rounded-3xl p-5 shadow-xs border border-indigo-900-30 hover:shadow-md transition duration-150 relative overflow-hidden group space-y-4">
            <div className="relative z-10 space-y-2.5">
              <h4 className="font-black text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Labo Pédagogique
              </h4>
              <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
                Expérimentez en temps réel l'effet de levier et le mouvement des capitaux lors d'une crise avec notre module de simulation de cygne noir :
              </p>

              <button
                type="button"
                onClick={toggleMarketShock}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black tracking-tight transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  activeShock 
                    ? "bg-red-650 hover:bg-red-700 bg-red-600 text-white border border-red-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border border-indigo-400"
                }`}
              >
                {activeShock ? t("newsShockNormal") : t("newsShockBtn")}
              </button>
            </div>
            {/* Absolute Ambient circles */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Expanded article dialog layout modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info bar */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 uppercase">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-950 rounded-full text-[9px]">
                  {selectedArticle.category}
                </span>
                <span>•</span>
                <span>{selectedArticle.source}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-extrabold cursor-pointer"
              >
                {t("close")}
              </button>
            </div>

            {/* Title & metadata */}
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                {selectedArticle.title[lang] || selectedArticle.title["en"]}
              </h3>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.timestamp[lang] || selectedArticle.timestamp["en"]}
              </p>
            </div>

            {/* Core News Story Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {selectedArticle.summary[lang] || selectedArticle.summary["en"]}
              </p>
              <p>
                {selectedArticle.fullContent[lang] || selectedArticle.fullContent["en"]}
              </p>
            </div>

            {/* Interactive Expert Educational Takeaway box */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 rounded-2xl p-4.5 space-y-2.5">
              <h5 className="font-extrabold text-indigo-700 dark:text-indigo-350 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                {t("newsExpertTakeaway")}
              </h5>
              <p className="text-[11px] sm:text-xs text-indigo-900/80 dark:text-indigo-300 font-semibold leading-relaxed">
                {selectedArticle.expertTakeaway[lang] || selectedArticle.expertTakeaway["en"]}
              </p>
            </div>

            {/* Close footer button */}
            <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-2.5 justify-end">
              <a
                href={getArticleUrl(selectedArticle, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-5 border border-indigo-650 hover:bg-indigo-50 dark:border-indigo-400 text-indigo-650 dark:text-indigo-400 dark:hover:bg-indigo-950/40 rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center gap-1"
              >
                <span>{lang === "fr" ? "Consulter l'article d'origine ↗" : "Consult original source ↗"}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="py-2 px-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer transition"
              >
                J'ai compris l'explication éducative
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
