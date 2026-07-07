import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import { PanelStateProvider } from '@/contexts';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PanelStateProvider>
        <GlobalStyles />
        <App />
      </PanelStateProvider>
    </BrowserRouter>
  </StrictMode>
);