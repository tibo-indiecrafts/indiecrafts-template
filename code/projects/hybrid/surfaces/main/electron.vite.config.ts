import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// electron-vite builds the three processes from their conventional entries —
// src/main/index.ts · src/preload/index.ts · src/renderer/index.html (→ src/main.tsx)
// — into out/{main,preload,renderer}. The renderer is a real React 19 app (plain
// React + Vite, NOT Next), so it reuses the web bricks directly: shadcn
// (@indiecrafts/packages-web-ui) + the Next-agnostic system-pages/web. Tailwind v4
// (@tailwindcss/vite) compiles the token classes from src/renderer/src/globals.css.
export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [react(), tailwindcss()],
  },
});
