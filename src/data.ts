import { Stock, LessonModule } from "./types";

// Database of ultra-realistic stock values and real tickers with 30-day index histories
const STATIC_CORE_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 340.08,
    change: 0.94,
    history: [315.2, 316.5, 314.8, 314.1, 315.2, 316.8, 318.4, 327.5, 327.2, 325.8, 327.1, 328.7, 329.4, 330.5, 328.8, 330.2, 331.5, 332.3, 330.8, 331.3, 332.4, 333.7, 335.8, 337.2, 338.1, 338.5, 339.4, 337.8, 339.2, 340.08],
    volume: "50.7M",
    marketCap: "4.84T $",
    low24h: 335.60,
    high24h: 342.89,
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
    price: 393.35,
    change: 1.09,
    history: [377.1, 378.5, 380.1, 381.8, 383.8, 381.6, 382.7, 384.9, 387.0, 388.6, 387.7, 386.6, 389.6, 391.8, 391.2, 392.3, 394.0, 394.6, 392.5, 393.2, 395.9, 397.2, 396.1, 394.6, 394.1, 395.2, 396.2, 394.2, 392.7, 393.35],
    volume: "32.1M",
    marketCap: "2.92T $",
    low24h: 391.30,
    high24h: 400.32,
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
    price: 197.01,
    change: 0.25,
    history: [180.91, 182.75, 184.74, 185.82, 188.42, 190.1, 188.87, 191.33, 193.32, 195.46, 193.63, 196.54, 198.53, 200.84, 199.0, 201.6, 203.6, 204.66, 202.37, 204.21, 201.65, 200.72, 198.73, 196.96, 198.8, 196.81, 199.25, 197.11, 196.2, 197.01],
    volume: "132.2M",
    marketCap: "4.82T $",
    low24h: 192.74,
    high24h: 198.70,
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
    price: 307.44,
    change: -0.58,
    history: [289.13, 291.35, 288.2, 286.92, 288.94, 291.89, 294.84, 293.2, 292.64, 290.05, 292.46, 295.41, 296.69, 298.72, 295.59, 298.18, 300.56, 302.04, 299.28, 300.2, 302.23, 304.63, 308.5, 311.62, 315.85, 312.0, 313.22, 310.46, 308.48, 307.44],
    volume: "38.7M",
    marketCap: "980B $",
    low24h: 300.69,
    high24h: 311.16,
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

export { LESSON_MODULES } from "./lessonsData";
