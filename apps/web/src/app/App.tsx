import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  asPageId, 
  asNodeId, 
  createHistory, 
  commitCommand, 
  undo, 
  redo, 
  Document,
  NodeId,
  PagePresetName,
  PageOrientation,
  AddNodesCommand,
  MoveNodesCommand,
  ResizeNodeCommand,
  DeleteNodesCommand,
  getPageSize
} from 'document-core';
import { serializeProject, parseProject } from 'project-codec';
import { TemplateLibrary } from '@/features/templates/ui/template-library.tsx';
import { CanvasViewport } from '@/features/editor/ui/canvas/canvas-viewport.tsx';
import { InspectorPanel } from '@/features/editor/ui/inspector/inspector-panel.tsx';
import { InteractionMode } from '@/features/editor/model/interaction-state.ts';
import { saveProjectToLocal, loadProjectFromLocal } from '@/features/project-io/infrastructure/local-project-repository.ts';
import { exportAsPDF } from '@/features/export/application/export-document.ts';
import { exportAsHTMLFile } from '@/features/export/application/mhtml-exporter.ts';
import { PX_PER_MM } from '@/features/editor/lib/client-to-document-point.ts';
import styles from './App.module.css';

const DEFAULT_INITIAL_DOCUMENT: Document = {
  id: 'doc_default',
  title: 'Мое Резюме / Вакансия',
  pagesById: {
    [asPageId('page_1')]: {
      id: asPageId('page_1'),
      preset: 'A4',
      orientation: 'portrait',
      nodesById: {
        [asNodeId('node_init_1')]: {
          id: asNodeId('node_init_1'),
          kind: 'heading',
          level: 1,
          frame: { x: 20, y: 20, width: 170, height: 16 },
          zIndex: 1,
          style: { backgroundColor: 'transparent' },
          content: 'Иванов Иван Иванович',
          textStyle: { fontSize: 18, fontFamily: 'Inter', textColor: '#111827' }
        },
        [asNodeId('node_init_2')]: {
          id: asNodeId('node_init_2'),
          kind: 'text',
          frame: { x: 20, y: 38, width: 170, height: 25 },
          zIndex: 1,
          style: { backgroundColor: 'transparent' },
          content: 'Опытный фронтенд-разработчик. Создаю масштабируемые веб-приложения на React и TypeScript с чистой архитектурой монорепозиториев.',
          textStyle: { fontSize: 11, fontFamily: 'System', textColor: '#4b5563' }
        }
      },
      nodeOrder: [asNodeId('node_init_1'), asNodeId('node_init_2')]
    }
  },
  pageOrder: [asPageId('page_1')]
};

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [zoom, setZoom] = useState<number>(0.85);
  const [selectedIds, setSelectedIds] = useState<Set<NodeId>>(new Set());
  const [interactionMode, setInteractionMode] = useState<InteractionMode>({ type: 'idle' });

  const fileMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  const [history, setHistoryState] = useState(() => {
    const savedProject = loadProjectFromLocal();
    return createHistory(savedProject || DEFAULT_INITIAL_DOCUMENT);
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveProjectToLocal(history.present);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [history.present]);

  // Слушатель автозакрытия выпадающих меню при клике по любому другому месту (Click Outside)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Применяем тему на root-элемент
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const activePageId = history.present.pageOrder[0] || asPageId('page_1');
  const page = history.present.pagesById[activePageId];

  if (!page) {
    return <div className={styles.appShell}>Критическая ошибка: страница редактора не найдена.</div>;
  }

  // КЛАВИАТУРНОЕ УДАЛЕНИЕ (A11y-совместимое)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
        e.preventDefault();
        const idsArray = Array.from(selectedIds);
        const command = new DeleteNodesCommand(activePageId, idsArray);
        setHistoryState(prev => commitCommand(prev, command));
        setSelectedIds(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageId, selectedIds]);

  const handleInteractionStart = useCallback((mode: InteractionMode) => {
    setInteractionMode(mode);
  }, []);

  const handleInteractionUpdate = useCallback((mode: InteractionMode) => {
    setInteractionMode(mode);
  }, []);

  const handleInteractionEnd = useCallback((commitAction: 'move' | 'resize' | 'none', finalData?: any) => {
    setInteractionMode({ type: 'idle' });

    if (commitAction === 'none' || !finalData) return;

    if (commitAction === 'move') {
      const deltas = finalData as { id: NodeId; dx: number; dy: number }[];
      const command = new MoveNodesCommand(activePageId, deltas);
      setHistoryState(prev => commitCommand(prev, command));
    } else if (commitAction === 'resize') {
      const { nodeId, handle, dx, dy } = finalData;
      const command = new ResizeNodeCommand(activePageId, nodeId, handle, dx, dy);
      setHistoryState(prev => commitCommand(prev, command));
    }
  }, [activePageId]);

  const handleSelectNode = useCallback((nodeId: NodeId | null) => {
    if (nodeId === null) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set([nodeId]));
    }
  }, []);

  const handleAddNodes = useCallback((newNodes: any[]) => {
    const command = new AddNodesCommand(activePageId, newNodes);
    setHistoryState(prev => commitCommand(prev, command));
    if (newNodes.length > 0) {
      setSelectedIds(new Set([newNodes[newNodes.length - 1].id]));
    }
  }, [activePageId]);

  const handleCommitCommand = useCallback((command: any) => {
    setHistoryState(prev => commitCommand(prev, command));
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setHistoryState(prev => ({
      ...prev,
      present: {
        ...prev.present,
        title: newTitle
      }
    }));
  };

  const handleFormatChange = (preset: PagePresetName) => {
    setHistoryState(prev => {
      const nextDoc = {
        ...prev.present,
        pagesById: {
          ...prev.present.pagesById,
          [activePageId]: {
            ...page,
            preset
          }
        }
      };
      return createHistory(nextDoc);
    });
  };

  const handleOrientationChange = (orientation: PageOrientation) => {
    setHistoryState(prev => {
      const nextDoc = {
        ...prev.present,
        pagesById: {
          ...prev.present.pagesById,
          [activePageId]: {
            ...page,
            orientation
          }
        }
      };
      return createHistory(nextDoc);
    });
  };

  const handleImportProjectFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.vacancy';
    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const envelope = parseProject(content);
          setHistoryState(createHistory(envelope.document as Document));
          setSelectedIds(new Set());
          alert('Проект успешно импортирован!');
        } catch (err) {
          alert((err as Error).message);
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  const handleExportProjectFile = () => {
    try {
      const jsonString = serializeProject(history.present, history.present.id);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${history.present.title.toLowerCase().replace(/\s+/g, '-')}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleClearCanvas = () => {
    if (confirm('Вы уверены, что хотите полностью очистить холст? Все созданные блоки будут удалены.')) {
      setHistoryState(prev => {
        const emptyDoc: Document = {
          ...history.present,
          pagesById: {
            ...prev.present.pagesById,
            [activePageId]: {
              ...page,
              nodesById: {},
              nodeOrder: []
            }
          }
        };
        return createHistory(emptyDoc);
      });
      setSelectedIds(new Set());
    }
  };

  const handleAutoFitWidth = () => {
    const container = document.querySelector('[data-viewport-container]');
    if (container) {
      const availableWidth = container.clientWidth - 120;
      const pagePresetSize = getPageSize(page.preset, page.orientation);
      const pageBaseWidthPx = pagePresetSize.width * PX_PER_MM;
      
      const fitZoom = Math.min(2, Math.max(0.2, availableWidth / pageBaseWidthPx));
      setZoom(Math.round(fitZoom * 100) / 100);
    }
  };

  // Вычисление динамической ширины поля названия проекта
  const titleCharCount = history.present.title.length || 1;
  const computedTitleWidth = Math.max(150, Math.min(360, titleCharCount * 9.5 + 24));

  return (
    <div className={styles.appShell}>
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ УПРАВЛЕНИЯ (Top Bar) */}
      <header className={styles.topBar}>
        
        {/* ЛЕВЫЙ РАЗДЕЛ ТУЛБАРА */}
        <div className={styles.leftControls}>
          {/* Группа Undo / Redo */}
          <button 
            className={styles.button} 
            onClick={() => setHistoryState(prev => undo(prev))} 
            disabled={history.past.length === 0}
            title="Отменить действие (Ctrl+Z)"
          >
            ↩️ Undo ({history.past.length})
          </button>
          <button 
            className={styles.button} 
            onClick={() => setHistoryState(prev => redo(prev))} 
            disabled={history.future.length === 0}
            title="Повторить действие (Ctrl+Y)"
          >
            🔁 Redo ({history.future.length})
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

          {/* Меню Файл (Dropdown) */}
          <div className={styles.menuContainer} ref={fileMenuRef}>
            <button 
              className={`${styles.button} ${styles.buttonAccent}`} 
              onClick={() => setIsFileMenuOpen(prev => !prev)}
            >
              📄 Файл {isFileMenuOpen ? '▲' : '▼'}
            </button>
            {isFileMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => { handleImportProjectFile(); setIsFileMenuOpen(false); }}
                >
                  📂 Импорт проекта (.json)
                </button>
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => { handleExportProjectFile(); setIsFileMenuOpen(false); }}
                >
                  💾 Сохранить проект (.json)
                </button>
              </div>
            )}
          </div>

          {/* Меню Экспорт (Dropdown) */}
          <div className={styles.menuContainer} ref={exportMenuRef}>
            <button 
              className={styles.button} 
              onClick={() => setIsExportMenuOpen(prev => !prev)}
            >
              📤 Экспорт {isExportMenuOpen ? '▲' : '▼'}
            </button>
            {isExportMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => { exportAsHTMLFile(history.present, activePageId); setIsExportMenuOpen(false); }}
                >
                  🌐 Скачать как HTML-страницу
                </button>
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => { exportAsPDF(history.present, activePageId); setIsExportMenuOpen(false); }}
                >
                  🖨️ Сохранить как PDF
                </button>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

          {/* Селектор формата листа */}
          <select
            className={styles.selectControl}
            value={page.preset}
            onChange={(e) => handleFormatChange(e.target.value as PagePresetName)}
            title="Формат холста"
          >
            <option value="A3">A3 (Постер)</option>
            <option value="A4">A4 (Стандарт)</option>
            <option value="A5">A5 (Брошюра)</option>
            <option value="letter">US Letter (США)</option>
          </select>

          {/* Селектор ориентации листа */}
          <select
            className={styles.selectControl}
            value={page.orientation}
            onChange={(e) => handleOrientationChange(e.target.value as PageOrientation)}
            title="Ориентация страницы"
          >
            <option value="portrait">Книжная 📄</option>
            <option value="landscape">Альбомная 📖</option>
          </select>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

          {/* Инструменты масштабирования */}
          <div className={styles.zoomControls}>
            <button className={styles.zoomButton} onClick={() => setZoom(z => Math.max(0.25, z - 0.15))}>-</button>
            <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
            <button className={styles.zoomButton} onClick={() => setZoom(z => Math.min(3, z + 0.15))}>+</button>
            <button className={styles.zoomButton} style={{ borderLeft: '1px solid var(--color-border)' }} onClick={handleAutoFitWidth} title="Вписать по ширине экрана">🔍 Вписать</button>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

          {/* Поле редактирования названия проекта с ПРИМЕНЕННОЙ динамической шириной */}
          <input
            type="text"
            className={styles.projectTitle}
            style={{ width: `${computedTitleWidth}px` }}
            value={history.present.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            title="Кликните, чтобы переименовать проект"
          />
        </div>

        {/* ПРАВЫЙ РАЗДЕЛ ТУЛБАРА */}
        <div className={styles.rightControls}>
          <button 
            className={styles.button} 
            style={{ color: 'var(--color-danger)' }} 
            onClick={handleClearCanvas} 
            title="Очистить холст"
          >
            🧹 Очистить
          </button>
          
          <button 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
            className={styles.button}
            title="Сменить тему интерфейса"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* 2. ЛЕВАЯ ПАНЕЛЬ ИНСТРУМЕНТОВ И СЛОЕВ */}
      <TemplateLibrary
        nodesById={page.nodesById}
        nodeOrder={page.nodeOrder}
        selectedIds={selectedIds}
        onAddNodes={handleAddNodes}
        onSelectNode={handleSelectNode}
      />

      {/* 3. ЦЕНТРАЛЬНЫЙ ИНТЕРАКТИВНЫЙ ХОЛСТ */}
      <CanvasViewport
        documentData={history.present}
        activePageId={activePageId}
        selectedIds={selectedIds}
        zoom={zoom}
        interactionMode={interactionMode}
        onInteractionStart={handleInteractionStart}
        onInteractionUpdate={handleInteractionUpdate}
        onInteractionEnd={handleInteractionEnd}
        onSelectNode={handleSelectNode}
      />

      {/* 4. ПРАВАЯ УМНАЯ ПАНЕЛЬ СВОЙСТВ */}
      <InspectorPanel
        selectedNodeId={Array.from(selectedIds)[0] || null}
        nodesById={page.nodesById}
        activePageId={activePageId}
        onCommitCommand={handleCommitCommand}
      />
    </div>
  );
}