import { useState, useEffect, useRef } from 'react';

function MenuBar({ onImportProject, onExportProject, onExportPDF }) {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const menuRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setHoveredItem(null);
    }, 200);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setHoveredItem(null);
      }
    };
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && open) {
        setOpen(false);
        setHoveredItem(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleItemClick = (action) => {
    action();
    setOpen(false);
    setHoveredItem(null);
  };

  return (
    <div style={menuBarStyle} ref={menuRef}>
      <div
        style={{
          ...menuItemStyle,
          background: open ? '#e0e0e0' : 'transparent',
        }}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        Файл
      </div>
      {open && (
        <div
          style={dropdownStyle}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div style={hoverBridgeStyle} />
          {[
            { label: 'Импорт проекта', action: onImportProject },
            { label: 'Экспорт проекта', action: onExportProject },
            { type: 'separator' },
            { label: 'Экспорт MHTML', action: () => alert('Экспорт MHTML временно недоступен') },
            { label: 'Экспорт PDF', action: onExportPDF },
          ].map((item, index) => {
            if (item.type === 'separator') {
              return <div key={`sep-${index}`} style={separatorStyle} />;
            }
            return (
              <div
                key={item.label}
                style={{
                  ...dropdownItemStyle,
                  background: hoveredItem === item.label ? '#f0f0f0' : 'transparent',
                }}
                onClick={() => handleItemClick(item.action)}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const menuBarStyle = {
  gridArea: 'top',
  background: '#f0f0f0',
  borderBottom: '1px solid #ccc',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'var(--sans)',
  position: 'relative',
  userSelect: 'none',
};

const menuItemStyle = {
  padding: '6px 16px',
  cursor: 'default',
  fontSize: '14px',
  lineHeight: '20px',
  transition: 'background 0.1s',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  background: '#ffffff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minWidth: '200px',
  zIndex: 1000,
  padding: '4px 0',
  marginTop: '2px',
};

const dropdownItemStyle = {
  padding: '6px 16px',
  fontSize: '14px',
  cursor: 'default',
  whiteSpace: 'nowrap',
  transition: 'background 0.1s',
};

const separatorStyle = {
  height: '1px',
  background: '#e0e0e0',
  margin: '4px 0',
};

const hoverBridgeStyle = {
  position: 'absolute',
  top: -4,
  left: 0,
  right: 0,
  height: 4,
  background: 'transparent',
};

export default MenuBar;