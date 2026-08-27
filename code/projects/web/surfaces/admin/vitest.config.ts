import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import shared from "../../../../../vitest.shared";

// Colocated *.test.{ts,tsx} in this package; extends the shared happy-dom base.
// Adds the app's `@/` → `src` alias so lib tests import app modules exactly as
// production code does (the shared base only stubs `server-only`).
export default mergeConfig(shared, {
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
