import { DocumentNode } from 'document-core';
import { ShapeNodeRenderer } from './renderers/shape-node-renderer.tsx';
import { TextNodeRenderer } from './renderers/text-node-renderer.tsx';

interface NodeRendererRegistryProps {
  node: DocumentNode;
  zoom: number;
}

export function NodeRendererRegistry({ node, zoom }: NodeRendererRegistryProps) {
  // Exhaustive switch по полю 'kind' обеспечивает строгую безопасность типов
  switch (node.kind) {
    case 'shape':
      return <ShapeNodeRenderer node={node} zoom={zoom} />;
    case 'text':
      return <TextNodeRenderer node={node} zoom={zoom} />;
    case 'heading':
      // Заголовки временно переиспользуют рендерер обычного текста
      return <TextNodeRenderer node={node as never} zoom={zoom} />;
    case 'list':
      // Списки временно рендерятся как текст
      return <TextNodeRenderer node={node as never} zoom={zoom} />;
    default: {
      const exhaustiveCheck: never = node;
      return exhaustiveCheck;
    }
  }
}