import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';

// Импортируем каскад стилей в строгом архитектурном порядке
import './app/styles/reset.css';
import './app/styles/tokens.css';
import './app/styles/themes.css';
import './app/styles/globals.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error("Не удалось найти корневой элемент #root для монтирования React-приложения");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);