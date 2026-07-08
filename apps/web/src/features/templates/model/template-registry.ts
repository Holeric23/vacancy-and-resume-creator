import { DocumentNode, asNodeId } from 'document-core';

export interface TemplateDefinition {
  id: string;
  displayName: string;
  category: 'base' | 'composite';
  description: string;
  icon: string;
  createNodes: (startX: number, startY: number) => DocumentNode[];
}

// Генератор уникальных ID на фронтенде без грязных паттернов "obj_123"
const generateNodeId = (): string => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  // 1. БАЗОВЫЕ ШАБЛОНЫ
  shape_rect: {
    id: 'shape_rect',
    displayName: 'Прямоугольник',
    category: 'base',
    description: 'Базовая геометрическая фигура',
    icon: '🟩',
    createNodes: (x, y) => [{
      id: asNodeId(generateNodeId()),
      kind: 'shape',
      shapeType: 'rectangle',
      frame: { x, y, width: 140, height: 80 },
      zIndex: 1,
      style: { backgroundColor: '#8b5cf6', borderColor: '#7c3aed', borderWidth: 1, cornerRadius: 6 }
    }],
  },
  shape_ellipse: {
    id: 'shape_ellipse',
    displayName: 'Круг / Овал',
    category: 'base',
    description: 'Геометрический эллипс',
    icon: '🟡',
    createNodes: (x, y) => [{
      id: asNodeId(generateNodeId()),
      kind: 'shape',
      shapeType: 'ellipse',
      frame: { x, y, width: 80, height: 80 },
      zIndex: 1,
      style: { backgroundColor: '#10b981', borderColor: '#059669', borderWidth: 1 }
    }],
  },
  text_paragraph: {
    id: 'text_paragraph',
    displayName: 'Текстовый блок',
    category: 'base',
    description: 'Простой абзац текста',
    icon: '📝',
    createNodes: (x, y) => [{
      id: asNodeId(generateNodeId()),
      kind: 'text',
      frame: { x, y, width: 150, height: 40 },
      zIndex: 1,
      style: { backgroundColor: 'transparent' },
      content: 'Это ваш редактируемый абзац текста. Дважды кликните, чтобы изменить его содержимое.',
      textStyle: { fontSize: 11, fontFamily: 'Inter', textColor: '#374151' }
    }],
  },

  // 2. СЛОЖНЫЕ КОМПОЗИТНЫЕ ШАБЛОНЫ (СОСТАВНЫЕ ШАБЛОНЫ ВАКАНСИИ И РЕЗЮМЕ)
  vacancy_header: {
    id: 'vacancy_header',
    displayName: 'Шапка вакансии',
    category: 'composite',
    description: 'Профессиональный блок заголовка вакансии',
    icon: '💼',
    createNodes: (x, y) => {
      const parentId = generateNodeId();
      const childId = generateNodeId();
      return [
        {
          id: asNodeId(parentId),
          kind: 'heading',
          level: 1,
          frame: { x, y, width: 180, height: 18 },
          zIndex: 2,
          style: { backgroundColor: 'transparent' },
          content: 'Старший фронтенд разработчик (React)',
          textStyle: { fontSize: 18, fontFamily: 'Playfair Display', textColor: '#111827', textAlign: 'left' }
        },
        {
          id: asNodeId(childId),
          kind: 'text',
          frame: { x, y: y + 20, width: 180, height: 12 },
          zIndex: 2,
          style: { backgroundColor: 'transparent' },
          content: 'Компания: MatchArt • ЗП: от 250 000 руб. • Формат: Удаленка',
          textStyle: { fontSize: 10, fontFamily: 'Inter', textColor: '#6b7280' }
        }
      ];
    }
  },
  resume_skills: {
    id: 'resume_skills',
    displayName: 'Блок ключевых навыков',
    category: 'composite',
    description: 'Красиво оформленный список ключевых тегов резюме',
    icon: '🎯',
    createNodes: (x, y) => {
      const headerId = generateNodeId();
      const listId = generateNodeId();
      return [
        {
          id: asNodeId(headerId),
          kind: 'heading',
          level: 2,
          frame: { x, y, width: 160, height: 14 },
          zIndex: 2,
          style: { backgroundColor: 'transparent' },
          content: 'Ключевые навыки',
          textStyle: { fontSize: 12, fontFamily: 'Inter', textColor: '#111827' }
        },
        {
          id: asNodeId(listId),
          kind: 'list',
          items: ['React / TypeScript', 'Node.js / Express', 'Docker / CI/CD', 'Архитектура Clean / Monorepo'],
          ordered: false,
          frame: { x, y: y + 16, width: 160, height: 50 },
          zIndex: 2,
          style: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1, cornerRadius: 4 },
          textStyle: { fontSize: 10, fontFamily: 'JetBrains Mono', textColor: '#4b5563' }
        }
      ];
    }
  }
};