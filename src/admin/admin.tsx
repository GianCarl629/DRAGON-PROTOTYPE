import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './AdminApp';
import { initCursorSystem } from '../services/cursorService';
import '../index.css';

if (typeof window !== 'undefined') {
  initCursorSystem();
}

const rootElement = document.getElementById('admin-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
