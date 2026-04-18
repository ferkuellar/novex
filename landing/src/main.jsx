import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminPage from './AdminPage';
import './index.css';

const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

if (typeof document !== 'undefined') {
  document.body.classList.toggle('admin-mode', isAdminRoute);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminPage /> : <App />}
  </React.StrictMode>,
);
