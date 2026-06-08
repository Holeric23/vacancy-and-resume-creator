import { forwardRef, useRef, useState, useEffect } from 'react';

const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 1130;

const Canvas = forwardRef(({ objects, selectedId, onSelect, onUpdatePosition }, externalRef) => {
  const scrollContainerRef = useRef(null);
  const pageRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Передаём наружу реф на элемент страницы
  useEffect(() => {
    if (externalRef) {
      if (typeof externalRef === 'function') {
        externalRef(pageRef.current);
      } else {
        externalRef.current = pageRef.current;
      }
    }
  }, [externalRef]);

  const getCursorInContainer = (clientX, clientY) => {
    const container = scrollContainerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left + container.scrollLeft;
    const y = clientY - rect.top + container.scrollTop;
    return { x, y };
  };

  useEffect(() => {
    if (draggingId === null) return;

    const updateDragPosition = (clientX, clientY) => {
      const obj = objects.find(o => o.id === draggingId);
      if (!obj) return;
      const cursor = getCursorInContainer(clientX, clientY);
      let newX = cursor.x - dragOffset.x;
      let newY = cursor.y - dragOffset.y;
      const paddingLeft = 50;
      const paddingTop = 40;
      newX -= paddingLeft;
      newY -= paddingTop;
      const maxX = PAGE_WIDTH - obj.width;
      const maxY = PAGE_HEIGHT - obj.height;
      const clampedX = Math.min(Math.max(newX, 0), maxX);
      const clampedY = Math.min(Math.max(newY, 0), maxY);
      const roundedX = Math.round(clampedX * 10) / 10;
      const roundedY = Math.round(clampedY * 10) / 10;
      onUpdatePosition(draggingId, roundedX, roundedY);
    };

    const handleMouseMove = (e) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      updateDragPosition(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      updateDragPosition(lastMousePosRef.current.x, lastMousePosRef.current.y);
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [draggingId, dragOffset, objects, onUpdatePosition]);

  const handleMouseDown = (e, obj) => {
    e.stopPropagation();
    onSelect(obj.id);
    const cursor = getCursorInContainer(e.clientX, e.clientY);
    const paddingLeft = 50;
    const paddingTop = 40;
    const objXInContainer = obj.x + paddingLeft;
    const objYInContainer = obj.y + paddingTop;
    const offsetX = cursor.x - objXInContainer;
    const offsetY = cursor.y - objYInContainer;
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggingId(obj.id);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const renderObject = (obj) => {
    const isSelected = obj.id === selectedId;
    const hasShadow = obj.shadowOffsetX !== 0 || obj.shadowOffsetY !== 0 || obj.shadowBlur !== 0;
    const boxShadow = hasShadow
      ? `${obj.shadowOffsetX}px ${obj.shadowOffsetY}px ${obj.shadowBlur}px ${obj.shadowColor}`
      : 'none';

    const styles = {
      position: 'absolute',
      left: `${obj.x}px`,
      top: `${obj.y}px`,
      width: `${obj.width}px`,
      height: `${obj.height}px`,
      backgroundColor: obj.backgroundColor,
      border: isSelected
        ? `2px solid #aa3bff`
        : `${obj.borderWidth}px solid ${obj.borderColor}`,
      borderRadius: `${obj.cornerRadius}px`,
      color: obj.textColor,
      fontFamily: obj.fontFamily,
      fontSize: `${obj.fontSize}px`,
      boxShadow,
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      boxSizing: 'border-box',
      zIndex: obj.zIndex,
    };
    return (
      <div key={obj.id} style={styles} onMouseDown={(e) => handleMouseDown(e, obj)}>
        {obj.content}
      </div>
    );
  };

  return (
    <div ref={scrollContainerRef} style={canvasContainerStyle}>
      <div
        ref={pageRef}
        style={pageStyle}
        onMouseDown={(e) => e.target === e.currentTarget && onSelect(null)}
      >
        {objects.map(renderObject)}
      </div>
    </div>
  );
});

const canvasContainerStyle = {
  gridArea: 'center',
  background: '#e0e0e0',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '20px',
};

const pageStyle = {
  width: `${PAGE_WIDTH}px`,
  height: `${PAGE_HEIGHT}px`,
  background: '#ffffff',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  borderRadius: '2px',
  position: 'relative',
  padding: '40px 50px',
  boxSizing: 'border-box',
};

export default Canvas;