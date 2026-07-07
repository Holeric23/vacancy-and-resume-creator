import CollapsibleSection from '../../../components/CollapsibleSection';

const roundToOne = (num) => Math.round(num * 10) / 10;

const clampNumber = (value, min = 0, max = Infinity) => {
  let num = parseFloat(String(value).replace(',', '.'));
  if (isNaN(num)) num = min;
  return roundToOne(Math.min(Math.max(num, min), max));
};

const TypeAndContentSection = ({ type, content, onUpdateContent }) => (
  <CollapsibleSection title="Основное" sectionKey="right-main" defaultCollapsed={false}>
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>Тип</label>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{type}</div>
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>Содержимое</label>
      <input type="text" value={content} onChange={onUpdateContent} style={inputStyle} />
    </div>
  </CollapsibleSection>
);

const PositionAndSizeSection = ({ x, y, width, height, zIndex, onUpdatePosition, onUpdateSize, onUpdateZIndex }) => {
  const handleX = (e) => onUpdatePosition('x', clampNumber(e.target.value));
  const handleY = (e) => onUpdatePosition('y', clampNumber(e.target.value));
  const handleWidth = (e) => onUpdateSize('width', clampNumber(e.target.value, 10));
  const handleHeight = (e) => onUpdateSize('height', clampNumber(e.target.value, 10));
  const handleZIndex = (e) => onUpdateZIndex(clampNumber(e.target.value));

  return (
    <CollapsibleSection title="Позиция и размер" sectionKey="right-position" defaultCollapsed={false}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>X (px)</label>
          <input type="number" step="0.1" value={x} onChange={handleX} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Y (px)</label>
          <input type="number" step="0.1" value={y} onChange={handleY} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Ширина (px)</label>
          <input type="number" step="0.1" value={width} onChange={handleWidth} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Высота (px)</label>
          <input type="number" step="0.1" value={height} onChange={handleHeight} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginTop: '8px' }}>
        <label style={labelStyle}>Z-индекс</label>
        <input type="number" value={zIndex} onChange={handleZIndex} style={inputStyle} />
      </div>
    </CollapsibleSection>
  );
};

const AppearanceSection = ({ backgroundColor, borderColor, borderWidth, cornerRadius, onUpdate }) => {
  const handleBg = (e) => onUpdate('backgroundColor', e.target.value);
  const handleBorderColor = (e) => onUpdate('borderColor', e.target.value);
  const handleBorderWidth = (e) => onUpdate('borderWidth', clampNumber(e.target.value, 0));
  const handleCornerRadius = (e) => onUpdate('cornerRadius', clampNumber(e.target.value, 0, 50));

  return (
    <CollapsibleSection title="Внешний вид" sectionKey="right-appearance" defaultCollapsed={false}>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Цвет фона</label>
        <input type="color" value={backgroundColor} onChange={handleBg} style={colorInputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Цвет границы</label>
        <input type="color" value={borderColor} onChange={handleBorderColor} style={colorInputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Толщина границы (px)</label>
        <input type="number" step="0.1" value={borderWidth} onChange={handleBorderWidth} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Скругление углов (px)</label>
        <input type="number" step="0.1" value={cornerRadius} onChange={handleCornerRadius} style={inputStyle} />
      </div>
    </CollapsibleSection>
  );
};

const TextSection = ({ textColor, fontFamily, fontSize, onUpdate }) => {
  const handleColor = (e) => onUpdate('textColor', e.target.value);
  const handleFontFamily = (e) => onUpdate('fontFamily', e.target.value);
  const handleFontSize = (e) => onUpdate('fontSize', clampNumber(e.target.value, 6, 200));

  return (
    <CollapsibleSection title="Текст" sectionKey="right-text" defaultCollapsed={false}>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Цвет текста</label>
        <input type="color" value={textColor} onChange={handleColor} style={colorInputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Шрифт</label>
        <select value={fontFamily} onChange={handleFontFamily} style={inputStyle}>
          <option value="system-ui, sans-serif">Системный</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Courier New, monospace">Courier New</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Размер шрифта (px)</label>
        <input type="number" value={fontSize} onChange={handleFontSize} style={inputStyle} />
      </div>
    </CollapsibleSection>
  );
};

const ShadowSection = ({ offsetX, offsetY, blur, color, onUpdate }) => {
  const handleOffsetX = (e) => onUpdate('shadowOffsetX', clampNumber(e.target.value));
  const handleOffsetY = (e) => onUpdate('shadowOffsetY', clampNumber(e.target.value));
  const handleBlur = (e) => onUpdate('shadowBlur', clampNumber(e.target.value, 0));
  const handleColor = (e) => onUpdate('shadowColor', e.target.value);

  return (
    <CollapsibleSection title="Тень" sectionKey="right-shadow" defaultCollapsed={true}>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Смещение X (px)</label>
        <input type="number" value={offsetX} onChange={handleOffsetX} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Смещение Y (px)</label>
        <input type="number" value={offsetY} onChange={handleOffsetY} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Размытие (px)</label>
        <input type="number" value={blur} onChange={handleBlur} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Цвет тени</label>
        <input type="color" value={color} onChange={handleColor} style={colorInputStyle} />
      </div>
    </CollapsibleSection>
  );
};

function RightPanel({ selectedObject, onUpdateProperty, onUpdateSize }) {
  if (!selectedObject) {
    return (
      <div style={panelStyle}>
        <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Свойства</h3>
        <div style={{ color: '#999', fontSize: '14px' }}>Ничего не выбрано</div>
      </div>
    );
  }

  const handleUpdateProperty = (prop, value) => onUpdateProperty(selectedObject.id, prop, value);
  const handleUpdateSize = (dim, value) => {
    if (dim === 'width') onUpdateSize(selectedObject.id, value, selectedObject.height);
    else onUpdateSize(selectedObject.id, selectedObject.width, value);
  };
  const handleUpdatePosition = (coord, value) => {
    if (coord === 'x') onUpdateProperty(selectedObject.id, 'x', value);
    else onUpdateProperty(selectedObject.id, 'y', value);
  };

  return (
    <div style={panelStyle}>
      <h3 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Свойства</h3>
      <TypeAndContentSection
        type={selectedObject.type}
        content={selectedObject.content}
        onUpdateContent={(e) => handleUpdateProperty('content', e.target.value)}
      />
      <PositionAndSizeSection
        x={selectedObject.x}
        y={selectedObject.y}
        width={selectedObject.width}
        height={selectedObject.height}
        zIndex={selectedObject.zIndex}
        onUpdatePosition={handleUpdatePosition}
        onUpdateSize={handleUpdateSize}
        onUpdateZIndex={(val) => handleUpdateProperty('zIndex', val)}
      />
      <AppearanceSection
        backgroundColor={selectedObject.backgroundColor}
        borderColor={selectedObject.borderColor}
        borderWidth={selectedObject.borderWidth}
        cornerRadius={selectedObject.cornerRadius}
        onUpdate={handleUpdateProperty}
      />
      <TextSection
        textColor={selectedObject.textColor}
        fontFamily={selectedObject.fontFamily}
        fontSize={selectedObject.fontSize}
        onUpdate={handleUpdateProperty}
      />
      <ShadowSection
        offsetX={selectedObject.shadowOffsetX}
        offsetY={selectedObject.shadowOffsetY}
        blur={selectedObject.shadowBlur}
        color={selectedObject.shadowColor}
        onUpdate={handleUpdateProperty}
      />
      <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '20px' }}>
        {/* Здесь будет синхронизация с сервером */}
      </div>
    </div>
  );
}

const panelStyle = {
  gridArea: 'right',
  background: '#F5F5F5',
  width: '260px',
  borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
  padding: '16px',
  overflowY: 'auto',
  fontFamily: 'var(--sans)',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  marginBottom: '4px',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  fontSize: '12px',
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const colorInputStyle = {
  width: '100%',
  padding: '2px',
  height: '34px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export default RightPanel;