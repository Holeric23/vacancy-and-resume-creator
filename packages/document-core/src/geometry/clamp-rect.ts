import { Rect, Size } from '../model/geometry.ts';

/**
 * Удерживает (clamps) координаты и размер объекта внутри физических границ страницы.
 */
export const clampRectToPage = (rect: Rect, pageSize: Size, minSize: number = 5): Rect => {
  // Вычисляем допустимую ширину и высоту
  const width = Math.max(minSize, Math.min(rect.width, pageSize.width));
  const height = Math.max(minSize, Math.min(rect.height, pageSize.height));

  // Вычисляем допустимые X и Y координаты (чтобы объект не выходил за правый/нижний край)
  const maxX = pageSize.width - width;
  const maxY = pageSize.height - height;

  const x = Math.max(0, Math.min(rect.x, maxX));
  const y = Math.max(0, Math.min(rect.y, maxY));

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100,
  };
};