import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { preload } from "react-dom";
import monteCarloFontUrl from "@fontsource/montecarlo/files/montecarlo-latin-400-normal.woff2?url";
import "./index.scss";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/lora/latin-500-italic.css";
import "@fontsource/lora/latin-600.css";
import "@fontsource/montecarlo/latin-400.css";
import App from "./App.jsx";

preload(monteCarloFontUrl, {
  as: "font",
  type: "font/woff2",
  crossOrigin: "anonymous",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
