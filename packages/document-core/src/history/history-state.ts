import { Document } from '../model/document.ts';
import { Command } from '../commands/command.ts';

export interface HistoryState {
  past: Command[];   // Стек обратных команд для отката (Undo)
  present: Document; // Текущий актуальный документ
  future: Command[]; // Стек прямых команд для наката (Redo)
}

export const createHistory = (initialDocument: Document): HistoryState => ({
  past: [],
  present: initialDocument,
  future: [],
});

/**
 * Применяет новую изменяющую команду к истории, очищая ветку будущего (future).
 */
export const commitCommand = (state: HistoryState, command: Command): HistoryState => {
  const { document, inverse } = command.execute(state.present);
  
  // Если документ не изменился (например, команда была пустой), не засоряем историю
  if (document === state.present) {
    return state;
  }

  return {
    past: [...state.past, inverse], // Кладем обратную команду в стек Undo
    present: document,
    future: [],                     // Ветка Redo сбрасывается при новом действии
  };
};

/**
 * Откатывает последнее действие назад (Undo)
 */
export const undo = (state: HistoryState): HistoryState => {
  if (state.past.length === 0) return state;

  const undoCommand = state.past[state.past.length - 1];
  if (!undoCommand) return state;

  const { document, inverse } = undoCommand.execute(state.present);

  return {
    past: state.past.slice(0, -1),
    present: document,
    future: [...state.future, inverse], // Кладем прямую команду для отката обратно в Redo
  };
};

/**
 * Накатывает отмененное действие вперед (Redo)
 */
export const redo = (state: HistoryState): HistoryState => {
  if (state.future.length === 0) return state;

  const redoCommand = state.future[state.future.length - 1];
  if (!redoCommand) return state;

  const { document, inverse } = redoCommand.execute(state.present);

  return {
    past: [...state.past, inverse], // Возвращаем обратную команду в стек Undo
    present: document,
    future: state.future.slice(0, -1),
  };
};