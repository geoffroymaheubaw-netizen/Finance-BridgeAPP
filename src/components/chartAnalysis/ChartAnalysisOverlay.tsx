import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ToolType,
  DrawingShape,
  ChartViewportBounds,
  PixelPoint,
  ChartPoint,
  ShapeStyle
} from './types';
import { DrawingManager } from './DrawingManager';
import { ToolManager } from './ToolManager';
import { HistoryManager } from './HistoryManager';
import { SelectionManager } from './SelectionManager';
import { StorageManager } from './StorageManager';
import { CoordinateUtils } from './CoordinateUtils';
import { ChartToolbar } from './ChartToolbar';
import { DrawingPropertyBar } from './DrawingPropertyBar';
import { ShapeRenderer } from './ShapeRenderer';

interface ChartAnalysisOverlayProps {
  symbol: string;
  timeframe: string;
  bounds: ChartViewportBounds;
  isPanActive?: boolean;
  onPanStateChange?: (active: boolean) => void;
}

export const ChartAnalysisOverlay: React.FC<ChartAnalysisOverlayProps> = ({
  symbol,
  timeframe,
  bounds,
  isPanActive,
  onPanStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Managers
  const historyManagerRef = useRef<HistoryManager>(new HistoryManager());
  const drawingManagerRef = useRef<DrawingManager>(new DrawingManager(historyManagerRef.current));
  const toolManagerRef = useRef<ToolManager>(new ToolManager());
  const selectionManagerRef = useRef<SelectionManager>(new SelectionManager());

  // Component states
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [currentDrawingShape, setCurrentDrawingShape] = useState<DrawingShape | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [isAllHidden, setIsAllHidden] = useState(false);
  const [isAllLocked, setIsAllLocked] = useState(false);

  const dragStartPixelRef = useRef<PixelPoint | null>(null);
  const isTwoClickModeRef = useRef<boolean>(false);

  // Sync state helpers
  const syncState = useCallback(() => {
    setShapes(drawingManagerRef.current.getShapes());
    setCurrentDrawingShape(drawingManagerRef.current.getCurrentDrawingShape());
    setSelectedId(selectionManagerRef.current.getSelectedId());
    setHoveredId(selectionManagerRef.current.getHoveredId());
    setCanUndo(historyManagerRef.current.canUndo());
    setCanRedo(historyManagerRef.current.canRedo());
  }, []);

  // Auto-load drawings on symbol/timeframe change
  useEffect(() => {
    const loaded = StorageManager.loadDrawings(symbol, timeframe);
    drawingManagerRef.current.setShapes(loaded, false);
    historyManagerRef.current.clear();
    syncState();
  }, [symbol, timeframe, syncState]);

  // Auto-save drawings on shape changes
  useEffect(() => {
    StorageManager.saveDrawings(symbol, timeframe, shapes);
  }, [symbol, timeframe, shapes]);

  // Prevent wheel scroll propagation on chart canvas, but allow scrolling inside toolbars / scrollable panels
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.overflow-y-auto, .overflow-x-auto, .overflow-y-scroll, .overflow-x-scroll, .custom-scrollbar, button, input, select, label')) {
        return; // Allow toolbar and panel scrolling
      }
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => {
      el.removeEventListener('wheel', handleWheel, true);
    };
  }, []);

  // Handle Tool Change
  const handleSelectTool = (tool: ToolType) => {
    toolManagerRef.current.setActiveTool(tool);
    setActiveTool(tool);
    if (tool !== 'select') {
      selectionManagerRef.current.setSelectedId(null);
    }
    if (onPanStateChange) {
      onPanStateChange(tool === 'pan');
    }
    syncState();
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const activeSelId = selectionManagerRef.current.getSelectedId();

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeSelId) {
          drawingManagerRef.current.deleteShape(activeSelId);
          selectionManagerRef.current.setSelectedId(null);
          syncState();
        }
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        const action = historyManagerRef.current.undo();
        if (action) {
          drawingManagerRef.current.setShapes(action.shapesBefore, false);
          syncState();
        }
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        const action = historyManagerRef.current.redo();
        if (action) {
          drawingManagerRef.current.setShapes(action.shapesAfter, false);
          syncState();
        }
      }

      // Copy (Ctrl+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (activeSelId) {
          const shape = drawingManagerRef.current.getShapeById(activeSelId);
          if (shape) {
            toolManagerRef.current.setClipboard(shape);
          }
        }
      }

      // Paste (Ctrl+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        const clip = toolManagerRef.current.getClipboard();
        if (clip) {
          const pasted = drawingManagerRef.current.duplicateShape(clip.id);
          if (pasted) {
            selectionManagerRef.current.setSelectedId(pasted.id);
            syncState();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [syncState]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pixelPoint: PixelPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const chartPoint = CoordinateUtils.pixelToChart(pixelPoint, bounds);
    const activeT = toolManagerRef.current.getActiveTool();

    if (activeT === 'select' || activeT === 'eraser') {
      const hitShape = selectionManagerRef.current.findShapeAtPixel(
        pixelPoint,
        drawingManagerRef.current.getShapes(),
        bounds
      );

      if (activeT === 'eraser' && hitShape) {
        drawingManagerRef.current.deleteShape(hitShape.id);
        syncState();
        return;
      }

      if (hitShape) {
        selectionManagerRef.current.setSelectedId(hitShape.id);
        if (!hitShape.isLocked) {
          selectionManagerRef.current.startDraggingShape(pixelPoint, hitShape);
        }
      } else {
        selectionManagerRef.current.setSelectedId(null);
      }
      syncState();
      return;
    }

    if (activeT === 'pan') {
      return;
    }

    // Check if we are already in middle of a two-click drawing
    const existingDrawing = drawingManagerRef.current.getCurrentDrawingShape();
    if (existingDrawing && isTwoClickModeRef.current) {
      drawingManagerRef.current.updateCurrentDrawing(chartPoint);
      const finalized = drawingManagerRef.current.finalizeCurrentDrawing();
      isTwoClickModeRef.current = false;
      dragStartPixelRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (finalized) {
        selectionManagerRef.current.setSelectedId(finalized.id);
        if (activeTool !== 'brush' && activeTool !== 'highlighter') {
          handleSelectTool('select');
        }
      }
      syncState();
      return;
    }

    // Creating new drawing shape
    dragStartPixelRef.current = pixelPoint;
    isTwoClickModeRef.current = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const defaultStyle = toolManagerRef.current.getDefaultStyle();
    drawingManagerRef.current.startNewDrawing(
      activeT,
      symbol,
      timeframe,
      chartPoint,
      defaultStyle,
      activeT === 'text' || activeT === 'note' ? 'Analyse Finance Bridge' : undefined,
      activeT === 'emoji' ? selectedEmoji : undefined
    );

    syncState();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pixelPoint: PixelPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const chartPoint = CoordinateUtils.pixelToChart(pixelPoint, bounds);

    // Hover detection when select tool active
    if (activeTool === 'select') {
      const hit = selectionManagerRef.current.findShapeAtPixel(
        pixelPoint,
        drawingManagerRef.current.getShapes(),
        bounds
      );
      selectionManagerRef.current.setHoveredId(hit ? hit.id : null);
      setHoveredId(hit ? hit.id : null);
    }

    // Handle keypoint dragging for active handle
    const activeHandle = selectionManagerRef.current.getActiveHandleIndex();
    const selId = selectionManagerRef.current.getSelectedId();
    if (activeHandle !== null && selId) {
      const shape = drawingManagerRef.current.getShapeById(selId);
      if (shape && !shape.isLocked) {
        const updatedPoints = [...shape.points];
        updatedPoints[activeHandle] = chartPoint;
        drawingManagerRef.current.updateShape(selId, { points: updatedPoints }, false);
        syncState();
        return;
      }
    }

    // Handle ongoing shape creation
    if (drawingManagerRef.current.getCurrentDrawingShape()) {
      drawingManagerRef.current.updateCurrentDrawing(chartPoint);
      syncState();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    selectionManagerRef.current.stopDragging();

    const activeT = toolManagerRef.current.getActiveTool();
    const isOnePointTool = ['horizontal_line', 'vertical_line', 'text', 'note', 'price_label', 'emoji'].includes(activeT);

    if (drawingManagerRef.current.getCurrentDrawingShape()) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentPixel: PixelPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const startPixel = dragStartPixelRef.current || currentPixel;
      const dist = CoordinateUtils.distanceBetweenPixels(startPixel, currentPixel);

      if (isOnePointTool || dist > 6) {
        // Finalize drawing immediately (dragged segment OR 1-point tool)
        const finalized = drawingManagerRef.current.finalizeCurrentDrawing();
        isTwoClickModeRef.current = false;
        dragStartPixelRef.current = null;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        if (finalized) {
          selectionManagerRef.current.setSelectedId(finalized.id);
          if (activeTool !== 'brush' && activeTool !== 'highlighter') {
            handleSelectTool('select');
          }
        }
      } else {
        // Single click -> enter two-click mode (do NOT finalize yet)
        isTwoClickModeRef.current = true;
      }
    }
    syncState();
  };

  // Screenshot helper
  const handleScreenshot = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const width = bounds.chartWidth || containerRef.current?.clientWidth || 800;
        const height = bounds.chartHeight || containerRef.current?.clientHeight || 400;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
          const parent = containerRef.current?.parentElement || containerRef.current;
          const chartCanvas = parent ? (parent.querySelector('canvas') as HTMLCanvasElement | null) : null;

          if (chartCanvas) {
            context.drawImage(chartCanvas, 0, 0, width, height);
          } else {
            const isDark = document.documentElement.classList.contains('dark');
            context.fillStyle = isDark ? '#0f172a' : '#ffffff';
            context.fillRect(0, 0, width, height);
          }

          context.drawImage(image, 0, 0, width, height);
          const png = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = png;
          downloadLink.download = `finance_bridge_${symbol}_${timeframe}_chart.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(blobURL);
        }
      };
      image.src = blobURL;
    } catch (err) {
      console.warn('Screenshot generation failed', err);
    }
  };

  const selectedShapeObj = selectedId ? drawingManagerRef.current.getShapeById(selectedId) : null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-20 pointer-events-auto select-none overflow-hidden ${
        activeTool === 'pan' ? 'cursor-grab' : activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Vertical Left Toolbar */}
      <ChartToolbar
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        activeColor={activeColor}
        onChangeColor={(color) => {
          setActiveColor(color);
          const getFillFromColor = (c: string) => {
            if (c.startsWith('#') && c.length === 7) {
              const r = parseInt(c.slice(1, 3), 16);
              const g = parseInt(c.slice(3, 5), 16);
              const b = parseInt(c.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, 0.18)`;
            }
            return 'rgba(59, 130, 246, 0.15)';
          };
          const patch = { strokeColor: color, fillColor: getFillFromColor(color), textColor: color };
          toolManagerRef.current.updateDefaultStyle(patch);
          if (selectedId) {
            const selShape = drawingManagerRef.current.getShapeById(selectedId);
            if (selShape) {
              drawingManagerRef.current.updateShape(selectedId, {
                style: { ...selShape.style, ...patch },
              });
            }
          }
          syncState();
        }}
        onUndo={() => {
          const action = historyManagerRef.current.undo();
          if (action) {
            drawingManagerRef.current.setShapes(action.shapesBefore, false);
            syncState();
          }
        }}
        onRedo={() => {
          const action = historyManagerRef.current.redo();
          if (action) {
            drawingManagerRef.current.setShapes(action.shapesAfter, false);
            syncState();
          }
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        onClearAll={() => {
          drawingManagerRef.current.clearAllShapes();
          selectionManagerRef.current.setSelectedId(null);
          syncState();
        }}
        onTakeScreenshot={handleScreenshot}
        onSelectEmoji={(emoji) => {
          setSelectedEmoji(emoji);
          toolManagerRef.current.setSelectedEmoji(emoji);
        }}
        selectedEmoji={selectedEmoji}
        isAllHidden={isAllHidden}
        onToggleHideAll={() => {
          const nextState = !isAllHidden;
          setIsAllHidden(nextState);
          const currentShapes = drawingManagerRef.current.getShapes();
          const updated = currentShapes.map((s) => ({ ...s, isHidden: nextState }));
          drawingManagerRef.current.setShapes(updated, true);
          if (nextState) {
            selectionManagerRef.current.setSelectedId(null);
          }
          syncState();
        }}
        isAllLocked={isAllLocked}
        onToggleLockAll={() => {
          const nextState = !isAllLocked;
          setIsAllLocked(nextState);
          const currentShapes = drawingManagerRef.current.getShapes();
          const updated = currentShapes.map((s) => ({ ...s, isLocked: nextState }));
          drawingManagerRef.current.setShapes(updated, true);
          syncState();
        }}
      />

      {/* Floating Property Bar when shape selected */}
      {selectedShapeObj && (
        <DrawingPropertyBar
          selectedShape={selectedShapeObj}
          onUpdateStyle={(patch) => {
            if (selectedId) {
              drawingManagerRef.current.updateShape(selectedId, {
                style: { ...selectedShapeObj.style, ...patch },
              });
              toolManagerRef.current.updateDefaultStyle(patch);
              if (patch.strokeColor) {
                setActiveColor(patch.strokeColor);
              }
              syncState();
            }
          }}
          onUpdateText={(text) => {
            if (selectedId) {
              drawingManagerRef.current.updateShape(selectedId, { text });
              syncState();
            }
          }}
          onDuplicate={() => {
            if (selectedId) {
              const dup = drawingManagerRef.current.duplicateShape(selectedId);
              if (dup) {
                selectionManagerRef.current.setSelectedId(dup.id);
                syncState();
              }
            }
          }}
          onDelete={() => {
            if (selectedId) {
              drawingManagerRef.current.deleteShape(selectedId);
              selectionManagerRef.current.setSelectedId(null);
              syncState();
            }
          }}
          onToggleLock={() => {
            if (selectedId) {
              drawingManagerRef.current.toggleLock(selectedId);
              syncState();
            }
          }}
          onBringToFront={() => {
            if (selectedId) {
              drawingManagerRef.current.bringToFront(selectedId);
              syncState();
            }
          }}
          onSendToBack={() => {
            if (selectedId) {
              drawingManagerRef.current.sendToBack(selectedId);
              syncState();
            }
          }}
          onClose={() => {
            selectionManagerRef.current.setSelectedId(null);
            syncState();
          }}
        />
      )}

      {/* Shapes Renderer */}
      <ShapeRenderer
        shapes={shapes}
        currentDrawingShape={currentDrawingShape}
        selectedId={selectedId}
        hoveredId={hoveredId}
        bounds={bounds}
        onSelectShape={(id) => {
          selectionManagerRef.current.setSelectedId(id);
          syncState();
        }}
        onStartHandleDrag={(handleIdx) => {
          selectionManagerRef.current.setActiveHandleIndex(handleIdx);
        }}
      />
    </div>
  );
};
