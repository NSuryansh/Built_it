import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import App from "./App";
import ErrorBoundaryFallback from "./pages/easter_egg/error_boundary_fallback";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js").then((reg) => {
    console.log("Service Worker Registered", reg);
  });
}

const userType = localStorage.getItem("user_type")
  ? localStorage.getItem("user_type")
  : "user";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorBoundaryFallback userType={userType} />}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
