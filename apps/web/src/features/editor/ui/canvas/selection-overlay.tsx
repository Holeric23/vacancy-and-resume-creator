import { Rect, ResizeHandle } from 'document-core';
import { mmToPx } from '@/features/editor/lib/client-to-document-point.ts';
import { ResizeHandles } from './resize-handles.tsx';
import styles from './canvas.module.css';

interface SelectionOverlayProps {
  frame: Rect;
  zoom: number;
  onHandlePointerDown?: (e: React.PointerEvent<HTMLDivElement>, handle: ResizeHandle) => void;
}

export function SelectionOverlay({ frame, zoom, onHandlePointerDown }: SelectionOverlayProps) {
  // Переводим миллиметры рамки в экранные пиксели
  const xPx = mmToPx(frame.x, zoom);
  const yPx = mmToPx(frame.y, zoom);
  const wPx = mmToPx(frame.width, zoom);
  const hPx = mmToPx(frame.height, zoom);

  return (
    <div
      className={styles.selectionBorder}
      style={{
        left: `${xPx}px`,
        top: `${yPx}px`,
        width: `${wPx}px`,
        height: `${hPx}px`,
      }}
    >
      {onHandlePointerDown && (
        <ResizeHandles onHandlePointerDown={onHandlePointerDown} />
      )}
    </div>
  );
}