export type ToolType =
  | 'select'
  | 'pan'
  | 'line'
  | 'trendline'
  | 'horizontal_line'
  | 'vertical_line'
  | 'ray'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'parallel_channel'
  | 'regression_channel'
  | 'fib_retracement'
  | 'fib_extension'
  | 'text'
  | 'note'
  | 'price_label'
  | 'emoji'
  | 'brush'
  | 'highlighter'
  | 'eraser'
  | 'measure';

export interface ChartPoint {
  price: number;
  timeRatio: number; // 0..1 ratio along horizontal axis
}

export interface PixelPoint {
  x: number;
  y: number;
}

export interface ShapeStyle {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  showPriceLabels?: boolean;
}

export interface DrawingShape {
  id: string;
  type: ToolType;
  symbol: string;
  timeframe: string;
  points: ChartPoint[]; // Keypoints defining the shape
  freehandPath?: ChartPoint[]; // For brush & highlighter
  text?: string;
  emoji?: string;
  style: ShapeStyle;
  isLocked?: boolean;
  isHidden?: boolean;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface SelectionState {
  selectedId: string | null;
  hoveredId: string | null;
  activeHandleIndex: number | null; // Handle being dragged
  isDraggingShape: boolean;
}

export interface ChartViewportBounds {
  minPrice: number;
  maxPrice: number;
  chartWidth: number;
  chartHeight: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  visibleCount: number;
  totalCount: number;
  startIndex: number;
}

export interface HistoryAction {
  type: 'ADD' | 'DELETE' | 'UPDATE' | 'CLEAR';
  shapesBefore: DrawingShape[];
  shapesAfter: DrawingShape[];
  description: string;
}
