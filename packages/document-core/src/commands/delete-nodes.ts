import { Command, CommandResult } from './command.ts';
import { Document } from '../model/document.ts';
import { PageId, NodeId } from '../model/identifiers.ts';
import { DocumentNode } from '../model/node.ts';
import { AddNodesCommand } from './add-nodes.ts';

export class DeleteNodesCommand implements Command {
  readonly type = 'DELETE_NODES';

  constructor(
    private readonly pageId: PageId,
    private readonly nodeIds: NodeId[]
  ) {}

  execute(document: Document): CommandResult {
    const page = document.pagesById[this.pageId];
    if (!page) {
      return { document, inverse: this };
    }

    const updatedNodes = { ...page.nodesById };
    const deletedNodes: DocumentNode[] = [];

    // Безопасно вырезаем объекты из карты
    for (const id of this.nodeIds) {
      const node = page.nodesById[id];
      if (node) {
        deletedNodes.push(node);
        delete updatedNodes[id];
      }
    }

    // Удаляем ID объектов из z-order массива
    const updatedNodeOrder = page.nodeOrder.filter(
      (id) => !this.nodeIds.includes(id)
    );

    const newDocument: Document = {
      ...document,
      pagesById: {
        ...document.pagesById,
        [this.pageId]: {
          ...page,
          nodesById: updatedNodes,
          nodeOrder: updatedNodeOrder,
        },
      },
    };

    // Обратная операция удаления — это добавление удаленных объектов обратно на те же места
    return {
      document: newDocument,
      inverse: new AddNodesCommand(this.pageId, deletedNodes),
    };
  }
}