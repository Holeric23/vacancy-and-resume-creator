import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import useCanvasObjects from './components/useCanvasObjects';

function createHandlers(addObject) {
  const handleAddRectangle = () => addObject('rectangle', 100, 100);
  const handleAddText = () => addObject('text', 100, 200);
  const handleImport = () => alert('Импорт (заглушка)');
  const handleExportPDF = () => alert('Экспорт PDF (заглушка)');
  const handleExportMHTML = () => alert('Экспорт MHTML (заглушка)');
  return { handleAddRectangle, handleAddText, handleImport, handleExportPDF, handleExportMHTML };
}

function Main() {
  const { objects, selectedId, addObject, updatePosition, updateSize, updateProperty, selectObject } = useCanvasObjects();
  const handlers = createHandlers(addObject);

  const objectList = objects.map(obj => ({ id: obj.id, type: obj.type, content: obj.content }));

  return (
    <div style={mainContainerStyle}>
      <Toolbar
        onAddRectangle={handlers.handleAddRectangle}
        onAddText={handlers.handleAddText}
        onImport={handlers.handleImport}
        onExportPDF={handlers.handleExportPDF}
        onExportMHTML={handlers.handleExportMHTML}
      />
      <LeftPanel objects={objectList} selectedId={selectedId} onSelect={selectObject} />
      <Canvas objects={objects} selectedId={selectedId} onSelect={selectObject} onUpdatePosition={updatePosition} />
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