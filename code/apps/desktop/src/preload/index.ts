import { contextBridge } from "electron";

// Preload — the ONLY bridge between the sandboxed renderer and Node. Expose a
// minimal, explicit API (never the whole `ipcRenderer`); keep contextIsolation on.
contextBridge.exposeInMainWorld("desktop", {
  version: process.versions.electron,
});
