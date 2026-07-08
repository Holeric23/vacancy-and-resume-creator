export interface Point {
  x: number; // mm
  y: number; // mm
}

export interface Size {
  width: number;  // mm
  height: number; // mm
}

export interface Rect extends Point, Size {}

// Направления маркеров для изменения размеров
export type ResizeHandle = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';