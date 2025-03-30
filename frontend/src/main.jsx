import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
