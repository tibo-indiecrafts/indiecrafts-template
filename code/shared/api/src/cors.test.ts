import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// The account actions run in the browser (website, app, and the app inside the mobile
// WebView) and send the Clerk session token in `Authorization`. A preflight that does not
// allow that header makes the browser drop the request — the page shows "Something went wrong".
describe.each(["/v1/export", "/v1/erasure/self"])(
  "CORS for %s (Clerk-JWT, called from a browser)",
  (path) => {
    it("the preflight allows the authorization header", async () => {
      const res = await SELF.fetch(`https://api.test${path}`, {
        method: "OPTIONS",
        headers: {
          origin: "https://app.example.com",
          "access-control-request-method": "POST",
          "access-control-request-headers": "authorization, content-type",
        },
      });
      expect(res.status).toBe(204);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
      const allowed = (
        res.headers.get("access-control-allow-headers") ?? ""
      ).toLowerCase();
      expect(allowed).toContain("authorization");
      expect(allowed).toContain("content-type");
      expect(res.headers.get("access-control-allow-methods") ?? "").toContain(
        "POST",
      );
    });

    it("an error answer still carries CORS, so the page can read it", async () => {
      const res = await SELF.fetch(`https://api.test${path}`, {
        method: "POST",
        headers: {
          origin: "https://app.example.com",
          authorization: "Bearer not-a-jwt",
        },
      });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
    });
  },
);
