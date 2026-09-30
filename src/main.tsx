import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// If directly navigating to /admin, route to dedicated admin page
if (typeof window !== 'undefined') {
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path === '/admin/') {
    window.location.replace('/admin.html');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
