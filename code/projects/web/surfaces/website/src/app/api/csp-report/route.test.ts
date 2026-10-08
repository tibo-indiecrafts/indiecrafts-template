// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

// The sink's own rules (content-type allowlist, body cap, sanitize) are tested in
// `@indiecrafts/packages-web-security-reports`; the route only tags its surface.
const handleCspReport = vi.hoisted(() =>
  vi.fn(async (_req: Request, _opts: unknown) => new Response(null, { status: 204 })),
);
vi.mock("@indiecrafts/packages-web-security-reports/handle", () => ({ handleCspReport }));

const { POST } = await import("./route");

describe("POST /api/csp-report", () => {
  it("hands the report to the shared sink, tagged as the website", async () => {
    const req = new Request("https://x.test/api/csp-report", {
      method: "POST",
      body: "{}",
    });
    expect((await POST(req)).status).toBe(204);
    expect(handleCspReport).toHaveBeenCalledWith(req, { surface: "website" });
  });
});
