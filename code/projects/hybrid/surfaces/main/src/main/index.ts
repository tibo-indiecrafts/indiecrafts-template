import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import { defaultLocale } from "../config";

// Electron main process. The "hybrid": a native window around web UI. Point it at
// a web app — the `website` dev server in dev, a bundled build or the live
// URL in prod. The renderer IS Chromium, so it can reuse the web bricks
// (`@indiecrafts/ui`, `ui-components`, React 19); the main process (here) uses only
// the React-free bricks. Finalize the loaded URL/build strategy for your product.
const DEV_URL = process.env.RENDERER_URL ?? "http://localhost:3000";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `indiecrafts (${defaultLocale})`,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
    },
  });
  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    win.loadURL(DEV_URL);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
