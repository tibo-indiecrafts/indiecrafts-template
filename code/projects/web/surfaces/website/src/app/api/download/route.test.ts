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
const FILE = "https://cdn.sanity.io/files/p1/production/abc.pdf";
const upstream = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", upstream);

beforeEach(() => {
  flags.newsletter = true;
  resolveMagnetDownload.mockReset();
  upstream.mockReset();
});

describe("GET /api/download", () => {
  it("streams the file for a valid token, never revealing its URL", async () => {
    resolveMagnetDownload.mockResolvedValueOnce({ ok: true, url: FILE });
    upstream.mockResolvedValueOnce(
      new Response("PDF-BYTES", {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": 'attachment; filename="guide.pdf"',
        },
      }),
    );
    const res = await get("?token=good");
    expect(resolveMagnetDownload).toHaveBeenCalledWith("good");
    expect(upstream).toHaveBeenCalledWith(`${FILE}?dl=`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("PDF-BYTES");
    expect(res.headers.get("location")).toBeNull(); // the CDN URL never reaches the visitor
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toBe(
      'attachment; filename="guide.pdf"',
    );
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });

  it("fetches only from Sanity's file CDN", async () => {
    resolveMagnetDownload.mockResolvedValueOnce({
      ok: true,
      url: "https://evil.test/x.pdf",
    });
    expect((await get("?token=good")).status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("is a 502 when the CDN fails", async () => {
    resolveMagnetDownload.mockResolvedValueOnce({ ok: true, url: FILE });
    upstream.mockResolvedValueOnce(new Response("nope", { status: 404 }));
    const res = await get("?token=good");
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain("cdn.sanity.io");
  });

  it("a bad or missing token is a 403 that never reveals the file URL", async () => {
    resolveMagnetDownload.mockResolvedValue({ ok: false });
    for (const qs of ["?token=tampered", ""]) {
      const res = await get(qs);
      expect(res.status).toBe(403);
      expect(res.headers.get("location")).toBeNull();
      expect(await res.text()).not.toContain("cdn.sanity.io");
    }
    expect(resolveMagnetDownload).toHaveBeenLastCalledWith("");
  });

  it("is a 404 with the newsletter flag off", async () => {
    flags.newsletter = false;
    expect((await get("?token=good")).status).toBe(404);
    expect(resolveMagnetDownload).not.toHaveBeenCalled();
  });
});
