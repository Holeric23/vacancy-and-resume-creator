import { PageId, NodeId } from './identifiers.ts';
import { PageOrientation, PagePresetName } from './page-presets.ts';
import { DocumentNode } from './node.ts';

export interface Page {
  id: PageId;
  preset: PagePresetName;
  orientation: PageOrientation;
  nodesById: Record<NodeId, DocumentNode>;
  nodeOrder: NodeId[];
}