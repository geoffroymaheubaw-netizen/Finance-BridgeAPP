import { DrawingShape, ToolType, ChartPoint, ShapeStyle, HistoryAction } from './types';
import { HistoryManager } from './HistoryManager';

export class DrawingManager {
  private shapes: DrawingShape[] = [];
  private historyManager: HistoryManager;
  private currentDrawingShape: DrawingShape | null = null;

  constructor(historyManager: HistoryManager) {
    this.historyManager = historyManager;
  }

  public getShapes(): DrawingShape[] {
    return [...this.shapes];
  }

  public setShapes(shapes: DrawingShape[], recordHistory: boolean = false): void {
    if (recordHistory) {
      this.historyManager.pushAction({
        type: 'UPDATE',
        shapesBefore: [...this.shapes],
        shapesAfter: [...shapes],
        description: 'Mise à jour des dessins',
      });
    }
    this.shapes = [...shapes];
  }

  public getShapeById(id: string): DrawingShape | null {
    return this.shapes.find((s) => s.id === id) || null;
  }

  public getCurrentDrawingShape(): DrawingShape | null {
    return this.currentDrawingShape;
  }

  public startNewDrawing(
    type: ToolType,
    symbol: string,
    timeframe: string,
    startPoint: ChartPoint,
    style: ShapeStyle,
    text?: string,
    emoji?: string
  ): DrawingShape {
    const isOnePoint = ['horizontal_line', 'vertical_line', 'text', 'note', 'price_label', 'emoji'].includes(type);
    const initialPoints = isOnePoint ? [{ ...startPoint }] : [{ ...startPoint }, { ...startPoint }];

    const newShape: DrawingShape = {
      id: 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type,
      symbol,
      timeframe,
      points: initialPoints,
      freehandPath: type === 'brush' || type === 'highlighter' ? [{ ...startPoint }] : undefined,
      text,
      emoji,
      style: { ...style },
      zIndex: this.shapes.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.currentDrawingShape = newShape;
    return newShape;
  }

  public updateCurrentDrawing(currentPoint: ChartPoint): void {
    if (!this.currentDrawingShape) return;

    const shape = this.currentDrawingShape;
    if (shape.type === 'brush' || shape.type === 'highlighter') {
      if (!shape.freehandPath) shape.freehandPath = [];
      shape.freehandPath.push(currentPoint);
      shape.points = [shape.freehandPath[0], currentPoint];
    } else {
      if (shape.points.length <= 1) {
        shape.points = [shape.points[0], currentPoint];
      } else {
        shape.points[shape.points.length - 1] = currentPoint;
      }
    }
    shape.updatedAt = Date.now();
  }

  public finalizeCurrentDrawing(): DrawingShape | null {
    if (!this.currentDrawingShape) return null;

    const shape = this.currentDrawingShape;
    this.currentDrawingShape = null;

    // Minimum check
    if (shape.points.length === 0) return null;

    const before = [...this.shapes];
    this.shapes.push(shape);

    this.historyManager.pushAction({
      type: 'ADD',
      shapesBefore: before,
      shapesAfter: [...this.shapes],
      description: `Ajout ${shape.type}`,
    });

    return shape;
  }

  public cancelCurrentDrawing(): void {
    this.currentDrawingShape = null;
  }

  public updateShape(id: string, patch: Partial<DrawingShape>, recordHistory: boolean = true): void {
    const idx = this.shapes.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const before = [...this.shapes];
    this.shapes[idx] = {
      ...this.shapes[idx],
      ...patch,
      updatedAt: Date.now(),
    };

    if (recordHistory) {
      this.historyManager.pushAction({
        type: 'UPDATE',
        shapesBefore: before,
        shapesAfter: [...this.shapes],
        description: `Modification ${this.shapes[idx].type}`,
      });
    }
  }

  public recordUpdateHistory(shapesBefore: DrawingShape[], description: string = 'Déplacement élément'): void {
    this.historyManager.pushAction({
      type: 'UPDATE',
      shapesBefore,
      shapesAfter: [...this.shapes],
      description,
    });
  }

  public deleteShape(id: string): void {
    const idx = this.shapes.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const before = [...this.shapes];
    const removed = this.shapes[idx];
    this.shapes = this.shapes.filter((s) => s.id !== id);

    this.historyManager.pushAction({
      type: 'DELETE',
      shapesBefore: before,
      shapesAfter: [...this.shapes],
      description: `Suppression ${removed.type}`,
    });
  }

  public clearAllShapes(): void {
    if (this.shapes.length === 0) return;
    const before = [...this.shapes];
    this.shapes = [];
    this.historyManager.pushAction({
      type: 'CLEAR',
      shapesBefore: before,
      shapesAfter: [],
      description: 'Effacer tous les dessins',
    });
  }

  public duplicateShape(id: string): DrawingShape | null {
    const source = this.getShapeById(id);
    if (!source) return null;

    const copy: DrawingShape = JSON.parse(JSON.stringify(source));
    copy.id = 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    // Slightly offset points in price and time ratio
    copy.points = copy.points.map((p) => ({
      price: p.price * 1.002,
      timeRatio: Math.min(1, p.timeRatio + 0.02),
    }));
    if (copy.freehandPath) {
      copy.freehandPath = copy.freehandPath.map((p) => ({
        price: p.price * 1.002,
        timeRatio: Math.min(1, p.timeRatio + 0.02),
      }));
    }
    copy.createdAt = Date.now();
    copy.updatedAt = Date.now();

    const before = [...this.shapes];
    this.shapes.push(copy);

    this.historyManager.pushAction({
      type: 'ADD',
      shapesBefore: before,
      shapesAfter: [...this.shapes],
      description: `Duplication ${copy.type}`,
    });

    return copy;
  }

  public toggleLock(id: string): void {
    const shape = this.getShapeById(id);
    if (shape) {
      this.updateShape(id, { isLocked: !shape.isLocked });
    }
  }

  public toggleHide(id: string): void {
    const shape = this.getShapeById(id);
    if (shape) {
      this.updateShape(id, { isHidden: !shape.isHidden });
    }
  }

  public bringToFront(id: string): void {
    const idx = this.shapes.findIndex((s) => s.id === id);
    if (idx === -1 || idx === this.shapes.length - 1) return;

    const before = [...this.shapes];
    const shape = this.shapes.splice(idx, 1)[0];
    this.shapes.push(shape);

    this.historyManager.pushAction({
      type: 'UPDATE',
      shapesBefore: before,
      shapesAfter: [...this.shapes],
      description: 'Mettre au premier plan',
    });
  }

  public sendToBack(id: string): void {
    const idx = this.shapes.findIndex((s) => s.id === id);
    if (idx === -1 || idx === 0) return;

    const before = [...this.shapes];
    const shape = this.shapes.splice(idx, 1)[0];
    this.shapes.unshift(shape);

    this.historyManager.pushAction({
      type: 'UPDATE',
      shapesBefore: before,
      shapesAfter: [...this.shapes],
      description: 'Mettre en arrière plan',
    });
  }
}
