import { Document, PageId, getPageSize } from 'document-core';
import { getSafeFontStack } from '@/entities/document/model/font-catalog.ts';

/**
 * Генерирует кристально чистую печатную страницу и вызывает системный диалог сохранения в PDF.
 * Исключает попадание любых элементов интерфейса редактора.
 */
export const exportAsPDF = (documentData: Document, activePageId: PageId): void => {
  const page = documentData.pagesById[activePageId];
  if (!page) {
    alert('Ошибка экспорта: страница не найдена.');
    return;
  }

  const pageSizeMm = getPageSize(page.preset, page.orientation);

  // Собираем инлайновые CSS-стили элементов на основе модели данных
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
    } else if (node.kind === 'list') {
      const listNode = node as any;
      const listTag = listNode.ordered ? 'ol' : 'ul';
      innerContent = `<${listTag} style="padding-left: 5mm; margin: 0;">${listNode.items
        .map((item: string) => `<li>${item}</li>`)
        .join('')}</${listTag}>`;
      textStyles = `
        color: ${listNode.textStyle?.textColor ?? '#000000'};
        font-family: ${getSafeFontStack(listNode.textStyle?.fontFamily ?? 'System')};
        font-size: ${(listNode.textStyle?.fontSize ?? 14) * 0.3527}mm;
      `;
    }

    let shadowStyle = 'none';
    if (node.style.shadow) {
      const s = node.style.shadow;
      shadowStyle = `${s.offsetX}mm ${s.offsetY}mm ${s.blur}mm ${s.color}`;
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
        box-shadow: ${shadowStyle};
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

  // Строим полный HTML-конверт для печати с автоподгрузкой веб-шрифтов
  const printHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${documentData.title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .page {
          width: ${pageSizeMm.width}mm;
          height: ${pageSizeMm.height}mm;
          position: relative;
          background-color: #ffffff;
          overflow: hidden;
          page-break-after: always;
        }
        @page {
          size: ${page.preset === 'letter' ? 'letter' : `A${page.preset.slice(1)}`} ${page.orientation};
          margin: 0mm;
        }
        @media print {
          body {
            background: none;
          }
          .page {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        ${nodesHtml}
      </div>
      <script>
        window.onload = function() {
          window.print();
          // Удаляем временное окно после закрытия диалога
          setTimeout(function() {
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  // Открываем скрытое временное окно браузера, пишем туда HTML и вызываем печать
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна в браузере для экспорта в PDF.');
    return;
  }
  printWindow.document.write(printHtml);
  printWindow.document.close();
};