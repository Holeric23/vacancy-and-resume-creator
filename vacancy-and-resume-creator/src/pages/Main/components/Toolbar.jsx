function Toolbar({ onImportProject, onExportProject, 
  // onExportMHTML,
   onExportPDF }) {
  return (
    <div style={toolbarStyle}>
      <button onClick={onImportProject} style={buttonStyle}>Импорт проекта</button>
      <button onClick={onExportProject} style={buttonStyle}>Экспорт проекта</button>
      <div style={{ width: '1px', background: '#ccc', margin: '0 8px' }} />
      {/* <button onClick={onExportMHTML} style={buttonStyle}>🌐 Экспорт MHTML</button> */}
      <button onClick={onExportPDF} style={buttonStyle}>Экспорт PDF</button>
    </div>
  );
}

const toolbarStyle = {
  gridArea: 'top',
  background: '#f0f0f0',
  borderBottom: '1px solid #ccc',
  padding: '8px 16px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  fontFamily: 'var(--sans)',
};

const buttonStyle = {
  padding: '6px 12px',
  background: '#fff',
  border: '1px solid #aaa',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default Toolbar;