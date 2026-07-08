import { ResizeHandle, asNodeId } from 'document-core';
import { InteractionMode } from '../model/interaction-state.ts';
import { clientToDocumentPoint, ViewportTransform } from './client-to-document-point.ts';

export interface PointerControllerCallbacks {
  onInteractionStart: (mode: InteractionMode) => void;
  onInteractionUpdate: (mode: InteractionMode) => void;
  onInteractionEnd: (commitAction: 'move' | 'resize' | 'none', finalData?: any) => void;
}

export class PointerInteractionController {
  private activeMode: InteractionMode = { type: 'idle' };
  
  // Сохраняем стабильные ссылки на обработчики для корректной отписки в window
  private readonly boundPointerMove = this.handlePointerMove.bind(this);
  private readonly boundPointerUp = this.handlePointerUp.bind(this);

  constructor(
    private readonly pageElement: HTMLElement,
    private transform: ViewportTransform,
    private callbacks: PointerControllerCallbacks
  ) {}

  /**
   * Позволяет обновить параметры масштабирования и коллбеков без уничтожения инстанса класса
   */
  public updateSettings(transform: ViewportTransform, callbacks: PointerControllerCallbacks): void {
    this.transform = transform;
    this.callbacks = callbacks;
  }

  public handlePointerDownOnNode(
    e: PointerEvent,
    nodeId: string,
    nodeFrame: { x: number; y: number; width: number; height: number }
  ): void {
    e.preventDefault();
    e.stopPropagation();

    const docPoint = clientToDocumentPoint(
      e.clientX,
      e.clientY,
      this.pageElement,
      this.transform
    );

    this.activeMode = {
      type: 'dragging',
      startPoint: docPoint,
      currentPoint: docPoint,
      initialFrames: {
        [nodeId]: { ...nodeFrame },
      },
    };

    // Подписываемся на события во всем окне для надежного удерживания при быстром движении
    window.addEventListener('pointermove', this.boundPointerMove);
    window.addEventListener('pointerup', this.boundPointerUp);

    this.callbacks.onInteractionStart(this.activeMode);
  }

  public handlePointerDownOnHandle(
    e: PointerEvent,
    nodeId: string,
    handle: ResizeHandle,
    nodeFrame: { x: number; y: number; width: number; height: number }
  ): void {
    e.preventDefault();
    e.stopPropagation();

    const docPoint = clientToDocumentPoint(
      e.clientX,
      e.clientY,
      this.pageElement,
      this.transform
    );

    this.activeMode = {
      type: 'resizing',
      startPoint: docPoint,
      currentPoint: docPoint,
      handle,
      nodeId,
      initialFrame: { ...nodeFrame },
    };

    window.addEventListener('pointermove', this.boundPointerMove);
    window.addEventListener('pointerup', this.boundPointerUp);

    this.callbacks.onInteractionStart(this.activeMode);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (this.activeMode.type === 'idle') return;

    const docPoint = clientToDocumentPoint(
      e.clientX,
      e.clientY,
      this.pageElement,
      this.transform
    );

    if (this.activeMode.type === 'dragging') {
      this.activeMode = {
        ...this.activeMode,
        currentPoint: docPoint,
      };
      this.callbacks.onInteractionUpdate(this.activeMode);
    } else if (this.activeMode.type === 'resizing') {
      this.activeMode = {
        ...this.activeMode,
        currentPoint: docPoint,
      };
      this.callbacks.onInteractionUpdate(this.activeMode);
    }
  }

  private handlePointerUp(_e: PointerEvent): void {
    if (this.activeMode.type === 'idle') return;

    // Снимаем глобальные слушатели окна после завершения операции
    window.removeEventListener('pointermove', this.boundPointerMove);
    window.removeEventListener('pointerup', this.boundPointerUp);

    const finalMode = this.activeMode;
    this.activeMode = { type: 'idle' };

    if (finalMode.type === 'dragging') {
      const dx = finalMode.currentPoint.x - finalMode.startPoint.x;
      const dy = finalMode.currentPoint.y - finalMode.startPoint.y;

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        this.callbacks.onInteractionEnd('none');
      } else {
        const moveData = Object.keys(finalMode.initialFrames).map((id) => ({
          id: asNodeId(id),
          dx,
          dy,
        }));
        this.callbacks.onInteractionEnd('move', moveData);
      }
    } else if (finalMode.type === 'resizing') {
      const dx = finalMode.currentPoint.x - finalMode.startPoint.x;
      const dy = finalMode.currentPoint.y - finalMode.startPoint.y;

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        this.callbacks.onInteractionEnd('none');
      } else {
        const resizeData = {
          nodeId: asNodeId(finalMode.nodeId),
          handle: finalMode.handle,
          dx,
          dy,
        };
        this.callbacks.onInteractionEnd('resize', resizeData);
      }
    } else {
      this.callbacks.onInteractionEnd('none');
    }
  }

  /**
   * Метод очистки слушателей при размонтировании React-компонента
   */
  public destroy(): void {
    window.removeEventListener('pointermove', this.boundPointerMove);
    window.removeEventListener('pointerup', this.boundPointerUp);
  }
}