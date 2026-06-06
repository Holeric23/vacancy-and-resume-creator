function Toolbar({ onAddRectangle, onAddText, onImport, onExportPDF, onExportMHTML }) {
  return (
    <div
      style={{
        gridArea: 'top',
        background: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        padding: '8px 16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        fontFamily: 'var(--sans)',
      }}
    >
      <button
        onClick={onAddRectangle}
        style={{
          padding: '6px 12px',
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Прямоугольник
      </button>
      <button
        onClick={onAddText}
        style={{
          padding: '6px 12px',
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Текст
      </button>
      <div style={{ width: '1px', background: '#ccc', margin: '0 8px' }} />
      <button
        onClick={onImport}
        style={{
          padding: '6px 12px',
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Импорт
      </button>
      <button
        onClick={onExportPDF}
        style={{
          padding: '6px 12px',
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Экспорт PDF
      </button>
      <button
        onClick={onExportMHTML}
        style={{
          padding: '6px 12px',
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Экспорт MHTML
      </button>
    </div>
  );
}

export default Toolbar;