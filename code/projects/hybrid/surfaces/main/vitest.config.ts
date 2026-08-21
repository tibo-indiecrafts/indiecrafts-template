import { mergeConfig } from "vitest/config";
import shared from "../../../../../vitest.shared";

// Colocated *.test.ts for the main/preload logic (pure, Electron-free — the electron
// modules are never imported by a test). Extends the shared happy-dom base.
export default mergeConfig(shared, {});
