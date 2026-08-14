import { mergeConfig } from "vitest/config";
import shared from "../../../vitest.shared";

// Colocated *.test.{ts,tsx} in this package; extends the shared happy-dom base.
export default mergeConfig(shared, {});
