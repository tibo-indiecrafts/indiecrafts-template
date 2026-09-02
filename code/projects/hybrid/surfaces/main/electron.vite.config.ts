import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// electron-vite builds the three processes from their conventional entries —
// src/main/index.ts · src/preload/index.ts · src/renderer/index.html (→ src/main.tsx)
// — into out/{main,preload,renderer}. The renderer is a real React 19 app (plain
// React + Vite, NOT Next), so it reuses the web bricks directly: shadcn
// (@indiecrafts/packages-web-ui) + the Next-agnostic system-pages/web. Tailwind v4
// (@tailwindcss/vite) compiles the token classes from src/renderer/src/globals.css.

// The @indiecrafts workspace bricks are TS-source-only (consumed via transpile — their
// package `exports` point at `src/*.ts`, no built output). The main/preload processes
// run through Node's CJS loader, so those bricks must be BUNDLED (transpiled) here, not
// externalized — otherwise Electron require()s raw TypeScript and throws
// `SyntaxError: Unexpected token 'export'`. externalizeDepsPlugin externalizes the app's
// direct dependencies; excluding the workspace bricks makes them bundle (their transitive
// deps aren't direct deps, so they already bundle). Node builtins + real npm deps stay
// external, as electron requires.
const workspaceBricks = [
  "@indiecrafts/packages-shared-agent-client",
  "@indiecrafts/packages-shared-announcement",
  "@indiecrafts/packages-shared-config",
  "@indiecrafts/packages-shared-logger",
  "@indiecrafts/packages-shared-utils",
  "@indiecrafts/packages-shared-ui-tokens",
  "@indiecrafts/packages-shared-ui-fonts",
  "@indiecrafts/packages-shared-system-pages",
  "@indiecrafts/packages-shared-compliance",
  "@indiecrafts/packages-shared-query",
  "@indiecrafts/packages-shared-version",
  "@indiecrafts/packages-web-ui",
  "@indiecrafts/packages-web-ui-components",
  "@indiecrafts/packages-shared-ui-icons",
  "@indiecrafts/packages-web-version",
];

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: workspaceBricks })],
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: workspaceBricks })],
  },
  renderer: {
    plugins: [react(), tailwindcss()],
  },
});
