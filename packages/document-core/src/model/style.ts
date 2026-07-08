export interface ShadowStyle {
  offsetX: number; // mm
  offsetY: number; // mm
  blur: number;    // mm
  color: string;   // hex, rgba
}

export interface NodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;    // mm
  cornerRadius?: number;   // mm
  shadow?: ShadowStyle;
}

export interface TextStyle {
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;       // pt / mm
  lineHeight?: number;     // множитель (например, 1.2)
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}