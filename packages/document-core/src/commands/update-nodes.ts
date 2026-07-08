import { Command, CommandResult } from './command.ts';
import { Document } from '../model/document.ts';
import { PageId, NodeId } from '../model/identifiers.ts';
import { DocumentNode } from '../model/node.ts';
import { Rect } from '../model/geometry.ts';

export interface NodePatch {
  id: NodeId;
  content?: string;
  style?: Partial<DocumentNode['style']>;
  textStyle?: Record<string, unknown>;
  zIndex?: number;
  frame?: Partial<Rect>; // Поддержка изменения координат и размеров из инспектора
}

export class UpdateNodesCommand implements Command {
  readonly type = 'UPDATE_NODES';

  constructor(
    private readonly pageId: PageId,
    private readonly patches: NodePatch[]
  ) {}

  execute(document: Document): CommandResult {
    const page = document.pagesById[this.pageId];
    if (!page) {
      return { document, inverse: this };
    }

    const updatedNodes = { ...page.nodesById };
    const inversePatches: NodePatch[] = [];

    for (const patch of this.patches) {
      const originalNode = page.nodesById[patch.id];
      if (!originalNode) continue;

      const inversePatch: NodePatch = { id: patch.id };
      const updatedNode = { ...originalNode } as DocumentNode;

      if (patch.content !== undefined && 'content' in updatedNode) {
        inversePatch.content = (originalNode as { content: string }).content;
        (updatedNode as { content: string }).content = patch.content;
      }

      if (patch.style !== undefined) {
        inversePatch.style = {};
        for (const key of Object.keys(patch.style)) {
          const styleKey = key as keyof typeof patch.style;
          inversePatch.style[styleKey] = originalNode.style[styleKey] as never;
        }
        updatedNode.style = { ...originalNode.style, ...patch.style };
      }

      // Безопасное слияние TextStyle с приведением к unknown перед Record
      if (patch.textStyle !== undefined && 'textStyle' in updatedNode) {
        inversePatch.textStyle = {};
        
        // Приведение к unknown убирает ошибки несовместимости строгих интерфейсов (Index signature is missing)
        const originalTextStyle = (originalNode as unknown as { textStyle: Record<string, any> }).textStyle;
        const targetNodeWithText = updatedNode as unknown as { textStyle: Record<string, any> };

        for (const key of Object.keys(patch.textStyle)) {
          inversePatch.textStyle[key] = originalTextStyle[key];
        }

        targetNodeWithText.textStyle = {
          ...originalTextStyle,
          ...patch.textStyle,
        };
      }

      if (patch.zIndex !== undefined) {
        inversePatch.zIndex = originalNode.zIndex;
        updatedNode.zIndex = patch.zIndex;
      }

      // Иммутабельно обновляем фрейм (геометрию) объекта на холсте
      if (patch.frame !== undefined) {
        inversePatch.frame = {};
        for (const key of Object.keys(patch.frame)) {
          const frameKey = key as keyof typeof patch.frame;
          inversePatch.frame[frameKey] = originalNode.frame[frameKey] as never;
        }
        updatedNode.frame = { ...originalNode.frame, ...patch.frame };
      }

      updatedNodes[patch.id] = updatedNode;
      inversePatches.push(inversePatch);
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
      inverse: new UpdateNodesCommand(this.pageId, inversePatches),
    };
  }
}