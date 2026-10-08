// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ newsletter: true }));
const resolveMagnetDownload = vi.hoisted(() => vi.fn());
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      get newsletter() {
        return flags.newsletter;
      },
    },
  };
});
vi.mock("@indiecrafts/modules-web-newsletter/lib/deliver-magnet", () => ({
  resolveMagnetDownload,
}));

const { GET } = await import("./route");
const get = (qs: string) => GET(new Request(`https://x.test/api/download${qs}`));
const FILE = "https://cdn.example.com/files/guide.pdf";

beforeEach(() => {
  flags.newsletter = true;
  resolveMagnetDownload.mockReset();
});

describe("GET /api/download", () => {
  it("redirects a valid token to the file", async () => {
    resolveMagnetDownload.mockResolvedValueOnce({ ok: true, url: FILE });
    const res = await get("?token=good");
    expect(resolveMagnetDownload).toHaveBeenCalledWith("good");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(FILE);
  });

  it("a bad or missing token is a 403 that never reveals the file URL", async () => {
    resolveMagnetDownload.mockResolvedValue({ ok: false });
    for (const qs of ["?token=tampered", ""]) {
      const res = await get(qs);
      expect(res.status).toBe(403);
      expect(res.headers.get("location")).toBeNull();
      expect(await res.text()).not.toContain("cdn.example.com");
    }
    expect(resolveMagnetDownload).toHaveBeenLastCalledWith("");
  });

  it("is a 404 with the newsletter flag off", async () => {
    flags.newsletter = false;
    expect((await get("?token=good")).status).toBe(404);
    expect(resolveMagnetDownload).not.toHaveBeenCalled();
  });
});
