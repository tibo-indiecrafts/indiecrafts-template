import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchBrand, pngSize, splashUrl } from "./brand.mjs";

const ok = (body) => async () => ({ ok: true, json: async () => body });
const cfg = { projectId: "p", dataset: "production" };

test("fetchBrand reads the configured logo (and the optional dark one) from Sanity", async () => {
  assert.deepEqual(
    await fetchBrand(cfg, ok({ result: { logo: "L", logoDark: "D" } })),
    {
      logo: "L",
      logoDark: "D",
    },
  );
  assert.deepEqual(await fetchBrand(cfg, ok({ result: { logo: "L" } })), {
    logo: "L",
    logoDark: null,
  });
});

test("fetchBrand is null — never throws — without config, logo, or network", async () => {
  assert.equal(await fetchBrand({ projectId: "", dataset: "x" }, ok({})), null);
  assert.equal(await fetchBrand(cfg, ok({ result: { logo: null } })), null);
  assert.equal(await fetchBrand(cfg, async () => ({ ok: false })), null);
  assert.equal(
    await fetchBrand(cfg, async () => {
      throw new Error("offline");
    }),
    null,
  );
});

test("splashUrl centres the logo at 18% of the visible short side, exact size, PNG", () => {
  const u = new URL(
    splashUrl("https://cdn.sanity.io/images/p/d/a.png", 480, 800),
  );
  assert.equal(u.searchParams.get("w"), "480");
  assert.equal(u.searchParams.get("h"), "800");
  assert.equal(u.searchParams.get("fit"), "fill");
  assert.equal(u.searchParams.get("fm"), "png");
  // logo = 480 − 2×197 = 86 ≈ 18% of 480
  assert.equal(u.searchParams.get("pad"), "197");
});

test("a square (iOS) splash shrinks the logo: a portrait phone shows only ~46% of its width", () => {
  const pad = Number(
    new URL(
      splashUrl("https://cdn.sanity.io/images/p/d/a.png", 2732, 2732),
    ).searchParams.get("pad"),
  );
  const logo = 2732 - 2 * pad; // ≈ 227px of the square ≈ 18% of the ~1261px that shows
  assert.ok(Math.abs(logo / (2732 * (9 / 19.5)) - 0.18) < 0.01, String(logo));
});

test("pngSize reads the header; refuses a non-PNG", () => {
  const png = Buffer.alloc(24);
  png.writeUInt32BE(0x89504e47, 0);
  png.writeUInt32BE(320, 16);
  png.writeUInt32BE(480, 20);
  assert.deepEqual(pngSize(png), { w: 320, h: 480 });
  assert.throws(() => pngSize(Buffer.alloc(24)), /not a PNG/);
});
