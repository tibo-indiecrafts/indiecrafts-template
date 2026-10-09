// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const RESEND_KEY = "re_test_secret_never_shown";
const flags = vi.hoisted(() => ({ studio: true }));
const sendEmail = vi.hoisted(() => vi.fn(async (_message: unknown) => {}));
const CONTACT_ONLY = {
  contactConfirm: { enabled: true, from: "Site <hello@site.test>" },
};
const strings = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
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
vi.mock("@indiecrafts/packages-web-sanity/env", () => ({ projectId: "proj" }));
// next-intl's navigation can't resolve `next/navigation` under vitest's Node ESM loader.
vi.mock("@/i18n/routing", () => ({
  localizedPathname: (path: string, locale: string) => `/${locale}${path}`,
}));
vi.mock("@indiecrafts/packages-web-email", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@indiecrafts/packages-web-email")>()),
  sendEmail,
}));
// The real module reads Sanity — replace it whole. One enabled email → one sample.
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  pick: () => "",
  getEmailStrings: async () => strings.value,
}));

const { POST } = await import("./route");
const post = (body: string, bearer = "editor-token") =>
  POST(
    new Request("https://x.test/api/emails/test", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${bearer}` },
      body,
    }),
  );
// Sanity's `users/me`: a member of this project answers with an id.
const sanityUsersMe = vi.fn(async (_url: string, init?: RequestInit) => {
  const auth = new Headers(init?.headers).get("authorization");
  return auth === "Bearer editor-token"
    ? Response.json({ id: "u1" })
    : new Response(null, { status: 401 });
});

beforeEach(() => {
  strings.value = CONTACT_ONLY;
  flags.studio = true;
  sendEmail.mockClear();
  sanityUsersMe.mockClear();
  vi.stubGlobal("fetch", sanityUsersMe);
  vi.stubEnv("RESEND_API_KEY", RESEND_KEY);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/emails/test", () => {
  it("sends each enabled sample ONLY to the given address; the key never leaves the server", async () => {
    const res = await post(JSON.stringify({ to: "me@site.test" }));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({
      results: [
        { label: "contactConfirm · en", ok: true },
        { label: "contactConfirm · fr", ok: true },
      ],
    });
    expect(text).not.toContain(RESEND_KEY);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: ["me@site.test"] }),
    );
    expect(sanityUsersMe.mock.calls[0]?.[0]).toBe(
      "https://proj.api.sanity.io/v1/users/me",
    );
  });

  it("samples the lead-magnet confirmation with its own words, not the newsletter's", async () => {
    strings.value = {
      newsletterConfirm: { enabled: true, from: "Site <hello@site.test>" },
    };
    const res = await post(JSON.stringify({ to: "me@site.test" }));
    const { results } = (await res.json()) as { results: { label: string }[] };
    const labels = results.map((r) => r.label);
    expect(labels).toContain("leadMagnetConfirm · en");
    const subjects = sendEmail.mock.calls.map(
      (c) => (c[0] as { subject: string }).subject,
    );
    expect(subjects).toContain("Confirm your request");
    expect(subjects).toContain("Confirmez votre demande");
  });

  it("sends a visitor email in each language and an owner alert once, all with the support line", async () => {
    strings.value = {
      ...CONTACT_ONLY,
      contactOwner: {
        enabled: true,
        from: "Site <hello@site.test>",
        to: ["team@site.test"],
      },
      supportEmail: "help@site.test",
    };
    const res = await post(JSON.stringify({ to: "me@site.test" }));
    const { results } = (await res.json()) as { results: { label: string }[] };
    expect(results.map((r) => r.label)).toEqual([
      "contactOwner",
      "contactConfirm · en",
      "contactConfirm · fr",
    ]);
    const sent = sendEmail.mock.calls.map(
      (c) => c[0] as { subject: string; text: string; html: string },
    );
    expect(sent[1]?.subject).toBe("We received your message");
    expect(sent[1]?.html).toContain('<html lang="en">');
    expect(sent[2]?.subject).toBe("Nous avons bien reçu votre message");
    expect(sent[2]?.html).toContain('<html lang="fr">');
    expect(sent[2]?.text).toContain("Besoin d'aide ? help@site.test");
    for (const mail of sent) {
      expect(mail.html).toContain("mailto:help@site.test");
      expect(mail.text).toContain("help@site.test");
    }
  });

  it("reports a failed send and still sends the rest, one at a time", async () => {
    sendEmail.mockRejectedValueOnce(new Error("429"));
    const res = await post(JSON.stringify({ to: "me@site.test" }));
    expect(await res.json()).toEqual({
      results: [
        { label: "contactConfirm · en", ok: false },
        { label: "contactConfirm · fr", ok: true },
      ],
    });
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("is a 401 without a Bearer token or for a non-member, and sends nothing", async () => {
    for (const res of [
      await post(JSON.stringify({ to: "me@site.test" }), ""),
      await post(JSON.stringify({ to: "me@site.test" }), "stranger"),
    ]) {
      expect(res.status).toBe(401);
    }
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects an oversize (413), malformed or bad-address (400) body", async () => {
    expect((await post(JSON.stringify({ to: "x".repeat(2100) }))).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect((await post(JSON.stringify({ to: "nope" }))).status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("is a 503 with no RESEND_API_KEY, and a 404 with the Studio off", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await post(JSON.stringify({ to: "me@site.test" }))).status).toBe(503);
    flags.studio = false;
    expect((await post(JSON.stringify({ to: "me@site.test" }))).status).toBe(404);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
