import { mergeConfig } from "vitest/config";
import shared from "../../../../vitest.shared";

// Colocated *.test.{ts,tsx} in this module; extends the shared happy-dom base.
export default mergeConfig(shared, {});
