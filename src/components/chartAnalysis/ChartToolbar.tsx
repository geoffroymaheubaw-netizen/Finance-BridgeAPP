import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  Hand,
  TrendingUp,
  Minus,
  MoveVertical,
  ArrowRight,
  Square,
  Circle,
  Triangle as TriangleIcon,
  Pentagon,
  AlignJustify,
  Sliders,
  Layers,
  Type,
  StickyNote,
  Tag,
  Smile,
  Pencil,
  Highlighter as HighlighterIcon,
  Eraser,
  Ruler,
  Camera,
  Undo2,
  Redo2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  SlidersHorizontal,
  Palette,
  X
} from 'lucide-react';
import { ToolType } from './types';

interface ChartToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  activeColor?: string;
  onChangeColor?: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearAll: () => void;
  onTakeScreenshot: () => void;
  onSelectEmoji: (emoji: string) => void;
  selectedEmoji: string;
  isAllHidden: boolean;
  onToggleHideAll: () => void;
  isAllLocked: boolean;
  onToggleLockAll: () => void;
}

interface ToolGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  tools: { id: ToolType; label: string; icon: React.ReactNode }[];
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  activeTool,
  onSelectTool,
  activeColor = '#3b82f6',
  onChangeColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearAll,
  onTakeScreenshot,
  onSelectEmoji,
  selectedEmoji,
  isAllHidden,
  onToggleHideAll,
  isAllLocked,
  onToggleLockAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGroupMenu, setActiveGroupMenu] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveGroupMenu(null);
        setShowEmojiPicker(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    select: true,
    lines: true,
    shapes: true,
    channels: true,
    fibonacci: true,
    annotations: true,
    freehand: true,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['🎯', '🚀', '🔥', '📈', '📉', '⚡', '💡', '💎', '🏆', '⚠️', '⭐', '✅'];

  const toolGroups: ToolGroup[] = [
    {
      id: 'select',
      name: 'Curseur & Navigation',
      icon: <MousePointer className="w-4 h-4" />,
      tools: [
        { id: 'select', label: 'Curseur de sélection', icon: <MousePointer className="w-4 h-4" /> },
        { id: 'pan', label: 'Déplacer le graphique', icon: <Hand className="w-4 h-4" /> },
      ],
    },
    {
      id: 'lines',
      name: 'Lignes & Tendance',
      icon: <TrendingUp className="w-4 h-4" />,
      tools: [
        { id: 'line', label: 'Ligne / Segment', icon: <Minus className="w-4 h-4" /> },
        { id: 'trendline', label: 'Ligne de tendance', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'horizontal_line', label: 'Ligne horizontale', icon: <Minus className="w-4 h-4 rotate-0" /> },
        { id: 'vertical_line', label: 'Ligne verticale', icon: <MoveVertical className="w-4 h-4" /> },
        { id: 'ray', label: 'Rayon', icon: <ArrowRight className="w-4 h-4" /> },
        { id: 'arrow', label: 'Flèche', icon: <ArrowRight className="w-4 h-4" /> },
      ],
    },
    {
      id: 'shapes',
      name: 'Formes géométriques',
      icon: <Square className="w-4 h-4" />,
      tools: [
        { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-4 h-4" /> },
        { id: 'circle', label: 'Cercle', icon: <Circle className="w-4 h-4" /> },
        { id: 'ellipse', label: 'Ellipse', icon: <Circle className="w-4 h-4 scale-x-125" /> },
        { id: 'triangle', label: 'Triangle', icon: <TriangleIcon className="w-4 h-4" /> },
        { id: 'polygon', label: 'Polygone', icon: <Pentagon className="w-4 h-4" /> },
      ],
    },
    {
      id: 'channels',
      name: 'Canaux & Régression',
      icon: <AlignJustify className="w-4 h-4" />,
      tools: [
        { id: 'parallel_channel', label: 'Canal parallèle', icon: <AlignJustify className="w-4 h-4" /> },
        { id: 'regression_channel', label: 'Canal de régression', icon: <Sliders className="w-4 h-4" /> },
      ],
    },
    {
      id: 'fibonacci',
      name: 'Outils Fibonacci',
      icon: <Layers className="w-4 h-4" />,
      tools: [
        { id: 'fib_retracement', label: 'Retracement Fibonacci', icon: <Layers className="w-4 h-4" /> },
        { id: 'fib_extension', label: 'Extension Fibonacci', icon: <Layers className="w-4 h-4 rotate-45" /> },
      ],
    },
    {
      id: 'annotations',
      name: 'Annotations & Équiquettes',
      icon: <Type className="w-4 h-4" />,
      tools: [
        { id: 'text', label: 'Texte', icon: <Type className="w-4 h-4" /> },
        { id: 'note', label: 'Note informative', icon: <StickyNote className="w-4 h-4" /> },
        { id: 'price_label', label: 'Étiquette de prix', icon: <Tag className="w-4 h-4" /> },
        { id: 'emoji', label: 'Emoji / Stamp', icon: <Smile className="w-4 h-4" /> },
      ],
    },
    {
      id: 'freehand',
      name: 'Dessin libre & Surligneur',
      icon: <Pencil className="w-4 h-4" />,
      tools: [
        { id: 'brush', label: 'Pinceau libre', icon: <Pencil className="w-4 h-4" /> },
        { id: 'highlighter', label: 'Surligneur', icon: <HighlighterIcon className="w-4 h-4" /> },
      ],
    },
  ];

  const toggleAccordion = (groupId: string) => {
    setOpenAccordions((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div
      ref={toolbarRef}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={`absolute top-3 left-3 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl select-none transition-all duration-300 rounded-2xl max-h-[calc(100%-1.5rem)] flex flex-col ${
        isExpanded
          ? 'w-80 sm:w-96 p-3.5'
          : 'w-14 sm:w-16 p-2 items-center'
      }`}
    >
      {/* Header */}
      {isExpanded && (
        <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              Analyse
            </span>
          </div>
        </div>
      )}

      {/* Main Container - Scrollable with Scrollbar on the Left in both Expanded and Compact views */}
      {isExpanded ? (
        <div
          style={{ scrollBehavior: 'smooth', direction: 'rtl' }}
          className="flex-1 overflow-y-auto custom-scrollbar px-1.5 flex flex-col gap-2 w-full"
        >
          <div style={{ direction: 'ltr' }} className="flex flex-col gap-2 w-full">
            {/* Undo / Redo in Expanded */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Annuler</span>
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span>Rétablir</span>
              </button>
            </div>

            {/* Line Color Picker in Expanded */}
            {onChangeColor && (
              <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Couleur du tracé</span>
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-2xs"
                    style={{ backgroundColor: activeColor }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {['#089981', '#f23645', '#3b82f6', '#8b5cf6', '#f59e0b', '#ffffff', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={`Couleur: ${c}`}
                      onClick={() => onChangeColor(c)}
                      className={`w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 transition-transform hover:scale-125 cursor-pointer shrink-0 ${
                        activeColor.toLowerCase() === c.toLowerCase()
                          ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 scale-110'
                          : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <label
                    title="Choisir une couleur personnalisée"
                    className="relative w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 transition-transform hover:scale-125 cursor-pointer overflow-hidden flex items-center justify-center shrink-0 bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500"
                  >
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => onChangeColor(e.target.value)}
                      className="absolute -inset-1 opacity-0 w-8 h-8 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Accordions in Expanded */}
            {toolGroups.map((group) => {
              const isAccordionOpen = openAccordions[group.id] ?? true;
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(group.id)}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">{group.icon}</span>
                      <span>{group.name}</span>
                    </div>
                    {isAccordionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isAccordionOpen && (
                    <div className="p-1 flex flex-col gap-0.5 border-t border-slate-200/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60">
                      {group.tools.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => {
                            onSelectTool(tool.id);
                            if (tool.id === 'emoji') {
                              setShowEmojiPicker(true);
                            }
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            activeTool === tool.id
                              ? 'bg-indigo-600 text-white shadow-xs font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          {tool.icon}
                          <span>{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Extra Tools in Expanded */}
            <div className="pt-1 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => onSelectTool('measure')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTool === 'measure'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Ruler className="w-4 h-4 text-indigo-500" />
                <span>Outil de mesure (Règle)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTool('eraser')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Eraser className="w-4 h-4 text-amber-500" />
                <span>Gomme (Effacer un dessin)</span>
              </button>
            </div>

            <div className="w-full my-1 border-t border-slate-200/50 dark:border-slate-800/60" />

            {/* Bottom Actions in Expanded */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={onToggleLockAll}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isAllLocked
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAllLocked ? 'Déverrouiller' : 'Verrouiller'}</span>
              </button>

              <button
                type="button"
                onClick={onToggleHideAll}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isAllHidden
                    ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {isAllHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isAllHidden ? 'Afficher tout' : 'Masquer tout'}</span>
              </button>

              <button
                type="button"
                onClick={onTakeScreenshot}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-500" />
                <span>Capture PNG</span>
              </button>

              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tout effacer</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Compact Mode Column with Scrollbar on the Left */
        <div
          ref={scrollRef}
          onScroll={() => setActiveGroupMenu(null)}
          style={{ scrollBehavior: 'smooth', direction: 'rtl' }}
          className="flex-1 overflow-y-auto custom-scrollbar px-1 flex flex-col items-center gap-1 w-full"
        >
          <div style={{ direction: 'ltr' }} className="flex flex-col items-center gap-1 w-full">
            {/* Undo / Redo */}
            <div className="flex flex-col gap-1 pb-1.5 border-b border-slate-200/50 dark:border-slate-800/60 w-full items-center">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                title="Annuler (Ctrl+Z)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                title="Rétablir (Ctrl+Y)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Active Color Circle in Compact Mode */}
            {onChangeColor && (
              <div className="pb-1.5 border-b border-slate-200/50 dark:border-slate-800/60 w-full flex justify-center">
                <label
                  title="Changer la couleur des lignes"
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 shadow-md transition-transform hover:scale-110 cursor-pointer overflow-hidden flex items-center justify-center relative ring-1 ring-slate-300 dark:ring-slate-700"
                  style={{ backgroundColor: activeColor }}
                >
                  <input
                    type="color"
                    value={activeColor}
                    onChange={(e) => onChangeColor(e.target.value)}
                    className="absolute -inset-2 opacity-0 w-12 h-12 cursor-pointer"
                  />
                </label>
              </div>
            )}

            {/* Group Tool Icons */}
            <div className="flex flex-col gap-1 w-full items-center">
              {toolGroups.map((group) => {
                const isGroupActive = group.tools.some((t) => t.id === activeTool);
                const currentToolInGroup = group.tools.find((t) => t.id === activeTool) || group.tools[0];
                const isOpen = activeGroupMenu === group.id;

                return (
                  <div key={group.id} className="relative w-full flex justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(currentToolInGroup.id);
                        if (currentToolInGroup.id === 'emoji') {
                          setShowEmojiPicker(true);
                        }
                        if (group.tools.length > 1) {
                          if (isOpen) {
                            setActiveGroupMenu(null);
                          } else {
                            setActiveGroupMenu(group.id);
                          }
                        } else {
                          setActiveGroupMenu(null);
                        }
                      }}
                      className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center w-9 h-9 ${
                        isGroupActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={`${group.name} (${currentToolInGroup.label})`}
                    >
                      {currentToolInGroup.icon}
                      {group.tools.length > 1 && (
                        <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Individual Tools: Measure & Eraser */}
              <button
                type="button"
                onClick={() => {
                  onSelectTool('measure');
                  setActiveGroupMenu(null);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center w-9 h-9 ${
                  activeTool === 'measure'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Outil de mesure (Règle)"
              >
                <Ruler className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTool('eraser');
                  setActiveGroupMenu(null);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center w-9 h-9 ${
                  activeTool === 'eraser'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Gomme (Effacer un dessin)"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full my-1 border-t border-slate-200/50 dark:border-slate-800/60" />

            {/* Action Toggles: Lock, Hide, Camera, Clear */}
            <div className="flex flex-col gap-1 w-full items-center">
              <button
                type="button"
                onClick={onToggleLockAll}
                title={isAllLocked ? 'Déverrouiller les dessins' : 'Verrouiller les dessins'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center w-9 h-9 ${
                  isAllLocked
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Lock className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onToggleHideAll}
                title={isAllHidden ? 'Afficher tous les dessins' : 'Masquer tous les dessins'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center w-9 h-9 ${
                  isAllHidden
                    ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isAllHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onTakeScreenshot}
                title="Capture d'écran du graphique"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
              >
                <Camera className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                type="button"
                onClick={onClearAll}
                title="Effacer tous les dessins"
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Submenu Popover in Compact Mode (placed outside overflow container to prevent clipping) */}
      {!isExpanded && activeGroupMenu && (() => {
        const group = toolGroups.find((g) => g.id === activeGroupMenu);
        if (!group) return null;

        return (
          <div
            className="absolute left-full top-0 ml-3 py-2 px-1.5 min-w-[220px] max-h-[280px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1.5 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                {group.icon}
                <span className="text-slate-700 dark:text-slate-200">{group.name}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGroupMenu(null);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 overflow-y-scroll custom-scrollbar max-h-[160px] pr-2 pl-0.5">
              {group.tools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTool(tool.id);
                    if (tool.id === 'emoji') {
                      setShowEmojiPicker(true);
                    }
                    setActiveGroupMenu(null);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTool === tool.id
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Emoji Stamp Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute left-full top-0 ml-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 w-48 max-h-[320px] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Choisir un Emoji</span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 overflow-y-auto custom-scrollbar max-h-[240px] pr-1">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelectEmoji(emoji);
                  onSelectTool('emoji');
                  setShowEmojiPicker(false);
                }}
                className={`text-xl p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${
                  selectedEmoji === emoji ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-500' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
