import { afterEach, describe, expect, it, vi } from "vitest";

// Crown-jewel server actions: every mutating path must (1) fail closed for a
// non-admin caller — no Clerk write, no audit row — and (2) reject a malformed
// target id before touching Clerk. Mocks Clerk (`auth`/`clerkClient`), the audit
// sink, and `fetch` (for `saveSetting`), following the repo's `vi.hoisted` +
// dynamic-import convention (see `modules/web/contact/src/lib/contact.test.ts`).
const {
  authMock,
  updateUserMetadata,
  getSessionList,
  revokeSessionApi,
  clerkClientMock,
  auditMock,
  fetchMock,
} = vi.hoisted(() => {
  const authMock = vi.fn();
  const updateUserMetadata = vi.fn(async () => ({}));
  const getSessionList = vi.fn(async () => ({ data: [] as { id: string }[] }));
  const revokeSessionApi = vi.fn(async () => ({}));
  const clerkClientMock = vi.fn(async () => ({
    users: { updateUserMetadata },
    sessions: { getSessionList, revokeSession: revokeSessionApi },
  }));
  const auditMock = vi.fn(async () => undefined);
  const fetchMock = vi.fn();
  return {
    authMock,
    updateUserMetadata,
    getSessionList,
    revokeSessionApi,
    clerkClientMock,
    auditMock,
    fetchMock,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
  clerkClient: clerkClientMock,
}));
vi.mock("@/lib/audit", () => ({ audit: auditMock }));
vi.stubGlobal("fetch", fetchMock);

const {
  grantAdmin,
  revokeAdmin,
  revokeSession,
  revokeUserSessions,
  listUserSessions,
  saveSetting,
} = await import("./actions");

const ADMIN_ID = "user_admin1";
const TARGET_ID = "user_target1";
const admin = { userId: ADMIN_ID, sessionClaims: { metadata: { role: "admin" } } };
const noSession = { userId: null, sessionClaims: null };
const nonAdmin = { userId: "user_bob1", sessionClaims: { metadata: { role: undefined } } };

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("grantAdmin", () => {
  it("fails closed for no session — no mutation, no audit", async () => {
    authMock.mockResolvedValueOnce(noSession);
    expect(await grantAdmin(TARGET_ID)).toEqual({ ok: false, error: "forbidden" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("fails closed for a non-admin session — no mutation, no audit", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await grantAdmin(TARGET_ID)).toEqual({ ok: false, error: "forbidden" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed target id before any mutation", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await grantAdmin("not-a-user-id")).toEqual({ ok: false, error: "invalid_user" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("grants the role and audits, for an admin caller with a valid id", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await grantAdmin(TARGET_ID)).toEqual({ ok: true });
    expect(updateUserMetadata).toHaveBeenCalledWith(TARGET_ID, {
      publicMetadata: { role: "admin" },
    });
    expect(auditMock).toHaveBeenCalledWith("admin.grant", {
      actor: ADMIN_ID,
      target: TARGET_ID,
    });
  });
});

describe("revokeAdmin", () => {
  it("fails closed for a non-admin session — no mutation, no audit", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await revokeAdmin(TARGET_ID)).toEqual({ ok: false, error: "forbidden" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed target id before any mutation", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await revokeAdmin("not-a-user-id")).toEqual({ ok: false, error: "invalid_user" });
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("clears the role, revokes live sessions, and audits", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockResolvedValueOnce({ data: [{ id: "sess_1" }, { id: "sess_2" }] });
    expect(await revokeAdmin(TARGET_ID)).toEqual({ ok: true });
    expect(updateUserMetadata).toHaveBeenCalledWith(TARGET_ID, {
      publicMetadata: { role: null },
    });
    // Clerk pages at 10 by default — ask for the max so no session is left signed in.
    expect(getSessionList).toHaveBeenCalledWith({ userId: TARGET_ID, status: "active", limit: 500 });
    expect(revokeSessionApi).toHaveBeenCalledWith("sess_1");
    expect(revokeSessionApi).toHaveBeenCalledWith("sess_2");
    expect(auditMock).toHaveBeenCalledWith("admin.revoke", {
      actor: ADMIN_ID,
      target: TARGET_ID,
    });
  });

  it("still audits the demotion when revoking the live sessions fails", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockRejectedValueOnce(new Error("clerk down"));
    expect(await revokeAdmin(TARGET_ID)).toEqual({ ok: false, error: "failed" });
    // The role is already cleared — that privilege change must never go unrecorded.
    expect(auditMock).toHaveBeenCalledWith("admin.revoke", {
      actor: ADMIN_ID,
      target: TARGET_ID,
    });
  });
});

describe("revokeSession", () => {
  const SESSION_ID = "sess_abc123";

  it("fails closed for a non-admin session — no mutation, no audit", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await revokeSession(SESSION_ID)).toEqual({ ok: false, error: "forbidden" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed session id before any mutation", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await revokeSession("not-a-session-id")).toEqual({
      ok: false,
      error: "invalid_session",
    });
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("revokes the session and audits, for an admin caller", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await revokeSession(SESSION_ID)).toEqual({ ok: true });
    expect(revokeSessionApi).toHaveBeenCalledWith(SESSION_ID);
    expect(auditMock).toHaveBeenCalledWith("admin.revoke_session", {
      actor: ADMIN_ID,
      target: SESSION_ID,
    });
  });
});

describe("revokeUserSessions", () => {
  it("fails closed for a non-admin session — no mutation, no audit", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await revokeUserSessions(TARGET_ID)).toEqual({ ok: false, error: "forbidden" });
    expect(clerkClientMock).not.toHaveBeenCalled();
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed target id before any mutation", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await revokeUserSessions("not-a-user-id")).toEqual({
      ok: false,
      error: "invalid_user",
    });
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("revokes every active session and audits", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockResolvedValueOnce({ data: [{ id: "sess_1" }, { id: "sess_2" }] });
    expect(await revokeUserSessions(TARGET_ID)).toEqual({ ok: true });
    // Clerk pages at 10 by default — ask for the max so no session is left signed in.
    expect(getSessionList).toHaveBeenCalledWith({ userId: TARGET_ID, status: "active", limit: 500 });
    expect(revokeSessionApi).toHaveBeenCalledWith("sess_1");
    expect(revokeSessionApi).toHaveBeenCalledWith("sess_2");
    expect(auditMock).toHaveBeenCalledWith("admin.revoke_user_sessions", {
      actor: ADMIN_ID,
      target: TARGET_ID,
    });
  });

  it("tries every session and audits when one revoke fails", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockResolvedValueOnce({ data: [{ id: "sess_1" }, { id: "sess_2" }] });
    revokeSessionApi.mockRejectedValueOnce(new Error("clerk 500"));
    expect(await revokeUserSessions(TARGET_ID)).toEqual({ ok: false, error: "failed" });
    expect(revokeSessionApi).toHaveBeenCalledWith("sess_2");
    expect(auditMock).toHaveBeenCalledWith("admin.revoke_user_sessions", {
      actor: ADMIN_ID,
      target: TARGET_ID,
    });
  });
});

describe("revokeUserSessions — nothing revoked", () => {
  it("does not audit when every revoke fails", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockResolvedValueOnce({ data: [{ id: "sess_1" }] });
    revokeSessionApi.mockRejectedValueOnce(new Error("clerk 500"));
    expect(await revokeUserSessions(TARGET_ID)).toEqual({ ok: false, error: "failed" });
    expect(auditMock).not.toHaveBeenCalled();
  });

  it("does not audit when the user has no live session", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await revokeUserSessions(TARGET_ID)).toEqual({ ok: true });
    expect(auditMock).not.toHaveBeenCalled();
  });
});

describe("listUserSessions", () => {
  it("returns nothing for a non-admin, without calling Clerk", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await listUserSessions(TARGET_ID)).toEqual([]);
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed user id without calling Clerk", async () => {
    authMock.mockResolvedValueOnce(admin);
    expect(await listUserSessions("not-a-user-id")).toEqual([]);
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("maps live sessions to the minimal admin view", async () => {
    authMock.mockResolvedValueOnce(admin);
    getSessionList.mockResolvedValueOnce({
      data: [
        {
          id: "sess_1",
          lastActiveAt: 1,
          latestActivity: { deviceType: "Mac", browserName: "Firefox", city: "Lyon", country: "FR", ipAddress: "203.0.113.7" },
        },
      ],
    } as never);
    expect(await listUserSessions(TARGET_ID)).toEqual([
      { id: "sess_1", lastActiveAt: 1, device: "Mac", browser: "Firefox", location: "Lyon, FR" },
    ]);
  });
});

describe("saveSetting", () => {
  it("fails closed for a non-admin session — no request sent", async () => {
    authMock.mockResolvedValueOnce(nonAdmin);
    expect(await saveSetting("maxItems", 10)).toEqual({ ok: false, error: "forbidden" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards the key/value/actor with a bearer token, for an admin caller", async () => {
    vi.stubEnv("API_URL", "https://api.example.com");
    vi.stubEnv("APP_API_TOKEN", "secret-token");
    authMock.mockResolvedValueOnce(admin);
    fetchMock.mockResolvedValueOnce({ ok: true });
    expect(await saveSetting("maxItems", 10)).toEqual({ ok: true });
    // apiFetch also passes a timeout signal — assert the parts this action owns.
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/v1/settings",
      expect.objectContaining({
        method: "PUT",
        headers: {
          authorization: "Bearer secret-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({ key: "maxItems", value: 10, actor: ADMIN_ID }),
      }),
    );
  });

  it("returns failed when the api rejects the write", async () => {
    vi.stubEnv("API_URL", "https://api.example.com");
    vi.stubEnv("APP_API_TOKEN", "secret-token");
    authMock.mockResolvedValueOnce(admin);
    fetchMock.mockResolvedValueOnce({ ok: false });
    expect(await saveSetting("maxItems", 10)).toEqual({ ok: false, error: "failed" });
  });
});
