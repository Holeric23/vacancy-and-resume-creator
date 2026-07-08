import { TextNode } from 'document-core';
import { PX_PER_MM } from '@/features/editor/lib/client-to-document-point.ts';
import { getSafeFontStack } from '@/entities/document/model/font-catalog.ts';

interface TextNodeRendererProps {
  node: TextNode;
  zoom: number;
}

export function TextNodeRenderer({ node, zoom }: TextNodeRendererProps) {
  const { content, textStyle, style } = node;

  const borderWidthPx = style.borderWidth ? style.borderWidth * zoom * PX_PER_MM : 0;
  const cornerRadiusPx = style.cornerRadius ? style.cornerRadius * zoom * PX_PER_MM : 0;
  
  // Конвертируем размер шрифта из mm (или pt) в пиксели
  const fontSizePx = (textStyle.fontSize ?? 14) * zoom * (PX_PER_MM * 0.3527); // 0.3527 — соотношение pt к мм

  let boxShadow = 'none';
  if (style.shadow) {
    const s = style.shadow;
    boxShadow = `${s.offsetX * zoom * PX_PER_MM}px ${s.offsetY * zoom * PX_PER_MM}px ${s.blur * zoom * PX_PER_MM}px ${s.color}`;
  }

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor ?? 'transparent',
    border: borderWidthPx > 0 ? `${borderWidthPx}px solid ${style.borderColor ?? '#cccccc'}` : 'none',
    borderRadius: `${cornerRadiusPx}px`,
    boxShadow,
    color: textStyle.textColor ?? '#000000',
    fontFamily: getSafeFontStack(textStyle.fontFamily ?? 'System'),
    fontSize: `${fontSizePx}px`,
    lineHeight: textStyle.lineHeight ?? 1.2,
    textAlign: textStyle.textAlign ?? 'left',
    padding: `${8 * zoom}px`,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    wordBreak: 'break-word',
    userSelect: 'none',
  };

  return <div style={baseStyle}>{content}</div>;
}