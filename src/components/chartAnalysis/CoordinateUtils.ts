import { ChartPoint, PixelPoint, ChartViewportBounds } from './types';

export class CoordinateUtils {
  public static chartToPixel(point: ChartPoint, bounds: ChartViewportBounds): PixelPoint {
    const range = bounds.maxPrice - bounds.minPrice || 1;

    let viewportXRatio = point.timeRatio;
    const totalMinusOne = (bounds.totalCount || 1) - 1;
    const visibleMinusOne = (bounds.visibleCount || 1) - 1;

    if (totalMinusOne > 0 && visibleMinusOne > 0) {
      const startRatio = (bounds.startIndex || 0) / totalMinusOne;
      const spanRatio = visibleMinusOne / totalMinusOne;
      if (spanRatio > 0) {
        viewportXRatio = (point.timeRatio - startRatio) / spanRatio;
      }
    }

    const x = bounds.padLeft + viewportXRatio * bounds.chartWidth;
    const yRatio = (point.price - bounds.minPrice) / range;
    const y = bounds.padTop + bounds.chartHeight * (1 - yRatio);
    return { x, y };
  }

  public static pixelToChart(pixel: PixelPoint, bounds: ChartViewportBounds): ChartPoint {
    const range = bounds.maxPrice - bounds.minPrice || 1;
    const viewportXRatio = bounds.chartWidth > 0 ? (pixel.x - bounds.padLeft) / bounds.chartWidth : 0;

    let timeRatio = viewportXRatio;
    const totalMinusOne = (bounds.totalCount || 1) - 1;
    const visibleMinusOne = (bounds.visibleCount || 1) - 1;

    if (totalMinusOne > 0 && visibleMinusOne > 0) {
      const startRatio = (bounds.startIndex || 0) / totalMinusOne;
      const spanRatio = visibleMinusOne / totalMinusOne;
      timeRatio = startRatio + viewportXRatio * spanRatio;
    }

    const yRatio = bounds.chartHeight > 0 ? 1 - (pixel.y - bounds.padTop) / bounds.chartHeight : 0;
    const price = bounds.minPrice + yRatio * range;
    return { timeRatio, price };
  }

  public static distanceBetweenPixels(p1: PixelPoint, p2: PixelPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public static distanceToSegment(p: PixelPoint, a: PixelPoint, b: PixelPoint): number {
    const l2 = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
    if (l2 === 0) return CoordinateUtils.distanceBetweenPixels(p, a);
    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const proj = {
      x: a.x + t * (b.x - a.x),
      y: a.y + t * (b.y - a.y),
    };
    return CoordinateUtils.distanceBetweenPixels(p, proj);
  }

  public static distanceToLine(p: PixelPoint, a: PixelPoint, b: PixelPoint): number {
    const num = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x);
    const den = Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
    if (den === 0) return CoordinateUtils.distanceBetweenPixels(p, a);
    return num / den;
  }

  public static isPointInRect(p: PixelPoint, topX: number, topY: number, width: number, height: number): boolean {
    return (
      p.x >= Math.min(topX, topX + width) &&
      p.x <= Math.max(topX, topX + width) &&
      p.y >= Math.min(topY, topY + height) &&
      p.y <= Math.max(topY, topY + height)
    );
  }

  public static getBoundingBox(pixels: PixelPoint[]): { minX: number; minY: number; maxX: number; maxY: number } {
    if (pixels.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let minX = pixels[0].x;
    let maxX = pixels[0].x;
    let minY = pixels[0].y;
    let maxY = pixels[0].y;
    for (const p of pixels) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
  }
}
