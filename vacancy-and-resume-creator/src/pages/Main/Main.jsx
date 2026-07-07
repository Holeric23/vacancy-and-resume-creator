import { useRef, useContext } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Canvas from './components/Canvas';
// import Toolbar from './components/Toolbar';
import MenuBar from './components/MenuBar';
import useCanvasObjects from './components/useCanvasObjects';
import { exportProject, importProject } from '../../utils/projectIO';
import { exportAsPDF } from '../../utils/exportView';
import { PanelStateContext } from '../../contexts';

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
  const {
    objects,
    selectedId,
    addObject,
    updatePosition,
    updateSize,
    updateProperty,
    selectObject,
    setObjects,
    updateNextIdFromObjects
  } = useCanvasObjects();

  const pageRef = useRef(null);
  const panelState = useContext(PanelStateContext);

  const handleExportProject = () => {
    const projectData = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      objects,
      panelState: panelState ? panelState.collapsedSections : {}
    };
    exportProject(projectData, 'my-project');
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.vacancy';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const projectData = await importProject(file);
        setObjects(projectData.objects);
        updateNextIdFromObjects(projectData.objects);
        if (panelState && projectData.panelState) {
          panelState.restoreCollapsedSections(projectData.panelState);
        }
        alert('Проект успешно загружен');
      } catch (err) {
        alert('Ошибка импорта: ' + err.message);
      }
    };
    input.click();
  };

  const handleExportPDF = () => {
    if (pageRef.current) {
      exportAsPDF(pageRef.current, getGlobalCSS());
    } else {
      alert('Страница не готова');
    }
  };

  return (
    <div style={mainContainerStyle}>
      <MenuBar
        onImportProject={handleImportProject}
        onExportProject={handleExportProject}
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