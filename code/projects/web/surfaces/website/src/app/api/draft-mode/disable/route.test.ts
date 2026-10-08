// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ studio: true }));
const disable = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({ draftMode: async () => ({ disable }) }));
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      get studio() {
        return flags.studio;
      },
    },
  };
});

const { GET } = await import("./route");

beforeEach(() => {
  flags.studio = true;
  disable.mockClear();
});

describe("GET /api/draft-mode/disable", () => {
  it("leaves draft mode and sends the visitor home on the same origin", async () => {
    const res = await GET(new Request("https://x.test/api/draft-mode/disable"));
    expect(disable).toHaveBeenCalledOnce();
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://x.test/");
  });

  it("is a 404 with the Studio off", async () => {
    flags.studio = false;
    const res = await GET(new Request("https://x.test/api/draft-mode/disable"));
    expect(res.status).toBe(404);
    expect(disable).not.toHaveBeenCalled();
  });
});
