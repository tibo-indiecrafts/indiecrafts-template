import { defineConfig } from "electron-vite";

// electron-vite builds the three processes from their conventional entries —
// src/main/index.ts · src/preload/index.ts · src/renderer/index.html — into
// out/{main,preload,renderer} (which package.json `main` + the paths in
// src/main/index.ts point at). Defaults are enough for the scaffold; the renderer
// is plain Chromium/DOM here — swap in a web brick (React 19, like the web apps)
// when the product needs shared UI (see .claude/CLAUDE.md).
export default defineConfig({
  main: {},
  preload: {},
  renderer: {},
});
