import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_STOCKS } from "./src/data";
import { getLocalizedFallbackNews, parseYahooRSSLocalized, LANG_PROMPT_NAMES, SupportedLang } from "./server/newsData";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
let isGeminiDisabledPermanently = false; // Cache 403 / permission denied errors to prevent useless retries

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La variable d'environnement GEMINI_API_KEY est manquante. Veuillez la configurer dans AI Studio Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Wrapper for generateContent with automatic retry on 503/UNAVAILABLE or heavy load errors and model failover
async function generateContentWithRetry(client: any, params: any, retries = 2, initialDelayMs = 1000): Promise<any> {
  if (isGeminiDisabledPermanently) {
    throw new Error("Gemini is disabled due to previous permanent 403 PERMISSION_DENIED error.");
  }
  const isInCooldown = (Date.now() - last429Time) < 10 * 60 * 1000;
  if (isInCooldown) {
    throw new Error("Gemini is in 10-minute cooldown due to previous rate-limiting (429/Resource Exhausted). Using offline local fallbacks.");
  }
  let attempt = 0;
  let delay = initialDelayMs;
  while (true) {
    try {
      return await client.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      const errorMessage = String(err.message || "").toLowerCase();
      
      const isForbidden = errorMessage.includes("403") || 
                          errorMessage.includes("permission_denied") || 
                          errorMessage.includes("denied access") ||
                          errorMessage.includes("denied_access") ||
                          (err.status && err.status === 403);
      if (isForbidden) {
        isGeminiDisabledPermanently = true;
        console.log(`[Gemini API] Permanent permission denial (403) detected. Disabling Gemini calls and defaulting to offline local fallback.`);
        throw err;
      }

      const isQuotaExceeded = errorMessage.includes("429") || 
                              errorMessage.includes("quota") || 
                              errorMessage.includes("limit") ||
                              errorMessage.includes("resource_exhausted") ||
                              (err.status && err.status === 429);
      if (isQuotaExceeded) {
        last429Time = Date.now();
        console.log(`[Gemini API] Quota / rate limit exceeded (429). Setting fallback cooldown.`);
        throw err; // Fail fast without multiple retries/failovers when out of quota
      }

      const isUnavailable = errorMessage.includes("503") || 
                            errorMessage.includes("unavailable") || 
                            errorMessage.includes("high demand") || 
                            errorMessage.includes("overloaded") ||
                            errorMessage.includes("spike") ||
                            (err.status && err.status === 503);
      if (isUnavailable && !isQuotaExceeded && attempt <= retries) {
        console.log(`[Gemini Service] Retrying query (attempt ${attempt}/${retries}) in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }

      // Model failover chain if the current model is having issues or under-provisioned
      const failoverChain = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
      const currentModel = params.model;
      for (const fallbackModel of failoverChain) {
        if (currentModel !== fallbackModel) {
          console.log(`[Gemini Service] Adjusting query routing to backup model: ${fallbackModel}...`);
          try {
            // Safe deep clone to modify config for backup eligibility
            const failoverParams = JSON.parse(JSON.stringify(params));
            failoverParams.model = fallbackModel;
            if (failoverParams.config) {
              delete failoverParams.config.thinkingConfig;
            }
            return await client.models.generateContent(failoverParams);
          } catch (failoverErr: any) {
            console.log(`[Gemini Service] Backup model ${fallbackModel} status: ${failoverErr.status || "busy"}`);
          }
        }
      }

      throw err;
    }
  }
}

// Wrapper for generateContentStream with automatic retry on 503/UNAVAILABLE or heavy load errors and model failover
async function generateContentStreamWithRetry(client: any, params: any, retries = 2, initialDelayMs = 1000): Promise<any> {
  if (isGeminiDisabledPermanently) {
    throw new Error("Gemini is disabled due to previous permanent 403 PERMISSION_DENIED error.");
  }
  const isInCooldown = (Date.now() - last429Time) < 10 * 60 * 1000;
  if (isInCooldown) {
    throw new Error("Gemini is in 10-minute cooldown due to previous rate-limiting (429/Resource Exhausted). Using offline local fallbacks.");
  }
  let attempt = 0;
  let delay = initialDelayMs;
  while (true) {
    try {
      return await client.models.generateContentStream(params);
    } catch (err: any) {
      attempt++;
      const errorMessage = String(err.message || "").toLowerCase();

      const isForbidden = errorMessage.includes("403") || 
                          errorMessage.includes("permission_denied") || 
                          errorMessage.includes("denied access") ||
                          errorMessage.includes("denied_access") ||
                          (err.status && err.status === 403);
      if (isForbidden) {
        isGeminiDisabledPermanently = true;
        console.log(`[Gemini API Stream] Permanent permission denial (403) detected. Disabling Gemini calls and defaulting to offline local fallback.`);
        throw err;
      }

      const isQuotaExceeded = errorMessage.includes("429") || 
                              errorMessage.includes("quota") || 
                              errorMessage.includes("limit") ||
                              errorMessage.includes("resource_exhausted") ||
                              (err.status && err.status === 429);
      if (isQuotaExceeded) {
        last429Time = Date.now();
        console.log(`[Gemini API] Stream Quota / rate limit exceeded (429). Setting fallback cooldown.`);
        throw err; // Fail fast without multiple retries/failovers when out of quota
      }

      const isUnavailable = errorMessage.includes("503") || 
                            errorMessage.includes("unavailable") || 
                            errorMessage.includes("high demand") || 
                            errorMessage.includes("overloaded") ||
                            errorMessage.includes("spike") ||
                            (err.status && err.status === 503);
      if (isUnavailable && !isQuotaExceeded && attempt <= retries) {
        console.log(`[Gemini Service Stream] Retrying stream (attempt ${attempt}/${retries}) in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }

      // Model failover chain if the current model is having issues or under-provisioned
      const failoverChain = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
      const currentModel = params.model;
      for (const fallbackModel of failoverChain) {
        if (currentModel !== fallbackModel) {
          console.log(`[Gemini Service Stream] Adjusting stream routing to backup model: ${fallbackModel}...`);
          try {
            // Safe deep clone to modify config for backup eligibility
            const failoverParams = JSON.parse(JSON.stringify(params));
            failoverParams.model = fallbackModel;
            if (failoverParams.config) {
              delete failoverParams.config.thinkingConfig;
            }
            return await client.models.generateContentStream(failoverParams);
          } catch (failoverErr: any) {
            console.log(`[Gemini Service Stream] Backup model ${fallbackModel} status: ${failoverErr.status || "busy"}`);
          }
        }
      }

      throw err;
    }
  }
}

const FALLBACK_NEWS: Record<string, any[]> = {
  AAPL: [
    {
      id: "aapl_news_1",
      title: "L'iPhone Ultra sous IA révolutionne les ventes à l'international",
      summary: "Apple a annoncé l'introduction de nouvelles fonctionnalités d'intelligence artificielle générative intégrées localement sur ses processeurs de dernière génération. Les analystes prévoient un cycle de renouvellement de hardware historique à l'automne.",
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
  MSFT: [
    {
      id: "msft_news_1",
      title: "Copilot Pro franchit le cap symbolique des 15 millions d'abonnés payants",
      summary: "La suite de productivité assistée par intelligence artificielle de Microsoft progresse beaucoup plus rapidement que prévu initialement par le consensus des banques d'affaires, renforçant la rentabilité globale de la branche Office SaaS.",
      source: "Silicon Valley Echo",
      timestamp: "Il y a 4 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/MSFT",
      fullText: "Microsoft a annoncé avec fierté que les souscriptions à son service d'assistance de productivité Copilot Pro venaient de dépasser le cap des 15 millions d'utilisateurs payants mensuels. L'adoption accélérée de sa suite bureautique revampée par les modèles spécialisés d'OpenAI atteste d'une soif d'efficacité de la part des cadres et développeurs.\n\nCette réussite commerciale majeure permet à Microsoft de valider son modèle de tarification additionnel de 20 dollars par utilisateur. Les analystes soulignent que l'augmentation du panier d'achat moyen (ARPU) sur sa vaste base d'abonnés professionnels historiques se traduira directement par une expansion phénoménale de ses marges d'exploitation boursières.\n\nLe succès fulgurant de Copilot Pro conforte l'avance stratégique de Microsoft dans la concrétisation des bénéfices de l'IA générative industrielle face à ses rivaux directs comme Google."
    },
    {
      id: "msft_news_2",
      title: "Investissement d'infrastructure massif de 3,2 milliards $ dans le Cloud en Allemagne",
      summary: "Microsoft continue d'étendre activement ses infrastructures de centres de données en Europe pour répondre à la demande exponentielle en calcul d'IA et garantir la souveraineté locale des données régionales.",
      source: "Global Tech Journal",
      timestamp: "Hier",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/MSFT",
      fullText: "Afin de consolider ses positions dominantes en Europe, Microsoft a annoncé un plan d'investissement géant de 3,2 milliards de dollars destiné à bâtir des infrastructures cloud d'avant-garde en Allemagne d'ici 2028. Ce plan doublera les capacités d'entraînement de serveurs d'IA du pays.\n\nCet effort s'accompagnera également d'un grand projet de formation aux technologies avancées au profit de centaines de milliers de citoyens allemands. En localisant ses centres de données directement au sein de la première économie de la zone euro, la firme américaine rassure les administrations publiques et les banques européennes exigeant un contrôle rigoureux et localisé de leurs données confidentielles.\n\nCet investissement gigantesque garantit un flux d'affaires récurrent auprès de fleurons industriels européens qui effectuent leur transition numérique vers Azure."
    },
    {
      id: "msft_news_3",
      title: "Panne mondiale Azure résolue en un temps record par les équipes",
      summary: "Un incident réseau mineur a temporairement perturbé certains services Cloud d'Azure en zone Asie-Pacifique. Les équipes techniques ont rétabli la situation en moins de deux heures, sans pénalité financière notable.",
      source: "Network Infrastructure",
      timestamp: "Il y a 5 jours",
      sentiment: "neutral",
      link: "https://finance.yahoo.com/quote/MSFT",
      fullText: "Une brève panne logicielle liée à une mise à jour mineure de sa table de routage réseau a temporairement déconnecté une partie des infrastructures cloud de Microsoft Azure en Asie de l'Est. L'alerte levée par de grands comptes professionnels a été gérée de manière chirurgicale par les ingénieurs d'astreinte.\n\nLes services critiques de Microsoft Office en ligne et de calcul ont été basculés vers des centres de données redondants en un temps record, limitant l'interruption opérationnelle globale à moins de deux heures. Selon les premiers rapports, aucun engagement contractuel de disponibilité minimale (SLA) n'a été outrepassé au-delà des plafonds de pénalités de compensation.\n\nPour les investisseurs boursiers, ce type d'événement rappelle simplement l'importance de la cyber-résilience mais s'avère sans incidence sur les fondamentaux à long terme de l'action."
    }
  ],
  NVDA: [
    {
      id: "nvda_news_1",
      title: "NVIDIA dévoile l'architecture Blackwell pour les supercalculateurs d'IA",
      summary: "Les nouveaux processeurs graphiques d'IA promettent une puissance de calcul multipliée par 30 tout en réduisant drastiquement l'empreinte énergétique globale du hardware. Les géants du web ont déjà passé des précommandes massives.",
      source: "Next-Gen Tech",
      timestamp: "Il y a 1 heure",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/NVDA",
      fullText: "Lors de sa keynote annuelle, le PDG de NVIDIA, Jensen Huang, a officiellement introduit l'architecture de puces de nouvelle génération baptisée Blackwell. Conçu spécifiquement pour entraîner et exécuter des modèles de langage de thousands of billions de paramètres, ce processeur d'IA promet une puissance hors-norme.\n\nSelon la fiche technique officielle du produit, la puce Blackwell décuple la vitesse de calcul tout en divisant par 25 la consommation d'électricité nécessaire par rapport à son prédécesseur direct H100. Des acteurs de premier plan comme Amazon, Meta, Google, Microsoft et Oracle ont d'ores et déjà réservé l'intégralité des créneaux de livraison industrielle disponibles pour les trimestres à venir.\n\nCette annonce prolonge la situation de quasi-monopole de NVIDIA sur les puces d'accélération d'IA à l'échelle planétaire, validant ainsi des prévisions financières boursières exceptionnellement agressives de la part des analystes."
    },
    {
      id: "nvda_news_2",
      title: "Pénurie persistante sur les substrats avancés d'empaquetage chez TSMC",
      summary: "Malgré une demande record pour les puces H100/H200, les tensions persistantes sur la chaîne d'approvisionnement des composants d'empaquetage avancés (CoWoS) contraignent modérément le rythme de livraison de NVIDIA.",
      source: "Semi-Weekly",
      timestamp: "Il y a 2 jours",
      sentiment: "neutral",
      link: "https://finance.yahoo.com/quote/NVDA",
      fullText: "NVIDIA se trouve actuellement confrontée à un problème d'abondance : sa croissance triomphale de ventes de semi-conducteurs ralentit d'une fraction en raison d'une capacité mondiale insuffisante d'empaquetage de haute précision chez son fondeur TSMC.\n\nL'empaquetage avancé CoWoS (Chip-on-Wafer-on-Substrate) est une technique complexe indispensable pour relier la mémoire ultra-rapide aux processeurs graphiques. Bien que TSMC étende d'urgence ses propres chaînes de fabrication en Asie, ce goulot d'étranglement signifie que NVIDIA ne peut livrer instantanément l'intégralité du carnet d'ordres cumulé de ses clients impatients.\n\nLe cours boursier a réagi de manière stable à cette nouvelle car elle démontre par défaut que la demande demeure d'une velléité insolente pour l'ensemble des catalogues de produits."
    },
    {
      id: "nvda_news_3",
      title: "Résultats fantastiques du T1 : Chiffre d'affaires en hausse de 262% sur un an",
      summary: "NVIDIA pulvérise à nouveau les estimations les plus optimistes de Wall Street avec un bénéfice net historique porté par la frénésie irrépressible d'achats chez tous les grands fournisseurs de club hyperscale.",
      source: "Wall Street Daily",
      timestamp: "Il y a 4 jours",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/NVDA",
      fullText: "NVIDIA a pulvérisé toutes les attentes du consensus lors de sa dernière communication trimestrielle. Son chiffre d'affaires a grimpé d'un incroyable taux annuel de 262 %, culminant à plus de 26 milliards de dollars générés en seulement 90 jours.\n\nLe segment porteur des centres de données, qui équipe d'immenses fermes de calcul de intelligence artificielle pour les géants du web, à lui seul récolté plus de 22 milliards de dollars. La marge brute d'exploitation s'est solidifiée à une hauteur stupéfiante de 78 %, ce qui est historiquement inouï dans le secteur des équipements physiques et industriels.\n\nCette performance retentissante confirme que la révolution de l'intelligence artificielle générative n'est pas une simple bulle spéculative mais engendre bel et bien des d'importantes ventes en infrastructures physiques."
    }
  ],
  TSLA: [
    {
      id: "tsla_news_1",
      title: "Rumeurs d'une voiture électrique grand public (Model 2) à 25 000 $",
      summary: "Tesla accélère activement ses plans d'ingénierie pour une nouvelle plateforme automobile abordable développée sous le nom de code 'Redwood'. Les usines du Texas et de Berlin ont entamé les préparatifs des lignes d'assemblage.",
      source: "Auto Électrique",
      timestamp: "Il y a 3 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/TSLA",
      fullText: "Selon des sources anonymes familières du dossier, Tesla a accéléré les efforts d'industrialisation entourant sa prochaine silhouette automobile d'entrée de gamme, officieusement baptisée 'Model 2' ou projet 'Redwood'. Ce véhicule compact viserait un tarif public ultra-compétitif de 25 000 dollars.\n\nL'introduction d'un véhicule abordable à destination des classes moyennes s'avère primordiale si Tesla souhaite maintenir ses objectifs ambitieux de hausse de volumes de livraisons globales à l'avenir. Ses deux méga-complexes industriels de production d'Austin au Texas et de Grünheide en Allemagne adapteraient progressivement leurs architectures logistiques internes pour démarrer la pré-production.\n\nLes investisseurs voient ce projet comme le catalyseur boursier définitif capable de parer à la rude concurrence imposée par les constructeurs automobiles de voitures électriques chinoises bon marché."
    },
    {
      id: "tsla_news_2",
      title: "Ralentissement passager de la Gigafactory de Berlin pour réfection technique",
      summary: "La production européenne a essuyé de légers blocages de transport combinés à des interruptions de réseau externe, ce qui va décaler temporairement quelques milliers de livraisons sur le trimestre d'après.",
      source: "Euro News Finance",
      timestamp: "Hier",
      sentiment: "negative",
      link: "https://finance.yahoo.com/quote/TSLA",
      fullText: "La gigantesque usine d'usinage de Tesla implantée près de Berlin a temporairement tourné au ralenti à la suite d'un goulot de livraison d'intrants. Ce contretemps a entraîné des suspensions momentanées de l'ensemble de la chaîne de carrosserie.\n\nBien que ce ralentissement représente une perte sèche de productivité à court terme estimée à quelques milliers de véhicules, la direction a rassuré les marchés en indiquant qu'elle en profiterait pour effectuer des opérations de maintenance logicielle et mécanique régulatrices prévues de longue date. Le manque à gagner de livraison sera rapidement compensé par une intensification des cadences de travail dès le mois prochain.\n\nLes marchés boursiers tendent à négliger ces perturbations d'approvisionnement logistique transitoires pour se focaliser sur les indicateurs de ventes et de marges globaux de long terme."
    },
    {
      id: "tsla_news_3",
      title: "La bêta FSD (Full Self-Driving) V12 impressionne la presse par sa fluidité",
      summary: "La dernière mise à jour de conduite autonome basée uniquement sur la vision par caméra et des réseaux de neurones profonds montre un comportement fluide, très proche d'un conducteur humain expérimenté.",
      source: "Autonomous Cars",
      timestamp: "Il y a 4 jours",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/TSLA",
      fullText: "La toute dernière mouture expérimentale du logiciel d'assistance à la navigation et direction autonome FSD V12, déployée auprès de milliers d'utilisateurs américains, marque une rupture technologique majeure. Elle remplace des centaines de milliers de lignes de code informatique rigides par un entraînement continu des réseaux de neurones profonds.\n\nLes testeurs les plus neutres ont souligné l'adaptation naturelle du logiciel face aux obstacles inattendus, aux ronds-points chaotiques ou aux travaux routiers complexes. Au lieu de suivre des équations cartésiennes programmées, l'IA conduit en 'imitant' la somme des heures de comportement des conducteurs professionnels les plus prudents.\n\nSi cette version obtient une homologation définitive des organismes de sécurité routière nationaux, cela pourrait débloquer un flux de trésorerie récurrent réévaluant Tesla non plus comme un simple fabricant d'acier mais comme une puissance dominante de logiciels autonomes."
    }
  ],
  GOOGL: [
    {
      id: "googl_news_1",
      title: "Intégration d'un modèle ultra-performant Gemini 1.5 Pro dans Google Workspace",
      summary: "Google améliore son offre Cloud d'entreprise avec des analyses de documents gigantesques allant jusqu'à 2 millions de tokens d'un coup. Les retours premiums clients témoignent d'un niveau d'automatisation interne historique.",
      source: "Silicon Valley Echo",
      timestamp: "Il y a 5 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/GOOGL",
      fullText: "Alphabet Inc. a concrétisé son offensive sur le front de l'intelligence artificielle professionnelle en ajoutant officiellement son fleuron de modèle multimodal Gemini 1.5 Pro au cœur des bureaux virtuels payants Google Workspace. Ce déploiement de pointe offre de larges avantages de parts de marché boursières.\n\nGrâce à une fenêtre de contexte spectaculaire acceptant jusqu'à 2 millions de jetons d'informations, l'utilisateur professionnel est en mesure de téléverser des heures de vidéo, des dizaines de PDF d'enquêtes ou l'intégralité d'un code base informatique complexe pour lui poser des questions analytiques instantanées. Les dirigeants de plusieurs administrations phares se félicitent de l'accélération immense des workflows administratifs quotidiens.\n\nCe jalon majeur assoit un profil de croissance à forte valeur ajoutée apte à convaincre les investisseurs que Google conserve une autorité indiscutable sur le marché de l'informatique professionnelle Cloud."
    },
    {
      id: "googl_news_2",
      title: "Recherche en IA : Expériences d'annonces publicitaires novatrices intégrées au chatbot",
      summary: "Le groupe de Mountain View explore de nouveaux formats publicitaires au cœur des réponses génératives de Google SGE afin d'optimiser la monétisation et la protection des parts de marché face à la concurrence des moteurs alternatifs.",
      source: "AdTech Insights",
      timestamp: "Hier",
      sentiment: "neutral",
      link: "https://finance.yahoo.com/quote/GOOGL",
      fullText: "Face à la résurgence de moteurs de recherche textuels assistés par intelligence artificielle native, Google mène des phases d'expérimentation sélective afin d'incorporer des espaces publicitaires hautement ciblés au sein même de son interface de réponses de synthèse dynamique.\n\nPlutôt que d'afficher de simples bannières adjacentes, le système de Google SGE est capable d'insérer des suggestions de produits ou de liens promotionnels contextualisés d'après la conversation engagée par l'internaute. Cette stratégie défensive est cruciale pour préserver les centaines de milliards de dollars de flux financiers de son cœur de métier d'annonces publicitaires, qui alimente sa puissance financière globale.\n\nBien que cette transition puisse susciter des réserves chez certains adeptes de pureté d'interface, la robustesse de sa part de marché boursière confère de l'optimisme aux analystes."
    },
    {
      id: "googl_news_3",
      title: "Pression accrue des instances antitrust du Département de la Justice américain (DOJ)",
      summary: "La procédure réglementaire antitrust fédérale se poursuit pour évaluer si les accords de distribution d'Alphabet pour placer Google en moteur par défaut violent la législation sur la libre concurrence.",
      source: "Legal Ledger",
      timestamp: "Il y a 4 jours",
      sentiment: "negative",
      link: "https://finance.yahoo.com/quote/GOOGL",
      fullText: "Le bras de fer historique opposant le Département de la Justice des États-Unis (DOJ) à Google est entré dans une phase d'audition d'importance nationale capitale. Les autorités fédérales reprochent à Alphabet d'étouffer indûment l'essor des moteurs rivaux en dépensant d'énormes compensations annuelles (estimées à plus de 20 milliards de dollars) auprès de partenaires clés comme Apple et Mozilla.\n\nCes contrats juteux permettent à Google de s'ériger systématiquement en tant que moteur d'interrogation de référence configuré par défaut à l'achat sur les iPhone et navigateurs web. La défense solide portée par les avocats de Mountain View soutient que son leadership découle purement de la préférence manifeste des clients et de l'excellence globale de son moteur.\n\nCe procès historique, bien qu'étalé sur des années avec des possibilités d'appels multiples, engendre un climat d'incertitude boursière quant à d'éventuelles injonctions de scission de branches d'activités à long terme."
    }
  ],
  AMZN: [
    {
      id: "amzn_news_1",
      title: "AWS déploie de nouveaux processeurs maison Trainium 2 ultra performants",
      summary: "Amazon Web Services lance sa nouvelle génération de processeurs optimisés pour l'entraînement géant de LLM, offrant une alternative économiquement viable et résistant mieux aux tensions d'approvisionnement des composants tiers.",
      source: "Infrastructure Weekly",
      timestamp: "Il y a 10 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/AMZN",
      fullText: "La branche cloud d'Amazon (AWS) a annoncé avec vigueur le déploiement opérationnel massif de son silicium propriétaire de pointe baptisé Trainium 2. Ce processeur a été optimisé spécifiquement pour soutenir l'entraînement intensif des modèles d'intelligence artificielle générative de centaines de milliards de paramètres.\n\nEn façonnant son propre matériel informatique sur mesure, AWS offre à ses millions d'utilisateurs professionnels une réduction substantielle de leurs dépenses de calcul comparativement aux coûts souvent prohibitivement exigés par l'achat de processeurs graphiques tiers en situation de forte pénurie mondiale. Ce choix garantit à Amazon de solides marges récurrentes.\n\nPour la solidité boursière d'Amazon, l'affranchissement progressif de la dépendance externe en matériel de traitement d'IA consolide grandement l'attractivité concurrentielle d'AWS à long terme."
    },
    {
      id: "amzn_news_2",
      title: "Optimisation de la logistique du 'Dernier Kilomètre' : Gains opérationnels de 12%",
      summary: "Grâce au maillage poussé de ses nouveaux centres de distribution régionaux, Amazon parvient à réduire drastiquement ses délais de livraison moyens tout en diminuant ses charges de fret direct d'une ampleur inattendue.",
      source: "E-Commerce Dispatch",
      timestamp: "Hier",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/AMZN",
      fullText: "Un rapport logistique interne publié montre l'ampleur des bénéfices issus de la réorganisation du réseau logistique de livraison d'Amazon en zones hautement autonomes et décentralisées. Cette transition a permis une réduction substantielle des temps de parcours moyens, abaissant le coût unitaire d'acheminement du dernier kilomètre.\n\nL'usage poussé d'algorithmes de prédiction d'achats locaux permet aux entrepôts régionaux d'anticiper la demande des ménages de chaque agglomération, en pré-positionnant les biens de consommation courante proches de l'adresse de destination finale de livraison. En résultent des gains d'efficacité globale de 12 % sur l'ensemble de ses charges de fret direct.\n\nLa baisse de ces charges logistiques historiques majore de manière mathématique le flux de trésorerie net disponible du géant mondial du commerce en ligne."
    },
    {
      id: "amzn_news_3",
      title: "La pression des coûts logistiques compresse légèrement les marges internationales",
      summary: "La hausse des prix des carburants dans plusieurs métropoles étrangères et l'investissement promotionnel accru face aux discounters de livraison directe engendrent une légère baisse temporaire des marges d'export.",
      source: "Retail Quarterly",
      timestamp: "Il y a 5 jours",
      sentiment: "negative",
      link: "https://finance.yahoo.com/quote/AMZN",
      fullText: "La situation d'exploitation d'Amazon en dehors d'Amérique du Nord a essuyé de légères tensions financières sous l'effet conjugué d'une revalorisation des barèmes tarifaires des prestataires routiers mondiaux liée à la fermeté des cours mondiaux du pétrole.\n\nEn parallèle, Amazon doit soutenir un programme agressif d'investissements promotionnels visant à contrer les avancées d'opérateurs d'e-commerce asiatiques à bas coûts qui multiplient les offres de livraison directe gratuites. Ces efforts ciblés de rabais sur ses abonnements ont exercé une discrète pression sur le ratio de rentabilité opérationnelle de sa branche boursière internationale.\n\nBien que ce recul soit marginal et de nature purement tactique, il incite les investisseurs défensifs à surveiller de près l'évolution des forces en présence au cours des prochains bilans d'exploitation."
    }
  ],
  NFLX: [
    {
      id: "nflx_news_1",
      title: "Nouveau record d'audiences historiques pour la série d'anticipation majeure",
      summary: "Netflix enregistre des taux de complétion de visionnage extrêmement élevés sur sa nouvelle superproduction, justifiant sa stratégie d'investissement fort dans des projets d'envergure globalisés.",
      source: "Media Watch",
      timestamp: "Il y a 6 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/NFLX",
      fullText: "Netflix a fait part d'un succès public sans précedent à l'occasion de la diffusion de sa toute nouvelle mini-série exclusive de science-fiction. Le titre a conquis des millions de spectateurs enthousiastes dans plus de 130 pays dès son week-end d'exposition.\n\nPlus que le simple nombre de lancements d'épisodes initiaux, c'est le niveau d'assiduité des téléspectateurs qui a impressionné les analystes spécialisés du monde des médias, avec un taux de complétion de visionnage de la saison complète atteignant un pourcentage formidable. Ce plébiscite conforte l'éditeur dans son orientation novatrice visant à allouer de généreux budgets à des projets artistiques mondiaux ambitieux de très haut calibre.\n\nCette capacité à répéter des événements populaires planétaires renforce durablement le pouvoir de fixation des tarifs de Netflix, rendant ses abonnés captifs et très tolérants aux révisions tarifaires."
    },
    {
      id: "nflx_news_2",
      title: "Campagne contre le partage des comptes : 10 millions de nouveaux profils convertis",
      summary: "La politique payante de partage des comptes s'avère payante avec un report de conversion spectaculaire d'utilisateurs passifs vers des offres d'abonnements solo profitant de publicités.",
      source: "Wall Street Daily",
      timestamp: "Hier",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/NFLX",
      fullText: "L'initiative phare tant contestée de Netflix restreignant l'usage d'un même mot de passe partagé en dehors d'un seul foyer familial s'est matérialisée par un immense succès de ralliement. Près de 10 millions d'utilisateurs auparavant passifs ont ainsi officiellement régularisé leur propre compte payant.\n\nLa majorité de ces nouvelles connexions s'est dirigée vers la formule d'entrée de gamme intégrant des publicités ciblées, une alternative à bas coût qui s'avère extraordinairement rentable pour Netflix grâce à l'afflux d'investisseurs publicitaires premiums avides de cibler l'attention de cette audience réactive.\n\nCe sursaut ininterrompu d'abonnements nets propulse le chiffre d'affaires à des sommets, balayant les craintes initiales des commentateurs qui présageaient des vagues d'annulations paniquées."
    },
    {
      id: "nflx_news_3",
      title: "Abonnement Standard en hausse de 1€/mois dans certains marchés européens",
      summary: "Netflix introduit une légère révision tarifaire ciblée pour soutenir sa transition vers l'offre de retransmissions de sports en direct. Les analystes surveillent la réaction de fidélisation du parc existant.",
      source: "Courrier Financier",
      timestamp: "Il y a 3 jours",
      sentiment: "neutral",
      link: "https://finance.yahoo.com/quote/NFLX",
      fullText: "Netflix a annoncé l'entrée en vigueur imminente d'un ajustement de tarif ciblé sur ses forfaits Standard et Premium de sa clientèle résidant en Europe de l'Ouest, se traduisant par un prélèvement additionnel de un euro mensuel.\n\nLes porte-paroles de la plateforme audiovisuelle expliquent que cette infime marge boursière financera l'intégration d'événements de diffusions de sports d'envergure internationale en temps réel. En diversifiant sa programmation culturelle avec du divertissement en direct, Netflix élargit son attrait auprès d'une cible de consommateurs masculins d'habitude moins enclins à souscrire des services par abonnement.\n\nBien que toute indexation tarifaire comporte le risque d'engendrer un certain mécontentement, la position hégémonique de Netflix lui confère une immunité solide face à de massifs taux de désabonnements concurrentiels."
    }
  ],
  COIN: [
    {
      id: "coin_news_1",
      title: "Les volumes de négociation institutionnels s'envolent de 145% au T1",
      summary: "La plateforme bénéficie pleinement de l'afflux des investisseurs institutionnels canalisé par les lancements récents d'ETFs Bitcoin physiques. Les revenus de garde d'actifs et de frais de courtage grimpent en flèche.",
      source: "Crypto Bull",
      timestamp: "Il y a 12 heures",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/COIN",
      fullText: "Le leader de l'échange de cyberactifs Coinbase Global Inc. a partagé un bilan financier flamboyant témoignant du retour tonitruant des grands fonds d'investissement au cœur des transactions spéculatives de monnaies cryptographiques.\n\nLe volume d'échanges d'importance institutionnelle a bondi d'un impressionnant taux de 145 % par rapport au premier trimestre de l'année antérieure. Ce regain s'explique par l'entrée en scène d'instruments financiers d'ETFs Bitcoin physiques qui réclament des prestations de garde à froid de haute technicité sécuritaire que Coinbase preste pour la quasi-totalité des banques d'affaires émettrices.\n\nCe rôle d'infrastructure de référence garantit des marges confortables, même lors des phases de replis temporaires de cours où les volumes de courtage d'épargnants amateurs de cryptomonnaies refluent occasionnellement."
    },
    {
      id: "coin_news_2",
      title: "Obtention officielle d'une licence restreinte d'enregistrement au Canada",
      summary: "Dans le cadre de son offensive d'expansion internationale, Coinbase sécurise une position solide vis-à-vis des juridictions nord-américaines en respectant intégralement les exigences prudentielles canadiennes.",
      source: "RegTech Alert",
      timestamp: "Hier",
      sentiment: "positive",
      link: "https://finance.yahoo.com/quote/COIN",
      fullText: "Coinbase a franchit une étape fondamentale dans son plan d'expansion territoriale hors des restrictions parfois oppressives du territoire américain, en décrochant avec succès son agrément réglementaire de courtier inscrit auprès des Autorités canadiennes en valeurs mobilières (ACVM).\n\nCe précieux sauf-conduit officiel confère à la plateforme l'habilitation nécessaire pour opérer et distribuer tous ses services de négociation et de staking de manière pleinement certifiée au Canada. Cette victoire atteste de la rigueur prudentielle et de la conformité de haut niveau de l'entreprise qui accepte de se prêter volontairement aux audits gouvernementaux les plus exigeants.\n\nCe positionnement vertueux détonne face aux concurrents de la finance décentralisée informelle et attire une fidèle clientèle cherchant des garanties de dépôt sûres."
    },
    {
      id: "coin_news_3",
      title: "Le bras de fer réglementaire se poursuit activement contre la SEC",
      summary: "L'autorité fédérale américaine maintient formellement son action civile contre la nature de certains protocoles de staking intégrés à Coinbase, une procédure de longue haleine suivie de très près par les juristes du milieu.",
      source: "Legal Ledger",
      timestamp: "Il y a 6 jours",
      sentiment: "negative",
      link: "https://finance.yahoo.com/quote/COIN",
      fullText: "Le litige de fond opposant formellement l'organisme fédéral américain de surveillance des bourses (la SEC) à Coinbase se poursuit avec âpreté devant les tribunaux fédéraux de Manhattan. L'organisme cherche à prouver que le staking de crypto-monnaies constitue une vente dissimulée d'actifs financiers non enregistrés.\n\nLa ligne de défense acharnée orchestrée par la direction de l'échange de jetons numériques soutient au contraire que ces processus de consensus cryptographiques participent au bon fonctionnement informatique intrinsèque des blockchains décentralisées, s'écartant foncièrement de la définition traditionnelle d'une valeur mobilière définie en 1946.\n\nBien que ce contentieux juridique s'annonce particulièrement onéreux en honoraires d'avocats et suscite des sursauts de volatilité boursière bimensuels, les juristes spécialisés estiment que Coinbase dispose d'excellents arguments de plaidoirie pour obtenir un verdict favorable."
    }
  ]
};

// Simple on-server memory cache to fully isolate Gemini model rate-limiting occurrences
const newsCache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes of solid cache time
let last429Time = 0; // Tracks when Gemini 429/quota exhaustion errors last occurred

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

// Parses core information from Yahoo RSS feed XML when Gemini is offline or rate-limited
function parseYahooRSS(xmlText: string, symbol: string): any[] {
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

    const title = titleMatch ? decodeXmlEntities(titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')) : "Actualités boursières";
    const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : `https://finance.yahoo.com/quote/${symbol}`;
    const pubDateStr = pubDateMatch ? pubDateMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : "Récemment";
    const source = sourceMatch ? decodeXmlEntities(sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')) : "Yahoo Finance";
    const desc = descMatch ? decodeXmlEntities(descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '')) : "";

    // Parse relative time in French
    let relativeTime = pubDateStr;
    try {
      const d = new Date(pubDateStr);
      if (!isNaN(d.getTime())) {
        const diffMs = Date.now() - d.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) {
          relativeTime = "Il y a moins d'une heure";
        } else if (diffHours === 1) {
          relativeTime = "Il y a 1 heure";
        } else if (diffHours < 24) {
          relativeTime = `Il y a ${diffHours} heures`;
        } else {
          relativeTime = d.toLocaleDateString("fr-FR");
        }
      }
    } catch {}

    items.push({
      id: `${symbol.toLowerCase()}_rss_${count}_` + Math.floor(Date.now() / 1000),
      title: title,
      summary: desc || `Nouvelles boursières en direct pour ${symbol}.`,
      source: source || "Yahoo Finance",
      timestamp: relativeTime,
      sentiment: "neutral",
      link: link,
      fullText: `${title}\n\n${desc || "Pas de description supplémentaire disponible."}\n\nCet article provient d'une source d'informations financières référencée. En raison d'un grand nombre de demandes de simulations IA (quota journalier temporairement atteint), nous vous présentons le flux direct original.`
    });
    count++;
  }
  return items;
}

// Smart Local Fallback Response Engine with multi-language support for resilience
function getOfflineFinancialResponse(message: string, lang?: string): string {
  const query = message.toLowerCase();
  const isEn = lang === "en" || query.includes("what is") || query.includes("how to") || query.includes("explain") || query.includes("hello") || query.includes("hi ");
  const isEs = lang === "es" || query.includes("que es") || query.includes("qué es") || query.includes("como") || query.includes("cómo") || query.includes("hola");
  const isDe = lang === "de" || query.includes("was ist") || query.includes("wie");
  const isPt = lang === "pt" || query.includes("o que é") || query.includes("olá");
  const isZh = lang === "zh";

  if (query.includes("etf") || query.includes("tracker") || query.includes("diversif") || query.includes("basket") || query.includes("panier") || query.includes("fond")) {
    if (isEn) {
      return `### 📌 What is an ETF (Exchange-Traded Fund)?
An **ETF (Exchange-Traded Fund)** or *tracker* is an investment fund traded on a stock exchange like an individual stock. Its primary goal is to replicate the performance of a specific financial index, commodity, bond basket, or economic sector.

---

### ⚙️ How ETFs Work
When you buy a single share of an ETF (such as an S&P 500 ETF), your capital is instantly spread across hundreds or thousands of underlying assets:
1. **Creation/Redemption Mechanism**: Authorized participants create or redeem ETF shares in large blocks to ensure the market price stays aligned with the Net Asset Value (NAV).
2. **Real-Time Liquidity**: Unlike traditional mutual funds (which are priced once a day after market close), ETFs can be bought and sold continuously throughout market hours.
3. **Passive Index Replication**: Most ETFs track an existing index with minimal management turnover, keeping ongoing costs extremely low.

---

### 📊 Concrete Example
Suppose you invest **$1,000** into an S&P 500 ETF:
* Your $1,000 is automatically divided across the top 500 US companies (approx. $70 in Apple, $65 in Microsoft, $60 in Nvidia, and smaller fractions in the remaining 497 firms).
* If a single company encounters difficulties, the overall impact on your $1,000 portfolio is cushioned by the performance of the rest of the market.
* **Annual Fees (TER)**: Typically **0.03% to 0.20% per year** (costing only $0.30 to $2.00/year on a $1,000 investment, compared to $15–$25 for traditional active funds).

---

### ⚖️ Key Advantages & Considerations
* 🌐 **Instant Broad Diversification**: Global exposure in a single transaction.
* 💸 **Ultra-Low Expense Ratios**: Preserves compounding returns over 10, 20, or 30 years.
* 🔄 **Reinvestment Options**: Available in **Accumulating (Acc)** (dividends automatically reinvested) or **Distributing (Dist)** (dividends paid as cash).
* ⚠️ **Market Risk**: An ETF reduces company-specific risk, but still fluctuates with overall market downturns.

---

### 🛡️ Investor Best Practice
For long-term investors, Dollar-Cost Averaging (DCA) into broad-market ETFs (e.g., MSCI World or S&P 500) remains one of the most statistically robust wealth-building strategies.

_Disclaimer: Educational information only; does not constitute personalized financial advice or investment recommendations._`;
    }
    return `### 📌 Qu'est-ce qu'un ETF (Exchange-Traded Fund) ou Tracker ?
Un **ETF (Exchange-Traded Fund)**, aussi appelé **Tracker** ou fonds indiciel coté, est un instrument financier qui réplique fidèlement les variations d'un indice boursier de référence (comme le **S&P 500**, le **CAC 40** ou le **MSCI World**). 

Il combine la simplicité de négociation d'une action ordinaire avec la sécurité de diversification d'un portefeuille complet.

---

### ⚙️ Comment fonctionne un ETF en pratique ?
1. **La réplication d'indice** : Le gestionnaire du fonds (BlackRock iShares, Amundi, Vanguard, etc.) achète l'ensemble des actions composant l'indice dans les proportions exactes pour que la valeur de l'ETF suive parfaitement l'indice.
2. **Cotation en continu** : Contrairement aux OPCVM ou fonds mutuels traditionnels (qui ne sont valorisés qu'une seule fois par jour à la clôture), un ETF s'achète et se vend en temps réel tout au long de la séance boursière.
3. **Distribution vs Capitalisation** :
   * **ETF Capitalisant (Acc)** : Les dividendes perçus sont automatiquement réinvestis dans le fonds, démultipliant l'effet des intérêts composés sans frottement fiscal immédiat.
   * **ETF Distribuant (Dist)** : Les dividendes sont versés périodiquement sur le compte espèces de l'investisseur sous forme de rente.

---

### 📊 Exemple concret et chiffré
Imaginons un investissement de **1 000 €** dans un ETF répliquant le S&P 500 :
* Votre capital de 1 000 € est instantanément ventilé entre 500 multinationales (environ 70 € chez Apple, 65 € chez Microsoft, 60 € chez Nvidia, etc.).
* Si une entreprise fait faillite, l'impact sur votre épargne totale reste marginal (moins de 0,5 %), alors que la faillite d'une action détenue en direct aurait causé une perte majeure.
* **Frais de gestion (TER)** : Entre **0,05 % et 0,25 % par an** (soit seulement 0,50 € à 2,50 € par an pour 1 000 € investis, contre 15 € à 25 € pour un fonds bancaire classique à 1,5–2,5 %).

---

### ⚖️ Avantages majeurs & Points de vigilance
* 🌐 **Diversification maximale instantanée** : Réduit le risque spécifique lié à une entreprise isolée.
* 💸 **Frais historiquement bas** : Permet de maximiser le rendement net sur le long terme (horizon 5 à 15 ans).
* 📈 **Surperformance historique** : Sur 10 ans, plus de 85 % des fonds gérés activement sous-performent leur indice de référence après déduction des frais.
* ⚠️ **Risque de marché systémique** : L'ETF protège contre le risque d'une faillite individuelle, mais baisse si l'ensemble de l'économie ou du marché traverse une récession.

---

### 🛡️ Bonne pratique pour l'investisseur
Une méthode très populaire est le **DCA (Dollar-Cost Averaging)** : investir un montant fixe (ex. 100 € ou 200 €) chaque mois sur un ETF mondial, ce qui lisse le prix d'achat moyen et élimine le stress lié au timing du marché.

_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._`;
  }

  if (query.includes("dividend") || query.includes("coupon") || query.includes("rendement") || query.includes("dividende")) {
    if (isEn) {
      return `### 📌 What is a Dividend?
A **dividend** is a distribution of a portion of a company's earnings, decided by the board of directors, to a class of its shareholders. It represents a direct cash return on capital invested in a profitable corporation.

---

### ⚙️ Mechanics & Key Concepts
1. **Declaration Date**: The company announces the dividend amount per share and relevant dates.
2. **Ex-Dividend Date**: The cutoff date. To receive the dividend, you must own the stock *before* the market opens on this date.
3. **Payment Date**: The date when cash is deposited into the shareholder's brokerage account.
4. **The Dividend Yield Formula**:
   $$\\text{Dividend Yield} = \\frac{\\text{Annual Dividend Per Share}}{\\text{Current Stock Price}} \\times 100$$

---

### 📊 Concrete Example
* A stock trades at **$100** and pays a quarterly dividend of **$1.00** ($4.00 annually).
* **Dividend Yield** = $(4 / 100) \\times 100 = \\mathbf{4.0\\%}$.
* If you own 50 shares ($5,000 invested), you receive **$200 per year** ($50 every quarter) in passive income.
* **The Compounding Snowball**: If you use a Dividend Reinvestment Plan (DRIP) to automatically buy fractional shares with your $200 payouts, your share count grows each year, creating an accelerating compounding curve.

---

### ⚖️ Advantages & Red Flags to Watch
* 💰 **Steady Income Stream**: Provides liquidity without needing to sell shares.
* 🏛️ **Company Health Indicator**: Mature, cash-flow-positive firms (e.g. Dividend Aristocrats with 25+ consecutive years of dividend increases) tend to have lower share price volatility.
* ⚠️ **The "Yield Trap" Danger**: An unusually high yield (e.g. 12%+) often signals that the stock price has collapsed due to underlying business distress, meaning a dividend cut is likely imminent.

_Disclaimer: Educational information only; does not constitute personalized financial advice._`;
    }
    return `### 📌 Qu'est-ce qu'un Dividende en Bourse ?
Un **dividende** est la part du bénéfice net qu'une entreprise décide de reverser périodiquement à ses actionnaires pour rémunérer le capital qu'ils ont investi.

---

### ⚙️ Le calendrier et les mécanismes indispensables
1. **La date d'annonce** : L'assemblée générale des actionnaires vote le montant du dividende proposé par le conseil d'administration.
2. **La date de détachement (Ex-Date)** : C'est la date charnière. Pour avoir droit au dividende, vous devez détenir l'action la veille au soir de la clôture des marchés. Le matin du détachement, le cours de l'action s'ajuste mécaniquement à la baisse du montant exact du dividende versé.
3. **La date de mise en paiement** : C'est le jour où l'argent liquide est effectivement crédité sur votre compte boursier.
4. **Le Rendement du dividende (Dividend Yield)** :
   $$\\text{Rendement (\\%)} = \\frac{\\text{Dividende annuel par action}}{\\text{Cours actuel de l'action}} \\times 100$$

---

### 📊 Exemple concret et chiffré
Prenons une société dont l'action cote **50 €** et qui verse un dividende annuel de **2,50 €** par action :
* **Rendement** : $(2,50 / 50) \\times 100 = \\mathbf{5,0\\;\\%}$ par an.
* Si vous possédez 100 actions (5 000 € investis), vous encaissez **250 € par an** de revenus passifs.
* **L'effet boule de neige (intérêts composés)** : Si vous réinvestissez ces 250 € pour acheter 5 nouvelles actions, l'année suivante vous posséderez 105 actions qui généreront 262,50 €, et ainsi de suite.

---

### ⚖️ Avantages & Pièges à éviter
* 💰 **Revenu passif prévisible** : Permet de générer des flux de trésorerie sans avoir à vendre ses titres.
* 🏆 **Les "Aristocrates du Dividende"** : Entreprises renommées (comme Coca-Cola, Sanofi, LVMH, Johnson & Johnson) ayant augmenté leur dividende chaque année depuis plus de 25 ans consécutifs.
* ⚠️ **Le piège du dividende trop élevé (Yield Trap)** : Un rendement artificiellement exorbitant (ex. 12 % ou 15 %) est souvent le signe d'un cours en chute libre et d'une entreprise en difficulté dont le dividende risque d'être coupé prochainement.
* 📊 **Le ratio de distribution (Payout Ratio)** : Vérifiez que l'entreprise ne distribue pas plus de 60 à 75 % de ses bénéfices, afin de conserver de la trésorerie pour réinvestir dans son développement.

_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._`;
  }

  if (query.includes("ordre") || query.includes("order") || query.includes("buy") || query.includes("sell") || query.includes("acheter") || query.includes("vendre") || query.includes("limite") || query.includes("limit") || query.includes("market")) {
    if (isEn) {
      return `### 📌 Market Orders vs Limit Orders
When executing trades in financial markets, choosing the right order type is essential to control your execution price and timing.

---

### 1. ⚡ Market Order (Au Marché)
* **Definition**: An instruction to buy or sell immediately at the best currently available market price.
* **Pros**: Execution is guaranteed instantly with top priority in the order book.
* **Cons**: No price control. In fast-moving or volatile markets, slippage can result in paying a higher price than expected.
* **Best used for**: High-liquidity large-cap stocks when speed of entry/exit matters most.

---

### 2. 🎯 Limit Order (Ordre Limite)
* **Definition**: An instruction to buy only at or below a specified maximum price, or sell at or above a specified minimum price.
* **Pros**: Total price certainty. You will never pay more (or receive less) than your target limit.
* **Cons**: No execution guarantee. If the market fails to reach your target price, the order remains unfilled.
* **Best used for**: Setting strategic entry levels, managing disciplined trading, and avoiding volatility spikes.

---

### 3. 🛡️ Risk Management: Stop-Loss & Take-Profit
* **Stop-Loss**: Automatically triggers a market sale if the price drops to a defined threshold (e.g. -5%), capping maximum loss.
* **Take-Profit**: Automatically locks in gains once a target profit level is achieved.

_Disclaimer: Educational information only, not financial advice._`;
    }
    return `### 📌 Comprendre les Ordres de Bourse : Marché vs Limite
Pour exécuter des transactions sur les marchés financiers avec maîtrise, il est indispensable de connaître les différents types d'ordres de bourse et leurs cas d'application.

---

### 1. ⚡ L'Ordre au Marché (Market Order)
* **Principe** : Vous demandez l'exécution immédiate de votre transaction au meilleur prix disponible instantanément sur le carnet d'ordres.
* **Avantages** : Priorité absolue d'exécution. Votre ordre est exécuté à la milliseconde sans délai d'attente.
* **Inconvénients** : Vous n'avez aucune garantie sur le prix final exact. En période de forte volatilité, un glissement de cours (*slippage*) peut survenir.
* **Quand l'utiliser** : Sur les grandes valeurs très liquides (Apple, TotalEnergies) lorsque votre priorité est d'entrer ou sortir immédiatement de position.

---

### 2. 🎯 L'Ordre à Cours Limité (Limit Order)
* **Principe** : Vous définissez un prix plafond à l'achat (ou un prix plancher à la vente).
* **Avantages** : Maîtrise totale du prix d'exécution. Vous avez l'assurance absolue de ne jamais payer plus cher que votre seuil fixé.
* **Inconvénients** : Aucune garantie d'exécution. Si le cours ne descend jamais jusqu'à votre limite, l'ordre expire sans être exécuté.
* **Quand l'utiliser** : Idéal pour acheter lors de replis techniques ciblés ou pour négocier des titres plus volatils.

---

### 3. 🛡️ Les Ordres de Protection : Stop-Loss et Take-Profit
* **Le Stop-Loss (Ordre Stop)** : Seuil de coupure automatique qui déclenche une vente si le cours chute en dessous d'un niveau critique (ex. -5 % ou -8 %), protégeant votre capital contre les pertes incontrôlées.
* **Le Take-Profit** : Clôture automatiquement la position dès que votre objectif de gain est atteint pour sécuriser vos bénéfices.

💡 *Conseil : Dans le simulateur Finance Bridge, entraînez-vous à combiner ordres limites et stop-loss pour acquérir les réflexes des gestionnaires professionnels.*

_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._`;
  }

  if (query.includes("pe ") || query.includes("per") || query.includes("p/e") || query.includes("ratio") || query.includes("valorisation") || query.includes("valuation")) {
    if (isEn) {
      return `### 📌 Understanding the P/E Ratio (Price-to-Earnings)
The **P/E Ratio (Price-to-Earnings Ratio)** is one of the most widely referenced valuation multiples in fundamental equity analysis. It measures how much investors are willing to pay for each dollar of annual net profit generated by a company.

---

### ⚙️ The Mathematical Formula
$$\\text{P/E Ratio} = \\frac{\\text{Current Stock Price}}{\\text{Earnings Per Share (EPS)}}$$
*Or equivalently:* $\\text{Market Capitalization} / \\text{Total Net Income}$.

---

### 📊 How to Interpret P/E Multiples
* 📉 **Low P/E (< 15x)**: The company may be undervalued, or it operates in a mature, capital-intensive, slow-growth industry (banking, energy, utilities).
* ⚖️ **Moderate P/E (15x – 25x)**: Typical range for established companies with steady, reliable growth matching the broader economy.
* 📈 **High P/E (> 30x)**: The market expects strong double-digit revenue and earnings expansion in upcoming years (frequent in Artificial Intelligence, Cloud Software, and Biotechnology).
* ❓ **Negative P/E / N/A**: The company is currently unprofitable (net loss).

---

### ⚖️ Practical Example & Rules
Suppose **Company A** trades at $120 with an EPS of $6 (P/E = 20x), while **Company B** in the same sector trades at $100 with an EPS of $2.50 (P/E = 40x). Company B is twice as expensive relative to its current earnings, which is only justified if its future growth rate is substantially faster.

* **Golden Rule**: Always compare a company's P/E to:
  1. Its direct competitors in the same industry.
  2. Its own 5-year historical average P/E.
  3. Its projected growth rate via the **PEG Ratio** (P/E divided by annual earnings growth rate).

_Disclaimer: Educational information only, not financial advice._`;
    }
    return `### 📌 Comprendre le PER (Price-to-Earnings Ratio / Ratio Cours/Bénéfice)
Le **PER (Price-to-Earnings Ratio)**, ou ratio cours sur bénéfice, est l'indicateur fondamental de référence utilisé par les analystes financiers pour évaluer le niveau de valorisation d'une action.

Il indique combien d'euros les investisseurs sont prêts à payer pour obtenir 1 euro de bénéfice net annuel réalisé par l'entreprise.

---

### ⚙️ La Formule Mathématique
$$\\text{PER} = \\frac{\\text{Cours de l'action}}{\\text{Bénéfice Net Par Action (BNPA)}}$$
*Ou de manière équivalente :* $\\text{Capitalisation boursière} / \\text{Bénéfice net total}$.

---

### 📊 Comment interpréter les différents niveaux de PER ?
* 📉 **PER bas (< 12–15)** : L'action est potentiellement bon marché (sous-évaluée), ou appartient à un secteur traditionnel, cyclique et mature (banques, énergie, télécoms, automobile).
* ⚖️ **PER moyen (15 à 25)** : Zone standard correspondant aux entreprises de qualité avec une croissance régulière alignée sur celle de l'économie mondiale.
* 📈 **PER élevé (> 30–50+)** : Les marchés anticipent une accélération massive des bénéfices dans les années futures (très courant dans la Tech, le Cloud et l'IA comme Nvidia ou Microsoft).
* 🚫 **PER négatif ou non défini** : L'entreprise est actuellement déficitaire (bénéfice net négatif).

---

### 🔍 Les 3 Règles d'Or pour une analyse rigoureuse
1. **La comparaison sectorielle** : Ne comparez jamais le PER d'une entreprise technologique (ex. 35) avec celui d'un groupe pétrolier (ex. 8). Comparez toujours des concurrents directs dans le même domaine d'activité.
2. **Le ratio PEG (Price/Earnings-to-Growth)** : Un PER de 30 n'est pas forcément cher si l'entreprise augmente ses bénéfices de 30 % par an (PEG = 1, ce qui reste équilibré).
3. **Le PER prévisionnel (*Forward P/E*)** : Calcule le ratio sur la base des bénéfices estimés de l'année à venir plutôt que sur l'exercice passé.

_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._`;
  }

  if (query.includes("volat") || query.includes("risk") || query.includes("risque") || query.includes("lose") || query.includes("crash") || query.includes("perte")) {
    if (isEn) {
      return `### 📌 Volatility & Risk Management in Financial Markets
**Volatility** measures the speed, frequency, and magnitude of price swings of a financial asset over a given timeframe. High volatility indicates large and rapid price fluctuations in either direction.

---

### ⚙️ How Risk is Quantified
1. **Standard Deviation**: Measures how widely prices disperse around their historical average.
2. **Beta Ratio**: Measures a stock's sensitivity relative to the broader market:
   * **Beta = 1.0**: The stock moves in sync with the index.
   * **Beta > 1.3**: Higher volatility (e.g. high-beta tech or crypto-linked assets like TSLA or COIN).
   * **Beta < 0.8**: Defensive characteristics (consumer staples, utilities).
3. **Maximum Drawdown**: The peak-to-trough decline experienced by an asset or portfolio.

---

### 🛡️ The 4 Pillars of Disciplined Risk Management
* 🌐 **Structural Diversification**: Combine uncorrelated asset classes (equities, bonds, commodities, cash reserves) across global geographies.
* 📏 **Position Sizing Rule**: Never allocate more than 2% to 5% of total portfolio risk to a single high-volatility trade.
* 🛑 **Stop-Loss Execution**: Define your maximum acceptable exit point *before* entering any position to prevent emotional decisions.
* ⏳ **Long-Term Time Horizon**: Over 10-year rolling periods, broad-market equity indices historically smooth out severe short-term recessions.

_Disclaimer: Educational information only, not financial advice._`;
    }
    return `### 📌 Maîtriser la Volatilité et la Gestion du Risque en Bourse
La **volatilité** désigne l'ampleur et la rapidité des variations du cours d'un actif financier sur une période donnée. Une forte volatilité signifie que les prix peuvent monter très vite, mais aussi chuter brusquement.

---

### ⚙️ Comment mesure-t-on le risque d'un titre ?
1. **L'Écart-type** : Mesure statistique de la dispersion des rendements autour de leur moyenne historique.
2. **Le coefficient Bêta (β)** : Mesure la sensibilité d'une action par rapport aux mouvements de son indice :
   * **Bêta = 1,0** : Le titre réagit exactement comme le marché.
   * **Bêta > 1,3** : Titre très réactif et volatil (ex. Tesla, Nvidia, Coinbase).
   * **Bêta < 0,8** : Titre défensif et plus stable (ex. Danone, Air Liquide, Sanofi).
3. **Le Drawdown maximal** : La baisse maximale enregistrée entre le plus haut sommet et le point le plus bas d'un cycle de marché.

---

### 🛡️ Les 4 Piliers pour protéger son portefeuille
* 🌐 **La diversification sectorielle et géographique** : Répartissez vos investissements sur différents secteurs (Tech, Santé, Énergie, Biens de consommation) et zones géographiques (USA, Europe, Marchés émergents).
* 📏 **La règle du dimensionnement de position (Position Sizing)** : Ne risquez jamais plus de 1 à 2 % de votre capital total sur une seule transaction spéculative.
* 🛑 **La pose de Stop-Loss systématique** : Définissez à l'avance votre seuil d'invalidation (ex. -6 %) et coupez vos pertes sans hésitation émotionnelle.
* ⏳ **L'horizon de placement long terme** : Sur des durées de 8 à 15 ans, la croissance de l'économie mondiale et les réinvestissements de dividendes absorbent les krachs et fluctuations temporaires.

_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._`;
  }

  if (isEn) {
    return `### 👋 Welcome to Finance Bridge AI!
I am your interactive, neutral financial education mentor. 🎯

Whether you are just getting started with virtual trading or looking to deepen your market knowledge, feel free to ask me comprehensive questions on:
* 🌐 **ETFs, Index Funds & Asset Allocation**
* 📊 **Financial Ratios & Valuation Models (P/E, EV/EBITDA, Free Cash Flow)**
* 💰 **Dividend Strategies & Compounding Dynamics**
* ⚡ **Order Types (Market, Limit, Stop-Loss, Trailing Stops)**
* 📈 **Technical Analysis, Chart Patterns & Indicators (RSI, MACD, Moving Averages)**
* 🛡️ **Portfolio Risk Management & Volatility Control**

How can I assist your financial learning journey today?

_Disclaimer: Educational content only, not financial advice._`;
  }

  if (isEs) {
    return `### 👋 ¡Bienvenido a Finance Bridge AI!
Soy tu tutor financiero interactivo y neutral. 🎯

Estoy a tu disposición para explicarte en profundidad conceptos como:
* 🌐 **ETFs, Fondos Indexados y Diversificación Global**
* 📊 **Ratios de Valoración (PER, Flujo de Caja Libre, Crecimiento)**
* 💰 **Estrategias de Dividendos e Interés Compuesto**
* ⚡ **Tipos de Órdenes Bursátiles (Mercado, Límite, Stop-Loss)**
* 📈 **Análisis Técnico y Fundamental**
* 🛡️ **Gestión del Riesgo y Volatilidad**

¿Qué tema financiero o estrategia te gustaría explorar en detalle hoy?

_Aviso: Información educativa, no constituye asesoramiento financiero oficial._`;
  }

  return `### 👋 Bienvenue sur Finance Bridge AI !
Je suis votre coach et tuteur pédagogique en éducation financière et boursière. 🎯

Je suis conçu pour vous apporter des explications complètes, structurées et détaillées sur l'ensemble des marchés financiers :

* 🌐 **Les ETF et l'investissement indiciel passif** (MSCI World, S&P 500, CAC 40)
* 📊 **Les ratios financiers et la valorisation** (PER, BPA, Free Cash Flow, Dette/EBITDA)
* 💰 **Les stratégies de dividendes et la puissance des intérêts composés**
* ⚡ **Les mécanismes d'ordres boursiers** (Marché, Limite, Stop-Loss, Trailing Stops)
* 📈 **L'analyse technique et graphique** (Supports/Résistances, RSI, MACD, Moyennes mobiles)
* 🛡️ **La gestion du risque, la diversification et la volatilité**

Quelle notion ou stratégie financière souhaitez-vous approfondir aujourd'hui ?`;
}

export const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API Route: AI Chat Advice (Streaming over Server-Sent Events for lowest latency)
app.post(["/api/chat", "/chat"], async (req, res) => {
    const { message, history, lang, image } = req.body;
    try {
      if (!message && !image) {
        res.status(400).json({ error: "Le message ou une image est obligatoire." });
        return;
      }

      // Proactively bypass if Gemini is in a 429/billing cooldown, is permanently disabled, or no API key is set
      const isInCooldown = (Date.now() - last429Time) < 10 * 60 * 1000;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || isInCooldown || isGeminiDisabledPermanently) {
        throw new Error("La clé d'API Gemini est absente, désactivée en raison de restrictions de permissions, ou en période de refroidissement temporaire (crédits épuisés).");
      }

      const client = getAIClient();

      // Convert history to system format if provided
      const systemInstruction = `You are "Finance Bridge AI", an elite, friendly, pedagogical, and strictly neutral virtual financial educator and market analyst.

CRITICAL DIRECTIVES:
1. STRICT BAN ON INDIVIDUAL STOCK RECOMMENDATIONS: You are STRICTLY PROHIBITED from recommending, advising, or telling users to buy, sell, or hold specific individual stocks, cryptocurrencies, or securities (e.g. never say "You should buy Apple / Nvidia" or "I recommend investing in X"). 
   - If the user asks for stock tips, which stock to buy, or asks "Should I buy [Stock]?", you MUST clearly state that you cannot provide personalized investment advice or recommend specific stocks.
   - Instead, guide them by explaining objective analysis methods, fundamental metrics (P/E ratio, Free Cash Flow, revenue growth, debt levels, competitive advantage/moat), technical indicators, diversification principles, and risk management so they can make their own informed decisions.

2. ADAPTIVE DEPTH & THOROUGH EXPLANATIONS (HIGH PRIORITY):
   - SIMPLE / GREETING QUERIES: For basic greetings (e.g. "Bonjour", "Hello") or quick single-number lookups, provide a concise, direct, and warm response.
   - IN-DEPTH / COMPLEX QUESTIONS: Whenever the user asks to explain a financial concept, an economic indicator, a market mechanism, a trading strategy, a valuation model, technical/fundamental analysis, risk management, an asset class (ETFs, options, bonds, crypto, commodities), or asks a question requiring deep understanding (or specifically asks for a detailed answer):
     * **PROVIDE A RICH, COMPREHENSIVE, AND DETAILED EXPLANATION.** Do not artificially condense or truncate important nuances.
     * Organize the explanation with clear markdown structure:
       - 📌 **Définition & Contexte** : Clear overview and conceptual framing.
       - ⚙️ **Mécanisme & Fonctionnement détaillé** : Step-by-step mechanics, formulas (with clear notation), or workflows.
       - 📊 **Exemple concret & Chiffré** : Realistic scenarios with numbers and calculations (e.g. investing $1,000, calculations of returns, P/E multiples, compounding over time).
       - ⚖️ **Avantages & Risques / Limites** : Comprehensive breakdown of benefits, drawbacks, and market traps.
       - 🛡️ **Bonnes pratiques & Méthodologie** : Actionable, prudent guidance for retail investors.

3. LANGUAGE MATCHING (TOP PRIORITY):
   - You MUST ALWAYS detect and respond in the EXACT SAME LANGUAGE as the user's question (e.g. French if asked in French, English if asked in English, Spanish if asked in Spanish, German if asked in German, Portuguese if asked in Portuguese, Chinese if asked in Chinese, etc.). Never switch languages unexpectedly.

4. FORMATTING & READABILITY:
   - Use clean Markdown with headers (###), bullet points, numbered lists, bold key terms, blockquotes, and relevant emojis to make long text pleasant and easy to scan.

5. DISCLAIMER:
   - Always conclude responses discussing market strategies with a short educational disclaimer in the user's language (e.g. "_Avertissement : Les informations éducatives fournies ne constituent en aucun cas des conseils financiers ou des recommandations d'investissement._" in French, or "_Disclaimer: Educational information only; does not constitute financial advice or investment recommendations._" in English).`;

      // We can use a single generateContent call with history mapped to clear roles or simple chat
      // To keep it highly performant and flexible:
      let prompt = "";
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          const roleName = msg.sender === 'user' ? 'Utilisateur' : 'Finance Bridge AI';
          prompt += `${roleName}: ${msg.text}\n`;
        });
      }
      const userText = message ? String(message).trim() : (image ? "Veuillez analyser cette image / ce graphique boursier ou financier et expliquer ses éléments clés de manière pédagogique et approfondie." : "");
      prompt += `Utilisateur: ${userText}\nFinance Bridge AI:`;

      let contents: any;
      if (image && typeof image === "string") {
        const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          contents = [
            {
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            },
            {
              text: prompt
            }
          ];
        } else {
          contents = prompt;
        }
      } else {
        contents = prompt;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const responseStream = await generateContentStreamWithRetry(client, {
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Gemini API Error in /api/chat route:", error);
      
      // Fallback Stream to Salvage User Experience Perfectly
      try {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.flushHeaders();
        }

        console.log(`[Chat API] Activating local educational fallback stream for message: "${message ? message.substring(0, 30) : ""}" (lang: ${lang || 'auto'})`);
        const fallbackText = getOfflineFinancialResponse(message || "", lang);
        
        // Split text into words and stream dynamically
        const words = fallbackText.split(" ");
        let currentWordIndex = 0;
        
        const interval = setInterval(() => {
          if (currentWordIndex >= words.length) {
            clearInterval(interval);
            try {
              res.write("data: [DONE]\n\n");
              res.end();
            } catch {}
            return;
          }
          
          // chunk of 3-4 words for smooth stream replication
          const chunk = words.slice(currentWordIndex, currentWordIndex + 4).join(" ") + " ";
          currentWordIndex += 4;
          
          try {
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          } catch (writeErr) {
            clearInterval(interval);
            console.error("[Chat API Fallback Stream] Write error or client disconnected:", writeErr);
          }
        }, 70);
        
      } catch (fallbackErr: any) {
        console.error("Critical: Chat Fallback stream builder encountered error:", fallbackErr);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: "Erreur lors de la communication de secours.", 
            details: error.message 
          });
        } else {
          try {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
          } catch {}
        }
      }
    }
  });

  // API Route: Real-time News via Yahoo Finance RSS & Gemini Dynamic Multilingual Interpretation
  app.get(["/api/news/:symbol", "/news/:symbol"], async (req, res) => {
    const { symbol } = req.params;
    if (!symbol) {
      res.status(400).json({ error: "Le symbole de l'action est obligatoire." });
      return;
    }

    const uppercaseSymbol = symbol.toUpperCase();
    const targetLang = (['fr', 'en', 'pt', 'es', 'de', 'zh'].includes((req.query.lang as string || '').toLowerCase())
      ? (req.query.lang as string).toLowerCase()
      : 'fr') as SupportedLang;

    const cacheKey = `${uppercaseSymbol}_${targetLang}`;
    const now = Date.now();

    // 1. Check if we have a fresh cached copy of real-time news for this symbol + language
    const cachedEntry = newsCache[cacheKey];
    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
      console.log(`[News API - CACHE HIT] Serving fresh cached news for ${cacheKey} (${Math.round((now - cachedEntry.timestamp)/1000)}s old)`);
      res.json(cachedEntry.data);
      return;
    }

    let xmlText = "";
    try {
      // 2. Fetch RSS Feed from Yahoo Finance server-side with User-Agent and timeout
      const feedUrl = `https://finance.yahoo.com/rss/headline?s=${uppercaseSymbol}`;
      console.log(`[News API] Loading Yahoo Finance RSS feed for ${uppercaseSymbol} (lang: ${targetLang}): ${feedUrl}`);
      
      const feedRes = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(5000) // 5s timeout
      });

      if (!feedRes.ok) {
        throw new Error(`Yahoo Finance RSS responded with status: ${feedRes.status}`);
      }

      xmlText = await feedRes.text();

      // Check if Gemini is currently in a 429 cooldown, or process.env.GEMINI_API_KEY is missing, or permanently disabled
      const isInCooldown = (Date.now() - last429Time) < 10 * 60 * 1000;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || isInCooldown || isGeminiDisabledPermanently) {
        console.log(`[News API] Gemini is in cooldown, key is missing, or permanently disabled. Attempting localized XML RSS parsing for ${uppercaseSymbol} (${targetLang})...`);
        const parsedItems = parseYahooRSSLocalized(xmlText, uppercaseSymbol, targetLang);
        if (parsedItems.length > 0) {
          console.log(`[News API] Successfully parsed ${parsedItems.length} live RSS news without Gemini in ${targetLang}.`);
          newsCache[cacheKey] = {
            data: parsedItems,
            timestamp: Date.now()
          };
          res.json(parsedItems);
          return;
        } else {
          console.log(`[News API] Local RSS parsing failed/returned empty. Giving fallback localized static predefined data for ${targetLang}.`);
          const fallbackData = getLocalizedFallbackNews(uppercaseSymbol, targetLang);
          res.json(fallbackData);
          return;
        }
      }

      console.log(`[News API] Processing ${uppercaseSymbol} RSS news XML via Gemini 3.5 Flash for language: ${targetLang}...`);
      const client = getAIClient();
      const langName = LANG_PROMPT_NAMES[targetLang] || "français";

      const systemInstruction = `You are an expert multilingual financial market analyst. Your task is to extract the 3 most relevant and recent news from the Yahoo Finance RSS feed XML for the requested stock ticker (${uppercaseSymbol}) and formulate them in ${langName}.

Missions:
1. Translate or write the original title in clear, professional financial ${langName}.
2. Write a concise 1-2 sentence educational summary in ${langName} summarizing the core essence of the news.
3. Extract the origin URL link from <link> or <guid> and place it in the "link" field. If missing, use "https://finance.yahoo.com/quote/${uppercaseSymbol}".
4. Write a comprehensive educational article ("fullText") in ${langName}, consisting of 3 to 4 structured paragraphs (about 200 to 250 words) explaining the event in depth, citing numbers/metrics, explaining what it means for the stock's future, and providing an investor risk management lesson.
5. Assign a short-term market sentiment: "positive", "negative", or "neutral".
6. Ensure the output is a valid JSON array containing exactly 3 distinct news objects.
7. All output text fields (title, summary, fullText) must strictly be written in ${langName}.`;

      const prompt = `Here is the XML news feed for ${uppercaseSymbol}:

${xmlText.slice(0, 7000)}

Analyze this feed, extract the 3 most important news items and return them strictly as a JSON array translated/written in ${langName}.
Follow the required JSON schema.`;

      const response = await generateContentWithRetry(client, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                source: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                sentiment: { 
                  type: Type.STRING, 
                  enum: ["positive", "negative", "neutral"] 
                },
                link: { type: Type.STRING },
                fullText: { type: Type.STRING }
              },
              required: ["id", "title", "summary", "source", "timestamp", "sentiment", "link", "fullText"]
            }
          }
        }
      });

      const reply = response.text;
      if (reply) {
        const newsArray = JSON.parse(reply.trim());
        console.log(`[News API] Successfully generated ${newsArray.length} real-time translated news for ${uppercaseSymbol} in ${targetLang}`);
        
        // Save to cache
        newsCache[cacheKey] = {
          data: newsArray,
          timestamp: Date.now()
        };

        res.json(newsArray);
      } else {
        throw new Error("L'IA a retourné un texte vide.");
      }
    } catch (err: any) {
      const errorMessage = String(err.message || "").toLowerCase();
      const isQuotaExceeded = errorMessage.includes("429") || 
                              errorMessage.includes("quota") || 
                              errorMessage.includes("limit") ||
                              errorMessage.includes("resource_exhausted") ||
                              (err.status && err.status === 429);
      if (isQuotaExceeded) {
        last429Time = Date.now();
      }

      console.log(`[News API] Quiet fallback processed for ${uppercaseSymbol} (${targetLang}). Reason: ${isQuotaExceeded ? "rate-limited" : "unavailable"}`);
      
      const parsedItems = parseYahooRSSLocalized(xmlText || "", uppercaseSymbol, targetLang);
      if (parsedItems.length > 0) {
        newsCache[cacheKey] = {
          data: parsedItems,
          timestamp: Date.now()
        };
        res.json(parsedItems);
      } else if (cachedEntry) {
        console.log(`[News API] Serving older in-memory cache for ${cacheKey}`);
        res.json(cachedEntry.data);
      } else {
        console.log(`[News API] No cache found. Serving fallback predefined static data for ${uppercaseSymbol} in ${targetLang}`);
        const fallbackData = getLocalizedFallbackNews(uppercaseSymbol, targetLang);
        res.json(fallbackData);
      }
    }
  });

  // API Route: Live, real-life stock prices with fallback protection
  let stocksCache: any = null;
  let lastStocksFetch = 0;
  let stocksSourceCache = "fallback-proxy";
  const STOCKS_CACHE_DURATION = 30 * 1000; // 30 seconds

  function getTradingViewSymbol(symbol: string): string {
    if (!symbol) return "NASDAQ:AAPL";
    if (symbol === "MC") return "EURONEXT:MC";
    if (symbol === "AIRF.PA") return "EURONEXT:AF";
    if (symbol.endsWith(".PA")) {
      const base = symbol.replace(".PA", "");
      return `EURONEXT:${base}`;
    }
    
    const nasdaqTickers = [
      "AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN", "NFLX", "COIN", "META", 
      "AMD", "ASML", "ADBE", "AVGO", "QCOM", "INTC", "CSCO", "COST", "PEP", "SBUX", "WMT"
    ];
    if (nasdaqTickers.includes(symbol)) return `NASDAQ:${symbol}`;
    
    const nyseTickers = [
      "DIS", "V", "JPM", "JNJ", "PG", "XOM", "MA", "CVX", "BAC", 
      "KO", "MRK", "NKE", "MCD", "IBM", "GE", "LLY", "CRM", "TSM", "ORCL"
    ];
    if (nyseTickers.includes(symbol)) return `NYSE:${symbol}`;
    
    return symbol;
  }

  async function fetchYahooFinanceQuotesWithCrumb(symbols: string[]): Promise<Record<string, any> | null> {
    try {
      const cookieRes = await fetch("https://fc.yahoo.com", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(3000)
      });
      const cookie = cookieRes.headers.get("set-cookie");

      const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Cookie": cookie || ""
        },
        signal: AbortSignal.timeout(3000)
      });
      if (!crumbRes.ok) return null;
      const crumb = await crumbRes.text();
      if (!crumb || crumb.includes("<html") || crumb.length > 50) return null;

      const symbolsList = symbols.join(",");
      const quoteRes = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsList}&crumb=${crumb}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Cookie": cookie || ""
        },
        signal: AbortSignal.timeout(4000)
      });
      if (!quoteRes.ok) return null;
      const data: any = await quoteRes.json();
      const result = data?.quoteResponse?.result;
      if (!result || !Array.isArray(result) || result.length === 0) return null;

      const resMap: Record<string, any> = {};
      result.forEach((quote: any) => {
        if (quote && quote.symbol && quote.regularMarketPrice !== undefined) {
          const priceVal = parseFloat(quote.regularMarketPrice.toFixed(2));
          const change = quote.regularMarketChangePercent !== undefined 
            ? parseFloat(quote.regularMarketChangePercent.toFixed(2)) 
            : 0;
          const low24h = quote.regularMarketDayLow ? parseFloat(quote.regularMarketDayLow.toFixed(2)) : priceVal;
          const high24h = quote.regularMarketDayHigh ? parseFloat(quote.regularMarketDayHigh.toFixed(2)) : priceVal;
          const volumeNum = quote.regularMarketVolume;
          
          let volume = "";
          if (volumeNum) {
            if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
            else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
            else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
            else volume = volumeNum.toString();
          }

          resMap[quote.symbol] = { price: priceVal, change, low24h, high24h, volume };
        }
      });

      return Object.keys(resMap).length > 0 ? resMap : null;
    } catch (err) {
      return null;
    }
  }

  async function fetchYahooFinanceChartWithCrumb(symbol: string, range: string, interval: string): Promise<number[] | null> {
    try {
      const cookieRes = await fetch("https://fc.yahoo.com", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(3000)
      });
      const cookie = cookieRes.headers.get("set-cookie");

      const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Cookie": cookie || ""
        },
        signal: AbortSignal.timeout(3000)
      });
      if (!crumbRes.ok) return null;
      const crumb = await crumbRes.text();
      if (!crumb || crumb.includes("<html") || crumb.length > 50) return null;

      const chartRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}&crumb=${crumb}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Cookie": cookie || ""
        },
        signal: AbortSignal.timeout(5000)
      });
      if (!chartRes.ok) return null;
      const yfData: any = await chartRes.json();
      const result = yfData?.chart?.result?.[0];
      const closePrices = result?.indicators?.quote?.[0]?.close;

      if (Array.isArray(closePrices)) {
        const prices = closePrices
          .map((p: any) => parseFloat(p))
          .filter((p: number) => !isNaN(p) && p > 0);
        return prices.length > 0 ? prices : null;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  app.get(["/api/stocks", "/stocks"], async (req, res) => {
    const now = Date.now();
    const requestKey = req.headers['x-twelve-data-key'] as string;
    const hasKey = !!(requestKey || process.env.TWELVE_DATA_API_KEY || process.env.FINNHUB_API_KEY || process.env.RAPIDAPI_KEY);
    
    if (stocksCache && (now - lastStocksFetch < STOCKS_CACHE_DURATION)) {
      if (!(stocksSourceCache === "fallback-proxy" && hasKey)) {
        res.setHeader("X-Prices-Source", stocksSourceCache);
        res.json(stocksCache);
        return;
      }
    }

    try {
      const symbolsMap: Record<string, string> = {
        AAPL: "AAPL",
        MSFT: "MSFT",
        NVDA: "NVDA",
        TSLA: "TSLA",
        GOOGL: "GOOGL",
        AMZN: "AMZN",
        NFLX: "NFLX",
        COIN: "COIN",
        META: "META",
        AMD: "AMD",
        DIS: "DIS",
        ASML: "ASML",
        V: "V",
        LLY: "LLY",
        MC: "MC.PA",
        "OR.PA": "OR.PA",
        JPM: "JPM",
        WMT: "WMT",
        JNJ: "JNJ",
        PG: "PG",
        XOM: "XOM",
        COST: "COST",
        MA: "MA",
        ADBE: "ADBE",
        CRM: "CRM",
        CVX: "CVX",
        BAC: "BAC",
        PEP: "PEP",
        KO: "KO",
        MRK: "MRK",
        TSM: "TSM",
        AVGO: "AVGO",
        QCOM: "QCOM",
        ORCL: "ORCL",
        NKE: "NKE",
        MCD: "MCD",
        INTC: "INTC",
        IBM: "IBM",
        CSCO: "CSCO",
        GE: "GE",
        SBUX: "SBUX",
        "TTE.PA": "TTE.PA",
        "SAN.PA": "SAN.PA",
        "AIR.PA": "AIR.PA",
        "RMS.PA": "RMS.PA",
        "BNP.PA": "BNP.PA",
        "CS.PA": "CS.PA",
        "RNO.PA": "RNO.PA",
        "AIRF.PA": "AIRF.PA",
        "ENGI.PA": "ENGI.PA"
      };

      const uniqueYahooSymbols = Array.from(new Set(Object.values(symbolsMap)));
      const resultsMap: Record<string, any> = {};

      const reverseSymbolsMap: Record<string, string> = {};
      Object.entries(symbolsMap).forEach(([symbol, yahooSymbol]) => {
        reverseSymbolsMap[yahooSymbol] = symbol;
      });

      const twelveDataApiKey = (req.headers['x-twelve-data-key'] as string) || process.env.TWELVE_DATA_API_KEY;
      const finnhubApiKey = (req.headers['x-finnhub-key'] as string) || process.env.FINNHUB_API_KEY;
      const rapidApiKey = process.env.RAPIDAPI_KEY;
      const rapidApiHost = process.env.RAPIDAPI_HOST || "yh-finance.p.rapidapi.com";

      let fetchedSuccessfully = false;

      // --- 0. HIGH-PRIORITY OFFICIAL YAHOO FINANCE REAL-TIME QUOTES API ---
      if (!fetchedSuccessfully) {
        console.log("[Prices API] Attempting to fetch real-time quotes from official Yahoo Finance API (Crumb & Cookie)...");
        try {
          const yahooQuotes = await fetchYahooFinanceQuotesWithCrumb(uniqueYahooSymbols);
          if (yahooQuotes) {
            Object.entries(symbolsMap).forEach(([symbol, yahooSymbol]) => {
              const quote = yahooQuotes[yahooSymbol];
              if (quote) {
                resultsMap[symbol] = quote;
              }
            });
            if (Object.keys(resultsMap).length > 0) {
              fetchedSuccessfully = true;
              stocksSourceCache = "yahoo-finance-live";
              console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from Yahoo Finance Live API`);
            }
          }
        } catch (err: any) {
          console.warn("[Prices API] Yahoo Finance Crumb API failed, trying fallbacks:", err.message);
        }
      }

      // --- 0B. SECONDARY REAL-TIME TRADINGVIEW SCANNER API ---
      if (!fetchedSuccessfully) {
        console.log("[Prices API] Attempting to fetch real-time quotes from TradingView Scanner API...");
        try {
          const tvSymbols = Object.keys(symbolsMap).map(symbol => getTradingViewSymbol(symbol));
          const response = await fetch("https://scanner.tradingview.com/global/scan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              symbols: {
                tickers: tvSymbols
              },
              columns: ["close", "change", "volume", "high", "low"]
            }),
            signal: AbortSignal.timeout(5000)
          });

          if (response.ok) {
            const data: any = await response.json();
            if (data && Array.isArray(data.data) && data.data.length > 0) {
              const tvResultsMap = new Map<string, any>();
              data.data.forEach((item: any) => {
                if (item && item.s && Array.isArray(item.d)) {
                  const [close, change, volume, high, low] = item.d;
                  tvResultsMap.set(item.s, {
                    price: typeof close === "number" ? close : null,
                    change: typeof change === "number" ? parseFloat(change.toFixed(2)) : null,
                    volumeVal: typeof volume === "number" ? volume : null,
                    high: typeof high === "number" ? parseFloat(high.toFixed(2)) : null,
                    low: typeof low === "number" ? parseFloat(low.toFixed(2)) : null
                  });
                }
              });

              Object.keys(symbolsMap).forEach((symbol) => {
                const tvSym = getTradingViewSymbol(symbol);
                const quote = tvResultsMap.get(tvSym);
                if (quote && quote.price !== null) {
                  const priceVal = quote.price;
                  const change = quote.change !== null ? quote.change : 0;
                  const low24h = quote.low !== null ? quote.low : priceVal;
                  const high24h = quote.high !== null ? quote.high : priceVal;
                  const volumeNum = quote.volumeVal;

                  let volume = "";
                  if (volumeNum) {
                    if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                    else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                    else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                    else volume = volumeNum.toString();
                  }

                  resultsMap[symbol] = { price: priceVal, change, low24h, high24h, volume };
                }
              });

              if (Object.keys(resultsMap).length > 0) {
                fetchedSuccessfully = true;
                stocksSourceCache = "tradingview-realtime";
                console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from TradingView Scanner`);
              }
            }
          }
        } catch (err: any) {
          console.warn("[Prices API] TradingView Scanner failed, trying fallbacks:", err.message);
        }
      }

      // --- 1. TWELVE DATA API ---
      if (!fetchedSuccessfully && twelveDataApiKey) {
        console.log("[Prices API] Using Twelve Data API Key...");
        const batchSize = 8;
        const batches: string[][] = [];
        for (let i = 0; i < uniqueYahooSymbols.length; i += batchSize) {
          batches.push(uniqueYahooSymbols.slice(i, i + batchSize));
        }

        try {
          await Promise.all(
            batches.map(async (batch) => {
              const symbolsList = batch.join(",");
              const url = `https://api.twelvedata.com/quote?symbol=${symbolsList}&apikey=${twelveDataApiKey}`;
              const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
              if (response.ok) {
                const data: any = await response.json();
                const quotes = batch.length === 1 && data && data.symbol ? { [batch[0]]: data } : data;
                
                if (quotes && typeof quotes === "object") {
                  Object.entries(quotes).forEach(([symbol, quoteObj]: [string, any]) => {
                    if (quoteObj && !quoteObj.status && (quoteObj.close || quoteObj.price)) {
                      const priceVal = parseFloat(quoteObj.close || quoteObj.price);
                      if (!isNaN(priceVal)) {
                        const change = quoteObj.percent_change ? parseFloat(quoteObj.percent_change) : 0;
                        const low24h = quoteObj.low ? parseFloat(quoteObj.low) : priceVal;
                        const high24h = quoteObj.high ? parseFloat(quoteObj.high) : priceVal;
                        const volumeNum = quoteObj.volume ? parseInt(quoteObj.volume, 10) : 0;
                        
                        let volume = "";
                        if (volumeNum) {
                          if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                          else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                          else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                          else volume = volumeNum.toString();
                        }
                        const internalSymbol = reverseSymbolsMap[symbol.toUpperCase()] || symbol.toUpperCase();
                        resultsMap[internalSymbol] = { price: priceVal, change, low24h, high24h, volume };
                      }
                    }
                  });
                }
              }
            })
          );
          if (Object.keys(resultsMap).length > 0) {
            fetchedSuccessfully = true;
            stocksSourceCache = "twelve-data";
            console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from Twelve Data`);
          }
        } catch (err: any) {
          console.warn("[Prices API] Twelve Data fetch failed, falling back:", err.message);
        }
      }

      // --- 2. FINNHUB API ---
      if (!fetchedSuccessfully && finnhubApiKey) {
        console.log("[Prices API] Using Finnhub API Key...");
        try {
          const batchSize = 10;
          for (let i = 0; i < uniqueYahooSymbols.length; i += batchSize) {
            const batch = uniqueYahooSymbols.slice(i, i + batchSize);
            await Promise.all(
              batch.map(async (yahooSymbol) => {
                const url = `https://finnhub.io/api/v1/quote?symbol=${yahooSymbol}&token=${finnhubApiKey}`;
                const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
                if (response.ok) {
                  const data: any = await response.json();
                  if (data && data.c) {
                    const priceVal = parseFloat(data.c);
                    const change = data.dp ? parseFloat(data.dp) : 0;
                    const low24h = data.l ? parseFloat(data.l) : priceVal;
                    const high24h = data.h ? parseFloat(data.h) : priceVal;
                    const internalSymbol = reverseSymbolsMap[yahooSymbol] || yahooSymbol;
                    resultsMap[internalSymbol] = { price: priceVal, change, low24h, high24h, volume: "" };
                  }
                }
              })
            );
            if (i + batchSize < uniqueYahooSymbols.length) {
              await new Promise(r => setTimeout(r, 150));
            }
          }
          if (Object.keys(resultsMap).length > 0) {
            fetchedSuccessfully = true;
            stocksSourceCache = "finnhub";
            console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from Finnhub`);
          }
        } catch (err: any) {
          console.warn("[Prices API] Finnhub fetch failed, falling back:", err.message);
        }
      }

      // --- 3. RAPIDAPI (YAHOO FINANCE) ---
      if (!fetchedSuccessfully && rapidApiKey) {
        console.log("[Prices API] Using Yahoo Finance via RapidAPI...");
        const batchSize = 15;
        const batches: string[][] = [];
        for (let i = 0; i < uniqueYahooSymbols.length; i += batchSize) {
          batches.push(uniqueYahooSymbols.slice(i, i + batchSize));
        }

        try {
          await Promise.all(
            batches.map(async (batch) => {
              const symbolsList = batch.join(",");
              const url = `https://${rapidApiHost}/market/v2/get-quotes?symbols=${symbolsList}`;
              const response = await fetch(url, {
                headers: {
                  "X-RapidAPI-Key": rapidApiKey,
                  "X-RapidAPI-Host": rapidApiHost
                },
                signal: AbortSignal.timeout(8000)
              });
              if (response.ok) {
                const data: any = await response.json();
                const result = data?.quoteResponse?.result;
                if (result && Array.isArray(result)) {
                  result.forEach((quote: any) => {
                    if (quote && quote.symbol) {
                      const priceVal = quote.regularMarketPrice ? parseFloat(quote.regularMarketPrice.toFixed(2)) : null;
                      if (priceVal !== null) {
                        const change = quote.regularMarketChangePercent !== undefined 
                          ? parseFloat(quote.regularMarketChangePercent.toFixed(2)) 
                          : 0;
                        const low24h = quote.regularMarketDayLow ? parseFloat(quote.regularMarketDayLow.toFixed(2)) : priceVal;
                        const high24h = quote.regularMarketDayHigh ? parseFloat(quote.regularMarketDayHigh.toFixed(2)) : priceVal;
                        const volumeNum = quote.regularMarketVolume;
                        
                        let volume = "";
                        if (volumeNum) {
                          if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                          else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                          else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                          else volume = volumeNum.toString();
                        }

                        const internalSymbol = reverseSymbolsMap[quote.symbol] || quote.symbol;
                        resultsMap[internalSymbol] = { price: priceVal, change, low24h, high24h, volume };
                      }
                    }
                  });
                }
              }
            })
          );
          if (Object.keys(resultsMap).length > 0) {
            fetchedSuccessfully = true;
            stocksSourceCache = "rapidapi";
            console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from RapidAPI`);
          }
        } catch (err: any) {
          console.warn("[Prices API] RapidAPI fetch failed, falling back:", err.message);
        }
      }

      // --- 4. NO-KEY PUBLIC PROXY FALLBACK (Using Yahoo Quote Bulk API with failover) ---
      if (!fetchedSuccessfully) {
        console.log("[Prices API] Fetching real-time quotes using public Yahoo Finance Quote API...");
        
        const symbolsList = uniqueYahooSymbols.join(",");
        const baseQuoteUrl = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbolsList}`;
        const altQuoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsList}`;
        const baseQuoteUrlV6 = `https://query2.finance.yahoo.com/v6/finance/quote?symbols=${symbolsList}`;
        const altQuoteUrlV6 = `https://query1.finance.yahoo.com/v6/finance/quote?symbols=${symbolsList}`;
        
        const fetchUrls = [
          baseQuoteUrlV6,
          altQuoteUrlV6,
          baseQuoteUrl,
          altQuoteUrl,
          `https://corsproxy.io/?url=${encodeURIComponent(baseQuoteUrl)}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(baseQuoteUrl)}`
        ];

        const userAgents = [
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15"
        ];
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        let parsedBulkSuccessfully = false;

        for (const url of fetchUrls) {
          try {
            const response = await fetch(url, {
              headers: {
                "User-Agent": randomUserAgent,
                "Accept": "application/json"
              },
              signal: AbortSignal.timeout(6000)
            });

            if (response.ok) {
              const data: any = await response.json();
              const result = data?.quoteResponse?.result;
              if (result && Array.isArray(result) && result.length > 0) {
                result.forEach((quote: any) => {
                  if (quote && quote.symbol) {
                    const priceVal = quote.regularMarketPrice ? parseFloat(quote.regularMarketPrice.toFixed(2)) : null;
                    if (priceVal !== null) {
                      const change = quote.regularMarketChangePercent !== undefined 
                        ? parseFloat(quote.regularMarketChangePercent.toFixed(2)) 
                        : 0;
                      const low24h = quote.regularMarketDayLow ? parseFloat(quote.regularMarketDayLow.toFixed(2)) : priceVal;
                      const high24h = quote.regularMarketDayHigh ? parseFloat(quote.regularMarketDayHigh.toFixed(2)) : priceVal;
                      const volumeNum = quote.regularMarketVolume;
                      
                      let volume = "";
                      if (volumeNum) {
                        if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                        else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                        else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                        else volume = volumeNum.toString();
                      }

                      const internalSymbol = reverseSymbolsMap[quote.symbol] || quote.symbol;
                      resultsMap[internalSymbol] = { price: priceVal, change, low24h, high24h, volume };
                    }
                  }
                });
                parsedBulkSuccessfully = true;
                break; // Stop trying other endpoints if this one succeeded
              }
            }
          } catch (err) {
            // Try next fallback endpoint
          }
        }

        if (parsedBulkSuccessfully && Object.keys(resultsMap).length > 0) {
          fetchedSuccessfully = true;
          stocksSourceCache = "fallback-quote-api";
          console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from Yahoo Quote API`);
        } else {
          // Absolute last resort: Individual Chart API fetch
          console.log("[Prices API] Bulk quote fallback complete. Requesting individual chart APIs...");
          try {
            await Promise.all(
              uniqueYahooSymbols.map(async (yahooSymbol) => {
                try {
                  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=1d&interval=1d`;
                  const response = await fetch(url, {
                    headers: { "User-Agent": randomUserAgent },
                    signal: AbortSignal.timeout(4000)
                  });
                  if (response.ok) {
                    const data: any = await response.json();
                    const meta = data?.chart?.result?.[0]?.meta;
                    if (meta) {
                      const price = meta.regularMarketPrice !== undefined ? parseFloat(meta.regularMarketPrice.toFixed(2)) : meta.chartPreviousClose;
                      if (price !== undefined && price !== null) {
                        const prevClose = meta.chartPreviousClose !== undefined ? meta.chartPreviousClose : price;
                        const change = prevClose ? parseFloat((((price - prevClose) / prevClose) * 100).toFixed(2)) : 0;
                        const low24h = meta.regularMarketDayLow !== undefined ? parseFloat(meta.regularMarketDayLow.toFixed(2)) : price;
                        const high24h = meta.regularMarketDayHigh !== undefined ? parseFloat(meta.regularMarketDayHigh.toFixed(2)) : price;
                        const volumeNum = meta.regularMarketVolume;
                        
                        let volume = "";
                        if (volumeNum) {
                          if (volumeNum >= 1_000_000_000) volume = `${(volumeNum / 1_000_000_000).toFixed(1)}B`;
                          else if (volumeNum >= 1_000_000) volume = `${(volumeNum / 1_000_000).toFixed(1)}M`;
                          else if (volumeNum >= 1000) volume = `${(volumeNum / 1000).toFixed(1)}K`;
                          else volume = volumeNum.toString();
                        }

                        const internalSymbol = reverseSymbolsMap[yahooSymbol] || yahooSymbol;
                        resultsMap[internalSymbol] = { price, change, low24h, high24h, volume };
                      }
                    }
                  }
                } catch {
                  // Silent
                }
              })
            );
            if (Object.keys(resultsMap).length > 0) {
              fetchedSuccessfully = true;
              stocksSourceCache = "fallback-chart-api";
              console.log(`[Prices API] Successfully fetched ${Object.keys(resultsMap).length} symbols from Yahoo Chart API`);
            }
          } catch (err: any) {
            console.warn("[Prices API] Yahoo Chart API fallback failed:", err.message);
          }
        }
      }

      if (Object.keys(resultsMap).length === 0) {
        console.log("[Prices API] Applying real-time stock price simulation engine.");
        const baseStocks = stocksCache || INITIAL_STOCKS;
        baseStocks.forEach((stock: any) => {
          // Calculate a realistic small random walk: -0.15% to +0.15%
          const percentChange = (Math.random() - 0.5) * 0.3; 
          const priceVal = parseFloat((stock.price * (1 + percentChange / 100)).toFixed(2));
          // Keep change within realistic bounds (-10% to +10%) or small accumulation
          let change = stock.change + percentChange;
          if (change > 15) change = 15;
          if (change < -15) change = -15;
          change = parseFloat(change.toFixed(2));
          
          const low24h = Math.min(stock.low24h || priceVal, priceVal);
          const high24h = Math.max(stock.high24h || priceVal, priceVal);
          
          resultsMap[stock.symbol] = {
            price: priceVal,
            change,
            low24h,
            high24h,
            volume: stock.volume
          };
        });
        stocksSourceCache = "fallback-simulation";
      }


      // Merge and update stock rates
      const updatedStocks = INITIAL_STOCKS.map((stock) => {
        const live = resultsMap[stock.symbol];
        if (!live) return stock;

        const price = live.price;
        const change = live.change;
        const low24h = live.low24h;
        const high24h = live.high24h;
        const volume = live.volume || stock.volume;

        return {
          ...stock,
          price,
          change,
          low24h,
          high24h,
          volume,
          history: stock.history
        };
      });

      stocksCache = updatedStocks;
      lastStocksFetch = now;
      res.json(updatedStocks);
    } catch (error: any) {
      console.warn(`[Prices API] Failed to fetch real-time stocks: ${error.message}`);
      // Return cached version if available, otherwise fallback list
      if (stocksCache) {
        res.json(stocksCache);
      } else {
        res.status(502).json({ error: "Failed to fetch real-time stocks", fallback: INITIAL_STOCKS });
      }
    }
  });

  // API Route: Real-time historical prices for individual stocks
  app.get(["/api/stocks/history/:symbol", "/stocks/history/:symbol"], async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const twelveDataApiKey = (req.headers['x-twelve-data-key'] as string) || process.env.TWELVE_DATA_API_KEY;

    const symbolsMap: Record<string, string> = {
      AAPL: "AAPL", MSFT: "MSFT", NVDA: "NVDA", TSLA: "TSLA", GOOGL: "GOOGL",
      AMZN: "AMZN", NFLX: "NFLX", COIN: "COIN", META: "META", AMD: "AMD",
      DIS: "DIS", ASML: "ASML", V: "V", LLY: "LLY", MC: "MC.PA", "OR.PA": "OR.PA",
      JPM: "JPM", WMT: "WMT", JNJ: "JNJ", PG: "PG", XOM: "XOM", COST: "COST",
      MA: "MA", ADBE: "ADBE", CRM: "CRM", CVX: "CVX", BAC: "BAC", PEP: "PEP",
      KO: "KO", MRK: "MRK", TSM: "TSM", AVGO: "AVGO", QCOM: "QCOM", ORCL: "ORCL",
      NKE: "NKE", MCD: "MCD", INTC: "INTC", IBM: "IBM", CSCO: "CSCO", GE: "GE",
      SBUX: "SBUX", "TTE.PA": "TTE.PA", "SAN.PA": "SAN.PA", "AIR.PA": "AIR.PA",
      "RMS.PA": "RMS.PA", "BNP.PA": "BNP.PA", "CS.PA": "CS.PA", "RNO.PA": "RNO.PA",
      "AIRF.PA": "AIRF.PA", "ENGI.PA": "ENGI.PA"
    };

    const querySymbol = symbolsMap[symbol] || symbol;

    const range = (req.query.range as string) || "1y";
    let interval = "1d";
    if (range === "1d") {
      interval = "2m";
    } else if (range === "5d") {
      interval = "15m";
    } else if (range === "5y" || range === "max") {
      interval = "1wk";
    }

    // --- 1. Try Yahoo Finance /v8/finance/chart with Crumb & Cookie (Free, real-time historical, handles Cloud Run IP rate limits) ---
    try {
      console.log(`[Prices API] Fetching real history for ${querySymbol} (range: ${range}, interval: ${interval}) from Yahoo Finance API (Crumb)...`);
      const prices = await fetchYahooFinanceChartWithCrumb(querySymbol, range, interval);
      if (prices && prices.length > 0) {
        console.log(`[Prices API] Successfully fetched ${prices.length} historical prices from Yahoo Finance Crumb API for ${symbol}`);
        return res.json({ symbol, history: prices });
      }
    } catch (yfErr: any) {
      console.warn(`[Prices API] Yahoo Finance Crumb history fetch failed for ${symbol}:`, yfErr.message);
    }

    // --- 2. Try Twelve Data API as fallback if API Key is available ---
    if (twelveDataApiKey) {
      try {
        const url = `https://api.twelvedata.com/time_series?symbol=${querySymbol}&interval=1day&outputsize=350&apikey=${twelveDataApiKey}`;
        console.log(`[Prices API] Falling back to time_series for ${querySymbol} from Twelve Data...`);
        const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (response.ok) {
          const data: any = await response.json();
          if (data && data.status !== "error" && data.values && Array.isArray(data.values)) {
            const prices = data.values
              .map((item: any) => parseFloat(item.close))
              .filter((price: number) => !isNaN(price))
              .reverse();

            if (prices.length > 0) {
              // Scale the historical points so that the last point matches our highly accurate TradingView stock price from stocksCache
              const cachedStock = stocksCache?.find((s: any) => s.symbol === symbol);
              if (cachedStock && cachedStock.price) {
                const lastPoint = prices[prices.length - 1];
                if (lastPoint > 0 && Math.abs(lastPoint - cachedStock.price) > 0.01) {
                  const scale = cachedStock.price / lastPoint;
                  for (let i = 0; i < prices.length; i++) {
                    prices[i] = parseFloat((prices[i] * scale).toFixed(2));
                  }
                }
              }
              console.log(`[Prices API] Successfully fetched ${prices.length} historical prices from Twelve Data for ${symbol}`);
              return res.json({ symbol, history: prices });
            }
          }
        }
      } catch (err: any) {
        console.error(`[Prices API] Failed to fetch historical data from Twelve Data for ${symbol}:`, err.message);
      }
    }

    // --- 3. Final Fallback: Generate real-looking random walk using current price ---
    console.warn(`[Prices API] Both Yahoo Finance and Twelve Data failed. Generating fallback history for ${symbol}...`);
    try {
      let currentPrice = 100;
      const cachedStock = stocksCache?.find((s: any) => s.symbol === symbol);
      if (cachedStock) {
        currentPrice = cachedStock.price;
      } else {
        const found = INITIAL_STOCKS.find((s: any) => s.symbol === symbol);
        if (found) currentPrice = found.price;
      }
      
      const prices: number[] = [];
      let tempPrice = currentPrice;
      for (let i = 0; i < 350; i++) {
        prices.push(parseFloat(tempPrice.toFixed(2)));
        const dailyChange = (Math.random() - 0.49) * 0.02; // Slight upward drift
        tempPrice = tempPrice / (1 + dailyChange);
      }
      prices.reverse();
      res.json({ symbol, history: prices });
    } catch (err: any) {
      res.status(500).json({ error: "Could not fetch or generate historical prices." });
    }
  });

  // API Route: Healthcheck and system constants
  app.get(["/api/health", "/health"], (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Finance Bridge Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
