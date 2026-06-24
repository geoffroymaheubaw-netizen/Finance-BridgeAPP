import React, { useState } from "react";
import { Lesson, LessonModule, UserProfile } from "../types";
import { BookOpen, Award, CheckCircle, Lock, Play, RotateCcw, AlertCircle, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LearningTabProps {
  modules: LessonModule[];
  profile: UserProfile;
  onCompleteLesson: (lessonId: string, xp: number) => void;
  onUpdateHearts: (hearts: number) => void;
  lang: string;
  t: (key: string) => string;
}

const getLocalizedModules = (lang: string, originalModules: LessonModule[]): LessonModule[] => {
  if (lang === 'fr') return originalModules;

  const translations: Record<string, {
    modules: Record<string, { title: string; description: string }>;
    lessons: Record<string, { title: string; description: string }>;
    questions: Record<string, { text: string; options: string[]; explanation: string }>;
  }> = {
    en: {
      modules: {
        mod1: { title: "Level 1: Financial Foundations", description: "Demystify the stock market, trading mechanics, and stock origins." },
        mod2: { title: "Level 2: Portfolio & Diversification", description: "Learn to build a highly resilient portfolio robust facing market storms." },
        mod3: { title: "Level 3: Trading Tools & Psychology", description: "Master placing strategic orders and avoiding emotional reactions." },
        mod4: { title: "Level 4: Fundamental Analysis & Ratios", description: "Learn to decipher the actual financial health of a company beyond simple stock price variations." },
        mod5: { title: "Level 5: Risk Management & Advanced Strategies", description: "Protect your capital and employ professional techniques to thrive long-term." }
      },
      lessons: {
        l1_1: { title: "What is a Stock?", description: "Understand how you acquire ownership of a fraction of a business." },
        l1_2: { title: "The Law of Supply and Demand", description: "Discover why stock values increase and decrease continuously." },
        l2_1: { title: "ETFs: Instant Portfolios", description: "Why and how to own hundreds of blue-chip companies in one click." },
        l2_2: { title: "The Art of Diversification", description: "Never place all your investments into a single stock basket." },
        l3_1: { title: "Market vs Limit Orders", description: "Control the exact target price you execute your transactions." },
        l3_2: { title: "FOMO & Behavior Dynamics", description: "Avoid the most critical behavioural traps of beginner traders." },
        l4_1: { title: "The P/E (Price-to-Earnings) Ratio", description: "Understand the universal method to evaluate if a stock is cheap or expensive." },
        l4_2: { title: "The Balance Sheet in the Stock Market", description: "Distinguish between debts, cash, and the security of an enterprise's assets." },
        l5_1: { title: "Leverage and Stop-Loss", description: "Understand the powerful and risky mechanisms of active trading." },
        l5_2: { title: "Market Cycles and Bull/Bear", description: "Learn to adapt your sails to the global climate of world economics." },
        l1_3: { title: "National and Global Indices", description: "Discover the giant thermometers measuring the global economy." },
        l2_3: { title: "Diversification by Asset Classes", description: "Go beyond stocks: learn about bonds, gold, and commodities." },
        l3_3: { title: "Investment Horizon", description: "Distinguish the long-term investor mindset from the short-term trader." },
        l4_3: { title: "Dividend Yield", description: "Learn to calculate and assess the efficiency of cash flow distributions." },
        l5_3: { title: "Strategic Asset Allocation", description: "Design a consolidated flight plan tailored to your risk tolerance." }
      },
      questions: {
        q_1_1: {
          text: "What do you actually acquire when purchasing a 'stock' in the market?",
          options: [
            "A share of ownership in the company, giving right to potential dividends.",
            "A physical product made directly by the company.",
            "A public advertising contract allowing access to their offices.",
            "A loan that the company must refund you next month."
          ],
          explanation: "A stock represents a fractional ownership of a company's capital. By being a shareholder, you own a part of the business proportionally."
        },
        q_1_2: {
          text: "What is the primary motivation for a private company to go public (IPO)?",
          options: [
            "To avoid paying future national taxes.",
            "To raise capital from the public to finance growth and innovations.",
            "To give free gifts to all citizens in the city.",
            "To trim down the executive board team."
          ],
          explanation: "Through an IPO, a business sells fractions of its capital to public investors in order to gather funds for expanding and pioneering."
        },
        q_1_3: {
          text: "What runs under the term 'dividend'?",
          options: [
            "A fine enforced by the law if a stock price falls.",
            "A fee collected by the bank.",
            "The redistribution of a part of the company's profits to its shareholders.",
            "The total gross revenue of a corporation."
          ],
          explanation: "A dividend represents the part of net profits distributed periodically (usually quarterly or annually) to its loyal investors."
        },
        q_2_1: {
          text: "If many investors want to buy a specific stock but nobody is willing to sell, what will happen to its price?",
          options: [
            "The price will immediately crash to zero.",
            "The price will increase considerably.",
            "The price will decline sharply.",
            "The market regulators will ban the stock permanently."
          ],
          explanation: "When demand (buyers) exceeds supply (sellers), competition among buyers drives up the stock's equilibrium price."
        },
        q_2_2: {
          text: "Which factor can negatively influence demand for an active market stock?",
          options: [
            "A spectacular and unexpected jump in net earnings.",
            "Poor economic forecasts or a sector-wide recession.",
            "Hiring legendary tech pioneers in the firm.",
            "An announcement of a brand new patent filing."
          ],
          explanation: "Negative news harms buyer confidence, leading to a drop in demand and a surge in sellers, which pushes the price down."
        },
        q_2_1_1: {
          text: "What is an ETF (Exchange Traded Fund), also commonly called a 'Tracker'?",
          options: [
            "A ultra-fast computer brand specialized in algorithmic trading.",
            "A basket of diversified stocks that tracks a major index (e.g., S&P 500).",
            "A decentralized peer-to-peer cryptocurrency.",
            "A highly restricted platform managed by the central bank."
          ],
          explanation: "An ETF lets you buy hundreds of stocks simultaneously in one single transaction. It is perfect to reduce risks at very low commission fees."
        },
        q_2_1_2: {
          text: "Which famous stock market index consists of the 500 largest US corporations?",
          options: [
            "The NASDAQ-30 Index",
            "The FTSE 100",
            "The S&P 500",
            "The Euro Stoxx 50"
          ],
          explanation: "The S&P 500 index gathers the 500 biggest listed American corporations. It acts as an universal health indicator of the US economy."
        },
        q_2_2_1: {
          text: "Why is it strongly advised to diversify your stock investments?",
          options: [
            "To make sure you purchase only the most expensive stocks.",
            "To limit the impact of one poorly performing stock or sector on your global capital.",
            "Because regulations forbid holding shares in one single industry.",
            "To pay twice as much in broker fees."
          ],
          explanation: "Diversification spreads wealth across different geographic areas, sectors (Tech, Health, Energy) and assets, calming down individual losses."
        },
        q_3_1_1: {
          text: "What is the defining feature of a 'Limit Order' in trading?",
          options: [
            "It runs instantly at whatever next price is available on the millisecond.",
            "It sets a maximum price to buy (or minimum to sell) protecting the trader.",
            "It is an order category reserved exclusively for billionaires.",
            "It automatically expires after 10 seconds if your computer loses power."
          ],
          explanation: "A limit order gives you control over the transaction price. The purchase triggers only if the stock falls to/below your exact set budget limit."
        },
        q_3_2_1: {
          text: "What is 'FOMO' (Fear of Missing Out) inside behavioral finance?",
          options: [
            "An international tax rate levied on capital gains.",
            "The anxiety of missing an opportunity, driving impulsive/irrational buying at peak prices.",
            "A mathematical calculator used to compute market variance.",
            "A high-end luxury life insurance package."
          ],
          explanation: "FOMO prompts impulsive buying of stocks that have skyrocketed, fueled by hype. It is one of the most destructive emotional traps for capital."
        },
        q_4_1_1: {
          text: "How is the P/E (Price-to-Earnings) ratio of a stock calculated?",
          options: [
            "By dividing the stock price by its earnings per share (EPS).",
            "By multiplying the number of shareholders by the company tax rate.",
            "By dividing the total debt by the brand equity value.",
            "By adding the price of gold to the stock price."
          ],
          explanation: "The P/E ratio is obtained by dividing the share price by the annual earnings per share. It expresses how many times the earnings you are paying."
        },
        q_4_1_2: {
          text: "What does a P/E ratio of 15 concretely mean for a company?",
          options: [
            "You must wait 15 days of trading to sell the stock.",
            "The stock price is 15 times higher than the annual net profit generated per share.",
            "The company has filed for bankruptcy 15 times.",
            "The state owns 15% of the company capital."
          ],
          explanation: "A P/E of 15 means the investor is paying 15 times the annual profit per share, which is a theoretical return period of 15 years."
        },
        q_4_1_3: {
          text: "Why do tech startups often have P/E ratios far above the average?",
          options: [
            "Because they are prohibited from using ordinary calculation tools.",
            "Because investors anticipate explosive growth in future earnings.",
            "Because they accumulate huge gold reserves.",
            "To discourage competitors from going public."
          ],
          explanation: "Growth companies have high P/E ratios because buyers accept paying more today in exchange for future profits expected to multiply."
        },
        q_4_2_1: {
          text: "What does 'Shareholder's Equity' represent on a company's balance sheet?",
          options: [
            "All the debts the company owes to state banks.",
            "The residual value of the company assets after subtracting all liabilities.",
            "The sum of salaries paid monthly to employees.",
            "An optional fund used for public relations."
          ],
          explanation: "Shareholder's Equity corresponds to assets minus liabilities. It is the net book value representing the actual value owned by shareholders."
        },
        q_4_2_2: {
          text: "Why is 'Free Cash Flow' so closely monitored by finance professionals?",
          options: [
            "It shows how quickly the company burns cash.",
            "It shows the actual cash generated by operations to fund new projects or distribute to investors.",
            "It is a fictional ratio designed to avoid tax audits.",
            "To measure the number of patents registered abroad."
          ],
          explanation: "Free Cash Flow is the cash available after payment of all operating expenses and investment capital necessary to sustain the business."
        },
        q_5_1_1: {
          text: "What is the primary risk of using 'Leverage' in the stock market?",
          options: [
            "It slows down transaction execution speeds.",
            "It multiplies your losses symmetrically and can liquidate your entire capital on a minor temporary price movement.",
            "It alters the industry category of the companies you own.",
            "It forces you to pay taxes in physical metal."
          ],
          explanation: "Leverage acts as a financial multiplier: while it can boost returns, it speeds up losses proportionally, leading to rapid liquidation if margins fail."
        },
        q_5_1_2: {
          text: "How does a 'Stop-Loss' order work?",
          options: [
            "It blocks the upward fluctuation of the stock price permanently.",
            "It triggers a sell order as soon as the stock falls below your designated safety price.",
            "It doubles your investment funds every fortnight by contract.",
            "It cuts your trading access during unstable periods."
          ],
          explanation: "A Stop-Loss order works as an automatic safety breaker: if the price falls to your threshold, it triggers a market sale to preserve remaining cash."
        },
        q_5_1_3: {
          text: "What is the recommended maximum percentage of your overall capital to risk on a single active trading transaction?",
          options: [
            "Between 1% and 2% maximum.",
            "Always 50% to maximize daily returns.",
            "100% with maximum leverage for fast results.",
            "Strictly 0%, no trades should ever be made."
          ],
          explanation: "Professionals usually restrict their maximum risk per trade to 1% or 2% of total consolidated capital to weather a series of bad trades."
        },
        q_5_2_1: {
          text: "What is a 'Bear Market'?",
          options: [
            "A period when the stock exchange distributes bonuses.",
            "A prolonged decline of at least 20% in major stock indices, driven by market pessimism.",
            "A market where only heavy forestry companies are profitable.",
            "A computer glitch shutting down the world trading floor."
          ],
          explanation: "The bear (who sweeps downwards with its claws) represents a market downturn characterized by pessimism and persistent economic contraction."
        },
        q_5_2_2: {
          text: "What is the mathematical benefit of 'Dollar Cost Averaging' (DCA)?",
          options: [
            "It eliminates all annual taxes on dividends.",
            "It averages your entry cost, causing you to mechanically buy more shares when prices are low and fewer when high.",
            "It grants a free premium account for life.",
            "It offsets inflation on all your domestic expenses."
          ],
          explanation: "DCA eliminates trying to time the market. By buying a fixed dollar amount at regular intervals, you turn temporary crashes into opportunities to buy on sale."
        },
        q_1_3_1: {
          text: "What is a stock market index like the S&P 500 or CAC 40?",
          options: [
            "A tax levied on buying and selling transactions.",
            "A virtual basket tracking representative companies of a market to measure collective performance.",
            "An administrative fee program to slow down speculation.",
            "An academic certification for elite global economists."
          ],
          explanation: "A stock market index bundles and weights major leading companies in a market, serving as an aggregate gauge of health."
        },
        q_1_3_2: {
          text: "Which index is famous for gathering the world's most prominent technology champions?",
          options: [
            "The CAC 40",
            "The NASDAQ",
            "The Nikkei 225",
            "The FTSE 100"
          ],
          explanation: "The NASDAQ is home to heavily tech-focused pillars like Apple, Microsoft, NVIDIA, and Google."
        },
        q_2_3_1: {
          text: "Which asset class is historically deemed the ultimate 'safe haven' in global market turmoil?",
          options: [
            "Stocks of speculative artificial intelligence startups.",
            "Physical gold.",
            "Emerging highly volatile cryptocurrencies.",
            "Short-term crude oil contracts."
          ],
          explanation: "Gold has been prized for millennia as a wealth store that appreciates or holds firm when financial confidence slides."
        },
        q_2_3_2: {
          text: "What is an investment bond compared to a corporate stock?",
          options: [
            "A double voting weight right at board general meetings.",
            "A debt certificate representing loans to governments or firms, paid back with interest.",
            "A mandatory cybersecurity insurance subscription.",
            "An entry penalty for delayed stock orders."
          ],
          explanation: "Buying a bond means lending cash to an issuer in exchange for steady coupon payments, offering more visibility than shares."
        },
        q_3_3_1: {
          text: "What is the main impact of having a long investment horizon (e.g., 15 years) on risk taking?",
          options: [
            "It requires checking your balance every hour.",
            "It lets you tolerate short-term volatility since you have ample time to wait for recovery.",
            "It automatically waives all taxes globally.",
            "It forces you to liquidate all positions every Friday."
          ],
          explanation: "A long timeline buffers temporary cyclical downturns, allowing you to ride the upward long-term trend of business growth."
        },
        q_3_3_2: {
          text: "Why is ultra-short-term day trading discouraged for passive savers?",
          options: [
            "Because it requires a state treasury account.",
            "It demands active attention, incurs heavy commission fees, and is psychologically exhausting.",
            "Because earning profits within 24 hours is strictly illegal.",
            "Because stock prices never change during the daytime."
          ],
          explanation: "Day trading is a high-stress occupation where friction costs (fees) and erratic noises run rampant, leading to losses for most retail players."
        },
        q_4_3_1: {
          text: "How is a stock's Dividend Yield calculated?",
          options: [
            "By multiplying dividends by total gross revenues.",
            "By dividing the annual dividend payment by the share price (as a percentage).",
            "By requesting a custom calculation from a tax auditor.",
            "By counting the company's total number of employees."
          ],
          explanation: "Dividend yield gauges how much cash you get back relative to the entry price. Dividing dividend by stock price clarifies actual yield."
        },
        q_4_3_2: {
          text: "Why should an exceedingly high dividend yield (e.g., 18%) trigger caution?",
          options: [
            "Because yields over 10% are blocked by customs officers.",
            "It often reflects a steep collapse in the stock price, signaling an unsustainable model and an impending dividend cut.",
            "Because dividends over 10% are paid out only in store vouchers.",
            "Because the company will undergo forced nationalization within days."
          ],
          explanation: "A monstrous yield usually flags a falling knife stock. High yield values usually arise because the share price sank, prompting a cut or elimination to save cash."
        },
        q_5_3_1: {
          text: "What is the purpose of periodic portfolio rebalancing?",
          options: [
            "To close down a broker account and start a new one.",
            "To sell winners and buy underperforming sines to bring components back to their target allocation.",
            "To physically weigh your safe-haven gold collection.",
            "To equalize salaries of corporate executives within your stock list."
          ],
          explanation: "Rebalancing harvests profits from soaring assets and injects them where value is attractive, securing rules-based discipline."
        },
        q_5_3_2: {
          text: "What allocation is most congruent with a highly conservative profile?",
          options: [
            "100% split across sovereign bonds, physical gold, and safe cash accounts.",
            "100% into early-stage emerging technology startups.",
            "Crude oil speculative futures contracts.",
            "Only equities in emerging markets suffering recession."
          ],
          explanation: "A conservative design values capital preservation. A heavy concentration of AAA sovereign bonds, gold, and cash deposits ensures safety against equity slides."
        }
      }
    },
    pt: {
      modules: {
        mod1: { title: "Nível 1: Fundamentos Financeiros", description: "Desmistifique o mercado de ações, mecânicas e a origem dos ativos." },
        mod2: { title: "Nível 2: Carteira & Diversificação", description: "Aprenda a construir uma carteira de investimentos altamente resiliente." },
        mod3: { title: "Nível 3: Ferramentas & Psicologia", description: "Aprenda a fazer ordens estratégicas e gerenciar seu emocional boursier." }
      },
      lessons: {
        l1_1: { title: "O que é uma Ação?", description: "Compreenda como você se torna proprietário de uma fração de empresa." },
        l1_2: { title: "A Lei de Oferta e Demanda", description: "Entenda por que os preços oscilam de forma contínua." },
        l2_1: { title: "ETFs: Carteira numa só Transação", description: "Por que e como possuir centenas de empresas líderes com um clique." },
        l2_2: { title: "A Arte da Diversificação", description: "Não coloque todo seu dinheiro em um único cesto de ações." },
        l3_1: { title: "Ordens a Mercado vs Limite", description: "Controle as taxas e valores exatos aos quais executa ordens." },
        l3_2: { title: "FOMO & Psicologia de Mercado", description: "Evite os piores erros comportamentais comuns entre novatos." }
      },
      questions: {
        q_1_1: {
          text: "O que você realmente adquire ao comprar uma 'ação' no mercado?",
          options: [
            "Uma fração do capital social da empresa, dando direito a dividendos potenciais.",
            "Um produto físico fabricado pela referida empresa.",
            "Um contrato promocional permitindo visita às instalações.",
            "Um empréstimo com reembolso compulsório garantido no próximo mês."
          ],
          explanation: "Uma ação representa fração do capital social de uma empresa. Ao se tornar acionista, você vira coproprietário dela proporcionalmente."
        },
        q_1_2: {
          text: "Qual é o objetivo central para uma empresa ao abrir capital na bolsa (IPO)?",
          options: [
            "Evitar o pagamento futuro de tributos corporativos nacionais.",
            "Captar recursos junto ao público para financiar expansão e inovações.",
            "Distribuir prêmios gratuitos para os cidadãos locais.",
            "Otimizar e cortar cargos de diretores executivos."
          ],
          explanation: "Durante o IPO, a empresa vende frações do seu capital ao público de modo a captar investimentos de expansão rápida."
        },
        q_1_3: {
          text: "O que significa o termo do mercado 'dividendo'?",
          options: [
            "Uma multa legal severa aplicada se a cotação cair.",
            "Uma cobrança bancária tradicional.",
            "A distribuição de parte dos lucros líquidos obtidos pela empresa a seus investidores.",
            "O faturamento bruto acumulado de uma grande companhia."
          ],
          explanation: "Dividendos são parcelas do lucro líquido das sociedades distribuídas regularmente (geralmente trimestral ou anual) a acionistas."
        },
        q_2_1: {
          text: "Se muitos investidores desejam comprar uma ação, mas ninguém quer vender, o que acontecerá ao preço?",
          options: [
            "O preço vai despencar instantaneamente a zero.",
            "O preço subirá consideravelmente.",
            "O preço vai cair de forma drástica.",
            "As autoridades federais suspenderão o ativo para sempre."
          ],
          explanation: "Quando a procura (compradores) supera a oferta (vendedores), a concorrência eleva a cotação e preço de equilíbrio do ativo."
        },
        q_2_2: {
          text: "Que fator pode influenciar negativamente a demanda por um ativo boursier?",
          options: [
            "Um aumento espetacular nos rendimentos trimestrais.",
            "Perspectivas econômicas fracas ou recessão generalizada.",
            "Contratação de pioneiros geniais pelo conselho de administração.",
            "Aprovação de patente exclusiva e revolucionária."
          ],
          explanation: "Fatos negativos minam a confiança do mercado comprador, reduzindo a demanda e aumentando o fluxo de venda, o que faz baixar as cotações."
        },
        q_2_1_1: {
          text: "O que é um ETF (Exchange Traded Fund), popularmente apelidado de 'Tracker'?",
          options: [
            "Uma marca especializada em computação de alta performance boursier.",
            "Uma cesta de ações diversificadas que acompanha a performance de um índice (ex: S&P 500).",
            "Uma criptomoeda alternativa de protocolo próprio.",
            "Uma plataforma privada controlada pelo banco central."
          ],
          explanation: "O ETF permite adquirir centenas de ativos conjuntos através de única ordem. Excelente método de diluição de riscos a custos mínimos."
        },
        q_2_1_2: {
          text: "Qual é o índice americano de cotações mais conhecido contendo as 500 maiores empresas?",
          options: [
            "O NASDAQ-30",
            "O FTSE 100",
            "O S&P 500",
            "O Euro Stoxx 50"
          ],
          explanation: "O S&P 500 agrega as 500 maiores empresas cotadas nos EUA. É considerado indicador unânime da saúde econômica de mercado mundial."
        },
        q_2_2_1: {
          text: "Por que se recomenda diversificar suas ações na carteira de investimentos?",
          options: [
            "Para comprar exclusivamente papéis de altíssimo preço unitário.",
            "Para mitigar o impacto negativo de quedas individuais de um ativo ou setor sobre o patrimônio geral.",
            "Porque restrições normativas exigem fragmentação das compras por lei.",
            "Para gerar tarifas duplicadas para sua corretora boursier."
          ],
          explanation: "A diversificação aloca capital em diferentes setores (Tech, Saúde, Commodities) e nações, amortecendo desvalorizações isoladas."
        },
        q_3_1_1: {
          text: "Qual é a característica distintiva de uma ordem boursier 'A Limite'?",
          options: [
            "É executada imediatamente a qualquer cotação do milissegundo seguinte.",
            "Determina cotação limite máxima para compra (ou mínima para venda), protegendo o investidor.",
            "Representa modalidade exclusiva reservada a bilionários.",
            "Expirará obrigatoriamente se sua conexão de rede cair por 10 segundos."
          ],
          explanation: "A ordem com preço limite oferece controle tarifário preciso. Sua aquisição só ocorre em patamar igual ou inferior ao que você configurou."
        },
        q_3_2_1: {
          text: "O que exprime a sigla 'FOMO' (Fear of Missing Out) sob ótica da psicologia de investimentos?",
          options: [
            "Um imposto incidente sobre ganhos mobiliários internacionais.",
            "A ansiedade de ficar de fora, gerando compras impulsivas no topo da euforia.",
            "Um modelo estatístico com dados de volatilidade boursier.",
            "Um plano securitário de alta sofisticação."
          ],
          explanation: "O FOMO precipita compras irracionais por medo de perder a alta de ativos já inflacionados, sendo um clássico destruidor de patrimônios."
        }
      }
    },
    es: {
      modules: {
        mod1: { title: "Nivel 1: Las Bases Financieras", description: "Desmitifica el funcionamiento de la bolsa, el mercado de acciones y el nacimiento de títulos." },
        mod2: { title: "Nivel 2: Carteras & Diversificación", description: "Aprenda a estructurar una canasta robusta e inmune a las tempestades." },
        mod3: { title: "Nivel 3: Herramientas de Trading & Mente", description: "Controle exactamente cómo operar en bolsa y domine sus impulsos emocionales." }
      },
      lessons: {
        l1_1: { title: "¿Qué es una Acción?", description: "Comprenda cómo adquirir una minúscula copropiedad en una corporación." },
        l1_2: { title: "La Ley de Oferta y Demanda", description: "Descubra las causas de oscilación periódica e inestable de coticaciones." },
        l2_1: { title: "Los ETFs: Carteras Todo Incluido", description: "Por qué y cómo ser dueño de cientos de empresas gigantes con solo un clic." },
        l2_2: { title: "El Arte Especial de Diversificar", description: "No concentre todo su capital en una única canasta bursátil." },
        l3_1: { title: "Orden 'De Mercado' vs 'Límite'", description: "Defina los costos e importes precisos al operar en la bolsa." },
        l3_2: { title: "FOMO & Inteligencia Colectiva", description: "Aléjese de los típicos errores comportamentales cometidos por novatos." }
      },
      questions: {
        q_1_1: {
          text: "¿Qué compra realmente al adquirir una 'acción' en la bolsa?",
          options: [
            "Una cuota de propiedad en la empresa, dándole derecho a dividendos futuros potenciales.",
            "Un producto físico elaborado directamente por dicha empresa.",
            "Un contrato de propaganda especial con pases libres a oficinas.",
            "Un préstamo amortizable que la empresa debe pagarle obligatoriamente al mes siguiente."
          ],
          explanation: "La acción simboliza una fracción de capital. Al ser accionista, usted es legalmente copropietario corporativo en proporción idéntica."
        },
        q_1_2: {
          text: "¿Cuál es la causa principal de una Oferta Pública Inicial (IPO) de una empresa?",
          options: [
            "Evasión fiscal legal.",
            "Obtener recursos financieros públicos de inversores para apalancar proyectos estratégicos.",
            "Repartir regalos vecinales.",
            "Prescindir de directivos corporativos clave."
          ],
          explanation: "Mediante el IPO, la corporación comercializa fragmentos de propiedad para captar recursos públicos con miras al crecimiento inmediato."
        },
        q_1_3: {
          text: "¿Qué significa en finanzas el vocablo 'dividendo'?",
          options: [
            "Una sanción legal si las acciones caen repetidamente.",
            "Una comisión por uso de cuenta bancaria.",
            "La distribución parcial de beneficios netos del ejercicio mercantil a tenedores de acciones.",
            "La recaudación bruta mensual acumulada por la matriz."
          ],
          explanation: "El dividendo constituye la porción de beneficio neto de la empresa que se paga de forma regular (por lo general trimestral o anual) a sus inversores."
        },
        q_2_1: {
          text: "Si muchos operadores adquieren compulsivamente una acción y nadie vende, ¿qué pasará con el precio?",
          options: [
            "Sufrirá una devaluación inmediata cayendo a cero.",
            "Subirá notablemente.",
            "Se hundirá drásticamente.",
            "Se clausurará la negociación de forma irrevocable."
          ],
          explanation: "Al haber mayor demanda (compradores) que oferta disponible (vendedores), la pica competitiva impulsa al alza el equilibrio bursátil."
        },
        q_2_2: {
          text: "¿Qué elemento genera caídas en la demanda de adquisición de un activo bursátil?",
          options: [
            "Un alza inesperada en ganancias declaradas.",
            "Previsiones macroeconómicas desfavorables o contracción sectorial.",
            "Sumar fundadores y científicos legendarios a la dirección.",
            "Declaración pública de registro de nueva patente clave."
          ],
          explanation: "La información adversa debilita la confianza general, disminuyendo la demanda con flujo vendedor veloz y forzando la caída de precios."
        },
        q_2_1_1: {
          text: "¿Qué es un fondo cotizado ETF (Exchange Traded Fund), conocido también como 'Tracker'?",
          options: [
            "Una computadora ultrarrápida para arbitraje algorítmico bousier.",
            "Una cartera de acciones que replica la evolución de un índice de relevancia (por ejemplo, S&P 500).",
            "Una moneda descentralizada de custodia criptográfica.",
            "Un sistema reservado bajo propiedad exclusiva del banco nacional."
          ],
          explanation: "Un ETF simplifica poseer cientos de firmas líderes al instante mediante un único instrumento económico ágil y de bajísimo costo."
        },
        q_2_1_2: {
          text: "¿Cuál es el barómetro referencial estadounidense estructurado por 500 colosos empresariales?",
          options: [
            "NASDAQ-30",
            "FTSE 100",
            "S&P 500",
            "Euro Stoxx 50"
          ],
          explanation: "S&P 500 congrega a los 500 líderes mercantiles de Estados Unidos. Ofrece un termómetro indudable de estabilidad global."
        },
        q_2_2_1: {
          text: "¿Por qué los expertos recomiendan ampliamente diversificar el capital?",
          options: [
            "Para adquirir únicamente activos con alto precio nominal unitario.",
            "Para mitigar el riesgo de retroceso de un activo o industria en su patrimonio consolidado.",
            "Porque existen mandatos normativos coercitivos que restringen la concentración.",
            "Para devengar doble comisión honoraria al bróker."
          ],
          explanation: "Diversificar esparce recursos entre múltiples empresas, sectores (Tecno, Energías, Alimentación) y fronteras, neutralizando quebrantos aislados."
        },
        q_3_1_1: {
          text: "¿Cuál es la característica clave de una 'Orden Límite'?",
          options: [
            "Se cursa de inmediato a cualquier tarifa de mercado del milisegundo entrante.",
            "Establece un precio de compra tope máximo (o de venta mínimo de salida) blindando fondos.",
            "Constituye una prerrogativa reservada a súper fortunas.",
            "Caduca automáticamente a los 10 segundos en ausencia de conexión."
          ],
          explanation: "La orden límite blinda sus fondos fijando límites monetarios infranqueables; sólo se operará si la acción iguala o mejora su directriz pactada."
        },
        q_3_2_1: {
          text: "¿Qué indica la denominación financiera 'FOMO' (Fear of Missing Out)?",
          options: [
            "Un impuesto global aplicado a rentabilidad por herencia mercantil.",
            "La ansiedad irracional de quedarse fuera, impulsando compras temerarias en pleno máximo euforia.",
            "Un modelo estadístico de ratios de rentabilidad.",
            "Una póliza de alta rentabilidad asociada a jubilación."
          ],
          explanation: "El FOMO desata el pánico de perderse subidas con compras compulsivas y tardías. Es un fulminante destructor de riqueza en bolsa."
        }
      }
    },
    de: {
      modules: {
        mod1: { title: "Stufe 1: Das Finanzielle Fundament", description: "Verstehen Sie die Börse, die Funktionsweise von Märkten und die Ausgabe von Aktien." },
        mod2: { title: "Stufe 2: Depot-Aufbau & Diversifikation", description: "Lernen Sie, ein robustes, krisensicheres Anlageportfolio aufzustellen." },
        mod3: { title: "Stufe 3: Handelsinstrumente & Psychologie", description: "Behalten Sie die genaue Kontrolle über Transaktionen und Ihre eigenen Emotionen." }
      },
      lessons: {
        l1_1: { title: "Was ist eine Aktie?", description: "Verstehen Sie, wie Sie Miteigentümer eines realen Unternehmens werden." },
        l1_2: { title: "Das Gesetz von Angebot und Nachfrage", description: "Entdecken Sie die Triebkräfte hinter steigenden und fallenden Kursen." },
        l2_1: { title: "ETFs: Das schlüsselfertige Depot", description: "Warum Sie hunderten von Top-Unternehmen mit nur einem Klick besitzen können." },
        l2_2: { title: "Die feine Kunst der Diversifikation", description: "Legen Sie niemals alle Ihre Eier in einen einzigen Aktienkorb." },
        l3_1: { title: "Markt- vs. Limit-Aufträge", description: "Bestimmen Sie die vorteilhaftesten Preise für Ihre Handlungen selbst." },
        l3_2: { title: "FOMO & emotionale Stolpersteine", description: "Vermeiden Sie die klassischen Fehler unerfahrener Spekulanten." }
      },
      questions: {
        q_1_1: {
          text: "Was erwerben Sie tatsächlich mit dem Kauf einer 'Aktie' an der Börse?",
          options: [
            "Anteiliges Eigentum am Unternehmen mit Anspruch auf potenzielle Dividenden.",
            "Ein physisches Produkt, das direkt von diesem Unternehmen hergestellt wird.",
            "Ein Werbevertrag, der Ihnen freien Zugang zu deren Büros gewährt.",
            "Ein Darlehen, das die Aktiengesellschaft im Folgemonat zurückzahlen muss."
          ],
          explanation: "Eine Aktie stellt einen Anteil des Grundkapitals dar. Sie werden dadurch rechtlicher Mitinhaber des Betriebs."
        },
        q_1_2: {
          text: "Warum wählt ein florierendes Privatunternehmen den Börsengang (IPO)?",
          options: [
            "Um die inländische Körperschaftssteuer zu vermeiden.",
            "Um Kapital von der Öffentlichkeit für weiteres Wachstum und Innovationen einzuwerben.",
            "Um Gratisgeschenke an die Bürger zu verteilen.",
            "Um den gesamten Vorstand abzubauen."
          ],
          explanation: "Mittels IPO veräußert die AG Unternehmensbruchteile an breite Anlegerkreise, um Expansionskapital zu schöpfen."
        },
        q_1_3: {
          text: "Was bezeichnet man als 'Dividende'?",
          options: [
            "Eine gesetzliche Geldbuße bei anhaltenden Aktienkursverlusten.",
            "Eine herkömmliche Kontoführungsgebühr.",
            "Die teilweise Gewinnausschüttung der Aktiengesellschaft an ihre Aktionäre.",
            "Den erzielten Bruttomonatsumsatz der AG."
          ],
          explanation: "Als Dividende bezeichnet man den Anteil des Nettogewinns d. Unternehmens, der in regelmäßigen Zyklen an Investoren ausgeschüttet wird."
        },
        q_2_1: {
          text: "Wenn viele Akteure Aktien erwerben wollen aber niemand verkaufen mag, wohin bewegt sich der Kurs?",
          options: [
            "Der Aktienwert stagniert sofort bei Null.",
            "Der Börsenkurs wird steil nach oben getrieben.",
            "Der Kurs bricht unmittelbar ein.",
            "Die Wertpapieraufsicht wird den Handel dauerhaft untersagen."
          ],
          explanation: "Übersteigt die Nachfrage das Angebot, erhöht das Bietungsverfahren den Kurs bis zum neuen Gleichgewichtspreis."
        },
        q_2_2: {
          text: "Welcher Faktor dämpft die Kaufnachfrage für eine Aktie erheblich?",
          options: [
            "Ein unerwartet hoher Sprung der verbuchten Nettogewinne.",
            "Trübe Wirtschaftsprognosen oder allgemeine Branchenkrisen.",
            "Die Ernennung gefeierter Marktführer zu Vorständen.",
            "Die exklusive Patentierung bahnbrechender Erfindungen."
          ],
          explanation: "Schlechte Wirtschaftsnachrichten schädigen das Vertrauen; der Nachfrageausfall drückt sodann im Verbund mit Verkaufsdruck den Kurs."
        },
        q_2_1_1: {
          text: "Was ist ein ETF (Exchange Traded Fund), auch als 'Index-Tracker' bekannt?",
          options: [
            "Ein Rechnernetz für algorithmischen Hochfrequenzhandel.",
            "Ein Aktienkorb, der die Kursentwicklung eines Leitindexes (z.B. S&P 500) eins zu eins abbildet.",
            "Eine dezentrale Kryptowährung mit Eigen-Blockchain.",
            "Eine geschützte Plattform der Notenbank."
          ],
          explanation: "Ein ETF bündelt hunderte Wertpapiere zeitgleich. Er ist ideal, um Risiken bei minimalen Transaktionsgebühren breit zu streuen."
        },
        q_2_1_2: {
          text: "Welcher US-Leitindex vereint die Top 500 Schwergewichte des Aktienmarkts?",
          options: [
            "NASDAQ-30",
            "FTSE 100",
            "S&P 500",
            "Euro Stoxx 50"
          ],
          explanation: "Der S&P 500 umfasst die 500 größten d. börsennotierten US-Unternehmen und gilt als wichtigster Wirtschaftsindikator."
        },
        q_2_2_1: {
          text: "Warum raten Finanzberater nachdrücklich zu breiter Risikostreuung?",
          options: [
            "Um vorrangig teure Einzelwerte zu erwerben.",
            "Um den Verlustbeitrag einzelner schlechter Werte im Gesamtdepot minimal zu halten.",
            "Da strenge gesetzliche Aufteilungsregelungen dies erzwingen.",
            "Zur Generierung von doppelter Vertriebsprovision für Kreditinstitute."
          ],
          explanation: "Diversifikation verteilt Kapital auf Sektoren (Tech, Energie, Pharma) und Regionen, um punktuelle Krisen abzufedern."
        },
        q_3_1_1: {
          text: "Was zeichnet eine Börsenorder vom Typ 'Limit' aus?",
          options: [
            "Sie wird unverzüglich zum nächsten erreichbaren Marktpreis ausgeführt.",
            "Sie legt den maximalen Kaufkurs (bzw. minimalen Verkaufspreis) fest und schützt Ihr Depot.",
            "Diese Orderform ist Großkapitaldepots vorbehalten.",
            "Sie löscht sich automatisch, falls die Netzverbindung für 10 Sekunden unterbricht."
          ],
          explanation: "Limitierte Aufträge sichern Anleger preislich ab. Es wird erst gekauft, wenn die Aktie Ihr Wunsch-Einkaufsniveau schneidet."
        },
        q_3_2_1: {
          text: "Welchen psychologischen Fehler beschreibt das Akronym 'FOMO'?",
          options: [
            "Eine Steuerabgabe auf ausländische Zinserträge.",
            "Die quälende Angst, Chancen zu verpassen, was zu impulsiven Käufen an Hochpunkten verleitet.",
            "Einen mathematischen Korrekturfaktor im Bewertungsmodell.",
            "Eine Premium-Börsenversicherungspolice."
          ],
          explanation: "FOMO verleitet Anleger aus Angst vor verpassten Gewinnen zum panischen Einstieg auf Rekordhöhen — ein fataler Renditekiller."
        }
      }
    },
    zh: {
      modules: {
        mod1: { title: "第一境界：奠定金融地基", description: "通俗解構證券交易運作機制、股市撮合起源，並揭祕持股本質。" },
        mod2: { title: "第二境界：投資組合與風險分散", description: "學習配置高韌性虛擬防禦投資組合，坦然面對大盤黑天鵝。" },
        mod3: { title: "第三境界：委託心法與操作心理", description: "掌握精確委託報價，商確羊群效應，克服追高殺跌心理。" }
      },
      lessons: {
        l1_1: { title: "什麼是股票？", description: "理解你擁有這家公司的極小份額股權。" },
        l1_2: { title: "供需平衡黃金法則", description: "探索價格上下波動的核心本質與動力。" },
        l2_1: { title: "ETFs：一籃子指數證券組合", description: "如何省心一鍵坐享數百家藍籌跨國巨頭的股利分紅。" },
        l2_2: { title: "分散配置的細膩藝術", description: "不要將所有的財富雞蛋，都放在同一個籃子裡！" },
        l3_1: { title: "「市價委託」與「限價委託」", description: "拒絕隨意出價，精準掌控每一筆虛擬買賣委託下單成本。" },
        l3_2: { title: "FOMO：探究市場失控與貪婪", description: "規避新手最常踩中的投機與非理性追多情緒陷阱。" }
      },
      questions: {
        q_1_1: {
          text: "當您在二級市場買入「股票」時，您實際上買入了什麼？",
          options: [
            "該企業的股權所有權，象徵您享有公司未來潛在的股利分紅分配權利。",
            "該企業直接生產製造的實體商品本身。",
            "一份專屬的企業公關合約，允許您隨意進出該公司辦公大樓。",
            "一筆該企業必須強制作為債務於下個月全額償還您的借貸券。"
          ],
          explanation: "股票代表了這家上市企業資本的微小股權所有權。持有該股份意味著您是該公司的法定股東兼所有者之一。"
        },
        q_1_2: {
          text: "未上市企業申請「首次公開募股 IPO」進入證券交易所，其核心意圖是什麼？",
          options: [
            "規避繳納日後的國家法人營收稅務費率。",
            "面向全球大眾和機構籌募權益性資金，為其日後高速擴展和研發充實資金儲備。",
            "為總部大樓周邊的居民分發免費紀念禮品。",
            "合理削減解僱董事長等高級行政班底。"
          ],
          explanation: "透過 IPO 開放認購，公司能有效募集市場大眾的資本，為其未來的產品擴展籌集關鍵活水。"
        },
        q_1_3: {
          text: "金融理財中所稱的「股利 (Dividend)」，其意義為何？",
          options: [
            "若股價跌破淨值時，法庭課徵的一筆殘罰金。",
            "銀行託管收取的年費手續費。",
            "公司決定回饋一部分淨獲利盈餘，將其按比例分配給庫存持股的投資者。",
            "該公司整個季度的總營業額 (Revenue)。"
          ],
          explanation: "股利是上市企業回報忠實投資者的重要途徑，通常按季度或年度將部分盈餘發放給股東。"
        },
        q_2_1: {
          text: "如果市場所有散戶都爭相購入某檔熱門股，但幾乎沒有庫存持股願意拋售，其價格將產生什麼走勢？",
          options: [
            "其價格將因無交易量而瞬間跌至零元。",
            "其價格將在一片瘋搶中劇烈上漲升高。",
            "價格將面臨毀滅性雪崩暴跌。",
            "金融監管當局會直接拔掉網線，永久禁止該股交易。"
          ],
          explanation: "在供需法則中，當買方需求（Demand）顯著超越賣方供給（Supply），競價購買程序將合力推高成交的價格平衡點。"
        },
        q_2_2: {
          text: "以下哪項事件通常會顯著壓低對於一檔個股的購買需求？",
          options: [
            "個股財報發布令人驚豔的高淨利潤激增。",
            "悲觀的宏觀經濟預測或行業板塊性整體衰退危機。",
            "宣布招募到業內傳奇研發領袖加盟高管。",
            "公開披露成功登記一項核心重磅產品科技專利。"
          ],
          explanation: "利空與壞消息會直接損傷股東信心、誘發大宗拋售，供給暴增的同時需求萎縮，從而直接拖累股價。"
        },
        q_2_1_1: {
          text: "什麼是 ETF 交易所交易基金 (Exchange Traded Fund)，也稱為「指數追蹤基金」？",
          options: [
            "一種針對高頻量化和算法交易所設計的特殊電腦硬體品牌。",
            "一籃子分散的股份組合，旨在忠實複製或追蹤某特定基準指數（如 S&P 500）的綜合回報。",
            "一種具備自主公鏈協議的去中心化密碼學代幣。",
            "中央銀行特許保留並實施託管的私人系統。"
          ],
          explanation: "持有 ETF 能有效一箭配置數百家公司。這非常適合尋求指數化回報且追求極低手續費的穩健投資者。"
        },
        q_2_1_2: {
          text: "哪份享譽全球的美國大盤基準指數，是由 500 家全美各領域核心龍頭企業所構成的？",
          options: [
            "那斯達克-30 指數 (NASDAQ-30)",
            "富時100 指數 (FTSE 100)",
            "標準普爾500 指數 (S&P 500)",
            "道瓊歐洲50 指數 (Euro Stoxx 50)"
          ],
          explanation: "S&P 500 標準普爾500 指數代表著美國大盤權重藍籌。通常被奉為美國大盤甚至是全球投資的重要體溫計。"
        },
        q_2_2_1: {
          text: "為什麼理財專家無一例外地強烈建議在股市中進行分散配置？",
          options: [
            "為了確保您只買入單價最昂貴的龍頭股票。",
            "為了限制單一持股踩雷或某行業暴跌時，對您整體個人資產造成不可逆的毀滅打擊。",
            "因為金融法規嚴格限制投資者配置單一產業股。",
            "為證券經紀商貢獻雙倍的佣金收益。"
          ],
          explanation: "分散配置是承擔可控風險的前提。將資金分流至科技、醫療、能源及不同地域，能有效撫平單一個股的波動震盪。"
        },
        q_3_1_1: {
          text: "交易中「限價委託 (Limit Order)」與市價單的關鍵區別在哪裡？",
          options: [
            "它能在下一毫秒內，以任意最快撮合的當前對手盤價格立即買入成交。",
            "它限制了您買入的最高上限價格（或賣出時的最低防線），最大程度保護資金安全。",
            "這是唯有大資金機構和富豪才被允許使用的委託種類。",
            "若是您斷網超過 10 秒鐘，該委託將被系統強行予以撤銷失效。"
          ],
          explanation: "限價委託能賦予交易者絕佳的價格控制。唯有市場行情觸碰或優於您的出價限制時，撮合程序才會觸發，防止超支。"
        },
        q_3_2_1: {
          text: "行為金融學口語常說的「FOMO (Fear of Missing Out)」到底是什麼心理？",
          options: [
            "跨境繼承股票紅利時，被課徵的一筆資本遺產稅費。",
            "因眼看別人都賺錢，恐懼錯失這波狂熱波段而喪失理智追高買在山頂的羊群投機焦慮心理。",
            "用於計算個股歷史回撤率的專業算術指標。",
            "一種提供超高儲蓄分紅的附加人壽保單。"
          ],
          explanation: "FOMO 是新手爆倉的首要心理元兇。在市場被炒作到最高點時因害怕空手而盲目衝進去接盤，最容易導致財富蒙受重創。"
        }
      }
    }
  };

  const localizedData = translations[lang];
  if (!localizedData) return originalModules;

  return originalModules.map(mod => {
    const localizedMod = localizedData.modules[mod.id] || { title: mod.title, description: mod.description };
    return {
      ...mod,
      title: localizedMod.title,
      description: localizedMod.description,
      lessons: mod.lessons.map(les => {
        const localizedLes = localizedData.lessons[les.id] || { title: les.title, description: les.description };
        return {
          ...les,
          title: localizedLes.title,
          description: localizedLes.description,
          questions: les.questions.map(q => {
            const localizedQ = localizedData.questions[q.id] || { text: q.text, options: q.options, explanation: q.explanation };
            return {
              ...q,
              text: localizedQ.text,
              options: localizedQ.options,
              explanation: localizedQ.explanation
            };
          })
        };
      })
    };
  });
};

export default function LearningTab({ modules, profile, onCompleteLesson, onUpdateHearts, lang, t }: LearningTabProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResultScreen, setShowResultScreen] = useState<boolean>(false);
  const [learningPhase, setLearningPhase] = useState<'study' | 'quiz'>('study');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);

  const currentHearts = profile.learningHearts ?? 4;

  // Translate/localize the lessons structure dynamically depending on lang
  const localizedModules = getLocalizedModules(lang, modules);

  // Lesson helper: is this lesson unlocked?
  const isLessonUnlocked = (lessonId: string) => {
    const allLessonIds: string[] = [];
    localizedModules.forEach((mod) => {
      mod.lessons.forEach((l) => {
        allLessonIds.push(l.id);
      });
    });

    const index = allLessonIds.indexOf(lessonId);
    if (index === 0) return true;
    const prevLessonId = allLessonIds[index - 1];
    return profile.completedLessons.includes(prevLessonId);
  };

  const handleStartLesson = (lesson: Lesson) => {
    // Prevent starting if no hearts left
    if (currentHearts <= 0) return;
    setActiveLesson(lesson);
    setCurrentSlideIdx(0);
    setLearningPhase(lesson.slides && lesson.slides.length > 0 ? 'study' : 'quiz');
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResultScreen(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isAnswered || !activeLesson) return;
    setIsAnswered(true);

    const question = activeLesson.questions[currentQuestionIdx];
    if (selectedOption === question.correctAnswerIndex) {
      setScore(prev => prev + 1);
    } else {
      onUpdateHearts(Math.max(0, currentHearts - 1));
    }
  };

  const handleNext = () => {
    if (!activeLesson) return;
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentHearts <= 0 || currentQuestionIdx + 1 >= activeLesson.questions.length) {
      setShowResultScreen(true);
      if (currentHearts > 0) {
        onCompleteLesson(activeLesson.id, activeLesson.xpReward);
      }
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handleQuit = () => {
    setActiveLesson(null);
  };

  return (
    <div id="learning-tab" className="space-y-6">
      <AnimatePresence mode="wait">
        {!activeLesson ? (
          <motion.div
            key="tree"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header intro info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  {t("learningTitle")}
                </h2>
                <p className="text-slate-400 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  {t("learningDesc")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0 self-start md:self-auto">
                <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/45 px-5 py-3.5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/40">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="text-xs text-slate-505 dark:text-indigo-300 font-bold block leading-none">VOTRE CAPITAL XP</span>
                    <span className="text-lg font-black text-slate-850 dark:text-white font-mono">{profile.xp} XP</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-955/45 px-5 py-3.5 rounded-2xl border border-rose-100/50 dark:border-rose-900/40">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                  <div>
                    <span className="text-xs text-rose-505 dark:text-rose-300 font-bold block leading-none">CŒURS DU JOUR</span>
                    <span className="text-lg font-black text-slate-850 dark:text-white font-mono">{currentHearts} / 4</span>
                  </div>
                </div>
              </div>
            </div>

            {currentHearts === 0 && (
              <div className="bg-rose-550/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-xs bg-rose-50 dark:bg-rose-955/10">
                <AlertCircle className="w-5 h-5 text-rose-550 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-rose-800 dark:text-rose-300 text-sm">
                    Plus de cœurs pour aujourd'hui !
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Vous avez épuisé vos 4 cœurs quotidiens de formation. Revenez demain pour obtenir de nouveaux cœurs et continuer votre apprentissage boursier !
                  </p>
                </div>
              </div>
            )}

            {/* Modules duolingo-styled tree timeline path */}
            <div className="space-y-12 relative pl-12 sm:pl-16 before:absolute before:left-[16px] sm:before:left-[24px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {localizedModules.map((mod, modIdx) => {
                return (
                  <div key={mod.id} className="relative space-y-6">
                    {/* Node marker decoration title */}
                    <div className="absolute -left-[52px] sm:-left-[60px] w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-xs shadow-xs text-slate-400">
                      M{modIdx + 1}
                    </div>

                    <div className="space-y-1.5 pl-4">
                      <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">{mod.title}</h3>
                      <p className="text-slate-400 dark:text-slate-400 text-xs max-w-xl">{mod.description}</p>
                    </div>

                    {/* Lessons nested circles row list layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                      {mod.lessons.map((lesson) => {
                        const unlocked = isLessonUnlocked(lesson.id);
                        const completed = profile.completedLessons.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={`p-4 rounded-2xl border transition-all duration-300 relative flex items-start gap-4 ${
                              completed
                                ? "bg-emerald-50/20 hover:bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/5 dark:border-emerald-900/40"
                                : unlocked
                                ? "bg-white hover:bg-slate-50/50 border-slate-205 dark:bg-slate-900 dark:hover:bg-slate-950 dark:border-slate-800 border-slate-200"
                                : "bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-900 opacity-65"
                            }`}
                          >
                            <div className="space-y-1.5 flex-1 pr-10">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                                  {lesson.xpReward} XP
                                </span>
                                {completed && (
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">
                                    {t("completedQuiz")}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-150">{lesson.title}</h4>
                              <p className="text-slate-405 text-xs text-slate-400 leading-normal">{lesson.description}</p>
                            </div>

                            <div className="absolute right-4 top-4">
                              {completed ? (
                                <button
                                  type="button"
                                  onClick={() => handleStartLesson(lesson)}
                                  disabled={currentHearts <= 0}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
                                    currentHearts <= 0
                                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 border border-slate-200/40 dark:border-slate-700/40"
                                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  }`}
                                  title="Recommencer"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              ) : unlocked ? (
                                <button
                                  type="button"
                                  onClick={() => handleStartLesson(lesson)}
                                  disabled={currentHearts <= 0}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                                    currentHearts <= 0
                                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50 border border-slate-200/40 dark:border-slate-700/40"
                                      : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white"
                                  }`}
                                  title={t("startQuiz")}
                                >
                                  <Play className="w-4 h-4 fill-white ml-0.5" />
                                </button>
                              ) : (
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center border border-slate-200/40 dark:border-slate-700/40">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ACTIVE INTERACTIVE LESSON FLOW SCREEN */
          <motion.div
            key="game-flow"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 sm:p-8 max-w-2xl mx-auto shadow-md"
          >
            {/* Header top line toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="space-y-0.5">
                <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider">{activeLesson.title}</span>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">
                  {learningPhase === 'study' ? "Cours théorique" : t("quizTitle")}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleQuit}
                className="text-slate-400 hover:text-rose-500 transition font-bold text-xs border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                Fermer
              </button>
            </div>

            {/* Lives and dynamic Duolingo status bar */}
            {!showResultScreen && (
              <div className="flex items-center justify-between gap-6 mb-6">
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${learningPhase === 'study' ? 'bg-emerald-500' : 'bg-indigo-600'} h-full transition-all duration-300`}
                    style={{
                      width: learningPhase === 'study'
                        ? `${((currentSlideIdx + 1) / (activeLesson.slides?.length || 1)) * 100}%`
                        : `${((currentQuestionIdx) / activeLesson.questions.length) * 100}%`
                    }}
                  />
                </div>
                {learningPhase === 'study' ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-100/50 dark:border-emerald-900/40 shrink-0">
                    Fiche {currentSlideIdx + 1} / {activeLesson.slides?.length || 1}
                  </span>
                ) : (
                  <div className="flex items-center gap-1 font-bold font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-250/20 shrink-0">
                    <Heart className={`w-4 h-4 ${currentHearts > 0 ? "text-rose-500 fill-rose-505 bg-rose-50 dark:bg-rose-950/40" : "text-slate-300"}`} />
                    <span>{currentHearts}</span>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              {showResultScreen ? (
                /* OUTCOMES / STATS BOARD FOR PASSED LESSON */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-white mx-auto shadow-md animate-bounce">
                    <Award className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-slate-800 dark:text-white">
                      {currentHearts > 0 ? "Félicitations ! 🎉" : "Fin de partie 😢"}
                    </h4>
                    <p className="text-slate-400 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                      {currentHearts > 0
                        ? `Vous avez complété la leçon avec brio en répondant correctement aux questions !`
                        : "Vous avez perdu toutes vos vies. Pas d'inquiétude, lisez bien les explications et recommencez !"}
                    </p>
                  </div>

                  {currentHearts > 0 && (
                    <div className="bg-indigo-50/50 dark:bg-indigo-955/20 border border-indigo-100 dark:border-indigo-900/40 p-4 rounded-2xl inline-block">
                      <span className="text-[10px] text-slate-400 dark:text-indigo-400 block font-bold leading-none uppercase mb-1.5">{t("xpRewardMsg")}</span>
                      <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono">+{activeLesson.xpReward} XP</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuit}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer"
                    >
                      {t("backToModules")}
                    </button>
                  </div>
                </motion.div>
              ) : learningPhase === 'study' && activeLesson.slides && activeLesson.slides.length > 0 ? (
                /* ACTIVE THEORY RE-READ BOARD / SLIDE */
                <motion.div
                  key={`slide-${currentSlideIdx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Visual Illustration Slot depending on illustration keyword */}
                  <div className="flex justify-center py-4">
                    <div className="relative w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-slate-700 shadow-2xs">
                      {(() => {
                        const illus = activeLesson.slides[currentSlideIdx].illustration;
                        if (illus === "company") return <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />;
                        if (illus === "growth") return <Award className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />;
                        if (illus === "dividend") return <Sparkles className="w-12 h-12 text-amber-500" />;
                        if (illus === "balance") return <BookOpen className="w-12 h-12 text-teal-600" />;
                        if (illus === "trend") return <Award className="w-12 h-12 text-emerald-600" />;
                        if (illus === "basket") return <BookOpen className="w-12 h-12 text-indigo-600" />;
                        if (illus === "index") return <Award className="w-12 h-12 text-blue-600" />;
                        if (illus === "danger") return <AlertCircle className="w-12 h-12 text-rose-500" />;
                        if (illus === "diversity") return <Sparkles className="w-12 h-12 text-emerald-500" />;
                        if (illus === "speed") return <Play className="w-10 h-10 text-indigo-500 ml-1" />;
                        if (illus === "target") return <CheckCircle className="w-12 h-12 text-emerald-500" />;
                        if (illus === "mind") return <Sparkles className="w-12 h-12 text-violet-500" />;
                        if (illus === "alarm") return <AlertCircle className="w-12 h-12 text-amber-500" />;
                        return <BookOpen className="w-12 h-12" />;
                      })()}
                      <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1.5 leading-none shadow-xs text-[10px] font-black">
                        {currentSlideIdx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Slide Text Content */}
                  <div className="space-y-3 text-center sm:text-left">
                    <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight leading-snug">
                      {activeLesson.slides[currentSlideIdx].title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-sans leading-relaxed">
                      {activeLesson.slides[currentSlideIdx].text}
                    </p>
                  </div>

                  {/* Bullet Cards */}
                  {activeLesson.slides[currentSlideIdx].bullets && activeLesson.slides[currentSlideIdx].bullets.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {activeLesson.slides[currentSlideIdx].bullets.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-slate-50/70 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-850 p-3.5 rounded-2xl flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-normal font-medium">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Desk footer specifically for slide */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {currentSlideIdx > 0 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentSlideIdx(prev => prev - 1)}
                          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                        >
                          Retour
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentSlideIdx + 1 < (activeLesson.slides?.length || 0)) {
                          setCurrentSlideIdx(prev => prev + 1);
                        } else {
                          setLearningPhase('quiz');
                        }
                      }}
                      className={`${
                        currentSlideIdx + 1 === (activeLesson.slides?.length || 0)
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white font-black hover:scale-101 shadow-md"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      } px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition duration-150 cursor-pointer flex items-center gap-1.5`}
                    >
                      {currentSlideIdx + 1 === (activeLesson.slides?.length || 0) ? (
                        <>
                          <Sparkles className="w-4 h-4 fill-white animate-spin-slow" />
                          Prêt pour le Quiz !
                        </>
                      ) : (
                        "Suivant"
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ACTIVE MULTIPLE CHOICE QUESTION BLOCK */
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] text-indigo-650 bg-indigo-50 dark:bg-indigo-950 font-extrabold px-2.5 py-0.5 rounded-md">
                      QUESTION {currentQuestionIdx + 1} SUR {activeLesson.questions.length}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                      {activeLesson.questions[currentQuestionIdx].text}
                    </h4>
                  </div>

                  {/* Options items */}
                  <div className="space-y-2.5 pt-2">
                    {activeLesson.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrectAnswer = oIdx === activeLesson.questions[currentQuestionIdx].correctAnswerIndex;
                      
                      let bgClass = "bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-950 dark:border-slate-800 text-slate-700 dark:text-slate-350";
                      if (isSelected) {
                        bgClass = "bg-indigo-50 border-indigo-600 dark:bg-indigo-950 dark:border-indigo-500 font-bold text-slate-900 dark:text-white";
                      }
                      if (isAnswered) {
                        if (isCorrectAnswer) {
                          bgClass = "bg-emerald-50 border-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-500 font-bold text-emerald-990 dark:text-emerald-400";
                        } else if (isSelected) {
                          bgClass = "bg-rose-50 border-rose-500 dark:bg-rose-955/20 dark:border-rose-500 font-bold text-rose-990 dark:text-rose-400";
                        } else {
                          bgClass = "bg-slate-50/50 border-slate-100 dark:bg-slate-950/40 dark:border-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed";
                        }
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`p-4 border rounded-xl transition-all cursor-pointer text-xs sm:text-sm relative flex items-center ${bgClass}`}
                        >
                          <span className={`w-6 h-6 rounded-lg mr-3 flex items-center justify-center font-bold text-xs border ${
                            isSelected 
                              ? "bg-indigo-600 text-white border-indigo-600" 
                              : "bg-slate-100 dark:bg-slate-850 text-slate-550 border-slate-200 dark:border-slate-800"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply explanation alert banner panel */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl space-y-1 bg-slate-50 border border-slate-150 text-xs sm:text-sm border ${
                        selectedOption === activeLesson.questions[currentQuestionIdx].correctAnswerIndex
                          ? "bg-emerald-50/20 border-emerald-100 dark:bg-emerald-955/10 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                          : "bg-rose-50/20 border-rose-100 dark:bg-rose-955/10 dark:border-rose-900/40 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px] tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{selectedOption === activeLesson.questions[currentQuestionIdx].correctAnswerIndex ? t("correctMsg") : t("wrongMsg")}</span>
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">{t("explanationTitle")}</p>
                      <p className="text-slate-500 dark:text-slate-400 font-sans leading-relaxed text-xs">
                        {activeLesson.questions[currentQuestionIdx].explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Submission triggers desk footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    {!isAnswered ? (
                      <button
                        type="button"
                        onClick={handleAnswerSubmit}
                        disabled={selectedOption === null}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 hover:scale-101 dark:disabled:bg-slate-950 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition duration-150 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {t("submitAnswer")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer"
                      >
                        {t("nextQuestion")}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
