import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  session: { userId: "user_2abcADMIN000000001", sessionClaims: { metadata: { role: "admin" } } } as {
    userId: string | null;
    sessionClaims: unknown;
  },
  apiFetch: vi.fn(),
  audit: vi.fn(),
  revoke: vi.fn(async () => ({ revoked: 2, total: 2 })),
  getUser: vi.fn(),
  createEmailAddress: vi.fn(),
  deleteEmailAddress: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => m.session,
  clerkClient: async () => ({
    users: { getUser: m.getUser },
    emailAddresses: {
      createEmailAddress: m.createEmailAddress,
      deleteEmailAddress: m.deleteEmailAddress,
    },
  }),
}));
vi.mock("@indiecrafts/packages-shared-utils/api-fetch", () => ({ apiFetch: m.apiFetch }));
vi.mock("@/lib/audit", () => ({ audit: m.audit }));
vi.mock("@/lib/clerk-sessions", () => ({ revokeActiveSessions: m.revoke }));

const { turnOffEmails, changeSignInEmail } = await import("./email-actions");
const USER = "user_2abcTARGET00000001";
const ADMIN = "user_2abcADMIN000000001";
const body = () => JSON.parse(String(m.apiFetch.mock.calls[0]?.[1]?.body));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.API_URL = "https://api.x";
  process.env.APP_API_TOKEN = "tok";
  m.session = { userId: ADMIN, sessionClaims: { metadata: { role: "admin" } } };
  m.apiFetch.mockResolvedValue(Response.json({ ok: true, resend: "ok" }));
  m.getUser.mockResolvedValue({
    publicMetadata: {},
    primaryEmailAddressId: "idn_old",
    emailAddresses: [{ id: "idn_old", emailAddress: "Old@x.com" }],
  });
});

describe("turnOffEmails — off only, by an admin, with a reason", () => {
  it("sends the categories, the reason and the acting admin", async () => {
    expect(
      await turnOffEmails({ userId: USER, off: ["news"], stopAll: false, reason: "request_email" }),
    ).toEqual({ ok: true, resend: "ok" });
    expect(m.apiFetch.mock.calls[0]?.[0]).toBe("https://api.x/v1/admin/email-preferences");
    expect(body()).toEqual({
      userId: USER,
      off: ["news"],
      stopAll: false,
      reason: "request_email",
      actorUserId: ADMIN,
    });
  });

  it("refuses a non-admin, a bad reason, nothing to do, or a bad key — before the api", async () => {
    m.session = { userId: "user_2abcSOMEONE0000001", sessionClaims: {} };
    expect(await turnOffEmails({ userId: USER, off: ["news"], stopAll: false, reason: "other" })).toEqual({
      ok: false,
      error: "forbidden",
    });
    m.session = { userId: ADMIN, sessionClaims: { metadata: { role: "admin" } } };
    for (const input of [
      { userId: USER, off: ["news"], stopAll: false, reason: "because" },
      { userId: USER, off: [], stopAll: false, reason: "other" },
      { userId: USER, off: ["News!"], stopAll: false, reason: "other" },
      { email: "not-an-email", off: ["news"], stopAll: false, reason: "other" },
    ])
      expect(await turnOffEmails(input)).toEqual({ ok: false, error: "invalid" });
    expect(m.apiFetch).not.toHaveBeenCalled();
  });

  it("says when the api is unreachable", async () => {
    delete process.env.API_URL;
    expect(
      await turnOffEmails({ email: "a@x.com", off: [], stopAll: true, reason: "complaint" }),
    ).toEqual({ ok: false, error: "unreachable" });
  });
});

describe("changeSignInEmail — a login path", () => {
  const input = { userId: USER, email: "New@x.com", confirm: "new@x.com ", reason: "request_phone" };

  it("adds the new address verified + primary, removes the old, signs out, moves the contact", async () => {
    m.apiFetch.mockResolvedValue(Response.json({ ok: true, resend: "moved" }));
    expect(await changeSignInEmail(input)).toEqual({ ok: true, resend: "moved" });
    expect(m.createEmailAddress).toHaveBeenCalledWith({
      userId: USER,
      emailAddress: "new@x.com",
      verified: true,
      primary: true,
    });
    expect(m.deleteEmailAddress).toHaveBeenCalledWith("idn_old");
    expect(m.revoke).toHaveBeenCalledWith(expect.anything(), USER);
    expect(body()).toEqual({
      userId: USER,
      from: "old@x.com",
      to: "new@x.com",
      reason: "request_phone",
      actorUserId: ADMIN,
    });
  });

  it("refuses a mismatch, the same address, an admin's account, a taken address", async () => {
    expect(await changeSignInEmail({ ...input, confirm: "other@x.com" })).toEqual({
      ok: false,
      error: "mismatch",
    });
    expect(await changeSignInEmail({ ...input, email: "old@x.com", confirm: "old@x.com" })).toEqual({
      ok: false,
      error: "same",
    });
    m.getUser.mockResolvedValueOnce({
      publicMetadata: { role: "admin" },
      primaryEmailAddressId: "idn_old",
      emailAddresses: [{ id: "idn_old", emailAddress: "boss@x.com" }],
    });
    expect(await changeSignInEmail(input)).toEqual({ ok: false, error: "admin_target" });
    m.createEmailAddress.mockRejectedValueOnce(new Error("form_identifier_exists"));
    expect(await changeSignInEmail(input)).toEqual({ ok: false, error: "taken" });
    expect(m.deleteEmailAddress).not.toHaveBeenCalled();
    expect(m.revoke).not.toHaveBeenCalled();
  });

  it("the Clerk change stands when the api is down — audited anyway", async () => {
    delete process.env.API_URL;
    expect(await changeSignInEmail(input)).toEqual({ ok: true, resend: "unreachable" });
    expect(m.audit).toHaveBeenCalledWith("admin.change_email", { actor: ADMIN, target: USER });
  });
});
