import { usePanelState } from '@/contexts';

const CollapsibleSection = ({ title, sectionKey, defaultCollapsed = false, children }) => {
  const { collapsed, toggle } = usePanelState(sectionKey, defaultCollapsed);

  return (
    <div style={{ marginBottom: '20px', paddingBottom: '12px' }}>
      <div
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: collapsed ? 0 : '12px',
        }}
      >
        <span style={{ fontSize: '16px', marginRight: '8px', transition: 'transform 0.2s' }}>
          {collapsed ? '▶' : '▼'}
        </span>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{title}</h4>
      </div>
      {!collapsed && <div style={{ marginTop: '8px' }}>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;