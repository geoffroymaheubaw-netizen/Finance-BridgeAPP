import { LessonModule } from "./types";

export const LESSON_MODULES: LessonModule[] = [
  {
    id: "mod1",
    title: "Niveau 1 : Les Fondations financières",
    description: "Désacralisez le fonctionnement de la bourse, la création de valeur et l'origine des actions.",
    lessons: [
      {
        id: "l1_1",
        title: "Qu'est-ce qu'une action ?",
        description: "Comprenez comment devenir copropriétaire d'une entreprise et toucher des dividendes.",
        xpReward: 100,
        durationMinutes: 5,
        slides: [
          {
            title: "1. La part de propriété d'une entreprise",
            text: "Une action est un titre financier représentant une fraction directe du capital social d'une société cotée. Lorsque vous achetez une action (par exemple d'Apple, Microsoft ou LVMH), vous devenez légalement un actionnaire et copropriétaire de l'entreprise au prorata de votre investissement.",
            bullets: [
              "Vous détenez une fraction réelle du capital et de la valeur patrimoniale de l'entreprise.",
              "Vous possédez un droit de vote lors des assemblées générales pour approuver les décisions stratégiques.",
              "Vous bénéficiez de deux leviers de gains : l'appréciation du cours (plus-value) et la distribution de dividendes."
            ],
            illustration: "company"
          },
          {
            title: "2. Pourquoi une société entre-t-elle en Bourse ? (IPO)",
            text: "L'introduction en bourse (Initial Public Offering ou IPO) permet à une entreprise privée d'ouvrir son capital au grand public et aux investisseurs institutionnels mondiaux afin de financer ses projets d'envergure sans s'endetter lourdement auprès des banques.",
            bullets: [
              "Levée de capitaux : financer la recherche & développement, recruter des talents et construire des usines.",
              "Notoriété mondiale : offrir une visibilité de marque internationale et inspirer confiance aux partenaires.",
              "Liquidité pour les fondateurs : permettre aux investisseurs historiques d'échanger librement leurs parts."
            ],
            illustration: "growth"
          },
          {
            title: "3. Les Dividendes : Le partage des bénéfices",
            text: "Le dividende est la part des bénéfices nets d'une entreprise redistribuée périodiquement (trimestriellement ou annuellement) à ses actionnaires fidèles en récompense de leur confiance.",
            bullets: [
              "Le dividende est prélevé uniquement sur les bénéfices nets réels, jamais sur le chiffre d'affaires brut.",
              "Il n'est jamais garanti : le conseil d'administration peut décider de réinvestir 100% des gains dans la croissance future.",
              "Les 'Aristocrates du Dividende' sont des entreprises solides augmentant leur dividende chaque année depuis plus de 25 ans."
            ],
            illustration: "dividend"
          },
          {
            title: "4. Exemple concret & Règle d'or de l'actionnaire",
            text: "Si l'entreprise Alpha vaut 100 millions d'euros et a émis 1 million d'actions à 100€ l'unité : en achetant 50 actions pour 5 000€, vous possédez exactement 0,005% de l'ensemble de la société.",
            bullets: [
              "Si Alpha verse un dividende annuel de 4€ par action, vous recevrez 200€ bruts de revenus passifs par an.",
              "Si la valeur de l'entreprise double pour atteindre 200M€, vos 50 actions vaudront 10 000€ (+100% de plus-value).",
              "Règle de sécurité : En cas de faillite, votre responsabilité est limitée à votre mise initiale (vous ne devez jamais payer les dettes)."
            ],
            illustration: "target"
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
              "Lever des capitaux auprès du public pour financer sa croissance ou ses projets d'innovation.",
              "Offrir des cadeaux gratuits à tous les citoyens de la ville.",
              "Réduire son équipe de direction."
            ],
            correctAnswerIndex: 1,
            explanation: "En s'introduisant en bourse, une entreprise vend des fractions de son capital au public afin de récolter des fonds pour se développer et innover sans dette bancaire excessive."
          },
          {
            id: "q_1_3",
            text: "Qu'est-ce qu'un 'dividende' en bourse ?",
            options: [
              "Une amende infligée par la loi si l'action baisse.",
              "Une taxe prélevée par la banque du courtier.",
              "La redistribution d'une partie des bénéfices nets de l'entreprise à ses actionnaires.",
              "La totalité du chiffre d'affaires brut d'une entreprise."
            ],
            correctAnswerIndex: 2,
            explanation: "Le dividende est la part du bénéfice net d'une entreprise redistribuée périodiquement (souvent chaque trimestre ou année) à ses investisseurs."
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
            explanation: "La responsabilité de l'actionnaire est strictement limitée à son investissement initial. Si le cours tombe à zéro, vous perdez votre mise, mais vos biens personnels ne peuvent jamais être saisis."
          }
        ]
      },
      {
        id: "l1_2",
        title: "La loi de l'offre et de la demande",
        description: "Découvrez la mécanique fondamentale qui fait monter et baisser les cours de bourse chaque seconde.",
        xpReward: 150,
        durationMinutes: 5,
        slides: [
          {
            title: "1. La mécanique du prix d'équilibre",
            text: "Le prix d'une action cotée n'est jamais fixé arbitrairement par un gouvernement ou une banque. Il résulte seconde après seconde de la confrontation directe entre acheteurs (la Demande) et vendeurs (l'Offre) au sein du carnet d'ordres.",
            bullets: [
              "La Demande (acheteurs) pousse les prix vers le haut lorsque la volonté d'acheter est supérieure.",
              "L'Offre (vendeurs) pousse les prix vers le bas lorsque beaucoup de participants souhaitent liquider leurs parts.",
              "Le 'cours d'équilibre' est le tarif précis auquel le maximum de transactions peut être exécuté."
            ],
            illustration: "balance"
          },
          {
            title: "2. Les catalyseurs fondamentaux et psychologiques",
            text: "Qu'est-ce qui pousse des milliers d'investisseurs à acheter ou vendre en même temps ? Principalement la rentabilité perçue et les anticipations d'avenir.",
            bullets: [
              "Résultats trimestriels supérieurs aux attentes : explosion de la demande et hausse immédiate du cours.",
              "Alertes sur les bénéfices (Profit Warning) ou crise sectorielle : fuite des acheteurs et baisse rapide du prix.",
              "Taux d'intérêt des banques centrales : la hausse des taux ralentit l'économie et rend l'emprunt plus cher pour les entreprises."
            ],
            illustration: "trend"
          },
          {
            title: "3. Exemple chiffré : Le choc de la demande",
            text: "Imaginons qu'une entreprise de semi-conducteurs annonce la découverte d'une puce révolutionnaire. 50 000 investisseurs veulent immédiatement acheter 100 actions chacun, alors que seulement 5 000 actions sont mises en vente au prix actuel de 50€.",
            bullets: [
              "Pour être servis en priorité, les acheteurs proposent 52€, puis 55€, puis 60€.",
              "Le cours monte jusqu'à ce que des vendeurs acceptent de se séparer de leurs actions à ces prix plus élevés.",
              "Le nouveau cours d'équilibre s'établit par exemple à 62€ (+24%)."
            ],
            illustration: "growth"
          },
          {
            title: "4. Le Cours de Clôture & Résumé de séance",
            text: "À la fermeture officielle de la séance journalière (ex: 17h30 à Paris, 16h00 à New York), le dernier échange validé fixe le cours officiel de clôture de la journée.",
            bullets: [
              "Ce cours sert de référence pour calculer la variation en pourcentage du jour (+2,5%, -1,8%).",
              "La nuit ou le week-end, des nouvelles mondiales peuvent créer un écart de prix (Gap) à l'ouverture suivante.",
              "Règle d'or : Ne confondez pas le prix d'une action avec sa valeur réelle (une action à 10€ peut être plus chère qu'une action à 500€ si elle ne génère aucun profit)."
            ],
            illustration: "time"
          }
        ],
        questions: [
          {
            id: "q_2_1",
            text: "Si beaucoup d'investisseurs souhaitent s'arracher une action mais que personne ne veut la vendre, que va faire son cours ?",
            options: [
              "Le cours va stagner instantanément à zéro.",
              "Le cours va augmenter considérablement pour attirer de nouveaux vendeurs.",
              "Le cours va chuter sous forme de krach.",
              "La bourse va interdire l'action définitivement."
            ],
            correctAnswerIndex: 1,
            explanation: "Quand la demande (les acheteurs) excède l'offre (les vendeurs), la concurrence entre acheteurs fait grimper le prix d'équilibre de l'action."
          },
          {
            id: "q_2_2",
            text: "Quel facteur peut négativement influencer la demande pour une action en bourse ?",
            options: [
              "Une hausse spectaculaire et inattendue des bénéfices nets.",
              "De mauvaises prévisions économiques, une récession ou une perte de brevets clés.",
              "Le recrutement d'innovateurs de premier plan dans l'entreprise.",
              "L'annonce d'une distribution record de dividendes."
            ],
            correctAnswerIndex: 1,
            explanation: "Les nouvelles défavorables sapent la confiance des investisseurs, provoquant une baisse de la demande et un afflux d'ordres de vente, ce qui tire les cours vers le bas."
          },
          {
            id: "q_2_3",
            text: "Si une entreprise publie des résultats financiers très décevants par rapport aux attentes des analystes, que se passe-t-il ?",
            options: [
              "L'offre de vente s'effondre car tout le monde préfère attendre l'année prochaine.",
              "La demande d'achat baisse et l'offre de vente augmente, poussant le prix vers le bas.",
              "Le prix s'équilibre automatiquement à l'euro supérieur par solidarité.",
              "L'action est automatiquement rachetée par les ministères publics."
            ],
            correctAnswerIndex: 1,
            explanation: "La déception financière érode la confiance. Moins d'investisseurs veulent acheter et beaucoup veulent vendre, ce qui entraîne une baisse du cours."
          },
          {
            id: "q_2_4",
            text: "Que représente le 'cours de clôture' d'une action ?",
            options: [
              "Le prix de départ historique d'une entreprise lors de sa création.",
              "Le dernier prix d'échange enregistré sur le carnet d'ordres à la fin de la séance de marché du jour.",
              "La moyenne des prix d'achat imposée par les banques partenaires.",
              "La valeur de l'action recalculée après l'impôt sur les plus-values."
            ],
            correctAnswerIndex: 1,
            explanation: "Le cours de clôture est le dernier tarif négocié à la fin de la séance boursière. C'est le prix de référence publié dans la presse financière."
          }
        ]
      },
      {
        id: "l1_3",
        title: "Les indices nationaux et mondiaux",
        description: "Découvrez les grands baromètres économiques mondiaux : CAC 40, S&P 500, NASDAQ et Dow Jones.",
        xpReward: 180,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Qu'est-ce qu'un Indice Boursier ?",
            text: "Un indice boursier est un panier théorique regroupant les plus grandes entreprises cotées d'un pays ou d'un secteur pour mesurer en temps réel la santé globale de cette économie.",
            bullets: [
              "Au lieu d'analyser 500 bilans financiers individuels, l'indice offre un chiffre unique et synthétique.",
              "Si la majorité des entreprises composant l'indice progressent, l'indice monte.",
              "Les entreprises sont généralement pondérées selon leur capitalisation boursière (plus l'entreprise est grosse, plus son impact sur l'indice est important)."
            ],
            illustration: "index"
          },
          {
            title: "2. Les indices de référence incontournables",
            text: "Chaque grande place financière mondiale possède son propre indice phare servant d'étalon aux gestionnaires de fonds.",
            bullets: [
              "🇫🇷 CAC 40 : Les 40 plus grandes capitalisations françaises cotées à Paris (LVMH, TotalEnergies, Sanofi, Schneider Electric...).",
              "🇺🇸 S&P 500 : Les 500 entreprises majeures des États-Unis, représentant ~80% de la capitalisation américaine.",
              "🇺🇸 NASDAQ 100 : L'indice phare des champions mondiaux de la technologie (Apple, Microsoft, Nvidia, Alphabet...).",
              "🇯🇵 Nikkei 225 & 🇩🇪 DAX 40 : Les thermomètres des économies japonaise et allemande."
            ],
            illustration: "growth"
          },
          {
            title: "3. Pondération & Exemple concret de calcul",
            text: "Dans un indice pondéré par la capitalisation (comme le S&P 500 ou le CAC 40), une variation de 5% d'un géant comme Apple ou LVMH pèse beaucoup plus lourd qu'une variation de 5% d'une plus petite valeur de l'indice.",
            bullets: [
              "Si les 5 premières entreprises du S&P 500 montent fortement, l'indice peut être positif même si 250 petites entreprises stagnent.",
              "Historiquement, sur des périodes de 10 à 20 ans, le S&P 500 a offert un rendement moyen annualisé brut de l'ordre de 9% à 10% (dividendes réinvestis).",
              "Les crises majeures (2000, 2008, 2020) ont toutes été surmontées avec de nouveaux sommets historiques."
            ],
            illustration: "trend"
          },
          {
            title: "4. Comment investir sur un indice entier ?",
            text: "Un indice est un outil statistique : on ne peut pas acheter directement 'un indice CAC 40'. Pour investir sur la performance d'un indice, on utilise des véhicules répliquants appelés ETFs (ou Trackers).",
            bullets: [
              "Un ETF CAC 40 ou S&P 500 achète mécaniquement toutes les actions de l'indice pour vous.",
              "Cela permet d'investir sur 40 ou 500 entreprises en un seul clic à frais ultra-réduits.",
              "Synthèse : L'indice est le thermomètre, l'ETF est le médicament d'investissement."
            ],
            illustration: "basket"
          }
        ],
        questions: [
          {
            id: "q_1_3_1",
            text: "Qu'est-ce qu'un indice boursier comme le CAC 40 ou le S&P 500 ?",
            options: [
              "Une taxe imposée sur chaque achat et vente d'actions.",
              "Un panier de référence regroupant les plus grandes entreprises représentatives d'une place financière pour mesurer leur performance collective.",
              "Une amende internationale pour limiter les investissements étrangers.",
              "Un compte bancaire bloqué pendant 5 ans."
            ],
            correctAnswerIndex: 1,
            explanation: "Un indice boursier compile et pondère le cours des plus grandes entreprises d'une économie ou d'un secteur pour servir de baromètre d'ensemble."
          },
          {
            id: "q_1_3_2",
            text: "Quel indice boursier est célèbre pour regrouper les 100 plus grands champions technologiques mondiaux ?",
            options: [
              "Le CAC 40",
              "Le NASDAQ 100",
              "Le Nikkei 225",
              "Le FTSE 100"
            ],
            correctAnswerIndex: 1,
            explanation: "Le NASDAQ 100 est l'indice boursier américain à forte dominante technologique, regroupant Apple, Microsoft, NVIDIA, Amazon ou Alphabet."
          },
          {
            id: "q_1_3_3",
            text: "Pourquoi dit-on que la plupart des grands indices boursiers sont 'pondérés par la capitalisation' ?",
            options: [
              "Parce que toutes les entreprises comptent exactement pour le même pourcentage (1%).",
              "Parce que les plus grandes entreprises en valeur totale ont un poids supérieur dans la variation de l'indice.",
              "Parce que seules les entreprises ayant des dettes sont comptabilisées.",
              "Parce que le président de la bourse choisit les pourcentages chaque matin."
            ],
            correctAnswerIndex: 1,
            explanation: "Dans un indice pondéré par la capitalisation, plus une entreprise vaut cher sur le marché, plus sa variation influence le score global de l'indice."
          },
          {
            id: "q_1_3_4",
            text: "Comment un particulier peut-il répliquer simplement la performance d'un grand indice boursier dans son portefeuille ?",
            options: [
              "En achetant une par une les 500 actions chaque semaine manuellement.",
              "En investissant dans un ETF (Tracker) indiciel à très faibles frais de gestion.",
              "En demandant une autorisation spéciale au ministère de l'économie.",
              "En ouvrant un compte épargne à taux zéro."
            ],
            correctAnswerIndex: 1,
            explanation: "Les ETFs indiciels (Trackers) permettent de répliquer fidèlement et automatiquement la performance d'indices complets en une seule transaction à frais réduits."
          }
        ]
      },
      {
        id: "l1_4",
        title: "Les Places Boursières, Courtiers & Comptes (PEA / CTO)",
        description: "Comprenez le rôle des bourses mondiales, le choix du courtier et les enveloppes fiscales pour investir.",
        xpReward: 200,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Les Grandes Places Boursières Mondiales",
            text: "Une place boursière (ou marché boursier) est une infrastructure physique et électronique hautement réglementée où s'échangent les actifs financiers selon des horaires stricts.",
            bullets: [
              "Euronext Paris / Amsterdam : Marché paneuropéen ouvert de 9h00 à 17h30 (heure de Paris).",
              "Wall Street (NYSE & NASDAQ) : Les plus grandes bourses mondiales à New York, ouvertes de 15h30 à 22h00 (heure française).",
              "Bourses asiatiques (Tokyo, Hong Kong, Shanghai) : Actives la nuit pour les résidents européens.",
              "Séance de pré-ouverture & Fixing : Périodes d'accumulation des ordres avant le coup d'envoi officiel pour fixer le cours d'ouverture."
            ],
            illustration: "globe"
          },
          {
            title: "2. Le Rôle Fondamental du Courtier (Broker)",
            text: "Un particulier ne peut pas contacter directement la bourse de New York ou de Paris. Il doit obligatoirement passer par un intermédiaire financier agréé : le courtier (ou broker).",
            bullets: [
              "Passerelle réglementée : Le courtier achemine vos ordres d'achat et de vente vers les marchés boursiers en quelques millisecondes.",
              "Garde des titres : Il conserve vos actions et encaisse automatiquement vos dividendes sur votre compte espèces.",
              "Frais de courtage : Comparez les commissions par ordre (les courtiers en ligne modernes facturent souvent moins de 1€ à 2€ par transaction, contre 10€+ pour les banques traditionnelles)."
            ],
            illustration: "broker"
          },
          {
            title: "3. PEA vs Compte-Titres Ordinaire (CTO)",
            text: "Pour détenir des actions et des ETFs, vous devez ouvrir un compte d'investissement. En France et en Europe, deux enveloppes principales coexistent avec des régimes fiscaux différents :",
            bullets: [
              "PEA (Plan d'Épargne en Actions) : Exonération d'impôt sur les plus-values et dividendes après 5 ans de détention (seuls les prélèvements sociaux de 17,2% s'appliquent). Plafond de 150 000€ de versements, réservé aux actions européennes et ETFs éligibles.",
              "CTO (Compte-Titres Ordinaire) : Aucune limite de versement, accès illimité à tous les marchés mondiaux (USA, Asie, obligations, options), mais soumis au prélèvement forfaitaire unique (Flat Tax de 30%).",
              "Stratégie optimale : Remplir son PEA en priorité avec des ETFs mondiaux éligibles, puis ouvrir un CTO pour les actions américaines spécifiques."
            ],
            illustration: "wallet"
          },
          {
            title: "4. Bonnes Pratiques & Sécurité du Compte",
            text: "Avant de réaliser votre tout premier ordre d'achat réel, appliquez les règles d'or de protection patrimoniale :",
            bullets: [
              "Vérifiez que le courtier est enregistré auprès des autorités de régulation (AMF en France, BaFin en Allemagne, SEC aux USA).",
              "Activez systématiquement l'authentification à deux facteurs (2FA) pour sécuriser vos accès.",
              "Séparez bien vos liquidités de vie quotidienne (compte courant) de votre compte de trading et de votre épargne de long terme."
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_1_4_1",
            text: "Quel est le rôle indispensable d'un 'courtier' (broker) pour un investisseur particulier ?",
            options: [
              "Prêter de l'argent gratuitement sans aucun remboursement.",
              "Servir d'intermédiaire financier agréé pour exécuter les ordres d'achat/vente sur les bourses et assurer la conservation des titres.",
              "Rédiger les lois de finance au parlement.",
              "Fixer arbitrairement le cours de toutes les actions chaque matin."
            ],
            correctAnswerIndex: 1,
            explanation: "Le courtier est l'intermédiaire obligatoire qui transmet vos ordres aux places boursières et conserve légalement vos actifs financiers."
          },
          {
            id: "q_1_4_2",
            text: "Quel est l'avantage fiscal majeur du Plan d'Épargne en Actions (PEA) après 5 ans de détention ?",
            options: [
              "Il supprime totalement tous les risques de baisse des actions.",
              "Il offre une exonération totale d'impôt sur le revenu sur les plus-values et dividendes (seuls les prélèvements sociaux restent dus).",
              "Il double automatiquement les dividendes versés par les entreprises.",
              "Il permet d'acheter des biens immobiliers sans notaire."
            ],
            correctAnswerIndex: 1,
            explanation: "Après 5 ans, les gains réalisés au sein d'un PEA sont exonérés d'impôt sur le revenu lors des retraits, ce qui maximise considérablement le rendement net final."
          },
          {
            id: "q_1_4_3",
            text: "À quelle heure française ouvre généralement la bourse de Wall Street (New York) ?",
            options: [
              "À 9h00 du matin.",
              "À 15h30 de l'après-midi.",
              "À 23h00 de la nuit.",
              "Elle est ouverte en continu 24h/24 sans interruption."
            ],
            correctAnswerIndex: 1,
            explanation: "En raison du décalage horaire, la séance officielle des marchés américains (NYSE, NASDAQ) se déroule de 15h30 à 22h00 (heure de Paris)."
          },
          {
            id: "q_1_4_4",
            text: "Quelle mesure de sécurité fondamentale devez-vous impérativement activer sur votre compte de courtage ?",
            options: [
              "Partager votre mot de passe avec vos collègues de travail.",
              "Activer l'authentification à deux facteurs (2FA) pour bloquer toute tentative d'intrusion non autorisée.",
              "Écrire vos identifiants sur une feuille de papier public.",
              "Désactiver toutes les alertes de connexion par email."
            ],
            correctAnswerIndex: 1,
            explanation: "L'authentification à double facteur (2FA) protège votre patrimoine en exigeant une validation sur votre téléphone lors de chaque connexion ou transaction."
          }
        ]
      },
      {
        id: "l1_exam",
        title: "🎓 Examen Final : Maîtrise des Fondations",
        description: "Épreuve de synthèse du Niveau 1 : testez vos connaissances sur les actions, l'offre & demande, les indices et le courtage.",
        xpReward: 350,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : L'Action & Le Dividende",
            text: "Une action représente une part de copropriété d'une entreprise. En tant qu'actionnaire, vous profitez de la croissance économique et touchez potentiellement des dividendes issus des bénéfices nets.",
            bullets: [
              "Différence avec l'obligation : L'actionnaire est copropriétaire de l'entreprise, tandis que l'obligataire est un simple créancier qui a prêté de l'argent.",
              "IPO (Introduction en Bourse) : Permet à une entreprise de lever des capitaux auprès du public pour financer sa recherche et son expansion.",
              "Dividende : Part des bénéfices réinvestie ou distribuée périodiquement aux actionnaires fidèles."
            ],
            illustration: "globe"
          },
          {
            title: "2. Révision : L'Offre, la Demande & Les Indices",
            text: "Le prix d'une action s'ajuste continuellement en fonction du rapport de force entre les acheteurs et les vendeurs.",
            bullets: [
              "Hausse des cours : Se produit quand la demande d'achat dépasse l'offre de vente disponible.",
              "Indices boursiers : Grands thermomètres de l'économie mondiale (CAC 40, S&P 500, MSCI World) servant de référence de marché.",
              "Trackers / ETFs : Permettent de posséder l'ensemble des titres d'un indice en une seule ligne à coût minime."
            ],
            illustration: "balance"
          },
          {
            title: "3. Révision : Le Courtier et le PEA",
            text: "Le courtier est votre passerelle légale et sécurisée pour exécuter vos transactions sur les marchés mondiaux.",
            bullets: [
              "PEA : Enveloppe d'investissement réservée aux résidents fiscaux français, exonérée d'impôt sur les plus-values après 5 ans de détention.",
              "Sécurité : Activation impérative du 2FA et conservation stricte des identifiants.",
              "Horaires clés : Euronext (9h00 - 17h30), Wall Street (15h30 - 22h00 heure de Paris)."
            ],
            illustration: "wallet"
          },
          {
            title: "4. Consignes de l'Examen Final",
            text: "Vous allez affronter 5 questions de mise en situation concrète pour valider votre certification du Niveau 1. Prenez le temps de bien analyser chaque énoncé avant de répondre !",
            bullets: [
              "5 questions de synthèse transversales.",
              "En cas d'erreur, la question vous sera reposée en fin d'épreuve pour consolider votre apprentissage.",
              "Validez l'examen pour débloquer le Niveau 2 et empocher 350 XP !"
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_1_e_1",
            text: "Quelle est la différence fondamentale entre posséder une 'action' et posséder une 'obligation' d'une entreprise ?",
            options: [
              "L'action fait de vous un copropriétaire de l'entreprise avec droit aux bénéfices, tandis que l'obligation est une créance où l'entreprise vous rembourse un prêt avec intérêts.",
              "L'action est délivrée par la mairie et l'obligation par la préfecture.",
              "L'action est interdite aux particuliers, l'obligation est obligatoire pour tous les citoyens.",
              "Il n'y a aucune différence, ce sont deux termes strictement synonymes."
            ],
            correctAnswerIndex: 0,
            explanation: "L'action confère une part du capital et des profits futurs, tandis que l'obligation est un titre de dette où l'entreprise vous rembourse le capital prêté plus des intérêts convenus."
          },
          {
            id: "q_1_e_2",
            text: "Si une entreprise annonce des résultats financiers exceptionnels avec un bénéfice record inattendu, que va-t-il très probablement se passer à l'ouverture de la bourse ?",
            options: [
              "La demande d'achat va bondir, poussant le cours de l'action à la hausse.",
              "Tous les actionnaires vont devoir payer une amende à la banque centrale.",
              "Le cours de l'action va immédiatement tomber à zéro.",
              "L'action sera définitivement supprimée de la bourse."
            ],
            correctAnswerIndex: 0,
            explanation: "Une nouvelle positive attire un afflux important d'acheteurs. La demande excédant l'offre de vente, le prix d'équilibre s'ajuste à la hausse."
          },
          {
            id: "q_1_e_3",
            text: "Quel indice boursier est considéré comme le baromètre de référence le plus influent de l'économie américaine et mondiale ?",
            options: [
              "Le Livret A.",
              "Le S&P 500 (regroupant les 500 plus grandes entreprises cotées aux États-Unis).",
              "Le CAC 40.",
              "L'indice du prix du pain."
            ],
            correctAnswerIndex: 1,
            explanation: "Le S&P 500 regroupe 500 géants industriels et technologiques américains et représente la plus grande capitalisation boursière au monde."
          },
          {
            id: "q_1_e_4",
            text: "Pourquoi le Plan d'Épargne en Actions (PEA) est-il vivement recommandé pour débuter en bourse en France ?",
            options: [
              "Parce qu'il garantit que la bourse ne baissera jamais.",
              "Parce qu'il permet une exonération totale d'impôt sur le revenu sur les gains et dividendes après 5 ans.",
              "Parce qu'il offre un prêt gratuit de 100 000€ à l'ouverture.",
              "Parce qu'il est géré directement par le président de la République."
            ],
            correctAnswerIndex: 1,
            explanation: "Le cadre fiscal avantageux du PEA après 5 ans (seuls les prélèvements sociaux de 17,2% s'appliquent) booste significativement le rendement net à long terme."
          },
          {
            id: "q_1_e_5",
            text: "Un ami vous propose d'acheter une action sur les marchés américains à 11h00 du matin (heure de Paris). Pourquoi votre ordre ne s'exécutera-t-il pas immédiatement ?",
            options: [
              "Parce que la bourse de Wall Street à New York n'ouvre qu'à 15h30 (heure française) en raison du décalage horaire.",
              "Parce que les ordinateurs sont éteints le matin.",
              "Parce que les ordres doivent être envoyés par courrier postal.",
              "Parce que les transactions en dollars sont interdites avant midi."
            ],
            correctAnswerIndex: 0,
            explanation: "Les bourses de New York (NYSE et NASDAQ) ouvrent à 9h30 heure locale de New York, ce qui correspond à 15h30 heure de Paris."
          }
        ]
      }
    ]
  },
  {
    id: "mod2",
    title: "Niveau 2 : Portefeuille & Diversification",
    description: "Apprenez à construire un portefeuille robuste, tout-terrain et imperméable aux crises.",
    lessons: [
      {
        id: "l2_1",
        title: "Les ETFs : Panier d'actions clé-en-main",
        description: "Pourquoi et comment posséder des centaines d'entreprises mondiales en un seul clic à bas coût.",
        xpReward: 200,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Qu'est-ce qu'un ETF (Tracker) ?",
            text: "Un ETF (Exchange Traded Fund ou Tracker) est un fonds d'investissement coté en continu qui réplique fidèlement la performance d'un indice boursier (comme le S&P 500, le CAC 40 ou le MSCI World).",
            bullets: [
              "Diversification instantanée : En achetant une seule part d'ETF à 50€ ou 100€, vous investissez dans 500 à 1 500 entreprises d'un coup.",
              "Négociation en temps réel : L'ETF s'achète et se vend pendant les heures de bourse exactement comme une action individuelle ordinaire.",
              "Transparence totale : Vous connaissez en permanence les entreprises exactes qui composent le panier."
            ],
            illustration: "basket"
          },
          {
            title: "2. Gestion Passive vs Gestion Active : La révolution des frais",
            text: "La force majeure des ETFs réside dans la gestion passive : un algorithme réplique mécaniquement l'indice sans avoir besoin d'une armée de gestionnaires rémunérés pour 'battre' le marché.",
            bullets: [
              "Frais minimes : Les ETFs facturent généralement entre 0,05% et 0,25% de frais annuels contre 1,5% à 2,5% pour les fonds bancaires traditionnels actifs.",
              "Sur 20 ans, cette différence de 2% de frais annuels préserve des dizaines de milliers d'euros de capital grâce aux intérêts composés.",
              "Statistique S&P SPIVA : Sur 15 ans, plus de 90% des fonds gérés activement sous-performent un simple ETF indiciel S&P 500."
            ],
            illustration: "speed"
          },
          {
            title: "3. Exemple concret : La puissance du MSCI World",
            text: "L'indice MSCI World regroupe plus de 1 400 entreprises de premier plan réparties sur 23 pays développés (USA, Japon, France, Allemagne, Canada, UK, etc.).",
            bullets: [
              "Si vous investissez 1 000€ sur un ETF MSCI World, vous détenez une part d'Apple, de Microsoft, de Toyota, de Nestlé, de LVMH, etc.",
              "Si une entreprise du panier fait faillite, son poids dans l'indice (souvent < 0,1%) est immédiatement amorti par la croissance des autres 1 399 entreprises.",
              "Votre investissement est protégé contre la ruine d'une entreprise individuelle isolée."
            ],
            illustration: "diversity"
          },
          {
            title: "4. ETF Capitalisant vs ETF Distribuant",
            text: "Lorsque vous choisissez un ETF, vous rencontrerez deux modalités de traitement des dividendes versés par les entreprises sous-jacentes :",
            bullets: [
              "ETF Capitalisant (Acc) : Les dividendes sont automatiquement réinvestis dans le fonds pour acheter plus d'actions, maximisant l'effet boule de neige.",
              "ETF Distribuant (Dist) : Les dividendes sont versés en liquidités sur votre compte chaque trimestre ou semestre pour générer des revenus passifs.",
              "Règle d'or : Pour faire grossir son patrimoine à long terme, l'option Capitalisante (Acc) est la plus puissante."
            ],
            illustration: "growth"
          }
        ],
        questions: [
          {
            id: "q_2_1_1",
            text: "Qu'est-ce qu'un ETF (Exchange Traded Fund), aussi appelé 'Tracker' ?",
            options: [
              "Une marque d'ordinateur ultra-rapide pour le trading algorithmique.",
              "Un panier d'actions diversifiées coté en bourse qui réplique fidèlement la performance d'un indice de référence.",
              "Une crypto-monnaie spéculative décentralisée.",
              "Une plateforme secrète gérée par une banque centrale."
            ],
            correctAnswerIndex: 1,
            explanation: "Un ETF est un fonds coté qui réplique un indice boursier en temps réel, permettant de diversifier instantanément sur des centaines d'entreprises à frais très bas."
          },
          {
            id: "q_2_1_2",
            text: "Quel est l'avantage principal des frais d'un ETF indiciel comparé à un fonds traditionnel de banque géré activement ?",
            options: [
              "Les frais des ETFs sont 5 à 10 fois plus bas (souvent 0,1% à 0,2% par an vs 2% pour les fonds actifs), ce qui protège la performance à long terme.",
              "Les ETFs ne s'achètent que les jours fériés.",
              "Les ETFs doublent automatiquement l'argent déposé par l'investisseur.",
              "Les banques interdisent les ETFs aux particuliers."
            ],
            correctAnswerIndex: 0,
            explanation: "Grâce à la gestion passive, les ETFs évitent les coûts de recherche lourds et affichent des frais minimes, maximisant les gains nets conservés par l'investisseur."
          },
          {
            id: "q_2_1_3",
            text: "Que se passe-t-il pour un investisseur détenant un ETF S&P 500 si l'une des 500 entreprises fait faillite ?",
            options: [
              "L'investisseur perd l'ensemble de son capital instantanément.",
              "L'impact est minime pour son portefeuille, car les 499 autres entreprises amortissent cette perte.",
              "L'investisseur est poursuivi en justice pour éponger les dettes.",
              "L'ETF est gelé par les régulateurs financiers pendant deux ans."
            ],
            correctAnswerIndex: 1,
            explanation: "C'est la magie de la diversification : le poids d'une seule entreprise représente souvent moins de 0,5% du total. Sa faillite est absorbée sans danger par le reste du panier."
          },
          {
            id: "q_2_1_4",
            text: "Quelle est la différence entre un ETF 'Capitalisant (Acc)' et un ETF 'Distribuant (Dist)' ?",
            options: [
              "L'ETF Capitalisant réinvestit automatiquement les dividendes pour accélérer la croissance du capital, tandis que le Distribuant les verse sur votre compte.",
              "L'ETF Capitalisant est réservé aux banques privées.",
              "L'ETF Distribuant n'achète jamais d'actions américaines.",
              "L'ETF Capitalisant bloque vos fonds pendant 30 ans."
            ],
            correctAnswerIndex: 0,
            explanation: "Un ETF capitalisant réinvestit automatiquement chaque dividende dans le fonds, ce qui maximise l'effet des intérêts composés sans frottement fiscal ou d'ordre."
          }
        ]
      },
      {
        id: "l2_2",
        title: "L'art délicat de la diversification",
        description: "Apprenez à ne jamais mettre tous vos œufs dans le même panier pour immuniser votre capital.",
        xpReward: 250,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Le danger du 'Single-Stock Risk'",
            text: "Investir l'intégralité de son épargne sur une seule entreprise (même renommée) est l'une des erreurs les plus dangereuses en bourse.",
            bullets: [
              "Scandales comptables (Enron, Wirecard), ruptures technologiques (Kodak, Nokia) ou faillites bancaires (Lehman Brothers, Credit Suisse) démontrent qu'aucun géant n'est invincible.",
              "En cas de chute de 80% sur votre unique titre, il vous faudra un gain de +400% simplement pour retrouver votre mise de départ.",
              "La diversification est le seul 'déjeuner gratuit' en finance : elle réduit le risque sans nécessairement réduire l'espérance de rendement."
            ],
            illustration: "danger"
          },
          {
            title: "2. Les 3 dimensions d'une diversification saine",
            text: "Pour être véritablement diversifié, il ne suffit pas de posséder 10 entreprises du même secteur : il faut diversifier sur 3 axes complémentaires.",
            bullets: [
              "🏢 Diversification Sectorielle : Répartir entre Technologie, Santé, Énergie, Biens de consommation courante, Finance, Industrie et Télécoms.",
              "🌍 Diversification Géographique : Répartir entre États-Unis, Europe, Asie et Marchés émergents pour ne pas dépendre d'une seule politique économique.",
              "📏 Taille d'entreprises : Allier grandes capitalisations stables (Mega/Large Caps) et entreprises moyennes en forte croissance (Mid/Small Caps)."
            ],
            illustration: "diversity"
          },
          {
            title: "3. Exemple concret : La rotation sectorielle",
            text: "Lors d'une hausse rapide des taux d'intérêt, les entreprises technologiques à forte valorisation subissent souvent une correction, alors que les banques et les compagnies pétrolières profitent de marges accrues.",
            bullets: [
              "Un portefeuille composé à 100% de tech peut chuter de -30%.",
              "Un portefeuille diversifié 50% tech / 25% santé / 25% énergie restera stable ou enregistrera une baisse modérée de -4%.",
              "Quand la tendance s'inverse, les secteurs en retard prennent le relais pour propulser l'ensemble."
            ],
            illustration: "balance"
          },
          {
            title: "4. Le piège de la sur-diversification (Diworsification)",
            text: "Attention toutefois à ne pas tomber dans l'excès inverse en achetant manuellement 150 actions différentes en tant que particulier.",
            bullets: [
              "Frais de courtage cumulés exorbitants et impossibilité matérielle de suivre l'actualité de 150 entreprises.",
              "Dilution des meilleures convictions sans gain de protection supplémentaire par rapport à un ETF indiciel.",
              "Règle d'or : Entre 15 et 25 actions sélectionnées avec soin ou 1 à 3 ETFs bien choisis suffisent à atteindre une diversification optimale."
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_2_2_1",
            text: "Pourquoi est-il crucial de diversifier ses investissements en bourse ?",
            options: [
              "Pour s'assurer d'acheter uniquement les actions les plus chères du marché.",
              "Pour limiter l'impact de l'effondrement ou des difficultés d'une seule entreprise sur votre capital global.",
              "Parce que la législation interdit de posséder des actions d'un seul pays.",
              "Pour payer deux fois plus de commissions à son banquier."
            ],
            correctAnswerIndex: 1,
            explanation: "La diversification disperse votre épargne sur plusieurs secteurs et zones géographiques, amortissant les contre-performances individuelles."
          },
          {
            id: "q_2_2_2",
            text: "En bourse, qu'entend-on précisément par 'diversification sectorielle' ?",
            options: [
              "Acheter des actions de deux constructeurs automobiles concurrents uniquement.",
              "Répartir son capital entre des secteurs économiques indépendants (Santé, Technologie, Énergie, Consommation, Finance).",
              "N'investir que dans des commerces de son quartier.",
              "Acheter des devises de pays en guerre."
            ],
            correctAnswerIndex: 1,
            explanation: "La diversification sectorielle évite qu'une crise touchant un pôle industriel spécifique (ex: l'énergie ou l'immobilier) ne ravage l'ensemble de vos économies."
          },
          {
            id: "q_2_2_3",
            text: "Pourquoi la diversification géographique est-elle une pratique recommandée par les professionnels ?",
            options: [
              "Pour voyager sans passeport.",
              "Pour se prémunir contre les risques politiques, réglementaires ou les récessions localisées à un seul pays.",
              "Parce qu'il est obligatoire de détenir des actions en devises étrangères.",
              "Pour empêcher les taux d'intérêt de fluctuer."
            ],
            correctAnswerIndex: 1,
            explanation: "Une crise ou un changement fiscal dans une région (ex: Europe) peut être compensé par la dynamique économique d'autres continents (ex: Amérique du Nord, Asie)."
          },
          {
            id: "q_2_2_4",
            text: "Quel est le risque de vouloir détenir manuellement plus de 100 actions individuelles dans son compte ?",
            options: [
              "La multiplication des frais d'ordres et l'incapacité de suivre convenablement les rapports financiers de chaque société.",
              "Le risque d'une panne informatique de son écran d'ordinateur.",
              "Une interdiction d'achat prononcée par les tribunaux.",
              "La suppression automatique des dividendes."
            ],
            correctAnswerIndex: 0,
            explanation: "La sur-diversification individuelle engendre des frais inutiles et un temps de gestion impossible. Pour diversifier sur des centaines de titres, les ETFs sont incomparablement plus efficaces."
          }
        ]
      },
      {
        id: "l2_3",
        title: "La diversification par classes d'actifs",
        description: "Allez au-delà des actions : obligations, or physique, matières premières et liquidités.",
        xpReward: 280,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Les 4 grandes classes d'actifs financiers",
            text: "Pour bâtir une forteresse patrimoniale capable de traverser les décennies, détenir des actions ne suffit pas. Il faut orchestrer différentes familles d'actifs aux comportements complémentaires.",
            bullets: [
              "📈 Actions : Moteur principal de croissance et de lutte contre l'inflation, mais soumises à la volatilité de court terme.",
              "📜 Obligations (Bonds) : Titres de dette d'États (ex: OAT françaises, US Treasuries) ou d'entreprises, versant des intérêts réguliers avec une grande stabilité.",
              "🟡 Or physique : Valeur refuge ultime sans risque de contrepartie, protégeant contre la dévaluation monétaire et les crises géopolitiques.",
              "💶 Liquidités (Cash) : Munitions sécurisées pour profiter des soldes de marché lors des paniques."
            ],
            illustration: "assets"
          },
          {
            title: "2. Le principe de la corrélation négative",
            text: "La puissance d'une allocation multi-actifs réside dans le fait que certains actifs progressent précisément lorsque d'autres traversent une tempête.",
            bullets: [
              "Pendant les krachs boursiers, les investisseurs institutionnels vendent des actions pour se réfugier sur les obligations d'État et l'or.",
              "Pendant que les actions baissent de -25%, l'or et les obligations peuvent monter de +10% à +15%.",
              "Résultat : Votre portefeuille global subit une baisse minime et préserve votre sérénité psychologique."
            ],
            illustration: "rebound"
          },
          {
            title: "3. Exemple concret : Le portefeuille 'All-Weather' (Ray Dalio)",
            text: "Le célèbre gestionnaire de hedge funds Ray Dalio a conçu un portefeuille tout-temps conçu pour performer dans les 4 saisons économiques (Croissance, Récession, Inflation, Déflation).",
            bullets: [
              "30% Actions mondiales (pour capturer la croissance économique).",
              "55% Obligations d'État à court et long terme (pour stabiliser et amortir les krachs).",
              "7,5% Or physique + 7,5% Matières premières (pour se protéger contre l'inflation et les chocs géopolitiques).",
              "Historique : Ce modèle a traversé les pires crises des 40 dernières années avec un drawdown (baisse maximale) exceptionnellement bas."
            ],
            illustration: "shield"
          },
          {
            title: "4. Adapter l'allocation à son âge et ses projets",
            text: "Plus vous êtes jeune avec un horizon lointain (+15 ans), plus vous pouvez consacrer une part majeure aux actions (80% à 90%). Plus vous approchez de la retraite ou d'un projet immobilier, plus vous sécurisez en obligations et monétaire.",
            bullets: [
              "Horizon long (+10 ans) : 80% Actions / 10% Obligations / 10% Or.",
              "Horizon moyen (5 ans) : 50% Actions / 40% Obligations / 10% Monétaire.",
              "Horizon court (< 2 ans) : 100% Placements sécurisés sans risque de perte en capital."
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_2_3_1",
            text: "Quelle classe d'actif est historiquement qualifiée de 'valeur refuge' ultime en cas de tempête géopolitique ou de crise monétaire ?",
            options: [
              "Les actions de start-ups non rentables.",
              "L'or physique.",
              "Les devises spéculatives de faible volume.",
              "Les contrats pétroliers à court terme."
            ],
            correctAnswerIndex: 1,
            explanation: "L'or physique conserve une valeur intrinsèque depuis des millénaires et sert de bouclier patrimonial lorsque la confiance dans les devises ou les marchés s'érode."
          },
          {
            id: "q_2_3_2",
            text: "Qu'est-ce qu'une obligation (Bond) par rapport à une action ?",
            options: [
              "Un droit de vote double lors des conseils d'administration d'entreprises.",
              "Un titre de créance représentant un prêt d'argent à un État ou une entreprise, remboursé avec des intérêts réguliers (coupons).",
              "Une assurance obligatoire contre les piratages bancaires.",
              "Une taxe prélevée par la bourse."
            ],
            correctAnswerIndex: 1,
            explanation: "Acheter une obligation revient à prêter des fonds à un emprunteur public ou privé en échange d'un coupon d'intérêt régulier garanti, offrant une stabilité supérieure aux actions."
          },
          {
            id: "q_2_3_3",
            text: "Pourquoi intègre-t-on des actifs à 'corrélation négative' dans un portefeuille boursier ?",
            options: [
              "Pour que tous les actifs s'effondrent en même temps.",
              "Pour que la hausse d'un actif (comme l'or ou les obligations) compense et amortisse la baisse temporaire des actions lors d'une crise.",
              "Pour payer moins de frais d'abonnement internet.",
              "Pour bloquer la vente des titres pendant l'hiver."
            ],
            correctAnswerIndex: 1,
            explanation: "La corrélation négative permet d'amortir les chocs : quand un secteur baisse, un autre monte, préservant la stabilité de la valeur globale de votre patrimoine."
          },
          {
            id: "q_2_3_4",
            text: "Quelle allocation générale est la plus appropriée pour un investisseur de 25 ans épargnant pour sa retraite dans 35 ans ?",
            options: [
              "100% sur un livret bancaire à 1% qui perd de la valeur face à l'inflation.",
              "Une forte majorité d'actions et d'ETFs mondiaux (75% à 90%) pour maximiser les rendements composés sur le long terme.",
              "100% de liquidités cachées sous son matelas.",
              "Uniquement des devises exotiques de pays émergents."
            ],
            correctAnswerIndex: 1,
            explanation: "Avec un horizon de 35 ans, la volatilité de court terme n'a aucun impact négatif. Investir massivement en actions permet de capter la pleine puissance des rendements composés."
          }
        ]
      },
      {
        id: "l2_4",
        title: "La Stratégie Core-Satellite & Architecture de Portefeuille",
        description: "Bâtissez un portefeuille robuste avec un socle indiciel inébranlable et des satellites dynamiques.",
        xpReward: 300,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Le Concept de l'Architecture Core-Satellite",
            text: "La stratégie 'Core-Satellite' est l'une des méthodes de gestion de portefeuille les plus reconnues au monde pour concilier sécurité éprouvée et dynamisme de conviction.",
            bullets: [
              "Le Cœur (Core - 70% à 85%) : Un socle passif ultra-diversifié, stable et à très bas frais qui capte la croissance séculaire des marchés mondiaux.",
              "Les Satellites (15% à 30%) : Des poches tactiques dédiées à des actions individuelles à fort potentiel ou à des thématiques sectorielles porteuses.",
              "Avantage majeur : Vous profitez de la régularité du marché mondial sans vous interdire d'exprimer vos convictions fortes sur vos entreprises favorites."
            ],
            illustration: "core_satellite"
          },
          {
            title: "2. Structurer le Cœur (Core) : Le Moteur de Long Terme",
            text: "Le cœur de votre portefeuille ne doit jamais être soumis au trading fréquent ni aux réactions émotionnelles quotidiennes.",
            bullets: [
              "Idéalement composé de 1 à 2 ETFs indiciels mondiaux (MSCI World, S&P 500, MSCI ACWI ou All-World).",
              "Alimenté de manière programmée chaque mois via la stratégie DCA.",
              "Objectif : Garantir le rendement moyen historique du marché mondial (~8% à 10% annualisé) avec un coût de gestion quasi-nul (< 0,20%/an)."
            ],
            illustration: "basket"
          },
          {
            title: "3. Choisir ses Satellites : Les Mégatendances d'Avenir",
            text: "Les satellites servent à booster la performance globale ou à s'exposer à des révolutions technologiques et industrielles majeures.",
            bullets: [
              "🚀 Mégatendances : Intelligence Artificielle, transition énergétique, cybersécurité, biotechnologies.",
              "💎 Stock-Picking de conviction : Actions de grande qualité (Compounders) que vous comprenez parfaitement (ex: Apple, Nvidia, LVMH, Microsoft).",
              "Discipline : Si un satellite subit une chute importante, votre portefeuille global reste solidement protégé par la masse de votre cœur indiciel."
            ],
            illustration: "growth"
          },
          {
            title: "4. Les Règles d'Or pour Ne Pas Dériver",
            text: "Pour préserver l'efficacité de l'approche Core-Satellite sur la durée, appliquez ces trois règles de gestionnaire :",
            bullets: [
              "Limitez le nombre de satellites : 3 à 6 lignes satellites suffisent amplement pour ne pas disperser votre attention.",
              "Plafonnez chaque satellite individuel : Aucun satellite ne doit représenter plus de 5% à 8% de votre capital total.",
              "Prenez des profits quand un satellite devient trop gros : Réinvestissez une partie des gains dans le Cœur indiciel pour verrouiller la richesse créée."
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_2_4_1",
            text: "En quoi consiste la stratégie de portefeuille 'Core-Satellite' ?",
            options: [
              "À n'investir que dans des entreprises spécialisées dans la recherche spatiale.",
              "À structurer son capital avec un socle indiciel majeur (Core 70-80%) et des lignes complémentaires ciblées (Satellites 20-30%).",
              "À changer toutes ses actions chaque lundi matin.",
              "À emprunter de l'argent auprès d'une station orbitale."
            ],
            correctAnswerIndex: 1,
            explanation: "La méthode Core-Satellite associe un cœur passif diversifié et stable (ETFs larges) avec des satellites actifs pour dynamiser le rendement sans compromettre la sécurité."
          },
          {
            id: "q_2_4_2",
            text: "Quel type d'actif constitue le choix idéal pour la partie 'Cœur' (Core) d'un portefeuille ?",
            options: [
              "Une seule crypto-monnaie créée la veille.",
              "Des ETFs indiciels mondiaux à très faibles frais (comme un MSCI World ou S&P 500) diversifiés sur des centaines d'entreprises.",
              "Des contrats à terme à effet de levier x50.",
              "Des actions de start-ups non cotées en difficulté."
            ],
            correctAnswerIndex: 1,
            explanation: "Le cœur doit être ultra-résilient et représentatif de l'économie globale. Les ETFs indiciels mondiaux capitalisants constituent la base idéale."
          },
          {
            id: "q_2_4_3",
            text: "Quel est le pourcentage maximal généralement recommandé pour une seule position satellite individuelle ?",
            options: [
              "Environ 5% à 8% du capital total pour limiter le risque en cas d'erreur de stock-picking.",
              "Toujours 90% pour maximiser le suspense.",
              "Strictement 0,001% de son épargne.",
              "100% avec emprunt bancaire."
            ],
            correctAnswerIndex: 0,
            explanation: "Plafonner un satellite à 5-8% évite qu'une mauvaise surprise sur une entreprise spécifique ne vienne déstabiliser l'ensemble de votre patrimoine."
          },
          {
            id: "q_2_4_4",
            text: "Que doit faire un investisseur lorsqu'un de ses satellites explose à la hausse et prend une place disproportionnée dans son compte ?",
            options: [
              "Attendre que l'action retombe à zéro pour agir.",
              "Prendre des bénéfices partiels et réinjecter les gains dans le Cœur (Core) pour pérenniser la sécurité du portefeuille.",
              "Fermer son compte de courtage définitivement.",
              "Acheter des billets de loterie avec la somme."
            ],
            correctAnswerIndex: 1,
            explanation: "Sécuriser une fraction des plus-values générées par un satellite performant pour renforcer le cœur indiciel permet de cristalliser la richesse accumulée."
          }
        ]
      },
      {
        id: "l2_exam",
        title: "🎓 Examen Final : Portefeuille & Diversification",
        description: "Épreuve de synthèse du Niveau 2 : validez vos compétences sur les ETFs, la diversification multi-actifs et l'architecture Core-Satellite.",
        xpReward: 450,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : La Révolution des ETFs",
            text: "Un ETF (Tracker) permet d'investir en une fraction de seconde dans des centaines d'entreprises mondiales avec des frais de gestion minimes (< 0,20%/an).",
            bullets: [
              "Fini le risque de faillite d'une action unique : Si 2 ou 3 entreprises du panier font faillite, l'impact sur l'indice global reste quasi imperceptible.",
              "Dividendes réinvestis (Capitalisant / Accumulating) : Permet de faire grossir son patrimoine sans impôt intermédiaire.",
              "Simplicité absolue : Évite de devoir passer des heures à analyser les bilans de dizaines de sociétés individuelles."
            ],
            illustration: "basket"
          },
          {
            title: "2. Révision : Les 4 Niveaux de Diversification",
            text: "Pour bâtir un portefeuille résistant à toutes les tempêtes économiques, la diversification s'applique sur plusieurs dimensions :",
            bullets: [
              "Géographique : États-Unis, Europe, Asie, Marchés Émergents.",
              "Sectorielle : Technologies, Santé, Biens de consommation, Énergie, Finance, Industrie.",
              "Par classes d'actifs : Actions pour la croissance, Obligations pour la stabilité, Or pour la couverture contre l'inflation, Liquidités pour les opportunités.",
              "Temporelle : Investir régulièrement par versements programmés (DCA)."
            ],
            illustration: "growth"
          },
          {
            title: "3. Révision : L'Approche Core-Satellite",
            text: "Associer la sécurité d'un cœur solide et l'audace de satellites performants :",
            bullets: [
              "Core (70-80%) : ETFs indiciels mondiaux (MSCI World, S&P 500) que l'on ne vend jamais.",
              "Satellites (20-30%) : 3 à 6 thématiques fortes (IA, luxe, transition verte, biotech) ou actions de conviction (Apple, Nvidia, LVMH).",
              "Discipline de rebalancement : Sécuriser les gains des satellites florissants pour alimenter le Core."
            ],
            illustration: "core_satellite"
          },
          {
            title: "4. Consignes de l'Examen Final",
            text: "Vous allez répondre à 5 questions pratiques de gestion d'actifs pour prouver votre maîtrise de l'allocation patrimoniale !",
            bullets: [
              "5 questions de synthèse stratégiques.",
              "Rattrapage automatique des questions manquées à la fin du quiz.",
              "Validez l'examen pour débloquer le Niveau 3 et décrocher 450 XP !"
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_2_e_1",
            text: "Pourquoi acheter un ETF 'MSCI World' protège-t-il considérablement mieux votre capital que d'acheter une seule action individuelle ?",
            options: [
              "Parce que le MSCI World répartit automatiquement votre risque sur plus de 1 400 grandes entreprises réparties dans 23 pays développés.",
              "Parce que l'État s'engage à vous rembourser le triple de vos pertes.",
              "Parce que les ETFs ne peuvent mathématiquement jamais baisser.",
              "Parce qu'il n'y a aucun intermédiaire financier."
            ],
            correctAnswerIndex: 0,
            explanation: "En détenant plus de 1 400 entreprises, la faillite ou les difficultés d'une société individuelle sont immédiatement absorbées par la vitalité du reste de l'économie mondiale."
          },
          {
            id: "q_2_e_2",
            text: "Quelle est l'utilité d'intégrer une poche d'obligations d'États solides ou d'or dans un portefeuille à côté des actions ?",
            options: [
              "Aucune, cela rapporte toujours moins que le casino.",
              "Créer une décorrélation : ces actifs tendent à amortir les secousses lorsque le marché des actions subit une forte baisse.",
              "Pour obtenir le droit de vote aux assemblées de l'ONU.",
              "Pour éviter d'avoir à payer ses factures d'électricité."
            ],
            correctAnswerIndex: 1,
            explanation: "Les obligations souveraines et l'or sont des valeurs refuges historiques qui amortissent la volatilité globale du portefeuille lors des récessions."
          },
          {
            id: "q_2_e_3",
            text: "Dans une stratégie 'Core-Satellite', quelle part de votre capital doit idéalement constituer le 'Cœur' (Core) indiciel passif ?",
            options: [
              "Exactement 2% pour laisser 98% en trading spéculatif.",
              "Entre 70% et 85% pour garantir la stabilité et capter la croissance mondiale séculaire.",
              "Strictement 0%, tout doit être investi sur des start-ups non cotées.",
              "100% en devises étrangères risquées."
            ],
            correctAnswerIndex: 1,
            explanation: "Un socle de 70% à 85% en ETFs indiciels diversifiés assure une résilience maximale tout en autorisant une poche dynamique de 15% à 30%."
          },
          {
            id: "q_2_e_4",
            text: "Quelle est la différence fondamentale entre un ETF 'Capitalisant' (Acc) et un ETF 'Distribuant' (Dist) ?",
            options: [
              "L'ETF Capitalisant réinvestit automatiquement tous les dividendes dans le fonds pour accélérer les intérêts composés, alors que le Distribuant vous les verse en cash sur votre compte.",
              "L'ETF Capitalisant est illégal en Europe.",
              "L'ETF Distribuant ne fonctionne que le week-end.",
              "L'ETF Capitalisant prélève 90% de commissions secrètes."
            ],
            correctAnswerIndex: 0,
            explanation: "L'ETF Capitalisant réinjecte immédiatement les dividendes perçus pour racheter des parts d'actifs, maximisant la capitalisation sans frottement fiscal."
          },
          {
            id: "q_2_e_5",
            text: "Que risque un investisseur qui place 100% de son épargne dans 10 entreprises du même secteur (ex: 10 sociétés de biotechnologie) ?",
            options: [
              "Il est parfaitement protégé car il a 10 entreprises différentes.",
              "Il subit un risque sectoriel majeur : une régulation défavorable ou une crise du secteur peut faire chuter l'intégralité de ses 10 lignes simultanément.",
              "Il est certain de doubler son capital chaque mois.",
              "Il reçoit une médaille de la fédération de bourse."
            ],
            correctAnswerIndex: 1,
            explanation: "Avoir 10 entreprises d'une seule industrie n'est pas une vraie diversification : le risque sectoriel reste entier si l'industrie traverse une crise."
          }
        ]
      }
    ]
  },
  {
    id: "mod3",
    title: "Niveau 3 : Les Outils de Trading & Psychologie",
    description: "Maîtrisez les ordres boursiers stratégiques et dominez vos émotions face à la volatilité.",
    lessons: [
      {
        id: "l3_1",
        title: "Ordre 'Au Marché' vs Ordre 'À Cours Limité'",
        description: "Contrôlez le tarif exact et la vitesse d'exécution de vos transactions boursières.",
        xpReward: 300,
        durationMinutes: 5,
        slides: [
          {
            title: "1. L'Ordre au Marché (Market Order)",
            text: "L'ordre au marché est conçu pour les situations où la priorité absolue est la rapidité d'exécution immédiate plutôt que le prix précis du centime.",
            bullets: [
              "Exécution instantanée : L'ordre est immédiatement exécuté face aux meilleures offres disponibles dans le carnet d'ordres.",
              "Priorité sur la file d'attente : Il passe avant tous les ordres à cours limité en attente.",
              "Piège du glissement (Slippage) : En période de forte volatilité ou sur des actions peu liquides, vous risquez d'acheter plus cher que le dernier prix affiché à l'écran."
            ],
            illustration: "speed"
          },
          {
            title: "2. L'Ordre à Cours Limité (Limit Order)",
            text: "L'ordre à cours limité est l'outil de prédilection de l'investisseur rigoureux qui souhaite fixer un plafond infranchissable à l'achat ou un plancher à la vente.",
            bullets: [
              "Maîtrise absolue du prix : Vous déterminez le prix maximum que vous acceptez de payer à l'achat (ex: 95€ pour une action qui cote 97€).",
              "Exécution conditionnelle : L'ordre ne s'exécutera que si le cours touche ou franchit favorablement votre seuil.",
              "Sécurité budgétaire : Vous êtes certain de ne jamais surpayer, mais l'ordre peut ne pas être exécuté si le cours ne redescend jamais à votre limite."
            ],
            illustration: "target"
          },
          {
            title: "3. Exemple concret : Slippage vs Contrôle",
            text: "Supposons que vous souhaitiez acheter 100 actions d'une entreprise biotechnologique en pleine annonce de résultats, qui cote à 50€.",
            bullets: [
              "Cas Ordre au Marché : Les premières 20 actions sont achetées à 50€, les 40 suivantes à 52€ et les 40 dernières à 55€. Votre prix de revient moyen est de 52,80€ (+5,6% de surcoût imprévu).",
              "Cas Ordre Limité à 50,50€ : Vous n'achetez que les 20 actions disponibles sous votre limite et votre budget reste protégé sans mauvaise surprise.",
              "Règle de pro : Utilisez toujours des ordres limites sur les actions de moyenne ou petite taille (Mid/Small caps)."
            ],
            illustration: "balance"
          },
          {
            title: "4. Durée de validité des ordres (Jour, GTC, Date)",
            text: "Lorsque vous déposez un ordre à cours limité, vous choisissez également sa durée de vie sur le marché :",
            bullets: [
              "Ordre Jour (Day Order) : S'annule automatiquement à la clôture de la séance si le prix cible n'a pas été atteint.",
              "Ordre Révocation (GTC - Good 'Til Cancelled) : Reste actif dans le carnet d'ordres jusqu'à son exécution ou votre annulation manuelle (souvent 30 à 90 jours).",
              "Ordre à date déterminée : Expire à une date précise choisie dans votre calendrier."
            ],
            illustration: "time"
          }
        ],
        questions: [
          {
            id: "q_3_1_1",
            text: "Quelle est la caractéristique fondamentale d'un ordre boursier 'À Cours Limité' à l'achat ?",
            options: [
              "Il s'exécute immédiatement à n'importe quel prix sans contrôle du montant.",
              "Il fixe un prix d'achat maximum : la transaction ne se fera que si le cours est inférieur ou égal à ce plafond.",
              "C'est un ordre réservé aux banques centrales et aux milliardaires.",
              "Il oblige à revendre l'action au bout de 24 heures."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ordre à cours limité protège votre capital en garantissant que vous ne paierez jamais plus cher que le prix maximum que vous avez vous-même configuré."
          },
          {
            id: "q_3_1_2",
            text: "Quand est-il particulièrement pertinent d'utiliser un 'Ordre au Marché' ?",
            options: [
              "Quand vous souhaitez acheter au prix le plus bas possible lors d'un krach.",
              "Quand la rapidité d'exécution immédiate est votre priorité absolue sur une action très liquide (forte capitalisation).",
              "Sur une petite entreprise dont le carnet d'ordres est presque vide.",
              "Uniquement pendant les jours fériés."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ordre au marché garantit une exécution immédiate au détriment du contrôle strict du prix, ce qui est adapté aux valeurs très liquides à fort volume."
          },
          {
            id: "q_3_1_3",
            text: "Qu'appelle-t-on le 'carnet d'ordres' sur une place boursière ?",
            options: [
              "Un carnet papier conservé dans les coffres de la banque de France.",
              "Le registre électronique en temps réel recensant tous les ordres d'achat (Bid) et de vente (Ask) en attente classés par prix.",
              "La liste des amendes infligées aux mauvais investisseurs.",
              "Le journal intime du PDG de l'entreprise cotée."
            ],
            correctAnswerIndex: 1,
            explanation: "Le carnet d'ordres affiche les intentions d'achat et de vente de tous les participants du marché. Le croisement continu des ordres crée le prix d'échange."
          },
          {
            id: "q_3_1_4",
            text: "Quel est le risque potentiel d'un ordre d'achat 'À Cours Limité' placé trop bas sous le cours actuel ?",
            options: [
              "L'ordre risque de ne jamais être exécuté si le cours de l'action continue de monter sans jamais redescendre à votre limite.",
              "Le courtier prélève une amende de 10% sur votre compte.",
              "L'entreprise cotée peut vous poursuivre en justice.",
              "Vos actions sont transformées en obligations."
            ],
            correctAnswerIndex: 0,
            explanation: "Si le cours s'envole sans revenir toucher votre seuil d'achat, votre ordre reste en attente et vous manquez l'opportunité d'entrer en position."
          }
        ]
      },
      {
        id: "l3_2",
        title: "FOMO & Psychologie boursière",
        description: "Évitez les pires pièges émotionnels : cupidité, peur de manquer le train et panique.",
        xpReward: 350,
        durationMinutes: 5,
        slides: [
          {
            title: "1. La psychologie : 80% du succès en bourse",
            text: "Sur les marchés financiers, votre plus redoutable adversaire n'est ni l'intelligence artificielle ni les banques d'affaires, mais vos propres biais cognitifs et émotions.",
            bullets: [
              "La Cupidité (Greed) : Pousse à prendre des risques disproportionnés après quelques gains faciles en se croyant infaillible.",
              "La Peur (Fear) : Pousse à vendre au pire moment possible lors d'un repli passager, figeant des pertes virtuelles en pertes réelles.",
              "L'Investisseur discipliné applique un plan méthodique et reste imperméable au bruit médiatique."
            ],
            illustration: "mind"
          },
          {
            title: "2. Le piège destructeur du FOMO (Fear Of Missing Out)",
            text: "Le FOMO est l'anxiété compulsive ressentie lorsqu'on voit une action ou un actif grimper en flèche et que tout le monde semble s'enrichir sauf vous.",
            bullets: [
              "Symptôme classique : Acheter un actif en pleine parabole haussière, au sommet de l'euphorie médiatique, par peur de rater le train.",
              "Conséquence fatale : Vous devenez le dernier acheteur (le 'pigeon') juste avant le retournement brutal du marché et l'éclatement de la bulle.",
              "Règle de Warren Buffett : 'Soyez craintif quand les autres sont avides, et soyez avide quand les autres sont craintifs.'"
            ],
            illustration: "alarm"
          },
          {
            title: "3. Le Panic Selling & Le cycle des émotions",
            text: "Le cycle psychologique d'un marché boursier passe toujours par les mêmes étapes : Espoir ➔ Optimisme ➔ Euphorie ➔ Complaisance ➔ Anxiété ➔ Déni ➔ Panique ➔ Capitulation ➔ Renaissance.",
            bullets: [
              "Le 'Panic Selling' intervient au creux de la capitulation : l'investisseur vend tout à perte sous le coup de la terreur, jurant qu'on ne l'y reprendra plus.",
              "C'est historiquement à ce moment précis que les investisseurs chevronnés rachètent des entreprises exceptionnelles à prix bradés.",
              "Une perte sur le papier n'est qu'une perte virtuelle tant que vous n'avez pas cliqué sur 'Vendre'."
            ],
            illustration: "cycle"
          },
          {
            title: "4. Le vaccin anti-émotions : La méthode DCA",
            text: "Pour éliminer définitivement le stress, le FOMO et la panique, les investisseurs intelligents utilisent la stratégie du DCA (Dollar Cost Averaging).",
            bullets: [
              "Vous investissez un montant fixe chaque mois (ex: 200€ le 5 du mois) sur un ETF mondial, sans jamais chercher à deviner si le marché est 'haut' ou 'bas'.",
              "Quand le marché baisse, vos 200€ achètent plus de parts décotées ; quand il monte, votre patrimoine s'apprécie.",
              "Cette routine automatique transforme la volatilité en alliée mathématique et libère votre esprit."
            ],
            illustration: "dca"
          }
        ],
        questions: [
          {
            id: "q_3_2_1",
            text: "Qu'est-ce que le 'FOMO' (Fear Of Missing Out) en psychologie financière ?",
            options: [
              "Une taxe prélevée sur les transactions boursières internationales.",
              "L'angoisse irrationnelle de rater une opportunité qui pousse à acheter une action au plus haut de sa bulle par impulsion.",
              "Une formule mathématique pour calculer le risque de faillite.",
              "Une garantie bancaire protégeant les livrets d'épargne."
            ],
            correctAnswerIndex: 1,
            explanation: "Le FOMO est le piège émotionnel qui pousse les débutants à acheter impulsivement des actifs déjà surévalués sous l'effet de l'excitation collective."
          },
          {
            id: "q_3_2_2",
            text: "Qu'entend-on par l'expression boursière 'Panic Selling' (vente de panique) ?",
            options: [
              "Une technique professionnelle pour vendre des actions en 1 milliseconde.",
              "Liquider précipitamment toutes ses positions à perte lors d'une chute temporaire du marché sous l'emprise de la terreur.",
              "Acheter des actions en urgence au milieu de la nuit.",
              "Fermer temporairement les bureaux de la bourse de New York."
            ],
            correctAnswerIndex: 1,
            explanation: "La vente de panique transforme une baisse temporaire sur le papier en une perte financière irréversible et définitive, souvent au pire moment du cycle."
          },
          {
            id: "q_3_2_3",
            text: "Quelle célèbre citation de Warren Buffett résume l'attitude à adopter face à l'euphorie et à la panique ?",
            options: [
              "'Achetez toujours l'action dont tout le monde parle à la télévision.'",
              "'Soyez craintif quand les autres sont avides, et soyez avide quand les autres sont craintifs.'",
              "'Vendez tout dès que le marché baisse de 2% pour ne prendre aucun risque.'",
              "'Le meilleur investissement est de garder son argent en billets de banque.'"
            ],
            correctAnswerIndex: 1,
            explanation: "Cette maxime enseigne la retenue pendant les phases de bulle spéculative (euphorie) et le courage d'acheter des pépites décotées pendant les phases de panique."
          },
          {
            id: "q_3_2_4",
            text: "Pourquoi l'investissement programmé régulier (DCA) est-il le meilleur rempart contre les erreurs psychologiques ?",
            options: [
              "Il élimine le besoin de prédire l'avenir en automatisant les achats à prix moyen lissé, supprimant l'impact des émotions.",
              "Il garantit un gain de +50% dès le premier mois.",
              "Il rend les transactions totalement anonymes auprès du fisc.",
              "Il permet de doubler ses cœurs de formation dans l'application."
            ],
            correctAnswerIndex: 0,
            explanation: "Le DCA supprime l'illusion de devoir 'timer' le marché. En investissant régulièrement la même somme, vous achetez mécaniquement plus d'actions quand elles sont bon marché."
          }
        ]
      },
      {
        id: "l3_3",
        title: "L'horizon d'investissement & Capitalisation",
        description: "Découvrez la 8ème merveille du monde : la puissance explosive des intérêts composés dans le temps.",
        xpReward: 380,
        durationMinutes: 5,
        slides: [
          {
            title: "1. L'Horizon de temps : Votre super-pouvoir",
            text: "En bourse, le temps est le facteur multiplicateur le plus puissant qui existe. Plus votre horizon de placement est lointain (10, 20 ou 30 ans), plus vous éliminez mathématiquement le risque de perte.",
            bullets: [
              "Sur 1 an, la probabilité d'un rendement négatif sur le S&P 500 est d'environ 25% (volatilité de court terme).",
              "Sur 10 ans, la probabilité de perte tombe à moins de 5%.",
              "Sur 20 ans glissants dans l'histoire moderne de la bourse mondiale, la probabilité de perte a toujours été de 0% (rendement toujours positif)."
            ],
            illustration: "time"
          },
          {
            title: "2. La magie des Intérêts Composés (L'effet boule de neige)",
            text: "Albert Einstein qualifiait les intérêts composés de 'huitième merveille du monde'. Le principe est simple : les gains générés produisent à leur tour de nouveaux gains chaque année.",
            bullets: [
              "Intérêt simple : 10 000€ à 8% rapporte 800€ chaque année (croissance linéaire).",
              "Intérêt composé : L'année 1 vous avez 10 800€, l'année 2 les 8% s'appliquent sur 10 800€ (864€ de gain), l'année 3 sur 11 664€ (933€ de gain)...",
              "Au bout de 30 ans à 8% par an, vos 10 000€ initiaux se transforment en plus de 100 600€ sans aucun versement supplémentaire !"
            ],
            illustration: "growth"
          },
          {
            title: "3. Exemple concret : L'avantage de commencer tôt",
            text: "Comparons deux amis, Thomas et Lucas, qui investissent tous deux sur un ETF mondial à 8% de rendement moyen annualisé :",
            bullets: [
              "👶 Thomas investit 200€/mois de 20 ans à 30 ans (10 ans seulement = 24 000€ investis au total), puis s'arrête et laisse fructifier jusqu'à 65 ans. Résultat à 65 ans : ~580 000€ !",
              "👨 Lucas commence à 30 ans et investit 200€/mois sans interruption jusqu'à 65 ans (35 ans = 84 000€ investis, soit 3,5x plus que Thomas). Résultat à 65 ans : ~460 000€.",
              "Leçon cruciale : Commencer 10 ans plus tôt a permis à Thomas de gagner 120 000€ de plus en ayant investi 3,5 fois moins d'argent de sa poche !"
            ],
            illustration: "target"
          },
          {
            title: "4. Court terme vs Long terme : Deux mondes opposés",
            text: "Distinguez clairement vos poches financières pour ne jamais commettre l'erreur de placer de l'argent de court terme sur des actions :",
            bullets: [
              "Épargne de précaution & projets à court terme (< 3 ans) : Gardez sur des livrets sécurisés ou du monétaire sans aucun risque.",
              "Épargne de long terme (+10 ans, retraite, indépendance financière) : Investissez en actions et ETFs pour écraser l'inflation et faire fructifier votre capital.",
              "Règle d'or : 'Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est aujourd'hui.'"
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_3_3_1",
            text: "Pourquoi dit-on qu'un horizon d'investissement long (+15 ans) est le meilleur allié de l'épargnant en bourse ?",
            options: [
              "Il oblige à consulter les cours chaque matin à 8h00.",
              "Il permet d'absorber et de lisser les crises temporaires, transformant la tendance haussière séculaire de l'économie en gains solides.",
              "Il supprime automatiquement toutes les taxes mondiales.",
              "Il garantit que les banques vous offriront un prêt gratuit."
            ],
            correctAnswerIndex: 1,
            explanation: "Sur des périodes de 15 à 20 ans, la croissance économique et l'innovation absorbent les récessions passagères, offrant une rentabilité historique positive."
          },
          {
            id: "q_3_3_2",
            text: "Comment fonctionnent concrètement les 'Intérêts Composés' ?",
            options: [
              "Les intérêts de chaque année s'ajoutent au capital initial et génèrent à leur tour de nouveaux intérêts les années suivantes.",
              "La banque vous verse une prime fixe chaque mois sans condition.",
              "L'État double votre argent tous les 5 ans si vous ne retirez rien.",
              "C'est une taxe bancaire prélevée sur les gains non réinvestis."
            ],
            correctAnswerIndex: 0,
            explanation: "Les gains génèrent leurs propres gains : c'est la dynamique exponentielle de la boule de neige financière qui démultiplie le capital sur les longues durées."
          },
          {
            id: "q_3_3_3",
            text: "Dans l'exemple de Thomas et Lucas, pourquoi Thomas termine-t-il avec plus d'argent en ayant investi 3,5 fois moins de capital ?",
            options: [
              "Parce qu'il a choisi des actions illégales.",
              "Parce qu'il a commencé 10 ans plus tôt, laissant le temps aux intérêts composés de produire leurs effets exponentiels pendant 45 ans.",
              "Parce que son courtier ne prélevait aucun frais.",
              "Parce qu'il a gagné au loto."
            ],
            correctAnswerIndex: 1,
            explanation: "Le facteur temps est exponentiel : les 10 premières années d'avance ont permis à l'effet boule de neige de décupler le capital de Thomas de façon spectaculaire."
          },
          {
            id: "q_3_3_4",
            text: "Quelle somme d'argent ne doit JAMAIS être investie sur des actions volatiles en bourse ?",
            options: [
              "L'argent destiné à votre retraite dans 30 ans.",
              "L'argent dont vous aurez impérativement besoin dans les 12 à 24 prochains mois (loyer, impôts, apport immobilier immédiat).",
              "L'argent issu d'une prime de fin d'année.",
              "L'argent versé par vos dividendes réinvestis."
            ],
            correctAnswerIndex: 1,
            explanation: "L'argent nécessaire à court terme ne doit jamais être exposé à la volatilité boursière, sous peine de devoir vendre en catastrophe en pleine baisse."
          }
        ]
      },
      {
        id: "l3_4",
        title: "Le Journal de Trading & La Discipline Émotionnelle",
        description: "Documentez vos décisions, analysez vos biais cognitifs et éliminez l'effet de vengeance (Revenge Trading).",
        xpReward: 400,
        durationMinutes: 5,
        slides: [
          {
            title: "1. L'Indispensable Journal d'Investissement",
            text: "Ce qui ne se mesure pas ne s'améliore pas. Les investisseurs d'élite tiennent tous un journal de bord consignant chaque décision avec rigueur.",
            bullets: [
              "Ce qu'il faut consigner : Date, actif, prix d'achat, taille de position, motif précis de l'entrée (la 'thèse d'investissement') et plan de sortie.",
              "Notez votre état émotionnel au moment du clic : Étiez-vous calme, impatient, sous l'effet du stress ou influencé par une discussion sur les réseaux sociaux ?",
              "Revue trimestrielle : Relire ses notes permet d'identifier ses erreurs récurrentes et de transformer chaque perte en leçon d'apprentissage inestimable."
            ],
            illustration: "journal"
          },
          {
            title: "2. Le Biais de Confirmation & L'Ancrage Mental",
            text: "Le cerveau humain est programmé pour défendre ses convictions existantes, quitte à déformer la réalité des marchés financiers.",
            bullets: [
              "Biais de confirmation : Rechercher activement des articles élogieux sur une action qu'on possède tout en ignorant délibérément les alertes des analystes.",
              "Biais d'ancrage : Rester psychologiquement fixé sur le prix d'achat initial (ex: 'j'ai acheté à 100€, je ne vendrai pas tant qu'elle ne revient pas à 100€').",
              "Remède : Demandez-vous régulièrement : 'Si je n'avais pas cette action aujourd'hui, est-ce que je l'achèterais au cours actuel avec mon argent frais ?' Si la réponse est non, vendez !"
            ],
            illustration: "mind"
          },
          {
            title: "3. Le Piège Mortel du 'Revenge Trading'",
            text: "Le Revenge Trading (trading de vengeance) est la réaction compulsive qui consiste à vouloir 'se refaire' immédiatement après une perte financière.",
            bullets: [
              "Mécanisme du piège : Après une perte de 500€, l'opérateur ressent une atteinte à son ego. Il prend un trade impulsif sans plan, double sa mise ou son levier pour récupérer ses 500€ au plus vite.",
              "Conséquence : En opérant sous l'effet de la colère, le jugement est altéré et la seconde perte est généralement deux à trois fois plus dévastatrice que la première.",
              "Règle de fer : Après un trade perdant ou une journée rouge, fermez immédiatement vos écrans et observez un temps de pause obligatoire."
            ],
            illustration: "alarm"
          },
          {
            title: "4. La Routine du Décideur Rationnel",
            text: "Pour instaurer une discipline de fer sur la durée, appuyez-vous sur des règles opérationnelles strictes :",
            bullets: [
              "Règle des 24 heures : Attendez 24 heures avant d'exécuter une idée d'achat impulsif découverte sur un forum ou dans les médias.",
              "Définissez le plan avant le trade : Ne rentrez jamais en position sans connaître votre Stop-Loss et votre objectif de gain à l'avance.",
              "Le succès en bourse n'est pas de gagner tous ses trades, mais d'avoir un processus rigoureux où les gains moyens dépassent largement les pertes contrôlées."
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_3_4_1",
            text: "Pourquoi la tenue d'un journal de trading/investissement est-elle vivement recommandée par les professionnels ?",
            options: [
              "Pour envoyer ses notes aux services des impôts chaque semaine.",
              "Pour analyser froidement ses décisions, repérer ses biais émotionnels récurrents et perfectionner sa méthode d'investissement.",
              "Pour obtenir des réductions sur ses factures d'électricité.",
              "Pour remplacer l'ordinateur par des feuilles de papier."
            ],
            correctAnswerIndex: 1,
            explanation: "Le journal documente vos motivations d'achat et vos émotions, vous aidant à éliminer les comportements irrationnels au fil des mois."
          },
          {
            id: "q_3_4_2",
            text: "Qu'est-ce que le 'Revenge Trading' (trading de vengeance) et pourquoi est-il dangereux ?",
            options: [
              "Une technique légale pour pirater les serveurs d'une banque concurrente.",
              "Le comportement impulsif consistant à sur-trader et augmenter son risque pour récupérer immédiatement une perte sous le coup de la colère.",
              "Une commande vocale pour passer des ordres en marchant.",
              "Une tactique réservée aux robots de haute fréquence."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Revenge Trading est dicté par l'orgueil blessé : en doublant ses mises sous l'effet de l'énervement, l'investisseur aggrave presque toujours ses pertes."
          },
          {
            id: "q_3_4_3",
            text: "Comment se manifeste le 'Biais de Confirmation' chez un investisseur détenant une action ?",
            options: [
              "Il vérifie son solde bancaire deux fois par jour.",
              "Il ne lit que les avis positifs confirmant son choix et rejette systématiquement les faits ou analyses signalant des problèmes réels dans l'entreprise.",
              "Il refuse d'utiliser une carte bancaire pour payer ses courses.",
              "Il achète des actions uniquement les années bissextiles."
            ],
            correctAnswerIndex: 1,
            explanation: "Le biais de confirmation pousse à s'aveugler en ignorant les signaux d'alerte objectifs pour préserver son ego et son opinion initiale."
          },
          {
            id: "q_3_4_4",
            text: "Que préconise la 'règle des 24 heures' face à une idée d'investissement soudaine trouvée sur internet ?",
            options: [
              "Attendre 24 heures pour laisser retomber l'excitation émotionnelle et analyser rationnellement les fondamentaux avant de passer à l'acte.",
              "Vendre l'intégralité de ses actions 24 heures après chaque achat.",
              "Ne jamais dormir plus de 24 heures d'affilée.",
              "Garder ses liquidités bloquées pendant 24 mois."
            ],
            correctAnswerIndex: 0,
            explanation: "Prendre un délai de réflexion de 24h évite les achats compulsifs dictés par le FOMO et permet de vérifier la solidité de la thèse d'investissement."
          }
        ]
      },
      {
        id: "l3_exam",
        title: "🎓 Examen Final : Trading & Psychologie",
        description: "Épreuve de synthèse du Niveau 3 : ordres boursiers (marché vs limite), discipline mentale, FOMO et journal de bord.",
        xpReward: 550,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : Ordres Boursiers Stratégiques",
            text: "Le choix de votre type d'ordre conditionne directement le prix et la vitesse d'exécution de vos transactions.",
            bullets: [
              "Ordre 'Au Marché' : Exécution instantanée au meilleur prix disponible, mais risque de dérapage de prix (slippage) en cas de forte volatilité.",
              "Ordre 'À Cours Limité' : Fixe un prix plafond à l'achat (ou plancher à la vente), garantissant que vous ne paierez jamais plus cher que votre seuil.",
              "Ordre 'Stop' (Seuil de déclenchement) : Se transforme en ordre au marché dès qu'un niveau critique est franchi pour couper les pertes."
            ],
            illustration: "balance"
          },
          {
            title: "2. Révision : Maîtriser le FOMO & les Biais Émotionnels",
            text: "90% des erreurs des investisseurs particuliers sont causées par la psychologie plutôt que par les mathématiques.",
            bullets: [
              "FOMO (Fear of Missing Out) : Acheter au sommet d'une bulle par peur de manquer le train.",
              "Biais de confirmation : Ne lire que les avis qui confortent son choix en ignorant les signaux d'alarme.",
              "Revenge Trading : Vouloir se refaire immédiatement après une perte en doublant sa mise avec colère (piège destructeur)."
            ],
            illustration: "mind"
          },
          {
            title: "3. Révision : La Routine du Décideur Discipliné",
            text: "Les investisseurs professionnels suivent des règles immuables pour neutraliser l'impact de leurs émotions :",
            bullets: [
              "Tenue rigoureuse d'un journal de trading consignant motivations, thèses et ressentis émotionnels.",
              "Application stricte de la règle des 24h avant tout achat impulsif.",
              "Horizon de temps : Les marchés sont une machine à transférer l'argent des impatients vers les patients (Warren Buffett)."
            ],
            illustration: "journal"
          },
          {
            title: "4. Consignes de l'Examen Final",
            text: "Répondez aux 5 questions pratiques de mise en situation psychologique et tactique pour décrocher votre diplôme du Niveau 3 !",
            bullets: [
              "5 questions de cas pratiques.",
              "Rattrapage automatique des erreurs à la fin du quiz.",
              "Validez l'examen pour débloquer le Niveau 4 et empocher 550 XP !"
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_3_e_1",
            text: "Lors d'une séance boursière très agitée où les cours varient rapidement, quel type d'ordre devez-vous privilégier pour éviter de payer une action beaucoup trop cher ?",
            options: [
              "Un ordre 'Au Marché' sans aucune limite.",
              "Un ordre 'À Cours Limité' qui définit avec précision le prix d'achat maximal que vous acceptez de payer.",
              "Un appel téléphonique au gouverneur de la banque centrale.",
              "Une lettre recommandée envoyée par la poste."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ordre à cours limité vous protège contre les flambées brutales et garantit que votre transaction ne s'exécutera jamais au-dessus de votre prix cible."
          },
          {
            id: "q_3_e_2",
            text: "Vous voyez une action spéculative qui a pris +80% en 3 jours et tout le monde en parle avec euphorie sur internet. Quelle est la réaction la plus sage ?",
            options: [
              "Vendre sa maison pour tout investir immédiatement au plus haut de la vague.",
              "Identifier le piège du FOMO, appliquer la règle des 24h et s'abstenir de courir après une hausse parabolique déjà consommée.",
              "Emprunter de l'argent avec un effet de levier x50.",
              "Supprimer son application de bourse."
            ],
            correctAnswerIndex: 1,
            explanation: "Acheter sous le coup de l'euphorie médiatique (FOMO) conduit presque toujours à acheter au plus haut juste avant la correction des cours."
          },
          {
            id: "q_3_e_3",
            text: "Vous venez de subir une perte de 300€ sur un trade raté. Vous ressentez une forte frustration et souhaitez immédiatement reprendre un trade plus gros pour vous 'refaire'. De quel biais s'agit-il ?",
            options: [
              "Du 'Revenge Trading' (trading de vengeance), un comportement destructeur qu'il faut absolument bloquer en fermant immédiatement ses écrans.",
              "D'une stratégie recommandée par tous les prix Nobel d'économie.",
              "Du biais d'optimisme passif.",
              "D'un bug informatique du courtier."
            ],
            correctAnswerIndex: 0,
            explanation: "Le Revenge Trading est causé par l'orgueil blessé. Agir sous la colère amplifie considérablement le risque de pertes encore plus lourdes."
          },
          {
            id: "q_3_e_4",
            text: "Pourquoi le facteur temps est-il le plus grand allié de l'investisseur particulier en bourse ?",
            options: [
              "Parce que sur des horizons de 15 à 20 ans, les marchés boursiers mondiaux ont historiquement toujours délivré des performances positives grâce aux intérêts composés.",
              "Parce que les ordinateurs deviennent plus rapides chaque année.",
              "Parce que les dividendes ne sont payés qu'au bout de 50 ans.",
              "Parce que les actions deviennent gratuites avec le temps."
            ],
            correctAnswerIndex: 0,
            explanation: "L'horizon long terme lisse totalement la volatilité de court terme et permet au mécanisme exponentiel des intérêts composés de démultiplier votre épargne."
          },
          {
            id: "q_3_e_5",
            text: "Quelle question fondamentale devez-vous vous poser pour neutraliser le 'biais d'ancrage' sur une action dont le cours a chuté ?",
            options: [
              "'À quelle heure ferme le bureau de poste ?'",
              "'Si je n'avais pas cette action aujourd'hui, est-ce que je l'achèterais au cours actuel avec mon argent disponible ?'",
              "'Est-ce que le PDG de l'entreprise a les yeux bleus ?'",
              "'Quel était le prix de l'action en 1985 ?'"
            ],
            correctAnswerIndex: 1,
            explanation: "Cette question permet de faire abstraction de votre prix d'achat passé et d'évaluer l'opportunité d'investissement avec une totale objectivité."
          }
        ]
      }
    ]
  },
  {
    id: "mod4",
    title: "Niveau 4 : Analyse Fondamentale & Ratios",
    description: "Apprenez à déchiffrer la santé financière réelle d'une entreprise au-delà des courbes de prix.",
    lessons: [
      {
        id: "l4_1",
        title: "Le Ratio P/E (Price-to-Earnings) & Valorisation",
        description: "Comprenez la méthode universelle des analystes pour évaluer si une action est chère ou bon marché.",
        xpReward: 400,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Qu'est-ce que le P/E (Price-to-Earnings Ratio) ?",
            text: "Le ratio P/E (PER en français - Ratio Cours/Bénéfice) est l'indicateur de valorisation le plus célèbre au monde. Il compare le prix d'une action au bénéfice net annuel généré par celle-ci.",
            bullets: [
              "Formule : Cours de l'action / Bénéfice Net Par Action (BPA ou EPS en anglais).",
              "Signification concrète : Un P/E de 20 signifie que vous payez 20€ aujourd'hui pour obtenir 1€ de profit annuel généré par la société.",
              "Autre lecture : C'est le nombre d'années de bénéfices nécessaires pour rembourser le prix d'achat de l'action à bénéfices constants."
            ],
            illustration: "ratio"
          },
          {
            title: "2. Interprétation : P/E élevé vs P/E faible",
            text: "Un P/E élevé n'est pas forcément une mauvaise nouvelle, et un P/E très faible n'est pas forcément une bonne affaire !",
            bullets: [
              "P/E élevé (> 30) : Souvent caractéristique des entreprises de croissance (Tech, IA, Santé). Les investisseurs acceptent de payer cher car ils anticipent une explosion future des bénéfices.",
              "P/E modéré (12 à 20) : Entreprises matures, stables et rentables (Consommation, Industrie, Grande distribution).",
              "P/E très bas (< 8) : Peut signaler une sous-évaluation, mais attention au piège de valeur (Value Trap) où l'entreprise est en déclin irréversible."
            ],
            illustration: "balance"
          },
          {
            title: "3. Exemple concret & Comparaison sectorielle",
            text: "Règle absolue : Ne comparez jamais le P/E d'une entreprise technologique avec celui d'une banque ou d'un constructeur automobile. Comparez toujours des pairs au sein du même secteur !",
            bullets: [
              "Constructeurs automobiles : Renault (P/E ~6), Stellantis (P/E ~5) vs Tesla (P/E ~70 car valorisée comme une entreprise d'IA et de logiciels).",
              "P/E Forward : Calcule le ratio avec les bénéfices prévisionnels des 12 prochains mois estimés par le consensus des analystes.",
              "Le PEG Ratio (Price/Earnings to Growth) : Divise le P/E par le taux de croissance des bénéfices pour savoir si le P/E est justifié."
            ],
            illustration: "compare"
          },
          {
            title: "4. Les limites du P/E",
            text: "Le ratio P/E est un outil indispensable mais incomplet s'il est utilisé seul :",
            bullets: [
              "Il ignore la dette : Deux entreprises avec le même P/E peuvent avoir des niveaux d'endettement radicalement différents.",
              "Il est inutilisable si l'entreprise est en perte (bénéfice négatif = pas de P/E calculable).",
              "Les bénéfices comptables peuvent être temporairement gonflés par des ventes d'actifs exceptionnelles.",
              "Règle de pro : Couplez toujours le P/E avec l'analyse de la trésorerie libre (Free Cash Flow) et du bilan."
            ],
            illustration: "sheet"
          }
        ],
        questions: [
          {
            id: "q_4_1_1",
            text: "Comment se calcule précisément le ratio P/E (Price-to-Earnings) d'une action ?",
            options: [
              "En divisant le cours actuel de l'action par son Bénéfice Net Par Action (BPA).",
              "En multipliant le nombre d'actionnaires par l'impôt sur les sociétés.",
              "En divisant la dette totale par le chiffre d'affaires.",
              "En ajoutant le cours de l'or au cours de l'action."
            ],
            correctAnswerIndex: 0,
            explanation: "Le P/E s'obtient en divisant le prix de l'action par le profit net annuel par part, indiquant combien de fois l'investisseur paye le bénéfice de la société."
          },
          {
            id: "q_4_1_2",
            text: "Que signifie concrètement un ratio P/E égal à 15 pour une entreprise cotée ?",
            options: [
              "Qu'il faut attendre 15 jours pour pouvoir revendre ses parts.",
              "Que le prix d'achat de l'action équivaut à 15 fois le montant du bénéfice net annuel généré par action.",
              "Que l'entreprise a fait faillite 15 fois dans son histoire.",
              "Que l'État détient 15% du capital de cette firme."
            ],
            correctAnswerIndex: 1,
            explanation: "Un P/E de 15 signifie que l'investisseur débourse 15€ pour acquérir 1€ de profit annuel de l'entreprise à son rythme actuel."
          },
          {
            id: "q_4_1_3",
            text: "Pourquoi les géants de l'intelligence artificielle et de la technologie affichent-ils souvent des P/E très supérieurs à la moyenne du marché ?",
            options: [
              "Parce qu'ils ne respectent pas les lois comptables.",
              "Parce que les investisseurs anticipent une croissance explosive de leurs bénéfices futurs dans les années à venir.",
              "Parce qu'ils accumulent des réserves de pièces d'or secrètes.",
              "Pour décourager les particuliers d'acheter leurs actions."
            ],
            correctAnswerIndex: 1,
            explanation: "Les entreprises de croissance bénéficient de valorisations élevées car le marché accepte de payer cher aujourd'hui des profits futurs attendus en très forte hausse."
          },
          {
            id: "q_4_1_4",
            text: "Qu'appelle-t-on un 'Value Trap' (piège de valeur) en analyse fondamentale ?",
            options: [
              "Une action qui semble très bon marché avec un P/E très faible, mais dont l'activité est en réalité en déclin irréversible et sans avenir.",
              "Une prime offerte par la banque aux meilleurs investisseurs.",
              "Un blocage temporaire des dividendes par les régulateurs.",
              "Une action dont le prix ne change jamais."
            ],
            correctAnswerIndex: 0,
            explanation: "Un piège de valeur est une entreprise dont le cours et le P/E sont bas pour de très bonnes raisons (perte de parts de marché, obsolescence, lourde dette). L'action continue de baisser au lieu de rebondir."
          }
        ]
      },
      {
        id: "l4_2",
        title: "Le Bilan Comptable & Free Cash Flow",
        description: "Distinguez la vraie trésorerie disponible, la dette et la solidité patrimoniale d'une entreprise.",
        xpReward: 450,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Les 3 grands documents financiers d'une société",
            text: "Pour analyser sérieusement une entreprise, les professionnels examinent trois rapports financiers officiels publiés chaque trimestre :",
            bullets: [
              "📊 Le Compte de Résultat (Income Statement) : Retrace le Chiffre d'Affaires, les charges, les impôts et le Bénéfice Net final.",
              "🏛️ Le Bilan (Balance Sheet) : Photographie à un instant T de ce que l'entreprise possède (Actifs) et de ce qu'elle doit (Passifs et Dettes).",
              "💸 Le Tableau des Flux de Trésorerie (Cash Flow Statement) : Suit les mouvements réels d'argent liquide qui entrent et sortent des comptes bancaires."
            ],
            illustration: "sheet"
          },
          {
            title: "2. Le Free Cash Flow (FCF) : Le juge de paix ultime",
            text: "Le bénéfice comptable peut être manipulé par des artifices légaux d'amortissement, mais la trésorerie réelle ne ment jamais. 'Profit is an opinion, Cash is a fact.'",
            bullets: [
              "Le Free Cash Flow (Flux de Trésorerie Libre) est l'argent liquide réel restant une fois que toutes les factures et tous les investissements indispensables (usines, R&D) ont été payés.",
              "Un FCF abondant et croissant permet à l'entreprise de faire 4 choses magiques : verser des dividendes, racheter ses propres actions, rembourser sa dette ou racheter des concurrents.",
              "Une entreprise sans FCF positif doit constamment emprunter ou créer de nouvelles actions pour survivre."
            ],
            illustration: "growth"
          },
          {
            title: "3. La Dette Nette et le ratio Dette / EBITDA",
            text: "L'endettement est le premier facteur de faillite d'une entreprise en période de récession ou de hausse des taux d'intérêt.",
            bullets: [
              "Dette Nette = Dette Financière Totale brute - Trésorerie disponible en banque.",
              "Si la trésorerie est supérieure à la dette (comme chez Apple ou Alphabet avec des dizaines de milliards de cash net), l'entreprise est une forteresse imprenable.",
              "Ratio Dette Nette / EBITDA : Mesure en combien d'années d'excédent brut l'entreprise peut rembourser sa dette. Au-delà de 3,5x à 4x, la situation devient dangereuse."
            ],
            illustration: "debt"
          },
          {
            title: "4. Le Moat économique (L'avantage concurrentiel durable)",
            text: "Le concept de 'Moat' (douves de château fort), popularisé par Warren Buffett, désigne la capacité d'une entreprise à protéger ses marges exceptionnelles contre les assauts de la concurrence.",
            bullets: [
              "Effet de réseau : Plus il y a d'utilisateurs, plus le service est puissant (ex: Visa, Mastercard, Microsoft Windows).",
              "Pouvoir de fixation des prix (Pricing Power) : Capacité à augmenter ses prix sans perdre de clients (ex: Apple, Ferrari, LVMH, Hermès).",
              "Coûts de transfert élevés : Quand il est trop complexe ou coûteux pour un client de changer de fournisseur (ex: logiciels ERP, Cloud AWS/Azure)."
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_4_2_1",
            text: "Pourquoi le 'Free Cash Flow' (Flux de Trésorerie Disponible) est-il considéré comme le ratio le plus fiable par les grands investisseurs ?",
            options: [
              "Parce qu'il indique la vitesse à laquelle l'entreprise dépense son budget publicitaire.",
              "Parce qu'il mesure l'argent liquide réel effectivement généré par l'activité, impossible à falsifier par des astuces comptables d'amortissement.",
              "C'est un indicateur fiscal créé pour éviter de payer des impôts.",
              "Pour compter le nombre d'ordinateurs dans les bureaux."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Free Cash Flow représente l'oxygène financier réel restant après toutes les dépenses d'exploitation et d'investissement. C'est l'argent disponible pour récompenser les actionnaires."
          },
          {
            id: "q_4_2_2",
            text: "Que représentent les 'Capitaux Propres' (Shareholders' Equity) dans le bilan d'une entreprise cotée ?",
            options: [
              "L'ensemble des dettes de l'entreprise auprès de ses banques partenaires.",
              "La valeur nette résiduelle des actifs de la société après déduction totale de toutes ses dettes (ce qui appartient réellement aux actionnaires).",
              "La somme versée chaque mois pour payer les salaires des ouvriers.",
              "Un compte bloqué pour les amendes environnementales."
            ],
            correctAnswerIndex: 1,
            explanation: "Les capitaux propres correspondent à l'actif moins le passif : c'est la valeur patrimoniale nette qui reviendrait aux actionnaires si l'entreprise vendait tout pour solder ses dettes."
          },
          {
            id: "q_4_2_3",
            text: "Qu'est-ce qu'un 'Moat' ou avantage concurrentiel durable selon Warren Buffett ?",
            options: [
              "Une barrière protectrice (marque prestigieuse, brevets, effet de réseau) empêchant les concurrents d'éroder les marges et profits de l'entreprise.",
              "Un contrat d'exclusivité signé avec le président de la république.",
              "Une réduction d'impôt accordée aux entreprises de plus de 100 ans.",
              "Une technique de trading algorithmique à haute fréquence."
            ],
            correctAnswerIndex: 0,
            explanation: "Comme les douves d'un château fort, le Moat protège les profits élevés d'une entreprise exceptionnelle contre l'arrivée de concurrents copieurs."
          },
          {
            id: "q_4_2_4",
            text: "Que signifie un 'Pricing Power' (pouvoir de fixation des prix) élevé pour une entreprise comme Apple ou Hermès ?",
            options: [
              "L'entreprise est obligée de baisser ses prix chaque trimestre pour ne pas perdre ses clients.",
              "L'entreprise peut augmenter régulièrement ses tarifs sans que ses clients fidèles n'aillent chez la concurrence, préservant ses marges face à l'inflation.",
              "L'entreprise fixe elle-même le taux des impôts nationaux.",
              "L'entreprise ne vend ses produits qu'aux enchères."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Pricing Power est le graal de l'investisseur : une marque si forte que les clients acceptent de payer plus cher sans hésiter, garantissant la rentabilité en toute circonstance."
          }
        ]
      },
      {
        id: "l4_3",
        title: "Le Rendement du Dividende & Intérêts Composés",
        description: "Apprenez à mesurer l'efficacité des flux de revenus passifs et à débusquer les dividendes pièges.",
        xpReward: 480,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Calcul du Rendement du Dividende (Dividend Yield)",
            text: "Ne jugez jamais un dividende à son montant brut en euros, mais toujours à son pourcentage par rapport au prix payé pour acheter l'action !",
            bullets: [
              "Formule : (Dividende annuel par action / Cours actuel de l'action) x 100.",
              "Exemple A : Une action vaut 50€ et verse 2,50€ de dividende ➔ Rendement = (2,50 / 50) x 100 = 5,0%.",
              "Exemple B : Une action vaut 400€ et verse 4,00€ de dividende ➔ Rendement = (4,00 / 400) x 100 = 1,0%.",
              "Bien que l'action B verse un montant plus élevé en valeur absolue (4€ vs 2,50€), l'action A vous offre une rentabilité de flux 5 fois supérieure par euro investi !"
            ],
            illustration: "yield_calc"
          },
          {
            title: "2. Le Payout Ratio (Ratio de distribution des bénéfices)",
            text: "Le Payout Ratio est la proportion des bénéfices nets qu'une entreprise consacre au paiement de ses dividendes.",
            bullets: [
              "Formule : (Dividendes totaux versés / Bénéfice net de l'entreprise) x 100.",
              "Zone saine (30% à 60%) : L'entreprise rémunère généreusement ses actionnaires tout en conservant 40% à 70% de ses profits pour réinvestir dans son avenir.",
              "Zone de danger (> 90% ou > 100%) : L'entreprise distribue plus que ce qu'elle gagne en s'endettant pour maintenir l'illusion d'un dividende. La coupure est imminente !"
            ],
            illustration: "balance"
          },
          {
            title: "3. Le piège du 'Yield Trap' (Rendement mirage)",
            text: "Un rendement anormalement élevé (ex: 12% à 18%) est presque toujours un signal d'alarme critique plutôt qu'une aubaine.",
            bullets: [
              "Mécanisme du piège : Si une action à 100€ versait 8€ de dividende (8% de rendement) et que son cours s'effondre à 40€ suite à une crise majeure, son rendement affiché grimpe mécaniquement à 20% (8€ / 40€) !",
              "Ce rendement de 20% est une illusion basée sur le passé : lors de l'assemblée suivante, l'entreprise réduira ou supprimera le dividende pour éviter la faillite.",
              "Règle d'or : Privilégiez la croissance et la pérennité du dividende plutôt qu'un rendement facial démesuré."
            ],
            illustration: "trap"
          },
          {
            title: "4. Les 'Aristocrates du Dividende' & Le réinvestissement",
            text: "Les Dividend Aristocrats sont des entreprises d'élite qui ont augmenté leur dividende sans interruption chaque année depuis au moins 25 ans consécutifs (ex: Coca-Cola, Procter & Gamble, Johnson & Johnson, McDonald's).",
            bullets: [
              "Elles ont maintenu et augmenté leurs dividendes à travers la crise de 2000, 2008, la pandémie de 2020 et les chocs d'inflation.",
              "En réinvestissant systématiquement ces dividendes croissants pour racheter de nouvelles parts, vous créez une machine à cash exponentielle.",
              "Au bout de 15 ans, votre rendement sur coût initial (Yield on Cost) peut dépasser 15% à 20% par an !"
            ],
            illustration: "growth"
          }
        ],
        questions: [
          {
            id: "q_4_3_1",
            text: "Comment se calcule le rendement du dividende (Dividend Yield) d'une action cotée ?",
            options: [
              "En multipliant le dividende par le chiffre d'affaires mondial de l'entreprise.",
              "En divisant le montant du dividende annuel par le cours actuel de l'action, exprimé en pourcentage.",
              "En demandant l'autorisation à un conseiller bancaire de quartier.",
              "En comptant le nombre d'employés de l'entreprise."
            ],
            correctAnswerIndex: 1,
            explanation: "Le rendement exprime le revenu annuel perçu rapporté au prix d'achat de l'action, permettant de comparer l'efficacité des versements entre différentes sociétés."
          },
          {
            id: "q_4_3_2",
            text: "Pourquoi une action affichant un rendement de dividende de 16% doit-elle inciter à la plus grande prudence ?",
            options: [
              "Parce que les dividendes au-dessus de 10% sont automatiquement confisqués par les banques centrales.",
              "Parce que ce rendement artificiellement gonflé résulte souvent d'un effondrement récent du cours de bourse, annonçant une coupure imminente de ce dividende non pérenne.",
              "Parce que les dividendes élevés ne sont payés qu'en bons d'achat de supermarché.",
              "Parce que l'entreprise va être nationalisée sous 48 heures."
            ],
            correctAnswerIndex: 1,
            explanation: "Un rendement gigantesque trahit un cours de bourse en déroute. Comme le dividende affiché se base sur l'exercice passé, l'entreprise est souvent obligée de l'annuler pour sauver sa trésorerie."
          },
          {
            id: "q_4_3_3",
            text: "Qu'indique un Payout Ratio de 45% pour une entreprise distribuant un dividende ?",
            options: [
              "Que l'entreprise distribue 45% de ses bénéfices nets à ses actionnaires et conserve 55% pour financer ses projets futurs et sa sécurité financière.",
              "Que l'entreprise est au bord de la faillite bancaire.",
              "Que 45% des actionnaires ont voté contre la direction.",
              "Que le dividende sera divisé par deux l'année prochaine."
            ],
            correctAnswerIndex: 0,
            explanation: "Un Payout Ratio de 45% est dans une zone d'excellence : il récompense généreusement les investisseurs tout en conservant plus de la moitié des profits pour la croissance et les imprévus."
          },
          {
            id: "q_4_3_4",
            text: "Qu'est-ce qu'une entreprise qualifiée de 'Dividend Aristocrat' ?",
            options: [
              "Une entreprise dont les actionnaires doivent appartenir à une famille royale.",
              "Une société d'élite qui a augmenté le montant de son dividende annuel sans aucune interruption pendant au moins 25 années consécutives.",
              "Une entreprise qui refuse de payer des impôts sur les sociétés.",
              "Une société qui n'a jamais émis d'actions en bourse."
            ],
            correctAnswerIndex: 1,
            explanation: "Les Aristocrates du Dividende sont des entreprises d'une solidité historique exceptionnelle, ayant traversé toutes les crises mondiales en augmentant leurs versements chaque année."
          }
        ]
      },
      {
        id: "l4_4",
        title: "Marges Opérationnelles, ROE & Qualité du Business",
        description: "Mesurez la rentabilité intrinsèque et l'efficacité des dirigeants grâce aux marges, au ROE et au ROIC.",
        xpReward: 500,
        durationMinutes: 5,
        slides: [
          {
            title: "1. De la Marge Brute à la Marge Nette Finale",
            text: "Une entreprise peut afficher des milliards d'euros de chiffre d'affaires tout en étant incapable de dégager le moindre bénéfice pour ses actionnaires. L'analyse des marges révèle la rentabilité réelle de la machine.",
            bullets: [
              "Marge Brute (Gross Margin) : (Chiffre d'affaires - Coût direct des marchandises) / CA. Mesure le pouvoir de tarification initial du produit.",
              "Marge Opérationnelle (Operating Margin / EBIT) : Bénéfice d'exploitation / CA. Révèle la rentabilité du cœur de métier après paiement des salaires, loyers et R&D.",
              "Marge Nette (Net Profit Margin) : Bénéfice Net final / CA. Ce qui reste réellement dans la poche de l'entreprise après impôts et intérêts financiers.",
              "Repère : Une marge nette supérieure à 15% à 20% témoigne d'un avantage concurrentiel considérable (ex: Luxe, Logiciels, Semi-conducteurs)."
            ],
            illustration: "ratio"
          },
          {
            title: "2. Le ROE (Return on Equity) : Rentabilité des Fonds Propres",
            text: "Le Return on Equity mesure l'efficacité avec laquelle une entreprise utilise l'argent de ses actionnaires (ses capitaux propres) pour générer du profit.",
            bullets: [
              "Formule : Bénéfice Net / Capitaux Propres (Shareholders' Equity) x 100.",
              "Exemple : Une entreprise avec 100M€ de capitaux propres qui génère 20M€ de bénéfice net affiche un ROE de 20%.",
              "Interprétation : Un ROE supérieur à 15% de façon régulière sur 5 ans indique une remarquable capacité d'autofinancement et de création de valeur.",
              "Piège de l'endettement : Attention, un ROE peut être artificiellement dopé par une dette massive. Vérifiez toujours la solidité du bilan en parallèle !"
            ],
            illustration: "growth"
          },
          {
            title: "3. Le ROIC (Return on Invested Capital) : Le Graal de Buffett",
            text: "Le ROIC est considéré par les plus grands investisseurs (Warren Buffett, Charlie Munger, Terry Smith) comme la mesure reine de la qualité managériale.",
            bullets: [
              "Formule : Résultat d'exploitation après impôts (NOPAT) / (Capitaux Propres + Dettes financières).",
              "Signification : Combien chaque euro investi dans l'outil de production (usines, brevets, magasins, serveurs) rapporte en profit d'exploitation.",
              "Règle de création de valeur : Le ROIC doit être nettement supérieur au coût moyen pondéré du capital (WACC). Si ROIC > WACC, l'entreprise crée de la valeur exponentielle."
            ],
            illustration: "target"
          },
          {
            title: "4. Identifier les véritables 'Compounders'",
            text: "Un 'Compounder' est une entreprise d'exception capable de réinvestir ses énormes flux de trésorerie à des taux de rentabilité élevés pendant des décennies.",
            bullets: [
              "Les 4 piliers du Compounder : Marges nettes élevées (> 15%), ROIC constant (> 15%), endettement faible (Dette nette / EBITDA < 1,5x) et Moat infranchissable.",
              "Exemples historiques : Microsoft, Alphabet, Visa, ASML, L'Oréal, Hermès.",
              "Détenir de tels champions sur 10 à 20 ans produit des rendements patrimoniaux incomparables grâce à l'effet de capitalisation continue."
            ],
            illustration: "shield"
          }
        ],
        questions: [
          {
            id: "q_4_4_1",
            text: "Que mesure précisément la 'Marge Nette' d'une entreprise cotée en bourse ?",
            options: [
              "Le pourcentage de chiffre d'affaires dépensé en cadeaux de fin d'année.",
              "La part de chaque euro de chiffre d'affaires qui se transforme réellement en bénéfice net après paiement de toutes les charges, impôts et dettes.",
              "Le nombre d'heures travaillées par les salariés chaque semaine.",
              "La surface des locaux de stockage de l'entreprise."
            ],
            correctAnswerIndex: 1,
            explanation: "La marge nette exprime la rentabilité finale réelle : une marge de 20% signifie que sur 100€ de ventes, l'entreprise conserve 20€ de profit net."
          },
          {
            id: "q_4_4_2",
            text: "Qu'indique un ROE (Return on Equity) de 25% régulier sur plusieurs années ?",
            options: [
              "Que l'entreprise perd 25% de sa valeur chaque mois.",
              "Que l'entreprise génère 25€ de bénéfice net pour chaque 100€ de capitaux propres apportés par ses actionnaires, ce qui témoigne d'une excellente rentabilité.",
              "Que l'entreprise doit licencier 25% de son personnel.",
              "Que les dividendes sont bloqués pendant 25 ans."
            ],
            correctAnswerIndex: 1,
            explanation: "Un ROE élevé et constant prouve que la direction utilise très efficacement l'argent des actionnaires pour produire d'abondants profits."
          },
          {
            id: "q_4_4_3",
            text: "Pourquoi le ROIC (Return on Invested Capital) est-il considéré par les experts comme l'indicateur roi de l'analyse fondamentale ?",
            options: [
              "Parce qu'il évalue la rentabilité réelle de l'ensemble des capitaux engagés dans l'activité (fonds propres + dettes), neutralisant les artifices d'endettement.",
              "Parce qu'il garantit que l'action ne baissera jamais sur les marchés.",
              "Parce qu'il permet de ne pas payer la TVA.",
              "Parce qu'il est calculé directement par les banques centrales."
            ],
            correctAnswerIndex: 0,
            explanation: "Le ROIC mesure l'efficacité avec laquelle chaque euro investi dans l'entreprise génère du cash, reflétant la véritable puissance intrinsèque du modèle économique."
          },
          {
            id: "q_4_4_4",
            text: "Quelles sont les caractéristiques d'une entreprise qualifiée de 'Compounder' d'élite ?",
            options: [
              "Une entreprise sans aucun client avec une dette colossale.",
              "Des marges nettes élevées, un ROIC supérieur à 15%, un avantage concurrentiel (Moat) durable et une faible dette financière.",
              "Une société qui change de secteur d'activité tous les trimestres.",
              "Une entreprise qui vend uniquement à prix coûtant sans faire de marge."
            ],
            correctAnswerIndex: 1,
            explanation: "Les Compounders associent rentabilité d'exception, barrière à l'entrée et gestion saine, réinvestissant leurs profits pour faire croître la valeur patrimoniale de manière exponentielle."
          }
        ]
      },
      {
        id: "l4_exam",
        title: "🎓 Examen Final : Analyse Fondamentale & Ratios",
        description: "Épreuve de synthèse du Niveau 4 : ratio P/E, bilan comptable, Free Cash Flow, dividendes et rentabilité ROE / ROIC.",
        xpReward: 650,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : Le P/E et la Valorisation Réelle",
            text: "Le ratio Cours/Bénéfice (P/E) indique combien le marché est prêt à payer pour chaque euro de profit annuel généré.",
            bullets: [
              "P/E élevé (> 30) : Forte croissance anticipée par les marchés (ex: Tech, IA).",
              "P/E modéré (12 - 20) : Entreprises matures avec des flux réguliers.",
              "Value Trap (Piège de la valeur) : Une action avec un P/E de 5 dont le modèle économique est en déclin irréversible n'est pas une bonne affaire."
            ],
            illustration: "ratio"
          },
          {
            title: "2. Révision : Le Bilan Comptable & le Free Cash Flow",
            text: "Les bénéfices comptables peuvent être arrangés, mais la trésorerie réelle ne ment jamais.",
            bullets: [
              "Free Cash Flow (FCF) : Flux de trésorerie disponible restant après avoir payé toutes les dépenses et investi dans les usines/outils (CapEx).",
              "Dette Nette / EBITDA < 2x : Critère essentiel pour s'assurer que l'entreprise n'est pas asphyxiée par les remboursements d'intérêts.",
              "Bilan solide : Présence d'un matelas de cash pour surmonter les récessions sans diluer les actionnaires."
            ],
            illustration: "balance"
          },
          {
            title: "3. Révision : Dividendes & 'Compounders' (ROE / ROIC)",
            text: "Comment distinguer une entreprise moyenne d'un champion de classe mondiale :",
            bullets: [
              "Payout Ratio < 60% : Assure que le dividende est durable et peut croître sans mettre en péril l'entreprise.",
              "ROE > 15% et ROIC > 15% : Preuve irréfutable que le management alloue le capital de manière extraordinairement rentable.",
              "Moat (Avantage concurrentiel) : Brevets, marque iconique, effet de réseau ou coûts de changement empêchant les rivaux de copier le business."
            ],
            illustration: "shield"
          },
          {
            title: "4. Consignes de l'Examen Final",
            text: "Analysez 5 études de cas financières concrètes pour prouver votre expertise en analyse fondamentale d'entreprises cotées !",
            bullets: [
              "5 questions de diagnostic financier d'entreprise.",
              "Rattrapage automatique des mauvaises réponses en fin de quiz.",
              "Validez l'examen pour débloquer le Niveau 5 Ultime et décrocher 650 XP !"
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_4_e_1",
            text: "Pourquoi le Free Cash Flow (flux de trésorerie disponible) est-il souvent plus fiable que le simple résultat net comptable ?",
            options: [
              "Parce que le FCF mesure les liquidités réelles encaissées après investissements, échappant aux écritures et amortissements comptables théoriques.",
              "Parce que le FCF est calculé par la météo nationale.",
              "Parce que le résultat net est interdit par les régulateurs.",
              "Parce que le cash n'existe pas dans les grandes entreprises."
            ],
            correctAnswerIndex: 0,
            explanation: "Le Free Cash Flow reflète l'argent tangible réellement disponible dans les caisses pour verser des dividendes, racheter des actions ou réduire les dettes."
          },
          {
            id: "q_4_e_2",
            text: "Une entreprise affiche un P/E très faible de 4. Cependant, ses ventes s'effondrent de -20% par an et ses dettes explosent. Comment les investisseurs avertis qualifient-ils cette situation ?",
            options: [
              "L'aubaine du siècle à acheter les yeux fermés.",
              "Un 'Value Trap' (piège de la valeur) : l'action semble bon marché en surface mais cache une dégradation fondamentale mortelle.",
              "Une entreprise sans aucun concurrent.",
              "Un livret d'épargne d'État."
            ],
            correctAnswerIndex: 1,
            explanation: "Un faible P/E ne suffit jamais : si l'entreprise est en déclin structurel, ses bénéfices futurs vont disparaître et le cours continuera de chuter."
          },
          {
            id: "q_4_e_3",
            text: "Une société verse un dividende de 5€ par action alors qu'elle ne gagne que 3€ de bénéfice net par action (Payout Ratio de 166%). Quelle est la conclusion logique ?",
            options: [
              "Le dividende est d'une sécurité totale.",
              "Le dividende est insoutenable : l'entreprise s'endette ou puise dans ses réserves pour payer, ce qui entraînera une coupe du dividende à court terme.",
              "L'entreprise va recevoir un bonus des banques.",
              "L'action va tripler la semaine prochaine."
            ],
            correctAnswerIndex: 1,
            explanation: "Distribuer plus d'argent qu'on n'en gagne n'est pas viable. Un Payout Ratio supérieur à 100% annonce quasi systématiquement une baisse prochaine du dividende."
          },
          {
            id: "q_4_e_4",
            text: "Quel indicateur permet de mesurer le rendement réel du capital d'exploitation engagé (propres fonds + dettes) pour juger de la qualité intrinsèque du modèle économique ?",
            options: [
              "Le ROIC (Return on Invested Capital).",
              "Le nombre d'abonnés sur les réseaux sociaux.",
              "La couleur du logo de la société.",
              "Le montant des primes de Noël des cadres."
            ],
            correctAnswerIndex: 0,
            explanation: "Le ROIC mesure l'efficacité avec laquelle chaque euro injecté dans les machines, magasins, brevets et technologies produit du profit d'exploitation."
          },
          {
            id: "q_4_e_5",
            text: "Qu'est-ce qu'un 'Moat' (rempart concurrentiel) économique chez une entreprise comme Apple, LVMH ou Visa ?",
            options: [
              "Une barrière financière, technologique ou de marque empêchant les concurrents d'éroder ses parts de marché et ses marges élevées.",
              "Un pont-levis physique installé autour du siège social.",
              "Une amende infligée par les douanes.",
              "Un type d'action non échangeable."
            ],
            correctAnswerIndex: 0,
            explanation: "Le Moat protège les profits extraordinaires d'une entreprise face à la concurrence, lui permettant de maintenir des marges et un ROIC élevés pendant des décennies."
          }
        ]
      }
    ]
  },
  {
    id: "mod5",
    title: "Niveau 5 : Gestion du Risque & Stratégies Avancées",
    description: "Protégez vos arrières, utilisez les ordres professionnels et construisez une stratégie patrimoniale pérenne.",
    lessons: [
      {
        id: "l5_1",
        title: "L'effet de levier et le Stop-Loss",
        description: "Comprenez les mécanismes explosifs du trading actif et blindez vos positions avec des coupe-circuits.",
        xpReward: 500,
        durationMinutes: 5,
        slides: [
          {
            title: "1. L'effet de Levier (Leverage) : L'arme à double tranchant",
            text: "L'effet de levier permet d'investir sur le marché avec une somme bien supérieure à votre capital réel en empruntant temporairement des fonds à votre courtier (marge).",
            bullets: [
              "Levier x5 : Avec 1 000€ de capital réel, vous contrôlez une position de 5 000€ sur le marché.",
              "Multiplication des gains : Si l'action monte de +10%, votre gain est de 500€ (+50% de rendement sur vos 1 000€ initiaux).",
              "Amplification mortelle des pertes : Si l'action baisse de seulement -20%, votre perte est de 1 000€ (5 000€ x -20%), ce qui anéantit 100% de votre capital !",
              "Appel de marge (Margin Call) : Si vos pertes approchent votre dépôt, le courtier liquide automatiquement votre position à perte."
            ],
            illustration: "leverage"
          },
          {
            title: "2. Le bouclier absolu : L'ordre Stop-Loss",
            text: "Le Stop-Loss (ordre de coupure de perte) est l'assurance-vie obligatoire de tout opérateur sur les marchés financiers. Il vend automatiquement votre position dès qu'un seuil prédéfini est franchi à la baisse.",
            bullets: [
              "Discipline automatisée : Il élimine l'hésitation émotionnelle ('j'attends un peu, ça va remonter') qui transforme une petite perte de -5% en catastrophe de -60%.",
              "Bornage du risque : Vous définissez votre perte maximale tolérée dès l'entrée en position (ex: achat à 100€, Stop-Loss à 93€ ➔ risque plafonné à 7%).",
              "Sérénité d'esprit : Vous pouvez éteindre votre écran d'ordinateur sans craindre un effondrement imprévu pendant votre sommeil."
            ],
            illustration: "shield"
          },
          {
            title: "3. Le Trailing Stop (Stop suiveur)",
            text: "Le Trailing Stop est une variante dynamique intelligente du Stop-Loss conçue pour protéger vos gains au fur et à mesure que le cours monte.",
            bullets: [
              "Fonctionnement : Le seuil de stop remonte automatiquement à une distance fixe (ex: -5%) sous le plus haut historique atteint par l'action.",
              "Si l'action monte de 100€ à 150€, votre stop remonte automatiquement de 95€ à 142,50€.",
              "Si le cours se retourne brutalement, votre position est clôturée avec une plus-value garantie de +42,5% sans avoir eu besoin d'intervenir !"
            ],
            illustration: "target"
          },
          {
            title: "4. La règle du 'Position Sizing' (1% à 2% max de risque)",
            text: "La règle fondamentale des traders professionnels qui survivent sur des décennies est la gestion stricte du dimensionnement de position :",
            bullets: [
              "Ne risquez jamais plus de 1% à 2% de votre capital total sur une seule idée de trade.",
              "Exemple : Avec un compte de 10 000€, votre perte maximale sur un trade perdant ne doit pas excéder 100€ à 200€.",
              "Même avec 5 trades perdants consécutifs, votre compte conserve 90% à 95% de sa valeur, vous permettant de rebondir sans traumatisme."
            ],
            illustration: "balance"
          }
        ],
        questions: [
          {
            id: "q_5_1_1",
            text: "Quel est le danger principal de l'effet de levier (Leverage) en bourse ?",
            options: [
              "Il ralentit la vitesse de connexion de votre ordinateur.",
              "Il démultiplie symétriquement vos pertes et peut liquider l'intégralité de votre compte de courtage sur un faux mouvement passager.",
              "Il change la devise de votre compte bancaire.",
              "Il vous oblige à acheter des actions physiques dans des coffres."
            ],
            correctAnswerIndex: 1,
            explanation: "Le levier multiplie la taille de votre exposition. Une faible baisse du marché suffit à anéantir l'ensemble de votre marge initiale."
          },
          {
            id: "q_5_1_2",
            text: "Comment fonctionne précisément un ordre automatique 'Stop-Loss' ?",
            options: [
              "Il bloque le cours de l'action à la hausse pour vous forcer à prendre vos gains.",
              "Il se déclenche automatiquement en ordre de vente dès que le cours franchit à la baisse votre seuil de sécurité, coupant net la perte.",
              "Il double gratuitement votre capital toutes les deux semaines.",
              "Il coupe votre connexion internet pendant les séances de baisse."
            ],
            correctAnswerIndex: 1,
            explanation: "Le Stop-Loss est un coupe-circuit automatique qui liquide votre position dès que la baisse atteint votre limite, protégeant le reste de votre capital."
          },
          {
            id: "q_5_1_3",
            text: "Quel pourcentage maximal de son capital total un investisseur prudent doit-il risquer sur une seule transaction active ?",
            options: [
              "Entre 1% et 2% au maximum du capital total.",
              "Toujours 50% pour aller vite.",
              "100% en utilisant le levier x20 pour doubler sa mise.",
              "Strictement 0%, il ne faut jamais investir."
            ],
            correctAnswerIndex: 0,
            explanation: "La règle du 1% à 2% de risque par trade garantit la survie à long terme, neutralisant l'impact émotionnel et évitant la ruine sur une série de pertes."
          },
          {
            id: "q_5_1_4",
            text: "Quel est l'avantage clé d'un 'Trailing Stop' (Stop-Loss suiveur) ?",
            options: [
              "Il remonte automatiquement avec la hausse du cours pour verrouiller vos gains en cas de retournement du marché.",
              "Il supprime totalement tous les frais de courtage.",
              "Il empêche l'action de baisser pendant les week-ends.",
              "Il rachète automatiquement des actions au sommet."
            ],
            correctAnswerIndex: 0,
            explanation: "Le Stop suiveur accompagne la tendance haussière en montant avec le cours, sécurisant automatiquement vos bénéfices dès que le marché amorce un repli."
          }
        ]
      },
      {
        id: "l5_2",
        title: "Les Cycles de Marché et la Stratégie DCA",
        description: "Comprenez la météo des marchés haussiers/baissiers et dominez les crises grâce à l'investissement programmé.",
        xpReward: 550,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Bull Market vs Bear Market : La météo des marchés",
            text: "La bourse ne monte pas en ligne droite. Elle évolue selon des cycles historiques alternant périodes d'expansion et phases de correction.",
            bullets: [
              "🐂 Bull Market (Marché Haussier) : Période prolongée de confiance et de croissance des cours (le taureau charge vers le haut avec ses cornes). Les indices battent record sur record.",
              "🐻 Bear Market (Marché Baissier) : Repli sévère caractérisé par une baisse d'au moins -20% par rapport au sommet historique (l'ours frappe vers le bas avec ses griffes).",
              "Durée historique : Les Bull Markets durent en moyenne 5 à 9 ans avec des gains de +150% à +300%, tandis que les Bear Markets durent en moyenne 10 à 18 mois avec des baisses de -25% à -40%."
            ],
            illustration: "cycle"
          },
          {
            title: "2. Les crises historiques : Toutes surmontées",
            text: "Krach de 1929, Choc pétrolier de 1973, Bulle Internet de 2000, Crise des Subprimes de 2008, Krach Covid de 2020 : tous ont semblé marquer 'la fin du monde financier' sur le moment.",
            bullets: [
              "Dans 100% des cas historiques, les grands indices mondiaux (S&P 500, MSCI World) ont effacé la totalité des pertes et atteint de nouveaux sommets historiques.",
              "Les crises nettoient les excès spéculatifs, renforcent les entreprises les plus solides et créent les meilleures opportunités d'achat du siècle.",
              "Ceux qui ont acheté pendant le creux de 2008 ou de mars 2020 ont multiplié leur mise par 4 à 8 dans la décennie suivante."
            ],
            illustration: "rebound"
          },
          {
            title: "3. La stratégie reine : Le DCA (Dollar Cost Averaging)",
            text: "La méthode DCA consiste à investir un montant fixe d'argent à intervalle régulier (ex: 200€ chaque 1er du mois) sans jamais se soucier du cours du jour.",
            bullets: [
              "Quand le cours est haut (100€) : Vos 200€ achètent 2 actions.",
              "Quand le marché krache et baisse de 50% (50€) : Vos 200€ achètent automatiquement 4 actions !",
              "Résultat mathématique : Votre prix de revient moyen est de 66,66€ au lieu de 75€ grâce à l'effet de pondération des baisses.",
              "Dès que le marché rebondit ne serait-ce qu'un peu, votre portefeuille redevient immédiatement bénéficiaire."
            ],
            illustration: "dca"
          },
          {
            title: "4. Pourquoi le DCA bat le Market Timing dans 95% des cas",
            text: "Essayer de deviner le point le plus bas (Market Timing) est une illusion prouvée scientifiquement par toutes les études financières.",
            bullets: [
              "Étude Bank of America : Si vous avez manqué les 10 meilleurs jours de bourse du S&P 500 sur les 30 dernières années, votre rendement total est divisé par deux !",
              "Or, les meilleurs jours de rebond surviennent quasi-systématiquement au milieu des pires semaines de panique.",
              "En étant investi en continu via le DCA, vous êtes certain de ne jamais rater les jours de rebond historique les plus explosifs."
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_5_2_1",
            text: "Qu'est-ce qu'un 'Bear Market' (Marché Baissier) dans la terminologie financière officielle ?",
            options: [
              "Une période où la bourse n'est ouverte que le matin.",
              "Un cycle de repli marqué par une baisse d'au moins 20% des grands indices par rapport à leurs récents sommets, nourri par la récession ou la défiance.",
              "Un marché où seules les entreprises agricoles réalisent des bénéfices.",
              "Une panne générale des serveurs de courtage."
            ],
            correctAnswerIndex: 1,
            explanation: "L'ours symbolise l'attaque vers le bas : un Bear Market correspond à une baisse supérieure à -20% sur les indices de référence."
          },
          {
            id: "q_5_2_2",
            text: "Quel est l'avantage mathématique majeur de l'investissement programmé régulier (DCA) lors d'un krach boursier ?",
            options: [
              "Il supprime totalement les impôts sur les dividendes.",
              "Il vous fait acheter automatiquement un plus grand nombre de parts lorsque les prix sont bradés, abaissant fortement votre coût d'achat moyen.",
              "Il garantit que votre compte ne sera jamais débité pendant l'été.",
              "Il bloque les cours de bourse à la hausse."
            ],
            correctAnswerIndex: 1,
            explanation: "Le DCA tire profit des baisses : avec une somme fixe, vous accumulez plus d'actions au rabais, accélérant vos bénéfices dès le retour de la hausse."
          },
          {
            id: "q_5_2_3",
            text: "Pourquoi tenter de deviner le point le plus bas d'un krach (Market Timing) est-il une stratégie perdante pour les particuliers ?",
            options: [
              "Parce qu'il est illégal d'acheter une action au plus bas.",
              "Parce qu'en attendant sur le banc de touche, on rate quasi-systématiquement les journées de rebond les plus violentes, amputant la majeure partie du rendement futur.",
              "Parce que les cours ne descendent jamais plus de 2 heures.",
              "Parce que les banques ferment les comptes des investisseurs attentistes."
            ],
            correctAnswerIndex: 1,
            explanation: "Les rebonds les plus puissants se produisent au cœur des crises. Tenter de deviner le timing fait manquer ces journées cruciales, détruisant la performance globale."
          },
          {
            id: "q_5_2_4",
            text: "Historiquement, sur l'ensemble des krachs boursiers du 20ème et 21ème siècle, qu'ont toujours fini par faire les grands indices mondiaux (S&P 500, CAC 40, MSCI World) ?",
            options: [
              "Ils ont tous disparu pour être remplacés par du troc.",
              "Ils ont tous surmonté la crise, effacé les pertes et conquis de nouveaux sommets historiques tirés par l'innovation et la croissance économique.",
              "Ils sont restés bloqués à zéro pendant 50 ans.",
              "Ils ont été rachetés par une seule banque privée."
            ],
            correctAnswerIndex: 1,
            explanation: "L'histoire boursière montre une résilience absolue : chaque crise a été absorbée et suivie d'une phase d'expansion vers de nouveaux records historiques."
          }
        ]
      },
      {
        id: "l5_3",
        title: "L'allocation stratégique d'actifs & Rééquilibrage",
        description: "Concevez le plan de vol global de votre épargne et entretenez votre portefeuille comme un pro.",
        xpReward: 580,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Définir son profil d'investisseur et sa tolérance au risque",
            text: "Le meilleur portefeuille sur le papier est inutile si vous paniquez et vendez tout dès la première secousse de -10%. Votre allocation doit correspondre à votre profil psychologique réel.",
            bullets: [
              "🛡️ Profil Prudent (Défensif) : Priorité à la préservation du capital (30% Actions / 50% Obligations d'État / 15% Or / 5% Cash). Baisse maximale limitée à ~5-8%.",
              "⚖️ Profil Équilibré : Le classique 60/40 (60% Actions mondiales / 30% Obligations / 10% Or). Compromis idéal entre croissance et amortissement.",
              "🚀 Profil Dynamique (Offensif) : Priorité maximale à la croissance sur +15 ans (85% à 95% Actions et ETFs / 5% à 15% Or et Cash). Accepte des fluctuations temporaires de -20% à -35%."
            ],
            illustration: "balance_profile"
          },
          {
            title: "2. Le rituel du 'Rééquilibrage' (Rebalancing)",
            text: "Au fil des mois, les actifs qui montent fortement prennent une place démesurée dans votre portefeuille, modifiant votre niveau de risque initial.",
            bullets: [
              "Exemple : Vous aviez choisi 60% Actions / 40% Obligations. Après une année euphorique, les actions représentent 75% de votre compte.",
              "Votre portefeuille est devenu beaucoup plus risqué sans que vous ne l'ayez décidé !",
              "Le rééquilibrage consiste à vendre une partie des actions gagnantes au plus haut pour racheter des obligations ou de l'or décotés afin de revenir à 60/40."
            ],
            illustration: "refresh"
          },
          {
            title: "3. La vertu mathématique du rééquilibrage",
            text: "Le rééquilibrage périodique (annuel ou semestriel) applique automatiquement la règle d'or de tout investisseur prospère :",
            bullets: [
              "Il vous force à vendre ce qui a beaucoup monté (prendre des profits au sommet).",
              "Il vous force à acheter ce qui a baissé ou sous-performé (acheter au rabais).",
              "Cette discipline mécanique améliore le rendement ajusté du risque sur le long terme tout en éliminant les biais émotionnels."
            ],
            illustration: "target"
          },
          {
            title: "4. Synthèse finale : Le manifeste de l'investisseur serein",
            text: "Vous possédez désormais toutes les clés théoriques et pratiques pour réussir votre parcours sur les marchés financiers :",
            bullets: [
              "1. Diversifiez à l'échelle mondiale à l'aide d'ETFs à frais réduits.",
              "2. Investissez régulièrement chaque mois grâce à la stratégie DCA.",
              "3. Laissez le temps et les intérêts composés travailler pour vous sans céder aux sirènes du FOMO.",
              "4. Rééquilibrez votre allocation une fois par an en restant fidèle à votre profil.",
              "5. Félicitations pour avoir complété l'ensemble du cursus de formation Finance Bridge !"
            ],
            illustration: "growth"
          }
        ],
        questions: [
          {
            id: "q_5_3_1",
            text: "En quoi consiste l'exercice du 'rééquilibrage' (Rebalancing) périodique d'un portefeuille d'investissement ?",
            options: [
              "À fermer son compte de courtage pour en ouvrir un nouveau dans une autre banque.",
              "À vendre périodiquement une fraction des actifs qui ont fortement monté pour racheter les actifs en retard afin de restaurer son allocation cible initiale.",
              "À calculer le poids physique des pièces d'or dans son coffre.",
              "À égaliser les salaires des dirigeants d'entreprises détenues."
            ],
            correctAnswerIndex: 1,
            explanation: "Le rééquilibrage rétablit les proportions idéales de votre allocation, vous forçant disciplinairement à sécuriser des profits sur les gagnants pour réinvestir sur les lignes décotées."
          },
          {
            id: "q_5_3_2",
            text: "Pour un profil d'épargnant très prudent dont la priorité est de ne jamais perdre de capital à court terme, quelle allocation est la plus cohérente ?",
            options: [
              "100% sur des actions technologiques émergentes et fluctuantes.",
              "Une majorité d'obligations d'États stables (titres souverains de premier rang), de l'or refuge et des livrets garantis avec une part modérée d'actions (20-30%).",
              "Acheter exclusivement du pétrole brut et des matières premières spéculatives.",
              "Uniquement des crypto-monnaies naissantes."
            ],
            correctAnswerIndex: 1,
            explanation: "Un profil défensif privilégie les obligations d'État solides, l'or et les liquidités pour immuniser son capital contre les secousses boursières."
          },
          {
            id: "q_5_3_3",
            text: "Pourquoi le rééquilibrage améliore-t-il le rendement ajusté du risque sur le long terme ?",
            options: [
              "Parce qu'il force mécaniquement à 'vendre haut' les actifs surchauffés et à 'acheter bas' les actifs sous-évalués.",
              "Parce qu'il annule les frais de transaction du courtier.",
              "Parce qu'il empêche le marché de baisser pendant l'été.",
              "Parce qu'il rend les investissements anonymes."
            ],
            correctAnswerIndex: 0,
            explanation: "Le rééquilibrage applique la logique fondamentale de l'investissement : prendre des bénéfices sur ce qui a grimpé et réinvestir sur ce qui est bon marché."
          },
          {
            id: "q_5_3_4",
            text: "Quelle est la règle d'or pour bâtir un patrimoine boursier solide et serein sur le long terme ?",
            options: [
              "Essayer de devenir millionnaire en 3 semaines avec un effet de levier x50.",
              "Investir régulièrement sur des paniers d'actifs mondiaux diversifiés (ETFs), réinvestir ses dividendes et laisser agir la puissance des intérêts composés dans le temps.",
              "Vendre tout dès que les journaux télévisés annoncent une baisse.",
              "N'acheter que des actions dont le prix est inférieur à 1 euro."
            ],
            correctAnswerIndex: 1,
            explanation: "La diversification mondiale, la régularité du DCA et la patience des intérêts composés sont les trois piliers éprouvés du succès financier à long terme."
          }
        ]
      },
      {
        id: "l5_4",
        title: "La Couverture de Portefeuille (Hedging) & Gestion de Crise",
        description: "Protégez votre capital en période de tempête : options, actifs décorrélés, or et gestion tactique des liquidités.",
        xpReward: 600,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Le Principe du Hedging (Couverture de Risque)",
            text: "Le hedging (ou couverture) consiste à prendre une position financière destinée à compenser les pertes potentielles de votre portefeuille principal lors d'une baisse sévère des marchés.",
            bullets: [
              "Principe de l'assurance : De la même manière que vous assurez votre maison contre l'incendie, vous pouvez assurer votre portefeuille contre un krach boursier sans avoir à tout vendre.",
              "Évite les frottements fiscaux : La couverture évite de devoir liquider des lignes de long terme au sein de comptes taxables.",
              "Maintien de la sérénité : Savoir que son portefeuille est immunisé contre les baisses extrêmes évite les erreurs de panique."
            ],
            illustration: "shield"
          },
          {
            title: "2. Les Outils de Couverture : Options Puts & ETFs Inverses",
            text: "Plusieurs instruments financiers permettent de monétiser une baisse des indices généraux :",
            bullets: [
              "Achat d'Options Put : Donne le droit de vendre un indice ou une action à un cours fixé à l'avance. Si le marché s'effondre, la valeur du Put explose à la hausse et compense vos pertes.",
              "ETFs Inverses (Short ETFs) : Des fonds indiciels dont la valeur monte lorsque l'indice sous-jacent baisse (ex: si le CAC 40 perd -2%, l'ETF inverse gagne +2%).",
              "Attention aux coûts : Une couverture permanente coûte de l'argent (effet 'prime d'assurance'). Elle doit être utilisée avec parcimonie lors de surévaluations manifestes."
            ],
            illustration: "balance"
          },
          {
            title: "3. La Poche de Trésorerie Opportuniste (Dry Powder)",
            text: "La méthode de protection la plus saine et accessible pour un particulier reste la gestion rigoureuse de sa poche de liquidités (Dry Powder - poudre sèche).",
            bullets: [
              "Conserver 5% à 15% de liquidités rémunérées sur des supports sans risque (monétaire, livrets).",
              "En période de panique générale où les marchés dévissent de -25% à -40%, ces liquidités deviennent votre arme secrète pour acheter des entreprises d'exception à prix soldés.",
              "Ceux qui disposaient de cash en mars 2020 ont pu acheter des géants mondiaux avec des décotes historiques de 30% à 50%."
            ],
            illustration: "wallet"
          },
          {
            title: "4. La Checklist de Survie face à un Krach Boursier",
            text: "Lorsqu'une crise majeure frappe les marchés financiers, gardez cette checklist sous les yeux :",
            bullets: [
              "1. Interdiction formelle de vendre dans la panique : Les cours finiront par se rétablir comme lors de 100% des crises passées.",
              "2. Vérifiez la solvabilité de vos entreprises : Les sociétés rentables et peu endettées survivront et sortiront renforcées.",
              "3. Maintenez vos versements programmés (DCA) : C'est au fond du trou que vous achetez les parts les plus rentables de votre vie.",
              "4. Félicitations : Vous maîtrisez désormais l'intégralité du cursus financier de niveau 1 à 5 !"
            ],
            illustration: "target"
          }
        ],
        questions: [
          {
            id: "q_5_4_1",
            text: "En quoi consiste la stratégie de 'Hedging' (couverture de risque) en gestion de portefeuille ?",
            options: [
              "À emprunter de l'argent auprès de ses amis pour jouer au casino.",
              "À prendre une position protectrice inverse pour compenser et limiter les pertes de son portefeuille en cas de retournement brutal du marché.",
              "À masquer ses coordonnées personnelles auprès du courtier.",
              "À ne trader que les soirs de pleine lune."
            ],
            correctAnswerIndex: 1,
            explanation: "Le hedging agit comme un contrat d'assurance : il prend de la valeur lorsque les marchés chutent, amortissant la baisse de votre capital global."
          },
          {
            id: "q_5_4_2",
            text: "Qu'est-ce qu'un ETF 'Inverse' (ou Short ETF) ?",
            options: [
              "Un ETF qui ne fonctionne qu'en sens inverse des aiguilles d'une montre.",
              "Un fonds coté conçu pour progresser en valeur lorsque son indice de référence sous-jacent enregistre une baisse.",
              "Un compte d'épargne qui prélève 50% de frais par jour.",
              "Une action réservée aux entreprises d'habillement."
            ],
            correctAnswerIndex: 1,
            explanation: "Un ETF inverse délivre la performance opposée de son indice : si l'indice baisse de -3%, l'ETF inverse gagne environ +3% sur la séance."
          },
          {
            id: "q_5_4_3",
            text: "Que désigne l'expression financière 'Dry Powder' (poudre sèche) dans un portefeuille d'investissement ?",
            options: [
              "Une réserve de liquidités sécurisées conservée précieusement pour saisir des opportunités exceptionnelles d'achat lors des krachs boursiers.",
              "Un type de contrat d'assurance contre les incendies de bureaux.",
              "Des actions d'entreprises minières de sel.",
              "Une amende imposée par les régulateurs financiers."
            ],
            correctAnswerIndex: 0,
            explanation: "La 'poudre sèche' représente vos réserves de cash prêtes à être déployées sur des actions bradées lorsque le marché panique."
          },
          {
            id: "q_5_4_4",
            text: "Face à une panique boursière générale où les indices chutent brutalement, quelle est l'attitude recommandée ?",
            options: [
              "Vendre immédiatement toutes ses actions au creux de la vague pour cristalliser ses pertes.",
              "Garder son calme, ne pas céder à la peur, maintenir ses achats réguliers (DCA) et déployer progressivement ses liquidités sur des actifs de qualité décotés.",
              "Supprimer son compte bancaire et cacher ses économies dans son jardin.",
              "Prendre un effet de levier x100 par vengeance."
            ],
            correctAnswerIndex: 1,
            explanation: "Toutes les crises boursières de l'histoire ont été surmontées. Conserver son sang-froid et continuer d'investir au rabais est la clé des plus grandes réussites financières."
          }
        ]
      },
      {
        id: "l5_exam",
        title: "🎓 Grand Examen Final : Gestion du Risque & Stratégies Pro",
        description: "L'épreuve ultime de fin de cursus : Stop-Loss, levier contrôlé, DCA, rééquilibrage, hedging et gestion de krach.",
        xpReward: 800,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : Le Stop-Loss & La Règle d'Or des 1-2%",
            text: "La préservation du capital est la règle numéro un de tout investisseur professionnel.",
            bullets: [
              "Règle des 1% - 2% : Ne jamais risquer de perdre plus de 1% à 2% de son capital total sur une seule opération.",
              "Stop-Loss obligatoire : Couper impitoyablement les pertes avant qu'elles ne deviennent fatales.",
              "Effet de levier : Outil à double tranchant. Un levier x10 fait perdre 100% de la mise si le cours baisse de seulement 10%."
            ],
            illustration: "shield"
          },
          {
            title: "2. Révision : Dollar-Cost Averaging (DCA) & Rebalancement",
            text: "L'automatisation et la discipline mathématique écrasent la spéculation émotionnelle.",
            bullets: [
              "DCA (Investissement programmé) : Investir une somme fixe chaque mois, quel que soit le niveau des marchés, pour lisser son prix de revient unitaire.",
              "Rebalancement semestriel ou annuel : Réajuster ses poches (ex: 80% actions / 20% or-obligations) pour acheter bas et vendre haut automatiquement."
            ],
            illustration: "calendar"
          },
          {
            title: "3. Révision : Hedging & Triomphe en Période de Krach",
            text: "Les krachs ne sont pas des catastrophes, mais les plus grandes opportunités d'enrichissement de l'histoire pour les investisseurs préparés :",
            bullets: [
              "Couverture (Hedging) : Options Put ou ETFs inverses pour limiter la casse lors des phases de repli aiguës.",
              "Poudre sèche (Dry Powder) : Conserver 10% à 15% de liquidités pour racheter les leaders mondiaux à prix bradé quand tout le monde panique.",
              "Psychologie d'acier : Ne jamais vendre au creux de la vague."
            ],
            illustration: "rocket"
          },
          {
            title: "4. Consignes du Grand Examen Ultime",
            text: "Vous arrivez au terme de votre formation d'élite. 5 scénarios de crise et de stratégie avancée vous séparent du titre de Maître Boursier !",
            bullets: [
              "5 questions de synthèse de niveau expert.",
              "Rattrapage des erreurs à la fin du quiz.",
              "Validez ce grand examen pour décrocher 800 XP et finaliser l'intégralité du cursus boursier !"
            ],
            illustration: "award"
          }
        ],
        questions: [
          {
            id: "q_5_e_1",
            text: "Vous disposez d'un portefeuille total de 20 000€. En appliquant la règle professionnelle de gestion du risque de 1% de perte maximale par trade, combien pouvez-vous accepter de perdre au maximum si votre Stop-Loss est déclenché ?",
            options: [
              "200€ au maximum.",
              "10 000€.",
              "La totalité des 20 000€.",
              "5 000€."
            ],
            correctAnswerIndex: 0,
            explanation: "1% de 20 000€ = 200€. Limiter sa perte maximale à 200€ par trade garantit la survie et la longévité de votre capital sur des décennies."
          },
          {
            id: "q_5_e_2",
            text: "Si vous utilisez un effet de levier x5 sur une position de 1 000€ (exposition de 5 000€), quelle baisse du cours sous-jacent entraînera la perte totale (liquidation) de votre mise initiale ?",
            options: [
              "Une baisse de -20% seulement (20% x 5 = 100% de perte).",
              "Une baisse de -100%.",
              "Une baisse de -50%.",
              "Une baisse de -99%."
            ],
            correctAnswerIndex: 0,
            explanation: "Avec un levier de 5, une baisse de 20% anéantit 100% de votre marge initiale (5 x 20% = 100%). C'est pourquoi le levier sans Stop-Loss est fatal."
          },
          {
            id: "q_5_e_3",
            text: "Pourquoi la méthode du DCA (Dollar-Cost Averaging) est-elle considérée comme la stratégie la plus redoutable pour les investisseurs particuliers ?",
            options: [
              "Parce qu'elle élimine le besoin de deviner le 'bon moment' (Timing) et achète mathématiquement plus de parts quand les cours sont bas et moins quand ils sont hauts.",
              "Parce qu'elle vous dispense de payer des impôts pour toujours.",
              "Parce qu'elle permet d'emprunter sans jamais rembourser.",
              "Parce qu'elle ne fonctionne que sur le marché de l'or."
            ],
            correctAnswerIndex: 0,
            explanation: "Le DCA élimine le stress psychologique et transforme la volatilité boursière en alliée en abaissant continuellement votre coût moyen d'acquisition."
          },
          {
            id: "q_5_e_4",
            text: "Lors d'un violent krach boursier où les marchés s'effondrent de -35% dans la panique générale, quelle est la démarche des investisseurs les plus chevronnés ?",
            options: [
              "Garder son sang-froid, poursuivre son plan de DCA et déployer méthodiquement sa 'poudre sèche' (liquidités) sur des entreprises championnes bradées.",
              "Vendre tout dans la précipitation et clôturer son compte.",
              "Emprunter le maximum avec un levier x100 sur des cryptos inconnues.",
              "Attendre que la bourse remonte au sommet pour racheter plus cher."
            ],
            correctAnswerIndex: 0,
            explanation: "Les krachs sont les soldes des marchés financiers. Acheter des entreprises exceptionnelles à prix bradé génère les plus fortes plus-values lors des rebonds économiques."
          },
          {
            id: "q_5_e_5",
            text: "En quoi consiste le 'rebalancement périodique' d'un portefeuille diversifié (ex: cible 80% actions / 20% obligations) ?",
            options: [
              "Vendre une petite part des actifs qui ont fortement monté pour racheter les actifs en retard, forçant ainsi à vendre haut et acheter bas mécaniquement.",
              "Changer de courtier tous les lundis matin.",
              "Supprimer toutes les actions pour acheter uniquement des devises.",
              "Réinvestir uniquement dans les actions qui ont perdu 99%."
            ],
            correctAnswerIndex: 0,
            explanation: "Le rebalancement réaligne les proportions de risque et applique de manière systématique le principe fondamental : sécuriser les gains sur les hausses et renforcer les actifs décotés."
          }
        ]
      }
    ]
  },
  {
    id: "mod6",
    title: "Niveau 6 : Barre d'Analyse Graphique & Stratégies Techniques",
    description: "Apprenez à utiliser la barre d'outils d'analyse intégrée au graphique pour tracer des supports/résistances, des canaux, Fibonacci et élaborer des stratégies de trading professionnelles.",
    lessons: [
      {
        id: "l6_1",
        title: "Découvrir la Barre d'Analyse : Outils & Navigation",
        description: "Apprenez à localiser la barre d'outils sur le graphique, basculer entre mode compact et étendu, et tracer vos premiers niveaux de support.",
        xpReward: 450,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Où trouver la Barre d'Analyse sur la plateforme ?",
            text: "La barre d'analyse technique est directement superposée en haut à gauche de chaque graphique interactif (sur le Simulateur et les fiches d'actions).",
            bullets: [
              "Mode Compact vs Étendu : Cliquez sur la petite flèche (chevron) pour déplier le panneau complet avec les 7 catégories d'outils professionnels.",
              "Toujours accessible : La barre reste disponible pendant que vous zoomez, changez de période (1J, 1S, 1M, 1A) ou observez les cours en direct.",
              "Sauvegarde locale : Vos tracés et analyses restent mémorisés sur l'action sélectionnée pour vous permettre de suivre vos scénarios dans le temps."
            ],
            illustration: "target",
            imageUrl: "/src/assets/images/chart_toolbar_guide_1787101460736.jpg",
            imageCaption: "Emplacement de la barre d'outils d'analyse sur le graphique",
            diagramType: "toolbar_overview"
          },
          {
            title: "2. Les Outils Fondamentaux : Curseur, Pan & Lignes",
            text: "Les deux premières catégories de la barre contiennent les instruments de base indispensables pour cartographier le marché :",
            bullets: [
              "Curseur de sélection (Flèche) : Permet de cliquer sur n'importe quel tracé existant pour le modifier, changer sa couleur ou le supprimer.",
              "Déplacer (Main / Pan) : Permet de glisser le graphique horizontalement pour analyser l'historique passé des cours.",
              "Ligne Horizontale : Outil numéro un pour tracer en un clic les niveaux de support (planchers) et de résistance (plafonds psychologiques).",
              "Ligne de Tendance & Rayon : Permet de relier les creux croissants pour matérialiser la pente d'une tendance haussière ou baissière."
            ],
            illustration: "trend"
          },
          {
            title: "3. Palette de Couleurs, Actions Rapides & Capture d'Écran",
            text: "Une bonne analyse graphique doit être lisible instantanément grâce à un code couleur rigoureux :",
            bullets: [
              "Code couleur pro recommandé : Vert pour les supports d'achat, Rouge pour les résistances et Stop-Loss, Doré/Bleu pour Fibonacci.",
              "Annuler / Rétablir (Undo/Redo) : Corrigez vos tracés immédiatement en cas d'erreur de clic.",
              "Cadenas (Verrouiller tout) : Protège l'ensemble de vos dessins pour éviter de les décaler involontairement lors du survol de la souris.",
              "Appareil photo (Screenshot) : Génère un instantané net de votre graphique analysé prêt à être archivé dans votre journal d'investisseur."
            ],
            illustration: "speed"
          },
          {
            title: "4. Cas Pratique : Tracer son Premier Support & Résistance",
            text: "Pour définir le cadre de jeu d'une action, repérez les points de contact majeurs où les cours ont déjà rebondi au moins deux fois :",
            bullets: [
              "Support horizontal (Vert) : Cliquez sur l'outil Ligne Horizontale, puis posez la ligne sur le niveau où les acheteurs reprennent la main.",
              "Résistance horizontale (Rouge) : Posez la ligne sur le sommet où les vendeurs provoquent des prises de bénéfices.",
              "Règle de polarité : Lorsqu'une résistance est franchie à la hausse avec force, elle devient automatiquement le nouveau support !"
            ],
            illustration: "balance",
            diagramType: "support_resistance"
          }
        ],
        questions: [
          {
            id: "q_6_1_1",
            text: "Où se situe la barre d'outils d'analyse technique sur la plateforme financière ?",
            options: [
              "En haut à gauche du graphique boursier interactif, avec un bouton pour basculer entre mode compact et panneau étendu.",
              "Tout en bas du footer du site web dans les mentions légales.",
              "Uniquement dans les e-mails de notification.",
              "Dans le menu des paramètres du navigateur."
            ],
            correctAnswerIndex: 0,
            explanation: "La barre d'analyse est positionnée directement en haut à gauche du graphique pour vous permettre de tracer vos analyses sans quitter la courbe des yeux."
          },
          {
            id: "q_6_1_2",
            text: "Quel outil de la barre d'analyse devez-vous sélectionner en priorité pour tracer un plancher d'achat ou un plafond de vente horizontal infini ?",
            options: [
              "L'outil 'Ligne Horizontale' dans le groupe Lignes & Tendances.",
              "L'outil 'Gomme'.",
              "L'outil 'Triangle'.",
              "L'outil 'Pinceau libre' en zigzag."
            ],
            correctAnswerIndex: 0,
            explanation: "L'outil 'Ligne Horizontale' permet de poser instantanément un niveau de prix clé continu sur toute la largeur temporelle du graphique."
          },
          {
            id: "q_6_1_3",
            text: "À quoi sert le bouton avec l'icône de Cadenas dans la barre d'analyse graphique ?",
            options: [
              "À verrouiller tous les tracés et annotations pour éviter de les déplacer ou les modifier par accident en naviguant.",
              "À bloquer votre compte bancaire.",
              "À empêcher le cours de l'action de baisser.",
              "À masquer définitivement le graphique."
            ],
            correctAnswerIndex: 0,
            explanation: "Le verrouillage est une fonction clé des traders professionnels pour figer leurs figures chartistes pendant qu'ils étudient le carnet d'ordres."
          },
          {
            id: "q_6_1_4",
            text: "Que signifie la 'Règle de polarité' lorsqu'une résistance majeure est cassée avec force vers le haut ?",
            options: [
              "L'ancienne résistance traversée devient généralement le nouveau support sur lequel les cours viendront rebondir.",
              "L'action est automatiquement radiée de la bourse.",
              "Les cours doivent immédiatement chuter à zéro.",
              "Le graphique s'inverse de droite à gauche."
            ],
            correctAnswerIndex: 0,
            explanation: "La polarité est un principe technique universel : une fois franchie, la zone où les vendeurs bloquaient le cours devient une zone où les acheteurs défendent leurs gains."
          }
        ]
      },
      {
        id: "l6_2",
        title: "Formes Géométriques, Canaux & Stratégie de Breakout",
        description: "Utilisez les rectangles de consolidation, les canaux parallèles et les triangles pour identifier les cassures de volatilité et les pullbacks.",
        xpReward: 500,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Les Formes Géométriques : Rectangles, Cercles & Triangles",
            text: "La troisième catégorie de la barre regroupe les formes géométriques pour cadrer visuellement la dynamique du marché :",
            bullets: [
              "Rectangle (Zone de Range) : Permet de délimiter une zone d'accumulation ou de distribution où le prix oscille entre deux bornes resserrées.",
              "Cercle / Ellipse : Idéal pour entourer et mettre en évidence les fausses cassures (bull traps / bear traps) ou les signaux de volume majeurs.",
              "Triangle & Polygone : Utilisé pour tracer les figures de compression chartiste (triangles symétriques, ascendants ou descendants)."
            ],
            illustration: "basket",
            imageUrl: "/src/assets/images/chart_breakout_strategy_1787101474267.jpg",
            imageCaption: "Canal parallèle haussier & Stratégie de cassure de range"
          },
          {
            title: "2. Maîtriser le Canal Parallèle sur la Plateforme",
            text: "Le Canal Parallèle est l'un des outils les plus puissants pour trader les tendances de fond régulières :",
            bullets: [
              "Comment le tracer : Sélectionnez 'Canal Parallèle', cliquez sur un premier creux, reliez un deuxième creux pour donner la pente, puis étirez la ligne vers le sommet opposé.",
              "Borne inférieure (Support oblique) : Zone d'achat idéale avec un risque très serré.",
              "Borne supérieure (Résistance oblique) : Zone de prise de bénéfices partielle.",
              "Ligne médiane (Pointillé) : Sert de niveau d'équilibre intermédiaire."
            ],
            illustration: "trend",
            diagramType: "channels_range"
          },
          {
            title: "3. La Stratégie du Breakout & Pullback",
            text: "Lorsque le prix sort violemment d'un rectangle ou d'un triangle tracé avec la barre, une opportunité d'achat à fort potentiel se crée :",
            bullets: [
              "Étape 1 - Le Breakout : Le cours casse la borne haute du rectangle avec une bougie impulsive et un volume en forte hausse.",
              "Étape 2 - Le Pullback (Retest) : Le cours revient tester l'ancienne résistance du rectangle, qui fait désormais office de support.",
              "Étape 3 - L'Entrée : On achète sur le rebond du pullback en plaçant son Stop-Loss juste à l'intérieur du rectangle pour un risque minimal."
            ],
            illustration: "speed"
          },
          {
            title: "4. Annotations Libres avec le Pinceau & Surligneur",
            text: "La catégorie 'Dessin libre' vous donne toute liberté pour schématiser vos projections de scénarios :",
            bullets: [
              "Pinceau libre : Dessinez des flèches manuscrites ou le chemin prévisionnel anticipé des vagues d'Elliott.",
              "Surligneur : Mettez en avant les zones d'intérêt institutionnelles avec une couleur translucide sans masquer les chandeliers sous-jacents.",
              "Gomme : Supprimez d'un geste n'importe quel trait manuscrit sans toucher aux lignes de tendance principales."
            ],
            illustration: "sparkles"
          }
        ],
        questions: [
          {
            id: "q_6_2_1",
            text: "Quel outil de la barre d'analyse est le plus adapté pour encadrer une phase où les cours oscillent horizontalement entre deux seuils (range) ?",
            options: [
              "L'outil 'Rectangle' dans la catégorie Formes géométriques.",
              "L'outil 'Ligne verticale'.",
              "L'outil 'Cercle' minuscule.",
              "L'outil 'Emoji'."
            ],
            correctAnswerIndex: 0,
            explanation: "L'outil Rectangle permet de colorer et d'encadrer parfaitement la zone de consolidation entre support et résistance."
          },
          {
            id: "q_6_2_2",
            text: "Dans une stratégie de trading de 'Breakout' (cassure), qu'appelle-t-on le 'Pullback' ?",
            options: [
              "Le repli temporaire des cours venant retester l'ancien plafond cassé avant de repartir à la hausse.",
              "Une panne des serveurs du courtier.",
              "Le versement d'un dividende exceptionnel.",
              "L'annulation rétroactive de tous les ordres de bourse."
            ],
            correctAnswerIndex: 0,
            explanation: "Le pullback est le mouvement de retour qui valide que l'ancien niveau de résistance s'est bien transformé en support protecteur."
          },
          {
            id: "q_6_2_3",
            text: "Comment se trace un 'Canal Parallèle' sur le graphique avec la barre d'outils ?",
            options: [
              "En reliant deux creux successifs pour fixer la pente, puis en étirant la largeur vers le sommet situé entre eux.",
              "En cliquant au hasard sur les boutons du clavier.",
              "En traçant un cercle autour du logo de l'entreprise.",
              "En faisant une ligne verticale à midi."
            ],
            correctAnswerIndex: 0,
            explanation: "Le canal parallèle se construit en 3 points d'ancrage : 2 points sur la ligne de tendance de référence et 1 point pour définir l'écartement de la ligne parallèle."
          },
          {
            id: "q_6_2_4",
            text: "Pourquoi est-il avantageux d'entrer en position sur le 'Pullback' plutôt que d'acheter à l'aveugle pendant la cassure initiale ?",
            options: [
              "Parce que cela permet de confirmer le rebond et de placer un Stop-Loss beaucoup plus serré, maximisant le ratio gain/risque.",
              "Parce que les actions deviennent gratuites pendant le pullback.",
              "Parce que le marché ferme pendant le pullback.",
              "Parce que cela supprime les taxes boursières."
            ],
            correctAnswerIndex: 0,
            explanation: "Attendre le retest protège contre les fausses cassures (bull traps) et optimise le prix d'entrée au plus près de la zone de sécurité."
          }
        ]
      },
      {
        id: "l6_3",
        title: "Maîtriser les Outils Fibonacci (Retracement & Extension)",
        description: "Utilisez les ratios du nombre d'or (38.2%, 50%, 61.8%) pour repérer les zones de retournement institutionnelles et calculer vos objectifs de cours.",
        xpReward: 550,
        durationMinutes: 5,
        slides: [
          {
            title: "1. Qu'est-ce que le Retracement de Fibonacci sur le Graphique ?",
            text: "L'outil Retracement Fibonacci (situé sous l'icône Layers dans la barre) applique les ratios de la suite de Fibonacci aux mouvements de cours.",
            bullets: [
              "Origine mathématique : Issu des proportions du nombre d'or (Phi = 1.618), ce principe est massivement programmé dans les algorithmes de trading des banques d'investissement.",
              "Comment l'appliquer : Cliquez sur le creux de départ de l'impulsion (Swing Low), puis glissez et relâchez sur le sommet de l'impulsion (Swing High).",
              "Tracé automatique : La barre d'analyse calcule et affiche instantanément les lignes horizontales correspondant aux ratios 23.6%, 38.2%, 50.0%, 61.8% et 78.6%."
            ],
            illustration: "company",
            imageUrl: "/src/assets/images/chart_fibonacci_strategy_1787101491955.jpg",
            imageCaption: "Niveaux de retracement Fibonacci & Rebond sur la Golden Pocket 61.8%"
          },
          {
            title: "2. Les Ratios Clés & La « Golden Pocket » (61.8% - 65%)",
            text: "Chaque niveau de Fibonacci correspond à une intensité différente de la dynamique de marché :",
            bullets: [
              "38.2% : Repli superficiel caractéristique des tendances extrêmement puissantes où les acheteurs ne laissent pas le prix respirer.",
              "50.0% : Seuil médian psychologique de rééquilibrage de l'offre et de la demande.",
              "61.8% - 65.0% (La Golden Pocket) : La zone reine de retracement. C'est ici que le ratio mathématique offre la plus haute probabilité de rebond explosif.",
              "78.6% : Dernier rempart avant l'invalidation complète du mouvement haussier."
            ],
            illustration: "dividend",
            diagramType: "fibonacci_levels"
          },
          {
            title: "3. La Stratégie de Confluence : Fibonacci + Support Horizontal",
            text: "Le secret des analystes chevronnés est de ne jamais trader Fibonacci de manière isolée, mais de chercher une confluence :",
            bullets: [
              "Définition de la confluence : C'est la superposition exacte d'au moins deux signaux techniques indépendants sur le même niveau de prix.",
              "Exemple type : Lorsque le niveau 61.8% de Fibonacci coïncide à l'euro près avec un ancien sommet horizontal ou la borne basse d'un canal parallèle.",
              "Avantage compétitif : La probabilité statistique de succès du rebond est décuplée car des milliers d'opérateurs ciblent ce même niveau."
            ],
            illustration: "target"
          },
          {
            title: "4. L'Extension de Fibonacci : Fixer ses Objectifs de Sortie",
            text: "Après un rebond validé sur la Golden Pocket, utilisez l'outil Extension Fibonacci pour déterminer où prendre vos bénéfices :",
            bullets: [
              "Extension 127.2% : Premier objectif de gain lors du dépassement du précédent sommet.",
              "Extension 161.8% (Le Ratio d'Or étendu) : Objectif majeur où les grandes institutions débouclent massivement leurs positions gagnantes.",
              "Discipline : Vendez 50% de votre position sur le niveau 127.2% et laissez courir le solde vers 161.8% en remontant votre Stop-Loss !"
            ],
            illustration: "rocket"
          }
        ],
        questions: [
          {
            id: "q_6_3_1",
            text: "Comment applique-t-on correctement l'outil de 'Retracement Fibonacci' sur une impulsion haussière avec la barre d'analyse ?",
            options: [
              "En cliquant sur le point le plus bas (Swing Low) puis en étirant l'outil jusqu'au sommet le plus haut (Swing High).",
              "En cliquant au centre du graphique sans regarder les cours.",
              "En traçant une ligne de droite à gauche sur la moyenne mobile.",
              "En mesurant le volume des transactions avec une règle."
            ],
            correctAnswerIndex: 0,
            explanation: "Le retracement se mesure toujours dans le sens du mouvement : du point d'origine de l'impulsion vers son sommet d'extinction."
          },
          {
            id: "q_6_3_2",
            text: "Quelle zone de retracement de Fibonacci est surnommée la 'Golden Pocket' (zone d'or) par les investisseurs professionnels ?",
            options: [
              "La zone comprise entre 61.8% et 65.0%.",
              "La zone des 0.5%.",
              "La zone des 99.9%.",
              "La zone des 10.0%."
            ],
            correctAnswerIndex: 0,
            explanation: "Le ratio 61.8% découle directement du nombre d'or. C'est la zone où la rentabilité du rebond par rapport au risque de Stop-Loss est maximale."
          },
          {
            id: "q_6_3_3",
            text: "En analyse technique, qu'appelle-t-on une 'Confluence' sur un graphique ?",
            options: [
              "La rencontre sur un même niveau de prix de plusieurs indicateurs concordants (ex: un niveau Fibonacci 61.8% aligné avec un support horizontal).",
              "Une dispute entre deux courtiers en bourse.",
              "La fermeture simultanée de toutes les places financières mondiales.",
              "L'effacement automatique de toutes vos annotations."
            ],
            correctAnswerIndex: 0,
            explanation: "La confluence réunit plusieurs arguments graphiques indépendants au même endroit, ce qui renforce considérablement la fiabilité du signal."
          },
          {
            id: "q_6_3_4",
            text: "À quoi sert principalement l'outil 'Extension de Fibonacci' après avoir acheté sur un rebond ?",
            options: [
              "À projeter mathématiquement les prochains objectifs de cours (ex: 161.8%) pour planifier ses prises de bénéfices.",
              "À calculer le montant des impôts sur la plus-value.",
              "À modifier le cours de clôture de l'action.",
              "À changer la devise de son portefeuille."
            ],
            correctAnswerIndex: 0,
            explanation: "L'extension Fibonacci calcule les cibles de prix supérieures où les cours sont susceptibles d'atteindre une zone de surachat et de consolidation."
          }
        ]
      },
      {
        id: "l6_4",
        title: "Élaborer un Plan de Trading Complet avec les Annotations",
        description: "Intégrez étiquettes de prix exactes, notes de stratégie, balises Stop-Loss / Take-Profit et maîtrisez le ratio Risque/Rendement (R:R).",
        xpReward: 600,
        durationMinutes: 5,
        slides: [
          {
            title: "1. La Boîte à Outils d'Annotation & Équiquettes",
            text: "La 6ème catégorie de la barre d'analyse transforme votre graphique en un véritable carnet de bord stratégique :",
            bullets: [
              "Outil Texte (T) : Rédigez le résumé de votre thèse d'investissement directement sur le graphique (ex: 'Rebond sur support + Résultats T3 attendus').",
              "Note informative (StickyNote) : Créez une bulle mémo avec fond coloré pour surligner un événement (ex: 'Publication résultats le 24 octobre').",
              "Étiquette de Prix (Tag) : Posez des pastilles de prix précises pour repérer votre cours d'entrée, votre Stop-Loss et votre objectif.",
              "Sélecteur d'Emojis : Placez des marqueurs visuels expressifs (🎯 Objectif, 🛑 Stop-Loss, 🚀 Cassure, 🐂 Signal haussier, 🐻 Signal baissier)."
            ],
            illustration: "mind",
            imageUrl: "/src/assets/images/chart_trading_plan_setup_1787101507031.jpg",
            imageCaption: "Plan de trading complet avec Stop-Loss et Take-Profit calibrés"
          },
          {
            title: "2. Construire son Setup : Entrée, Stop-Loss & Take-Profit",
            text: "Avant d'ouvrir la moindre position dans le simulateur, vous devez impérativement matérialiser les 3 balises de votre plan :",
            bullets: [
              "1. Balise d'Entrée (Bleue) : Le prix exact auquel votre ordre d'achat doit être exécuté.",
              "2. Balise Stop-Loss (Rouge) : Placée juste en dessous du dernier creux ou support pour couper automatiquement la perte si le scénario est invalidé.",
              "3. Balise Take-Profit (Verte) : Placée sur la résistance majeure ou le niveau d'extension Fibonacci pour encaisser les gains."
            ],
            illustration: "target",
            diagramType: "trading_plan"
          },
          {
            title: "3. Calculer et Exiger un Ratio Risque/Rendement (R:R) ≥ 1:2",
            text: "Le ratio Risque/Rendement (R:R) est l'équation mathématique qui garantit votre rentabilité à long terme même avec seulement 40% de trades gagnants :",
            bullets: [
              "Formule : Gain potentiel (Distance Entrée -> Take Profit) / Risque maximal (Distance Entrée -> Stop Loss).",
              "Exemple concret : Entrée à 100€, Stop-Loss à 95€ (Risque = 5€), Take-Profit à 115€ (Gain = 15€). Ratio R:R = 15€ / 5€ = 1:3 (ou 3.0).",
              "Règle de fer : Si le graphique ne vous offre pas au minimum un ratio R:R de 1:2, ne prenez pas le trade !"
            ],
            illustration: "balance"
          },
          {
            title: "4. Sauvegarder, Verrouiller et Archiver son Analyse",
            text: "La pérennité de votre méthode repose sur la discipline et le suivi de vos analyses :",
            bullets: [
              "Verrouiller avec le cadenas : Évite toute fausse manipulation lorsque vous faites défiler les historiques ou inspectez les volumes.",
              "Masquer / Afficher (Œil) : Permet de masquer temporairement tous vos tracés pour réexaminer le graphique avec un regard neuf.",
              "Capture d'écran HD : Exportez l'image de votre analyse complète pour la coller dans votre journal de trading et mesurer vos progrès."
            ],
            illustration: "alarm"
          }
        ],
        questions: [
          {
            id: "q_6_4_1",
            text: "Quels sont les 3 niveaux de prix indispensables à matérialiser sur le graphique avec les outils d'étiquettes avant de prendre un trade ?",
            options: [
              "Le prix d'entrée, le prix du Stop-Loss de protection et le prix du Take-Profit (objectif de gain).",
              "L'heure du déjeuner, le cours du dollar et la météo.",
              "Uniquement le prix d'achat, le reste n'a pas d'importance.",
              "Le cours de l'or en 1920."
            ],
            correctAnswerIndex: 0,
            explanation: "Définir son entrée, sa sortie de secours (Stop-Loss) et son objectif de gain (Take-Profit) avant d'entrer élimine totalement le stress émotionnel."
          },
          {
            id: "q_6_4_2",
            text: "Vous achetez une action à 50€. Votre Stop-Loss est fixé à 48€ (risque = 2€) et votre Take-Profit est fixé à 56€ (gain potentiel = 6€). Quel est le ratio Risque/Rendement (R:R) de ce setup ?",
            options: [
              "1 : 3.0 (Vous risquez 1€ pour viser 3€ de gain).",
              "1 : 1.0.",
              "1 : 0.5.",
              "1 : 100."
            ],
            correctAnswerIndex: 0,
            explanation: "Gain potentiel (6€) divisé par Risque maximal (2€) = 3. C'est un excellent ratio R:R de 1:3 qui respecte parfaitement les standards professionnels."
          },
          {
            id: "q_6_4_3",
            text: "Pourquoi un investisseur utilisant un ratio Risque/Rendement moyen de 1:3 reste-t-il largement rentable même s'il ne réussit que 40% de ses opérations ?",
            options: [
              "Parce que ses gains sur les 40% de trades gagnants (ex: 4 x +300€ = +1200€) dépassent largement ses pertes sur les 60% de trades perdants (6 x -100€ = -600€), soit un profit net de +600€.",
              "Parce que la banque lui rembourse ses trades perdants.",
              "Parce que les cours ne peuvent jamais baisser deux fois d'affilée.",
              "Parce qu'il utilise un effet de levier sans le déclarer."
            ],
            correctAnswerIndex: 0,
            explanation: "Avec un bon ratio R:R, vous n'avez pas besoin d'avoir raison tout le temps pour vous enrichir : vos gains moyens sont 3 fois supérieurs à vos pertes moyennes."
          },
          {
            id: "q_6_4_4",
            text: "À quoi sert le bouton avec l'icône d'Appareil Photo (Camera) situé au bas de la barre d'analyse ?",
            options: [
              "À prendre une capture d'écran nette et professionnelle de votre graphique annoté pour l'archiver dans votre journal de trading.",
              "À activer la webcam de votre ordinateur.",
              "À scanner votre carte d'identité.",
              "À imprimer le graphique sur papier physique."
            ],
            correctAnswerIndex: 0,
            explanation: "L'outil de capture permet d'immortaliser vos configurations graphiques pour faire des bilans post-trade et perfectionner vos stratégies."
          }
        ]
      },
      {
        id: "l6_exam",
        title: "🎓 Grand Examen Final : Maîtrise de la Barre d'Analyse & Stratégies Pro",
        description: "L'épreuve de synthèse complète : manipulez l'ensemble des 7 catégories d'outils, identifiez les figures et validez vos plans de trading.",
        xpReward: 900,
        durationMinutes: 5,
        isExam: true,
        slides: [
          {
            title: "1. Révision : Les 7 Catégories de la Barre d'Outils",
            text: "Faites le point sur l'arsenal complet mis à votre disposition sur les graphiques de la plateforme :",
            bullets: [
              "1. Curseur & Navigation : Sélectionner, modifier, supprimer ou glisser (Pan).",
              "2. Lignes & Tendances : Segments, Lignes Horizontales/Verticales, Rayons et Flèches.",
              "3. Formes Géométriques : Rectangles de range, Cercles de fausses cassures, Triangles de compression.",
              "4. Canaux & Régression : Canaux parallèles ascendants et descendants.",
              "5. Fibonacci : Retracement (niveaux d'or 38.2%, 50%, 61.8%) et Extensions (127.2%, 161.8%).",
              "6. Annotations & Étiquettes : Textes, Notes autocollantes, Pastilles de prix et Emojis cibles.",
              "7. Dessin libre & Actions : Pinceaux, Surligneurs, Undo/Redo, Verrouillage Cadenas et Capture d'écran."
            ],
            illustration: "company",
            diagramType: "toolbar_overview"
          },
          {
            title: "2. Révision : La Stratégie de Confluence Support + Fibonacci 61.8%",
            text: "Le combo d'analyse technique le plus redoutable pour entrer en position au moment parfait :",
            bullets: [
              "1. Tracer une Ligne Horizontale verte sur le support historique majeur de l'actif.",
              "2. Appliquer l'outil Retracement Fibonacci du creux vers le sommet de la vague haussière.",
              "3. Vérifier que la Golden Pocket (61.8% - 65%) s'aligne exactement avec votre support horizontal.",
              "4. Poser une étiquette de prix d'achat sur cette zone de confluence."
            ],
            illustration: "dividend",
            diagramType: "fibonacci_levels"
          },
          {
            title: "3. Révision : Stratégie de Breakout de Canal & Ratio R:R ≥ 1:2",
            text: "Comment exploiter les sorties de range sans tomber dans les pièges de marché :",
            bullets: [
              "1. Cadrer la phase d'hésitation avec l'outil Rectangle ou Canal Parallèle.",
              "2. Ne pas courir après la première bougie de cassure : attendre le pullback sur l'ancienne résistance devenue support.",
              "3. Positionner l'étiquette Stop-Loss juste sous la borne cassée (sécurité maximale).",
              "4. Viser la borne haute ou l'extension 161.8% pour garantir un ratio Risque/Rendement supérieur ou égal à 1:2."
            ],
            illustration: "rocket",
            diagramType: "channels_range"
          },
          {
            title: "4. Consignes du Grand Examen de Validation Graphique",
            text: "Vous vous apprêtez à passer l'examen final de validation du Niveau 6. Démontrez votre maîtrise complète des outils d'analyse !",
            bullets: [
              "5 questions de synthèse pratique portant sur la barre d'outils et les stratégies de trading.",
              "Système de rattrapage en fin de quiz en cas d'erreur.",
              "Obtenez 900 XP et débloquez la maîtrise totale de l'analyse technique sur la plateforme !"
            ],
            illustration: "award"
          }
        ],
        questions: [
          {
            id: "q_6_e_1",
            text: "Dans quel menu de la barre d'analyse trouvez-vous l'outil permettant de tracer automatiquement les niveaux de 38.2%, 50% et la Golden Pocket 61.8% ?",
            options: [
              "Dans la catégorie 'Outils Fibonacci' (icône Layers).",
              "Dans la catégorie 'Curseur & Navigation'.",
              "Dans la catégorie 'Dessin libre'.",
              "Dans la liste des actualités financières."
            ],
            correctAnswerIndex: 0,
            explanation: "Les retracements et extensions mathématiques se trouvent directement dans le groupe d'outils Fibonacci de la barre d'analyse."
          },
          {
            id: "q_6_e_2",
            text: "Vous observez une action qui évolue à l'intérieur d'un canal ascendant tracé avec l'outil 'Canal Parallèle'. Quel est le comportement technique optimal ?",
            options: [
              "Chercher des opportunités d'achat lorsque le cours touche la borne basse du canal (support), et alléger sa position vers la borne haute (résistance).",
              "Vendre tout à découvert sur la borne basse et racheter sur la borne haute.",
              "Fermer son ordinateur et ne plus toucher au compte.",
              "Supprimer le graphique."
            ],
            correctAnswerIndex: 0,
            explanation: "La borne basse d'un canal ascendant constitue un support dynamique à fort potentiel d'achat avec un Stop-Loss très proche sous le canal."
          },
          {
            id: "q_6_e_3",
            text: "Pourquoi le niveau 61.8% de Fibonacci est-il particulièrement puissant lorsqu'il coïncide avec une 'Ligne Horizontale' de support tracée précédemment ?",
            options: [
              "Parce qu'il s'agit d'une zone de 'Confluence' où plusieurs signaux techniques indépendants convergent, décuplant les probabilités de rebond haussier.",
              "Parce que la bourse rembourse automatiquement les achats à ce niveau.",
              "Parce que les transactions y sont exonérées de frais.",
              "Parce que les ordinateurs arrêtent de coter l'action."
            ],
            correctAnswerIndex: 0,
            explanation: "La confluence technique regroupe les acheteurs fondamentaux et les algorithmes quantitatifs sur le même prix, créant une puissante barrière de rebond."
          },
          {
            id: "q_6_e_4",
            text: "Avant d'exécuter un achat sur une cassure de rectangle (Breakout), vous calculez votre plan : Risque Stop-Loss = 4€ par action, Gain potentiel Take-Profit = 12€ par action. Devez-vous valider ce trade ?",
            options: [
              "Oui absolument, car le ratio Risque/Rendement est de 1:3 (12€ / 4€ = 3.0), ce qui dépasse largement le seuil d'exigence minimal de 1:2.",
              "Non, car il ne faut jamais viser plus de 1€ de gain.",
              "Non, car le Stop-Loss est interdit par le régulateur.",
              "Oui uniquement si l'action fait partie du CAC 40."
            ],
            correctAnswerIndex: 0,
            explanation: "Un ratio R:R de 3.0 est exceptionnel et représente le type de configuration asymétrique à privilégier absolument dans tout plan de trading."
          },
          {
            id: "q_6_e_5",
            text: "Quelle fonctionnalité de la barre d'analyse vous permet de protéger l'intégrité de vos figures complexes (canaux, Fibonacci, tags) contre les clics accidentels pendant vos sessions de trading ?",
            options: [
              "Le bouton de 'Verrouillage' (icône Cadenas) qui fige tous les éléments graphiques.",
              "Le bouton 'Effacer tout'.",
              "Le bouton de zoom arrière.",
              "Le changement de couleur d'arrière-plan."
            ],
            correctAnswerIndex: 0,
            explanation: "Le verrouillage global par cadenas est la méthode éprouvée pour naviguer, zoomer et passer des ordres sur le graphique sans risquer de déplacer une ligne de support critique."
          }
        ]
      }
    ]
  }
];
