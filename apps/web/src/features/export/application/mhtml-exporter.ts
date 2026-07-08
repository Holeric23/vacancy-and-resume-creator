import { Document, PageId, getPageSize } from 'document-core';
import { getSafeFontStack } from '@/entities/document/model/font-catalog.ts';

/**
 * Генерирует один самодостаточный .html файл, который пользователь может скачать и открыть на любом устройстве.
 */
export const exportAsHTMLFile = (documentData: Document, activePageId: PageId): void => {
  const page = documentData.pagesById[activePageId];
  if (!page) return;

  const pageSizeMm = getPageSize(page.preset, page.orientation);

  let nodesHtml = '';
  page.nodeOrder.forEach((nodeId) => {
    const node = page.nodesById[nodeId];
    if (!node) return;

    let innerContent = '';
    let textStyles = '';

    if (node.kind === 'text' || node.kind === 'heading') {
      const textNode = node as any;
      innerContent = textNode.content;
      textStyles = `
        color: ${textNode.textStyle?.textColor ?? '#000000'};
        font-family: ${getSafeFontStack(textNode.textStyle?.fontFamily ?? 'System')};
        font-size: ${(textNode.textStyle?.fontSize ?? 14) * 0.3527}mm;
        line-height: ${textNode.textStyle?.lineHeight ?? 1.2};
        text-align: ${textNode.textStyle?.textAlign ?? 'left'};
      `;
    }

    nodesHtml += `
      <div style="
        position: absolute;
        left: ${node.frame.x}mm;
        top: ${node.frame.y}mm;
        width: ${node.frame.width}mm;
        height: ${node.frame.height}mm;
        z-index: ${node.zIndex};
        background-color: ${node.style.backgroundColor ?? 'transparent'};
        border: ${node.style.borderWidth ? `${node.style.borderWidth}mm solid ${node.style.borderColor ?? '#cccccc'}` : 'none'};
        border-radius: ${node.style.cornerRadius ?? 0}mm;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 2mm;
        ${textStyles}
      ">
        ${innerContent}
      </div>
    `;
  });

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${documentData.title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        body {
          background-color: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          font-family: system-ui, sans-serif;
        }
        .page {
          width: ${pageSizeMm.width}mm;
          height: ${pageSizeMm.height}mm;
          background-color: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div class="page">
        ${nodesHtml}
      </div>
    </body>
    </html>
  `;

  // Инициируем скачивание браузером
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${documentData.title.toLowerCase().replace(/\s+/g, '-')}.html`;
  link.click();
  URL.revokeObjectURL(url);
};