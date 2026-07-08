import { Point } from 'document-core';

// Физическая плотность пикселей на миллиметр при стандартных 96 DPI: 
// 96 пикселей / 25.4 мм в одном дюйме = ~3.77952755
export const PX_PER_MM = 3.77952755;

export interface ViewportTransform {
  zoom: number;       // Масштаб (1 = 100%, 0.5 = 50%)
  pageOffsetLeft: number; // Отступ левого края листа от начала координат экрана в px
  pageOffsetTop: number;  // Отступ верхнего края листа от начала координат экрана в px
}

/**
 * Преобразует координаты мыши (clientX, clientY) относительно экрана 
 * в миллиметры листа А4 с учетом прокрутки, зума и положения листа.
 */
export const clientToDocumentPoint = (
  clientX: number,
  clientY: number,
  pageElement: HTMLElement,
  transform: ViewportTransform
): Point => {
  const rect = pageElement.getBoundingClientRect();

  // Находим смещение курсора относительно левого верхнего угла листа бумаги в пикселях
  const xPx = clientX - rect.left;
  const yPx = clientY - rect.top;

  // Конвертируем пиксели в миллиметры с учетом текущего масштаба (zoom)
  const xMm = xPx / (transform.zoom * PX_PER_MM);
  const yMm = yPx / (transform.zoom * PX_PER_MM);

  return {
    x: Math.round(xMm * 100) / 100,
    y: Math.round(yMm * 100) / 100,
  };
};

/**
 * Обратная конвертация: миллиметры документа в пиксели экрана.
 */
export const mmToPx = (mm: number, zoom: number): number => {
  return Math.round(mm * PX_PER_MM * zoom);
};