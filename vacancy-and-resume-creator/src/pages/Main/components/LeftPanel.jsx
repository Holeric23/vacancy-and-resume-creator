import CollapsibleSection from '../../../components/CollapsibleSection';

function LeftPanel({ objects, selectedId, onSelect, addObject }) {
  const handleAddDefaultBlock = () => {
    // Добавляем в центр холста
    addObject('rectangle', 100, 100);
  };

  return (
    <div style={panelStyle}>
      <CollapsibleSection title="Шаблоны" defaultCollapsed={false}>
        <button
          onClick={handleAddDefaultBlock}
          style={templateButtonStyle}
        >
          Прямоугольник
        </button>
        {/* Здесь позже добавятся другие шаблоны (вакансия/резюме) */}
      </CollapsibleSection>

      <CollapsibleSection title="Объекты" defaultCollapsed={false}>
        {objects.length === 0 && (
          <div style={{ color: '#999', fontSize: '14px' }}>Нет объектов</div>
        )}
        {objects.map(obj => (
          <div
            key={obj.id}
            onClick={() => onSelect(obj.id)}
            style={{
              padding: '8px',
              marginBottom: '8px',
              background: selectedId === obj.id ? '#e0e0e0' : '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              wordBreak: 'break-word',
            }}
          >
            {obj.content}
          </div>
        ))}
      </CollapsibleSection>
    </div>
  );
}

const panelStyle = {
  gridArea: 'left',
  width: '220px',
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  background: '#F5F5F5',
  padding: '16px',
  overflowY: 'auto',
  fontFamily: 'var(--sans)',
};

const templateButtonStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '14px',
  marginBottom: '8px',
  transition: 'background 0.1s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export default LeftPanel;