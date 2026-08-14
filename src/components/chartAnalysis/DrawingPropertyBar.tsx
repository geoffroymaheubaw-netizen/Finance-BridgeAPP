import React from 'react';
import {
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Palette,
  Sliders,
  Type as TypeIcon,
  X
} from 'lucide-react';
import { DrawingShape, ShapeStyle } from './types';

interface DrawingPropertyBarProps {
  selectedShape: DrawingShape;
  onUpdateStyle: (patch: Partial<ShapeStyle>) => void;
  onUpdateText?: (text: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#089981', // TradingView Green
  '#f23645', // TradingView Red
  '#3b82f6', // Bright Blue
  '#8b5cf6', // Violet
  '#f59e0b', // Amber / Gold
  '#ec4899', // Pink
  '#ffffff', // Pure White
  '#64748b', // Slate Gray
  '#0f172a', // Dark Navy
];

const getFillFromColor = (c: string) => {
  if (c.startsWith('#') && c.length === 7) {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.18)`;
  }
  return 'rgba(59, 130, 246, 0.15)';
};

export const DrawingPropertyBar: React.FC<DrawingPropertyBarProps> = ({
  selectedShape,
  onUpdateStyle,
  onUpdateText,
  onDuplicate,
  onDelete,
  onToggleLock,
  onBringToFront,
  onSendToBack,
  onClose,
}) => {
  const { style, isLocked, type, text } = selectedShape;
  const barRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY || e.deltaX;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      ref={barRef}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-slate-100 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl text-xs select-none max-w-[92%] overflow-x-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <span className="font-semibold text-slate-500 dark:text-slate-400 capitalize pr-2 border-r border-slate-200 dark:border-slate-800 shrink-0">
        {type.replace('_', ' ')}
      </span>

      {/* Color Palette Buttons */}
      <div className="flex items-center gap-1 pl-1">
        <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            title={`Couleur: ${c}`}
            onClick={() => onUpdateStyle({ strokeColor: c, fillColor: getFillFromColor(c), textColor: c })}
            className={`w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 transition-transform hover:scale-125 cursor-pointer shrink-0 ${
              style.strokeColor?.toLowerCase() === c.toLowerCase()
                ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 scale-110'
                : ''
            }`}
            style={{ backgroundColor: c }}
          />
        ))}

        {/* Custom Color Input */}
        <label
          title="Choisir une couleur personnalisée"
          className="relative w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 transition-transform hover:scale-125 cursor-pointer overflow-hidden flex items-center justify-center shrink-0 bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500"
        >
          <input
            type="color"
            value={style.strokeColor || '#3b82f6'}
            onChange={(e) => {
              const hex = e.target.value;
              onUpdateStyle({ strokeColor: hex, fillColor: getFillFromColor(hex), textColor: hex });
            }}
            className="absolute -inset-1 opacity-0 w-8 h-8 cursor-pointer"
          />
        </label>
      </div>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 my-auto" />

      {/* Line Thickness */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((width) => (
          <button
            key={width}
            type="button"
            onClick={() => onUpdateStyle({ strokeWidth: width })}
            className={`px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              style.strokeWidth === width
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {width}px
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 my-auto" />

      {/* Line Style */}
      <div className="flex items-center gap-1">
        {(['solid', 'dashed', 'dotted'] as const).map((lineStyle) => (
          <button
            key={lineStyle}
            type="button"
            onClick={() => onUpdateStyle({ strokeStyle: lineStyle })}
            className={`px-2 py-0.5 rounded-md capitalize transition-all cursor-pointer ${
              style.strokeStyle === lineStyle
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {lineStyle === 'solid' ? 'Plein' : lineStyle === 'dashed' ? 'Tirés' : 'Points'}
          </button>
        ))}
      </div>

      {/* Text input if shape supports text */}
      {(type === 'text' || type === 'note' || type === 'price_label') && onUpdateText && (
        <>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 my-auto" />
          <div className="flex items-center gap-1">
            <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={text || ''}
              onChange={(e) => onUpdateText(e.target.value)}
              placeholder="Texte..."
              className="w-28 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs border border-slate-200 dark:border-slate-700"
            />
          </div>
        </>
      )}

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 my-auto" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBringToFront}
          title="Mettre au premier plan"
          className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onSendToBack}
          title="Mettre en arrière plan"
          className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          title="Dupliquer"
          className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleLock}
          title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
          className={`p-1 rounded-lg transition-all cursor-pointer ${
            isLocked
              ? 'bg-amber-500 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="Supprimer (Suppr)"
          className="p-1 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          title="Fermer la barre"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer ml-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
