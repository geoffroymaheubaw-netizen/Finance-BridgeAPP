import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Conversation } from "../types";
import { Send, Bot, HelpCircle, AlertTriangle, Sparkles, Loader2, Plus, Trash2, MessageSquare } from "lucide-react";

interface AiAdvisorTabProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
  lang: string;
  t: (key: string) => string;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
}

const getPresetPrompts = (lang: string) => {
  switch (lang) {
    case 'en': return [
      "What is a stock?",
      "What does P/E Ratio (Price-to-Earnings) mean?",
      "How do I properly diversify my portfolio?",
      "What is the difference between technical and fundamental analysis?"
    ];
    case 'pt': return [
      "O que é uma ação na bolsa?",
      "O que significa a relação P/L (Preço sobre Lucro)?",
      "Como diversificar bem minha carteira?",
      "Qual a diferença entre análise técnica e fundamentalista?"
    ];
    case 'es': return [
      "¿Qué es una acción en bolsa?",
      "¿Qué significa la relación P/E (Precio-Ganancia)?",
      "¿Cómo diversificar correctamente una cartera?",
      "¿Diferencia entre análisis técnico y fundamental?"
    ];
    case 'de': return [
      "Was ist eine Aktie?",
      "Was bedeutet das KGV (Kurs-Gewinn-Verhältnis)?",
      "Wie kann ich mein Portfolio diversifizieren?",
      "Was ist der Unterschied zwischen technischer und fundamentaler Analyse?"
    ];
    case 'zh': return [
      "什麼是股票？",
      "什麼是本益比（P/E Ratio）？",
      "如何進行精準的資產配置與分散投資？",
      "技術面分析與基本面分析有何差異？"
    ];
    default: return [
      "Qu'est-ce qu'une action en bourse ?",
      "Que signifie le PE Ratio (Cours/Bénéfice) ?",
      "Comment bien diversifier son portefeuille ?",
      "Différence entre analyse technique et fondamentale ?"
    ];
  }
};

// Simple elegant Markdown compiler for rendering Gemini responses nicely inside React
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-slate-700 dark:text-slate-250 leading-relaxed text-xs sm:text-sm font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Warning alerts
        if (trimmed.startsWith("Avertissement :") || trimmed.startsWith("Attention :") || trimmed.startsWith("Warning :") || trimmed.startsWith("Disclaimer :")) {
          return (
            <div key={idx} className="bg-amber-50 dark:bg-amber-955/35 text-amber-900 dark:text-amber-300 px-3 py-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/55 my-2 text-xs flex items-start gap-1.5 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{line}</span>
            </div>
          );
        }

        // Header Title
        if (trimmed.startsWith("###")) {
          return (
            <h5 key={idx} className="text-slate-800 dark:text-slate-150 font-extrabold text-sm uppercase tracking-wide pt-2 pb-0.5">
              {trimmed.replace("###", "").trim()}
            </h5>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h4 key={idx} className="text-slate-800 dark:text-slate-150 font-black text-base pt-3 pb-1 border-b border-slate-50 dark:border-slate-800">
              {trimmed.replace("##", "").trim()}
            </h4>
          );
        }

        // Bullets List
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2 pl-4">
              <span className="text-indigo-505 text-indigo-500 font-black select-none">•</span>
              <span>{renderBold(content)}</span>
            </div>
          );
        }

        // standard line
        if (trimmed === "") {
          return <div key={idx} className="h-2" />;
        }

        return <p key={idx}>{renderBold(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to render bold strings: **text** -> strong
function renderBold(content: string) {
  const parts = content.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return content;

  return parts.map((part, index) => {
    // Odd indexes are the matched groups inside ** **
    if (index % 2 !== 0) {
      return <strong key={index} className="font-extrabold text-slate-905 text-slate-900 dark:text-white">{part}</strong>;
    }
    return part;
  });
}

export default function AiAdvisorTab({
  chatHistory,
  onSendMessage,
  isGenerating,
  lang,
  t,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation
}: AiAdvisorTabProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const presetPrompts = getPresetPrompts(lang);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = inputText.trim();
    if (!txt || isGenerating) return;

    onSendMessage(txt);
    setInputText("");
  };

  const handleSelectPreset = (preset: string) => {
    if (isGenerating) return;
    onSendMessage(preset);
  };

  const getChatLabel = (sender: string) => {
    if (sender === "user") {
      switch (lang) {
        case 'en': return "You";
        case 'pt': return "Você";
        case 'es': return "Usted";
        case 'de': return "Sie";
        case 'zh': return "您";
        default: return "Vous";
      }
    }
    return "Finance Bridge AI";
  };

  return (
    <div id="ai-advisor-tab" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[580px] animate-in fade-in duration-200">
      
      {/* Side Preset suggestions bar & Conversations */}
      <div className="lg:col-span-1 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-5 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-sm tracking-tight">{t("aiAdvisorTitle")}</h4>
          </div>

          {/* Conversations Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                {t("chatsTitle")}
              </span>
              <button
                type="button"
                onClick={onCreateConversation}
                disabled={isGenerating}
                className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={t("newChat")}
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Conversation list box */}
            <div className="max-h-[160px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => !isGenerating && onSelectConversation(conv.id)}
                    className={`group flex items-center justify-between p-2 rounded-xl transition text-xs font-semibold ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 cursor-default"
                        : isGenerating 
                        ? "bg-slate-50 dark:bg-slate-955 text-slate-400 dark:text-slate-500 border border-transparent cursor-not-allowed opacity-60"
                        : "bg-slate-50 dark:bg-slate-955 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-indigo-500 transition" />
                      <span className="truncate pr-1">{conv.title}</span>
                    </div>
                    
                    {!isGenerating && (
                      <button
                        type="button"
                        onClick={(e) => onDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-0.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-955/50 transition shrink-0 ml-1 cursor-pointer"
                        title={t("deleteChat")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preset Prompts Section */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              {t("aiAdvisorTitle")}
            </span>
            <p className="text-slate-400 dark:text-slate-450 text-[11px] leading-tight">
              {t("aiAdvisorDesc")}
            </p>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-2 border border-slate-100 dark:border-slate-800 bg-slate-55 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-indigo-100 dark:hover:border-indigo-900 rounded-xl transition text-[11px] font-semibold text-slate-600 dark:text-slate-350 disabled:opacity-50 cursor-pointer flex items-start gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-snug">{preset}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Investment disclaimer card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl text-[10px] text-slate-400 dark:text-slate-500 space-y-1 mt-4 shrink-0">
          <div className="flex items-center gap-1 text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t("warningTitle")}</span>
          </div>
          <p className="leading-normal text-slate-400 dark:text-slate-500">
            {t("warningDesc")}
          </p>
        </div>
      </div>


      {/* Main chats workspace feed */}
      <div className="lg:col-span-3 flex flex-col justify-between h-full min-h-[420px]">
        {/* Messages feed */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[460px] min-h-[300px] border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 font-sans"
        >
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-3.5">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-125" />
                <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-full flex items-center justify-center text-white">
                  <Bot className="w-7 h-7" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{t("emptyFeedTitle")}</h3>
                <p className="text-slate-400 dark:text-slate-400 text-xs max-w-sm sm:max-w-md mx-auto">
                  {t("emptyFeedDesc")}
                </p>
              </div>
            </div>
          )}

          {chatHistory.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={idx} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                
                {/* AI logo */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-705 text-white shrink-0 flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-2xs ${
                  isUser 
                    ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-br-none" 
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 rounded-bl-none"
                }`}>
                  {/* Timestamp and sender details */}
                  <div className={`text-[10px] mb-1 font-semibold ${isUser ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                    {getChatLabel(msg.sender)} • {msg.timestamp}
                  </div>

                  {isUser ? (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</p>
                  ) : (
                    <SimpleMarkdown text={msg.text} />
                  )}
                </div>
              </div>
            );
          })}

          {/* Chat active generating response trigger */}
          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white shrink-0 flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>{t("aiAnalyzing")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input prompt desk */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            disabled={isGenerating}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("chatPlaceholder")}
            className="flex-1 outline-hidden border border-slate-200 dark:border-slate-800 focus:border-indigo-500 bg-slate-50 dark:bg-slate-955 dark:text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-950 disabled:text-slate-400 text-white p-3.5 rounded-2xl transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
