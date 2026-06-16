import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// React 18 root API. Strict mode is intentionally on — it surfaces unsafe
// lifecycle usage and double-invokes effects in development to catch bugs.
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
