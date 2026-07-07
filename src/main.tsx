import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign Vite HMR WebSocket connection errors in sandbox
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (!reason) return;
  const msg = typeof reason === 'string' ? reason : (reason.message || '');
  if (
    msg.includes('WebSocket') ||
    msg.includes('connection failed') ||
    msg.includes('closed without opened') ||
    msg.includes('ws://') ||
    msg.includes('wss://')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    msg.includes('WebSocket') ||
    msg.includes('connection failed') ||
    msg.includes('closed without opened') ||
    msg.includes('ws://') ||
    msg.includes('wss://')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
