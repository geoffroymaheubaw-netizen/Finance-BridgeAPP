import React from "react";
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
  AlignJustify,
  Layers,
  Type,
  StickyNote,
  Tag,
  Pencil,
  Highlighter,
  Camera,
  Undo2,
  Redo2,
  Lock,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  Target
} from "lucide-react";

interface DiagramProps {
  type: "toolbar_overview" | "support_resistance" | "channels_range" | "fibonacci_levels" | "trading_plan";
}

export const ChartAnalysisLessonDiagram: React.FC<DiagramProps> = ({ type }) => {
  if (type === "toolbar_overview") {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">BARRE D'ANALYSE — SITUATION SUR LE GRAPHIQUE</span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
            Haut Gauche du Graphique
          </span>
        </div>

        {/* Visual Map of the Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Left: Toolbar Mockup */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 border-b border-slate-800/80 pb-1.5">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Menu Analyse
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-1.5 rounded-lg bg-indigo-950/50 border border-indigo-800/50 flex items-center justify-between text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <MousePointer className="w-3 h-3 text-indigo-400" /> 1. Curseur & Pan
                </span>
                <span className="text-[9px] bg-indigo-900/60 px-1.5 py-0.2 rounded font-mono">Sélect</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> 2. Lignes & Tendances
                </span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">6 outils</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Square className="w-3 h-3 text-amber-400" /> 3. Formes Géométriques
                </span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">Rect, Rond</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <AlignJustify className="w-3 h-3 text-cyan-400" /> 4. Canaux Parallèles
                </span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">Régression</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-purple-400" /> 5. Fibonacci
                </span>
                <span className="text-[9px] bg-purple-950/60 text-purple-300 px-1.5 py-0.2 rounded">Retracement</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Type className="w-3 h-3 text-yellow-400" /> 6. Annotations & Prix
                </span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">Tags, Notes</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Pencil className="w-3 h-3 text-rose-400" /> 7. Pinceau Libre
                </span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">Surligneur</span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1"><Undo2 className="w-3 h-3" /><Redo2 className="w-3 h-3" /> Historique</span>
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /><Eye className="w-3 h-3" /><Camera className="w-3 h-3" /> Actions</span>
            </div>
          </div>

          {/* Right: Key Tool Explanations & Pointer Callouts */}
          <div className="md:col-span-2 space-y-2.5 flex flex-col justify-center">
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">Bouton d'Ouverture / Fermeture (Flèche)</span>
                <span className="text-slate-400 text-[10px] leading-tight">
                  En haut à gauche du graphique, cliquez sur la petite flèche pour basculer entre la barre compacte ultra-fine et le panneau d'outils étendu.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">Palette de Couleurs & Épaisseur</span>
                <span className="text-slate-400 text-[10px] leading-tight">
                  Sélectionnez votre couleur (Vert pour les supports d'achat, Rouge pour les résistances, Bleu/Doré pour Fibonacci) avant ou après le tracé.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">Verrouillage & Capture d'Écran</span>
                <span className="text-slate-400 text-[10px] leading-tight">
                  Le cadenas <Lock className="w-2.5 h-2.5 inline mx-0.5 text-amber-400" /> évite de déplacer vos lignes par mégarde pendant la navigation. L'appareil photo exporte votre analyse nette en 1 clic.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "support_resistance") {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">STRATÉGIE 1 : TRACÉ DE SUPPORTS & RÉSISTANCES</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
            Outil : Ligne Horizontale & Tendance
          </span>
        </div>

        {/* Diagram Canvas Simulation */}
        <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800 overflow-hidden min-h-[140px] flex flex-col justify-between">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Resistance Line (Red) */}
          <div className="relative z-10 flex items-center justify-between border-b-2 border-dashed border-rose-500/80 pt-1 pb-1">
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
              🔴 RÉSISTANCE MAJEURE (Plafond de vente / Prise de profit)
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-400">150.00 €</span>
          </div>

          {/* Rejection / Bounce visual markers */}
          <div className="relative z-10 flex justify-around items-center py-4">
            <div className="text-center">
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono block mb-1">Rejet 1 ⬇️</span>
              <div className="w-2 h-2 rounded-full bg-rose-500 mx-auto animate-ping" />
            </div>
            <div className="text-center">
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono block mb-1">Rebond 1 ⬆️</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
            </div>
            <div className="text-center">
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono block mb-1">Rejet 2 ⬇️</span>
              <div className="w-2 h-2 rounded-full bg-rose-500 mx-auto" />
            </div>
            <div className="text-center">
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono block mb-1">🎯 POINT D'ACHAT IDÉAL ⬆️</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mx-auto ring-4 ring-emerald-500/30" />
            </div>
          </div>

          {/* Support Line (Green) */}
          <div className="relative z-10 flex items-center justify-between border-t-2 border-dashed border-emerald-500/80 pt-1 pb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              🟢 SUPPORT MAJEUR (Plancher d'achat / Zone de rebond)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">120.00 €</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Règle d'application :</strong> Cliquez sur <code className="text-indigo-300 bg-slate-800 px-1 rounded">Ligne Horizontale</code> dans la barre d'outils, puis cliquez sur au moins 2 creux consécutifs pour fixer le support d'achat, et sur 2 sommets pour fixer la résistance.
        </p>
      </div>
    );
  }

  if (type === "channels_range") {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <AlignJustify className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">STRATÉGIE 2 : CANAUX PARALLÈLES & CASSURE (BREAKOUT)</span>
          </div>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30">
            Outils : Canal Parallèle & Rectangle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Left: Parallel Channel */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Canal Ascendant
            </span>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[10px]">
              <div className="flex justify-between text-rose-400 font-mono border-b border-slate-800/80 pb-0.5">
                <span>Borne Haute (Résistance)</span>
                <span>Vente 📉</span>
              </div>
              <div className="text-center text-slate-500 text-[9px] py-1 font-mono">
                ↗️ Tendance de fond haussière ↗️
              </div>
              <div className="flex justify-between text-emerald-400 font-mono border-t border-slate-800/80 pt-0.5">
                <span>Borne Basse (Support)</span>
                <span>Achat 📈</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Tracé en 3 clics avec l'outil <strong>Canal Parallèle</strong> : reliez les creux puis étirez vers le sommet opposé.
            </p>
          </div>

          {/* Right: Breakout & Pullback */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5" /> Cassure de Range (Breakout)
            </span>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-emerald-400 font-mono">
                <span>🚀 Cassure avec Volume</span>
                <span>Signal +</span>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/50 p-1 rounded text-center text-amber-200 text-[9px] font-mono">
                Zone de Rectangle / Consolidation
              </div>
              <div className="flex items-center justify-between text-indigo-300 font-mono">
                <span>🔄 Retest Pullback</span>
                <span>Confirmation Entrée</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Utilisez l'outil <strong>Rectangle</strong> pour encadrer la phase de range et anticiper l'explosion directionnelle des cours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "fibonacci_levels") {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-200">STRATÉGIE 3 : RETRACEMENTS & EXTENSIONS FIBONACCI</span>
          </div>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/30">
            Outil : Retracement Fibonacci
          </span>
        </div>

        {/* Fibonacci Table Mock */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 text-slate-300">
            <span className="font-bold text-purple-300">0.0% (Sommet - Swing High)</span>
            <span>160.00 €</span>
            <span className="text-[9px] text-slate-400">Fin de l'impulsion</span>
          </div>
          <div className="flex items-center justify-between p-1 rounded bg-slate-900/30 text-slate-400">
            <span>23.6% / 38.2% (Repli modéré)</span>
            <span>137.00 €</span>
            <span className="text-[9px] text-blue-400">Tendance très forte</span>
          </div>
          <div className="flex items-center justify-between p-1 rounded bg-slate-900/30 text-slate-400">
            <span>50.0% (Équilibre psychologique)</span>
            <span>130.00 €</span>
            <span className="text-[9px] text-slate-400">Niveau médian</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-amber-950/70 via-purple-950/60 to-amber-950/70 border border-amber-500/60 text-amber-200 font-bold shadow-xs">
            <span className="flex items-center gap-1 text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              61.8% - 65.0% « GOLDEN POCKET »
            </span>
            <span className="text-white text-xs">123.00 €</span>
            <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
              ZONE D'ACHAT MAJEURE
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 text-slate-300">
            <span className="font-bold text-purple-300">100.0% (Creux initial - Swing Low)</span>
            <span>100.00 €</span>
            <span className="text-[9px] text-slate-400">Origine du mouvement</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Comment l'utiliser sur le site :</strong> Sélectionnez <code className="text-purple-300 bg-slate-800 px-1 rounded">Retracement Fibonacci</code>, cliquez sur le creux de départ (100€) puis relâchez sur le sommet (160€). La zone d'or 61.8% se trace automatiquement.
        </p>
      </div>
    );
  }

  // default: trading_plan
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">STRATÉGIE 4 : PLAN DE TRADING & RATIO R:R</span>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
          Outils : Étiquettes de Prix, Tags & Stop-Loss
        </span>
      </div>

      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div className="bg-emerald-950/60 border border-emerald-800/60 p-2 rounded-lg">
            <span className="text-emerald-400 font-bold block">TAKE-PROFIT (TP)</span>
            <span className="text-xs text-white font-black">138.00 €</span>
            <span className="text-[9px] text-emerald-300 block mt-0.5">+15 € (+12.2%)</span>
          </div>
          <div className="bg-indigo-950/60 border border-indigo-800/60 p-2 rounded-lg">
            <span className="text-indigo-300 font-bold block">PRIX D'ENTRÉE</span>
            <span className="text-xs text-white font-black">123.00 €</span>
            <span className="text-[9px] text-indigo-400 block mt-0.5">Niveau 61.8%</span>
          </div>
          <div className="bg-rose-950/60 border border-rose-800/60 p-2 rounded-lg">
            <span className="text-rose-400 font-bold block">STOP-LOSS (SL)</span>
            <span className="text-xs text-white font-black">118.00 €</span>
            <span className="text-[9px] text-rose-300 block mt-0.5">-5 € (-4.0%)</span>
          </div>
        </div>

        {/* Ratio badge */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 p-2 rounded-lg border border-emerald-500/40 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200">
            📊 RATIO RISQUE / RENDEMENT (R:R) = <span className="text-emerald-400 font-mono font-black text-sm">1 : 3.0</span>
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
            EXCELLENT SETUP
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        <strong className="text-slate-200">Règle de survie pro :</strong> Utilisez l'outil <code className="text-yellow-300 bg-slate-800 px-1 rounded">Étiquette de prix</code> et l'outil <code className="text-yellow-300 bg-slate-800 px-1 rounded">Note</code> pour inscrire clairement votre Stop-Loss et Take-Profit avant même d'entrer en position.
      </p>
    </div>
  );
};
