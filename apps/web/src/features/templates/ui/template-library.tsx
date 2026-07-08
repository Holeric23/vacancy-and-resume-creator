import { DocumentNode, NodeId } from 'document-core';
import { TEMPLATE_REGISTRY } from '../model/template-registry.ts';
import { CollapsibleSection } from '@/shared/ui/collapsible-section/collapsible-section.tsx';
import styles from './template-library.module.css';

interface TemplateLibraryProps {
  nodesById: Record<string, DocumentNode>;
  nodeOrder: NodeId[];
  selectedIds: Set<NodeId>;
  onAddNodes: (nodes: DocumentNode[]) => void;
  onSelectNode: (nodeId: NodeId) => void;
}

export function TemplateLibrary({
  nodesById,
  nodeOrder,
  selectedIds,
  onAddNodes,
  onSelectNode,
}: TemplateLibraryProps) {
  
  // Клик по шаблону создает новые узлы на дефолтной позиции (например, 20мм, 20мм)
  const handleAddTemplate = (templateId: string) => {
    const template = TEMPLATE_REGISTRY[templateId];
    if (template) {
      const newNodes = template.createNodes(25, 25);
      onAddNodes(newNodes);
    }
  };

  const getDisplayName = (node: DocumentNode): string => {
    if (node.kind === 'text' || node.kind === 'heading') {
      return (node as { content: string }).content || 'Пустой текст';
    }
    if (node.kind === 'list') {
      return 'Элементы списка';
    }
    return 'Геометрическая фигура';
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Инструменты</h2>

      {/* Раздел базовых шаблонов */}
      <CollapsibleSection title="Базовые фигуры">
        <div className={styles.grid}>
          {Object.values(TEMPLATE_REGISTRY)
            .filter((t) => t.category === 'base')
            .map((t) => (
              <div
                key={t.id}
                className={styles.templateCard}
                onClick={() => handleAddTemplate(t.id)}
              >
                <span className={styles.icon}>{t.icon}</span>
                <div className={styles.info}>
                  <span className={styles.name}>{t.displayName}</span>
                  <span className={styles.desc}>{t.description}</span>
                </div>
              </div>
            ))}
        </div>
      </CollapsibleSection>

      {/* Раздел композитных шаблонов вакансий/резюме */}
      <CollapsibleSection title="Блоки документов">
        <div className={styles.grid}>
          {Object.values(TEMPLATE_REGISTRY)
            .filter((t) => t.category === 'composite')
            .map((t) => (
              <div
                key={t.id}
                className={styles.templateCard}
                onClick={() => handleAddTemplate(t.id)}
              >
                <span className={styles.icon}>{t.icon}</span>
                <div className={styles.info}>
                  <span className={styles.name}>{t.displayName}</span>
                  <span className={styles.desc}>{t.description}</span>
                </div>
              </div>
            ))}
        </div>
      </CollapsibleSection>

      {/* Список слоев элементов на текущей странице (Z-Order) */}
      <CollapsibleSection title="Дерево объектов" defaultOpen={true}>
        {nodeOrder.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: 'var(--space-2)' }}>
            На холсте нет объектов
          </div>
        ) : (
          <div className={styles.layersList}>
            {/* Рендерим слои в обратном порядке (верхний слой в списке первый) */}
            {[...nodeOrder].reverse().map((id) => {
              const node = nodesById[id];
              if (!node) return null;

              const isSelected = selectedIds.has(id);

              return (
                <div
                  key={id}
                  className={`${styles.layerItem} ${isSelected ? styles.layerItemActive : ''}`}
                  onClick={() => onSelectNode(id)}
                >
                  <span className={styles.layerLabel}>{getDisplayName(node)}</span>
                  <span className={styles.layerMetadata}>{node.kind}</span>
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>
    </aside>
  );
}