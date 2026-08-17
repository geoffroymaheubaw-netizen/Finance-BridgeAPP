export type SupportedLang = 'fr' | 'en' | 'pt' | 'es' | 'de' | 'zh';

export const LANG_PROMPT_NAMES: Record<SupportedLang, string> = {
  fr: "français",
  en: "English",
  pt: "Português",
  es: "Español",
  de: "Deutsch",
  zh: "繁體中文 (Traditional Chinese)"
};

export const TIME_LABELS: Record<SupportedLang, {
  lessThanHour: string;
  oneHourAgo: string;
  hoursAgo: (n: number) => string;
  yesterday: string;
  daysAgo: (n: number) => string;
  recent: string;
}> = {
  fr: {
    lessThanHour: "Il y a moins d'une heure",
    oneHourAgo: "Il y a 1 heure",
    hoursAgo: (n) => `Il y a ${n} heures`,
    yesterday: "Hier",
    daysAgo: (n) => `Il y a ${n} jours`,
    recent: "Récemment"
  },
  en: {
    lessThanHour: "Less than an hour ago",
    oneHourAgo: "1 hour ago",
    hoursAgo: (n) => `${n} hours ago`,
    yesterday: "Yesterday",
    daysAgo: (n) => `${n} days ago`,
    recent: "Recently"
  },
  pt: {
    lessThanHour: "Há menos de uma hora",
    oneHourAgo: "Há 1 hora",
    hoursAgo: (n) => `Há ${n} horas`,
    yesterday: "Ontem",
    daysAgo: (n) => `Há ${n} dias`,
    recent: "Recentemente"
  },
  es: {
    lessThanHour: "Hace menos de una hora",
    oneHourAgo: "Hace 1 hora",
    hoursAgo: (n) => `Hace ${n} horas`,
    yesterday: "Ayer",
    daysAgo: (n) => `Hace ${n} días`,
    recent: "Recientemente"
  },
  de: {
    lessThanHour: "Vor weniger als einer Stunde",
    oneHourAgo: "Vor 1 Stunde",
    hoursAgo: (n) => `Vor ${n} Stunden`,
    yesterday: "Gestern",
    daysAgo: (n) => `Vor ${n} Tagen`,
    recent: "Kürzlich"
  },
  zh: {
    lessThanHour: "不到1小時前",
    oneHourAgo: "1小時前",
    hoursAgo: (n) => `${n}小時前`,
    yesterday: "昨天",
    daysAgo: (n) => `${n}天前`,
    recent: "近期"
  }
};

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

export function parseYahooRSSLocalized(xmlText: string, symbol: string, langStr: string = "fr"): any[] {
  const lang = (['fr', 'en', 'pt', 'es', 'de', 'zh'].includes(langStr) ? langStr : 'fr') as SupportedLang;
  const timeHelper = TIME_LABELS[lang];
  const items: any[] = [];
  const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);
  let count = 0;

  for (const match of itemMatches) {
    if (count >= 3) break;
    const content = match[1];
    
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = content.match(/<source[^>]*>([\s\S]*?)<\/source>/) || content.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/);
    const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);

    const title = titleMatch ? decodeXmlEntities(titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')) : "Market News";
    const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : `https://finance.yahoo.com/quote/${symbol}`;
    const pubDateStr = pubDateMatch ? pubDateMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : timeHelper.recent;
    const source = sourceMatch ? decodeXmlEntities(sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')) : "Yahoo Finance";
    const desc = descMatch ? decodeXmlEntities(descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '')) : "";

    // Localized relative time
    let relativeTime = pubDateStr;
    try {
      const d = new Date(pubDateStr);
      if (!isNaN(d.getTime())) {
        const diffMs = Date.now() - d.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) {
          relativeTime = timeHelper.lessThanHour;
        } else if (diffHours === 1) {
          relativeTime = timeHelper.oneHourAgo;
        } else if (diffHours < 24) {
          relativeTime = timeHelper.hoursAgo(diffHours);
        } else if (diffHours < 48) {
          relativeTime = timeHelper.yesterday;
        } else {
          relativeTime = timeHelper.daysAgo(Math.floor(diffHours / 24));
        }
      }
    } catch {}

    const fullTextTemplate: Record<SupportedLang, string> = {
      fr: `${title}\n\n${desc || "Pas de description supplémentaire disponible."}\n\nCet article provient d'une source d'informations financières référencée. Observez l'impact direct sur les volumes et les cours de l'action ${symbol}.`,
      en: `${title}\n\n${desc || "No additional description available."}\n\nThis article comes from a referenced financial information source. Monitor the direct impact on trading volume and ${symbol} stock price movements.`,
      pt: `${title}\n\n${desc || "Nenhuma descrição adicional disponível."}\n\nEste artigo provém de uma fonte financeira de referência. Observe o impacto direto no volume de negociação e no preço da ação ${symbol}.`,
      es: `${title}\n\n${desc || "Sin descripción adicional disponible."}\n\nEste artículo proviene de una fuente de información financiera de referencia. Observe el impacto directo en el volumen y el precio de la acción ${symbol}.`,
      de: `${title}\n\n${desc || "Keine zusätzliche Beschreibung verfügbar."}\n\nDieser Artikel stammt aus einer anerkannten Finanznachrichtenquelle. Beobachten Sie die direkten Auswirkungen auf das Handelsvolumen und den Kurs von ${symbol}.`,
      zh: `${title}\n\n${desc || "暫無詳細摘要。"}\n\n此文章源自權威財經新聞渠道。建議投資者密切觀察此資訊對 ${symbol} 股價波動及成交量的後續影響。`
    };

    items.push({
      id: `${symbol.toLowerCase()}_rss_${count}_` + Math.floor(Date.now() / 1000),
      title: title,
      summary: desc || (lang === 'fr' ? `Nouvelles boursières en direct pour ${symbol}.` : `Live market news for ${symbol}.`),
      source: source || "Yahoo Finance",
      timestamp: relativeTime,
      sentiment: "neutral",
      link: link,
      fullText: fullTextTemplate[lang] || fullTextTemplate.fr
    });
    count++;
  }
  return items;
}

// Multilingual predefined fallback news for core symbols
export const MULTILANG_FALLBACK_NEWS: Record<string, Record<SupportedLang, any[]>> = {
  AAPL: {
    fr: [
      {
        id: "aapl_news_1",
        title: "L'iPhone Ultra sous IA révolutionne les ventes à l'international",
        summary: "Apple a annoncé l'introduction de nouvelles fonctionnalités d'intelligence artificielle générative intégrées localement sur ses processeurs de dernière génération. Les analystes prévoient un cycle de renouvellement de hardware historique.",
        source: "Wall Street Daily",
        timestamp: "Il y a 2 heures",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Apple Inc. a officiellement dévoilé sa nouvelle architecture de processeur de silicium dotée d'une accélération matérielle locale pour les modèles d'apprentissage profond de pointe au sein de son prochain modèle iPhone Ultra. Cette annonce a immédiatement suscité l'enthousiasme de la communauté boursière.\n\nLes analystes de Wall Street indiquent que cette mise à niveau logicielle et matérielle exclusive pourrait déclencher l'un des cycles de renouvellement de smartphones les plus importants de la décennie. En déplaçant l'exécution des requêtes complexes d'intelligence artificielle directement de l'infrastructure cloud vers les puces de silicium sécurisées d'Apple, le géant de Cupertino résout d'un coup les préoccupations majeures liées à la confidentialité des données personnelles et à la bande passante.\n\nPour les investisseurs particuliers, ce saut technologique renforce la dépendance et la fidélisation des utilisateurs au sein de l'écosystème Apple, pérennisant ainsi des marges bénéficiaires hautement lucratives sur les services par abonnement."
      },
      {
        id: "aapl_news_2",
        title: "Régulation européenne : Apple fait face à une nouvelle enquête antitrust",
        summary: "La Commission Européenne examine de près les conditions de paiement de l'App Store, craignant des pratiques anti-concurrentielles. Une amende potentielle pèse de manière mesurée sur le sentiment du marché à court terme.",
        source: "Courrier Financier",
        timestamp: "Hier",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "La Commission Européenne a lancé une enquête formelle approfondie visant à déterminer si les nouvelles conditions d'accès des développeurs tiers aux interfaces de paiement d'Apple enfreignent la loi sur les marchés numériques (DMA). Ce feuilleton réglementaire européen ajoute une couche de risques juridiques pour la multinationale.\n\nEn cas d'infraction confirmée, l'exécutif européen dispose du pouvoir d'infliger des amendes substantielles pouvant atteindre jusqu'à 10 % du chiffre d'affaires mondial d'Apple. Bien que cette procédure puisse s'étirer sur plusieurs trimestres, le spectre de telles sanctions refroidit temporairement les investisseurs institutionnels qui craignent une fragmentation des revenus de l'App Store en Europe.\n\nIl est suggéré aux traders du simulateur de surveiller si Apple choisit de négocier des concessions à l'amiable ou d'engager un bras de fer juridique de longue haleine, ce qui impacterait la volatilité du titre à court terme."
      },
      {
        id: "aapl_news_3",
        title: "Nouveau partenariat stratégique prometteur dans la santé connectée",
        summary: "Apple s'associe à plusieurs grands consortiums d'hospitalisation aux États-Unis pour intégrer les capacités d'électrocardiogramme de l'Apple Watch directement dans les dossiers médicaux confidentiels des patients, validé par la FDA.",
        source: "Tech Pulse",
        timestamp: "Il y a 3 jours",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Dans le cadre d'une offensive stratégique majeure dans la santé de précision, Apple a conclu un partenariat historique sans précédent avec les trois principaux réseaux de cliniques privées américains. L'objectif est d'autoriser la transmission sécurisée et anonymisée des données vitales de l'Apple Watch directement aux médecins traitants.\n\nCe flux de données en direct continu, certifié par les autorités de santé américaines (FDA), permettra une détection précoce des troubles du rythme cardiaque ou de l'apnée du sommeil, déclenchant des notifications automatiques chez les cliniciens. Cette avancée positionne l'Apple Watch non plus comme un simple gadget de sport connecté, mais comme un instrument biomédical indispensable pour des millions de patients à risque.\n\nCette expansion territoriale vers la médecine préventive ouvre des perspectives immenses d'abonnements premium pour Apple, augmentant grandement la valeur à vie moyenne de chaque client et renforçant la thèse d'investissement à long terme."
      }
    ],
    en: [
      {
        id: "aapl_news_1",
        title: "AI-Powered iPhone Ultra Spurs Record International Upgrade Demand",
        summary: "Apple announced next-generation on-device generative AI features powered by proprietary silicon. Analysts forecast an unprecedented hardware upgrade supercycle this fall.",
        source: "Wall Street Daily",
        timestamp: "2 hours ago",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Apple Inc. officially unveiled its new silicon processor architecture featuring dedicated on-device acceleration for cutting-edge deep learning models in the upcoming iPhone Ultra lineup. The announcement triggered immediate enthusiasm across global equity markets.\n\nWall Street analysts indicate that this hardware-software integration could kickstart one of the largest smartphone upgrade cycles of the decade. By shifting intensive AI query processing directly from cloud servers to Apple's secure on-device silicon, Cupertino resolves privacy concerns and latency simultaneously.\n\nFor retail investors, this milestone solidifies user retention across the Apple ecosystem, expanding recurring high-margin subscription service revenues."
      },
      {
        id: "aapl_news_2",
        title: "European Regulatory Scrutiny: New Antitrust Inquiry Opens on App Store Terms",
        summary: "The European Commission launched an in-depth review into App Store payment frameworks under the Digital Markets Act, slightly dampening short-term institutional sentiment.",
        source: "Financial Post",
        timestamp: "Yesterday",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "The European Commission has initiated a formal inquiry to evaluate whether Apple's updated commercial developer terms comply with the Digital Markets Act (DMA). This regulatory scrutiny adds a layer of headline risk for the technology giant.\n\nPotential non-compliance penalties under EU legislation can reach substantial fractions of global revenue. While proceedings typically span multiple quarters, the uncertainty temporarily cools institutional appetite as analysts gauge potential impacts on European services revenue.\n\nSimulator traders should monitor whether Apple negotiates swift regulatory concessions or pursues protracted legal arbitration, which would drive near-term equity volatility."
      },
      {
        id: "aapl_news_3",
        title: "Apple Expands Digital Health Footprint with Major Hospital Network Alliance",
        summary: "Apple partnered with leading healthcare provider networks to integrate Apple Watch ECG biometric streaming directly into secure clinical health records with FDA clearance.",
        source: "Tech Pulse",
        timestamp: "3 days ago",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "In a strategic push into preventive digital healthcare, Apple finalized an expansive collaboration with major hospital groups across North America to enable seamless, encrypted telemetry from Apple Watch devices into clinical electronic health records.\n\nValidated by medical oversight boards, this continuous diagnostic streaming allows early detection of cardiac arrhythmias and respiratory anomalies, automatically flagging urgent telemetry to clinicians. This positions wearable hardware as an essential healthcare monitoring tool.\n\nExpanding preventive medical software ecosystems bolsters lifetime customer value and strengthens Apple's long-term competitive moat."
      }
    ],
    pt: [
      {
        id: "aapl_news_1",
        title: "iPhone Ultra com IA Revoluciona Vendas e Dispara Ciclo de Atualização",
        summary: "A Apple revelou recursos de inteligência artificial generativa integrados em seus processadores de última geração. Analistas preveem um ciclo histórico de renovação de hardware.",
        source: "Wall Street Daily",
        timestamp: "Há 2 horas",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "A Apple Inc. apresentou oficialmente sua nova arquitetura de silício com aceleração dedicada para inteligência artificial no futuro iPhone Ultra, gerando forte otimismo nos mercados globais.\n\nEspecialistas apontam que o avanço tecnológico deve impulsionar um dos maiores ciclos de substituição de smartphones da década, aumentando a fidelização de usuários e a receita recorrente de serviços digitais."
      },
      {
        id: "aapl_news_2",
        title: "Regulação Europeia: Nova Investigação Antitruste sobre a App Store",
        summary: "A Comissão Europeia iniciou um inquérito sobre as regras da App Store sob a Lei dos Mercados Digitais, gerando cautela temporária no mercado acionário.",
        source: "Diário Financeiro",
        timestamp: "Ontem",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "A Comissão Europeia investiga se as novas taxas e regras da Apple para desenvolvedores cumprem as diretrizes concorrenciais. O processo pode impor multas e exige acompanhamento dos investidores quanto à volatilidade de curto prazo."
      },
      {
        id: "aapl_news_3",
        title: "Parceria Estratégica em Saúde Digital com Redes Hospitalares Líderes",
        summary: "A Apple uniu-se a grandes redes hospitalares para conectar dados biométricos do Apple Watch diretamente a registros médicos com aprovação regulatória.",
        source: "Tech Pulse",
        timestamp: "Há 3 dias",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "A integração dos sensores do Apple Watch aos registros clínicos expande o valor agregado do ecossistema de vestíveis da Apple e fortalece suas receitas com serviços de saúde preventiva."
      }
    ],
    es: [
      {
        id: "aapl_news_1",
        title: "El iPhone Ultra con IA Revoluciona las Ventas Globales",
        summary: "Apple anunció funciones de inteligencia artificial generativa integradas en sus procesadores propios. Los analistas prevén un superciclo histórico de renovación este otoño.",
        source: "Wall Street Daily",
        timestamp: "Hace 2 horas",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Apple Inc. presentó su arquitectura de microprocesadores con aceleración de IA local para el nuevo iPhone Ultra, desatando una fuerte ola de optimismo bursátil y asegurando mayor crecimiento en servicios."
      },
      {
        id: "aapl_news_2",
        title: "Regulación en Europa: Nueva Investigación Antimonopolio sobre la App Store",
        summary: "La Comisión Europea examina las condiciones de la App Store bajo la Ley de Mercados Digitales, generando cautela moderada a corto plazo.",
        source: "Correo Financiero",
        timestamp: "Ayer",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "El escrutinio de las autoridades europeas sobre las comisiones y pasarelas de pago de la App Store introduce volatilidad regulatoria que los operadores deben vigilar."
      },
      {
        id: "aapl_news_3",
        title: "Alianza Estratégica en Salud Conectada con Redes Hospitalarias",
        summary: "Apple se asocia con grandes consorcios médicos para vincular datos del Apple Watch con historiales clínicos avalados por la FDA.",
        source: "Tech Pulse",
        timestamp: "Hace 3 días",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "La validación médica de los sensores del Apple Watch consolida el valor a largo plazo del ecosistema de la empresa de Cupertino en medicina preventiva."
      }
    ],
    de: [
      {
        id: "aapl_news_1",
        title: "KI-gestütztes iPhone Ultra löst historischen Upgrade-Zyklus aus",
        summary: "Apple präsentierte fortschrittliche On-Device-KI-Funktionen auf eigenen Prozessoren. Analysten erwarten einen starken Anstieg der internationalen Verkaufszahlen.",
        source: "Wall Street Daily",
        timestamp: "Vor 2 Stunden",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Apple Inc. hat seine neue Chip-Architektur für lokale KI-Beschleunigung im kommenden iPhone Ultra vorgestellt. Wall-Street-Experten prognostizieren einen historischen Hardware-Erneuerungszyklus, der die margenstarken Dienstleistungsumsätze weiter stärkt."
      },
      {
        id: "aapl_news_2",
        title: "EU-Regulierung: Neue Kartelluntersuchung zu App-Store-Bedingungen",
        summary: "Die EU-Kommission prüft die Einhaltung des Digital Markets Act durch Apple, was kurzfristig zu leichter Zurückhaltung bei Investoren führt.",
        source: "Finanz-Kurier",
        timestamp: "Gestern",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Die formelle Untersuchung der EU-Wettbewerbshüter zu App-Store-Entwicklerbedingungen bringt regulatorische Unsicherheit mit sich, die Trader im Blick behalten sollten."
      },
      {
        id: "aapl_news_3",
        title: "Strategische Gesundheitspartnerschaft mit großen Kliniknetzwerken",
        summary: "Apple kooperiert mit führenden US-Krankenhäusern, um Apple-Watch-EKG-Daten direkt in zertifizierte Patientenakten einzubinden.",
        source: "Tech Pulse",
        timestamp: "Vor 3 Tagen",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "Durch die FDA-geprüfte medizinische Datenanbindung verwandelt Apple seine Wearables in unverzichtbare biomedizinische Begleiter und erschließt lukrative Servicemärkte."
      }
    ],
    zh: [
      {
        id: "aapl_news_1",
        title: "搭載終端AI晶片之 iPhone Ultra 引爆全球歷史級換機潮",
        summary: "蘋果宣佈最新一代自主研發晶片全面整合端側生成式AI功能，華爾街投行看好秋季將迎來史上最強勁的硬體升級超級週期。",
        source: "華爾街日報",
        timestamp: "2小時前",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "蘋果公司正式發佈專為新一代 iPhone Ultra 打造的高效能端側AI晶片架構。這項突破將大量AI運算直接移至安全晶片處理，既保護隱私又大幅降低雲端延遲。\n\n分析師認為，這將觸發十年來最龐大的智慧型手機換機循環，進一步鞏固高利潤的訂閱服務生態鏈。"
      },
      {
        id: "aapl_news_2",
        title: "歐盟反壟斷法規持續施壓：App Store 支付條款面臨新規審查",
        summary: "歐盟執委會依據《數位市場法》對蘋果應用商店展開深入調查，短期內對市場投資情緒形成溫和壓抑。",
        source: "財經快訊",
        timestamp: "昨天",
        sentiment: "negative",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "歐盟當局正在調查蘋果為第三方開發者設定的新商業模式是否符合法規。若判定違規可能面臨罰款風險，投資者需留意相關消息對股價波動的短期影響。"
      },
      {
        id: "aapl_news_3",
        title: "佈局精準醫療：Apple Watch 生物數據與大型醫療體系深度整合",
        summary: "蘋果與北美三大私立醫療網絡達成戰略合作，經 FDA 認證將心電圖與健康監測實時串接至臨床病歷系統。",
        source: "科技脈動",
        timestamp: "3天前",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/AAPL",
        fullText: "這項醫療級合作讓 Apple Watch 從個人穿戴裝置升級為專業預防醫學工具，顯著提升了用戶終生價值與長期護城河。"
      }
    ]
  },
  MSFT: {
    fr: [
      {
        id: "msft_news_1",
        title: "Copilot Pro franchit le cap symbolique des 15 millions d'abonnés payants",
        summary: "La suite de productivité assistée par IA de Microsoft progresse plus rapidement que prévu par le consensus, renforçant la rentabilité globale de la branche Office SaaS.",
        source: "Silicon Valley Echo",
        timestamp: "Il y a 4 heures",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Microsoft a annoncé que Copilot Pro venait de dépasser 15 millions d'abonnés payants. L'adoption accélérée de sa suite bureautique revampée par l'IA générative valide son modèle de tarification additionnel de 20 dollars par utilisateur."
      },
      {
        id: "msft_news_2",
        title: "Investissement d'infrastructure massif de 3,2 milliards $ dans le Cloud en Allemagne",
        summary: "Microsoft continue d'étendre activement ses centres de données en Europe pour répondre à la demande exponentielle en calcul d'IA et garantir la souveraineté des données.",
        source: "Global Tech Journal",
        timestamp: "Hier",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Microsoft investit 3,2 milliards de dollars dans des infrastructures cloud en Allemagne pour doubler les capacités d'entraînement de serveurs IA en Europe."
      },
      {
        id: "msft_news_3",
        title: "Panne mondiale Azure résolue en un temps record par les équipes",
        summary: "Un incident réseau mineur a temporairement perturbé certains services Cloud d'Azure en Asie-Pacifique, rétabli en moins de deux heures.",
        source: "Network Infrastructure",
        timestamp: "Il y a 5 jours",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "La brève anomalie réseau a été gérée sans pénalité financière notable, confirmant la grande résilience opérationnelle de Microsoft Azure."
      }
    ],
    en: [
      {
        id: "msft_news_1",
        title: "Copilot Pro Surpasses 15 Million Paid Enterprise Subscribers Milestone",
        summary: "Microsoft's generative AI productivity suite adoption beats consensus expectations, significantly boosting Office SaaS average revenue per user.",
        source: "Silicon Valley Echo",
        timestamp: "4 hours ago",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Microsoft revealed that Copilot Pro subscriptions crossed 15 million active paid users. Rapid enterprise rollout validates the premium monetization tier and expands operating margins."
      },
      {
        id: "msft_news_2",
        title: "Microsoft Announces $3.2B Cloud & AI Infrastructure Expansion in Germany",
        summary: "Major data center buildout aims to double AI compute capacity in continental Europe while ensuring strict regional data sovereignty compliance.",
        source: "Global Tech Journal",
        timestamp: "Yesterday",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "The multi-billion dollar datacenter investment cements Microsoft's leadership in European enterprise cloud infrastructure as industrial giants accelerate Azure migrations."
      },
      {
        id: "msft_news_3",
        title: "Minor Azure APAC Network Interruption Swiftly Resolved Under Two Hours",
        summary: "A transient routing issue in Asia-Pacific was resolved promptly with zero material SLA penalties, demonstrating cloud operational resilience.",
        source: "Network Infrastructure",
        timestamp: "5 days ago",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "The swift incident management confirmed robust failover protocols across Microsoft Azure data centers with minimal long-term stock impact."
      }
    ],
    pt: [
      {
        id: "msft_news_1",
        title: "Copilot Pro Ultrapassa 15 Milhões de Assinantes Pagos",
        summary: "A suíte corporativa de IA da Microsoft supera as estimativas de Wall Street e acelera a receita do Office SaaS.",
        source: "Silicon Valley Echo",
        timestamp: "Há 4 horas",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "A rápida adoção do Copilot Pro valida o modelo de monetização de IA da Microsoft e consolida sua liderança em produtividade em nuvem."
      },
      {
        id: "msft_news_2",
        title: "Investimento de 3,2 Bilhões de Dólares em Cloud na Alemanha",
        summary: "A Microsoft dobra sua capacidade de computação em IA na Europa para atender a forte demanda corporativa por soberania de dados.",
        source: "Global Tech Journal",
        timestamp: "Ontem",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "O plano de infraestrutura consolida a posição do Azure perante os principais grupos industriais europeus."
      },
      {
        id: "msft_news_3",
        title: "Breve Instabilidade no Azure Ásia-Pacífico é Resolvida Rapidamente",
        summary: "Falha de rede temporária foi normalizada em menos de duas horas pelas equipes técnicas sem impacto financeiro.",
        source: "Network Infrastructure",
        timestamp: "Há 5 dias",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "A rápida restauração dos serviços demonstra a robustez dos sistemas redundantes da Microsoft."
      }
    ],
    es: [
      {
        id: "msft_news_1",
        title: "Copilot Pro Supera los 15 Millones de Suscriptores de Pago",
        summary: "La adopción de la herramienta de productividad con IA de Microsoft supera las expectativas y eleva los márgenes del segmento Office SaaS.",
        source: "Silicon Valley Echo",
        timestamp: "Hace 4 horas",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "El rápido crecimiento de usuarios de Copilot confirma el éxito de la monetización de IA generativa en empresas globales."
      },
      {
        id: "msft_news_2",
        title: "Inversión Multimillonaria de 3.200M$ en Centros de Datos en Alemania",
        summary: "Microsoft duplica su infraestructura de cómputo en la nube e IA en Europa para garantizar la soberanía de datos.",
        source: "Global Tech Journal",
        timestamp: "Ayer",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "La expansión refuerza el liderazgo de Azure frente a sus competidores en la transformación digital europea."
      },
      {
        id: "msft_news_3",
        title: "Incidencia Temporal en Redes Azure de Asia Solucionada con Éxito",
        summary: "Los servicios en la nube fueron reestablecidos en menos de dos horas sin penalizaciones contractuales relevantes.",
        source: "Network Infrastructure",
        timestamp: "Hace 5 días",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "La rápida respuesta de los ingenieros confirma la sólida resiliencia operativa de los servicios cloud de Microsoft."
      }
    ],
    de: [
      {
        id: "msft_news_1",
        title: "Copilot Pro überschreitet Meilenstein von 15 Millionen zahlenden Nutzern",
        summary: "Die KI-gestützte Produktivitätssuite von Microsoft wächst schneller als erwartet und stärkt die Margen der Office-SaaS-Sparte.",
        source: "Silicon Valley Echo",
        timestamp: "Vor 4 Stunden",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Die starke Nachfrage nach KI-Integrationen in Microsoft 365 belegt die Zahlungsbereitschaft von Unternehmen und stärkt den Marktanteil."
      },
      {
        id: "msft_news_2",
        title: "Milliardenschwere 3,2 Mrd. $ Investition in Cloud & KI in Deutschland",
        summary: "Microsoft verdoppelt seine Rechenzentrumskapazitäten in Europa, um der rasant steigenden Nachfrage nach sicherer KI-Verarbeitung gerecht zu werden.",
        source: "Global Tech Journal",
        timestamp: "Gestern",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Der massive Ausbau stärkt das Vertrauen deutscher Industrieunternehmen in die Azure-Cloud und sichert langfristige Großaufträge."
      },
      {
        id: "msft_news_3",
        title: "Kurze Azure-Netzwerkunterbrechung im Asien-Pazifik-Raum rasch behoben",
        summary: "Ein kurzzeitiger Vorfall wurde innerhalb von zwei Stunden ohne signifikante SLA-Verletzungen gelöst.",
        source: "Network Infrastructure",
        timestamp: "Vor 5 Tagen",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "Die schnelle Wiederherstellung unterstreicht die hohe Systemresilienz der weltweiten Microsoft-Rechenzentren."
      }
    ],
    zh: [
      {
        id: "msft_news_1",
        title: "微軟 Copilot Pro 付費企業訂閱突破 1500 萬用戶大關",
        summary: "微軟生成式AI辦公套件採用率顯著超越市場共識預期，大幅推升 Office 企業雲端部門毛利率與每用戶營收。",
        source: "矽谷觀察",
        timestamp: "4小時前",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "微軟宣佈 Copilot Pro 付費用戶正式跨越 1500 萬門檻，充分驗證了AI增值訂閱定價策略的商業成功。"
      },
      {
        id: "msft_news_2",
        title: "微軟宣佈在德國重金投資 32 億美元擴建雲端與AI超級運算中心",
        summary: "此項巨額投資將使歐洲本地AI模型訓練容量翻倍，滿足歐洲工業與金融巨頭嚴格的資料主權法規要求。",
        source: "全球科技日報",
        timestamp: "昨天",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "擴建雲端資料中心將進一步加深微軟 Azure 與歐洲頂尖工業跨國企業的合作綁定。"
      },
      {
        id: "msft_news_3",
        title: "微軟 Azure 亞太區短暫網路波動於兩小時內全數修復",
        summary: "工程團隊在極短時間內完成故障轉移與系統修復，未造成重大違約責任，展現頂級雲端韌性。",
        source: "網路基礎設施周刊",
        timestamp: "5天前",
        sentiment: "neutral",
        link: "https://finance.yahoo.com/quote/MSFT",
        fullText: "此事件對微軟長期雲端基本面無實質負面影響，投資者反應平穩。"
      }
    ]
  },
  NVDA: {
    fr: [
      {
        id: "nvda_news_1",
        title: "NVIDIA dévoile l'architecture Blackwell pour les supercalculateurs d'IA",
        summary: "Les nouveaux processeurs graphiques promettent une puissance multipliée par 30 tout en réduisant l'empreinte énergétique. Précommandes massives enregistrées.",
        source: "Next-Gen Tech",
        timestamp: "Il y a 1 heure",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "Jensen Huang a présenté la puce Blackwell, offrant un bond spectaculaire de performance pour l'entraînement des modèles de fondation d'IA."
      },
      {
        id: "nvda_news_2",
        title: "Capacités de production CoWoS en forte expansion chez TSMC",
        summary: "Les tensions d'empaquetage avancé diminuent progressivement, permettant à NVIDIA d'accélérer ses livraisons de cartes d'accélération d'IA.",
        source: "Semi-Weekly",
        timestamp: "Hier",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "L'augmentation des cadences chez TSMC débloque le carnet de commandes de NVIDIA pour ses clients du cloud hyperscale."
      },
      {
        id: "nvda_news_3",
        title: "Résultats trimestriels records portés par la demande en Data Centers",
        summary: "Chiffre d'affaires en hausse spectaculaire avec une marge brute robuste de 78%, confirmant la puissance de son modèle économique.",
        source: "Wall Street Daily",
        timestamp: "Il y a 4 jours",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "La dynamique d'investissement dans les centres de données dédiés à l'IA continue de générer des flux de trésorerie historiques pour NVIDIA."
      }
    ],
    en: [
      {
        id: "nvda_news_1",
        title: "NVIDIA Unveils Blackwell Architecture for Next-Gen AI Supercomputing",
        summary: "Next-generation GPUs offer up to 30x performance acceleration while drastically slashing energy footprint. Massive hyper-scaler preorders logged.",
        source: "Next-Gen Tech",
        timestamp: "1 hour ago",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "NVIDIA CEO Jensen Huang officially introduced the Blackwell architecture, engineered to power multi-trillion parameter AI foundation models with extraordinary energy efficiency."
      },
      {
        id: "nvda_news_2",
        title: "Advanced CoWoS Packaging Capacity Expands Rapidly at TSMC",
        summary: "Supply chain bottlenecks for high-bandwidth memory packaging ease, clearing the runway for accelerated enterprise GPU shipment volumes.",
        source: "Semi-Weekly",
        timestamp: "Yesterday",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "Capacity ramp-up at foundry partner TSMC enables NVIDIA to satisfy surging order backlogs from premier global cloud providers."
      },
      {
        id: "nvda_news_3",
        title: "Historic Quarterly Earnings Driven by Unprecedented Data Center Demand",
        summary: "Revenue surges year-over-year with gross margins holding strong around 78%, solidifying NVIDIA's market dominance.",
        source: "Wall Street Daily",
        timestamp: "4 days ago",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "NVIDIA crushed consensus estimates with record quarterly cash flow as enterprise generative AI infrastructure spending accelerates."
      }
    ],
    pt: [
      {
        id: "nvda_news_1",
        title: "NVIDIA Lança Arquitetura Blackwell para Supercomputação de IA",
        summary: "Novas GPUs prometem salto de 30x em poder de computação com menor consumo energético. Encomendas recordes confirmadas.",
        source: "Next-Gen Tech",
        timestamp: "Há 1 hora",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "A arquitetura Blackwell redefine o treinamento de grandes modelos de inteligência artificial e consolida a liderança da NVIDIA."
      },
      {
        id: "nvda_news_2",
        title: "Expansão de Produção na TSMC Acelera Entregas de Chips de IA",
        summary: "Gargalos em embalagem avançada são superados, permitindo ritmo mais acelerado de entrega aos grandes provedores de nuvem.",
        source: "Semi-Weekly",
        timestamp: "Ontem",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "A melhoria no fornecimento garante a sustentação dos fortes números de receita para os próximos trimestres."
      },
      {
        id: "nvda_news_3",
        title: "Resultados Trimestrais Históricos Impulsionados por Data Centers",
        summary: "Receita cresce em ritmo exponencial com margem bruta de 78%, confirmando a sólida demanda estrutural por IA.",
        source: "Wall Street Daily",
        timestamp: "Há 4 dias",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "O investimento contínuo dos gigantes da tecnologia em infraestrutura sustenta a valorização da companhia no mercado."
      }
    ],
    es: [
      {
        id: "nvda_news_1",
        title: "NVIDIA Presenta la Arquitectura Blackwell para Supercomputación de IA",
        summary: "Los nuevos chips multiplican por 30 la potencia con alta eficiencia energética. Grandes tecnológicas copan los pedidos.",
        source: "Next-Gen Tech",
        timestamp: "Hace 1 hora",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "La arquitectura Blackwell consolida el dominio casi absoluto de NVIDIA en el mercado de aceleradores de computación de IA."
      },
      {
        id: "nvda_news_2",
        title: "TSMC Acelera la Fabricación y Desbloquea Entregas de Chips de IA",
        summary: "La ampliación de líneas avanzadas de empaquetado permite a NVIDIA abastecer con mayor rapidez su récord de pedidos.",
        source: "Semi-Weekly",
        timestamp: "Ayer",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "El alivio de la cadena de suministro asegura que los ingresos por envíos continúen en niveles récord."
      },
      {
        id: "nvda_news_3",
        title: "Beneficios Récord Impulsados por el Auge Imparable de los Data Centers",
        summary: "Ingresos históricos y márgenes brutos del 78% reafirman la solidez de su liderazgo en inteligencia artificial.",
        source: "Wall Street Daily",
        timestamp: "Hace 4 días",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "El trimestre récord demuestra que el despliegue de infraestructura de IA es una transformación económica estructural."
      }
    ],
    de: [
      {
        id: "nvda_news_1",
        title: "NVIDIA enthüllt bahnbrechende Blackwell-Architektur für KI-Server",
        summary: "Neue Grafikprozessoren bieten bis zu 30-fache Rechenleistung bei deutlich geringerem Stromverbrauch. Großkunden ordern massiv.",
        source: "Next-Gen Tech",
        timestamp: "Vor 1 Stunde",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "Jensen Huang stellte den Blackwell-Chip vor, der das Training komplexester Sprachmodelle revolutioniert und NVIDIAs Marktführung zementiert."
      },
      {
        id: "nvda_news_2",
        title: "TSMC baut Packaging-Kapazitäten für KI-Chips beschleunigt aus",
        summary: "Engpässe bei modernen Halbleitersubstraten lockern sich, was schnellere Lieferungen an Cloud-Anbieter ermöglicht.",
        source: "Semi-Weekly",
        timestamp: "Gestern",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "Der Kapazitätsausbau bei TSMC sorgt dafür, dass NVIDIA die enorme Auftragsflut planmäßig abarbeiten kann."
      },
      {
        id: "nvda_news_3",
        title: "Rekordergebnis im Quartal dank beispielloser Nachfrage nach Rechenzentren",
        summary: "Umsatzsprung mit einer operativen Bruttomarge von 78% beweist die außergewöhnliche Ertragskraft des Unternehmens.",
        source: "Wall Street Daily",
        timestamp: "Vor 4 Tagen",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "Die starke Performance zeigt, dass die Investitionswelle in KI-Hardware auf soliden Fundamentaldaten basiert."
      }
    ],
    zh: [
      {
        id: "nvda_news_1",
        title: "輝達震撼發表 Blackwell 架構晶片 引領次世代AI超級運算",
        summary: "全新圖形處理器提供高達30倍運算效能並大幅降低能耗，各大雲端巨頭已提前包攬首波產能訂單。",
        source: "前沿科技報導",
        timestamp: "1小時前",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "輝達執行長黃仁勳正式推出 Blackwell 架構晶片，專為兆級參數大型語言模型訓練量身打造，持續鞏固輝達在AI運算領域的絕對優勢地位。"
      },
      {
        id: "nvda_news_2",
        title: "台積電 CoWoS 先進封裝產能全速擴張 助攻輝達晶片如期出貨",
        summary: "供應鏈產能瓶頸顯著緩解，輝達能以更快速度消化全球頂級科技企業的龐大待交付訂單。",
        source: "半導體產業週報",
        timestamp: "昨天",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "先進封裝產能的順利爬坡，確保輝達在未來多個季度維持強勁的交付能力與高毛利率表現。"
      },
      {
        id: "nvda_news_3",
        title: "資料中心需求爆發 輝達季度財報再次全面超越華爾街預期",
        summary: "營收年增率創下歷史新高，毛利率堅挺維持在78%水準，獲利表現極其亮眼。",
        source: "華爾街日報",
        timestamp: "4天前",
        sentiment: "positive",
        link: "https://finance.yahoo.com/quote/NVDA",
        fullText: "此份亮眼財報再次向全球資本市場證明，生成式AI基礎建設的投資浪潮具備強大的實質營收與獲利支撐。"
      }
    ]
  }
};

// Generic stock localized news generator for any other ticker
export function generateGenericLocalizedNews(symbol: string, langStr: string = "fr"): any[] {
  const lang = (['fr', 'en', 'pt', 'es', 'de', 'zh'].includes(langStr) ? langStr : 'fr') as SupportedLang;
  const timeHelper = TIME_LABELS[lang];

  const templates: Record<SupportedLang, any[]> = {
    fr: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol} : Accélération des investissements d'innovation et croissance solide`,
        summary: `La direction de ${symbol} annonce une progression robuste de ses revenus trimestriels, portée par une excellente demande globale.`,
        source: "Wall Street Daily",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} a publié des résultats supérieurs aux prévisions des analystes. L'augmentation des marges et la maîtrise des coûts de fonctionnement soutiennent la confiance des investisseurs sur le long terme.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol} : Consolidation sectorielle et équilibre des volumes d'échange`,
        summary: `Le titre ${symbol} stabilise ses cours dans un marché attentif aux prochaines annonces de la politique monétaire.`,
        source: "Courrier Financier",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `Les échanges sur le titre ${symbol} restent réguliers avec une volatilité modérée, offrant une opportunité d'analyse technique pour les traders adeptes d'ordres limites.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol} : Perspectives positives et expansion stratégique internationale`,
        summary: `De nouveaux partenariats et des gains d'efficacité logistique renforcent la valeur fondamentale de ${symbol}.`,
        source: "Tech Pulse",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `L'entreprise poursuit avec succès sa feuille de route de diversification, ce qui permet de pérenniser son flux de trésorerie face aux aléas de court terme.`
      }
    ],
    en: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol}: Strategic Innovation Drive Fuels Robust Quarterly Growth`,
        summary: `${symbol} leadership reported higher-than-expected revenue expansion underpinned by strong global product demand.`,
        source: "Wall Street Daily",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} delivered strong financial performance outpacing analyst expectations. Expanding operating margins and steady disciplined execution boost institutional long-term confidence.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol}: Sector Consolidation and Balanced Trading Volumes Observed`,
        summary: `${symbol} stock trades in a stable range as market participants evaluate macroeconomic data and rate outlooks.`,
        source: "Financial Post",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `Trading volume for ${symbol} remains healthy with moderate volatility, providing a classic setup for risk-managed swing trading strategies.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol}: Strategic International Expansion and Positive Guidance`,
        summary: `New commercial alliances and operational efficiency gains enhance ${symbol}'s fundamental valuation.`,
        source: "Tech Pulse",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `The company continues executing its diversification roadmap, generating resilient free cash flow and strengthening long-term shareholder value.`
      }
    ],
    pt: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol}: Inovação Estratégica e Crescimento Sólido nos Resultados`,
        summary: `A administração de ${symbol} registrou forte expansão de receitas, superando o consenso de mercado.`,
        source: "Wall Street Daily",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} apresentou números trimestrais consistentes, com expansão de margens e sólida confiança de investidores institucionais.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol}: Consolidação de Mercado e Volumes Estáveis de Negociação`,
        summary: `As ações de ${symbol} mantêm trajetória de estabilidade enquanto o mercado analisa dados macroeconômicos.`,
        source: "Diário Financeiro",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `O comportamento das cotações de ${symbol} reflete equilíbrio entre compradores e vendedores com volatilidade controlada.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol}: Expansão Internacional e Perspectivas Favoráveis`,
        summary: `Novas parcerias estratégicas e ganhos operacionais reforçam a tese de investimento em ${symbol}.`,
        source: "Tech Pulse",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `A execução disciplinada do plano de crescimento sustenta a geração de caixa de longo prazo da companhia.`
      }
    ],
    es: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol}: Innovación Estratégica y Sólido Crecimiento Trimestral`,
        summary: `La directiva de ${symbol} comunica un aumento destacado en sus ingresos gracias a la demanda global.`,
        source: "Wall Street Daily",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} superó las expectativas del consenso financiero gracias a una gestión eficiente de costos y mayores márgenes operativos.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol}: Consolidación del Sector y Volúmenes de Negociación Equilibrados`,
        summary: `El título ${symbol} se mantiene estable a la espera de nuevos catalizadores macroeconómicos.`,
        source: "Correo Financiero",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `La cotización de ${symbol} muestra un comportamiento ordenado con volatilidad moderada ideal para el aprendizaje del inversor.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol}: Expansión Internacional y Perspectivas Estratégicas Positivas`,
        summary: `Nuevas alianzas comerciales y mejoras operativas fortalecen los fundamentales de ${symbol}.`,
        source: "Tech Pulse",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `La empresa continúa ejecutando con éxito su plan de crecimiento a largo plazo, reforzando la rentabilidad por acción.`
      }
    ],
    de: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol}: Strategische Innovation treibt solides Quartalswachstum an`,
        summary: `Die Führung von ${symbol} meldet ein starkes Umsatzplus, gestützt durch eine robuste weltweite Nachfrage.`,
        source: "Wall Street Daily",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} übertraf die Analystenschätzungen durch verbesserte operative Margen und konsequente Kostendisziplin.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol}: Sektorkonsolidierung und ausgeglichenes Handelsvolumen`,
        summary: `Die Aktie von ${symbol} notiert stabil in Erwartung neuer wirtschaftlicher Rahmendaten.`,
        source: "Finanz-Kurier",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `Das Handelsgeschehen bei ${symbol} verläuft geordnet mit moderater Volatilität und solider Liquidität.`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol}: Internationale Expansion und optimistische Zukunftsaussichten`,
        summary: `Neue strategische Kooperationen und Effizienzgewinne stärken die fundamentale Bewertung von ${symbol}.`,
        source: "Tech Pulse",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `Die nachhaltige Umsetzung der Wachstumsstrategie festigt den operativen Cashflow und sichert den Unternehmenswert.`
      }
    ],
    zh: [
      {
        id: `${symbol.toLowerCase()}_gen_1`,
        title: `${symbol}：策略創新發酵，季度營收與獲利展現強勁增長動能`,
        summary: `${symbol} 管理層公佈最新業績報告，受惠於全球強勁需求，營收與淨利雙雙超越市場分析師預期。`,
        source: "華爾街日報",
        timestamp: timeHelper.hoursAgo(2),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} 營運表現優異，營業利潤率持續擴張且成本控管得宜，進一步強化了長期機構投資者的持股信心。`
      },
      {
        id: `${symbol.toLowerCase()}_gen_2`,
        title: `${symbol}：產業板塊進入健康整理期，交易量維持均衡穩定`,
        summary: `${symbol} 股價在區間內平穩震盪整理，市場資金正密切觀察最新總體經濟情勢與利率政策。`,
        source: "財經快訊",
        timestamp: timeHelper.yesterday,
        sentiment: "neutral",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `${symbol} 成交量維持健康水準且波動度溫和，為重視風險控管的交易者提供良好的技術分析參考依據。`
      },
      {
        id: `${symbol.toLowerCase()}_gen_3`,
        title: `${symbol}：國際市場擴張告捷，長期基本面估值展望正面`,
        summary: `全新商業戰略聯盟與營運效率提升，為 ${symbol} 的內在企業價值奠定堅實基礎。`,
        source: "科技脈動",
        timestamp: timeHelper.daysAgo(3),
        sentiment: "positive",
        link: `https://finance.yahoo.com/quote/${symbol}`,
        fullText: `該公司持續落實業務多元化方針，維持強勁的自由現金流表現，為股東創造持續穩健的長期價值回報。`
      }
    ]
  };

  return templates[lang] || templates.fr;
}

export function getLocalizedFallbackNews(symbol: string, langStr: string = "fr"): any[] {
  const lang = (['fr', 'en', 'pt', 'es', 'de', 'zh'].includes(langStr) ? langStr : 'fr') as SupportedLang;
  const uppercaseSymbol = symbol.toUpperCase();
  
  if (MULTILANG_FALLBACK_NEWS[uppercaseSymbol] && MULTILANG_FALLBACK_NEWS[uppercaseSymbol][lang]) {
    return MULTILANG_FALLBACK_NEWS[uppercaseSymbol][lang];
  }

  // Check if AAPL has it
  if (MULTILANG_FALLBACK_NEWS["AAPL"] && MULTILANG_FALLBACK_NEWS["AAPL"][lang] && uppercaseSymbol === "AAPL") {
    return MULTILANG_FALLBACK_NEWS["AAPL"][lang];
  }

  return generateGenericLocalizedNews(uppercaseSymbol, lang);
}
