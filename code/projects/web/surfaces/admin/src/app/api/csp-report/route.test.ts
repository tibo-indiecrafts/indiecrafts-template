import { describe, expect, it, vi } from "vitest";

const { handleCspReport } = vi.hoisted(() => ({ handleCspReport: vi.fn() }));
vi.mock("@indiecrafts/packages-web-security-reports/handle", () => ({
  handleCspReport,
}));

const { POST } = await import("./route");

describe("POST /api/csp-report", () => {
  it("forwards the request to the shared handler tagged with this app's surface", () => {
    const response = new Response(null, { status: 204 });
    handleCspReport.mockReturnValue(response);
    const request = new Request("https://x.dev/api/csp-report", { method: "POST" });

    const result = POST(request);

    expect(handleCspReport).toHaveBeenCalledWith(request, { surface: "admin" });
    expect(result).toBe(response);
  });
});
