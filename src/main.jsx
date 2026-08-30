import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/base.css';
import './styles/components.css';

const legacyHashPath = window.location.hash.slice(1);
if (legacyHashPath.startsWith('/')) {
  window.history.replaceState(null, '', legacyHashPath);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
