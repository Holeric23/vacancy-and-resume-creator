import { ResizeHandle } from 'document-core';
import styles from './canvas.module.css';

interface ResizeHandlesProps {
  onHandlePointerDown: (e: React.PointerEvent<HTMLDivElement>, handle: ResizeHandle) => void;
}

// Конфигурация 8 направлений: имя маркера, позиционирование в % и тип курсора
const HANDLE_CONFIGS: { handle: ResizeHandle; top: string; left: string; cursor: string }[] = [
  { handle: 'NW', top: '0%', left: '0%', cursor: 'nwse-resize' },
  { handle: 'N', top: '0%', left: '50%', cursor: 'ns-resize' },
  { handle: 'NE', top: '0%', left: '100%', cursor: 'nesw-resize' },
  { handle: 'E', top: '50%', left: '100%', cursor: 'ew-resize' },
  { handle: 'SE', top: '100%', left: '100%', cursor: 'nwse-resize' },
  { handle: 'S', top: '100%', left: '50%', cursor: 'ns-resize' },
  { handle: 'SW', top: '100%', left: '0%', cursor: 'nesw-resize' },
  { handle: 'W', top: '50%', left: '0%', cursor: 'ew-resize' },
];

export function ResizeHandles({ onHandlePointerDown }: ResizeHandlesProps) {
  return (
    <>
      {HANDLE_CONFIGS.map(({ handle, top, left, cursor }) => (
        <div
          key={handle}
          className={styles.resizeHandle}
          style={{ top, left, cursor }}
          onPointerDown={(e) => onHandlePointerDown(e, handle)}
        />
      ))}
    </>
  );
}