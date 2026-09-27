import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships prerendered HTML (scripts/prerender.mjs): hydrate it. The dev server doesn't.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
