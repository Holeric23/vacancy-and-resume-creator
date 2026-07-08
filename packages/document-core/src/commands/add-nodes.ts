import { Command, CommandResult } from './command.ts';
import { Document } from '../model/document.ts';
import { PageId } from '../model/identifiers.ts';
import { DocumentNode } from '../model/node.ts';

export class AddNodesCommand implements Command {
  readonly type = 'ADD_NODES';

  constructor(
    private readonly pageId: PageId,
    private readonly nodes: DocumentNode[]
  ) {}

  execute(document: Document): CommandResult {
    const page = document.pagesById[this.pageId];
    if (!page) {
      return { document, inverse: this };
    }

    const updatedNodes = { ...page.nodesById };
    const updatedNodeOrder = [...page.nodeOrder];

    // Добавляем новые узлы на страницу
    for (const node of this.nodes) {
      updatedNodes[node.id] = node;
      if (!updatedNodeOrder.includes(node.id)) {
        updatedNodeOrder.push(node.id);
      }
    }

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

    // Описываем обратное действие — удаление созданных узлов
    class DeleteNodesCommand implements Command {
      readonly type = 'DELETE_NODES_INVERSE';
      constructor(
        private readonly pId: PageId,
        private readonly nodeIds: string[]
      ) {}

      execute(doc: Document): CommandResult {
        const p = doc.pagesById[this.pId];
        if (!p) return { document: doc, inverse: this };

        const nextNodes = { ...p.nodesById };
        const nextOrder = p.nodeOrder.filter((id) => !this.nodeIds.includes(id));
        
        const deletedNodes: DocumentNode[] = [];
        for (const id of this.nodeIds) {
          const deletedNode = p.nodesById[id as never];
          if (deletedNode) {
            deletedNodes.push(deletedNode);
          }
          delete nextNodes[id as never];
        }

        return {
          document: {
            ...doc,
            pagesById: {
              ...doc.pagesById,
              [this.pId]: {
                ...p,
                nodesById: nextNodes,
                nodeOrder: nextOrder,
              },
            },
          },
          // Переприменение удаления вернет добавление
          inverse: new AddNodesCommand(this.pId, deletedNodes),
        };
      }
    }

    return {
      document: newDocument,
      inverse: new DeleteNodesCommand(this.pageId, this.nodes.map(n => n.id)),
    };
  }
}