import { describe, expect, it } from "vitest";
import CatchAll from "./page";

// Every unknown path lands here and must throw Next's 404 signal, so `[locale]/not-found`
// renders with a 404 status (no Suspense boundary above it → not streamed → a real 404).
describe("app [locale]/[...rest] catch-all", () => {
  it("throws notFound() for any unknown path", () => {
    expect(() => CatchAll()).toThrow(
      expect.objectContaining({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" }),
    );
  });
});
