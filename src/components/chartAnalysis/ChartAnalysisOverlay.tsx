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
  const [isAllHidden, setIsAllHidden] = useState(false);
  const [isAllLocked, setIsAllLocked] = useState(false);

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

    // Creating new drawing shape
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

  const handlePointerUp = () => {
    selectionManagerRef.current.stopDragging();

    if (drawingManagerRef.current.getCurrentDrawingShape()) {
      const finalized = drawingManagerRef.current.finalizeCurrentDrawing();
      if (finalized) {
        selectionManagerRef.current.setSelectedId(finalized.id);
        // Switch back to select tool after finishing shape creation
        if (activeTool !== 'brush' && activeTool !== 'highlighter') {
          handleSelectTool('select');
        }
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
        canvas.width = bounds.chartWidth || 800;
        canvas.height = bounds.chartHeight || 400;
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#0f172a';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
          const png = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = png;
          downloadLink.download = `finance_bridge_${symbol}_${timeframe}_chart.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
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
          const updated = shapes.map((s) => ({ ...s, isHidden: nextState }));
          drawingManagerRef.current.setShapes(updated, true);
          syncState();
        }}
        isAllLocked={isAllLocked}
        onToggleLockAll={() => {
          const nextState = !isAllLocked;
          setIsAllLocked(nextState);
          const updated = shapes.map((s) => ({ ...s, isLocked: nextState }));
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
