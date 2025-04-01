import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import App from "./App";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then((reg) => {
    // console.log("Service Worker Registered", reg);
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
