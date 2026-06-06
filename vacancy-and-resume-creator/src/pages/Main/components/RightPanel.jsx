const TypeInfo = ({ type }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Тип</label>
    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{type}</div>
  </div>
);

const ContentField = ({ value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Содержимое</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{ width: '100%', padding: '4px', fontSize: '12px', boxSizing: 'border-box' }}
    />
  </div>
);

const PositionControls = ({ x, y, onXChange, onYChange }) => (
  <>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>X (px)</label>
      <input type="number" step="0.01" value={x} onChange={onXChange} style={inputStyle} />
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Y (px)</label>
      <input type="number" step="0.01" value={y} onChange={onYChange} style={inputStyle} />
    </div>
  </>
);

const SizeControls = ({ width, height, onWidthChange, onHeightChange }) => (
  <>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Ширина (px)</label>
      <input type="number" step="0.01" value={width} onChange={onWidthChange} style={inputStyle} />
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Высота (px)</label>
      <input type="number" step="0.01" value={height} onChange={onHeightChange} style={inputStyle} />
    </div>
  </>
);

const LayerControl = ({ zIndex, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Z-индекс</label>
    <input type="number" value={zIndex} onChange={onChange} style={inputStyle} />
  </div>
);

const CornerRadiusControl = ({ value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Скругление углов (px)</label>
    <input type="number" step="0.01" value={value} onChange={onChange} style={inputStyle} />
  </div>
);

const ColorControl = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>{label}</label>
    <input type="color" value={value} onChange={onChange} style={{ width: '100%', padding: '2px', height: '32px' }} />
  </div>
);

const BorderWidthControl = ({ value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Толщина границы (px)</label>
    <input type="number" step="0.01" value={value} onChange={onChange} style={inputStyle} />
  </div>
);

const FontFamilySelect = ({ value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Шрифт</label>
    <select value={value} onChange={onChange} style={{ width: '100%', padding: '4px', fontSize: '12px' }}>
      <option value="system-ui, sans-serif">Системный</option>
      <option value="Arial, sans-serif">Arial</option>
      <option value="Times New Roman, serif">Times New Roman</option>
      <option value="Courier New, monospace">Courier New</option>
    </select>
  </div>
);

const FontSizeControl = ({ value, onChange }) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Размер шрифта (px)</label>
    <input type="number" value={value} onChange={onChange} style={inputStyle} />
  </div>
);

const ShadowControls = ({ offsetX, offsetY, blur, color, onXChange, onYChange, onBlurChange, onColorChange }) => (
  <>
    <hr style={{ margin: '16px 0' }} />
    <h4 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Тень</h4>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Смещение X (px)</label>
      <input type="number" value={offsetX} onChange={onXChange} style={inputStyle} />
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Смещение Y (px)</label>
      <input type="number" value={offsetY} onChange={onYChange} style={inputStyle} />
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Размытие (px)</label>
      <input type="number" value={blur} onChange={onBlurChange} style={inputStyle} />
    </div>
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Цвет тени</label>
      <input type="color" value={color} onChange={onColorChange} style={{ width: '100%', padding: '2px', height: '32px' }} />
    </div>
  </>
);

const inputStyle = { width: '100%', padding: '4px', fontSize: '12px', boxSizing: 'border-box' };

function RightPanel({ selectedObject, onUpdateProperty, onUpdateSize }) {
  if (!selectedObject) {
    return (
      <div style={panelStyle}>
        <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Свойства</h3>
        <div style={{ color: '#999', fontSize: '14px' }}>Ничего не выбрано</div>
      </div>
    );
  }

  const handleChange = (prop, value) => onUpdateProperty(selectedObject.id, prop, value);

  const roundToTwo = (num) => Math.round(num * 100) / 100;

  const handleNumber = (prop, value) => {
    let strValue = String(value).replace(',', '.');
    let num = parseFloat(strValue);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    handleChange(prop, roundToTwo(num));
  };

  const handlePos = (prop, value) => handleNumber(prop, value);

  const handleSize = (dim, value) => {
    let strValue = String(value).replace(',', '.');
    let num = parseFloat(strValue);
    if (isNaN(num)) num = 10;
    if (dim === 'width') onUpdateSize(selectedObject.id, num, selectedObject.height);
    else onUpdateSize(selectedObject.id, selectedObject.width, num);
  };

  const handleCornerRadius = (prop, value) => {
    let strValue = String(value).replace(',', '.');
    let num = parseFloat(strValue);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 50) num = 50;
    handleChange(prop, roundToTwo(num));
  }

  return (
    <div style={panelStyle}>
      <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Свойства</h3>

      <TypeInfo type={selectedObject.type} />
      <ContentField value={selectedObject.content} onChange={(e) => handleChange('content', e.target.value)} />

      <PositionControls
        x={selectedObject.x}
        y={selectedObject.y}
        onXChange={(e) => handlePos('x', e.target.value)}
        onYChange={(e) => handlePos('y', e.target.value)}
      />

      <SizeControls
        width={selectedObject.width}
        height={selectedObject.height}
        onWidthChange={(e) => handleSize('width', e.target.value)}
        onHeightChange={(e) => handleSize('height', e.target.value)}
      />

      <LayerControl zIndex={selectedObject.zIndex} onChange={(e) => handleNumber('zIndex', e.target.value)} />

      <ColorControl label="Цвет фона" value={selectedObject.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} />

      <ColorControl label="Цвет границы" value={selectedObject.borderColor} onChange={(e) => handleChange('borderColor', e.target.value)} />
      <BorderWidthControl value={selectedObject.borderWidth} onChange={(e) => handleNumber('borderWidth', e.target.value)} />

      <ColorControl label="Цвет текста" value={selectedObject.textColor} onChange={(e) => handleChange('textColor', e.target.value)} />
      <FontFamilySelect value={selectedObject.fontFamily} onChange={(e) => handleChange('fontFamily', e.target.value)} />
      <FontSizeControl value={selectedObject.fontSize} onChange={(e) => handleNumber('fontSize', e.target.value)} />

      <CornerRadiusControl value={selectedObject.cornerRadius} onChange={(e) => handleCornerRadius('cornerRadius', e.target.value)} />

      <ShadowControls
        offsetX={selectedObject.shadowOffsetX}
        offsetY={selectedObject.shadowOffsetY}
        blur={selectedObject.shadowBlur}
        color={selectedObject.shadowColor}
        onXChange={(e) => handleNumber('shadowOffsetX', e.target.value)}
        onYChange={(e) => handleNumber('shadowOffsetY', e.target.value)}
        onBlurChange={(e) => handleNumber('shadowBlur', e.target.value)}
        onColorChange={(e) => handleChange('shadowColor', e.target.value)}
      />
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

export default RightPanel;