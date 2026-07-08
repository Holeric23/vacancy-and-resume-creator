import { Command, CommandResult } from './command.ts';
import { Document } from '../model/document.ts';
import { PageId, NodeId } from '../model/identifiers.ts';
import { ResizeHandle, Rect } from '../model/geometry.ts';
import { getPageSize } from '../model/page-presets.ts';
import { clampRectToPage } from '../geometry/clamp-rect.ts';

export class ResizeNodeCommand implements Command {
  readonly type = 'RESIZE_NODE';

  constructor(
    private readonly pageId: PageId,
    private readonly nodeId: NodeId,
    private readonly handle: ResizeHandle,
    private readonly clientDeltaX: number, // мм
    private readonly clientDeltaY: number  // мм
  ) {}

  execute(document: Document): CommandResult {
    const page = document.pagesById[this.pageId];
    if (!page) return { document, inverse: this };

    const node = page.nodesById[this.nodeId];
    if (!node) return { document, inverse: this };

    const pageSize = getPageSize(page.preset, page.orientation);
    const originalFrame = node.frame;
    const f = { ...originalFrame };

    // Алгоритм деформации прямоугольника в зависимости от маркера (Handle)
    // N (Север), S (Юг), E (Восток), W (Запад) и их диагональные композиции
    if (this.handle.includes('E')) {
      f.width = Math.max(5, originalFrame.width + this.clientDeltaX);
    }
    if (this.handle.includes('S')) {
      f.height = Math.max(5, originalFrame.height + this.clientDeltaY);
    }
    if (this.handle.includes('W')) {
      const possibleWidth = originalFrame.width - this.clientDeltaX;
      if (possibleWidth >= 5) {
        f.x = originalFrame.x + this.clientDeltaX;
        f.width = possibleWidth;
      }
    }
    if (this.handle.includes('N')) {
      const possibleHeight = originalFrame.height - this.clientDeltaY;
      if (possibleHeight >= 5) {
        f.y = originalFrame.y + this.clientDeltaY;
        f.height = possibleHeight;
      }
    }

    // Удерживаем измененный прямоугольник внутри листа А4
    const clampedFrame = clampRectToPage(f, pageSize);

    const newDocument: Document = {
      ...document,
      pagesById: {
        ...document.pagesById,
        [this.pageId]: {
          ...page,
          nodesById: {
            ...page.nodesById,
            [this.nodeId]: {
              ...node,
              frame: clampedFrame,
            },
          },
        },
      },
    };

    // Для обратной команды мы просто передаем команду восстановления оригинальной рамки
    class RestoreFrameCommand implements Command {
      readonly type = 'RESTORE_FRAME';
      constructor(
        private readonly pId: PageId,
        private readonly nId: NodeId,
        private readonly oldFrame: Rect,
        private readonly newFrame: Rect
      ) {}

      execute(doc: Document): CommandResult {
        const p = doc.pagesById[this.pId];
        const n = p?.nodesById[this.nId];
        if (!p || !n) return { document: doc, inverse: this };

        return {
          document: {
            ...doc,
            pagesById: {
              ...doc.pagesById,
              [this.pId]: {
                ...p,
                nodesById: {
                  ...p.nodesById,
                  [this.nId]: { ...n, frame: this.oldFrame },
                },
              },
            },
          },
          inverse: new RestoreFrameCommand(this.pId, this.nId, this.newFrame, this.oldFrame),
        };
      }
    }

    return {
      document: newDocument,
      inverse: new RestoreFrameCommand(this.pageId, this.nodeId, originalFrame, clampedFrame),
    };
  }
}