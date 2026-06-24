import { Stock, LessonModule } from "./types";

// Database of ultra-realistic stock values and real tickers with 30-day index histories
const STATIC_CORE_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 290.55,
    change: 1.45,
    history: [275.2, 276.5, 274.8, 274.1, 275.2, 276.8, 278.4, 277.5, 277.2, 275.8, 277.1, 278.7, 279.4, 280.5, 278.8, 280.2, 281.5, 282.3, 280.8, 281.3, 282.4, 283.7, 285.8, 287.2, 288.1, 288.5, 289.4, 287.8, 289.2, 290.55],
    volume: "45.3M",
    marketCap: "4.14T $",
    low24h: 288.10,
    high24h: 292.80,
    description: "Apple conçoit, fabrique et commercialise des smartphones, des ordinateurs personnels, des tablettes, des accessoires et des services connexes dans le monde entier.",
    news: [
      {
        id: "aapl_news_1",
        title: "L'iPhone Ultra sous IA révolutionne les ventes à l'international",
        summary: "Apple a annoncé l'introduction de nouvelles fonctionnalités d'intelligence artificielle générative intégrées localement sur ses processeurs de dernière génération. Les analystes prévoient un cycle de renouvellement de hardware historique à l'automne.",
        source: "Wall Street Daily",
        timestamp: "Il y a 2 heures",
        sentiment: "positive"
      },
      {
        id: "aapl_news_2",
        title: "Régulation européenne : Apple fait face à une nouvelle enquête antitrust",
        summary: "La Commission Européenne examine de près les conditions de paiement de l'App Store, craignant des pratiques anti-concurrentielles. Une amende potentielle pèse de manière mesurée sur le sentiment du marché à court terme.",
        source: "Courrier Financier",
        timestamp: "Hier",
        sentiment: "negative"
      },
      {
        id: "aapl_news_3",
        title: "Nouveau partenariat stratégique prometteur dans la santé connectée",
        summary: "Apple s'associe à plusieurs grands consortiums d'hospitalisation aux États-Unis pour intégrer les capacités d'électrocardiogramme de l'Apple Watch directement dans les dossiers médicaux confidentiels des patients, validé par la FDA.",
        source: "Tech Pulse",
        timestamp: "Il y a 3 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 403.41,
    change: -2.02,
    history: [387.1, 388.5, 390.1, 391.8, 393.8, 391.6, 392.7, 394.9, 397.0, 398.6, 397.7, 396.6, 399.6, 401.8, 401.2, 402.3, 404.0, 404.6, 402.5, 403.2, 405.9, 407.2, 406.1, 404.6, 404.1, 405.2, 406.2, 404.2, 402.7, 403.41],
    volume: "34.1M",
    marketCap: "3.00T $",
    low24h: 398.48,
    high24h: 411.98,
    description: "Microsoft développe, concède sous licence et prend en charge des logiciels, des services, des appareils et des solutions dans le monde entier. Leader de l'IA via son partenariat avec OpenAI.",
    news: [
      {
        id: "msft_news_1",
        title: "Copilot Pro franchit le cap symbolique des 15 millions d'abonnés payants",
        summary: "La suite de productivité assistée par intelligence artificielle de Microsoft progresse beaucoup plus rapidement que prévu initialement par le consensus des banques d'affaires, renforçant la rentabilité globale de la branche Office SaaS.",
        source: "Silicon Valley Echo",
        timestamp: "Il y a 4 heures",
        sentiment: "positive"
      },
      {
        id: "msft_news_2",
        title: "Investissement d'infrastructure massif de 3,2 milliards $ dans le Cloud en Allemagne",
        summary: "Microsoft continue d'étendre activement ses infrastructures de centres de données en Europe pour répondre à la demande exponentielle en calcul d'IA et garantir la souveraineté locale des données régionales.",
        source: "Global Tech Journal",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "msft_news_3",
        title: "Panne mondiale Azure résolue en un temps record par les équipes",
        summary: "Un incident réseau mineur a temporairement perturbé certains services Cloud d'Azure en zone Asie-Pacifique. Les équipes techniques ont rétabli la situation en moins de deux heures, sans pénalité financière notable.",
        source: "Network Infrastructure",
        timestamp: "Il y a 5 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 208.19,
    change: -0.22,
    history: [180.91, 182.75, 184.74, 185.82, 188.42, 190.1, 188.87, 191.33, 193.32, 195.46, 193.63, 196.54, 198.53, 200.84, 199.0, 201.6, 203.6, 204.66, 202.37, 204.21, 206.65, 207.72, 205.73, 206.96, 208.8, 206.81, 209.25, 207.11, 206.2, 208.19],
    volume: "179.6M",
    marketCap: "5.12T $",
    low24h: 199.34,
    high24h: 211.39,
    description: "NVIDIA conçoit des processeurs graphiques (GPU) pour les marchés du jeu vidéo et des professionnels, ainsi que des systèmes sur puce pour l'informatique mobile et le marché automobile. Pilier central de l'IA moderne.",
    news: [
      {
        id: "nvda_news_1",
        title: "NVIDIA dévoile l'architecture Blackwell pour les supercalculateurs d'IA",
        summary: "Les nouveaux processeurs graphiques d'IA promettent une puissance de calcul multipliée par 30 tout en réduisant drastiquement l'empreinte énergétique globale du hardware. Les géants du web ont déjà passé des précommandes massives.",
        source: "Next-Gen Tech",
        timestamp: "Il y a 1 heure",
        sentiment: "positive"
      },
      {
        id: "nvda_news_2",
        title: "Pénurie persistante sur les substrats avancés d'empaquetage chez TSMC",
        summary: "Malgré une demande record pour les puces H100/H200, les tensions persistantes sur la chaîne d'approvisionnement des composants d'empaquetage avancés (CoWoS) contraignent modérément le rythme de livraison de NVIDIA.",
        source: "Semi-Weekly",
        timestamp: "Il y a 2 jours",
        sentiment: "neutral"
      },
      {
        id: "nvda_news_3",
        title: "Résultats fantastiques du T1 : Chiffre d'affaires en hausse de 262% sur un an",
        summary: "NVIDIA pulvérise à nouveau les estimations les plus optimistes de Wall Street avec un bénéfice net historique porté par la frénésie irrépressible d'achats chez tous les grands fournisseurs de cloud hyperscale.",
        source: "Wall Street Daily",
        timestamp: "Il y a 4 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 396.68,
    change: -3.00,
    history: [359.13, 361.35, 358.2, 356.92, 358.94, 361.89, 364.84, 363.2, 362.64, 360.05, 362.46, 365.41, 366.69, 368.72, 365.59, 368.18, 370.56, 372.04, 369.28, 370.2, 372.23, 374.63, 378.5, 381.62, 385.85, 389.0, 393.22, 390.46, 392.48, 396.68],
    volume: "58.3M",
    marketCap: "1.24T $",
    low24h: 384.24,
    high24h: 418.50,
    description: "Tesla conçoit, développe, fabrique et vend des véhicules électriques, ainsi que des systèmes de stockage d'énergie et de production d'électricité propre.",
    news: [
      {
        id: "tsla_news_1",
        title: "Rumeurs d'une voiture électrique grand public (Model 2) à 25 000 $",
        summary: "Tesla accélère activement ses plans d'ingénierie pour une nouvelle plateforme automobile abordable développée sous le nom de code 'Redwood'. Les usines du Texas et de Berlin ont entamé les préparatifs des lignes d'assemblage.",
        source: "Auto Électrique",
        timestamp: "Il y a 3 heures",
        sentiment: "positive"
      },
      {
        id: "tsla_news_2",
        title: "Ralentissement passager de la Gigafactory de Berlin pour réfection technique",
        summary: "La production européenne a essuyé de légers blocages de transport combinés à des interruptions de réseau externe, ce qui va décaler temporairement quelques milliers de livraisons sur le trimestre d'après.",
        source: "Euro News Finance",
        timestamp: "Hier",
        sentiment: "negative"
      },
      {
        id: "tsla_news_3",
        title: "La bêta FSD (Full Self-Driving) V12 impressionne la presse par sa fluidité",
        summary: "La dernière mise à jour de conduite autonome basée uniquement sur la vision par caméra et des réseaux de neurones profonds montre un comportement fluide, très proche d'un conducteur humain expérimenté.",
        source: "Autonomous Cars",
        timestamp: "Il y a 4 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 364.26,
    change: 0.26,
    history: [330.4, 332.64, 335.5, 332.22, 333.45, 336.92, 338.75, 338.15, 340.4, 343.03, 341.62, 340.18, 342.64, 345.1, 343.66, 346.5, 347.13, 348.75, 345.7, 346.92, 349.17, 350.8, 349.78, 348.55, 351.81, 355.08, 358.55, 359.36, 361.2, 364.26],
    volume: "29.4M",
    marketCap: "4.56T $",
    low24h: 357.31,
    high24h: 372.06,
    description: "Alphabet est la société mère de Google, moteur de recherche mondial, plateforme de diffusion vidéo YouTube, systèmes Android, services Cloud et projets d'innovation technologique majeurs.",
    news: [
      {
        id: "googl_news_1",
        title: "Intégration d'un modèle ultra-performant Gemini 1.5 Pro dans Google Workspace",
        summary: "Google améliore son offre Cloud d'entreprise avec des analyses de documents gigantesques allant jusqu'à 2 millions de tokens d'un coup. Les retours premiums clients témoignent d'un niveau d'automatisation interne historique.",
        source: "Silicon Valley Echo",
        timestamp: "Il y a 5 heures",
        sentiment: "positive"
      },
      {
        id: "googl_news_2",
        title: "Recherche en IA : Expériences d'annonces publicitaires novatrices intégrées au chatbot",
        summary: "Le groupe de Mountain View explore de nouveaux formats publicitaires au cœur des réponses génératives de Google SGE afin d'optimiser la monétisation et la protection des parts de marché face à la concurrence des moteurs alternatifs.",
        source: "AdTech Insights",
        timestamp: "Hier",
        sentiment: "neutral"
      },
      {
        id: "googl_news_3",
        title: "Pression accrue des instances antitrust du Département de la Justice américain (DOJ)",
        summary: "La procédure réglementaire antitrust fédérale se poursuit pour évaluer si les accords de distribution d'Alphabet pour placer Google en moteur par défaut violent la législation sur la libre concurrence.",
        source: "Legal Ledger",
        timestamp: "Il y a 4 jours",
        sentiment: "negative"
      }
    ]
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 244.19,
    change: -0.42,
    history: [230.34, 231.98, 234.6, 233.78, 235.83, 237.35, 235.14, 236.93, 238.71, 237.89, 237.07, 238.86, 240.64, 239.81, 238.3, 240.1, 242.42, 241.18, 239.69, 241.6, 243.39, 242.57, 241.05, 242.84, 244.75, 242.57, 241.05, 242.97, 242.02, 244.19],
    volume: "40.8M",
    marketCap: "2.45T $",
    low24h: 240.40,
    high24h: 250.43,
    description: "Amazon est le leader mondial du commerce électronique, du cloud computing (AWS), de la diffusion en continu (Prime Video) et de l'intelligence artificielle.",
    news: [
      {
        id: "amzn_news_1",
        title: "AWS déploie de nouveaux processeurs maison Trainium 2 ultra performants",
        summary: "Amazon Web Services lance sa nouvelle génération de processeurs optimisés pour l'entraînement géant de LLM, offrant une alternative économiquement viable et résistant mieux aux tensions d'approvisionnement des composants tiers.",
        source: "Infrastructure Weekly",
        timestamp: "Il y a 10 heures",
        sentiment: "positive"
      },
      {
        id: "amzn_news_2",
        title: "Optimisation de la logistique du 'Dernier Kilomètre' : Gains opérationnels de 12%",
        summary: "Grâce au maillage poussé de ses nouveaux centres de distribution régionaux, Amazon parvient à réduire drastiquement ses délais de livraison moyens tout en diminuant ses charges de fret direct d'une ampleur inattendue.",
        source: "E-Commerce Dispatch",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "amzn_news_3",
        title: "Slight squeeze on retail segment margins outside North America due to regional costs",
        summary: "La hausse des prix des carburants dans plusieurs métropoles étrangères et l'investissement promotionnel accru face aux discounters de livraison directe engendrent une légère baisse temporaire des marges d'export.",
        source: "Retail Quarterly",
        timestamp: "Il y a 5 jours",
        sentiment: "negative"
      }
    ]
  },
  {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 81.41,
    change: -1.49,
    history: [78.67, 79.01, 79.34, 79.77, 80.29, 80.74, 80.44, 80.65, 81.09, 81.54, 81.33, 81.01, 81.37, 81.81, 81.61, 81.94, 82.17, 81.86, 81.58, 81.9, 82.34, 82.01, 81.71, 82.02, 82.47, 81.99, 81.58, 81.81, 81.1, 81.41],
    volume: "34.0M",
    marketCap: "248.5B $",
    low24h: 81.34,
    high24h: 82.34,
    description: "Netflix fournit des services de divertissement de diffusion de flux média (streaming) de séries, films, animés et documentaires originaux.",
    news: [
      {
        id: "nflx_news_1",
        title: "Nouveau record d'audiences historiques pour la série d'anticipation majeure",
        summary: "Netflix enregistre des taux de complétion de visionnage extrêmement élevés sur sa nouvelle superproduction, justifiant sa stratégie d'investissement fort dans des projets d'envergure globalisés.",
        source: "Media Watch",
        timestamp: "Il y a 6 heures",
        sentiment: "positive"
      },
      {
        id: "nflx_news_2",
        title: "Campagne contre le partage des comptes : 10 millions de nouveaux profils convertis",
        summary: "La politique payante de partage des comptes s'avère payante avec un report de conversion spectaculaire d'utilisateurs passifs vers des offres d'abonnements solo profitant de publicités.",
        source: "Wall Street Daily",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "nflx_news_3",
        title: "Abonnement Standard en hausse de 1€/mois dans certains marchés européens",
        summary: "Netflix introduit une légère révision tarifaire ciblée pour soutenir sa transition vers l'offre de retransmissions de sports en direct. Les analystes surveillent la réaction de fidélisation du parc existant.",
        source: "Courrier Financier",
        timestamp: "Il y a 3 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "COIN",
    name: "Coinbase Global, Inc.",
    price: 155.50,
    change: -4.08,
    history: [126.81, 128.86, 131.62, 127.52, 129.89, 133.54, 137.77, 135.08, 137.38, 142.25, 139.63, 143.79, 148.08, 146.03, 144.43, 146.73, 151.02, 149.36, 146.03, 148.27, 152.95, 154.36, 151.48, 153.15, 157.89, 155.0, 152.95, 156.34, 153.4, 155.50],
    volume: "8.7M",
    marketCap: "40.2B $",
    low24h: 149.90,
    high24h: 164.98,
    description: "Coinbase fournit une infrastructure financière et technologique pour l'économie des crypto-actifs et de la blockchain dans le monde entier.",
    news: [
      {
        id: "coin_news_1",
        title: "Les volumes de négociation institutionnels s'envolent de 145% au T1",
        summary: "La plateforme bénéficie pleinement de l'afflux des investisseurs institutionnels canalisé par les lancements récents d'ETFs Bitcoin physiques. Les revenus de garde d'actifs et de frais de courtage grimpent en flèche.",
        source: "Crypto Bull",
        timestamp: "Il y a 12 heures",
        sentiment: "positive"
      },
      {
        id: "coin_news_2",
        title: "Obtention officielle d'une licence restreinte d'enregistrement au Canada",
        summary: "Dans le cadre de son offensive d'expansion internationale, Coinbase sécurise une position solide vis-à-vis des juridictions nord-américaines en respectant intégralement les exigences prudentielles canadiennes.",
        source: "RegTech Alert",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "coin_news_3",
        title: "Le bras de fer réglementaire se poursuit activement contre la SEC",
        summary: "L'autorité fédérale américaine maintient formellement son action civile contre la nature de certains protocoles de staking intégrés à Coinbase, une procédure de longue haleine suivie de très près par les juristes du milieu.",
        source: "Legal Ledger",
        timestamp: "Il y a 6 jours",
        sentiment: "negative"
      }
    ]
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 584.59,
    change: -0.14,
    history: [541.06, 544.13, 547.34, 543.4, 548.43, 552.37, 555.94, 553.96, 558.03, 560.99, 559.51, 563.32, 567.14, 565.05, 569.1, 571.93, 575.74, 573.03, 569.95, 572.04, 575.61, 578.56, 575.36, 576.96, 580.53, 583.48, 580.4, 582.25, 578.92, 584.59],
    volume: "16.5M",
    marketCap: "1.49T $",
    low24h: 581.01,
    high24h: 597.63,
    description: "Meta Platforms conçoit des technologies qui aident les gens à se connecter, à trouver des communautés et à développer des entreprises à travers Facebook, Instagram, Messenger et WhatsApp.",
    news: [
      {
        id: "meta_news_1",
        title: "Llama 4 repousse les limites mondiales des LLMs en open-source",
        summary: "Meta a annoncé le lancement anticipé de son nouveau modèle d'IA générative de pointe Llama 4, offrant des vitesses d'exécution exceptionnelles à une fraction du coût d'infrastructure des leaders du marché.",
        source: "AI Tech Report",
        timestamp: "Il y a 5 heures",
        sentiment: "positive"
      },
      {
        id: "meta_news_2",
        title: "Croissance record des revenus publicitaires au format Reels",
        summary: "L'optimisation des algorithmes de recommandation vidéo courte stimule l'engagement des utilisateurs de plus de 25% cette année, générant des retours sur investissement exceptionnels pour les annonceurs mondiaux.",
        source: "AdTech Globe",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "meta_news_3",
        title: "Le Congrès américain examine un projet de loi restrictif sur la protection des mineurs",
        summary: "Les nouvelles auditions du Sénat américain concernant l'impact psychosocial des algorithmes de rétention de contenus créent des vagues de prudence légères chez certains gestionnaires d'actifs.",
        source: "Washington Policy",
        timestamp: "Il y a 4 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    price: 475.50,
    change: -3.02,
    history: [433.8, 439.5, 435.31, 432.18, 435.19, 429.39, 425.92, 429.17, 433.47, 430.12, 424.81, 427.79, 431.19, 429.16, 424.63, 426.83, 430.63, 427.78, 422.38, 424.58, 429.38, 426.24, 422.01, 424.08, 426.98, 422.78, 418.99, 421.43, 414.28, 475.50],
    volume: "37.1M",
    marketCap: "780.2B $",
    low24h: 437.23,
    high24h: 504.56,
    description: "AMD est une entreprise mondiale de semi-conducteurs qui conçoit des processeurs informatiques et graphiques hautes performances (Ryzen, Radeon, EPYC) pour les ordinateurs, les consoles de jeux et les centres de données.",
    news: [
      {
        id: "amd_news_1",
        title: "Les puces d'IA Instinct MI325X reçoivent un accueil chaleureux chez Azure et Oracle",
        summary: "AMD progresse plus vite que prévu sur le marché des accélérateurs d'intelligence artificielle professionnels, de grands clients cloud affirmant avoir trouvé une vraie alternative solide et moins chère.",
        source: "Chipmaker Weekly",
        timestamp: "Il y a 3 heures",
        sentiment: "positive"
      },
      {
        id: "amd_news_2",
        title: "Ralentissement sectoriel modéré des ventes de processeurs pour ordinateurs portables",
        summary: "Un cycle d'équipement temporairement saturé en Asie induit une correction de court terme sur la demande globale de hardware grand public, pesant à la marge sur les ventes de fin de trimestre.",
        source: "Hardware Insider",
        timestamp: "Hier",
        sentiment: "negative"
      },
      {
        id: "amd_news_3",
        title: "Nouveau contrat majeur signé pour la fourniture des processeurs de la prochaine PlayStation",
        summary: "AMD sécurise son hégémonie technologique dans le secteur des consoles de salon grâce à un nouvel accord de exclusivité à long terme conclu avec Sony pour équiper sa future architecture matérielle.",
        source: "Gaming Tech",
        timestamp: "Il y a 5 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "DIS",
    name: "The Walt Disney Company",
    price: 99.33,
    change: 0.47,
    history: [92.65, 93.72, 93.36, 94.5, 93.98, 95.3, 96.37, 96.01, 97.16, 96.63, 96.1, 97.25, 98.4, 97.86, 97.34, 98.48, 99.54, 98.74, 98.22, 99.28, 100.42, 99.81, 99.28, 98.74, 98.13, 99.28, 99.81, 98.83, 98.66, 99.33],
    volume: "8.6M",
    marketCap: "201.2B $",
    low24h: 98.51,
    high24h: 100.09,
    description: "Disney est un géant mondial du divertissement et des médias, exploitant des studios de cinéma célèbres, des parcs à thèmes d'envergure internationale, des réseaux de télévision et le service de streaming Disney+.",
    news: [
      {
        id: "dis_news_1",
        title: "La branche streaming Disney+ atteint enfin une rentabilité historique et durable",
        summary: "Grâce à une restructuration fine des coûts de production artistiques et une réévaluation réussie des prix de l'abonnement, l'activité de retransmission directe dégage des flux de trésorerie positifs.",
        source: "Media Biz",
        timestamp: "Il y a 6 heures",
        sentiment: "positive"
      },
      {
        id: "dis_news_2",
        title: "Fréquentation stable mais dépenses moyennes en forte hausse dans les parcs floridiens",
        summary: "Les nouveaux forfaits premium numériques 'Lightning Lane' compensent largement le léger recul de volume de visiteurs absolu, illustrant la solide capacité de tarification discrétionnaire du groupe.",
        source: "Le Journal des Parcs",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "dis_news_3",
        title: "Le conseil d'administration affine discrètement le plan de succession du PDG Bob Iger",
        summary: "Un comité spécial indépendant a été mandaté pour identifier et valider en amont le futur profil de dirigeant d'ici 2026, rassurant les actionnaires institutionnels sur la continuité opérationnelle future.",
        source: "Wall Street Daily",
        timestamp: "Il y a 3 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "ASML",
    name: "ASML Holding N.V.",
    price: 1777.77,
    change: 1.64,
    history: [1627.79, 1637.75, 1650.96, 1644.85, 1656.52, 1670.32, 1681.6, 1674.72, 1690.62, 1703.46, 1694.83, 1708.43, 1720.1, 1713.03, 1687.59, 1709.61, 1722.18, 1714.09, 1705.8, 1718.72, 1730.58, 1736.98, 1728.51, 1733.97, 1741.89, 1748.29, 1736.04, 1740.75, 1733.78, 1777.77],
    volume: "3.1M",
    marketCap: "726.8B $",
    low24h: 1676.51,
    high24h: 1830.99,
    description: "ASML est le plus grand fournisseur mondial de systèmes de photolithographie pour l'industrie des semi-conducteurs. Basée aux Pays-Bas, l'entreprise fabrique les puces de pointe exclusives requises par TSMC, Intel et Samsung.",
    news: [
      {
        id: "asml_news_1",
        title: "Livraison réussie de la première machine High-NA EUV ultra-précise à Intel",
        summary: "Le nouveau sytème de lithographie de pointe de près de 350 millions de dollars va permettre de graver des transistors avec une finesse géométrique encore jamais approchée, affirmant son hégémonie technologique unique.",
        source: "Semi-Weekly Journal",
        timestamp: "Il y a 8 heures",
        sentiment: "positive"
      },
      {
        id: "asml_news_2",
        title: "Nouveau record historique du carnet de commandes industrielles au T1",
        summary: "La demande insatiable pour les fonderies européennes et japonaises pousse les investissements d'équipement à des sommets, assurant des revenus solides pour les cinq prochaines vagues industrielles de production.",
        source: "Amsterdam Financier",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "asml_news_3",
        title: "Tensions géopolitiques persistantes sur les restrictions d'exportation vers la Chine",
        summary: "Les directives de contrôle gouvernementales néerlandaises et américaines empêchent la vente de certaines machines DUV plus anciennes au marché asiatique, une situation toutefois déjà largement anticipée dans les prévisions annuelles.",
        source: "Global Trade Watch",
        timestamp: "Il y a 6 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 325.05,
    change: 1.68,
    history: [306.87, 308.28, 309.81, 308.99, 310.52, 312.17, 314.06, 313.0, 315.12, 316.9, 316.07, 317.6, 320.09, 318.66, 318.08, 319.61, 321.62, 320.91, 319.61, 320.44, 322.45, 322.09, 320.44, 321.97, 323.98, 323.27, 321.97, 323.51, 322.8, 325.05],
    volume: "4.6M",
    marketCap: "662.4B $",
    low24h: 317.00,
    high24h: 325.49,
    description: "Visa est une entreprise multinationale américaine de services financiers facilitant les transferts de fonds électroniques dans le monde entier, principalement par le biais de cartes de crédit, de débit et de cartes prépayées.",
    news: [
      {
        id: "visa_news_1",
        title: "Les dépenses mondiales de paiement transfrontalier grimpent de 14%",
        summary: "Le retour massif du tourisme international d'affaires et de loisir soutient les volumes de transaction hautement rentables de Visa, compensant largement la modération de l'inflation domestique.",
        source: "Global Payments View",
        timestamp: "Il y a 10 heures",
        sentiment: "positive"
      },
      {
        id: "visa_news_2",
        title: "Lancement pilote d'autorisations de paiement biométriques par IA",
        summary: "Visa déploie une technologie d'intelligence artificielle avancée capable de valider des paiements via scan facial de manière ultra-sécurisée et sans friction matérielle, déjà implémentée dans de grands stades partenaires.",
        source: "Fintech Horizon",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "visa_news_3",
        title: "Progrès et négociations d'un règlement d'une action collective sur les frais de réseau",
        summary: "Les discussions de long terme avec les groupements de commerçants américains concernant les frais de transaction 'interchange' progressent vers un accord multilatéral sans impact disruptif sur les bénéfices.",
        source: "Courrier Financier",
        timestamp: "Il y a 4 jours",
        sentiment: "neutral"
      }
    ]
  },
  {
    symbol: "LLY",
    name: "Eli Lilly and Company",
    price: 1144.68,
    history: [1020.61, 1028.64, 1038.27, 1033.61, 1042.48, 1052.98, 1061.58, 1056.34, 1068.43, 1078.21, 1071.65, 1081.99, 1090.9, 1085.51, 1096.59, 1105.91, 1115.69, 1109.42, 1102.99, 1112.19, 1121.37, 1126.32, 1119.76, 1123.99, 1130.1, 1135.07, 1125.6, 1129.25, 1123.85, 1144.68],
    change: -0.39,
    volume: "3.7M",
    marketCap: "1.04T $",
    low24h: 1137.75,
    high24h: 1174.60,
    description: "Eli Lilly est un grand laboratoire pharmaceutique américain de premier plan, réputé pour ses traitements innovants en oncologie, immunologie, neurosciences et surtout pour ses thérapies révolutionnaires contre l'obésité.",
    news: [
      {
        id: "lly_news_1",
        title: "Approbation étendue d'un traitement d'obésité majeur Mounjaro dans de nouveaux marchés de l'UE",
        summary: "Le médicament phare de perte de poids obtient des autorisations de remboursement stratégiques majeures, ouvrant d'immenses opportunités commerciales de croissance organique à marge opérationnelle élevée.",
        source: "Pharma News",
        timestamp: "Il y a 4 heures",
        sentiment: "positive"
      },
      {
        id: "lly_news_2",
        title: "Construction accélérée d'une usine géante de 5 milliards $ en Rhénanie",
        summary: "Pour pallier les blocages physiques récurrents de stocks face à une demande véritablement phénoménale, le géant médical augmente drastiquement sa capacité d'approvisionnement en Europe centrale.",
        source: "Euro BioTech Weekly",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "lly_news_3",
        title: "Essais cliniques de Phase III prometteurs d'un candidat-médicament contre Alzheimer",
        summary: "Les premières mesures d'efficacité moléculaire montrent un ralentissement sensible du déclin cognitif léger chez les patients traités de manière précoce, ouvrant la voie à un dépôt de dossier prochain auprès de la FDA.",
        source: "Medical Journal",
        timestamp: "Il y a 5 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "MC",
    name: "LVMH",
    price: 492.30,
    change: 2.04,
    history: [509.71, 508.78, 506.6, 504.86, 500.45, 502.56, 498.65, 500.26, 496.1, 498.21, 497.22, 495.72, 498.58, 501.32, 499.14, 496.78, 498.21, 496.6, 494.67, 496.16, 498.21, 494.8, 492.81, 494.23, 496.35, 494.11, 492.18, 493.24, 489.95, 492.3],
    volume: "0.5M",
    marketCap: "260.5B $",
    low24h: 479.95,
    high24h: 496.30,
    description: "LVMH Moët Hennessy Louis Vuitton SE est le leader mondial absolu de l'industrie du luxe, contrôlant un portefeuille unique de plus de 75 marques prestigieuses dont Louis Vuitton, Christian Dior, Hennessy, Moët & Chandon, Bulgari et Tiffany & Co.",
    news: [
      {
        id: "lvmh_news_1",
        title: "Grand défilé haute couture exceptionnel à Venise couronné d'un immense succès médiatique",
        summary: "LVMH confirme son hégémonie dans l'industrie créative à travers des événements mondiaux ultra-exclusifs qui augmentent durablement la désirabilité déjà suprême de sa marque étendard Louis Vuitton auprès des ultra-riches.",
        source: "Prestige Daily",
        timestamp: "Il y a 12 heures",
        sentiment: "positive"
      },
      {
        id: "lvmh_news_2",
        title: "Léger ralentissement de la consommation de haute joaillerie en Asie de l'Est",
        summary: "Une réorientation conjoncturelle temporaire de l'épargne des classes aisées chinoises vers des placements refuges limite le taux de croissance organique du pôle Montres & Joaillerie sur ce trimestre précis.",
        source: "La Bourse de Paris",
        timestamp: "Hier",
        sentiment: "negative"
      },
      {
        id: "lvmh_news_3",
        title: "Solide résilience des ventes sur le segment Mode & Maroquinerie aux États-Unis",
        summary: "LVMH s'appuie sur la fidélité inégalée de ses clients aisés nord-américains pour enregistrer d'excellents scores de ventes, stabilisant parfaitement la croissance face aux fluctuations macroéconomiques.",
        source: "Wall Street Daily",
        timestamp: "Il y a 6 jours",
        sentiment: "positive"
      }
    ]
  },
  {
    symbol: "OR.PA",
    name: "L'Oréal",
    price: 384.55,
    change: 1.61,
    history: [375.01, 376.10, 375.74, 376.91, 376.37, 377.72, 378.81, 378.44, 379.62, 379.08, 378.53, 379.71, 380.89, 380.34, 379.8, 380.97, 382.06, 381.24, 380.7, 381.79, 382.95, 382.32, 381.79, 381.24, 380.61, 381.79, 382.32, 381.33, 381.16, 384.55],
    volume: "0.3M",
    marketCap: "216.5B $",
    low24h: 376.10,
    high24h: 386.55,
    description: "L'Oréal S.A. est le premier groupe cosmétique mondial. Présent dans plus de 150 pays, il conçoit des produits d'hygiène, de beauté, de soins de la peau, de maquillage et de parfumerie d'une renommée indiscutable (L'Oréal Paris, Lancôme, Garnier, Maybelline).",
    news: [
      {
        id: "loreal_news_1",
        title: "Spectaculaire dynamique de croissance des ventes en Amérique du Nord",
        summary: "L'Oréal génère des gains de parts de marché massifs dans la catégorie Beauté Dermatologique grâce au succès foudroyant de sa marque phare CeraVe et de ses innovations anti-âge exclusives.",
        source: "Le Figaro Économie",
        timestamp: "Il y a 7 heures",
        sentiment: "positive"
      },
      {
        id: "loreal_news_2",
        title: "Partenariat exclusif de recherche dermatologique signé avec une grande start-up française de bio-ingénierie",
        summary: "L'Oréal investit en amont de manière stratégique dans des systèmes innovants de modélisation de cellules cutanées vivantes en 3D pour optimiser l'efficacité prédictive de ses futurs sérums thérapeutiques haut de gamme.",
        source: "Paris Biotech",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: "loreal_news_3",
        title: "Coûts de transport aérien momentanément supérieurs à la moyenne en zone Pacifique",
        summary: "Les perturbations mineures logistiques sur quelques routes d'exportation d'Europe se traduisent par un très léger surcoût résorbable d'acheminement, neutre sur les perspectives globales bénéficiaires de l'exercice.",
        source: "Supply Chain Digest",
        timestamp: "Il y a 4 jours",
        sentiment: "neutral"
      }
    ]
  }
];

// 34 Additional high-profile stocks to bring the total to 50
const ADDITIONAL_STOCKS_DEFS = [
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 195.40,
    change: 0.85,
    volume: "9.2M",
    marketCap: "560.1B $",
    low24h: 192.50,
    high24h: 197.80,
    description: "JPMorgan Chase is a leading global financial services firm and one of the largest banking institutions in the United States, managing trillions of dollars in assets globally."
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 67.50,
    change: -0.42,
    volume: "11.1M",
    marketCap: "542.4B $",
    low24h: 66.80,
    high24h: 68.20,
    description: "Walmart is a multinational retail corporation that operates a giant chain of hypermarkets, discount department stores, and grocery stores offering everyday low prices."
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 148.20,
    change: -0.15,
    volume: "6.8M",
    marketCap: "356.7B $",
    low24h: 146.90,
    high24h: 149.50,
    description: "Johnson & Johnson is a leading global healthcare company that researches, develops, and manufactures medical devices, pharmaceutical therapies, and consumer health products."
  },
  {
    symbol: "PG",
    name: "Procter & Gamble Company",
    price: 162.80,
    change: 0.35,
    volume: "5.4M",
    marketCap: "382.1B $",
    low24h: 161.20,
    high24h: 164.10,
    description: "Procter & Gamble is a global leader in consumer packaged goods, managing iconic brands in baby, feminine, family, beauty, grooming, and oral care."
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    price: 115.30,
    change: 1.12,
    volume: "12.4M",
    marketCap: "458.9B $",
    low24h: 113.10,
    high24h: 116.80,
    description: "ExxonMobil is one of the world's largest publicly traded international energy and chemical giants, developing oil, natural gas, petro-chemicals, and low-carbon technologies."
  },
  {
    symbol: "COST",
    name: "Costco Wholesale Corporation",
    price: 820.60,
    change: -1.05,
    volume: "1.8M",
    marketCap: "364.5B $",
    low24h: 811.20,
    high24h: 828.90,
    description: "Costco operates an incredibly popular, membership-only warehouse club model, offering high-quality bulk merchandise at exceptionally low operating markups."
  },
  {
    symbol: "MA",
    name: "Mastercard Incorporated",
    price: 450.40,
    change: 0.72,
    volume: "2.8M",
    marketCap: "418.2B $",
    low24h: 444.10,
    high24h: 454.90,
    description: "Mastercard is a global payments technology leader, enabling convenient electronic payments, digital transfers, and payment processing services across 210 countries."
  },
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: 530.15,
    change: -2.31,
    volume: "2.4M",
    marketCap: "238.6B $",
    low24h: 518.50,
    high24h: 542.10,
    description: "Adobe is a global leader in digital media and digital marketing solutions. Its Creative Cloud suite includes industry standards like Photoshop, Premiere, and Illustrator."
  },
  {
    symbol: "CRM",
    name: "Salesforce, Inc.",
    price: 285.40,
    change: -1.25,
    volume: "4.1M",
    marketCap: "276.5B $",
    low24h: 281.20,
    high24h: 290.40,
    description: "Salesforce is the global CRM pioneer, providing cloud-based enterprise applications focused on customer service, marketing automation, analytics, and app development."
  },
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 155.60,
    change: 0.95,
    volume: "7.1M",
    marketCap: "288.4B $",
    low24h: 153.20,
    high24h: 157.80,
    description: "Chevron is an integrated energy company engaged in global operations including oil exploration, refining, power generation, chemical manufacturing, and renewable fuels."
  },
  {
    symbol: "BAC",
    name: "Bank of America Corporation",
    price: 38.20,
    change: 0.65,
    volume: "35.2M",
    marketCap: "298.5B $",
    low24h: 37.60,
    high24h: 38.90,
    description: "Bank of America is a premier multinational investment bank and financial services company, serving individuals, commercial entities, and global corporations."
  },
  {
    symbol: "PEP",
    name: "PepsiCo, Inc.",
    price: 168.50,
    change: -0.35,
    volume: "4.2M",
    marketCap: "231.4B $",
    low24h: 166.80,
    high24h: 170.20,
    description: "PepsiCo is a global food and beverage giant, managing consumer brands such as Lay's, Doritos, Gatorade, Pepsi-Cola, Mountain Dew, Quaker, and SodaStream."
  },
  {
    symbol: "KO",
    name: "The Coca-Cola Company",
    price: 62.40,
    change: 0.15,
    volume: "10.8M",
    marketCap: "269.8B $",
    low24h: 61.90,
    high24h: 63.10,
    description: "The Coca-Cola Company is the world's largest nonalcoholic beverage manufacturer, marketer, and distributor, selling syrups, concentrates, and sparkling refreshments."
  },
  {
    symbol: "MRK",
    name: "Merck & Co., Inc.",
    price: 122.10,
    change: 0.45,
    volume: "5.8M",
    marketCap: "309.5B $",
    low24h: 120.90,
    high24h: 123.40,
    description: "Merck is a leading global biopharmaceutical company offering innovative health solutions through prescription medicines, biologic therapies, oncology, and vaccines."
  },
  {
    symbol: "TSM",
    name: "Taiwan Semiconductor Manufacturing Company",
    price: 172.50,
    change: 2.15,
    volume: "14.2M",
    marketCap: "894.2B $",
    low24h: 168.90,
    high24h: 175.40,
    description: "TSMC is the absolute pioneer and largest global independent semiconductor foundry, manufacturing high-performance microchips for major tech leaders like Apple and Nvidia."
  },
  {
    symbol: "AVGO",
    name: "Broadcom Inc.",
    price: 1420.50,
    change: 1.85,
    volume: "2.1M",
    marketCap: "661.8B $",
    low24h: 1395.00,
    high24h: 1438.00,
    description: "Broadcom is a global technology leader that designs, develops, and supplies custom microprocessors and infrastructure software solutions for network routing and cloud centers."
  },
  {
    symbol: "QCOM",
    name: "Qualcomm Incorporated",
    price: 215.10,
    change: -1.05,
    volume: "5.8M",
    marketCap: "240.2B $",
    low24h: 211.50,
    high24h: 219.00,
    description: "Qualcomm is a central pioneer in wireless communications, designing foundational mobile tech, cellular standards, and the Snapdragon family of mobile application processors."
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation",
    price: 125.80,
    change: 0.25,
    volume: "6.4M",
    marketCap: "346.5B $",
    low24h: 124.20,
    high24h: 127.50,
    description: "Oracle is a global enterprise software and cloud services pioneer, providing database systems, business applications (such as NetSuite), and high-performance cloud hosting (OCI)."
  },
  {
    symbol: "NKE",
    name: "Nike, Inc.",
    price: 95.30,
    change: -1.75,
    volume: "6.1M",
    marketCap: "141.2B $",
    low24h: 93.80,
    high24h: 97.20,
    description: "Nike is the undisputed world leader in athletic footwear, activewear, apparel, and premium sports equipment, operating dynamic global consumer retail stores."
  },
  {
    symbol: "MCD",
    name: "McDonald's Corporation",
    price: 260.40,
    change: 0.12,
    volume: "2.9M",
    marketCap: "188.4B $",
    low24h: 258.10,
    high24h: 263.20,
    description: "McDonald's is the world's premier fast-food franchise chain, serving millions of handcrafted meals daily across over 100 countries and ultra-efficient locations."
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    price: 30.15,
    change: -1.95,
    volume: "28.5M",
    marketCap: "128.5B $",
    low24h: 29.50,
    high24h: 31.20,
    description: "Intel is a core semiconductor pioneer, designing, manufacturing, and supplying microprocessors and logic components for the world's cloud computing and PC industry."
  },
  {
    symbol: "IBM",
    name: "International Business Machines Corporation",
    price: 171.20,
    change: 0.55,
    volume: "3.7M",
    marketCap: "156.4B $",
    low24h: 169.10,
    high24h: 173.20,
    description: "IBM provides global hybrid cloud, cognitive enterprise Artificial Intelligence (WatsonX), consulting, and robust mainframe infrastructure services for global industries."
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems, Inc.",
    price: 48.50,
    change: -0.32,
    volume: "11.2M",
    marketCap: "196.2B $",
    low24h: 47.90,
    high24h: 49.30,
    description: "Cisco is the worldwide internet networking leader, designing hardware routing switchboards, cybersecurity systems, and comprehensive cloud collaboration suites."
  },
  {
    symbol: "GE",
    name: "General Electric Company",
    price: 165.20,
    change: 1.04,
    volume: "4.8M",
    marketCap: "180.1B $",
    low24h: 162.80,
    high24h: 168.20,
    description: "GE operates as a highly advanced global industrial company, specializing in gas turbines, commercial aviation jet propulsion (GE Aerospace), and wind renewable energies."
  },
  {
    symbol: "SBUX",
    name: "Starbucks Corporation",
    price: 82.40,
    change: -0.85,
    volume: "5.1M",
    marketCap: "93.4B $",
    low24h: 81.10,
    high24h: 83.90,
    description: "Starbucks is the premier roaster, marketer, and high-quality specialty coffee house retailer, managing thousands of comfortable premium cafes around the globe."
  },
  {
    symbol: "TTE.PA",
    name: "TotalEnergies SE",
    price: 62.80,
    change: 0.64,
    volume: "1.4M",
    marketCap: "150.2B $",
    low24h: 61.90,
    high24h: 63.80,
    description: "TotalEnergies est l'un des plus grands acteurs mondiaux du secteur de l'énergie. L'entreprise produit, raffine et distribue activement du gaz, du pétrole brut et des énergies renouvelables."
  },
  {
    symbol: "SAN.PA",
    name: "Sanofi",
    price: 88.50,
    change: 0.12,
    volume: "1.1M",
    marketCap: "110.4B $",
    low24h: 87.60,
    high24h: 89.40,
    description: "Sanofi est un leader biopharmaceutique mondial reconnu pour ses molécules innovantes en oncologie, ses traitements cardiovasculaires, ses vaccins à grande échelle et son immunologie."
  },
  {
    symbol: "AIR.PA",
    name: "Airbus SE",
    price: 145.20,
    change: -0.85,
    volume: "0.9M",
    marketCap: "115.6B $",
    low24h: 142.50,
    high24h: 147.80,
    description: "Airbus conçoit, fabrique et commercialise des avions commerciaux innovants, des systèmes de défense, des équipements spatiaux de pointe et des hélicoptères de secours dans le monde entier."
  },
  {
    symbol: "RMS.PA",
    name: "Hermès International",
    price: 1980.50,
    change: 1.15,
    volume: "0.1M",
    marketCap: "210.3B $",
    low24h: 1945.00,
    high24h: 2012.00,
    description: "Hermès conçoit et distribue des objets hautement désirables issus d'un artisanat d'art d'exception : maroquinerie (les mythiques sacs Birkin), carrés de soie exclusifs, sellerie et joaillerie."
  },
  {
    symbol: "BNP.PA",
    name: "BNP Paribas",
    price: 64.20,
    change: -1.04,
    volume: "1.8M",
    marketCap: "80.2B $",
    low24h: 63.15,
    high24h: 65.40,
    description: "BNP Paribas est l'un des premiers groupes bancaires européens. Il propose des solutions intégrées de banque de détail, d'investissement institutionnel et de crédit à la consommation sophistiqué."
  },
  {
    symbol: "CS.PA",
    name: "AXA SA",
    price: 32.40,
    change: 0.42,
    volume: "2.1M",
    marketCap: "72.4B $",
    low24h: 31.90,
    high24h: 32.95,
    description: "AXA est un géant mondial de l'assurance et de la gestion de fonds. Il commercialise des produits d'assurance dommages, de retraite, d'assurance prévoyance et des services bancaires d'épargne."
  },
  {
    symbol: "RNO.PA",
    name: "Renault SA",
    price: 48.30,
    change: -2.05,
    volume: "0.8M",
    marketCap: "14.2B $",
    low24h: 47.10,
    high24h: 49.80,
    description: "Le groupe Renault conçoit, industrialise et distribue des véhicules légers thermiques, hybrides de pointe et 100% électriques sous les marques Renault, Dacia et Alpine."
  },
  {
    symbol: "AIRF.PA",
    name: "Air France-KLM",
    price: 9.20,
    change: -1.45,
    volume: "2.4M",
    marketCap: "2.8B $",
    low24h: 8.95,
    high24h: 9.45,
    description: "Air France-KLM est un groupe d'aviation civile international assurant le transport commercial de passagers, le fret mondial de marchandises et la maintenance industrielle d'aéronefs."
  },
  {
    symbol: "ENGI.PA",
    name: "Engie SA",
    price: 14.85,
    change: 0.35,
    volume: "2.2M",
    marketCap: "36.2B $",
    low24h: 14.60,
    high24h: 15.05,
    description: "Engie est un énergéticien majeur impliqué dans la décarbonation industrielle de l'énergie thermique, le transport de gaz, l'hydrogène propre, et la construction active d'infrastructures solaires."
  }
];

function generateHistory(price: number, percentChange: number): number[] {
  const result: number[] = new Array(30);
  result[29] = price;
  let running = price;
  for (let i = 28; i >= 0; i--) {
    const sinFactor = Math.sin(i * 0.5) * 0.012;
    const drift = 0.001;
    const change = (sinFactor + drift) * (1 - percentChange / 400);
    running = running / (1 + change);
    result[i] = parseFloat(running.toFixed(2));
  }
  return result;
}

function generateDefaultNews(symbol: string, name: string): any[] {
  const isFrench = symbol.endsWith(".PA") || symbol === "MC";
  if (isFrench) {
    return [
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_1`,
        title: `Perspectives prometteuses pour ${name} au second semestre`,
        summary: `Le groupe ${name} affiche une solidité remarquable face aux vents contraires de la macroéconomie mondiale. Les investisseurs saluent l'efficacité opérationnelle et la croissance organique s'accélère.`,
        source: "Les Échos",
        timestamp: "Il y a 3 heures",
        sentiment: "positive"
      },
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_2`,
        title: `${name} présente sa nouvelle stratégie bas-carbone et d'innovation`,
        summary: `La direction de ${name} détaille ses nouveaux engagements ESG et ses prochaines initiatives de R&D technologique, consolidant sa position éco-responsable de leader sectoriel.`,
        source: "L'Investisseur",
        timestamp: "Hier",
        sentiment: "positive"
      },
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_3`,
        title: `Légères tensions logistiques sans impact sur les résultats de ${name}`,
        summary: `En dépit des goulots d'étranglement temporaires dans les chaînes mondiales de distribution, les marges de ${name} restent parfaitement préservées par de solides politiques de couverture.`,
        source: "Boursorama",
        timestamp: "Il y a 4 jours",
        sentiment: "neutral"
      }
    ];
  } else {
    return [
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_1`,
        title: `Analysts raise price target for ${name} following stellar quarter`,
        summary: `Wall Street experts are increasingly bullish on ${name} as strong consumer demand and exceptional pipeline execution point to sustained secular growth in the quarters ahead.`,
        source: "MarketWatch",
        timestamp: "3 hours ago",
        sentiment: "positive"
      },
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_2`,
        title: `${name} unveils groundbreaking cloud and AI automation initiatives`,
        summary: `In a bid to expand its operational efficiency, ${name} announced a series of strategic technological partnerships aimed at streamlining corporate workflows and reducing enterprise infrastructure costs.`,
        source: "Bloomberg",
        timestamp: "Yesterday",
        sentiment: "positive"
      },
      {
        id: `${symbol.toLowerCase().replace(".", "_")}_news_3`,
        title: `Macroeconomic factors cause minor supply chain alignments for ${name}`,
        summary: `While local distribution adjustments continue globally, ${name}'s proactive financial hedging has largely insulated overall operating margins from severe near-term turbulence.`,
        source: "Reuters",
        timestamp: "4 days ago",
        sentiment: "neutral"
      }
    ];
  }
}

const ADDITIONAL_STOCKS: Stock[] = ADDITIONAL_STOCKS_DEFS.map((def) => ({
  ...def,
  history: generateHistory(def.price, def.change),
  news: generateDefaultNews(def.symbol, def.name)
}));

export const INITIAL_STOCKS: Stock[] = [
  ...STATIC_CORE_STOCKS,
  ...ADDITIONAL_STOCKS
];

// Duolingo-styled Modules
export const LESSON_MODULES: LessonModule[] = [
  {
    id: "mod1",
    title: "Niveau 1 : Les Fondations financières",
    description: "Désacralisez le fonctionnement de la bourse, du marché et l'origine des actions.",
    lessons: [
      {
        id: "l1_1",
        title: "Qu'est-ce qu'une action ?",
        description: "Comprenez comment vous possédez une petite partie d'une entreprise.",
        xpReward: 100,
        slides: [
          {
            title: "La part d'entreprise",
            text: "Une action est un titre de propriété représentant une fraction du capital d'une entreprise. Lorsque vous achetez une action (par exemple d'Apple ou de LVMH), vous devenez officiellement l'un de ses nombreux copropriétaires : un actionnaire.",
            bullets: [
              "Vous possédez une part proportionnelle du capital.",
              "Vous obtenez un droit de vote aux assemblées générales de l'entreprise.",
              "Vous avez droit à une part des bénéfices par le biais des dividendes."
            ],
            illustration: "company"
          },
          {
            title: "Pourquoi entrer en Bourse ? (IPO)",
            text: "L'introduction en bourse (IPO ou Initial Public Offering) est le processus par lequel une entreprise privée vend ses actions au public pour la première fois.",
            bullets: [
              "Le but principal est de lever des capitaux auprès du public pour financer sa croissance ou ses projets.",
              "Ces fonds permettent de financer la recherche, d'innover et de recruter.",
              "Elle offre une visibilité internationale sans contracter de lourde dette bancaire."
            ],
            illustration: "growth"
          },
          {
            title: "Qu'est-ce qu'un Dividende ?",
            text: "Un dividende est la part des bénéfices nets d'une entreprise qu'elle choisit de redistribuer périodiquement à ses investisseurs en signe de gratitude.",
            bullets: [
              "La totalité du chiffre d'affaires n'est jamais redistribuée, seulement une partie du bénéfice net restant.",
              "Il n'est pas obligatoire : une entreprise en phase de forte croissance préfèrera souvent réinvestir tous ses gains.",
              "C'est un excellent moyen de générer des revenus passifs réguliers."
            ],
            illustration: "dividend"
          }
        ],
        questions: [
          {
            id: "q_1_1",
            text: "Qu'achetez-vous réellement lorsque vous acquérez une 'action' en bourse ?",
            options: [
              "Une part de propriété dans l'entreprise, vous donnant droit à des dividendes potentiels.",
              "Un produit physique fabriqué directement par l'entreprise.",
              "Un contrat publicitaire vous garantissant l'accès à leurs bureaux.",
              "Un prêt que l'entreprise doit obligatoirement vous rembourser le mois suivant."
            ],
            correctAnswerIndex: 0,
            explanation: "Une action représente une part du capital d'une entreprise. En devenant actionnaire, vous devenez copropriétaire de l'entreprise au prorata de vos actions."
          },
          {
            id: "q_1_2",
            text: "Quel est l'intérêt principal pour une entreprise de s'introduire en bourse (IPO) ?",
            options: [
              "Éviter de payer de futurs impôts nationaux.",
              "Lever des capitaux auprès du public pour financer sa croissance ou ses projets.",
              "Offrir des cadeaux gratuits à tous les citoyens de la ville.",
              "Réduire son équipe de direction."
            ],
            correctAnswerIndex: 1,
            explanation: "En s'introduisant en bourse, une entreprise vend des fractions de son capital au public afin de récolter des fonds pour se développer et innover."
          },
          {
            id: "q_1_3",
            text: "Qu'est-ce qu'un 'dividende' ?",
            options: [
              "Une amende infligée par la loi si l'action baisse.",
              "Une taxe prélevée par la banque.",
              "La redistribution d'une partie des bénéfices de l'entreprise à ses actionnaires.",
              "La totalité du chiffre d'affaires d'une entreprise."
            ],
            correctAnswerIndex: 2,
            explanation: "Le dividende est la part du bénéfice net d'une entreprise redistribuée périodiquement (souvent chaque trimestre ou année) à ses investisseurs fidèles."
          },
          {
            id: "q_1_4",
            text: "Que se passe-t-il si une entreprise dans laquelle vous possédez des actions fait faillite ?",
            options: [
              "La banque vous oblige à payer toutes les dettes de l'entreprise avec vos biens personnels.",
              "Vous risquez de perdre au maximum la somme que vous avez investie pour acquérir ces actions.",
              "L'État vous rembourse obligatoirement la valeur initiale de vos actions.",
              "Vos actions sont automatiquement échangées contre des lingots d'or."
            ],
            correctAnswerIndex: 1,
            explanation: "La responsabilité de l'actionnaire est limitée à son investissement initial. Si la valeur tombe à zéro, vous perdez votre mise, mais personne ne peut saisir vos biens privés."
          }
        ]
      },
      {
        id: "l1_2",
        title: "La loi de l'offre et de la demande",
        description: "Découvrez pourquoi les prix montent et descendent continuellement.",
        xpReward: 150,
        slides: [
          {
            title: "La Loi de l'Offre et de la Demande",
            text: "Le prix d'une action n'est pas fixe. Il fluctue en continu en fonction de la confrontation des acheteurs et des vendeurs sur le marché.",
            bullets: [
              "La Demande représente la volonté d'acheter.",
              "L'Offre représente la volonté de vendre.",
              "Si beaucoup d'investisseurs souhaitent s'arracher une action (forte demande) mais que personne ne veut la vendre (faible offre), le cours va augmenter considérablement."
            ],
            illustration: "balance"
          },
          {
            title: "Les Facteurs d'Influence",
            text: "Qu'est-ce qui pousse à acheter ou vendre une action ? Principalement la confiance et les prévisions d'avenir d'une entreprise.",
            bullets: [
              "Une hausse inattendue des bénéfices nets booste la demande et fait monter le prix.",
              "De mauvaises prévisions économiques ou une crise sectorielle sapent la confiance des investisseurs.",
              "Une baisse de confiance fait s'effondrer la demande et pousser le cours de l'action vers le bas."
            ],
            illustration: "trend"
          }
        ],
        questions: [
          {
            id: "q_2_1",
            text: "Si beaucoup d'investisseurs souhaitent s'arracher une action mais que personne ne veut la vendre, que va faire son cours ?",
            options: [
              "Le cours va stagner instantanément à zéro.",
              "Le cours va augmenter considérablement.",
              "Le cours va chuter sous forme de krach.",
              "La bourse va interdire l'action définitivement."
            ],
            correctAnswerIndex: 1,
            explanation: "Quand la demande (les acheteurs) excède l'offre (les vendeurs), la concurrence fait grimper le prix d'équilibre de l'action."
          },
          {
            id: "q_2_2",
            text: "Quel facteur peut négativement influencer la demande pour une action en bourse ?",
            options: [
              "Une hausse spectaculaire et inattendue des bénéfices nets.",
              "De mauvaises prévisions économiques ou une crise sectorielle.",
              "Le recrutement d'innovateurs légendaires dans l'entreprise.",
              "L'annonce d'un nouveau brevet technologique."
            ],
            correctAnswerIndex: 1,
            explanation: "Les nouvelles négatives nuisent à la confiance des acheteurs, provoquant une baisse de la demande et un afflux de vendeurs, ce qui fait baisser les prix."
          },
          {
            id: "q_2_3",
            text: "Si une entreprise publie des résultats financiers très décevants (bénéfices inférieurs aux attentes du marché), qu'en découle-t-il ?",
            options: [
              "L'offre de vente s'effondre car tout le monde préfère attendre l'année prochaine.",
              "La demande baisse et l'offre de vente augmente, poussant le prix vers le bas.",
              "Le prix s'équilibre automatiquement à l'euro supérieur par solidarité nationale.",
              "L'action est automatiquement rachetée par les ministères publics."
            ],
            correctAnswerIndex: 1,
            explanation: "La déception financière érode la confiance des investisseurs. Moins de personnes veulent acheter (baisse de demande) et beaucoup veulent vendre (hausse d'offre), ce qui fait chuter le cours."
          },
          {
            id: "q_2_4",
            text: "Que représente le 'cours de clôture' d'une action ?",
            options: [
              "Le prix absolu de départ d'une entreprise lors de sa création.",
              "Le dernier prix d'échange enregistré juste avant l'arrêt de la séance de marché du jour.",
              "La moyenne des prix d'achat imposée par les banques partenaires.",
              "La valeur de l'action recalculée après l'impôt sur la fortune."
            ],
            correctAnswerIndex: 1,
            explanation: "Le cours de clôture est le dernier tarif négocié historiquement à la fin de la séance d'un jour ouvrable. C'est le prix de référence publié par la presse financière."
          }
        ]
      },
      {
        id: "l1_3",
        title: "Les indices nationaux et mondiaux",
        description: "Découvrez les thermomètres géants de l'économie mondiale.",
        xpReward: 180,
        slides: [
          {
            title: "Qu'est-ce qu'un Indice Boursier ?",
            text: "Un indice boursier regroupe les plus grandes entreprises d'un pays ou d'un secteur pour mesurer leur performance moyenne combinée.",
            bullets: [
              "Le CAC 40 réunit les 40 fleurons français (LVMH, Total, Sanofi...).",
              "La valeur de l'indice monte si la majorité de ces entreprises se portent bien.",
              "Il permet d'avoir une vision d'ensemble d'un pays en un coup d'œil."
            ],
            illustration: "globes"
          },
          {
            title: "Les indices phares mondiaux",
            text: "Chaque grande place financière possède son propre indice de référence incontournable.",
            bullets: [
              "Le S&P 500 et le Dow Jones représentent la puissance économique américaine.",
              "Le NASDAQ regroupe les géants technologiques mondiaux.",
              "Le Nikkei 225 mesure la santé économique japonaise."
            ],
            illustration: "growth_index"
          }
        ],
        questions: [
          {
            id: "q_1_3_1",
            text: "Qu'est-ce qu'un indice boursier comme le CAC 40 ?",
            options: [
              "Une taxe imposée sur l'achat et la vente d'actions.",
              "Un panier virtuel regroupant les plus grandes entreprises d'un pays pour mesurer leur performance collective.",
              "Une amende pour ralentir la spéculation internationale.",
              "Un diplôme universitaire d'économiste de haut niveau."
            ],
            correctAnswerIndex: 1,
            explanation: "Un indice boursier compile et pondère le cours des plus grandes entreprises représentatives d'une place financière nationale ou sectorielle afin de servir de baromètre d'ensemble."
          },
          {
            id: "q_1_3_2",
            text: "Quel indice boursier est célèbre pour regrouper les plus grands champions technologiques mondiaux ?",
            options: [
              "Le CAC 40",
              "Le NASDAQ",
              "Le Nikkei 225",
              "Le FTSE 100"
            ],
            correctAnswerIndex: 1,
            explanation: "Le NASDAQ est la bourse américaine à forte dominante technologique et scientifique. Son indice regroupe des piliers comme Apple, Microsoft, NVIDIA ou Alphabet."
          }
        ]
      }
    ]
  },
  {
    id: "mod2",
    title: "Niveau 2 : Portefeuille & Diversification",
    description: "Apprenez à construire un panier d'investissements résilient et robuste face à l'instabilité.",
    lessons: [
      {
        id: "l2_1",
        title: "Les ETFs : Panier d'actions clé-en-main",
        description: "Pourquoi et comment posséder des centaines d'entreprises en un seul clic.",
        xpReward: 200,
        slides: [
          {
            title: "Qu'est-ce qu'un ETF / Tracker ?",
            text: "Un ETF (Exchange Traded Fund ou Tracker) est un panier d'actions conçu pour répliquer le rendement d'un marché ou d'un indice en une seule transaction.",
            bullets: [
              "Sécurité instantanée : au lieu d'acheter 1 action risquée, vous possédez un micro-morceau de centaines d'entreprises d'un coup.",
              "Frais minimes : les commissions de gestion d'un ETF sont drastiquement rabaissées.",
              "Il s'échange en bourse pendant la journée exactement comme une action ordinaire."
            ],
            illustration: "basket"
          },
          {
            title: "Les Indices Célèbres : Le S&P 500",
            text: "Un indice boursier est un outil statistique qui mesure la santé globale d'un groupe d'entreprises de référence.",
            bullets: [
              "Le S&P 500 rassemble les 500 plus grandes entreprises américaines cotées (Apple, Microsoft, Amazon...).",
              "Il sert de baromètre ultime de l'économie américaine et mondiale.",
              "Investir dans un ETF S&P 500 permet de parier sur la croissance de ces 500 géants."
            ],
            illustration: "index"
          }
        ],
        questions: [
          {
            id: "q_2_1_1",
            text: "Qu'est-ce qu'un ETF (Exchange Traded Fund), aussi appelé 'Tracker' ?",
            options: [
              "Une marque d'ordinateur ultra-rapide pour le trading algorithmique.",
              "Un panier d'actions diversifiées qui réplique la performance d'un indice (ex: S&P 500, CAC 40).",
              "Une crypto-monnaie décentralisée.",
              "Une plateforme secrète gérée par la banque centrale."
            ],
            correctAnswerIndex: 1,
            explanation: "Un ETF vous permet d'acheter simultanément des centaines d'actions en une seule fois. C'est parfait pour réduire le risque et diversifier à bas coût."
          },
          {
            id: "q_2_1_2",
            text: "Quel est l'indice boursier américain le plus célèbre composé des 500 plus grandes entreprises ?",
            options: [
              "Le NASDAQ index-30",
              "Le FTSE 100",
              "Le S&P 500",
              "L'Euro Stoxx 50"
            ],
            correctAnswerIndex: 2,
            explanation: "Le S&P 500 rassemble les 500 plus grandes entreprises américaines cotées. Il sert d'indicateur universel de la santé économique des États-Unis."
          },
          {
            id: "q_2_1_3",
            text: "Comment un ETF se distingue-t-il d'un fonds de placement traditionnel géré de manière active ?",
            options: [
              "Il n'autorise des transactions que le mardi matin.",
              "Il utilise une gestion passive automatisée pour simplement répliquer un indice, offrant ainsi des frais considérablement réduits.",
              "Il ne nécessite aucune inscription ou compte bancaire.",
              "Il ne contient jamais de grandes entreprises mondiales."
            ],
            correctAnswerIndex: 1,
            explanation: "Les ETFs répliquent mécaniquement un indice de référence boursier sans requérir une lourde équipe de gestionnaires humains. Cela rabaissent drastiquement leurs frais de gestion annuels."
          },
          {
            id: "q_2_1_4",
            text: "Que se passe-t-il pour un investisseur détenant un ETF S&P 500 si l'une des 500 entreprises fait faillite ?",
            options: [
              "L'investisseur perd l'ensemble de son capital instantanément.",
              "L'impact est minime pour son portefeuille, car les 499 autres entreprises amortissent cette perte.",
              "L'investisseur est poursuivi en justice pour éponger les dettes.",
              "L'ETF est gelé par les régulateurs financiers pendant deux ans."
            ],
            correctAnswerIndex: 1,
            explanation: "C'est l'un des plus grands pouvoirs des trackers. La faillite d'une seule entreprise au sein de centaines d'autres ne représente qu'une perte négligeable, garantissant votre sécurité globale."
          }
        ]
      },
      {
        id: "l2_2",
        title: "L'art délicat de la diversification",
        description: "Ne mettez pas tous vos œufs dans le même panier boursier !",
        xpReward: 250,
        slides: [
          {
            title: "Le Risque de Non-Diversification",
            text: "Investir tout son capital sur une seule et unique entreprise est extrêmement risqué.",
            bullets: [
              "Si cette seule entreprise traverse un scandale ou fait faillite, vos économies s'effondrent d'un coup.",
              "Aucune entité boursière, aussi solide soit-elle, n'est à l'abri d'un revers stratégique ou sectoriel."
            ],
            illustration: "danger"
          },
          {
            title: "Le Principe de Diversification",
            text: "La diversification est la règle numéro un de la protection du capital. C'est l'illustration de l'expression populaire : 'Ne mettez pas tous vos œufs dans le même panier.'",
            bullets: [
              "Répartissez vos investissements sur différents secteurs (Technologie, Santé, Énergie, Matériaux).",
              "Diversifiez aussi géographiquement (Europe, États-Unis, Asie) et sur différents types d'actifs.",
              "Ainsi, si un secteur ou un actif baisse, les gains ou la stabilité des autres de votre capital amortissent la chute globale."
            ],
            illustration: "diversity"
          }
        ],
        questions: [
          {
            id: "q_2_2_1",
            text: "Pourquoi conseille-t-on de diversifier ses investissements en bourse ?",
            options: [
              "Pour s'assurer d'acheter uniquement les actions les plus chères.",
              "Pour limiter l'impact d'une mauvaise performance d'une seule action ou secteur sur votre capital global.",
              "Parce que la loi interdit d'acheter des actions dans une seule industrie.",
              "Pour payer deux fois plus de commissions bancaires."
            ],
            correctAnswerIndex: 1,
            explanation: "La diversification disperse votre argent sur différentes régions, secteurs (Tech, Santé, Énergie) et actifs, amortissant les chutes individuelles."
          },
          {
            id: "q_2_2_2",
            text: "En bourse, qu'entend-on précisément par 'diversification sectorielle' ?",
            options: [
              "Placer tout son capital sur deux entreprises concurrentes de la téléphonie.",
              "Répartir ses investissements dans des pôles d'activité économique indépendants comme la santé, l'énergie et la finance.",
              "N'investir que dans des petits commerces locaux.",
              "Négocier des devises étrangères exclusivement."
            ],
            correctAnswerIndex: 1,
            explanation: "Si vous ne possédez que des actions technologiques et que ce secteur subit une forte baisse, votre portefeuille souffrira. Posséder de la santé et de l'agroalimentaire compense ce risque."
          },
          {
            id: "q_2_2_3",
            text: "Pourquoi la diversification géographique est-elle une pratique recommandée ?",
            options: [
              "Pour voyager sans payer d'impôts sur les billets d'avion.",
              "Pour se protéger des récessions, instabilités réglementaires ou risques géopolitiques limités à un seul pays.",
              "Parce qu'il est interdit de posséder plus de 5 actions françaises.",
              "Pour forcer le dollar américain à égaler l'euro boursier."
            ],
            correctAnswerIndex: 1,
            explanation: "Une crise, une décision gouvernementale ou un ralentissement sur un marché national (ex: Europe) peut être contrebalancé par la croissance d'autres régions (ex: États-Unis, Asie)."
          },
          {
            id: "q_2_2_4",
            text: "La sur-diversification individuelle (ex: détenir 120 actions de petites tailles) comporte quel désavantage principal ?",
            options: [
              "Elle multiplie les frais d'achat/vente et devient extrêmement complexe à analyser et à suivre de près.",
              "Elle augmente la charge électrique de votre ordinateur.",
              "Elle est passible d'emprisonnement par l'administration des fraudes.",
              "Elle fait monter artificiellement l'inflation mondiale."
            ],
            correctAnswerIndex: 0,
            explanation: "Trop de lignes éparpillent le capital d'un particulier. Le temps de gestion requis devient intenable et les frais de courtage minent les gains finaux. Les ETFs sont là pour pallier ce souci."
          }
        ]
      },
      {
        id: "l2_3",
        title: "La diversification par classes d'actifs",
        description: "Allez au-delà des actions : obligations, or, matières premières.",
        xpReward: 280,
        slides: [
          {
            title: "Les différentes classes d'actifs",
            text: "Pour blinder votre portefeuille face aux pires crises historiques, détenir uniquement des actions ne suffit pas.",
            bullets: [
              "Les Actions : moteurs de performance à long terme, mais volatiles à court terme.",
              "Les Obligations : des prêts d'argent aux États ou entreprises, plus stables avec des intérêts réguliers.",
              "L'Or physique : la valeur refuge ancestrale ultime qui brille quand tout s'effondre."
            ],
            illustration: "assets"
          },
          {
            title: "La corrélation négative",
            text: "La magie financière s'opère lorsque vous possédez des actifs qui réagissent différemment aux mêmes événements boursiers.",
            bullets: [
              "En période de crise majeure, les actions s'effondrent souvent de concert.",
              "Paradoxalement, l'or et les obligations d'État ont tendance à s'apprécier car les investisseurs y cherchent la sécurité.",
              "Cette interaction stabilise d'office la valeur nette globale de vos comptes."
            ],
            illustration: "rebound"
          }
        ],
        questions: [
          {
            id: "q_2_3_1",
            text: "Quelle classe d'actif est historiquement qualifiée de 'valeur refuge' ultime en cas de tempête boursière globale ?",
            options: [
              "Les actions des start-up d'intelligence artificielle.",
              "L'or physique.",
              "Les monnaies virtuelles naissantes de faible volume.",
              "Les actifs pétroliers à court terme."
            ],
            correctAnswerIndex: 1,
            explanation: "L'or physique est reconnu depuis des millénaires comme un actif de sauvegarde patrimoniale. Sa valeur augmente ou reste robuste lorsque les investisseurs perdent confiance dans les monnaies ou le marché actions."
          },
          {
            id: "q_2_3_2",
            text: "Qu'est-ce qu'une obligation (Bond) par rapport à une action ?",
            options: [
              "Un droit de vote double lors du conseil d'administration.",
              "Un titre de créance représentant un prêt d'argent à un État ou une entreprise, remboursé avec des intérêts.",
              "Une assurance obligatoire contre les piratages informatiques.",
              "Une pénalité administrative en cas d'achat tardif."
            ],
            correctAnswerIndex: 1,
            explanation: "Acheter une obligation revient à prêter des fonds à un émetteur public ou privé en échange d'un coupon d'intérêt fixe récurrent, offrant plus de visibilité et de stabilité que les actions."
          }
        ]
      }
    ]
  },
  {
    id: "mod3",
    title: "Niveau 3 : Les Outils de Trading & Psychologie",
    description: "Comment placer des ordres pertinents et contrôler ses émotions de marché.",
    lessons: [
      {
        id: "l3_1",
        title: "Ordre 'Au Marché' vs Ordre 'À Cours Limité'",
        description: "Contrôlez le tarif exact auquel vous exécutez vos transactions.",
        xpReward: 300,
        slides: [
          {
            title: "L'Ordre au Marché (Market Order)",
            text: "Lorsque vous voulez acheter ou vendre immédiatement, vous utilisez un ordre 'au marché'.",
            bullets: [
              "Il s'exécute quasi-instantanément au meilleur prix disponible actuel du carnet d'ordres.",
              "Garantit la rapidité d'exécution, mais n'offre aucune garantie sur le prix final précis.",
              "Il peut s'avérer risqué lors des périodes de forte volatilité ou lors d'annonces de résultats."
            ],
            illustration: "speed"
          },
          {
            title: "L'Ordre à Cours Limité (Limit Order)",
            text: "Pour protéger votre budget et contrôler parfaitement votre prix d'entrée ou de sortie, l'ordre 'à cours limité' est fondamental.",
            bullets: [
              "Vous fixez le prix maximum que vous acceptez de payer à l'achat, ou le prix minimum exigé à la vente.",
              "L'ordre ne s'exécutera que si le marché touche ou dépasse favorablement votre seuil exact.",
              "Il élimine le risque d'acheter trop cher, mais l'ordre peut rester non exécuté si le cours ne l'atteint jamais."
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_3_1_1",
            text: "Quelle est la particularité d'un ordre boursier 'À Cours Limité' ?",
            options: [
              "Il s'exécute immédiatement à n'importe quel prix disponible à la milliseconde près.",
              "Il fixe un prix maximum à l'achat (ou minimum à la vente) pour protéger l'investisseur.",
              "C'est un ordre réservé uniquement aux millionnaires.",
              "Il expire obligatoirement après 10 secondes si l'ordinateur s'éteint."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ordre à cours limité permet de contrôler le prix d'exécution. L'achat ne se fera que si l'action descend au prix fixé ou en-dessous, préservant votre budget."
          },
          {
            id: "q_3_1_2",
            text: "Quand est-il préférable de recourir à un ordre 'Au Marché' ?",
            options: [
              "Lorsque vous souhaitez obtenir un cours d'achat inférieur au coût actuel.",
              "Lorsque l'exécution immédiate est de loin votre priorité absolue sur le contrôle précis du prix.",
              "Pour les actions très peu liquides dont le prix change chaque heure.",
              "Seulement pendant la nuit quand les marchés sont endormis."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ordre au marché s'exécute de façon instantanée avec les meilleures offres du moment. C'est parfait si vous désirez acquérir ou liquider des parts sans attendre, au prix courant."
          },
          {
            id: "q_3_1_3",
            text: "Qu'est-ce qu'un 'carnet d'ordres' sur un marché boursier ?",
            options: [
              "Un document comptable papier signé par le gouverneur de la banque centrale.",
              "Un registre en temps réel recensant tous les ordres d'achat et de vente en attente classés par prix.",
              "Une liste des transactions frauduleuses détectées dans l'année.",
              "Un agenda public des dirigeants des grandes banques."
            ],
            correctAnswerIndex: 1,
            explanation: "Le carnet d'ordres liste et trie électroniquement les demandes d'achat et les offres de vente. Son croisement continu génère directement le prix de l'action seconde après seconde."
          },
          {
            id: "q_3_1_4",
            text: "Quel est le principal risque lié à l'utilisation d'un ordre 'À Cours Limité' à l'achat ?",
            options: [
              "L'ordre peut ne jamais être exécuté si le cours de l'action s'élève en continu sans jamais toucher votre limite d'achat.",
              "Le courtier a le droit de confisquer vos actions.",
              "Vous êtes prélevé de frais journaliers de stockage physique.",
              "L'action achetée ne possède aucun droit de revente ultérieure."
            ],
            correctAnswerIndex: 0,
            explanation: "Si vous déposez une limite d'achat trop stricte sous le cours actuel et que l'entreprise s'envole, le marché ne touchera jamais votre seuil et votre ordre restera inexécuté."
          }
        ]
      },
      {
        id: "l3_2",
        title: "FOMO & Psychologie boursière",
        description: "Évitez les pires erreurs comportementales des investisseurs débutants.",
        xpReward: 350,
        slides: [
          {
            title: "La Psychologie de l'Investisseur",
            text: "En bourse, vos pires ennemis ne sont pas les algorithmes de trading ou les crises économiques, mais bien vos propres émotions.",
            bullets: [
              "L'excitation d'un gain rapide encourage à l'imprudence et à l'over-trading.",
              "La panique d'une baisse temporaire pousse à vendre précipitamment au pire moment, figeant ainsi des pertes virtuelles.",
              "La rigueur stratégique froide et la patience battent toujours l'intuition impulsive."
            ],
            illustration: "mind"
          },
          {
            title: "Le FOMO (Fear Of Missing Out)",
            text: "Le FOMO (la peur de rater le train) est l'angoisse psychologique de voir les autres s'enrichir sur une action qui grimpe en flèche, incitant à y entrer tardivement.",
            bullets: [
              "Il pousse à acheter une action au sommet de sa bulle spéculative par pure panique de s'abstenir.",
              "C'est le meilleur moyen de devenir le dernier acheteur juste avant que la bulle n'éclate et que le cours ne s'effondre.",
              "Règle d'or : lorsque tout le monde parle frénétiquement d'un actif dans les médias grand public, il est souvent trop tard pour y investir sainement."
            ],
            illustration: "alarm"
          }
        ],
        questions: [
          {
            id: "q_3_2_1",
            text: "Qu'est-ce que le 'FOMO' (Fear Of Missing Out) en finance ?",
            options: [
              "Une taxe prélevée sur les gains boursiers à l'international.",
              "L'angoisse de rater une opportunité qui incite à acheter une action au plus haut par impulsion irrationnelle.",
              "Un outil mathématique pour calculer les statistiques de marché.",
              "Une assurance vie haut de gamme."
            ],
            correctAnswerIndex: 1,
            explanation: "Le FOMO pousse à acheter des actions qui ont déjà beaucoup grimpé, sous le coup de l'excitation. C'est l'un des pièges émotionnels les plus destructeurs de capital !"
          },
          {
            id: "q_3_2_2",
            text: "Qu'entend-on par l'expression boursière 'Panic Selling' (vente de panique) ?",
            options: [
              "Une stratégie récompensant les courtiers les plus rapides.",
              "Vendre précipitamment toutes ses positions à perte lors d'une chute temporaire des marchés, dicté par la peur de tout perdre.",
              "Acheter des actions en urgence au milieu de la nuit.",
              "Fermer temporairement la bourse de Paris."
            ],
            correctAnswerIndex: 1,
            explanation: "La baisse des cours crée de l'anxiété. Le 'Panic Selling' fige de lourdes pertes réelles au plus bas de la courbe, là où le sang-froid et l'analyse stratégique dictent souvent d'attendre ou de renforcer."
          },
          {
            id: "q_3_2_3",
            text: "Pourquoi les phases d'euphorie généralisée de marché (bull market) sont-elles paradoxalement très risquées ?",
            options: [
              "Parce que l'argent virtuel s'efface d'un coup par manque d'électricité.",
              "Elles créent une illusion de gain facile sans risque, incitant à des investissements disproportionnés ou spéculatifs juste avant une correction.",
              "Elles sont passibles de taxes bancaires doublement punitives.",
              "Elles poussent toutes les entreprises boursières à fermer leur usine."
            ],
            correctAnswerIndex: 1,
            explanation: "L'euphorie fait croire aux débutants qu'ils sont invincibles. Ils s'exposent de trop financièrement, au moment précis où les valorisations sont au sommet de leur bulle spéculative."
          },
          {
            id: "q_3_2_4",
            text: "Quelle méthode reconnue permet de réduire considérablement la détresse émotionnelle causée par l'agitation des courbes boursières ?",
            options: [
              "Regarder le cours de vos actions en continu chaque minute sur votre mobile.",
              "Programmer des investissements périodiques fixes (DCA) à long terme sans chercher à deviner les hauts et les bas journaliers.",
              "Revendre toutes vos actions à chaque annonce de la presse économique.",
              "Négocier sur la foi de conseils d'influenceurs non qualifiés."
            ],
            correctAnswerIndex: 1,
            explanation: "La méthode du Dollar Cost Averaging (DCA - investissement programmé à intervalle fixe) lisse le prix d'achat, discipline l'investisseur et évite les décisions compulsives sous l'effet de la peur ou de la cupidité."
          }
        ]
      },
      {
        id: "l3_3",
        title: "L'horizon d'investissement",
        description: "Distinguez l'investisseur de long terme du trader à court terme.",
        xpReward: 380,
        slides: [
          {
            title: "Le long terme : l'allié du temps",
            text: "Plus votre objectif de placement est lointain (5, 10, 20 ans), plus vous pouvez ignorez les chutes passagères.",
            bullets: [
              "À long terme, la bourse mondiale affiche une tendance directionnelle haussière liée au progrès et à la croissance économique.",
              "Le bruit journalier des cours s'efface au profit de la capitalisation sur de longues années.",
              "Investir pour votre retraite ou un achat lointain justifie de détenir une majorité d'actions."
            ],
            illustration: "time"
          },
          {
            title: "Le court terme : le royaume du stress",
            text: "Si vous prévoyez de récupérer votre capital d'ici quelques mois, les actions boursières deviennent un pari risqué.",
            bullets: [
              "La météo du marché à court terme est hautement imprévisible et soumise aux humeurs spéculatives.",
              "Le trading actif à court terme exige une discipline absolue et l'acceptation de pertes immédiates.",
              "Pour le court terme, privilégiez des placements monétaires ou des livrets sécurisés."
            ],
            illustration: "hurry"
          }
        ],
        questions: [
          {
            id: "q_3_3_1",
            text: "Quel est l'impact principal d'un grand horizon d'investissement (ex: 15 ans) sur votre prise de risque ?",
            options: [
              "Il vous oblige à vérifier vos soldes bancaires toutes les heures.",
              "Il permet de tolérer la volatilité à court terme car vous avez le temps de laisser les marchés se redresser.",
              "Il supprime totalement tous les impôts boursiers mondiaux.",
              "Il vous force à vendre toutes vos actions chaque vendredi."
            ],
            correctAnswerIndex: 1,
            explanation: "Un horizon long donne le temps de récupérer des inévitables crises passagères historiques. Vous pouvez donc investir en actions pour maximiser vos gains futurs, sans la panique d'un retrait forcé en pleine correction."
          },
          {
            id: "q_3_3_2",
            text: "Pourquoi le trading à très court terme (Day Trading) est-il déconseillé aux épargnants passifs ?",
            options: [
              "Parce qu'il nécessite un compte d'épargne d'État exclusif.",
              "Il exige une attention permanente, induit des frais de transaction massifs et s'avère extrêmement éprouvant sur le plan psychologique.",
              "Parce qu'il est illégal de faire des profits en moins de 24 heures.",
              "Parce que les actions ne fluctuent jamais au cours de la journée."
            ],
            correctAnswerIndex: 1,
            explanation: "Le trading de court terme s'apparente à une activité à plein temps très stressante. Les frais de courtage cumulés et les variations erratiques du marché en font une impasse financière pour l'immense majorité des particuliers."
          }
        ]
      }
    ]
  },
  {
    id: "mod4",
    title: "Niveau 4 : Analyse Fondamentale & Ratios",
    description: "Apprenez à déchiffrer la santé financière réelle d'une entreprise au-delà des simples variations de son cours de bourse.",
    lessons: [
      {
        id: "l4_1",
        title: "Le Ratio P/E (Price-to-Earnings)",
        description: "Comprenez la méthode universelle pour savoir si une action est chère ou bon marché.",
        xpReward: 400,
        slides: [
          {
            title: "Le Price-to-Earnings (P/E)",
            text: "Le ratio P/E (PER en français - Ratio cours/bénéfice) est l'outil d'évaluation le plus utilisé au monde pour estimer si une action est sous-évaluée ou surévaluée.",
            bullets: [
              "Il se calcule en divisant le cours de l'action par son bénéfice net annuel par action (BPA).",
              "Un P/E de 20 signifie que les investisseurs acceptent de payer 20€ aujourd'hui pour obtenir 1€ de bénéfice net annuel actuel de la société.",
              "Un ratio bas peut indiquer une sous-évaluation, tandis qu'un ratio très élevé indique de fortes attentes de croissance à l'avenir."
            ],
            illustration: "ratio"
          },
          {
            title: "Comparer des pommes avec des pommes",
            text: "Le ratio P/E n'a de sens que si on le compare à des concurrents du même secteur ou à la moyenne historique de son marché.",
            bullets: [
              "Les entreprises technologiques ont souvent des P/E élevés (ex: 35+) car les investisseurs s'attendent à une croissance spectaculaire.",
              "Les entreprises industrielles ou énergétiques ont généralement des P/E plus modestes (ex: 8 à 15) en raison de bénéfices stables et matures.",
              "Un P/E élevé hors contexte sectoriel peut signaler une sur-évaluation ou une bulle spéculative."
            ],
            illustration: "compare"
          }
        ],
        questions: [
          {
            id: "q_4_1_1",
            text: "Comment se calcule principalement le ratio P/E (Price-to-Earnings) d'une action ?",
            options: [
              "En divisant le cours de l'action par son bénéfice net par action (BPA).",
              "En multipliant le nombre d'actionnaires par l'impôt de l'entreprise.",
              "En divisant la dette totale par la valeur de la marque.",
              "En ajoutant le prix de l'or au prix de l'action."
            ],
            correctAnswerIndex: 0,
            explanation: "Le ratio P/E s'obtient en divisant la valeur d'une action par son bénéfice net annuel par part. Il exprime combien de fois l'investisseur paye le bénéfice de l'entreprise."
          },
          {
            id: "q_4_1_2",
            text: "Que signifie concrètement un ratio P/E égal à 15 pour une entreprise ?",
            options: [
              "Qu'il faut attendre 15 jours pour vendre l'action.",
              "Que le prix de l'action est 15 fois supérieur au bénéfice net annuel généré par action.",
              "Que l'entreprise a fait faillite 15 fois dans le passé.",
              "Que l'État détient 15 % du capital de cette firme."
            ],
            correctAnswerIndex: 1,
            explanation: "Un P/E de 15 signifie que l'investisseur paye l'entreprise 15 fois le montant de son profit annuel par part, soit un retour de 15 ans si les bénéfices stagnent."
          },
          {
            id: "q_4_1_3",
            text: "Pourquoi les start-up technologiques ont-elles souvent des P/E très supérieurs à la moyenne ?",
            options: [
              "Parce qu'elles n'ont pas le droit d'utiliser des outils de calcul ordinaires.",
              "Parce que les investisseurs anticipent une croissance future explosive de leurs bénéfices.",
              "Parce qu'elles accumulent d'immenses réserves d'or physique.",
              "Pour décourager de futurs concurrents d'entrer en bourse."
            ],
            correctAnswerIndex: 1,
            explanation: "Les entreprises de croissance ont des P/E élevés car les acheteurs acceptent de payer cher aujourd'hui en échange de bénéfices futurs qui devraient se décupler."
          }
        ]
      },
      {
        id: "l4_2",
        title: "Le Bilan Comptable en Bourse",
        description: "Distinguez les dettes, la trésorerie et la solidité de ce que possède une société.",
        xpReward: 450,
        slides: [
          {
            title: "Actifs vs Passifs",
            text: "Le bilan comptable est une photographie de la situation financière de l'entreprise à un instant T précis.",
            bullets: [
              "Les Actifs représentent tout ce que l'entreprise possède pour faire tourner l'activité (brevets, usines, stocks, trésorerie).",
              "Les Passifs représentent l'ensemble des dettes de l'entreprise (dettes bancaires, dettes fournisseurs).",
              "Les Capitaux propres sont la valeur nette réelle revenant théoriquement aux actionnaires si on vendait tout pour rembourser les dettes."
            ],
            illustration: "sheet"
          },
          {
            title: "Trésorerie et Dettes",
            text: "Une entreprise rentable peut faire faillite si elle manque d'oxygène financier à court terme pour honorer ses factures.",
            bullets: [
              "Le Free Cash Flow (flux de trésorerie disponible) est l'argent réel utilisable pour investir, racheter des actions ou verser des dividendes.",
              "Une dette trop lourde rend l'entreprise dépendante des taux d'intérêt et ralentit drastiquement son agilité face aux crises concurrentielles."
            ],
            illustration: "debt"
          }
        ],
        questions: [
          {
            id: "q_4_2_1",
            text: "Que représentent les 'Capitaux Propres' (Shareholders' Equity) dans le bilan d'une entreprise ?",
            options: [
              "L'ensemble des dettes de l'entreprise envers son État d'origine.",
              "La valeur résiduelle des actifs de la société après déduction de l'ensemble de ses dettes.",
              "La somme d'argent reversée chaque mois aux salariés.",
              "Un placement facultatif servant à payer la publicité."
            ],
            correctAnswerIndex: 1,
            explanation: "Les capitaux propres correspondent à l'actif moins le passif. C'est l'encours financier réel appartenant directement aux actionnaires."
          },
          {
            id: "q_4_2_2",
            text: "Pourquoi le 'Free Cash Flow' (flux de trésorerie disponible) est-il si attentivement scruté par les professionnels ?",
            options: [
              "Parce qu'il indique à quelle vitesse l'entreprise brûle ses billets.",
              "Il montre l'argent liquide réellement généré par l'activité pour financer de nouveaux projets ou choyer les investisseurs.",
              "C'est un ratio fictif créé pour éviter les inspections fiscales.",
              "Pour mesurer le nombre de brevets déposés à l'étranger."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Free Cash Flow est l'argent disponible utilisable une fois que toutes les factures courantes et les dépenses d'investissement indispensables ont été payées."
          }
        ]
      },
      {
        id: "l4_3",
        title: "Le rendement du dividende",
        description: "Apprenez à mesurer l'efficacité des flux de revenus distribués.",
        xpReward: 480,
        slides: [
          {
            title: "Rendement vs Montant",
            text: "Ne vous laissez pas impressionner par une action qui verse 10€ de dividende : regardez d'abord son cours de bourse !",
            bullets: [
              "Le rendement du dividende s'exprime en pourcentage. Formule : (Dividende par action / Cours de l'action) x 100.",
              "Si l'action A vaut 100€ et donne 5€ de dividende, son rendement est de 5%.",
              "Si l'action B vaut 500€ et donne 10€, son rendement est de seulement 2%."
            ],
            illustration: "yield_calc"
          },
          {
            title: "Le piège du rendement mirage",
            text: "Un rendement anormalement élevé (ex: 15%) est souvent le signal de graves ennuis économiques.",
            bullets: [
              "Souvent, le rendement paraît immense car le cours de l'action s'est effondré suite à une crise majeure.",
              "L'entreprise risque fort de couper ou de supprimer purement et simplement ses distributions futures.",
              "Recherchez les Dividend Aristocrats : des firmes qui augmentent ou maintiennent leur dividende en continu depuis plus de 25 ans."
            ],
            illustration: "trap"
          }
        ],
        questions: [
          {
            id: "q_4_3_1",
            text: "Comment se calcule le rendement du dividende (Dividend Yield) d'une action boursière ?",
            options: [
              "En multipliant le dividende par le chiffre d'affaires de l'entreprise.",
              "En divisant le montant du dividende annuel par le cours actuel de l'action (en pourcentage).",
              "En demandant l'avis d'une autorité fiscale locale.",
              "En comptant le nombre total de salariés de la firme."
            ],
            correctAnswerIndex: 1,
            explanation: "Le rendement exprime le gain annuel distribué par rapport au prix payé pour acquérir la part. Diviser le dividende annuel par le prix de l'action montre l'efficacité réelle de l'investissement."
          },
          {
            id: "q_4_3_2",
            text: "Pourquoi un dividende d'un rendement de 18% doit-il éveiller la méfiance des investisseurs ?",
            options: [
              "Parce qu'un rendement si fort est techniquement bloqué par les douanes boursières.",
              "Il reflète souvent un effondrement récent du cours de bourse de l'entreprise, signalant une coupure imminente de ce dividende non viable.",
              "Car les dividendes au-delà de 10% ne sont payés qu'en bons de réduction.",
              "Parce que l'entreprise va être nationalisée sous 48 heures."
            ],
            correctAnswerIndex: 1,
            explanation: "Un rendement exceptionnel trahit un cours de bourse en déroute. Comme le dividende est voté a posteriori, la rentabilité promise s'avère généralement intenable et l'entreprise supprime souvent la distribution pour sauver sa trésorerie."
          }
        ]
      }
    ]
  },
  {
    id: "mod5",
    title: "Niveau 5 : Gestion du Risque & Stratégies Avancées",
    description: "Protéger ses arrières et utiliser des stratégies de professionnels pour durer sur les marchés.",
    lessons: [
      {
        id: "l5_1",
        title: "L'effet de levier et le Stop-Loss",
        description: "Comprenez les mécanismes puissants et risqués du trading actif.",
        xpReward: 500,
        slides: [
          {
            title: "L'effet de Levier (Leverage)",
            text: "L'effet de levier permet d'investir avec des fonds supérieurs à votre capital réel en empruntant temporairement à votre courtier.",
            bullets: [
              "Il amplifie vos gains potentiels si l'action évolue dans votre direction.",
              "Il démultiplie aussi cruellement vos pertes si le cours baisse, pouvant réduire votre compte à zéro en un éclair.",
              "C'est un instrument double tranchant très explosif, à n'utiliser qu'avec un sang-froid de professionnel."
            ],
            illustration: "leverage"
          },
          {
            title: "Le bouclier protecteur : Le Stop-Loss",
            text: "Un ordre Stop-Loss est une assurance automatique qui vend vos parts si le cours dérape sous un prix d'alerte défini.",
            bullets: [
              "Il sert à couper court à vos pertes avant qu'elles ne virent à la débâcle.",
              "Par exemple, en achetant à 100€ et en programmant un Stop-Loss à 92€, votre perte maximale est bornée d'office à 8%.",
              "Il protège vos émotions en supprimant l'obligation de regarder les courbes de prix 24h/24."
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_5_1_1",
            text: "Quel est le danger principal de l'effet de levier (Leverage) ?",
            options: [
              "Il ralentit l'exécution de vos transactions en ligne.",
              "Il amplifie proportionnellement vos pertes et peut liquider l'intégralité de vos économies sur un faux mouvement temporaire.",
              "Il change la nationalité fiscale des actions de votre compte.",
              "Il vous oblige à revendre vos lingots physiques."
            ],
            correctAnswerIndex: 1,
            explanation: "Le levier multiplie votre mise boursière fictive. S'il multiplie vos bénéfices, il accélère symétriquement vos pertes jusqu'à forcer la fermeture de votre compte si vos marges s'épuisent."
          },
          {
            id: "q_5_1_2",
            text: "Comment fonctionne précisément un ordre automatique 'Stop-Loss' ?",
            options: [
              "Il bloque le cours de l'action à la hausse définitivement.",
              "Il se transforme automatiquement en ordre de vente dès que le cours franchit à la baisse votre limite de sécurité configurée.",
              "Il double votre mise gratuitement toutes les deux semaines par contrat.",
              "Il coupe votre électricité de trading pendant les périodes instables."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Stop-Loss est un court-circuit de sécurité : si la baisse touche votre seuil, l'action est coupée immédiatement sans délai, protégeant le reste de votre trésorerie boursière."
          },
          {
            id: "q_5_1_3",
            text: "Quel pourcentage maximal de son capital est-il généralement conseillé de risquer sur une seule transaction de trading active ?",
            options: [
              "Entre 1 % et 2 % au maximum.",
              "Toujours 50 % pour maximiser ses gains journaliers.",
              "100 % en utilisant le levier maximal pour aller vite.",
              "Strictement 0 %, il ne faut jamais passer aucune transaction."
            ],
            correctAnswerIndex: 0,
            explanation: "Les professionnels limitent leur perte maximale tolérée par trade actif à 1% ou 2% de leur portefeuille global, neutralisant l'impact émotionnel et préservant les munitions financières pour les futurs succès."
          }
        ]
      },
      {
        id: "l5_2",
        title: "Les Cycles de Marché et Bull/Bear",
        description: "Apprenez à adapter vos voiles à la météo globale de l'économie mondiale.",
        xpReward: 550,
        slides: [
          {
            title: "Bull Market vs Bear Market",
            text: "La bourse ne croît pas de façon linéaire et continue. Elle est structurée par des cycles portés par la psychologie collective.",
            bullets: [
              "Un Bull Market (Marché Haussier) s'exprime par une confiance collective, poussant les indices au vert continu.",
              "Un Bear Market (Marché Baissier) est un repli de long terme (souvent de plus de -20%) mené par la retenue, la panique et des perspectives de récession.",
              "L'histoire enseigne que les Bear Markets sont inévitables mais ont toujours constitué des phases passagères menant vers de nouveaux records."
            ],
            illustration: "cycle"
          },
          {
            title: "Le DCA (Dollar Cost Averaging) de Long Terme",
            text: "Pour un investisseur méthodique, les replis du marché ne sont pas un drame, mais l'occasion d'acquérir de formidables pépites à prix discount.",
            bullets: [
              "Investir à DCA consiste à injecter une somme fixe récurrente (ex: 100€ toutes les fins de mois) peu importe le prix de l'indice.",
              "Par cette formule simple, vous achetez naturellement plus d'actions quand les prix chutent et moins quand les cours flambent.",
              "Cette technique bat dans plus de 90 % des cas le trading actif sur le long terme car elle supprime l'erreur logique des émotions."
            ],
            illustration: "dca"
          }
        ],
        questions: [
          {
            id: "q_5_2_1",
            text: "Qu'est-ce qu'un 'Bear Market' ou Marché Baissier ?",
            options: [
              "Une période où l'administration boursière distribue des cadeaux financiers.",
              "Un repli prolongé caractérisé par une dépréciation d'au moins 20 % des indices de référence, menée par la méfiance collective.",
              "Un marché où seules les sociétés agricoles réalisent des bénéfices.",
              "Une panne technique de courtage touchant le parquet mondial."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ours symbolise l'attaque vers le bas : c'est un cycle de repli tenace déclenché par une conjoncture de récession et une contraction sectorielle durable."
          },
          {
            id: "q_5_2_2",
            text: "Quel est le bénéfice mathématique évident de la stratégie d'investissement programmé (DCA) ?",
            options: [
              "Elle élimine tout impôt annuel sur les dividendes.",
              "Elle lisse le coût de revient moyen en vous faisant acquérir plus de parts quand le marché est décoté et moins de parts quand il culmine.",
              "Elle vous permet d'obtenir un compte préférentiel gratuit à vie.",
              "Elle bloque l'inflation nationale sur l'ensemble de vos dépenses courantes."
            ],
            correctAnswerIndex: 1,
            explanation: "Le DCA supprime le besoin de prédire le moment idéal du marché. En investissant régulièrement la même somme, vous transformez les krachs temporaires en opportunités d'accumuler à prix d'or."
          }
        ]
      },
      {
        id: "l5_3",
        title: "L'allocation stratégique d'actifs",
        description: "Concevez le plan de vol global de votre épargne selon votre âme d'investisseur.",
        xpReward: 580,
        slides: [
          {
            title: "Connaître son profil de risque",
            text: "Le meilleur portefeuille sur le papier est celui qui vous permet de dormir en toute quiétude la nuit.",
            bullets: [
              "Profil Prudent : majorité d'obligations stables et d'or pour amortir les chocs sanitaires ou géopolitiques.",
              "Profil Équilibré : équilibre rigoureux 50/50 ou 60/40 entre actions d'avenir et placements sécuritaires.",
              "Profil Dynamique : allocation prépondérante d'actions de croissance et de trackers d'indices technologiques."
            ],
            illustration: "balance_profile"
          },
          {
            title: "Le rééquilibrage de portefeuille",
            text: "Chaque année, l'évolution divergente des marchés déforme votre stratégie idéale.",
            bullets: [
              "Si vos actions s'envolent, elles prennent une place excessive et augmentent le danger global de votre compte.",
              "Le rééquilibrage consiste à vendre une partie des actions au plus haut pour racheter des obligations ou de l'or décotés.",
              "Cette routine force la discipline idéale : vendre ce qui a flambé pour acquérir ce qui est bon marché."
            ],
            illustration: "refresh"
          }
        ],
        questions: [
          {
            id: "q_5_3_1",
            text: "En quoi consiste l'exercice du 'rééquilibrage' périodique de votre capital d'investissement ?",
            options: [
              "À fermer son compte de trading pour en rouvrir un nouveau.",
              "À vendre périodiquement une fraction des actifs gagnants pour racheter les actifs en retard afin de restaurer son allocation cible idéale.",
              "À calculer précisément le poids physique de vos pièces d'or accumulées.",
              "À égaliser les salaires des dirigeants d'entreprises achetées."
            ],
            correctAnswerIndex: 1,
            explanation: "Le rééquilibrage est un pilier de la gestion de patrimoine. Il sécurise mécaniquement des profits issus de vos gagnants boursiers pour réapprovisionner les lignes saines à juste prix."
          },
          {
            id: "q_5_3_2",
            text: "Pour un profil d'épargnant très grand défenseur de son patrimoine (Profil Prudent), quelle allocation cible est la plus cohérente ?",
            options: [
              "100% de capital investi sur des obligations de pays de premier ordre, de l'or physique et de la bourse liquide.",
              "100% sur des actions technologiques émergentes et fluctuantes.",
              "Acheter exclusivement du pétrole brut à court terme.",
              "Uniquement des actions de pays en récession."
            ],
            correctAnswerIndex: 0,
            explanation: "La préservation solide exige d'éviter la volatilité boursière. Une prépondérance de titres de prêts d'États stables (obligations souveraines de premier rang), de l'or refuge et des livrets à taux garantis prévient toute perte de capital sévère."
          }
        ]
      }
    ]
  }
];
