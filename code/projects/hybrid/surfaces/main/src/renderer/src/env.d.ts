// The API the preload exposes on `window` via contextBridge (src/preload/index.ts).
// Keep this in sync with what the preload actually exposes — it's the whole,
// explicit surface the sandboxed renderer may touch.
export {};

declare global {
  interface Window {
    desktop: {
      version: string;
    };
  }
}
