import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Conversation } from "../types";
import { 
  Send, 
  Bot, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  Plus, 
  Trash2, 
  MessageSquare,
  Image as ImageIcon,
  X,
  Maximize2,
  UploadCloud
} from "lucide-react";

interface AiAdvisorTabProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, image?: string) => Promise<void> | void;
  isGenerating: boolean;
  lang: string;
  t: (key: string, params?: Record<string, string | number>) => string;
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

// Enhanced elegant Markdown compiler for rendering Gemini responses nicely inside React
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-2.5 text-slate-700 dark:text-slate-200 leading-relaxed text-xs sm:text-sm font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Warning alerts / Disclaimers
        if (
          trimmed.startsWith("Avertissement :") || 
          trimmed.startsWith("Attention :") || 
          trimmed.startsWith("Warning :") || 
          trimmed.startsWith("Disclaimer :") ||
          trimmed.startsWith("_Avertissement :") ||
          trimmed.startsWith("_Disclaimer :") ||
          trimmed.startsWith("*Avertissement :") ||
          trimmed.startsWith("*Disclaimer :")
        ) {
          const cleanLine = trimmed.replace(/^[_*]+|[_*]+$/g, '');
          return (
            <div key={idx} className="bg-amber-500/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-3.5 py-2.5 rounded-xl border border-amber-500/30 dark:border-amber-700/50 my-2.5 text-xs flex items-start gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{renderFormattedText(cleanLine)}</span>
            </div>
          );
        }

        // Horizontal dividers
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <hr key={idx} className="my-3 border-slate-200 dark:border-slate-800" />;
        }

        // Blockquotes
        if (trimmed.startsWith(">")) {
          const quoteContent = trimmed.replace(/^>\s?/, "");
          return (
            <div key={idx} className="border-l-4 border-indigo-500/60 dark:border-indigo-400/60 pl-3.5 py-1.5 my-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r-lg text-slate-700 dark:text-slate-300 italic text-xs sm:text-sm">
              {renderFormattedText(quoteContent)}
            </div>
          );
        }

        // Headers
        if (trimmed.startsWith("####")) {
          return (
            <h6 key={idx} className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider pt-2 pb-0.5">
              {renderFormattedText(trimmed.replace("####", "").trim())}
            </h6>
          );
        }
        if (trimmed.startsWith("###")) {
          return (
            <h5 key={idx} className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight pt-2.5 pb-0.5 flex items-center gap-1.5">
              {renderFormattedText(trimmed.replace("###", "").trim())}
            </h5>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h4 key={idx} className="text-slate-900 dark:text-white font-black text-base sm:text-lg pt-3 pb-1 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
              {renderFormattedText(trimmed.replace("##", "").trim())}
            </h4>
          );
        }

        // Numbered List (e.g. 1. , 2. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center mt-0.5">
                {num}
              </span>
              <div className="flex-1">{renderFormattedText(content)}</div>
            </div>
          );
        }

        // Sub-bullets (indented)
        if (line.startsWith("   *") || line.startsWith("   -") || line.startsWith("  *") || line.startsWith("  -")) {
          const content = trimmed.replace(/^[-*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-7 my-0.5 text-slate-600 dark:text-slate-300">
              <span className="text-indigo-400 select-none font-bold text-xs">◦</span>
              <div className="flex-1">{renderFormattedText(content)}</div>
            </div>
          );
        }

        // Standard Bullets List
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-3 my-1">
              <span className="text-indigo-500 dark:text-indigo-400 font-black select-none">•</span>
              <div className="flex-1">{renderFormattedText(content)}</div>
            </div>
          );
        }

        // Empty line
        if (trimmed === "") {
          return <div key={idx} className="h-1.5" />;
        }

        return <p key={idx} className="leading-relaxed">{renderFormattedText(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to render bold, italic, code, and math tokens safely
function renderFormattedText(content: string): React.ReactNode {
  if (!content) return "";

  // Split by inline code first: `code`
  const codeParts = content.split(/`([^`]+)`/g);
  return codeParts.map((codePart, cIdx) => {
    if (cIdx % 2 !== 0) {
      return (
        <code key={cIdx} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
          {codePart}
        </code>
      );
    }

    // Split by bold: **bold**
    const boldParts = codePart.split(/\*\*([^*]+)\*\*/g);
    return boldParts.map((boldPart, bIdx) => {
      if (bIdx % 2 !== 0) {
        return (
          <strong key={bIdx} className="font-extrabold text-slate-900 dark:text-white">
            {renderItalic(boldPart)}
          </strong>
        );
      }
      return renderItalic(boldPart);
    });
  });
}

function renderItalic(text: string): React.ReactNode {
  // Split by *italic* or _italic_
  const parts = text.split(/(?:_([^_]+)_|\*([^*]+)\*)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part === undefined) return null;
    if (i % 3 !== 0) {
      return <em key={i} className="italic text-slate-800 dark:text-slate-200">{part}</em>;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const processImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError(t("imageUploadError"));
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t("imageUploadError"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      if (base64Data) {
        setSelectedImage(base64Data);
        setSelectedImageName(file.name);
      }
    };
    reader.onerror = () => {
      setUploadError(t("imageUploadError"));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isGenerating) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isGenerating) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isGenerating) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          break;
        }
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageName(null);
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = inputText.trim();
    if ((!txt && !selectedImage) || isGenerating) return;

    onSendMessage(txt, selectedImage || undefined);
    setInputText("");
    setSelectedImage(null);
    setSelectedImageName(null);
    setUploadError(null);
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
    <div 
      id="ai-advisor-tab" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-white dark:bg-slate-900 border ${
        isDragging 
          ? "border-indigo-500 ring-2 ring-indigo-500/20" 
          : "border-slate-100 dark:border-slate-800"
      } rounded-3xl p-4 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[580px] transition-all`}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-30 bg-indigo-600/10 dark:bg-indigo-950/40 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-indigo-500 text-indigo-600 dark:text-indigo-400 space-y-2">
          <UploadCloud className="w-12 h-12 animate-bounce" />
          <span className="font-extrabold text-sm sm:text-base">
            {t("attachImage")}
          </span>
        </div>
      )}

      {/* Side Preset suggestions bar & Conversations */}
      <div className="lg:col-span-1 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-5 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm tracking-tight">{t("aiAdvisorTitle")}</h4>
          </div>

          {/* Conversations Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("chatsTitle")}
              </span>
              <button
                type="button"
                id="btn-new-ai-chat"
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
                        ? "bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-transparent cursor-not-allowed opacity-60"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent cursor-pointer"
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
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-0.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-950/50 transition shrink-0 ml-1 cursor-pointer"
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("aiAdvisorTitle")}
            </span>
            <p className="text-slate-400 dark:text-slate-400 text-[11px] leading-tight">
              {t("aiAdvisorDesc")}
            </p>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-indigo-100 dark:hover:border-indigo-900 rounded-xl transition text-[11px] font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-50 cursor-pointer flex items-start gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-snug">{preset}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Investment disclaimer card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl text-[10px] text-slate-400 dark:text-slate-500 space-y-1 mt-4 shrink-0">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
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
          className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[460px] min-h-[300px] border-b border-slate-100 dark:border-slate-800 pb-4 mb-3 font-sans"
        >
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-3.5">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-125" />
                <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
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
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white shrink-0 flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-2xs ${
                  isUser 
                    ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-br-none" 
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 rounded-bl-none"
                }`}>
                  {/* Timestamp and sender details */}
                  <div className={`text-[10px] mb-1.5 font-semibold ${isUser ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                    {getChatLabel(msg.sender)} • {msg.timestamp}
                  </div>

                  {/* Attached user image thumbnail if present */}
                  {msg.image && (
                    <div className="mb-2.5">
                      <div 
                        onClick={() => setPreviewModalImage(msg.image || null)}
                        className="group relative inline-block rounded-xl overflow-hidden border border-white/20 dark:border-white/10 cursor-pointer shadow-xs max-w-xs hover:opacity-95 transition"
                      >
                        <img 
                          src={msg.image} 
                          alt="Chart or attachment" 
                          className="max-h-56 max-w-full rounded-xl object-contain bg-black/10" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                          <Maximize2 className="w-4 h-4" />
                          <span>Zoom</span>
                        </div>
                      </div>
                    </div>
                  )}

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

        {/* Upload error banner if any */}
        {uploadError && (
          <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Image Attachment Preview Bar */}
        {selectedImage && (
          <div className="mb-2 p-2 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-indigo-200 dark:border-indigo-800">
                <img 
                  src={selectedImage} 
                  alt="Attachment preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 truncate">
                  {selectedImageName || t("imageAttached")}
                </div>
                <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400 font-semibold">
                  {t("imageAttached")}
                </div>
              </div>
            </div>
            <button
              type="button"
              id="btn-remove-selected-image"
              onClick={removeSelectedImage}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition cursor-pointer shrink-0"
              title={t("removeImage")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input prompt desk */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
          />

          {/* Attachment button */}
          <button
            type="button"
            id="btn-attach-chat-image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className={`p-3 rounded-2xl border transition cursor-pointer shrink-0 flex items-center justify-center ${
              selectedImage 
                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" 
                : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={t("attachImage")}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text input with paste support */}
          <input
            type="text"
            id="ai-chat-text-input"
            value={inputText}
            disabled={isGenerating}
            onPaste={handlePaste}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={selectedImage ? (lang === "fr" ? "Posez une question sur cette image ou envoyez directement..." : "Ask a question about this image or send directly...") : t("chatPlaceholder")}
            className="flex-1 outline-hidden border border-slate-200 dark:border-slate-800 focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 dark:text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition"
          />

          {/* Submit send button */}
          <button
            type="submit"
            id="btn-send-ai-message"
            disabled={(!inputText.trim() && !selectedImage) || isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-950 disabled:text-slate-400 text-white p-3.5 rounded-2xl transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl p-2 border border-slate-800 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewModalImage} 
              alt="Full preview" 
              className="max-h-[82vh] max-w-full rounded-xl object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
