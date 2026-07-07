import { createContext, useState, useCallback } from 'react';

const PanelStateContext = createContext(null);

export function PanelStateProvider({ children }) {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = useCallback((key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const restoreCollapsedSections = useCallback((newState) => {
    setCollapsedSections(prev => ({
      ...prev,
      ...newState
    }));
  }, []);

  return (
    <PanelStateContext.Provider value={{ 
      collapsedSections, 
      toggleSection, 
      restoreCollapsedSections 
    }}>
      {children}
    </PanelStateContext.Provider>
  );
}

export default PanelStateContext;