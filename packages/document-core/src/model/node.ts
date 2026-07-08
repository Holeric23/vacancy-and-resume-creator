import { NodeId } from './identifiers.ts';
import { Rect } from './geometry.ts';
import { NodeStyle, TextStyle } from './style.ts';

export type NodeKind = 'shape' | 'text' | 'heading' | 'list';

export interface BaseNode {
  id: NodeId;
  kind: NodeKind;
  frame: Rect;
  zIndex: number;
  style: NodeStyle;
}

export interface ShapeNode extends BaseNode {
  kind: 'shape';
  shapeType: 'rectangle' | 'ellipse';
}

export interface TextNode extends BaseNode {
  kind: 'text';
  content: string;
  textStyle: TextStyle;
}

export interface HeadingNode extends BaseNode {
  kind: 'heading';
  content: string;
  level: 1 | 2 | 3;
  textStyle: TextStyle;
}

export interface ListNode extends BaseNode {
  kind: 'list';
  items: string[];
  ordered: boolean;
  textStyle: TextStyle;
}

// Объединяющий тип узла документа
export type DocumentNode = ShapeNode | TextNode | HeadingNode | ListNode;