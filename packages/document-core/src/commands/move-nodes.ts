import { Command, CommandResult } from './command.ts';
import { Document } from '../model/document.ts';
import { PageId, NodeId } from '../model/identifiers.ts';
import { getPageSize } from '../model/page-presets.ts';
import { clampRectToPage } from '../geometry/clamp-rect.ts';

export interface NodeMoveDelta {
  id: NodeId;
  dx: number; // Сдвиг по оси X в мм
  dy: number; // Сдвиг по оси Y в мм
}

export class MoveNodesCommand implements Command {
  readonly type = 'MOVE_NODES';

  constructor(
    private readonly pageId: PageId,
    private readonly deltas: NodeMoveDelta[]
  ) {}

  execute(document: Document): CommandResult {
    const page = document.pagesById[this.pageId];
    if (!page) {
      return { document, inverse: this };
    }

    const pageSize = getPageSize(page.preset, page.orientation);
    const updatedNodes = { ...page.nodesById };
    const inverseDeltas: NodeMoveDelta[] = [];

    for (const delta of this.deltas) {
      const node = page.nodesById[delta.id];
      if (!node) continue;

      // Рассчитываем новую позицию
      const targetFrame = {
        ...node.frame,
        x: node.frame.x + delta.dx,
        y: node.frame.y + delta.dy,
      };

      // Удерживаем координаты в рамках физической страницы
      const clampedFrame = clampRectToPage(targetFrame, pageSize);

      // Рассчитываем РЕАЛЬНУЮ дельту смещения после удержания (для точного Undo)
      const realDx = clampedFrame.x - node.frame.x;
      const realDy = clampedFrame.y - node.frame.y;

      updatedNodes[delta.id] = {
        ...node,
        frame: clampedFrame,
      };

      inverseDeltas.push({
        id: delta.id,
        dx: -realDx,
        dy: -realDy,
      });
    }

    const newDocument: Document = {
      ...document,
      pagesById: {
        ...document.pagesById,
        [this.pageId]: {
          ...page,
          nodesById: updatedNodes,
        },
      },
    };

    return {
      document: newDocument,
      inverse: new MoveNodesCommand(this.pageId, inverseDeltas),
    };
  }
}