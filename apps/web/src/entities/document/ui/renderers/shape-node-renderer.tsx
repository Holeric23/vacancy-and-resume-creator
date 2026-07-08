import { ShapeNode } from 'document-core';
import { PX_PER_MM } from '@/features/editor/lib/client-to-document-point.ts';

interface ShapeNodeRendererProps {
  node: ShapeNode;
  zoom: number;
}

export function ShapeNodeRenderer({ node, zoom }: ShapeNodeRendererProps) {
  const { shapeType, style } = node;

  const borderWidthPx = style.borderWidth ? style.borderWidth * zoom * PX_PER_MM : 0;
  const cornerRadiusPx = style.cornerRadius ? style.cornerRadius * zoom * PX_PER_MM : 0;

  // Рассчитываем тень в пикселях с учетом масштаба
  let boxShadow = 'none';
  if (style.shadow) {
    const s = style.shadow;
    const ox = s.offsetX * zoom * PX_PER_MM;
    const oy = s.offsetY * zoom * PX_PER_MM;
    const blur = s.blur * zoom * PX_PER_MM;
    boxShadow = `${ox}px ${oy}px ${blur}px ${s.color}`;
  }

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor ?? '#e0e0e0',
    border: borderWidthPx > 0 ? `${borderWidthPx}px solid ${style.borderColor ?? '#cccccc'}` : 'none',
    boxShadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
  };

  if (shapeType === 'ellipse') {
    return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
  }

  return <div style={{ ...baseStyle, borderRadius: `${cornerRadiusPx}px` }} />;
}