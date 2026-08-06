import { DrawingShape } from './types';

export class StorageManager {
  private static STORAGE_PREFIX = 'fb_drawings_v2';

  public static getStorageKey(symbol: string, timeframe: string, userId?: string): string {
    const userKey = userId ? `_${userId}` : '';
    return `${StorageManager.STORAGE_PREFIX}_${symbol}_${timeframe}${userKey}`;
  }

  public static loadDrawings(symbol: string, timeframe: string, userId?: string): DrawingShape[] {
    try {
      const key = StorageManager.getStorageKey(symbol, timeframe, userId);
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load chart drawings from localStorage', err);
    }
    return [];
  }

  public static saveDrawings(symbol: string, timeframe: string, shapes: DrawingShape[], userId?: string): void {
    try {
      const key = StorageManager.getStorageKey(symbol, timeframe, userId);
      localStorage.setItem(key, JSON.stringify(shapes));
    } catch (err) {
      console.warn('Failed to save chart drawings to localStorage', err);
    }
  }

  public static clearDrawings(symbol: string, timeframe: string, userId?: string): void {
    try {
      const key = StorageManager.getStorageKey(symbol, timeframe, userId);
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('Failed to clear drawings', err);
    }
  }
}
