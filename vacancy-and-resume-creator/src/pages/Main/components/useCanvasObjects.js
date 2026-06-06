import { useState, useCallback, useEffect } from 'react';

let nextId = 1;
const generateId = () => `obj_${nextId++}`;

const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 1130;
const MIN_SIZE = 10;
const roundToTwo = (num) => Math.round(num * 100) / 100;

const useCanvasObjects = () => {
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const validatePosition = (obj, x, y) => {
    const maxX = PAGE_WIDTH - obj.width;
    const maxY = PAGE_HEIGHT - obj.height;
    return {
      x: roundToTwo(Math.min(Math.max(x, 0), maxX)),
      y: roundToTwo(Math.min(Math.max(y, 0), maxY)),
    };
  };

  const validateSize = (obj, width, height) => {
    const newWidth = roundToTwo(Math.min(Math.max(width, MIN_SIZE), PAGE_WIDTH));
    const newHeight = roundToTwo(Math.min(Math.max(height, MIN_SIZE), PAGE_HEIGHT));
    const maxX = PAGE_WIDTH - newWidth;
    const maxY = PAGE_HEIGHT - newHeight;
    const newX = roundToTwo(Math.min(Math.max(obj.x, 0), maxX));
    const newY = roundToTwo(Math.min(Math.max(obj.y, 0), maxY));
    return { width: newWidth, height: newHeight, x: newX, y: newY };
  };

  const addObject = useCallback((type, x, y) => {
    const defaultProps = {
      id: generateId(),
      type,
      x: roundToTwo(x),
      y: roundToTwo(y),
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 60 : 100,
      content: type === 'text' ? 'Текст' : 'Прямоугольник',
      zIndex: 1,
      backgroundColor: type === 'text' ? '#f9f9f9' : '#e0e0e0',
      borderColor: '#cccccc',
      borderWidth: 1,
      textColor: '#000000',
      fontFamily: 'system-ui, sans-serif',
      fontSize: 14,
      cornerRadius: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 4,
      shadowColor: 'rgba(0,0,0,0.2)',
    };
    const clamped = validatePosition(defaultProps, x, y);
    defaultProps.x = clamped.x;
    defaultProps.y = clamped.y;
    setObjects(prev => [...prev, defaultProps]);
    setSelectedId(defaultProps.id);
  }, []);

  const updatePosition = useCallback((id, x, y) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id !== id) return obj;
      const clamped = validatePosition(obj, x, y);
      return { ...obj, x: clamped.x, y: clamped.y };
    }));
  }, []);

  const updateSize = useCallback((id, width, height) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id !== id) return obj;
      const validated = validateSize(obj, width, height);
      return { ...obj, width: validated.width, height: validated.height, x: validated.x, y: validated.y };
    }));
  }, []);

  const updateProperty = useCallback((id, property, value) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id !== id) return obj;
      if (property === 'x' || property === 'y') {
        const newX = property === 'x' ? value : obj.x;
        const newY = property === 'y' ? value : obj.y;
        const clamped = validatePosition(obj, newX, newY);
        return { ...obj, x: clamped.x, y: clamped.y };
      }
      if (property === 'width' || property === 'height') {
        const newWidth = property === 'width' ? value : obj.width;
        const newHeight = property === 'height' ? value : obj.height;
        const validated = validateSize(obj, newWidth, newHeight);
        return { ...obj, width: validated.width, height: validated.height, x: validated.x, y: validated.y };
      }
      return { ...obj, [property]: value };
    }));
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId]);

  const selectObject = useCallback((id) => {
    setSelectedId(id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteSelected]);

  return {
    objects,
    selectedId,
    addObject,
    updatePosition,
    updateSize,
    updateProperty,
    deleteSelected,
    selectObject,
  };
};

export default useCanvasObjects;