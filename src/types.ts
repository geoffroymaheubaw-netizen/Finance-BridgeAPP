export interface StockNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  link?: string;
  fullText?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // percentage change today
  history: number[]; // 30-day price history
  volume: string;
  marketCap: string;
  low24h: number;
  high24h: number;
  description: string;
  news: StockNews[];
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
  stopLoss?: number; // Stop-loss price
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  date: string;
}

export interface LessonQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LessonSlide {
  title: string;
  text: string;
  bullets?: string[];
  illustration?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  slides?: LessonSlide[];
  questions: LessonQuestion[];
  completed?: boolean;
}

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface UserProfile {
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string | null; // ISO string
  cash: number;
  completedLessons: string[]; // lessonIds
  portfolio: PortfolioItem[];
  transactions: Transaction[];
  portfolioHistory: { date: string; value: number }[];
  marketMode?: 'real' | 'continuous';
  learningHearts?: number;
  lastHeartsResetDate?: string; // YYYY-MM-DD
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}
