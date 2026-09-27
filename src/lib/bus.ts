// Tiny cross-component events: the nav/hero open the palette, the palette drives the terminal.
export const openPalette = () => window.dispatchEvent(new CustomEvent("vs:palette"));
export const runInTerminal = (cmd: string) => {
  document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("vs:terminal", { detail: cmd }));
};
export const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
