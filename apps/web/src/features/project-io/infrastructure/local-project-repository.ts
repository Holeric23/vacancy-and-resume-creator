import { Document } from 'document-core';

const STORAGE_KEY = 'vacancy_resume_creator_project';

/**
 * Сохраняет канонический документ в локальное хранилище браузера.
 */
export const saveProjectToLocal = (documentData: Document): void => {
  try {
    const rawString = JSON.stringify(documentData);
    localStorage.setItem(STORAGE_KEY, rawString);
  } catch (err) {
    console.error('Ошибка автоматического сохранения проекта в LocalStorage:', err);
  }
};

/**
 * Загружает проект из локального хранилища, если он там есть.
 */
export const loadProjectFromLocal = (): Document | null => {
  try {
    const rawString = localStorage.getItem(STORAGE_KEY);
    if (!rawString) return null;
    return JSON.parse(rawString) as Document;
  } catch (err) {
    console.error('Ошибка восстановления проекта из LocalStorage:', err);
    return null;
  }
};