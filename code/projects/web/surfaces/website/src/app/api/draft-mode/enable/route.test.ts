// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const SECRET = "sk-read-token-never-shown";
const state = vi.hoisted(() => ({
  studio: true,
  token: undefined as string | undefined,
}));
const handlerGet = vi.hoisted(() =>
  vi.fn(async (_req: Request) => new Response(null, { status: 307 })),
);
vi.mock("next-sanity/draft-mode", () => ({
  defineEnableDraftMode: () => ({ GET: handlerGet }),
}));
vi.mock("@indiecrafts/packages-web-sanity/client", () => ({
  client: { withConfig: () => ({}) },
}));
vi.mock("@indiecrafts/packages-web-sanity/token", () => ({
  get token() {
    return state.token;
  },
}));
vi.mock("@/config", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/config")>();
  return {
    ...real,
    features: {
      ...real.features,
      get studio() {
        return state.studio;
      },
    },
  };
});

// The route builds its handler once at import, from the token — re-import per token state.
const load = async (token: string | undefined) => {
  state.token = token;
  vi.resetModules();
  return (await import("./route")).GET;
};
const req = () =>
  new Request("https://x.test/api/draft-mode/enable?sanity-preview-secret=s");

beforeEach(() => {
  state.studio = true;
  handlerGet.mockClear();
});

describe("GET /api/draft-mode/enable", () => {
  it("hands the request to next-sanity when the read token is set", async () => {
    const GET = await load(SECRET);
    const r = req();
    expect((await GET(r)).status).toBe(307);
    expect(handlerGet).toHaveBeenCalledWith(r);
  });

  it("is a 503 naming the missing env var (not a 500) when the token is unset", async () => {
    const GET = await load(undefined);
    const res = await GET(req());
    expect(res.status).toBe(503);
    expect(await res.text()).toContain("SANITY_API_READ_TOKEN");
    expect(handlerGet).not.toHaveBeenCalled();
  });

  it("is a 404 with the Studio off, and never echoes the token", async () => {
    state.studio = false;
    const GET = await load(SECRET);
    const res = await GET(req());
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain(SECRET);
    expect(handlerGet).not.toHaveBeenCalled();
  });
});
