import { useContext, useState, useCallback } from 'react';
import PanelStateContext from './PanelStateContext';

export default function usePanelState(key, defaultCollapsed = false) {
  const ctx = useContext(PanelStateContext);
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);

  const toggle = useCallback(() => {
    if (ctx) {
      ctx.toggleSection(key);
    } else {
      setLocalCollapsed(prev => !prev);
    }
  }, [ctx, key]);

  const collapsed = ctx
    ? (Object.prototype.hasOwnProperty.call(ctx.collapsedSections, key)
        ? ctx.collapsedSections[key]
        : defaultCollapsed)
    : localCollapsed;

  return { collapsed, toggle };
}