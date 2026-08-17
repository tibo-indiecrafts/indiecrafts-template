import { describe, expect, it } from "vitest";

import { resolveGatedDownload } from "./index";
import { signDownloadToken, verifyDownloadToken } from "./token";

const SECRET = "test-download-secret-do-not-use-in-prod";
const NOW = 1_700_000_000_000;
const EXP = NOW + 60_000; // valid until one minute after NOW

describe("signDownloadToken / verifyDownloadToken", () => {
  it("round-trips: verify returns the assetId", async () => {
    const token = await signDownloadToken({ assetId: "asset-123", exp: EXP }, SECRET);
    expect(await verifyDownloadToken(token, SECRET, NOW)).toEqual({ assetId: "asset-123" });
  });

  it("rejects a tampered token", async () => {
    const token = await signDownloadToken({ assetId: "asset-123", exp: EXP }, SECRET);
    const flip = token[0] === "a" ? "b" : "a";
    const tampered = flip + token.slice(1);
    expect(await verifyDownloadToken(tampered, SECRET, NOW)).toBeNull();
  });

  it("rejects a wrong secret", async () => {
    const token = await signDownloadToken({ assetId: "asset-123", exp: EXP }, SECRET);
    expect(await verifyDownloadToken(token, "wrong-secret", NOW)).toBeNull();
  });

  it("rejects an expired token (now at/after exp)", async () => {
    const token = await signDownloadToken({ assetId: "asset-123", exp: EXP }, SECRET);
    expect(await verifyDownloadToken(token, SECRET, EXP)).toBeNull(); // boundary: exp is not > now
    expect(await verifyDownloadToken(token, SECRET, EXP + 1)).toBeNull();
  });

  it("returns null (never throws) on malformed input", async () => {
    for (const bad of ["", "nodot", "a.b", "!!!.@@@"]) {
      expect(await verifyDownloadToken(bad, SECRET, NOW)).toBeNull();
    }
  });
});

describe("resolveGatedDownload", () => {
  it("resolves the url on a valid token", async () => {
    const token = await signDownloadToken({ assetId: "asset-9", exp: EXP }, SECRET);
    const res = await resolveGatedDownload(token, SECRET, (id) => `https://cdn.example/${id}.pdf`, NOW);
    expect(res).toEqual({ ok: true, url: "https://cdn.example/asset-9.pdf" });
  });

  it("returns 403 on a bad token", async () => {
    const res = await resolveGatedDownload("nope", SECRET, () => "https://cdn.example/x.pdf", NOW);
    expect(res).toEqual({ ok: false, status: 403 });
  });

  it("returns 403 when the resolver finds no url", async () => {
    const token = await signDownloadToken({ assetId: "gone", exp: EXP }, SECRET);
    const res = await resolveGatedDownload(token, SECRET, () => null, NOW);
    expect(res).toEqual({ ok: false, status: 403 });
  });
});
