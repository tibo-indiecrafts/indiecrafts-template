// Packaged renderer — the offline UI Electron loads when `app.isPackaged`. In dev
// the main process loads the web app URL instead (RENDERER_URL, default
// http://localhost:3000). This scaffold just proves the main → preload → renderer
// bridge works; replace it with your product UI, or point the prod window at the
// live web build (see src/main/index.ts + .claude/CLAUDE.md).
const el = document.getElementById("app");
if (el) {
  const version = window.desktop?.version ?? "unknown";
  el.textContent = `indiecrafts desktop shell — Electron ${version}`;
}
