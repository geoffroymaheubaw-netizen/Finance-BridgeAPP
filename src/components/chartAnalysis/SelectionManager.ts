import { DrawingShape, PixelPoint, ChartViewportBounds } from './types';
import { CoordinateUtils } from './CoordinateUtils';

export class SelectionManager {
  private selectedId: string | null = null;
  private hoveredId: string | null = null;
  private activeHandleIndex: number | null = null;
  private isDraggingShape: boolean = false;
  private dragStartPixel: PixelPoint | null = null;
  private dragStartPoints: { price: number; timeRatio: number }[] = [];

  public getSelectedId(): string | null {
    return this.selectedId;
  }

  public setSelectedId(id: string | null): void {
    this.selectedId = id;
    if (!id) {
      this.activeHandleIndex = null;
      this.isDraggingShape = false;
    }
  }

  public getHoveredId(): string | null {
    return this.hoveredId;
  }

  public setHoveredId(id: string | null): void {
    this.hoveredId = id;
  }

  public getActiveHandleIndex(): number | null {
    return this.activeHandleIndex;
  }

  public setActiveHandleIndex(idx: number | null): void {
    this.activeHandleIndex = idx;
  }

  public getIsDraggingShape(): boolean {
    return this.isDraggingShape;
  }

  public startDraggingShape(pixel: PixelPoint, shape: DrawingShape): void {
    this.isDraggingShape = true;
    this.dragStartPixel = { ...pixel };
    this.dragStartPoints = shape.points.map((p) => ({ ...p }));
  }

  public stopDragging(): void {
    this.isDraggingShape = false;
    this.activeHandleIndex = null;
    this.dragStartPixel = null;
    this.dragStartPoints = [];
  }

  /**
   * Hit test pixel pointer against existing shapes
   */
  public findShapeAtPixel(
    pixel: PixelPoint,
    shapes: DrawingShape[],
    bounds: ChartViewportBounds,
    hitThreshold: number = 10
  ): DrawingShape | null {
    // Reverse loop to check top z-index shapes first
    const visibleShapes = shapes.filter((s) => !s.isHidden);
    for (let i = visibleShapes.length - 1; i >= 0; i--) {
      const shape = visibleShapes[i];
      if (this.hitTestShape(pixel, shape, bounds, hitThreshold)) {
        return shape;
      }
    }
    return null;
  }

  public hitTestShape(
    pixel: PixelPoint,
    shape: DrawingShape,
    bounds: ChartViewportBounds,
    hitThreshold: number = 10
  ): boolean {
    if (shape.points.length === 0) return false;

    const pixels = shape.points.map((pt) => CoordinateUtils.chartToPixel(pt, bounds));

    switch (shape.type) {
      case 'line':
      case 'trendline':
      case 'arrow':
        if (pixels.length >= 2) {
          return CoordinateUtils.distanceToSegment(pixel, pixels[0], pixels[1]) <= hitThreshold;
        }
        break;

      case 'horizontal_line':
        if (pixels.length >= 1) {
          return Math.abs(pixel.y - pixels[0].y) <= hitThreshold;
        }
        break;

      case 'vertical_line':
        if (pixels.length >= 1) {
          return Math.abs(pixel.x - pixels[0].x) <= hitThreshold;
        }
        break;

      case 'ray':
        if (pixels.length >= 2) {
          const dist = CoordinateUtils.distanceToSegment(pixel, pixels[0], pixels[1]);
          if (dist <= hitThreshold) return true;
          // check extended ray
          const dx = pixels[1].x - pixels[0].x;
          const dy = pixels[1].y - pixels[0].y;
          const farPt = { x: pixels[0].x + dx * 100, y: pixels[0].y + dy * 100 };
          return CoordinateUtils.distanceToSegment(pixel, pixels[0], farPt) <= hitThreshold;
        }
        break;

      case 'rectangle':
      case 'circle':
      case 'ellipse':
      case 'measure':
        if (pixels.length >= 2) {
          const { minX, minY, maxX, maxY } = CoordinateUtils.getBoundingBox(pixels);
          return (
            pixel.x >= minX - hitThreshold &&
            pixel.x <= maxX + hitThreshold &&
            pixel.y >= minY - hitThreshold &&
            pixel.y <= maxY + hitThreshold
          );
        }
        break;

      case 'triangle':
      case 'polygon':
        if (pixels.length >= 3) {
          const { minX, minY, maxX, maxY } = CoordinateUtils.getBoundingBox(pixels);
          return (
            pixel.x >= minX - hitThreshold &&
            pixel.x <= maxX + hitThreshold &&
            pixel.y >= minY - hitThreshold &&
            pixel.y <= maxY + hitThreshold
          );
        }
        break;

      case 'parallel_channel':
      case 'regression_channel':
      case 'fib_retracement':
      case 'fib_extension':
        if (pixels.length >= 2) {
          const { minX, minY, maxX, maxY } = CoordinateUtils.getBoundingBox(pixels);
          return (
            pixel.x >= minX - hitThreshold &&
            pixel.x <= maxX + hitThreshold &&
            pixel.y >= minY - hitThreshold &&
            pixel.y <= maxY + hitThreshold
          );
        }
        break;

      case 'text':
      case 'note':
      case 'price_label':
      case 'emoji':
        if (pixels.length >= 1) {
          return CoordinateUtils.distanceBetweenPixels(pixel, pixels[0]) <= hitThreshold + 15;
        }
        break;

      case 'brush':
      case 'highlighter':
        if (shape.freehandPath && shape.freehandPath.length > 0) {
          const freePixels = shape.freehandPath.map((pt) => CoordinateUtils.chartToPixel(pt, bounds));
          for (let k = 0; k < freePixels.length - 1; k++) {
            if (CoordinateUtils.distanceToSegment(pixel, freePixels[k], freePixels[k + 1]) <= hitThreshold + 5) {
              return true;
            }
          }
        }
        break;

      default:
        if (pixels.length >= 1) {
          return CoordinateUtils.distanceBetweenPixels(pixel, pixels[0]) <= hitThreshold;
        }
        break;
    }

    return false;
  }
}
