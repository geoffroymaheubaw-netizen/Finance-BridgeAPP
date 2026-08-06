import { DrawingShape, HistoryAction } from './types';

export class HistoryManager {
  private undoStack: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];
  private maxHistory: number = 50;

  public pushAction(action: HistoryAction): void {
    this.undoStack.push(action);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo stack on new action
    this.redoStack = [];
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(): HistoryAction | null {
    if (!this.canUndo()) return null;
    const action = this.undoStack.pop()!;
    this.redoStack.push(action);
    return action;
  }

  public redo(): HistoryAction | null {
    if (!this.canRedo()) return null;
    const action = this.redoStack.pop()!;
    this.undoStack.push(action);
    return action;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  public getUndoCount(): number {
    return this.undoStack.length;
  }

  public getRedoCount(): number {
    return this.redoStack.length;
  }
}
