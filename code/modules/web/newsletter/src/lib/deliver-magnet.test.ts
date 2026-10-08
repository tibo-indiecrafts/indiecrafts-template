// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { signDownloadToken } from "@indiecrafts/packages-shared-gated-delivery";

const SECRET = "test-lead-magnet-secret";
const fetch = vi.hoisted(() => vi.fn());
const sendEmail = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch },
}));
vi.mock("@indiecrafts/packages-web-email", () => ({
  sendEmail,
  renderEmailLayout: () => "",
  escapeHtml: (s: string) => s,
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings: async () => ({
    newsletterConfirm: { from: "hi@site.test" },
  }),
  pick: () => "",
}));

/** The module reads LEAD_MAGNET_SECRET at load: import it fresh per env. */
async function load(secret?: string) {
  vi.resetModules();
  vi.stubEnv("LEAD_MAGNET_SECRET", secret ?? "");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  return import("./deliver-magnet");
}
const token = (assetId: string, exp: number) =>
  signDownloadToken({ assetId, exp }, SECRET);

afterEach(() => {
  vi.unstubAllEnvs();
  fetch.mockReset();
  sendEmail.mockClear();
});

describe("resolveMagnetDownload", () => {
  it("refuses every token while LEAD_MAGNET_SECRET is unset (delivery off)", async () => {
    const { resolveMagnetDownload } = await load();
    expect(
      await resolveMagnetDownload(await token("magnet.1", Date.now() + 60_000)),
    ).toEqual({
      ok: false,
      status: 403,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("resolves a valid token to the file URL, only after verifying it", async () => {
    const { resolveMagnetDownload } = await load(SECRET);
    fetch.mockResolvedValueOnce("https://cdn.sanity.io/files/x/guide.pdf");
    expect(
      await resolveMagnetDownload(await token("magnet.1", Date.now() + 60_000)),
    ).toEqual({
      ok: true,
      url: "https://cdn.sanity.io/files/x/guide.pdf",
    });
    expect(fetch.mock.calls[0]?.[1]).toEqual({ id: "magnet.1" });
  });

  it("refuses a tampered or expired token without looking the file up", async () => {
    const { resolveMagnetDownload } = await load(SECRET);
    const good = await token("magnet.1", Date.now() + 60_000);
    const forged = await signDownloadToken(
      { assetId: "magnet.1", exp: Date.now() + 60_000 },
      "wrong-secret",
    );
    const expired = await token("magnet.1", Date.now() - 1);
    for (const t of [`${good}x`, forged, expired, "garbage", ""]) {
      expect((await resolveMagnetDownload(t)).ok, t).toBe(false);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("deliverMagnetsForTags", () => {
  it("sends nothing without the secret, even for a real magnet tag", async () => {
    const { deliverMagnetsForTags } = await load();
    await deliverMagnetsForTags("a@b.com", ["magnet.1"], "en");
    expect(fetch).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("emails a signed link for a magnet tag and skips a tag that is not a magnet", async () => {
    const { deliverMagnetsForTags } = await load(SECRET);
    fetch
      .mockResolvedValueOnce({ _id: "magnet.1", title: "Guide" })
      .mockResolvedValueOnce(null);
    await deliverMagnetsForTags("a@b.com", ["magnet.1", "not-a-magnet"], "en");
    expect(sendEmail).toHaveBeenCalledOnce();
    const sent = JSON.stringify(sendEmail.mock.calls[0]);
    expect(sent).toContain("/api/download?token=");
  });
});
