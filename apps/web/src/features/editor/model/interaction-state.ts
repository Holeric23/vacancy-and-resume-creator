import { Point, ResizeHandle } from 'document-core';

export type InteractionMode = 
  | { type: 'idle' }
  | { 
      type: 'dragging'; 
      startPoint: Point;      // Точка зажатия в мм документа
      currentPoint: Point;    // Текущая точка в мм документа
      initialFrames: Record<string, { x: number; y: number; width: number; height: number }>;
    }
  | { 
      type: 'resizing'; 
      startPoint: Point;      // Точка зажатия в мм документа
      currentPoint: Point;    // Текущая точка в мм документа
      handle: ResizeHandle;   // Какую именно сторону/угол тянем
      nodeId: string;
      initialFrame: { x: number; y: number; width: number; height: number };
    }
  | {
      type: 'marquee';        // Выделение рамкой
      startPoint: Point;
      currentPoint: Point;
    };