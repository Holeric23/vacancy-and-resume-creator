import { Rect } from 'document-core';
import { InteractionMode } from '../model/interaction-state.ts';

/**
 * Вычисляет временные координаты и размеры узла во время перетаскивания или изменения размера.
 * Если узел не находится во взаимодействии, возвращает оригинальный frame.
 */
export const getInteractiveFrame = (
  nodeId: string,
  baseFrame: Rect,
  interaction: InteractionMode
): Rect => {
  // 1. Обработка состояния перетаскивания (dragging)
  if (interaction.type === 'dragging') {
    const initialFrame = interaction.initialFrames[nodeId];
    if (initialFrame) {
      const dx = interaction.currentPoint.x - interaction.startPoint.x;
      const dy = interaction.currentPoint.y - interaction.startPoint.y;
      return {
        x: initialFrame.x + dx,
        y: initialFrame.y + dy,
        width: initialFrame.width,
        height: initialFrame.height,
      };
    }
  }

  // 2. Обработка состояния изменения размера (resizing)
  if (interaction.type === 'resizing' && interaction.nodeId === nodeId) {
    const f = { ...interaction.initialFrame };
    const dx = interaction.currentPoint.x - interaction.startPoint.x;
    const dy = interaction.currentPoint.y - interaction.startPoint.y;

    // Изменение размера в зависимости от зажатого маркера (Handle)
    if (interaction.handle.includes('E')) {
      f.width = Math.max(5, interaction.initialFrame.width + dx);
    }
    if (interaction.handle.includes('S')) {
      f.height = Math.max(5, interaction.initialFrame.height + dy);
    }
    if (interaction.handle.includes('W')) {
      const possibleWidth = interaction.initialFrame.width - dx;
      if (possibleWidth >= 5) {
        f.x = interaction.initialFrame.x + dx;
        f.width = possibleWidth;
      }
    }
    if (interaction.handle.includes('N')) {
      const possibleHeight = interaction.initialFrame.height - dy;
      if (possibleHeight >= 5) {
        f.y = interaction.initialFrame.y + dy;
        f.height = possibleHeight;
      }
    }
    return f;
  }

  // Если узел не трогают — возвращаем базовый frame из документа
  return baseFrame;
};