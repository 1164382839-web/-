export enum AppState {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum SketchStyle {
  PENCIL = 'Classic Pencil',
  CHARCOAL = 'Charcoal',
  INK = 'Pen & Ink',
  COLORED_PENCIL = 'Colored Pencil',
  WATERCOLOR_SKETCH = 'Watercolor Sketch'
}

export interface GenerationResult {
  originalImage: string; // Base64
  sketchImage: string | null; // Base64
  style: SketchStyle;
}

export interface ProcessingError {
  message: string;
  code?: string;
}