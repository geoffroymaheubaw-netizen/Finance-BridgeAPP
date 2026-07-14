import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_STOCKS } from "./src/data";

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
        console.log(`[Gemini API API Retry] Attempt ${attempt} failed with 503/UNAVAILABLE. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }

      // Model failover chain if the current model is having issues or under-provisioned
      const failoverChain = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
      const currentModel = params.model;
      for (const fallbackModel of failoverChain) {
        if (currentModel !== fallbackModel) {
          console.log(`[Gemini API] Primary model ${currentModel} failed/unavailable. Attempting failover to stable backup: ${fallbackModel}...`);
          try {
            // Safe deep clone to modify config for backup eligibility
            const failoverParams = JSON.parse(JSON.stringify(params));
            failoverParams.model = fallbackModel;
            if (failoverParams.config) {
              delete failoverParams.config.thinkingConfig;
            }
            return await client.models.generateContent(failoverParams);
          } catch (failoverErr: any) {
            console.log(`[Gemini API] Failover model ${fallbackModel} also failed: ${failoverErr.message}`);
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
        console.log(`[Gemini API Stream Retry] Attempt ${attempt} failed with 503/UNAVAILABLE. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }

      // Model failover chain if the current model is having issues or under-provisioned
      const failoverChain = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
      const currentModel = params.model;
      for (const fallbackModel of failoverChain) {
        if (currentModel !== fallbackModel) {
          console.log(`[Gemini API Stream] Primary model ${currentModel} failed/unavailable. Attempting stream failover to stable backup: ${fallbackModel}...`);
          try {
            // Safe deep clone to modify config for backup eligibility
            const failoverParams = JSON.parse(JSON.stringify(params));
            failoverParams.model = fallbackModel;
            if (failoverParams.config) {
              delete failoverParams.config.thinkingConfig;
            }
            return await client.models.generateContentStream(failoverParams);
          } catch (failoverErr: any) {
            console.log(`[Gemini API Stream] Failover model ${fallbackModel} also failed: ${failoverErr.message}`);
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

// Smart Local Fallback Response Engine in French for maximum resilience during model 503/overload spikes
function getOfflineFinancialResponse(message: string): string {
  const query = message.toLowerCase();

  if (query.includes("etf") || query.includes("tracker") || query.includes("diversifier") || query.includes("panier")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Les **ETF (Exchange-Traded Funds)**, ou **Trackers** en français, sont des instruments financiers d'exception qui reproduisent fidèlement la performance d'un indice de référence entier, comme le **S&P 500** ou le **CAC 40**.

Pourquoi sont-ils incontournables pour débuter ?
* 🌐 **Diversification instantanée** : Au lieu d'acheter une seule action individuelle, une part d'ETF vous expose immédiatement à des dizaines ou centaines d'entreprises mondiales de premier rang (Apple, Nvidia, Microsoft, etc.), limitant considérablement votre risque boursier.
* 💸 **Frais de gestion minimes** : Ils affichent en moyenne des frais annuels inférieurs à 0,25%, là où les fonds mutuels traditionnels gérés par des banques ponctionnent 1,5% à 2% par an.
* 🕊️ **Simplicité radicale** : Nul besoin de scruter chaque bilan comptable quotidiennement. Vous profitez simplement de la croissance globale de l'économie mondiale sur le long terme.

N'hésitez pas à vous intéresser à l'**ETF S&P 500** dans notre liste d'actions en direct pour placer un ordre virtuel avec votre budget fictif !

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  if (query.includes("dividend") || query.includes("coupon") || query.includes("rendement") || query.includes("dividende")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Un **dividende** est une part des bénéfices générés par une entreprise qui est périodiquement reversée à ses fidèles actionnaires en guise de rémunération.

Les principes fondamentaux à garder à l'esprit :
* 📅 **Périodicité** : Il est généralement versé tous les trois mois (trimestriel, très courant aux États-Unis) ou une fois par an (fréquent en Europe).
* 📈 **Rendement (Yield)** : Il s'exprime en pourcentage. On le calcule en divisant le montant du dividende annuel par le prix de l'action. Par exemple, si l'action Coca-Cola s'échange à 60 $ et distribue 3 $ de dividende, son rendement annuel est de 5%.
* 🔄 **L'effet boule de neige (Intérêts composés)** : Le secret absolu des grands investisseurs est de réinvestir chaque dividende perçu pour acheter de nouvelles fractions d'actions. Avec le temps, votre nombre d'actions augmente, augmentant vos prochains dividendes !

Pensez à regarder des valeurs de premier plan réputées pour la solidité de leur dividende comme **Coca-Cola (KO)** ou **LVMH (MC)** dans notre simulateur de trading !

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  if (query.includes("ordre") || query.includes("acheter") || query.includes("vendre") || query.includes("achat") || query.includes("vente") || query.includes("limite") || query.includes("marché")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Pour acheter ou vendre une action sur les places boursières mondiales, vous devez transmettre un **ordre de bourse**. Il existe deux méthodes incontournables :

1. ⚡ **L'Ordre au Marché (Market Order)** :
   * **Le principe** : Vous ordonnez d'exécuter la transaction immédiatement au meilleur prix actuellement disponible à l'instant T.
   * **Avantage** : L'exécution est instantanée et garantie à 100%.
   * **Inconvénient** : Si le titre fluctue très vite (forte volatilité), le prix d'achat final peut s'éloigner un tout petit peu de celui observé au départ.

2. 🎯 **L'Ordre Limite (Limit Order)** :
   * **Le principe** : Vous fixez rigoureusement un prix maximal pour un achat, ou un prix minimal pour une vente.
   * **Avantage** : Vous contrôlez scrupuleusement votre tarif. L'achat ou la vente ne se déclenchera jamais en dehors de vos limites.
   * **Inconvénient** : Si le cours de l'action n'atteint jamais votre borne fixée, l'ordre n'est jamais exécuté et expire inutilement.

Pour expérimenter ces notions en direct et sans risque de perte financière réelle, utilisez les **10 000 $** de solde virtuel disponibles sur votre compte Finance Bridge !

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  if (query.includes("pe ") || query.includes("per") || query.includes("p/e") || query.includes("ratio") || query.includes("valorisation") || query.includes("multiplier")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Le **P/E Ratio** (ou **Price-to-Earnings Ratio** / **PER** en français) est la boussole incontournable pour jauger la valorisation d'une entreprise en bourse.

Pour faire simple :
* 📉 **PER faible (inférieur à 15)** : L'action est généralement perçue comme bon marché ou sous-évaluée. Cela caractérise les industries matures et traditionnelles (banques, énergie) dont le rythme de croissance est modéré mais stable.
* 📈 **PER élevé (supérieur à 25)** : L'action est considérée comme chère. C'est classique pour les valeurs technologiques à croissance fulgurante (comme **Nvidia (NVDA)** ou **Microsoft (MSFT)**). Les investisseurs acceptent de payer le prix fort car ils prévoient une explosion des bénéfices futurs.

Prendre l'habitude de comparer le PER d'une entreprise avec ses concurrents directs est l'une des techniques les plus saines pour débusquer les actions sous-évaluées !

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  if (query.includes("volat") || query.includes("risque") || query.includes("perdre") || query.includes("perte") || query.includes("chute") || query.includes("crash")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

La **volatilité** désigne l'amplitude et la célérité des variations d'un cours de bourse sur un laps de temps donné. Elle représente le coeur de l'évaluation du **risque de marché** :

* 🌊 **Forte volatilité** : Le cours bondit ou plonge de manière abrupte et nerveuse (typique des valeurs technologiques naissantes comme **Coinbase (COIN)** ou des secteurs spéculatifs). Elle offre de gros gains rapides, mais s'accompagne d'un niveau de risque de perte tout aussi élevé !
* ⛰️ **Faible volatilité** : Le cours évolue de façon linéaire, souple et sereine (typique de fleurons établis comme **Eli Lilly (LLY)** ou **Coca-Cola (KO)**).

**Nos 3 conseils fondamentaux pour préserver votre capital :**
1. 🏗️ **La diversification absolue** : Ne misez jamais tout sur un seul actif. Répartissez vos investissements sur différents secteurs (Tech, Santé, Luxe) et zones géographiques.
2. 🕰️ **L'horizon à long terme** : La bourse récompense la constance. En maintenant votre cap d'investissement sur plusieurs années, vous effacez les oscillations temporaires d'humeur du marché.
3. 🛡️ **Les ordres stop-loss (seuil de sécurité)** : Définissez toujours un seuil de vente automatique pour couper vos pertes si un cours venait à chuter lourdement.

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  if (query.includes("bonjour") || query.includes("salut") || query.includes("hello") || query.includes("hey") || query.includes("qui es-tu") || query.includes("aide")) {
    return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Bonjour ! Je suis **Finance Bridge AI**, votre guide chaleureux et dévoué pour décrypter le monde de l'investissement ! 

Nos liaisons avec l'IA centrale en ligne étant ralenties, je bascule instantanément sur mon moteur de bord pour vous expliquer de manière ultra-pédagogique tous les secrets de la finance !

💬 **Avec quel sujet passionnant désirez-vous entamer votre apprentissage aujourd'hui ?**
* 📋 **Les ETF / Trackers** (apprendre la diversification passive et intelligente).
* 💸 **Les Dividendes boursiers** (créer des revenus passifs par l'effet boule de neige).
* ⚡ **Les types d'ordres** (comprendre l'ordre au marché et l'ordre limite).
* 📊 **Le P/E Ratio** (savoir si une action est sous-évaluée ou surévaluée).
* 🛡️ **La gestion des risques** (maîtriser la volatilité pour protéger vos gains virtuels).

Pensez également à valider vos objectifs dans l'onglet **Cours** ! Vous y trouverez des exercices interactifs amusants conçus sur mesure pour débloquer de magnifiques badges de réussite.

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
  }

  return `🎒 **Mode Assistant Hors-ligne** (Le serveur IA de pointe subit temporairement une charge de trafic intense. Je poursuis notre échange grâce à mes connaissances embarquées ! 🧠)

Merci pour votre question ! Nos serveurs de modèles IA en direct font face à un très grand nombre de requêtes simultanées de la part des élèves de Finance Bridge.

En tant que votre coach de trading virtuel, je peux néanmoins vous accompagner sur tous les piliers majeurs de l'investissement :

* 📋 **Les ETF (Trackers)** : Investissez d'un coup dans des centaines de sociétés mondiales pour diversifier vos risques de façon autonome.
* 💸 **Les Dividendes** : Découvrez comment transformer vos plus-values en flux de trésorerie réguliers.
* 🎯 **Les Ordres de Bourse** : Maîtrisez le déclenchement immédiat (au marché) ou intelligent (limite).
* 📊 **Le P/E Ratio (Valorisation)** : Analysez d'un coup d'oeil rapide si une action de renom est à son juste prix ou s'il s'agit d'une aubaine.
* 🛡️ **La Volatilité et le Risque** : Appliquez les meilleures techniques de money-management pour sauvegarder votre capital de simulateur virtuel.

Posez-moi votre question en utilisant l'un de ces mots-clés boursiers pour recevoir instantanément un topo approfondi, ou rendez-vous sur l'onglet **Cours** pour suivre notre parcours de leçons interactives !

_Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels._`;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Route: AI Chat Advice (Streaming over Server-Sent Events for lowest latency)
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    try {
      if (!message) {
        res.status(400).json({ error: "Le message est obligatoire." });
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
      const systemInstruction = `Vous êtes "Finance Bridge AI", un assistant financier virtuel de haute performance et hautement pédagogue. Vos rôles :
1. Aider et guider les utilisateurs dans l'apprentissage de l'investissement en bourse.
2. Expliquer de manière simple, claire et accessible les concepts financiers (valeur refuge, dividende, PE Ratio, volatilité, ETF, obligations, ordres au marché/limite).
3. Rendre la bourse engageante, amusante et décomplexée pour les débutants.
4. Ajouter un court rappel à la fin si des conseils d'achat d'actions spécifiques sont demandés ("Avertissement : Les informations éducatives fournies ne constituent pas des conseils financiers officiels.").

Veuillez répondre exclusivement en français. Soyez chaleureux et encourageant, comme l'oiseau de Duolingo de la finance. Rédigez des réponses bien espacées en Markdown avec de jolies listes à puces.`;

      // We can use a single generateContent call with history mapped to clear roles or simple chat
      // To keep it highly performant and flexible:
      let prompt = "";
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          const roleName = msg.sender === 'user' ? 'Utilisateur' : 'Finance Bridge AI';
          prompt += `${roleName}: ${msg.text}\n`;
        });
      }
      prompt += `Utilisateur: ${message}\nFinance Bridge AI:`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const responseStream = await generateContentStreamWithRetry(client, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW // Lower latency by minimizing unnecessary deep reasoning
          }
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

        console.log(`[Chat API] Activating local French educational fallback stream for message: "${message ? message.substring(0, 30) : ""}"`);
        const fallbackText = getOfflineFinancialResponse(message || "");
        
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

  // API Route: Real-time News via Yahoo Finance RSS & Gemini Dynamic French Interpretation
  app.get("/api/news/:symbol", async (req, res) => {
    const { symbol } = req.params;
    if (!symbol) {
      res.status(400).json({ error: "Le symbole de l'action est obligatoire." });
      return;
    }

    const uppercaseSymbol = symbol.toUpperCase();
    const now = Date.now();

    // 1. Check if we have a fresh cached copy of real-time news
    const cachedEntry = newsCache[uppercaseSymbol];
    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
      console.log(`[News API - CACHE HIT] Serving fresh cached news for ${uppercaseSymbol} (${Math.round((now - cachedEntry.timestamp)/1000)}s old)`);
      res.json(cachedEntry.data);
      return;
    }

    let xmlText = "";
    try {
      // 2. Fetch RSS Feed from Yahoo Finance server-side with User-Agent and timeout
      const feedUrl = `https://finance.yahoo.com/rss/headline?s=${uppercaseSymbol}`;
      console.log(`[News API] Loading Yahoo Finance RSS feed for ${uppercaseSymbol}: ${feedUrl}`);
      
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
        console.log(`[News API] Gemini is in cooldown, key is missing, or permanently disabled. Attempting localized XML RSS parsing for ${uppercaseSymbol}...`);
        const parsedItems = parseYahooRSS(xmlText, uppercaseSymbol);
        if (parsedItems.length > 0) {
          console.log(`[News API] Successfully parsed ${parsedItems.length} live RSS news without Gemini.`);
          newsCache[uppercaseSymbol] = {
            data: parsedItems,
            timestamp: Date.now()
          };
          res.json(parsedItems);
          return;
        } else {
          console.log(`[News API] Local RSS parsing failed/returned empty. Giving fallback static predefined data.`);
          res.json(FALLBACK_NEWS[uppercaseSymbol] || FALLBACK_NEWS["AAPL"]);
          return;
        }
      }

      console.log(`[News API] Processing ${uppercaseSymbol} RSS news XML via Gemini 3.5 Flash...`);
      const client = getAIClient();

      const systemInstruction = `Tu es un analyste financier expert francophone. Ton travail est d'extraire de l'XML du flux RSS Yahoo Finance les 3 actualités les plus pertinentes et récentes pour l'action demandée.
Missions :
1. Traduis le titre original en français professionnel boursier, court, impactant et clair.
2. Rédige un résumé très court en français (1 ou 2 phrases simples et pédagogiques) résumant parfaitement l'essentiel de l'annonce.
3. Extrais l'URL ou lien d'origine absolu depuis la balise <link> ou <guid> de l'article XML et place-le dans le champ "link". S'il n'est pas présent, mets "https://finance.yahoo.com/quote/" suivi du symbole boursier.
4. Rédige un article complet pédagogique appelé "fullText" en français, composé de 3 à 4 paragraphes structurés (environ 200 à 250 mots). Cet article doit expliquer l'évènement en profondeur, citer des statistiques ou chiffres réels/estimés, expliquer ce que cela signifie pour l'avenir de l'action, et inclure une leçon de gestion des risques pour un investisseur particulier.
5. Attribue un sentiment boursier d'impact à court terme : "positive" (hausse probable de confiance), "negative" (baisse probable ou méfiance) ou "neutral" (neutre ou information de routine stable).
6. S'assurer que le tableau JSON contient exactement 3 objets bien séparés.
7. Si l'XML ne contient aucune info valide, renvoie d'excellentes nouvelles simulées d'impact créées d'après l'actualité récente mondiale de ce ticker.`;

      const prompt = `Voici le code XML du flux d'actualités boursières pour l'action ${uppercaseSymbol} :

${xmlText.slice(0, 7000)}

Analyse ce flux, choisis les 3 articles les plus importants/récents et retourne-les exclusivement sous forme d'un tableau JSON d'actualités d'impact traduit en français.
Veuillez respecter le schéma JSON requis.`;

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
        console.log(`[News API] Successfully generated ${newsArray.length} real-time translated news for ${uppercaseSymbol}`);
        
        // Save to cache
        newsCache[uppercaseSymbol] = {
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

      console.log(`[News API] Quiet fallback processed for ${uppercaseSymbol}: ${err.message}`);
      
      const parsedItems = parseYahooRSS(xmlText || "", uppercaseSymbol);
      if (parsedItems.length > 0) {
        newsCache[uppercaseSymbol] = {
          data: parsedItems,
          timestamp: Date.now()
        };
        res.json(parsedItems);
      } else if (cachedEntry) {
        console.log(`[News API] Serving older in-memory cache for ${uppercaseSymbol}`);
        res.json(cachedEntry.data);
      } else {
        console.log(`[News API] No cache found. Serving fallback predefined static data for ${uppercaseSymbol}`);
        res.json(FALLBACK_NEWS[uppercaseSymbol] || FALLBACK_NEWS["AAPL"]);
      }
    }
  });

  // API Route: Live, real-life stock prices with fallback protection
  let stocksCache: any = null;
  let lastStocksFetch = 0;
  let stocksSourceCache = "fallback-proxy";
  const STOCKS_CACHE_DURATION = 30 * 1000; // 30 seconds

  app.get("/api/stocks", async (req, res) => {
    const now = Date.now();
    const requestKey = req.headers['x-twelve-data-key'] as string;
    const hasKey = !!(requestKey || process.env.TWELVE_DATA_API_KEY || process.env.FINNHUB_API_KEY || process.env.RAPIDAPI_KEY);
    
    if (stocksCache && (now - lastStocksFetch < STOCKS_CACHE_DURATION)) {
      // Bypass cache if we currently have "fallback-proxy" but we now have an API key available to get high-quality data
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
        console.log("[Prices API] All fetch methods failed or no keys set. Applying randomized real-time stock price simulations.");
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

        // Adjust historical data points to reflect new price level
        const scale = price / stock.price;
        const history = stock.history.map((hPrice) => parseFloat((hPrice * scale).toFixed(2)));

        return {
          ...stock,
          price,
          change,
          low24h,
          high24h,
          volume,
          history
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
  app.get("/api/stocks/history/:symbol", async (req, res) => {
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

    // --- 1. Try Yahoo Finance /v8/finance/chart direct API first (Free, real-time historical, no key needed, highly reliable) ---
    try {
      console.log(`[Prices API] Fetching real history for ${querySymbol} from Yahoo Finance direct API...`);
      const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${querySymbol}?range=1y&interval=1d`;
      const yfResponse = await fetch(yfUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(6000)
      });

      if (yfResponse.ok) {
        const yfData: any = await yfResponse.json();
        const result = yfData?.chart?.result?.[0];
        const closePrices = result?.indicators?.quote?.[0]?.close;
        
        if (Array.isArray(closePrices)) {
          const prices = closePrices
            .map((p: any) => parseFloat(p))
            .filter((p: number) => !isNaN(p) && p > 0);

          if (prices.length > 0) {
            console.log(`[Prices API] Successfully fetched ${prices.length} historical prices from Yahoo Finance for ${symbol}`);
            return res.json({ symbol, history: prices });
          }
        }
      }
    } catch (yfErr: any) {
      console.warn(`[Prices API] Yahoo Finance direct history fetch failed for ${symbol}:`, yfErr.message);
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
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
