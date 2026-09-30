import React, { useState, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { NotFoundPage } from './components/NotFound/NotFoundPage';
import './index.css';

// Lazy load heavy homepage application so 404 error page loads with zero unnecessary overhead
const App = React.lazy(() => import('./App'));

// If directly navigating to /admin, immediately redirect to dedicated admin portal
if (typeof window !== 'undefined') {
  const initialPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  if (initialPath === '/admin') {
    window.location.replace('/admin.html');
  }
}

// Valid customer-facing routes on the main landing site
const isValidCustomerRoute = (pathname: string): boolean => {
  const normalized = pathname.replace(/\/+$/, '').toLowerCase();
  return normalized === '' || normalized === '/index.html';
};

const Root: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show custom 404 page for any invalid / non-existent route
  if (!isValidCustomerRoute(currentPath)) {
    return <NotFoundPage />;
  }

  // Normal website for valid root path
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-gold-500/20 border-t-gold-600 rounded-full animate-spin" />
        </div>
      }
    >
      <App />
    </Suspense>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
