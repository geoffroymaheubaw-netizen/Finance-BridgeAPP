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
  isZoomedModal?: boolean;
  containerWheelRef?: (node: HTMLElement | null) => void;
  children?: React.ReactNode;
}

export const ChartAnalysisOverlay: React.FC<ChartAnalysisOverlayProps> = ({
  symbol,
  timeframe,
  bounds,
  isPanActive,
  onPanStateChange,
  isZoomedModal = false,
  containerWheelRef,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Managers
  const historyManagerRef = useRef<HistoryManager>(new HistoryManager());
  const drawingManagerRef = useRef<DrawingManager>(null as any);
  if (!drawingManagerRef.current) {
    const dm = new DrawingManager(historyManagerRef.current);
    dm.setShapes(StorageManager.loadDrawings(symbol, timeframe), false);
    drawingManagerRef.current = dm;
  }
  const toolManagerRef = useRef<ToolManager>(new ToolManager());
  const selectionManagerRef = useRef<SelectionManager>(new SelectionManager());

  // Component states
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [shapes, setShapes] = useState<DrawingShape[]>(() => StorageManager.loadDrawings(symbol, timeframe));
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
  const syncUiState = useCallback(() => {
    setShapes(drawingManagerRef.current.getShapes());
    setCurrentDrawingShape(drawingManagerRef.current.getCurrentDrawingShape());
    setSelectedId(selectionManagerRef.current.getSelectedId());
    setHoveredId(selectionManagerRef.current.getHoveredId());
    setCanUndo(historyManagerRef.current.canUndo());
    setCanRedo(historyManagerRef.current.canRedo());
  }, []);

  // Persist shapes to localStorage and broadcast real-time change event to all views (normal and gros plan)
  const persistAndSync = useCallback((customShapes?: DrawingShape[]) => {
    const currentShapes = customShapes || drawingManagerRef.current.getShapes();
    setShapes(currentShapes);
    setCurrentDrawingShape(drawingManagerRef.current.getCurrentDrawingShape());
    setSelectedId(selectionManagerRef.current.getSelectedId());
    setHoveredId(selectionManagerRef.current.getHoveredId());
    setCanUndo(historyManagerRef.current.canUndo());
    setCanRedo(historyManagerRef.current.canRedo());

    StorageManager.saveDrawings(symbol, timeframe, currentShapes);
  }, [symbol, timeframe]);

  // Backward compatible alias
  const syncState = syncUiState;

  // Auto-load drawings on symbol/timeframe change
  useEffect(() => {
    const loaded = StorageManager.loadDrawings(symbol, timeframe);
    drawingManagerRef.current.setShapes(loaded, false);
    historyManagerRef.current.clear();
    syncUiState();
  }, [symbol, timeframe, syncUiState]);

  // Real-time synchronization across normal mode and zoom modal instances
  useEffect(() => {
    const handleDrawingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ symbol: string; timeframe: string; shapes: DrawingShape[] }>;
      if (customEvent.detail && customEvent.detail.symbol === symbol && customEvent.detail.timeframe === timeframe) {
        const incomingShapes = customEvent.detail.shapes || [];
        const currentShapes = drawingManagerRef.current.getShapes();
        if (JSON.stringify(incomingShapes) !== JSON.stringify(currentShapes)) {
          drawingManagerRef.current.setShapes(incomingShapes, false);
          syncUiState();
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      const key = StorageManager.getStorageKey(symbol, timeframe);
      if (e.key === key) {
        const loaded = StorageManager.loadDrawings(symbol, timeframe);
        const currentShapes = drawingManagerRef.current.getShapes();
        if (JSON.stringify(loaded) !== JSON.stringify(currentShapes)) {
          drawingManagerRef.current.setShapes(loaded, false);
          syncUiState();
        }
      }
    };

    window.addEventListener('chart-drawings-changed', handleDrawingsChanged);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('chart-drawings-changed', handleDrawingsChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, [symbol, timeframe, syncUiState]);

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
          persistAndSync();
        }
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        const action = historyManagerRef.current.undo();
        if (action) {
          drawingManagerRef.current.setShapes(action.shapesBefore, false);
          persistAndSync();
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
          persistAndSync();
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
            persistAndSync();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [persistAndSync]);

  // Helper to map client pointer event to SVG ViewBox pixel coordinate
  const getEventViewBoxPoint = (e: React.PointerEvent<HTMLDivElement>): PixelPoint => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / (rect.width || 1)));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / (rect.height || 1)));

    const viewBoxWidth = (bounds.padLeft || 0) + (bounds.chartWidth || 800) + (bounds.padRight || 0);
    const viewBoxHeight = (bounds.padTop || 0) + (bounds.chartHeight || 400) + (bounds.padBottom || 0);

    return {
      x: relX * viewBoxWidth,
      y: relY * viewBoxHeight,
    };
  };

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const pixelPoint = getEventViewBoxPoint(e);
    const chartPoint = CoordinateUtils.pixelToChart(pixelPoint, bounds);
    const activeT = toolManagerRef.current.getActiveTool();

    if (activeT === 'select' || activeT === 'eraser') {
      const activeSelId = selectionManagerRef.current.getSelectedId();
      const currentSelectedShape = activeSelId ? drawingManagerRef.current.getShapeById(activeSelId) : null;

      // 1. Check if clicking on a control handle of the already selected shape
      if (activeT === 'select' && currentSelectedShape && !currentSelectedShape.isLocked) {
        const handleIdx = selectionManagerRef.current.findHandleAtPixel(pixelPoint, currentSelectedShape, bounds, 14);
        if (handleIdx !== null) {
          selectionManagerRef.current.setActiveHandleIndex(handleIdx);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          syncState();
          return;
        }
      }

      // 2. Hit-test against shapes
      const hitShape = selectionManagerRef.current.findShapeAtPixel(
        pixelPoint,
        drawingManagerRef.current.getShapes(),
        bounds,
        14
      );

      if (activeT === 'eraser' && hitShape) {
        drawingManagerRef.current.deleteShape(hitShape.id);
        persistAndSync();
        return;
      }

      if (hitShape) {
        selectionManagerRef.current.setSelectedId(hitShape.id);
        if (!hitShape.isLocked) {
          selectionManagerRef.current.startDraggingShape(pixelPoint, chartPoint, hitShape);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }
      } else {
        selectionManagerRef.current.setSelectedId(null);
      }
      syncUiState();
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
      persistAndSync();
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

    syncUiState();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const pixelPoint = getEventViewBoxPoint(e);
    const chartPoint = CoordinateUtils.pixelToChart(pixelPoint, bounds);

    // Hover detection when select tool active and not currently dragging
    if (activeTool === 'select' && !selectionManagerRef.current.getIsDraggingShape() && selectionManagerRef.current.getActiveHandleIndex() === null) {
      const hit = selectionManagerRef.current.findShapeAtPixel(
        pixelPoint,
        drawingManagerRef.current.getShapes(),
        bounds,
        14
      );
      selectionManagerRef.current.setHoveredId(hit ? hit.id : null);
      setHoveredId(hit ? hit.id : null);
    }

    // Handle keypoint dragging for active handle (resizing or reorienting line/box)
    const activeHandle = selectionManagerRef.current.getActiveHandleIndex();
    const selId = selectionManagerRef.current.getSelectedId();
    if (activeHandle !== null && selId) {
      const shape = drawingManagerRef.current.getShapeById(selId);
      if (shape && !shape.isLocked) {
        const updatedPoints = [...shape.points];
        updatedPoints[activeHandle] = chartPoint;
        drawingManagerRef.current.updateShape(selId, { points: updatedPoints }, false);
        syncUiState();
        return;
      }
    }

    // Handle whole-shape dragging / moving
    if (selectionManagerRef.current.getIsDraggingShape() && selId) {
      const shape = drawingManagerRef.current.getShapeById(selId);
      const startPt = selectionManagerRef.current.getDragStartChartPoint();
      const startPoints = selectionManagerRef.current.getDragStartPoints();
      const startFreehand = selectionManagerRef.current.getDragStartFreehand();

      if (shape && !shape.isLocked && startPt && startPoints.length > 0) {
        const deltaPrice = chartPoint.price - startPt.price;
        const deltaTimeRatio = chartPoint.timeRatio - startPt.timeRatio;

        const updatedPoints = startPoints.map((p) => ({
          price: Math.max(0.001, p.price + deltaPrice),
          timeRatio: Math.max(0, Math.min(1, p.timeRatio + deltaTimeRatio)),
        }));

        let updatedFreehand: ChartPoint[] | undefined = undefined;
        if (startFreehand && startFreehand.length > 0) {
          updatedFreehand = startFreehand.map((p) => ({
            price: Math.max(0.001, p.price + deltaPrice),
            timeRatio: Math.max(0, Math.min(1, p.timeRatio + deltaTimeRatio)),
          }));
        }

        drawingManagerRef.current.updateShape(
          selId,
          {
            points: updatedPoints,
            freehandPath: updatedFreehand,
          },
          false
        );
        syncUiState();
        return;
      }
    }

    // Handle ongoing shape creation
    if (drawingManagerRef.current.getCurrentDrawingShape()) {
      drawingManagerRef.current.updateCurrentDrawing(chartPoint);
      syncUiState();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // If we were dragging a shape or handle, finalize the move
    const wasDragging = selectionManagerRef.current.getIsDraggingShape() || selectionManagerRef.current.getActiveHandleIndex() !== null;
    if (wasDragging) {
      const selId = selectionManagerRef.current.getSelectedId();
      if (selId) {
        const shape = drawingManagerRef.current.getShapeById(selId);
        if (shape) {
          // Trigger reactive save & history by updating shape timestamp
          drawingManagerRef.current.updateShape(selId, { updatedAt: Date.now() }, true);
        }
      }
      selectionManagerRef.current.stopDragging();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      persistAndSync();
      return;
    }

    selectionManagerRef.current.stopDragging();

    const activeT = toolManagerRef.current.getActiveTool();
    const isOnePointTool = ['horizontal_line', 'vertical_line', 'text', 'note', 'price_label', 'emoji'].includes(activeT);

    if (drawingManagerRef.current.getCurrentDrawingShape()) {
      if (!containerRef.current) return;
      const currentPixel = getEventViewBoxPoint(e);

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
        persistAndSync();
        return;
      } else {
        // Single click -> enter two-click mode (do NOT finalize yet)
        isTwoClickModeRef.current = true;
        syncUiState();
      }
    } else {
      syncUiState();
    }
  };

  const [screenshotToast, setScreenshotToast] = useState<string | null>(null);

  // Full screenshot helper: captures the entire chart (candlesticks/lines, grid, axes, indicators) + all technical drawings
  const handleScreenshot = () => {
    if (!containerRef.current) return;

    try {
      // 1. Locate the container elements
      const rootContainer = containerRef.current.parentElement || containerRef.current;
      
      // Find all SVGs in the chart container
      const allSvgs = Array.from(rootContainer.querySelectorAll('svg')) as SVGSVGElement[];
      
      // Filter out toolbar / small icon SVGs
      const contentSvgs: SVGSVGElement[] = allSvgs.filter((svg: SVGSVGElement) => {
        const isInsideToolbar = svg.closest('.chart-analysis-toolbar') !== null;
        const isInsideButton = svg.closest('button') !== null;
        return !isInsideToolbar && !isInsideButton;
      });

      if (contentSvgs.length === 0) {
        console.warn('No chart SVG found for screenshot');
        return;
      }

      // Identify the main chart SVG and the drawings overlay SVG
      let mainChartSvg: SVGSVGElement | null = null;
      let overlaySvg: SVGSVGElement | null = null;

      for (const svg of contentSvgs) {
        if (svg.classList.contains('pointer-events-none') || (svg.parentElement && svg.parentElement.classList.contains('pointer-events-auto'))) {
          overlaySvg = svg;
        } else {
          mainChartSvg = svg;
        }
      }

      if (!mainChartSvg && contentSvgs.length > 0) {
        mainChartSvg = contentSvgs[0];
      }
      if (!overlaySvg && contentSvgs.length > 1) {
        overlaySvg = contentSvgs[1];
      }

      if (!mainChartSvg) return;

      // 2. Determine ViewBox and exact dimensions
      let viewBoxWidth = 1000;
      let viewBoxHeight = 480;
      const vb = mainChartSvg.getAttribute('viewBox');
      if (vb) {
        const parts = vb.trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          viewBoxWidth = parts[2];
          viewBoxHeight = parts[3];
        }
      } else if (bounds.chartWidth && bounds.chartHeight) {
        viewBoxWidth = (bounds.padLeft || 0) + bounds.chartWidth + (bounds.padRight || 0);
        viewBoxHeight = (bounds.padTop || 0) + bounds.chartHeight + (bounds.padBottom || 0);
      }

      const isDark = document.documentElement.classList.contains('dark');
      const bgColor = isDark ? '#0b0f19' : '#ffffff';
      const cardBgColor = isDark ? '#131c2e' : '#f8fafc';
      const textColor = isDark ? '#f8fafc' : '#0f172a';
      const subTextColor = isDark ? '#94a3b8' : '#64748b';
      const borderColor = isDark ? '#1e293b' : '#e2e8f0';

      // 3. Extract and combine defs (gradients, filters, etc.)
      const mainDefs = mainChartSvg.querySelector('defs')?.innerHTML || '';
      const overlayDefs = overlaySvg?.querySelector('defs')?.innerHTML || '';

      // 4. Extract Main Chart Elements (excluding defs)
      const mainClone = mainChartSvg.cloneNode(true) as SVGSVGElement;
      mainClone.querySelector('defs')?.remove();
      const mainContentHtml = mainClone.innerHTML;

      // 5. Extract Drawings Overlay Elements (excluding edit handles)
      let overlayContentHtml = '';
      if (overlaySvg) {
        const overlayClone = overlaySvg.cloneNode(true) as SVGSVGElement;
        overlayClone.querySelector('defs')?.remove();
        overlayClone.querySelectorAll('circle[class*="cursor-grab"], circle[class*="hover:scale-125"]').forEach((el) => el.remove());
        overlayContentHtml = overlayClone.innerHTML;
      }

      // Format current timestamp
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // 6. Build Master SVG String with theme background, header badge and footer watermark
      const masterSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${viewBoxWidth}" height="${viewBoxHeight}" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}">
          <defs>
            <style>
              text {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              }
            </style>
            ${mainDefs}
            ${overlayDefs}
          </defs>

          <!-- Base Background -->
          <rect x="0" y="0" width="${viewBoxWidth}" height="${viewBoxHeight}" rx="14" fill="${bgColor}" />
          <rect x="0" y="0" width="${viewBoxWidth}" height="${viewBoxHeight}" rx="14" fill="none" stroke="${borderColor}" stroke-width="1.5" />

          <!-- Main Price Chart Content (Candles, Lines, Grid, Axes, Indicators) -->
          <g id="main-chart-layer">
            ${mainContentHtml}
          </g>

          <!-- User Technical Drawings & Analysis Overlay Layer -->
          <g id="drawings-overlay-layer">
            ${overlayContentHtml}
          </g>

          <!-- Elegant Header Info Badge Overlaid on Top Left -->
          <g id="chart-snapshot-header" transform="translate(16, 16)">
            <rect x="0" y="0" width="${Math.max(160, symbol.length * 10 + 135)}" height="26" rx="6" fill="${cardBgColor}" fill-opacity="0.92" stroke="${borderColor}" stroke-width="1" />
            <circle cx="12" cy="13" r="4" fill="#6366f1" />
            <text x="22" y="17" fill="${textColor}" font-size="12" font-weight="800">${symbol}</text>
            <text x="${symbol.length * 8 + 28}" y="17" fill="${subTextColor}" font-size="10" font-weight="600">(${timeframe}) • Finance Bridge</text>
          </g>

          <!-- Discreet Watermark on Bottom Right -->
          <g id="chart-snapshot-watermark" transform="translate(${viewBoxWidth - 170}, ${viewBoxHeight - 8})">
            <text x="0" y="0" fill="${subTextColor}" font-size="9" font-weight="600" opacity="0.7">Finance Bridge • ${formattedDate}</text>
          </g>
        </svg>
      `;

      // 7. Render to High-Resolution Canvas (2x Retina scale)
      const svgBlob = new Blob([masterSvgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        try {
          const scaleFactor = 2; // High-resolution output
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(viewBoxWidth * scaleFactor);
          canvas.height = Math.round(viewBoxHeight * scaleFactor);
          
          const context = canvas.getContext('2d');
          if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.scale(scaleFactor, scaleFactor);
            context.drawImage(image, 0, 0, viewBoxWidth, viewBoxHeight);

            const png = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = png;
            downloadLink.download = `finance_bridge_${symbol}_${timeframe}_chart.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setScreenshotToast(`Photo du graphique ${symbol} (${timeframe}) téléchargée !`);
            setTimeout(() => setScreenshotToast(null), 3000);
          }
        } catch (e) {
          console.warn('Canvas export failed:', e);
        } finally {
          window.URL.revokeObjectURL(blobURL);
        }
      };

      image.onerror = (err) => {
        console.warn('Image load error during screenshot:', err);
        window.URL.revokeObjectURL(blobURL);
      };

      image.src = blobURL;
    } catch (err) {
      console.warn('Screenshot generation failed', err);
    }
  };

  const selectedShapeObj = selectedId ? drawingManagerRef.current.getShapeById(selectedId) : null;

  const renderToolbar = (isExternal = false) => (
    <ChartToolbar
      isExternal={isExternal}
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
            persistAndSync();
            return;
          }
        }
        syncUiState();
      }}
      onUndo={() => {
        const action = historyManagerRef.current.undo();
        if (action) {
          drawingManagerRef.current.setShapes(action.shapesBefore, false);
          persistAndSync();
        }
      }}
      onRedo={() => {
        const action = historyManagerRef.current.redo();
        if (action) {
          drawingManagerRef.current.setShapes(action.shapesAfter, false);
          persistAndSync();
        }
      }}
      canUndo={canUndo}
      canRedo={canRedo}
      onClearAll={() => {
        drawingManagerRef.current.clearAllShapes();
        selectionManagerRef.current.setSelectedId(null);
        persistAndSync([]);
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
        persistAndSync(updated);
      }}
      isAllLocked={isAllLocked}
      onToggleLockAll={() => {
        const nextState = !isAllLocked;
        setIsAllLocked(nextState);
        const currentShapes = drawingManagerRef.current.getShapes();
        const updated = currentShapes.map((s) => ({ ...s, isLocked: nextState }));
        drawingManagerRef.current.setShapes(updated, true);
        persistAndSync(updated);
      }}
    />
  );

  const setOverlayRef = useCallback((node: HTMLDivElement | null) => {
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, []);

  const setNonModalContainerRef = useCallback((node: HTMLDivElement | null) => {
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (containerWheelRef) {
      containerWheelRef(node);
    }
  }, [containerWheelRef]);

  const getCursorClass = () => {
    if (activeTool === 'pan') return 'cursor-grab active:cursor-grabbing';
    if (activeTool !== 'select' && activeTool !== 'eraser') return 'cursor-crosshair';
    if (activeTool === 'eraser') return 'cursor-pointer';
    if (selectionManagerRef.current.getIsDraggingShape() || selectionManagerRef.current.getActiveHandleIndex() !== null) {
      return 'cursor-grabbing';
    }
    if (hoveredId || selectedId) {
      return 'cursor-move';
    }
    return 'cursor-default';
  };

  if (isZoomedModal) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3.5 w-full">
        {/* External Toolbar outside the chart canvas */}
        <div className="shrink-0 z-30">
          {renderToolbar(true)}
        </div>

        {/* Chart Canvas & Overlay Container on the right */}
        <div className="relative flex-1 w-full min-w-0" ref={containerWheelRef}>
          <div
            ref={setOverlayRef}
            className={`absolute inset-0 z-20 pointer-events-auto select-none overflow-hidden rounded-2xl ${getCursorClass()}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
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
                    persistAndSync();
                  }
                }}
                onUpdateText={(text) => {
                  if (selectedId) {
                    drawingManagerRef.current.updateShape(selectedId, { text });
                    persistAndSync();
                  }
                }}
                onDuplicate={() => {
                  if (selectedId) {
                    const dup = drawingManagerRef.current.duplicateShape(selectedId);
                    if (dup) {
                      selectionManagerRef.current.setSelectedId(dup.id);
                      persistAndSync();
                    }
                  }
                }}
                onDelete={() => {
                  if (selectedId) {
                    drawingManagerRef.current.deleteShape(selectedId);
                    selectionManagerRef.current.setSelectedId(null);
                    persistAndSync();
                  }
                }}
                onToggleLock={() => {
                  if (selectedId) {
                    drawingManagerRef.current.toggleLock(selectedId);
                    persistAndSync();
                  }
                }}
                onBringToFront={() => {
                  if (selectedId) {
                    drawingManagerRef.current.bringToFront(selectedId);
                    persistAndSync();
                  }
                }}
                onSendToBack={() => {
                  if (selectedId) {
                    drawingManagerRef.current.sendToBack(selectedId);
                    persistAndSync();
                  }
                }}
                onClose={() => {
                  selectionManagerRef.current.setSelectedId(null);
                  syncUiState();
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
                syncUiState();
              }}
              onStartHandleDrag={(handleIdx) => {
                selectionManagerRef.current.setActiveHandleIndex(handleIdx);
              }}
            />

            {/* Screenshot Success Toast Notification */}
            {screenshotToast && (
              <div className="absolute top-4 right-4 z-50 bg-slate-900/90 dark:bg-slate-800/95 text-white border border-slate-700/80 px-3.5 py-2 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 pointer-events-none transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{screenshotToast}</span>
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNonModalContainerRef}
      className={`relative w-full overflow-hidden select-none ${getCursorClass()}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Toast Notification */}
      {screenshotToast && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900/90 dark:bg-slate-800/95 text-white border border-slate-700/80 px-3.5 py-2 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 pointer-events-none transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{screenshotToast}</span>
        </div>
      )}
      {/* Vertical Left Toolbar */}
      {renderToolbar(false)}

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
              persistAndSync();
            }
          }}
          onUpdateText={(text) => {
            if (selectedId) {
              drawingManagerRef.current.updateShape(selectedId, { text });
              persistAndSync();
            }
          }}
          onDuplicate={() => {
            if (selectedId) {
              const dup = drawingManagerRef.current.duplicateShape(selectedId);
              if (dup) {
                selectionManagerRef.current.setSelectedId(dup.id);
                persistAndSync();
              }
            }
          }}
          onDelete={() => {
            if (selectedId) {
              drawingManagerRef.current.deleteShape(selectedId);
              selectionManagerRef.current.setSelectedId(null);
              persistAndSync();
            }
          }}
          onToggleLock={() => {
            if (selectedId) {
              drawingManagerRef.current.toggleLock(selectedId);
              persistAndSync();
            }
          }}
          onBringToFront={() => {
            if (selectedId) {
              drawingManagerRef.current.bringToFront(selectedId);
              persistAndSync();
            }
          }}
          onSendToBack={() => {
            if (selectedId) {
              drawingManagerRef.current.sendToBack(selectedId);
              persistAndSync();
            }
          }}
          onClose={() => {
            selectionManagerRef.current.setSelectedId(null);
            syncUiState();
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

      {children}
    </div>
  );
};
