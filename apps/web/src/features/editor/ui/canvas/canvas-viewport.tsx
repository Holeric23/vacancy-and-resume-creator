import { useRef, useEffect } from 'react';
import { 
  Document, 
  PageId, 
  NodeId, 
  ResizeHandle, 
  getPageSize 
} from 'document-core';
import { InteractionMode } from '../../model/interaction-state.ts';
import { PointerInteractionController } from '../../lib/pointer-interaction-controller.ts';
import { mmToPx } from '../../lib/client-to-document-point.ts';
import { getInteractiveFrame } from '../../lib/drag-preview.ts';
import { NodeRendererRegistry } from '@/entities/document/ui/node-renderer-registry.tsx';
import { SelectionOverlay } from './selection-overlay.tsx';
import styles from './canvas.module.css';

interface CanvasViewportProps {
  documentData: Document;
  activePageId: PageId;
  selectedIds: Set<NodeId>;
  zoom: number;
  interactionMode: InteractionMode;
  onInteractionStart: (mode: InteractionMode) => void;
  onInteractionUpdate: (mode: InteractionMode) => void;
  onInteractionEnd: (commitAction: 'move' | 'resize' | 'none', finalData?: any) => void;
  onSelectNode: (nodeId: NodeId | null) => void;
}

export function CanvasViewport({
  documentData,
  activePageId,
  selectedIds,
  zoom,
  interactionMode,
  onInteractionStart,
  onInteractionUpdate,
  onInteractionEnd,
  onSelectNode,
}: CanvasViewportProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<PointerInteractionController | null>(null);

  const page = documentData.pagesById[activePageId];
  if (!page) {
    return <div className={styles.viewportContainer}>Страница не найдена</div>;
  }

  const pageSizeMm = getPageSize(page.preset, page.orientation);
  const pageWidthPx = mmToPx(pageSizeMm.width, zoom);
  const pageHeightPx = mmToPx(pageSizeMm.height, zoom);

  // 1. Создаем контроллер один раз при монтировании и уничтожаем при размонтировании
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, []);

  // 2. Синхронизируем настройки без пересоздания инстанса класса
  useEffect(() => {
    if (pageRef.current) {
      const transformSettings = {
        zoom,
        pageOffsetLeft: pageRef.current.offsetLeft,
        pageOffsetTop: pageRef.current.offsetTop,
      };
      const callbacks = {
        onInteractionStart,
        onInteractionUpdate,
        onInteractionEnd,
      };

      if (!controllerRef.current) {
        controllerRef.current = new PointerInteractionController(
          pageRef.current,
          transformSettings,
          callbacks
        );
      } else {
        controllerRef.current.updateSettings(transformSettings, callbacks);
      }
    }
  }, [zoom, onInteractionStart, onInteractionUpdate, onInteractionEnd]);

  const handlePagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectNode(null);
    }
  };

  const handleNodePointerDown = (e: React.PointerEvent<HTMLDivElement>, nodeId: NodeId) => {
    const node = page.nodesById[nodeId];
    if (node && controllerRef.current) {
      onSelectNode(nodeId);
      controllerRef.current.handlePointerDownOnNode(e.nativeEvent, nodeId, node.frame);
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>, handle: ResizeHandle) => {
    const selectedId = Array.from(selectedIds)[0];
    if (!selectedId) return;

    const node = page.nodesById[selectedId];
    if (node && controllerRef.current) {
      controllerRef.current.handlePointerDownOnHandle(e.nativeEvent, selectedId, handle, node.frame);
    }
  };

  return (
    <div 
      className={styles.viewportContainer} 
      data-viewport-container
      onPointerDown={handlePagePointerDown} // <-- Теперь серый фон вокруг листа гарантированно снимает выделение при клике!
    >
      <div
        ref={pageRef}
        className={styles.documentPage}
        style={{
          width: `${pageWidthPx}px`,
          height: `${pageHeightPx}px`,
        }}
        onPointerDown={handlePagePointerDown}
      >
        {page.nodeOrder.map((nodeId) => {
          const node = page.nodesById[nodeId];
          if (!node) return null;

          const displayFrame = getInteractiveFrame(nodeId, node.frame, interactionMode);

          const xPx = mmToPx(displayFrame.x, zoom);
          const yPx = mmToPx(displayFrame.y, zoom);
          const wPx = mmToPx(displayFrame.width, zoom);
          const hPx = mmToPx(displayFrame.height, zoom);

          return (
            <div
              key={nodeId}
              className={styles.nodeWrapper}
              style={{
                left: `${xPx}px`,
                top: `${yPx}px`,
                width: `${wPx}px`,
                height: `${hPx}px`,
                zIndex: node.zIndex,
              }}
              onPointerDown={(e) => handleNodePointerDown(e, nodeId)}
            >
              <NodeRendererRegistry node={node} zoom={zoom} />
            </div>
          );
        })}

        {page.nodeOrder.map((nodeId) => {
          if (!selectedIds.has(nodeId)) return null;

          const node = page.nodesById[nodeId];
          if (!node) return null;

          const displayFrame = getInteractiveFrame(nodeId, node.frame, interactionMode);

          return (
            <SelectionOverlay
              key={`select-${nodeId}`}
              frame={displayFrame}
              zoom={zoom}
              onHandlePointerDown={handleResizePointerDown}
            />
          );
        })}
      </div>
    </div>
  );
}