import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotFoundPage } from './components/NotFound/NotFoundPage';
import './index.css';

const rootEl = document.getElementById('error-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <NotFoundPage />
    </React.StrictMode>
  );
}
