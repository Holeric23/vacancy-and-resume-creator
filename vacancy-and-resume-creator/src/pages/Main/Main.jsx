import { useRef } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import useCanvasObjects from './components/useCanvasObjects';
import { exportProject, importProject } from '../../utils/projectIO';
// import { exportAsMHTML, exportAsPDF } from '../../utils/exportView';
import { exportAsPDF } from '../../utils/exportView';

const getGlobalCSS = () => `
  :root {
    --text: #6b6375;
    --text-h: #08060d;
    --bg: #fff;
    --border: #e5e4e7;
    --code-bg: #f4f3ec;
    --accent: #aa3bff;
    --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
    --mono: ui-monospace, Consolas, monospace;
  }
  body { margin: 0; background: #e0e0e0; }
  .export-page { background: white; }
`;

function Main() {
  const { objects, selectedId, addObject, updatePosition, updateSize, updateProperty, selectObject, setObjects } = useCanvasObjects();
  const pageRef = useRef(null);

  const handleExportProject = () => {
    exportProject(objects, 'my-project');
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.vacancy';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const importedObjects = await importProject(file);
        setObjects(importedObjects);
        alert('Проект успешно загружен');
      } catch (err) {
        alert('Ошибка импорта: ' + err.message);
      }
    };
    input.click();
  };

  // Экспорт MHTML – временно отключён
  // const handleExportMHTML = () => {
  //   if (pageRef.current) {
  //     exportAsMHTML(pageRef.current, getGlobalCSS(), 'page.mhtml');
  //   } else {
  //     alert('Страница не готова');
  //   }
  // };

  const handleExportPDF = () => {
    if (pageRef.current) {
      exportAsPDF(pageRef.current, getGlobalCSS());
    } else {
      alert('Страница не готова');
    }
  };

  return (
    <div style={mainContainerStyle}>
      <Toolbar
        onImportProject={handleImportProject}
        onExportProject={handleExportProject}
        // onExportMHTML={handleExportMHTML}
        onExportMHTML={() => alert('Экспорт MHTML временно недоступен')}
        onExportPDF={handleExportPDF}
      />
      <LeftPanel
        objects={objects}
        selectedId={selectedId}
        onSelect={selectObject}
        addObject={addObject}
      />
      <Canvas
        ref={pageRef}
        objects={objects}
        selectedId={selectedId}
        onSelect={selectObject}
        onUpdatePosition={updatePosition}
      />
      <RightPanel
        selectedObject={objects.find(obj => obj.id === selectedId)}
        onUpdateProperty={updateProperty}
        onUpdateSize={updateSize}
      />
    </div>
  );
}

const mainContainerStyle = {
  boxSizing: 'border-box',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto 1fr',
  gridTemplateAreas: '"top top top" "left center right"',
  width: '100%',
  height: '100%',
  background: '#F5F5F5',
  overflow: 'hidden',
};

export default Main;