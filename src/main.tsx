import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async"; // HelmetProvider ko import karein
import App from "./App.tsx";
import "./index.css";

// Root element ko get karein
const container = document.getElementById("root");

// Sunishchit karein ki root element maujood hai
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      {/* App ko HelmetProvider se wrap karein */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' was not found in the document.");
}
