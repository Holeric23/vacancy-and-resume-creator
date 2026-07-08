import { Migration } from './migration.ts';
import { CURRENT_SCHEMA_VERSION } from '../schema/schema-version.ts';

// Структура объекта из старой пробной версии ("Текущее состояние.txt")
interface LegacyRawObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  zIndex?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  cornerRadius?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowColor?: string;
}

export class V1ToV2Migration implements Migration {
  readonly fromVersion = 1;
  readonly toVersion = CURRENT_SCHEMA_VERSION;

  migrate(rawData: unknown): unknown {
    let legacyObjects: LegacyRawObject[] = [];

    // Старый формат мог быть либо голым массивом объектов, либо объектом { objects: [...] }
    if (Array.isArray(rawData)) {
      legacyObjects = rawData as LegacyRawObject[];
    } else if (rawData && typeof rawData === 'object' && 'objects' in rawData && Array.isArray(rawData.objects)) {
      legacyObjects = rawData.objects as LegacyRawObject[];
    }

    const nodesById: Record<string, unknown> = {};
    const nodeOrder: string[] = [];

    // Преобразуем плоские свойства старых объектов в структурированную и типизированную форму
    legacyObjects.forEach((oldObj) => {
      const id = oldObj.id;
      nodeOrder.push(id);

      // Мапим тип узла
      let kind: 'shape' | 'text' | 'heading' | 'list' = 'shape';
      if (oldObj.type === 'text') {
        kind = 'text';
      }

      // Собираем вложенную структуру теней
      const hasShadow =
        (oldObj.shadowOffsetX ?? 0) !== 0 ||
        (oldObj.shadowOffsetY ?? 0) !== 0 ||
        (oldObj.shadowBlur ?? 0) !== 0;

      const shadow = hasShadow
        ? {
            offsetX: oldObj.shadowOffsetX ?? 0,
            offsetY: oldObj.shadowOffsetY ?? 0,
            blur: oldObj.shadowBlur ?? 4,
            color: oldObj.shadowColor ?? 'rgba(0,0,0,0.2)',
          }
        : undefined;

      // Мапим общие свойства внешнего вида узла
      const style: Record<string, unknown> = {
        backgroundColor: oldObj.backgroundColor ?? (oldObj.type === 'text' ? '#f9f9f9' : '#e0e0e0'),
        borderColor: oldObj.borderColor ?? '#cccccc',
        borderWidth: oldObj.borderWidth ?? 1,
        cornerRadius: oldObj.cornerRadius ?? 0,
      };
      if (shadow) {
        style.shadow = shadow;
      }

      // Мапим стили текста
      const textStyle = {
        textColor: oldObj.textColor ?? '#000000',
        fontFamily: oldObj.fontFamily ?? 'system-ui, sans-serif',
        fontSize: oldObj.fontSize ?? 14,
      };

      // Строим узел новой структуры данных
      const newNode: Record<string, unknown> = {
        id,
        kind,
        frame: {
          x: oldObj.x,
          y: oldObj.y,
          width: oldObj.width,
          height: oldObj.height,
        },
        zIndex: oldObj.zIndex ?? 1,
        style,
      };

      if (kind === 'text') {
        newNode.content = oldObj.content;
        newNode.textStyle = textStyle;
      } else {
        // Если это shape, по умолчанию делаем прямоугольником
        newNode.shapeType = 'rectangle';
      }

      nodesById[id] = newNode;
    });

    const defaultPageId = 'page_1';

    // Собираем канонический конверт проекта версии 2
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      projectId: 'migrated-project-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      document: {
        id: 'document_1',
        title: 'Мигрированный проект',
        pagesById: {
          [defaultPageId]: {
            id: defaultPageId,
            preset: 'A4',
            orientation: 'portrait',
            nodesById,
            nodeOrder,
          },
        },
        pageOrder: [defaultPageId],
      },
    };
  }
}