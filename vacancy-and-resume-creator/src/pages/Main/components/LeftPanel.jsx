function LeftPanel({ objects, selectedId, onSelect }) {
  return (
    <div
      style={{
        gridArea: 'left',
        width: '220px',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        background: '#F5F5F5',
        padding: '16px',
        overflowY: 'auto',
        fontFamily: 'var(--sans)',
      }}
    >
      <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Объекты</h3>
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
          }}
        >
          {obj.content}
        </div>
      ))}
    </div>
  );
}

export default LeftPanel;