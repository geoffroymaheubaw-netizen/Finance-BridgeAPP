import { ToolType, ShapeStyle, DrawingShape } from './types';

export class ToolManager {
  private activeTool: ToolType = 'select';
  private defaultStyle: ShapeStyle = {
    strokeColor: '#3b82f6', // Indigo / Blue
    fillColor: 'rgba(59, 130, 246, 0.15)',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    textColor: '#f8fafc',
    showPriceLabels: true,
  };
  private clipboard: DrawingShape | null = null;
  private selectedEmoji: string = '🎯';

  public getActiveTool(): ToolType {
    return this.activeTool;
  }

  public setActiveTool(tool: ToolType): void {
    this.activeTool = tool;
  }

  public getDefaultStyle(): ShapeStyle {
    return { ...this.defaultStyle };
  }

  public updateDefaultStyle(patch: Partial<ShapeStyle>): void {
    this.defaultStyle = { ...this.defaultStyle, ...patch };
  }

  public setClipboard(shape: DrawingShape | null): void {
    this.clipboard = shape ? JSON.parse(JSON.stringify(shape)) : null;
  }

  public getClipboard(): DrawingShape | null {
    return this.clipboard ? JSON.parse(JSON.stringify(this.clipboard)) : null;
  }

  public setSelectedEmoji(emoji: string): void {
    this.selectedEmoji = emoji;
  }

  public getSelectedEmoji(): string {
    return this.selectedEmoji;
  }
}
