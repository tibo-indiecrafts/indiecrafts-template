// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { signDownloadToken } from "@indiecrafts/packages-shared-gated-delivery";

const SECRET = "test-newsletter-secret";
const fetch = vi.hoisted(() => vi.fn());
const sendEmail = vi.hoisted(() => vi.fn(async () => undefined));
const strings = vi.hoisted(() => ({
  value: { newsletterConfirm: { from: "hi@site.test" } } as Record<
    string,
    unknown
  >,
}));
vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch },
}));
vi.mock("@indiecrafts/packages-web-email", () => ({
  sendEmail,
  // The html is just `<html lang>`, so a test can check the recipient's language reached the layout.
  renderEmail: (e: { subject: string; text: string; lang?: string }) => ({
    subject: e.subject,
    text: e.text,
    html: `<html lang="${e.lang}">`,
  }),
  escapeHtml: (s: string) => s,
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings: async () => strings.value,
  pick: () => "",
  // Mirrors the brick: the support address when the group opts in.
  supportCopy: (c: { copySupport?: boolean } | null | undefined, s?: string) =>
    c?.copySupport && s ? [s] : [],
}));

/** Stub the env for one test, then import the module. */
async function load(secret?: string) {
  vi.resetModules();
  vi.stubEnv("NEWSLETTER_SECRET", secret ?? "");
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
  it("refuses every token while NEWSLETTER_SECRET is unset (delivery off)", async () => {
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

  it("honours the group's own bcc and reply-to, and the support copy", async () => {
    strings.value = {
      newsletterConfirm: { from: "hi@site.test" },
      supportEmail: "help@site.test",
      leadMagnet: {
        bcc: ["me@site.test"],
        replyTo: "team@site.test",
        copySupport: true,
      },
    };
    const { deliverMagnetsForTags } = await load(SECRET);
    fetch.mockResolvedValueOnce({ _id: "magnet.1", title: "Guide" });
    await deliverMagnetsForTags("a@b.com", ["magnet.1"], "en");
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        bcc: ["me@site.test", "help@site.test"],
        replyTo: "team@site.test",
      }),
    );
    strings.value = { newsletterConfirm: { from: "hi@site.test" } };
  });

  it.each([
    ["fr", "Votre document est prêt", "fr"],
    ["de", "Your download is ready", "en"], // not a site locale → the default (en)
  ])(
    "a %s request gets the delivery email in its language",
    async (language, subject, lang) => {
      const { deliverMagnetsForTags } = await load(SECRET);
      fetch.mockResolvedValueOnce({ _id: "magnet.1", title: "Guide" });
      await deliverMagnetsForTags("a@b.com", ["magnet.1"], language);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ subject, html: `<html lang="${lang}">` }),
      );
    },
  );
});
