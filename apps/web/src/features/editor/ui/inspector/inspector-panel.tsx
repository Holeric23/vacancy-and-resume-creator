import { DocumentNode, PageId, NodeId, UpdateNodesCommand } from 'document-core';
import { CollapsibleSection } from '@/shared/ui/collapsible-section/collapsible-section.tsx';
import { APPROVED_FONTS } from '@/entities/document/model/font-catalog.ts';
import styles from './inspector-panel.module.css';

interface InspectorPanelProps {
  selectedNodeId: NodeId | null;
  nodesById: Record<string, DocumentNode>;
  activePageId: PageId;
  onCommitCommand: (command: any) => void;
}

export function InspectorPanel({
  selectedNodeId,
  nodesById,
  activePageId,
  onCommitCommand,
}: InspectorPanelProps) {
  if (!selectedNodeId) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📐</div>
          <p>Выберите объект на холсте,<br />чтобы настроить его свойства</p>
        </div>
      </aside>
    );
  }

  const node = nodesById[selectedNodeId];
  if (!node) return null;

  // Чистый диспатч иммутабельной команды UpdateNodes (без прямых мутаций объектов!)
  const handleUpdateProperty = (patch: {
    content?: string;
    style?: Partial<DocumentNode['style']>;
    textStyle?: Record<string, any>;
    zIndex?: number;
    frame?: { x?: number; y?: number; width?: number; height?: number };
  }) => {
    const command = new UpdateNodesCommand(activePageId, [
      {
        id: selectedNodeId,
        ...patch,
      },
    ]);
    onCommitCommand(command);
  };

  const handleNumericInput = (
    value: string,
    callback: (val: number) => void
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      callback(num);
    }
  };

  const isTextNode = node.kind === 'text' || node.kind === 'heading' || node.kind === 'list';

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Свойства</h2>

      {/* 1. ГЕОМЕТРИЯ */}
      <CollapsibleSection title="Положение и размер" defaultOpen={true}>
        <div className={styles.group}>
          <div className={styles.field}>
            <label className={styles.label}>Позиция X (мм)</label>
            <input
              type="number"
              className={styles.input}
              value={node.frame.x}
              onChange={(e) => handleNumericInput(e.target.value, (x) => handleUpdateProperty({ frame: { x } }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Позиция Y (мм)</label>
            <input
              type="number"
              className={styles.input}
              value={node.frame.y}
              onChange={(e) => handleNumericInput(e.target.value, (y) => handleUpdateProperty({ frame: { y } }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Ширина (мм)</label>
            <input
              type="number"
              className={styles.input}
              value={node.frame.width}
              onChange={(e) => handleNumericInput(e.target.value, (width) => handleUpdateProperty({ frame: { width: Math.max(5, width) } }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Высота (мм)</label>
            <input
              type="number"
              className={styles.input}
              value={node.frame.height}
              onChange={(e) => handleNumericInput(e.target.value, (height) => handleUpdateProperty({ frame: { height: Math.max(5, height) } }))}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>Уровень слоя (Z-Index)</label>
            <input
              type="number"
              className={styles.input}
              value={node.zIndex}
              onChange={(e) => handleNumericInput(e.target.value, (zIndex) => handleUpdateProperty({ zIndex }))}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. ТЕКСТ И ТИПОГРАФИКА */}
      {isTextNode && (
        <CollapsibleSection title="Параметры текста" defaultOpen={true}>
          <div className={styles.field}>
            <label className={styles.label}>Содержимое</label>
            <textarea
              rows={3}
              className={styles.input}
              value={(node as any).content ?? ''}
              onChange={(e) => handleUpdateProperty({ content: e.target.value })}
            />
          </div>
          <div className={styles.field} style={{ marginTop: 'var(--space-2)' }}>
            <label className={styles.label}>Семейство шрифтов</label>
            <select
              className={styles.input}
              value={(node as any).textStyle?.fontFamily ?? 'System'}
              onChange={(e) => handleUpdateProperty({ textStyle: { fontFamily: e.target.value } })}
            >
              {Object.keys(APPROVED_FONTS).map((fontKey) => (
                <option key={fontKey} value={fontKey}>
                  {APPROVED_FONTS[fontKey]!.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.group} style={{ marginTop: 'var(--space-2)' }}>
            <div className={styles.field}>
              <label className={styles.label}>Размер (pt)</label>
              <input
                type="number"
                className={styles.input}
                value={(node as any).textStyle?.fontSize ?? 14}
                onChange={(e) => handleNumericInput(e.target.value, (fontSize) => handleUpdateProperty({ textStyle: { fontSize } }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Выравнивание</label>
              <select
                className={styles.input}
                value={(node as any).textStyle?.textAlign ?? 'left'}
                onChange={(e) => handleUpdateProperty({ textStyle: { textAlign: e.target.value } })}
              >
                <option value="left">Влево</option>
                <option value="center">Центр</option>
                <option value="right">Вправо</option>
                <option value="justify">Ширина</option>
              </select>
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: 'var(--space-2)' }}>
            <label className={styles.label}>Цвет текста</label>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                className={styles.colorInput}
                value={(node as any).textStyle?.textColor ?? '#000000'}
                onChange={(e) => handleUpdateProperty({ textStyle: { textColor: e.target.value } })}
              />
              <input
                type="text"
                className={styles.input}
                value={(node as any).textStyle?.textColor ?? '#000000'}
                onChange={(e) => handleUpdateProperty({ textStyle: { textColor: e.target.value } })}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* 3. ОФОРМЛЕНИЕ ОБЪЕКТА */}
      <CollapsibleSection title="Внешний вид блока" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <label className={styles.label}>Цвет фона</label>
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                className={styles.colorInput}
                value={node.style.backgroundColor ?? '#e0e0e0'}
                onChange={(e) => handleUpdateProperty({ style: { backgroundColor: e.target.value } })}
              />
              <input
                type="text"
                className={styles.input}
                value={node.style.backgroundColor ?? '#e0e0e0'}
                onChange={(e) => handleUpdateProperty({ style: { backgroundColor: e.target.value } })}
              />
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.field}>
              <label className={styles.label}>Толщина рамки (мм)</label>
              <input
                type="number"
                step="0.5"
                className={styles.input}
                value={node.style.borderWidth ?? 0}
                onChange={(e) => handleNumericInput(e.target.value, (borderWidth) => handleUpdateProperty({ style: { borderWidth } }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Скругление углов (мм)</label>
              <input
                type="number"
                step="1"
                className={styles.input}
                value={node.style.cornerRadius ?? 0}
                onChange={(e) => handleNumericInput(e.target.value, (cornerRadius) => handleUpdateProperty({ style: { cornerRadius } }))}
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>Цвет рамки</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="color"
                className={styles.colorInput}
                value={node.style.borderColor ?? '#cccccc'}
                onChange={(e) => handleUpdateProperty({ style: { borderColor: e.target.value } })}
              />
              <input
                type="text"
                className={styles.input}
                value={node.style.borderColor ?? '#cccccc'}
                onChange={(e) => handleUpdateProperty({ style: { borderColor: e.target.value } })}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </aside>
  );
}