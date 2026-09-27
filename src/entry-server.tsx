// Build-time prerender entry: renders the page to static HTML so crawlers and AI tools that don't
// run JavaScript still see all the content. The browser then hydrates it (see main.tsx).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
