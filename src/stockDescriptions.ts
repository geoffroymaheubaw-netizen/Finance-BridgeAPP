import { Language } from "./translations";

export const STOCK_DESCRIPTIONS: Record<string, Record<Language, string>> = {
  AAPL: {
    fr: "Apple conçoit, fabrique et commercialise des smartphones, des ordinateurs personnels, des tablettes, des accessoires et des services connexes dans le monde entier.",
    en: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, accessories, and a wide variety of related services globally.",
    pt: "A Apple projeta, fabrica e comercializa smartphones, computadores pessoais, tablets, acessórios e serviços conexos em todo o mundo.",
    es: "Apple diseña, fabrica y comercializa teléfonos inteligentes, ordenadores personales, tabletas, accesorios y servicios relacionados en todo el mundo.",
    de: "Apple entwickelt, produziert und vertreibt weltweit Smartphones, PCs, Tablets, Wearables, Zubehör und damit verbundene digitale Dienste.",
    zh: "蘋果公司在全球範圍內設計、製造並銷售智慧型手機、個人電腦、平板電腦、穿戴式設備、配件及相關數位服務。"
  },
  MSFT: {
    fr: "Microsoft développe, concède sous licence et prend en charge des logiciels, des services, des appareils et des solutions dans le monde entier. Leader de l'IA via son partenariat avec OpenAI.",
    en: "Microsoft develops, licenses, and supports software, services, devices, and cloud solutions worldwide. AI leader through its strategic alliance with OpenAI.",
    pt: "A Microsoft desenvolve, licencia e dá suporte a softwares, serviços, dispositivos e soluções de nuvem em todo o mundo. Líder em IA via parceria com a OpenAI.",
    es: "Microsoft desarrolla, licencia y respalda software, servicios, dispositivos y soluciones en la nube en todo el mundo. Líder en IA a través de su alianza con OpenAI.",
    de: "Microsoft entwickelt, lizenziert und unterstützt Software, Clouddienste, Geräte und IT-Lösungen weltweit. Führend im Bereich KI durch die Kooperation mit OpenAI.",
    zh: "微軟在全球開發、授權並支援軟體、服務、裝置及雲端解決方案，並透過與 OpenAI 的合作引領人工智慧變革。"
  },
  NVDA: {
    fr: "NVIDIA conçoit des processeurs graphiques (GPU) pour les marchés du jeu vidéo et des professionnels, ainsi que des systèmes sur puce pour l'informatique mobile et l'automobile. Pilier central de l'IA moderne.",
    en: "NVIDIA designs graphics processing units (GPUs) for gaming and professional markets, as well as system-on-chips for mobile computing and automotive. The primary foundation of modern AI.",
    pt: "A NVIDIA projeta processadores gráficos (GPUs) para jogos e mercados profissionais, além de chips para computação móvel e automotiva. Pilar central da IA moderna.",
    es: "NVIDIA diseña unidades de procesamiento gráfico (GPU) para videojuegos y entornos profesionales, además de chips para computación móvil y automotriz. Pilar de la IA moderna.",
    de: "NVIDIA entwickelt Grafikprozessoren (GPUs) für Gaming- und Profimärkte sowie Chipsysteme für Mobilgeräte und die Autoindustrie. Zentraler Pfeiler moderner KI.",
    zh: "輝達（NVIDIA）專門設計用於遊戲和專業市場的圖形處理器（GPU），以及用於行動運算和車載系統的單晶片系統，是現代AI硬體的關鍵核心。"
  },
  TSLA: {
    fr: "Tesla conçoit, développe, fabrique et vend des véhicules électriques, ainsi que des systèmes de stockage d'énergie et de production d'électricité propre.",
    en: "Tesla designs, develops, manufactures, and sells fully electric vehicles, energy storage systems, and clean solar electricity generation technologies.",
    pt: "A Tesla projeta, desenvolve, fabrica e vende veículos elétricos, sistemas de armazenamento de energia e geração de eletricidade limpa.",
    es: "Tesla diseña, desarrolla, fabrica y comercializa vehículos 100% eléctricos, sistemas de almacenamiento de energía y tecnologías de generación limpia.",
    de: "Tesla entwickelt, produziert und vertreibt Elektrofahrzeuge, Stromspeichersysteme sowie Technologien zur sauberen Energieerzeugung.",
    zh: "特斯拉（Tesla）設計、研發、生產並銷售全電動汽車，以及先進的儲能系統與清潔太陽能發電設備。"
  },
  GOOGL: {
    fr: "Alphabet est la société mère de Google, moteur de recherche mondial, plateforme de diffusion vidéo YouTube, systèmes Android, services Cloud et projets d'innovation technologique majeurs.",
    en: "Alphabet is the parent company of Google, the global search engine, YouTube streaming platform, Android OS, Google Cloud infrastructure, and frontier innovation bets.",
    pt: "A Alphabet é a empresa-mãe do Google, operando o maior mecanismo de busca do mundo, YouTube, Android, Google Cloud e projetos de inovação avançada.",
    es: "Alphabet es la empresa matriz de Google, operando el motor de búsqueda global, YouTube, sistemas Android, Google Cloud y proyectos de innovación disruptiva.",
    de: "Alphabet ist die Muttergesellschaft von Google, der weltweiten Suchmaschine, YouTube, Android, Google Cloud und wegweisenden Technologieprojekten.",
    zh: "Alphabet 是 Google 的母公司，旗下涵蓋全球最大的搜尋引擎、YouTube 影音平台、Android 作業系統、Google Cloud 雲端與各項前瞻創新計畫。"
  },
  AMZN: {
    fr: "Amazon est le leader mondial du commerce électronique, du cloud computing (AWS), de la diffusion en continu (Prime Video) et de l'intelligence artificielle.",
    en: "Amazon is the global leader in e-commerce, cloud computing infrastructure (AWS), streaming entertainment (Prime Video), and scalable artificial intelligence.",
    pt: "A Amazon é a líder global em comércio eletrônico, computação em nuvem (AWS), streaming (Prime Video) e inteligência artificial.",
    es: "Amazon es el líder mundial en comercio electrónico, computación en la nube (AWS), streaming (Prime Video) e inteligencia artificial.",
    de: "Amazon ist weltweit führend in den Bereichen E-Commerce, Cloud-Computing (AWS), Streaming-Dienste (Prime Video) und künstliche Intelligenz.",
    zh: "亞馬遜（Amazon）是全球電子商務、雲端基礎設施（AWS）、線上影音串流（Prime Video）與人工智慧應用的領航者。"
  },
  NFLX: {
    fr: "Netflix fournit des services de divertissement de diffusion de flux média (streaming) de séries, films, animés et documentaires originaux.",
    en: "Netflix provides subscription streaming entertainment services featuring acclaimed original series, feature films, animation, and international documentaries.",
    pt: "A Netflix fornece serviços de streaming por assinatura de séries originais, filmes, animações e documentários em todo o mundo.",
    es: "Netflix ofrece servicios de entretenimiento por streaming con series originales, películas galardonadas, animación y documentales en todo el mundo.",
    de: "Netflix bietet abonnementbasierte Streaming-Unterhaltung mit preisgekrönten Originalserien, Spielfilmen, Animationen und Dokumentationen weltweit.",
    zh: "網飛（Netflix）提供全球領先的訂閱制串流娛樂服務，涵蓋原創影集、獲獎電影、動畫作品與深度紀錄片。"
  },
  COIN: {
    fr: "Coinbase fournit une infrastructure financière et technologique pour l'économie des crypto-actifs et de la blockchain dans le monde entier.",
    en: "Coinbase provides comprehensive financial and technological infrastructure for the global cryptoeconomy and blockchain ecosystems.",
    pt: "A Coinbase fornece infraestrutura financeira e tecnológica para a economia de criptoativos e tecnologia blockchain globalmente.",
    es: "Coinbase proporciona infraestructura financiera y tecnológica para la criptoeconomía y los ecosistemas blockchain a nivel mundial.",
    de: "Coinbase bietet die finanzielle und technologische Infrastruktur für die weltweite Kryptoökonomie und Blockchain-Märkte.",
    zh: "Coinbase 為全球加密貨幣經濟和區塊鏈生態系統提供全方位的金融基礎設施與技術交易平台。"
  },
  META: {
    fr: "Meta Platforms conçoit des technologies qui aident les gens à se connecter, à trouver des communautés et à développer des entreprises à travers Facebook, Instagram, Messenger et WhatsApp.",
    en: "Meta Platforms builds technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, Messenger, and WhatsApp.",
    pt: "A Meta Platforms desenvolve tecnologias que conectam pessoas, constroem comunidades e impulsionam empresas por meio do Facebook, Instagram, Messenger e WhatsApp.",
    es: "Meta Platforms crea tecnologías que conectan a personas, comunidades y empresas a través de Facebook, Instagram, Messenger y WhatsApp.",
    de: "Meta Platforms entwickelt Technologien zur weltweiten Vernetzung von Menschen und Unternehmen über Facebook, Instagram, Messenger und WhatsApp.",
    zh: "Meta Platforms 開發旨在幫助人們互相連結、建立社群並拓展業務的科技，旗下擁有 Facebook、Instagram、Messenger 和 WhatsApp。"
  },
  AMD: {
    fr: "AMD est une entreprise mondiale de semi-conducteurs qui conçoit des processeurs informatiques et graphiques hautes performances (Ryzen, Radeon, EPYC) pour les ordinateurs, consoles et serveurs.",
    en: "AMD is a global semiconductor firm designing high-performance computing and graphics processors (Ryzen, Radeon, EPYC) for PCs, gaming consoles, and cloud datacenters.",
    pt: "A AMD é uma empresa global de semicondutores que projeta processadores de alto desempenho e GPUs (Ryzen, Radeon, EPYC) para PCs, consoles e data centers.",
    es: "AMD es una empresa de semiconductores que diseña microprocesadores y GPUs de alto rendimiento (Ryzen, Radeon, EPYC) para PC, consolas y centros de datos.",
    de: "AMD entwickelt weltweit hochleistungsfähige Rechen- und Grafikprozessoren (Ryzen, Radeon, EPYC) für Computer, Spielekonsolen und Cloud-Rechenzentren.",
    zh: "超微半導體（AMD）是全球高效能運算與繪圖晶片（Ryzen、Radeon、EPYC）設計先驅，廣泛應用於個人電腦、遊戲主機與雲端資料中心。"
  },
  DIS: {
    fr: "Disney est un géant mondial du divertissement et des médias, exploitant des studios de cinéma célèbres, des parcs à thèmes d'envergure internationale, des réseaux de télévision et Disney+.",
    en: "Disney is a diversified global entertainment and media titan operating renowned movie studios, theme parks, broadcast television networks, and the Disney+ streaming service.",
    pt: "A Disney é uma gigante global de mídia e entretenimento, operando estúdios de cinema, parques temáticos internacionais, redes de TV e o serviço de streaming Disney+.",
    es: "Disney es un gigante global del entretenimiento y los medios, gestionando reconocidos estudios de cine, parques temáticos, cadenas de televisión y Disney+.",
    de: "Disney ist ein weltweiter Medien- und Unterhaltungsgigant mit berühmten Filmstudios, internationalen Freizeitparks, Fernsehsendern und dem Streamingdienst Disney+.",
    zh: "迪士尼（Disney）是全球娛樂傳媒巨擘，經營頂級電影製片廠、國際主題樂園、電視廣播網絡以及 Disney+ 串流影音服務。"
  },
  ASML: {
    fr: "ASML est le plus grand fournisseur mondial de systèmes de photolithographie pour l'industrie des semi-conducteurs. Basée aux Pays-Bas, elle fabrique les machines EUV de pointe.",
    en: "ASML is the world's leading supplier of advanced photolithography systems for semiconductor fabrication. Based in the Netherlands, it exclusively builds extreme ultraviolet (EUV) systems.",
    pt: "A ASML é a líder mundial no fornecimento de sistemas de fotolitografia para semicondutores. Com sede na Holanda, fabrica os sistemas de ponta de litografia EUV.",
    es: "ASML es el principal proveedor mundial de sistemas de fotolitografía para la industria de semiconductores. Con sede en los Países Bajos, fabrica la avanzada tecnología EUV.",
    de: "ASML ist der weltweit führende Ausrüster für Fotolithografiesysteme in der Halbleiterindustrie und exklusiver Hersteller hochmoderner EUV-Maschinen mit Sitz in den Niederlanden.",
    zh: "艾司摩爾（ASML）是全球最大且唯一的極紫外光（EUV）微影曝光設備供應商，總部位於荷蘭，掌握全球先進晶片製程關鍵命脈。"
  },
  V: {
    fr: "Visa est une entreprise multinationale de services financiers facilitant les transferts de fonds électroniques dans le monde entier, principalement par cartes de crédit, débit et prépayées.",
    en: "Visa is a global payments technology company facilitating digital financial transactions across more than 200 countries via credit, debit, and prepaid solutions.",
    pt: "A Visa é uma empresa global de tecnologia de pagamentos que facilita transferências financeiras digitais no mundo inteiro por meio de cartões de crédito e débito.",
    es: "Visa es una compañía global de tecnología de pagos que facilita transacciones electrónicas en más de 200 países a través de tarjetas de crédito, débito y prepago.",
    de: "Visa ist ein weltweit führendes Zahlungstechnologieunternehmen, das sichere bargeldlose und digitale Finanztransaktionen in über 200 Ländern abwickelt.",
    zh: "威士（Visa）是全球數位支付科技先驅，在 200 多個國家和地區提供安全便捷的信用卡、簽帳卡及數位支付轉帳結算服務。"
  },
  LLY: {
    fr: "Eli Lilly est un grand laboratoire pharmaceutique réputé pour ses traitements innovants en oncologie, immunologie, neurosciences et ses thérapies contre l'obésité.",
    en: "Eli Lilly and Company is a leading global biopharmaceutical corporation known for groundbreaking therapies in oncology, immunology, neuroscience, and revolutionary obesity treatments.",
    pt: "A Eli Lilly é uma empresa farmacêutica global de destaque, reconhecida por terapias inovadoras em oncologia, imunologia, neurociência e tratamentos contra a obesidade.",
    es: "Eli Lilly es una destacada farmacéutica internacional reconocida por sus terapias pioneras en oncología, inmunología, neurociencias y tratamientos revolucionarios contra la obesidad.",
    de: "Eli Lilly ist ein führendes globales Pharmaunternehmen, das für innovative Behandlungen in der Onkologie, Immunologie, Neurowissenschaft und Adipositas-Therapien bekannt ist.",
    zh: "禮來（Eli Lilly）是全球頂尖生物製藥企業，在腫瘤學、免疫學、神經科學以及突破性肥胖與代謝症候群療法方面居於領先地位。"
  },
  MC: {
    fr: "LVMH Moët Hennessy Louis Vuitton SE est le leader mondial du luxe, contrôlant plus de 75 maisons prestigieuses dont Louis Vuitton, Dior, Hennessy et Tiffany & Co.",
    en: "LVMH Moët Hennessy Louis Vuitton is the undisputed global luxury powerhouse, orchestrating over 75 prestigious houses including Louis Vuitton, Christian Dior, Hennessy, and Tiffany & Co.",
    pt: "A LVMH é a maior empresa de artigos de luxo do mundo, controlando mais de 75 marcas icônicas como Louis Vuitton, Dior, Hennessy, Bulgari e Tiffany & Co.",
    es: "LVMH es el líder indiscutible del sector del lujo mundial, reuniendo a más de 75 firmas legendarias como Louis Vuitton, Christian Dior, Hennessy y Tiffany & Co.",
    de: "LVMH ist der weltweite Marktführer im Luxussegment und vereint über 75 renommierte Traditionshäuser wie Louis Vuitton, Dior, Hennessy und Tiffany & Co.",
    zh: "酩悅·軒尼詩－路易·威登（LVMH）是全球最大精品帝國，擁有路易威登（Louis Vuitton）、迪奧（Dior）、軒尼詩、蒂芙尼（Tiffany & Co.）等 75 個頂級奢華品牌。"
  },
  "OR.PA": {
    fr: "L'Oréal S.A. est le premier groupe cosmétique mondial, présent dans plus de 150 pays avec des marques emblématiques comme L'Oréal Paris, Lancôme, Garnier et Maybelline.",
    en: "L'Oréal is the world's number one beauty and cosmetics conglomerate, present across 150+ countries with iconic brands including Lancôme, Garnier, and Maybelline.",
    pt: "A L'Oréal é o maior grupo de cosméticos do mundo, presente em mais de 150 países com marcas icônicas como Lancôme, Garnier e Maybelline.",
    es: "L'Oréal es el primer grupo cosmético del mundo, presente en más de 150 países con marcas tan reconocidas como Lancôme, Garnier y Maybelline.",
    de: "L'Oréal ist der weltgrößte Kosmetikkonzern, in über 150 Ländern aktiv mit bekannten Marken wie L'Oréal Paris, Lancôme, Garnier und Maybelline.",
    zh: "萊雅（L'Oréal）是全球最大的美妝保養品巨頭，業務遍及 150 多個國家，旗下擁有蘭蔻（Lancôme）、卡尼爾（Garnier）與媚比琳（Maybelline）等知名品牌。"
  },
  JPM: {
    fr: "JPMorgan Chase est la plus grande banque des États-Unis et un leader mondial des services financiers, gérant plusieurs milliers de milliards de dollars d'actifs.",
    en: "JPMorgan Chase is a premier global financial services firm and the largest banking institution in the United States, managing trillions of dollars in assets.",
    pt: "O JPMorgan Chase é a maior instituição bancária dos EUA e líder mundial em serviços financeiros, gerindo trilhões de dólares em ativos.",
    es: "JPMorgan Chase es el mayor banco de Estados Unidos y líder financiero internacional, administrando billones de dólares en activos en todo el mundo.",
    de: "JPMorgan Chase ist das größte Kreditinstitut der USA und weltweit führend im Bereich Investmentbanking und Vermögensverwaltung mit Billionen an Kundenvermögen.",
    zh: "摩根大通（JPMorgan Chase）是美國資產規模最大的銀行與全球頂尖金融服務機構，管理數兆美元的資產並提供全面的商業與投資銀行業務。"
  },
  WMT: {
    fr: "Walmart est une multinationale de la grande distribution opérant des hypermarchés, des supercentres et des magasins discount proposant des prix bas au quotidien.",
    en: "Walmart is a multinational retail empire operating hypermarkets, discount department stores, and grocery outlets offering everyday low prices.",
    pt: "O Walmart é a maior rede de varejo do mundo, operando hipermercados, lojas de departamento e supermercados focados em preços baixos.",
    es: "Walmart es una corporación multinacional minorista que opera hipermercados, grandes almacenes y tiendas de comestibles con precios bajos diarios.",
    de: "Walmart ist der weltweit größte Einzelhandelskonzern und betreibt SB-Warenhäuser, Discounter und Supermärkte mit dauerhaft niedrigen Preisen.",
    zh: "沃爾瑪（Walmart）是全球營業額最高的跨國連鎖零售商，經營量販店、超級購物中心與折扣商店，致力於提供每日平價優質商品。"
  },
  JNJ: {
    fr: "Johnson & Johnson est un géant de la santé qui développe et fabrique des dispositifs médicaux et des produits pharmaceutiques innovants.",
    en: "Johnson & Johnson is a global healthcare leader researching and manufacturing innovative medical technologies, therapeutic pharmaceuticals, and biologics.",
    pt: "A Johnson & Johnson é uma gigante global de saúde, pesquisando e fabricando dispositivos médicos de ponta e tratamentos farmacêuticos.",
    es: "Johnson & Johnson es una multinacional de la salud que investiga, fabrica y comercializa dispositivos médicos y productos farmacéuticos de vanguardia.",
    de: "Johnson & Johnson ist ein weltweit führender Gesundheitskonzern für innovative Medizintechnik, pharmazeutische Therapien und biologische Medikamente.",
    zh: "嬌生（Johnson & Johnson）是全球頂級醫療保健巨頭，專注於醫療器械、創新藥物與生技療法的研發與製造。"
  },
  PG: {
    fr: "Procter & Gamble est un leader mondial des biens de consommation courante, gérant des marques iconiques pour l'hygiène, les soins corporels et l'entretien de la maison.",
    en: "Procter & Gamble is a global consumer packaged goods titan managing iconic household brands in beauty, grooming, healthcare, and home fabric care.",
    pt: "A Procter & Gamble é uma líder global em bens de consumo, proprietária de marcas icônicas de cuidados pessoais, higiene e limpeza do lar.",
    es: "Procter & Gamble es una multinacional de bienes de consumo masivo con marcas emblemáticas en cuidado personal, higiene y productos para el hogar.",
    de: "Procter & Gamble ist einer der weltweit größten Konsumgüterkonzerne mit traditionsreichen Marken für Körperpflege, Hygiene und Haushaltsprodukte.",
    zh: "寶僑（Procter & Gamble）是全球領先的快消品巨頭，旗下擁有眾多家喻戶曉的個人護理、美妝、洗護與家庭清潔標竿品牌。"
  },
  XOM: {
    fr: "ExxonMobil est l'une des plus grandes compagnies pétrolières et gazières cotées au monde, engagée dans l'exploration, le raffinage et la transition énergétique.",
    en: "ExxonMobil is one of the world's largest publicly traded energy and chemical corporations, engaging in oil exploration, refining, and low-carbon technologies.",
    pt: "A ExxonMobil é uma das maiores empresas de energia do mundo, atuando na exploração de petróleo, gás natural, refino e transição energética.",
    es: "ExxonMobil es una de las mayores multinacionales energéticas del mundo, activa en la exploración petrolera, refino, petroquímica y soluciones bajas en carbono.",
    de: "ExxonMobil ist eines der weltweit größten börsennotierten Energie- und Chemieunternehmen für Ölförderung, Raffinerie und CO2-arme Technologien.",
    zh: "埃克森美孚（ExxonMobil）是全球最大的跨國上市能源與石化巨擘，業務涵蓋石油天然氣勘探開採、精煉銷售及低碳減排技術研發。"
  },
  COST: {
    fr: "Costco exploite un modèle d'entrepôt club réservé aux membres, offrant des produits de qualité en gros volumes à des marges particulièrement basses.",
    en: "Costco operates a popular membership-only wholesale club network, delivering quality merchandise and bulk value at strictly limited markups.",
    pt: "A Costco opera uma rede de clubes de compras por assinatura, oferecendo produtos de alta qualidade em grande volume com margens reduzidas.",
    es: "Costco opera una cadena de clubes de compras con membresía que ofrece productos de calidad al por mayor con márgenes operativos muy ajustados.",
    de: "Costco betreibt ein erfolgreiches Großhandels-Clubmodell mit Mitgliedschaft und bietet hochwertige Markenartikel in Großmengen zu Niedrigstpreisen.",
    zh: "好市多（Costco）是全球最大的會員制量販俱樂部，以極低毛利和優質大包裝商品著稱，擁有龐大且高黏著度的會員忠誠度。"
  },
  MA: {
    fr: "Mastercard est un leader des technologies de paiement numérique, facilitant les transactions électroniques sécurisées dans plus de 210 pays et territoires.",
    en: "Mastercard is a global payments and technology leader connecting consumers, businesses, and banks in over 210 countries with secure digital processing.",
    pt: "A Mastercard é líder global em tecnologia de pagamentos, conectando consumidores, empresas e instituições financeiras em mais de 210 países.",
    es: "Mastercard es un líder mundial en tecnología de pagos electrónicos que procesa transferencias digitales seguras en más de 210 países y territorios.",
    de: "Mastercard ist ein weltweiter Technologieführer im Zahlungsverkehr, der sichere elektronische Transaktionen in über 210 Ländern abwickelt.",
    zh: "萬事達卡（Mastercard）是全球頂尖的支付技術與跨國交易結算服務商，為 210 多個國家的用戶與企業提供安全流暢的數位支付體驗。"
  },
  ADBE: {
    fr: "Adobe est le leader mondial des logiciels de création numérique et de marketing avec sa suite Creative Cloud incluant Photoshop, Illustrator et Premiere Pro.",
    en: "Adobe is the worldwide standard in digital media creation and enterprise marketing software, powered by its flagship Creative Cloud suite.",
    pt: "A Adobe é a empresa líder em soluções de mídia e marketing digital, renomada por sua suíte Creative Cloud (Photoshop, Illustrator, Premiere).",
    es: "Adobe es el referente mundial en software de diseño digital y creatividad, con productos imprescindibles como Photoshop, Illustrator y Premiere Pro.",
    de: "Adobe ist weltweiter Marktführer für Kreativsoftware und digitales Marketing mit branchenführenden Tools wie Photoshop, Illustrator und Premiere.",
    zh: "奧多比（Adobe）是全球數位媒體與創意內容軟體霸主，旗下 Creative Cloud 擁有 Photoshop、Illustrator 與 Premiere 等行業標準工具。"
  },
  CRM: {
    fr: "Salesforce est le pionnier mondial de la gestion de la relation client (CRM) dans le cloud, intégrant des agents d'intelligence artificielle pour les entreprises.",
    en: "Salesforce is the global cloud pioneer in customer relationship management (CRM), unifying sales, service, and marketing with enterprise AI agents.",
    pt: "A Salesforce é a pioneira mundial em CRM e software em nuvem, unificando vendas, atendimento ao cliente e inteligência artificial empresarial.",
    es: "Salesforce es la empresa pionera en gestión de relaciones con clientes (CRM) en la nube, integrando potentes herramientas de IA para empresas.",
    de: "Salesforce ist der globale Pionier für cloudbasiertes Customer Relationship Management (CRM) und Unternehmensanwendungen mit integrierter KI.",
    zh: "賽富時（Salesforce）是全球客戶關係管理（CRM）雲端軟體先驅，全面整合銷售、行銷、客戶服務與企業級生成式AI代理。"
  },
  CVX: {
    fr: "Chevron est une entreprise énergétique intégrée menant des activités mondiales d'exploration pétrolière, de raffinage, de chimie et de carburants renouvelables.",
    en: "Chevron is an integrated global energy enterprise engaged in oil and gas exploration, refining, commodity transportation, and renewable fuels.",
    pt: "A Chevron é uma corporação de energia integrada com operações globais em exploração de petróleo, refino, transporte e combustíveis renováveis.",
    es: "Chevron es una corporación energética integrada con operaciones en exploración petrolera, refino, petroquímica y energías de bajas emisiones.",
    de: "Chevron ist ein integrierter Energiekonzern mit weltweiten Aktivitäten in Erdölförderung, Raffinerien, Chemie und erneuerbaren Kraftstoffen.",
    zh: "雪佛龍（Chevron）是全球領先的綜合性能源企業，業務涵蓋石油勘探開發、煉油化工、海運物流及再生替代燃料製造。"
  },
  BAC: {
    fr: "Bank of America est un groupe bancaire et financier américain de premier plan, servant des millions de particuliers, de PME et de grandes institutions.",
    en: "Bank of America is a prominent financial holding corporation delivering retail banking, wealth management, and investment services to millions worldwide.",
    pt: "O Bank of America é uma das maiores instituições bancárias dos EUA, prestando serviços a pessoas físicas, médias empresas e grandes corporações.",
    es: "Bank of America es una de las principales entidades bancarias y de inversión de EE. UU., prestando servicios a clientes minoristas e institucionales.",
    de: "Die Bank of America ist eine der führenden Großbanken der USA und bietet umfassende Privatkunden-, Firmenkunden- und Investmentbanking-Dienstleistungen.",
    zh: "美國銀行（Bank of America）是美國頂級商業與投資銀行，為全球數千萬個人客戶、中小企業及大型跨國機構提供全方位金融與資產管理服務。"
  },
  PEP: {
    fr: "PepsiCo est un géant mondial de l'agroalimentaire, propriétaire de marques populaires telles que Lay's, Doritos, Pepsi, Tropicana, Gatorade et Quaker.",
    en: "PepsiCo is a global food and beverage powerhouse managing celebrated brands such as Lay's, Doritos, Gatorade, Pepsi-Cola, and Quaker Oats.",
    pt: "A PepsiCo é uma gigante global de alimentos e bebidas, dona de marcas conhecidas como Lay's, Doritos, Gatorade, Pepsi e Quaker.",
    es: "PepsiCo es una multinacional de alimentación y bebidas con marcas tan populares como Lay's, Doritos, Gatorade, Pepsi y Quaker.",
    de: "PepsiCo ist ein weltweiter Lebensmittel- und Getränkekonzern mit bekannten Marken wie Lay's, Doritos, Pepsi, 7UP, Gatorade und Quaker.",
    zh: "百事公司（PepsiCo）是全球食品飲料業巨擘，旗下擁有樂事（Lay's）、多力多滋（Doritos）、百事可樂（Pepsi）、佳得樂（Gatorade）與桂格等暢銷品牌。"
  },
  KO: {
    fr: "The Coca-Cola Company est le plus grand fabricant et distributeur mondial de boissons rafraîchissantes non alcoolisées, présent dans plus de 200 pays.",
    en: "The Coca-Cola Company is the world's largest nonalcoholic beverage manufacturer, marketer, and distributor, quenching thirst across 200+ countries.",
    pt: "A Coca-Cola Company é a maior produtora e distribuidora de bebidas não alcoólicas do mundo, presente em mais de 200 países.",
    es: "The Coca-Cola Company es la mayor compañía de bebidas no alcohólicas del mundo, con presencia y distribución en más de 200 países.",
    de: "The Coca-Cola Company ist der weltweit größte Hersteller und Vermarkter alkoholfreier Erfrischungsgetränke mit Vertrieb in über 200 Ländern.",
    zh: "可口可樂公司（The Coca-Cola Company）是全球最大的無酒精飲料製造商與品牌商，在 200 多個國家銷售數百種清涼飲料與水品。"
  },
  MRK: {
    fr: "Merck est un laboratoire biopharmaceutique d'envergure internationale, pionnier dans les traitements d'immuno-oncologie (Keytruda) et les vaccins essentiels.",
    en: "Merck is a premier research-intensive biopharmaceutical enterprise, renowned for life-saving oncology therapies (Keytruda) and vital global vaccines.",
    pt: "A Merck é uma farmacêutica inovadora de ponta, pioneira em tratamentos oncológicos revolucionários (Keytruda) e vacinas fundamentais.",
    es: "Merck es una compañía biofarmacéutica global de primer nivel, líder en inmuno-oncología (Keytruda) y desarrollo de vacunas esenciales.",
    de: "Merck (MSD) ist ein führendes forschendes biopharmazeutisches Unternehmen, bekannt für innovative Krebsimmuntherapien (Keytruda) und Impfstoffe.",
    zh: "默沙東（Merck & Co.）是全球頂尖創新型生物製藥巨頭，其腫瘤免疫抗癌藥物（Keytruda）與多款關鍵疫苗在醫療界享有卓越聲譽。"
  },
  TSM: {
    fr: "TSMC est la plus grande fonderie indépendante de semi-conducteurs au monde, fabriquant des puces ultra-avancées pour Apple, NVIDIA, AMD et Qualcomm.",
    en: "TSMC is the world's largest pure-play semiconductor foundry, fabricating cutting-edge microchips for leaders like Apple, NVIDIA, and Qualcomm.",
    pt: "A TSMC é a maior fundição independente de semicondutores do mundo, fabricando os chips mais avançados para Apple, NVIDIA e Qualcomm.",
    es: "TSMC es la mayor fundición de semiconductores del mundo, fabricando chips de última generación para gigantes como Apple, NVIDIA y Qualcomm.",
    de: "TSMC ist die weltweit größte unabhängige Halbleiter-Foundry und fertigt modernste Mikrochips für Branchenführer wie Apple, NVIDIA und AMD.",
    zh: "台積電（TSMC）是全球規模最大且技術最先進的專業積體電路製造代工廠，為蘋果、輝達、超微與高通等科技巨擘生產頂級晶片。"
  },
  AVGO: {
    fr: "Broadcom est un leader technologique mondial qui conçoit et fournit des semi-conducteurs et des logiciels d'infrastructure pour les réseaux et centres de données.",
    en: "Broadcom is a global infrastructure technology leader supplying custom microchips, networking silicon, and enterprise software (VMware).",
    pt: "A Broadcom é líder em tecnologia que desenvolve e fornece semicondutores e softwares corporativos (VMware) para redes e data centers.",
    es: "Broadcom es un líder tecnológico que diseña y suministra semiconductores y soluciones de software de infraestructura para centros de datos y redes.",
    de: "Broadcom entwickelt und vertreibt hochspezialisierte Halbleiterkomponenten und Enterprise-Infrastruktursoftware (VMware) für Rechenzentren.",
    zh: "博通（Broadcom）是全球通訊晶片與基礎架構軟體巨擘，為大型雲端資料中心提供客製化網通晶片與企業虛擬化解決方案（VMware）。"
  },
  QCOM: {
    fr: "Qualcomm est un pionnier des communications sans fil, à l'origine des technologies 5G et des processeurs mobiles Snapdragon alimentant des milliards d'appareils.",
    en: "Qualcomm is a foundational wireless technology pioneer, inventing core 5G standards and producing Snapdragon processors for smart devices.",
    pt: "A Qualcomm é pioneira em tecnologias sem fio móveis, desenvolvendo padrões 5G e os processadores Snapdragon para dispositivos inteligentes.",
    es: "Qualcomm es un pionero en comunicaciones inalámbricas y 5G, diseñando los procesadores móviles Snapdragon presentes en millones de dispositivos.",
    de: "Qualcomm ist ein Pionier der drahtlosen Kommunikationstechnik, maßgeblicher Entwickler des 5G-Standards und Hersteller der Snapdragon-Prozessoren.",
    zh: "高通（Qualcomm）是全球行動通訊技術先鋒，發明了多項 5G 核心標準，其 Snapdragon（驍龍）處理器廣泛應用於全球智慧型終端。"
  },
  ORCL: {
    fr: "Oracle est un géant des logiciels d'entreprise et des bases de données, fournissant des applications cloud spécialisées et son infrastructure cloud OCI.",
    en: "Oracle is a global enterprise software and database pioneer, providing mission-critical business applications, database systems, and OCI Cloud services.",
    pt: "A Oracle é pioneira em banco de dados e software empresarial, fornecendo aplicativos de gestão corporativa e infraestrutura em nuvem (OCI).",
    es: "Oracle es un gigante del software empresarial y las bases de datos, que ofrece aplicaciones de gestión y su infraestructura en la nube (OCI).",
    de: "Oracle ist ein führender Anbieter von Unternehmenssoftware, Datenbanksystemen und hochleistungsfähiger Cloud-Infrastruktur (OCI).",
    zh: "甲骨文（Oracle）是全球企業級資料庫與商業應用軟體先鋒，為全球大型企業提供關鍵業務系統、ERP 及 OCI 高效能雲端基礎設施。"
  },
  NKE: {
    fr: "Nike est le numéro un mondial des chaussures, vêtements et équipements de sport, célèbre pour son innovation technique et ses égéries légendaires.",
    en: "Nike is the undisputed world leader in athletic footwear, apparel, and premium sports equipment, defined by breakthrough design and iconic athlete partnerships.",
    pt: "A Nike é a maior fabricante de calçados, vestuário e equipamentos esportivos do mundo, conhecida por sua inovação e atletas consagrados.",
    es: "Nike es el líder mundial indiscutible en calzado, ropa y accesorios deportivos, reconocido por su innovación y patrocinios icónicos.",
    de: "Nike ist der weltweit führende Sportartikelhersteller für Schuhe, Bekleidung und Ausrüstung mit ikonischen Marken und Athletenpartnerschaften.",
    zh: "耐吉（Nike）是全球頂級運動鞋履、服飾與專業裝備品牌，以極致運動科技創新和標誌性體育巨星代言聞名於世。"
  },
  MCD: {
    fr: "McDonald's est la première chaîne de restauration rapide au monde, servant chaque jour des dizaines de millions de clients à travers plus de 40 000 restaurants.",
    en: "McDonald's is the world's leading global foodservice retailer with over 40,000 franchise locations serving millions of customers daily.",
    pt: "O McDonald's é a maior rede de restaurantes fast-food do mundo, atendendo dezenas de milhões de clientes diariamente em mais de 40.000 unidades.",
    es: "McDonald's es la mayor cadena de restaurantes de comida rápida del mundo, con más de 40.000 establecimientos que atienden a millones de comensales al día.",
    de: "McDonald's ist der weltweit größte Schnellrestaurant-Betreiber mit über 40.000 Filialen, der täglich Millionen von Gästen bedient.",
    zh: "麥當勞（McDonald's）是全球規模最大的跨國連鎖餐飲企業，在 100 多個國家擁有逾 40,000 家門市，每天為數千萬顧客提供服務。"
  },
  INTC: {
    fr: "Intel est un pionnier historique des microprocesseurs, fabriquant des puces pour ordinateurs, serveurs et investissant massivement dans de nouvelles fonderies.",
    en: "Intel is a foundational semiconductor designer and manufacturer, producing microprocessors for PCs, datacenters, and building next-gen foundry capacity.",
    pt: "A Intel é pioneira na fabricação de microprocessadores para computadores pessoais e servidores, investindo na expansão de fábricas de chips.",
    es: "Intel es una compañía pionera en la fabricación de microprocesadores para PC y centros de datos, que invierte activamente en nuevas fundiciones.",
    de: "Intel ist ein Halbleiterpionier, der Prozessoren für Computer und Rechenzentren herstellt und globale Fertigungskapazitäten ausbaut.",
    zh: "英特爾（Intel）是現代微處理器技術先驅，為個人電腦與伺服器設計製造運算晶片，並致力於打造世界級先進晶圓代工體系。"
  },
  IBM: {
    fr: "IBM fournit des solutions de cloud hybride, de l'intelligence artificielle d'entreprise (watsonx), du conseil technologique et des systèmes informatiques critiques.",
    en: "IBM delivers global hybrid cloud platforms, cognitive enterprise AI solutions (watsonx), technology consulting, and mission-critical mainframe systems.",
    pt: "A IBM fornece plataformas de nuvem híbrida, IA empresarial (watsonx), consultoria em TI e infraestrutura de servidores de missão crítica.",
    es: "IBM ofrece soluciones de nube híbrida, inteligencia artificial para empresas (watsonx), consultoría tecnológica e infraestructura de misión crítica.",
    de: "IBM bietet Hybrid-Cloud-Plattformen, KI-Lösungen für Unternehmen (watsonx), Technologieberatung und hochzuverlässige Mainframe-Systeme.",
    zh: "IBM（國際商業機器）提供企業級混合雲架構、認知人工智慧平台（watsonx）、IT 戰略諮詢以及關鍵任務主機運算系統。"
  },
  CSCO: {
    fr: "Cisco Systems est le leader mondial des équipements de réseaux internet, commutateurs, routeurs, cybersécurité et logiciels de collaboration.",
    en: "Cisco Systems is the worldwide leader in internet networking equipment, enterprise switches, routers, cybersecurity, and collaboration software.",
    pt: "A Cisco é a líder mundial em equipamentos de redes, roteadores, switches corporativos, segurança cibernética e soluções de colaboração.",
    es: "Cisco Systems es el líder mundial en redes de telecomunicaciones, conmutadores, enrutadores, ciberseguridad y herramientas de colaboración.",
    de: "Cisco Systems ist weltweit führend bei Netzwerk-Hardware, Enterprise-Routern, Switches, Cybersicherheitslösungen und Kollaborationssoftware.",
    zh: "思科（Cisco）是全球網際網路通訊設備霸主，專注於企業級交換機、路由器、新世代網路資安防護與協同辦公系統。"
  },
  GE: {
    fr: "GE Aerospace est un constructeur aéronautique et industriel de pointe, propulsant les avions de ligne commerciaux et développant des moteurs à haute efficacité.",
    en: "GE Aerospace is a world-leading aviation and industrial propulsion innovator, powering commercial jet airliners and military aircraft globally.",
    pt: "A GE Aerospace é uma líder global em aviação e propulsão, fabricando turbinas e motores para as maiores companhias aéreas do mundo.",
    es: "GE Aerospace es una empresa industrial y aeronáutica puntera que diseña motores a reacción de alta eficiencia para aviones comerciales y militares.",
    de: "GE Aerospace ist ein weltweit führender Luftfahrt- und Antriebskonzern, der hocheffiziente Triebwerke für die weltweite Zivilluftfahrt baut.",
    zh: "通用電氣航太（GE Aerospace）是全球首屈一指的航空發動機與工業製造巨擘，為全球大多數商用客機與軍用機型提供強勁動力。"
  },
  SBUX: {
    fr: "Starbucks est la première chaîne de cafés au monde, reconnue pour ses torréfactions de spécialité et son expérience conviviale dans des milliers d'établissements.",
    en: "Starbucks is the premier roaster, marketer, and retailer of specialty coffee globally, operating thousands of welcoming coffeehouses worldwide.",
    pt: "A Starbucks é a maior cafeteria do mundo, conhecida por seus grãos selecionados e cafés especiais servidos em milhares de lojas.",
    es: "Starbucks es la principal cadena de cafeterías especializadas del mundo, famosa por sus cafés premium y ambiente acogedor en miles de locales.",
    de: "Starbucks ist die weltgrößte Kaffeehauskette und bekannt für hochwertige Kaffeespezialitäten sowie gastfreundliche Cafés rund um den Globus.",
    zh: "星巴克（Starbucks）是全球最大的精品咖啡連鎖巨擘，在世界各大城市經營數以萬計的溫馨咖啡門市與專屬烘焙工坊。"
  },
  "TTE.PA": {
    fr: "TotalEnergies est une compagnie multi-énergies mondiale engagée dans la production de pétrole, gaz naturel, biocarburants, éolien et énergie solaire.",
    en: "TotalEnergies is a global multi-energy corporation producing and marketing oils, natural gas, biofuels, offshore wind, and solar electricity.",
    pt: "A TotalEnergies é uma multinacional de energia que produz petróleo, gás natural, biocombustíveis e eletricidade de fontes solares e eólicas.",
    es: "TotalEnergies es una gran energética internacional que produce petróleo, gas natural, biocombustibles y electricidad eólica y solar.",
    de: "TotalEnergies ist ein globaler Multi-Energie-Konzern, der Erdöl, Erdgas, Biokraftstoffe sowie Solar- und Windstrom produziert und vermarktet.",
    zh: "道達爾能源（TotalEnergies）是全球領先的多元化能源跨國巨頭，業務涵蓋石油、天然氣、生質能以及太陽能與風力發電。"
  },
  "SAN.PA": {
    fr: "Sanofi est un leader biopharmaceutique mondial reconnu pour ses molécules innovantes en oncologie, ses traitements cardiovasculaires et ses vaccins à grande échelle.",
    en: "Sanofi is a global healthcare and biopharmaceutical champion, developing cutting-edge therapies in immunology, oncology, and worldwide vaccines.",
    pt: "A Sanofi é uma líder global em saúde e biofarmacêutica, desenvolvendo tratamentos inovadores em imunologia, oncologia e vacinas.",
    es: "Sanofi es un gigante biofarmacéutico internacional reconocido por sus terapias avanzadas en inmunología, oncología y vacunas.",
    de: "Sanofi ist ein weltweites biopharmazeutisches Spitzenunternehmen für neuartige Therapien in der Immunologie, Onkologie und Impfstoffentwicklung.",
    zh: "賽諾菲（Sanofi）是全球領先的生物製藥巨頭，致力於免疫學、腫瘤學、心血管疾病及大型疫苗的研發與生產。"
  },
  "AIR.PA": {
    fr: "Airbus conçoit, fabrique et commercialise des avions commerciaux innovants, des systèmes de défense, des équipements spatiaux et des hélicoptères de secours.",
    en: "Airbus is a global pioneer in aerospace and defense, manufacturing state-of-the-art commercial jetliners, satellites, and mission-critical helicopters.",
    pt: "A Airbus é líder global no setor aeroespacial, fabricando aeronaves comerciais, sistemas de defesa, satélites e helicópteros.",
    es: "Airbus es un líder aeroespacial europeo y global que fabrica los aviones comerciales más avanzados, sistemas espaciales y helicópteros.",
    de: "Airbus ist ein weltweit führender Luft- und Raumfahrtkonzern und baut modernste Passagierflugzeuge, Hubschrauber, Satelliten und Verteidigungssysteme.",
    zh: "空中巴士（Airbus）是全球民用航空與航太防衛製造巨頭，生產各型先進商用客機、人造衛星與軍警民用直升機。"
  },
  "RMS.PA": {
    fr: "Hermès conçoit et distribue des objets hautement désirables issus d'un savoir-faire artisanal d'exception dans la maroquinerie, la sellerie et la haute couture.",
    en: "Hermès is a distinguished French luxury house celebrated for exceptional handcrafted leather goods, saddlery, silk scarves, and timeless haute couture.",
    pt: "A Hermès é uma das mais prestigiadas marcas de luxo do mundo, famosa pelo artesanato impecável em artigos de couro, selaria e seda.",
    es: "Hermès es una legendaria casa de lujo francesa célebre por su artesanía tradicional en marroquinería de alta gama, sillas de montar y seda.",
    de: "Hermès ist ein französisches Traditionshaus für absoluten Luxus, weltberühmt für meisterhafte Lederwaren, Sattlerhandwerk und Seidenschals.",
    zh: "愛馬仕（Hermès）是源自法國的頂級傳統奢華品牌，以精湛絕倫的手工皮革製品、鞍具、絲巾與經典高級訂製工藝聞名全球。"
  },
  "BNP.PA": {
    fr: "BNP Paribas est la première banque de l'Union Européenne, fournissant des services de banque de détail, de gestion d'actifs et de banque d'investissement.",
    en: "BNP Paribas is the leading banking institution in the European Union, offering retail banking, corporate investment banking, and asset management.",
    pt: "O BNP Paribas é o maior banco da União Europeia, atuando em serviços bancários de varejo, corporativos e gestão de investimentos.",
    es: "BNP Paribas es el principal banco de la Unión Europea, ofreciendo banca minorista, banca corporativa y de inversión y gestión de activos.",
    de: "BNP Paribas ist die führende Großbank der Europäischen Union und bietet umfassende Privatkunden-, Firmenkunden- und Investmentbanking-Dienste.",
    zh: "法國巴黎銀行（BNP Paribas）是歐盟境內資產規模最大的銀行集團，為全球客戶提供零售銀行、企業融資與專業資產管理服務。"
  },
  "CS.PA": {
    fr: "AXA est un géant mondial de l'assurance et de la gestion d'actifs, protégeant plus de 90 millions de clients particuliers et entreprises à l'international.",
    en: "AXA is a premier multinational insurance and asset management company, protecting over 90 million individual and corporate clients worldwide.",
    pt: "A AXA é uma das maiores seguradoras do mundo, prestando serviços de proteção e gestão de ativos para mais de 90 milhões de segurados.",
    es: "AXA es un gigante multinacional de los seguros y la gestión de patrimonios, que protege a más de 90 millones de clientes particulares y corporativos.",
    de: "AXA ist ein weltweit führender Versicherungs- und Vermögensverwaltungskonzern, der über 90 Millionen Kunden zuverlässig absichert.",
    zh: "安盛集團（AXA）是全球頂尖的跨國保險與資產管理旗艦機構，為全球 9000 多萬個人及企業客戶提供風險保障與財富管理。"
  },
  "RNO.PA": {
    fr: "Le groupe Renault conçoit, industrialise et distribue des véhicules légers thermiques, hybrides de pointe et 100% électriques sous les marques Renault, Dacia et Alpine.",
    en: "Renault Group designs and manufactures innovative passenger and commercial vehicles, encompassing thermal, hybrid, and electric models across Renault, Dacia, and Alpine.",
    pt: "O Grupo Renault fabrica e comercializa veículos inovadores a combustão, híbridos e 100% elétricos sob as marcas Renault, Dacia e Alpine.",
    es: "El Grupo Renault diseña y fabrica vehículos térmicos, híbridos y 100% eléctricos bajo las marcas emblemáticas Renault, Dacia y Alpine.",
    de: "Die Renault-Gruppe entwickelt und produziert moderne Hybrid-, Elektro- und Verbrennerfahrzeuge unter den Marken Renault, Dacia und Alpine.",
    zh: "雷諾集團（Renault Group）致力於設計、製造與銷售汽油車、頂級油電混合車與純電動車，旗下擁有 Renault、Dacia 與 Alpine 等品牌。"
  },
  "AIRF.PA": {
    fr: "Air France-KLM est un groupe de transport aérien majeur, reliant l'Europe au reste du monde à travers ses hubs de Paris-Charles de Gaulle et Amsterdam-Schiphol.",
    en: "Air France-KLM is a premier European airline group connecting hundreds of destinations worldwide via primary hubs in Paris-CDG and Amsterdam-Schiphol.",
    pt: "A Air France-KLM é um importante grupo de aviação comercial conectando centenas de destinos globais a partir de Paris e Amsterdã.",
    es: "Air France-KLM es un grupo de transporte aéreo líder que conecta Europa con el resto del mundo a través de sus centros en París y Ámsterdam.",
    de: "Air France-KLM ist eine führende europäische Luftfahrtgruppe mit Drehkreuzen in Paris-Charles-de-Gaulle und Amsterdam-Schiphol.",
    zh: "法航荷航集團（Air France-KLM）是歐洲主要的跨國航空運輸集團，以巴黎戴高樂與阿姆斯特丹史基浦為核心樞紐連接全球各大航點。"
  },
  "ENGI.PA": {
    fr: "Engie est un énergéticien majeur impliqué dans la décarbonation industrielle, le gaz renouvelable, le solaire et les infrastructures énergétiques.",
    en: "Engie is a global energy player committed to accelerating the zero-carbon transition through renewable power, low-carbon gas, and sustainable infrastructure.",
    pt: "A Engie é uma das maiores empresas de energia do mundo, focada em transição energética, energia solar, eólica e gás renovável.",
    es: "Engie es un grupo energético internacional centrado en la descarbonización, energías renovables, gas verde e infraestructuras sostenibles.",
    de: "Engie ist ein führender europäischer Energiekonzern, der sich auf den Ausbau von Solar- und Windkraft, erneuerbarem Gas und Energienetze konzentriert.",
    zh: "昂吉（Engie）是全球領先的能源集團，專注於推動零碳轉型、太陽能與風力發電、再生綠色氣體以及智慧能源基礎設施。"
  }
};

export function getStockDescription(symbol: string, lang: string = "fr", fallback?: string): string {
  const normalizedLang: Language = (['fr', 'en', 'pt', 'es', 'de', 'zh'].includes(lang) ? lang : 'fr') as Language;
  const uppercaseSymbol = (symbol || "").toUpperCase();

  const stockEntry = STOCK_DESCRIPTIONS[uppercaseSymbol];
  if (stockEntry && stockEntry[normalizedLang]) {
    return stockEntry[normalizedLang];
  }

  return fallback || stockEntry?.fr || stockEntry?.en || "";
}
