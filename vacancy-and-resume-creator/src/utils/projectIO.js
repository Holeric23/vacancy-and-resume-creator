export const exportProject = (projectData, filename = 'project.vacancy') => {
  const json = JSON.stringify(projectData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importProject = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let objects;
        let panelState = {};

        if (Array.isArray(data)) {
          objects = data;
        } else if (data.objects && Array.isArray(data.objects)) {
          objects = data.objects;
          panelState = data.panelState || {};
        } else {
          reject(new Error('Некорректный формат: отсутствует поле objects'));
          return;
        }

        resolve({ objects, panelState });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
};