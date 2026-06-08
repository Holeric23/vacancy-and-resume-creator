export const getPageHTML = (pageElement, globalStyles) => {
  const clonePage = pageElement.cloneNode(true);
  clonePage.classList.add('print-page');
  
  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
    }
    .export-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: white;
      padding: 0;
    }
    .export-page {
      box-shadow: none;
      position: relative;
      background: white;
      margin: 0 auto;
    }
    
    /* Рекомендации для печати */
    @media print {
      body, .export-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      .export-page {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none;
        page-break-inside: avoid;
        break-inside: avoid;
        width: 100%;
      }
      @page {
        size: A4 portrait;
        margin: 0mm;
      }
      @page {
        @top-center {
          content: none;
        }
        @bottom-center {
          content: none;
        }
      }
      * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    ${globalStyles}
  `;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'export-wrapper';
  const container = document.createElement('div');
  container.className = 'export-page';
  container.appendChild(clonePage);
  wrapper.appendChild(container);
  
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Экспорт проекта</title>
    <style>${styles}</style>
  </head>
  <body>
    ${wrapper.outerHTML}
  </body>
  </html>`;
};

// Экспорт PDF через печать (с рекомендациями)
export const exportAsPDF = (pageElement, globalStyles) => {
  if (!pageElement) {
    alert('Страница не найдена');
    return;
  }
  const html = getPageHTML(pageElement, globalStyles);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Экспорт MHTML – временно недоступен
// export const exportAsMHTML = () => {
//   alert('Экспорт MHTML временно недоступен');
// };