import React, { useState } from 'react';
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
  PanelLeftOpen,
  PanelLeftClose,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { ToolType } from './types';

interface ChartToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
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
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ direction: 'rtl' }}
      className={`absolute top-3 left-3 z-30 max-h-[calc(100%-1.5rem)] overflow-y-auto custom-scrollbar bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl select-none transition-all duration-300 rounded-2xl ${
        isExpanded ? 'w-64 sm:w-72 p-3' : 'w-11 sm:w-12 p-1.5'
      }`}
    >
      <div style={{ direction: 'ltr' }} className={isExpanded ? 'w-full' : 'w-full flex flex-col items-center gap-1.5'}>
      {/* Header / Expand Toggle Button on the Left */}
      {isExpanded ? (
        <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            title="Réduire la bande d'outils"
            className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
          >
            <PanelLeftClose className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Réduire</span>
          </button>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              Analyse
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/80 w-full">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            title="Dérouler la bande d'analyse (Voir toutes les options)"
            className="w-full p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Undo / Redo in Compact vs Expanded */}
      {!isExpanded ? (
        <div className="flex flex-col gap-1 pb-1.5 border-b border-slate-200/50 dark:border-slate-800/60">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Annuler (Ctrl+Z)"
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Rétablir (Ctrl+Y)"
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
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
      )}

      {/* Main Tools list: Expanded view vs Compact view */}
      {isExpanded ? (
        <div className="flex flex-col gap-2">
          {toolGroups.map((group) => {
            const isAccordionOpen = openAccordions[group.id] ?? true;
            return (
              <div
                key={group.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
              >
                {/* Accordion Group Header */}
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

                {/* Accordion Body */}
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

          {/* Individual Extra Tools: Measure & Eraser */}
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
        </div>
      ) : (
        /* Compact Mode Icons List */
        <div className="flex flex-col gap-1">
          {toolGroups.map((group) => {
            const isGroupActive = group.tools.some((t) => t.id === activeTool);
            const currentToolInGroup = group.tools.find((t) => t.id === activeTool) || group.tools[0];
            const isOpen = activeGroupMenu === group.id;

            return (
              <div key={group.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    if (group.tools.length === 1) {
                      onSelectTool(group.tools[0].id);
                      setActiveGroupMenu(null);
                    } else {
                      setActiveGroupMenu(isOpen ? null : group.id);
                    }
                  }}
                  className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    isGroupActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={group.name}
                >
                  {currentToolInGroup.icon}
                  {group.tools.length > 1 && (
                    <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                  )}
                </button>

                {/* Submenu Popover in compact mode */}
                {isOpen && (
                  <div className="absolute left-full top-0 ml-2 py-1.5 px-1 min-w-[200px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
                      <span>{group.name}</span>
                      <button
                        onClick={() => setActiveGroupMenu(null)}
                        className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {group.tools.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => {
                            onSelectTool(tool.id);
                            if (tool.id === 'emoji') {
                              setShowEmojiPicker(true);
                            }
                            setActiveGroupMenu(null);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            activeTool === tool.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          {tool.icon}
                          <span>{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              onSelectTool('measure');
              setActiveGroupMenu(null);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTool === 'measure'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Outil de mesure (RèglePrix/Temps)"
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTool('eraser');
              setActiveGroupMenu(null);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Gomme (Cliquer pour supprimer un dessin)"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full my-1 border-t border-slate-200/50 dark:border-slate-800/60" />

      {/* Action Toggles: Lock All, Hide All, Screenshot, Clear All */}
      {isExpanded ? (
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
      ) : (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onToggleLockAll}
            title={isAllLocked ? 'Déverrouiller les dessins' : 'Verrouiller les dessins'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
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
            className={`p-2 rounded-xl transition-all cursor-pointer ${
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
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClearAll}
            title="Effacer tous les dessins"
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Stamp Picker Modal/Popover */}
      {showEmojiPicker && (
        <div className="absolute left-full top-24 ml-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 w-48 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Choisir un Emoji</span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelectEmoji(emoji);
                  onSelectTool('emoji');
                  setShowEmojiPicker(false);
                }}
                className={`text-xl p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-110 cursor-pointer ${
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
    </div>
  );
};
