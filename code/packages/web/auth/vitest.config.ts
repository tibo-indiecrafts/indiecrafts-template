import { mergeConfig } from "vitest/config";
import shared from "../../../../vitest.shared";

// Colocated *.test.ts in this brick; extends the shared happy-dom base. The first Radix
// render pays a cold import, which can pass 5s under a parallel turbo run.
export default mergeConfig(shared, { test: { testTimeout: 20_000 } });
