import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";

const SALT = "test-override-salt";
const ADMIN = "user_admin0000001";
const NOT_ADMIN = "user_plain0000001";
afterEach(() => vi.unstubAllGlobals());

type Call = { url: string; method: string; body: unknown };
type Contact = "missing" | { unsubscribed: boolean };
type Topic = { id: string; subscription: string };

/** Sanity (two categories) + Resend, routed by URL and by address. Records every Resend call. */
function stubFetch(
  opts: {
    contacts?: Record<string, Contact>;
    topics?: Record<string, Topic[] | "error">;
    resendStatus?: number;
  } = {},
) {
  const calls: Call[] = [];
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = String(input);
      const method = init.method ?? "GET";
      if (url.includes("sanity.io"))
        return reply({
          result: {
            categories: [
              { key: "news", name: { en: "News" }, resendTopicId: "t_news" },
              {
                key: "general",
                name: { en: "General" },
                resendTopicId: "t_gen",
              },
            ],
          },
        });
      const path = url.replace("https://api.resend.com", "");
      calls.push({
        url: path,
        method,
        body: init.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (opts.resendStatus && method !== "GET")
        return reply({}, opts.resendStatus);
      const email = decodeURIComponent(path.split("/")[2] ?? "");
      if (method === "GET" && /^\/contacts\/[^/]+$/.test(path)) {
        const c = opts.contacts?.[email] ?? { unsubscribed: false };
        return c === "missing" ? reply({}, 404) : reply(c);
      }
      if (method === "GET" && path.includes("/topics")) {
        const t = opts.topics?.[email] ?? [];
        return t === "error" ? reply({}, 500) : reply({ data: t });
      }
      if (method === "GET" && path.includes("/segments"))
        return reply({ data: [{ id: "seg-fr", name: "newsletter-fr" }] });
      if (method === "POST" && path === "/contacts") return reply({}, 409);
      return reply({});
    }),
  );
  return calls;
}

const testEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    ...env,
    RESEND_API_KEY: "re_test",
    GDPR_FINGERPRINT_SALT: SALT,
    SANITY_PROJECT_ID: "proj",
    SANITY_DATASET: "production",
    ...overrides,
  }) as Env;

async function call(path: string, init: RequestInit = {}, e = testEnv()) {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://api.test${path}`, {
      ...init,
      headers: {
        authorization: "Bearer test-token",
        "content-type": "application/json",
        ...(init.headers as Record<string, string>),
      },
    }),
    e,
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}
const post = (path: string, body: unknown, e?: Env) =>
  call(path, { method: "POST", body: JSON.stringify(body) }, e);
const read = (q: string, actor = ADMIN) =>
  call(`/v1/admin/email-preferences?${q}&actorUserId=${actor}`);

async function seedUser(
  userId: string,
  email: string,
  role: string | null = null,
) {
  await env
    .MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO user_profiles (user_id, email, email_fingerprint, locale, role, created_at) VALUES (?, ?, ?, 'fr', ?, ?)",
    )
    .bind(
      userId,
      email,
      await fingerprintEmail(email, SALT),
      role,
      new Date().toISOString(),
    )
    .run();
  await env
    .MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, 'news', 1, ?)",
    )
    .bind(userId, new Date().toISOString())
    .run();
}
beforeAll(async () => {
  await seedUser(ADMIN, "admin@example.com", "admin");
  await seedUser(NOT_ADMIN, "plain@example.com");
});
const audits = async (target: string) =>
  (
    await env
      .AUDIT_DB!.prepare(
        "SELECT event, actor_user_id, reason FROM admin_audit WHERE target_user_id = ?",
      )
      .bind(target)
      .all()
  ).results;
const visitorRows = async (email: string) =>
  (
    await env
      .MAIN_DB!.prepare(
        "SELECT consent_type, granted, source FROM consent_events WHERE email_fingerprint = ? AND subject_type = 'visitor' ORDER BY consent_type",
      )
      .bind(await fingerprintEmail(email, SALT))
      .all()
  ).results;

describe("GET /v1/admin/email-preferences", () => {
  it("an account: its own choices, the Resend topics and global state; the view is audited", async () => {
    await seedUser("user_read00000001", "read@example.com");
    stubFetch({
      topics: {
        "read@example.com": [{ id: "t_news", subscription: "opt_in" }],
      },
    });
    const res = await read("userId=user_read00000001");
    expect(await res.json()).toEqual({
      subject: { userId: "user_read00000001", email: "read@example.com" },
      categories: [
        { key: "news", name: "News", granted: true, topic: "opt_in" },
        { key: "general", name: "General", granted: false, topic: null },
      ],
      resend: { exists: true, unsubscribed: false },
    });
    expect(await audits("user_read00000001")).toEqual([
      { event: "admin.view_email_prefs", actor_user_id: ADMIN, reason: null },
    ]);
  });

  it("an email with no account: Resend only; an account's email resolves to the account", async () => {
    stubFetch({
      contacts: { "visitor@example.com": { unsubscribed: true } },
      topics: {
        "visitor@example.com": [{ id: "t_gen", subscription: "opt_in" }],
      },
    });
    expect(
      await (await read("email=Visitor@Example.com")).json(),
    ).toMatchObject({
      subject: { userId: null, email: "visitor@example.com" },
      categories: [
        { key: "news", granted: null, topic: null },
        { key: "general", granted: null, topic: "opt_in" },
      ],
      resend: { exists: true, unsubscribed: true },
    });
    await seedUser("user_byemail00001", "owner@example.com");
    expect(await (await read("email=owner@example.com")).json()).toMatchObject({
      subject: { userId: "user_byemail00001" },
    });
  });

  it("only an admin may look (403); 400 without a valid subject or actor; 401 without the bearer", async () => {
    stubFetch();
    expect((await read("userId=user_read00000001", NOT_ADMIN)).status).toBe(
      403,
    );
    expect((await read("userId=nope")).status).toBe(400);
    expect(
      (await call("/v1/admin/email-preferences?userId=user_read00000001"))
        .status,
    ).toBe(400);
    expect(
      (
        await call(
          `/v1/admin/email-preferences?userId=user_read00000001&actorUserId=${ADMIN}`,
          {
            headers: { authorization: "" },
          },
        )
      ).status,
    ).toBe(401);
  });
});

describe("POST /v1/admin/email-preferences — off only", () => {
  it("turns news off: the account row, proof rows, the topic, the newsletter segment, the audit", async () => {
    await seedUser("user_off000000001", "off@example.com");
    const calls = stubFetch();
    const res = await post("/v1/admin/email-preferences", {
      userId: "user_off000000001",
      off: ["news"],
      reason: "request_email",
      actorUserId: ADMIN,
    });
    expect(await res.json()).toEqual({ ok: true, resend: "ok" });
    const pref = await env
      .MAIN_DB!.prepare(
        "SELECT granted FROM email_preferences WHERE user_id = ? AND category_key = 'news'",
      )
      .bind("user_off000000001")
      .first<{ granted: number }>();
    expect(pref?.granted).toBe(0);
    const proof = await env
      .MAIN_DB!.prepare(
        "SELECT granted, surface, source FROM consent_events WHERE subject_id = ? AND consent_type = 'email_pref:news'",
      )
      .bind("user_off000000001")
      .all();
    expect(proof.results).toEqual([
      { granted: 0, surface: "admin", source: "admin" },
    ]);
    // The newsletter sign-up consent is withdrawn too, so the ledger agrees.
    expect(await visitorRows("off@example.com")).toEqual([
      { consent_type: "newsletter", granted: 0, source: "admin" },
    ]);
    expect(
      calls.find((c) => c.url.endsWith("/topics") && c.method === "PATCH")
        ?.body,
    ).toEqual([{ id: "t_news", subscription: "opt_out" }]);
    expect(
      calls.some(
        (c) =>
          c.method === "DELETE" &&
          c.url === "/contacts/off@example.com/segments/seg-fr",
      ),
    ).toBe(true);
    expect(await audits("user_off000000001")).toEqual([
      {
        event: "admin.email_pref_off",
        actor_user_id: ADMIN,
        reason: "request_email",
      },
    ]);
  });

  it("stop all: every category off and the Resend global unsubscribe", async () => {
    await seedUser("user_stop00000001", "stop@example.com");
    const calls = stubFetch();
    await post("/v1/admin/email-preferences", {
      userId: "user_stop00000001",
      off: [],
      stopAll: true,
      reason: "complaint",
      actorUserId: ADMIN,
    });
    const rows = await env
      .MAIN_DB!.prepare(
        "SELECT category_key, granted FROM email_preferences WHERE user_id = ?",
      )
      .bind("user_stop00000001")
      .all();
    expect(rows.results).toEqual(
      expect.arrayContaining([
        { category_key: "news", granted: 0 },
        { category_key: "general", granted: 0 },
      ]),
    );
    expect(
      calls.find(
        (c) => c.method === "PATCH" && c.url === "/contacts/stop@example.com",
      )?.body,
    ).toEqual({ unsubscribed: true });
    expect(await audits("user_stop00000001")).toEqual([
      { event: "admin.email_stop", actor_user_id: ADMIN, reason: "complaint" },
    ]);
  });

  it("a person without an account: per-category proof + the waitlist withdrawal, audited by fingerprint", async () => {
    stubFetch();
    await post("/v1/admin/email-preferences", {
      email: "solo@example.com",
      off: ["general"],
      reason: "request_phone",
      actorUserId: ADMIN,
    });
    expect(await visitorRows("solo@example.com")).toEqual([
      { consent_type: "email_pref:general", granted: 0, source: "admin" },
      { consent_type: "waitlist", granted: 0, source: "admin" },
    ]);
    const fp = await fingerprintEmail("solo@example.com", SALT);
    expect(await audits(`fp:${fp}`)).toHaveLength(1);
  });

  it("can never turn anything on; needs an admin, a known reason and a known category", async () => {
    stubFetch();
    const base = {
      userId: "user_off000000001",
      actorUserId: ADMIN,
      reason: "other",
    };
    for (const body of [
      { ...base, on: ["news"] }, // there is no "on"
      { ...base, off: [] },
      { ...base, off: ["news"], reason: "because" },
      { ...base, off: ["news"], reason: undefined },
      { ...base, off: ["news"], actorUserId: "admin" },
      { ...base, off: ["unknown"] },
    ])
      expect((await post("/v1/admin/email-preferences", body)).status).toBe(
        400,
      );
    expect(
      (
        await post("/v1/admin/email-preferences", {
          ...base,
          off: ["news"],
          actorUserId: NOT_ADMIN,
        })
      ).status,
    ).toBe(403);
  });

  it("a Resend failure keeps the D1 change and says so", async () => {
    await seedUser("user_fail00000001", "fail@example.com");
    stubFetch({ resendStatus: 500 });
    const res = await post("/v1/admin/email-preferences", {
      userId: "user_fail00000001",
      off: ["news"],
      reason: "bounce",
      actorUserId: ADMIN,
    });
    expect(await res.json()).toEqual({ ok: true, resend: "failed" });
  });
});

describe("POST /v1/admin/email-preferences/move", () => {
  const move = (body: Record<string, unknown>) =>
    post("/v1/admin/email-preferences/move", {
      userId: "user_move00000001",
      from: "old@example.com",
      to: "New@Example.com",
      actorUserId: ADMIN,
      ...body,
    });

  it("the new address gets the topics, segments and global state; the old contact goes", async () => {
    await seedUser("user_move00000001", "old@example.com");
    const calls = stubFetch({
      contacts: { "new@example.com": "missing" },
      topics: { "old@example.com": [{ id: "t_news", subscription: "opt_in" }] },
    });
    expect(await (await move({})).json()).toEqual({
      ok: true,
      resend: "moved",
    });
    const writes = calls.filter((c) => c.method !== "GET");
    expect(writes[0]).toEqual({
      url: "/contacts",
      method: "POST",
      body: {
        email: "new@example.com",
        unsubscribed: false,
        properties: { locale: "fr" },
        topics: [{ id: "t_news", subscription: "opt_in" }],
        segments: [{ id: "seg-fr" }],
      },
    });
    expect(writes.at(-1)).toEqual({
      url: "/contacts/old@example.com",
      method: "DELETE",
      body: undefined,
    });
  });

  it("merges into an existing contact — the more restrictive state wins, never an opt-in", async () => {
    await seedUser("user_move00000001", "old@example.com");
    const calls = stubFetch({
      contacts: { "new@example.com": { unsubscribed: true } },
      topics: {
        "old@example.com": [{ id: "t_news", subscription: "opt_in" }],
        "new@example.com": [{ id: "t_news", subscription: "opt_out" }],
      },
    });
    await move({});
    expect(
      calls.find(
        (c) => c.method === "PATCH" && c.url === "/contacts/new@example.com",
      )?.body,
    ).toEqual({ unsubscribed: true, properties: { locale: "fr" } });
    expect(
      calls.find(
        (c) =>
          c.method === "PATCH" && c.url === "/contacts/new@example.com/topics",
      )?.body,
    ).toEqual([{ id: "t_news", subscription: "opt_out" }]);
  });

  it("an unreadable topic list writes and deletes nothing", async () => {
    const calls = stubFetch({ topics: { "old@example.com": "error" } });
    expect(await (await move({})).json()).toEqual({
      ok: true,
      resend: "failed",
    });
    expect(calls.filter((c) => c.method !== "GET")).toEqual([]);
  });

  it("refuses the same address (it would delete the only contact) and a non-admin actor", async () => {
    stubFetch();
    expect((await move({ to: "OLD@example.com" })).status).toBe(400);
    expect((await move({ actorUserId: NOT_ADMIN })).status).toBe(403);
  });
});

describe("POST /v1/events — an admin event's reason", () => {
  const event = (reason?: unknown) =>
    post("/v1/events", {
      kind: "admin",
      event: "admin.change_email",
      actorUserId: ADMIN,
      targetUserId: "user_event0000001",
      ...(reason === undefined ? {} : { reason }),
    });

  it("stores a known reason code and refuses free text", async () => {
    expect((await event("request_phone")).status).toBe(201);
    expect(await audits("user_event0000001")).toEqual([
      {
        event: "admin.change_email",
        actor_user_id: ADMIN,
        reason: "request_phone",
      },
    ]);
    expect((await event("he called me")).status).toBe(400);
  });
});
