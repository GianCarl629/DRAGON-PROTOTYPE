import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotFoundPage } from './components/NotFound/NotFoundPage';
import { initCursorSystem } from './services/cursorService';
import './index.css';

if (typeof window !== 'undefined') {
  initCursorSystem();
}

const rootEl = document.getElementById('error-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <NotFoundPage />
    </React.StrictMode>
  );
}
