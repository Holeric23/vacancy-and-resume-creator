// Сохранение проекта
export const exportProject = (objects, filename = 'project.vacancy') => {
  const data = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    objects: objects,
  };
  const json = JSON.stringify(data, null, 2);
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

// Импорт проекта
export const importProject = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.objects && Array.isArray(data.objects)) {
          resolve(data.objects);
        } else {
          reject(new Error('Некорректный формат: отсутствует поле objects'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
};