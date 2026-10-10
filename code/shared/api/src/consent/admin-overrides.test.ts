import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../index";

const SALT = "test-override-salt";
const ADMIN = "user_admin0000001";
afterEach(() => vi.unstubAllGlobals());

type Call = { url: string; method: string; body: unknown };

/** Sanity (two categories) + Resend, routed by URL. Records every Resend call. */
function stubFetch(
  opts: {
    contact?: "missing" | { unsubscribed: boolean };
    topics?: { id: string; subscription: string }[];
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
      if (method === "GET" && /^\/contacts\/[^/]+$/.test(path))
        return opts.contact === "missing"
          ? reply({}, 404)
          : reply(opts.contact ?? { unsubscribed: false });
      if (method === "GET" && path.includes("/topics"))
        return reply({ data: opts.topics ?? [] });
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

async function seedUser(userId: string, email: string) {
  await env
    .MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO user_profiles (user_id, email, email_fingerprint, locale, created_at) VALUES (?, ?, ?, 'fr', ?)",
    )
    .bind(
      userId,
      email,
      await fingerprintEmail(email, SALT),
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
const audits = async (target: string) =>
  (
    await env
      .AUDIT_DB!.prepare(
        "SELECT event, actor_user_id, reason FROM admin_audit WHERE target_user_id = ?",
      )
      .bind(target)
      .all()
  ).results;

describe("GET /v1/admin/email-preferences", () => {
  it("an account: its own choices, the Resend topics and global state", async () => {
    await seedUser("user_read00000001", "read@example.com");
    stubFetch({ topics: [{ id: "t_news", subscription: "opt_in" }] });
    const res = await call(
      "/v1/admin/email-preferences?userId=user_read00000001&actorUserId=user_admin0000001",
    );
    expect(res.status).toBe(200);
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
      contact: { unsubscribed: true },
      topics: [{ id: "t_gen", subscription: "opt_in" }],
    });
    const res = await call(
      "/v1/admin/email-preferences?email=Visitor@Example.com&actorUserId=user_admin0000001",
    );
    expect(await res.json()).toMatchObject({
      subject: { userId: null, email: "visitor@example.com" },
      categories: [
        { key: "news", granted: null, topic: null },
        { key: "general", granted: null, topic: "opt_in" },
      ],
      resend: { exists: true, unsubscribed: true },
    });
    await seedUser("user_byemail00001", "owner@example.com");
    const owner = await call(
      "/v1/admin/email-preferences?email=owner@example.com&actorUserId=user_admin0000001",
    );
    expect(await owner.json()).toMatchObject({
      subject: { userId: "user_byemail00001" },
    });
  });

  it("400s without a valid user id or email; 401s without the bearer", async () => {
    stubFetch();
    expect(
      (
        await call(
          "/v1/admin/email-preferences?userId=nope&actorUserId=user_admin0000001",
        )
      ).status,
    ).toBe(400);
    // Who is looking is required: the view is audited.
    expect(
      (await call("/v1/admin/email-preferences?userId=user_read00000001"))
        .status,
    ).toBe(400);
    expect((await call("/v1/admin/email-preferences")).status).toBe(400);
    expect(
      (
        await call(
          "/v1/admin/email-preferences?userId=user_read00000001&actorUserId=user_admin0000001",
          {
            headers: { authorization: "" },
          },
        )
      ).status,
    ).toBe(401);
  });
});

describe("POST /v1/admin/email-preferences — off only", () => {
  it("turns a category off: the account row, a proof row (source admin), Resend, the audit", async () => {
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
    expect(
      calls.find((c) => c.url.endsWith("/topics") && c.method === "PATCH")
        ?.body,
    ).toEqual([{ id: "t_news", subscription: "opt_out" }]);
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

  it("a person without an account: proof rows by fingerprint, audited by fingerprint", async () => {
    stubFetch();
    await post("/v1/admin/email-preferences", {
      email: "solo@example.com",
      off: ["general"],
      reason: "request_phone",
      actorUserId: ADMIN,
    });
    const fp = await fingerprintEmail("solo@example.com", SALT);
    const proof = await env
      .MAIN_DB!.prepare(
        "SELECT subject_type, granted, source FROM consent_events WHERE email_fingerprint = ? AND consent_type = 'email_pref:general'",
      )
      .bind(fp)
      .all();
    expect(proof.results).toEqual([
      { subject_type: "visitor", granted: 0, source: "admin" },
    ]);
    expect(await audits(`fp:${fp}`)).toHaveLength(1);
  });

  it("can never turn anything on, and needs a known reason and category", async () => {
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
    ])
      expect((await post("/v1/admin/email-preferences", body)).status).toBe(
        400,
      );
    expect(
      (await post("/v1/admin/email-preferences", { ...base, off: ["unknown"] }))
        .status,
    ).toBe(400);
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
  it("the new address gets the topics, segments and global state; the old contact goes", async () => {
    await seedUser("user_move00000001", "old@example.com");
    const calls = stubFetch({
      topics: [{ id: "t_news", subscription: "opt_in" }],
    });
    const res = await post("/v1/admin/email-preferences/move", {
      userId: "user_move00000001",
      from: "old@example.com",
      to: "New@Example.com",
      reason: "request_email",
      actorUserId: ADMIN,
    });
    expect(await res.json()).toEqual({ ok: true, resend: "moved" });
    const writes = calls
      .filter((c) => c.method !== "GET")
      .map((c) => `${c.method} ${c.url}`);
    expect(writes).toEqual([
      "POST /contacts", // 409: the new address exists → updated in place
      "PATCH /contacts/new@example.com",
      "PATCH /contacts/new@example.com/topics",
      "POST /contacts/new@example.com/segments/seg-fr",
      "DELETE /contacts/old@example.com",
    ]);
    expect(await audits("user_move00000001")).toEqual([
      {
        event: "admin.change_email",
        actor_user_id: ADMIN,
        reason: "request_email",
      },
    ]);
  });

  it("no old contact: nothing to move, still audited", async () => {
    stubFetch({ contact: "missing" });
    const res = await post("/v1/admin/email-preferences/move", {
      userId: "user_move00000001",
      from: "gone@example.com",
      to: "new2@example.com",
      reason: "other",
      actorUserId: ADMIN,
    });
    expect(await res.json()).toEqual({ ok: true, resend: "none" });
  });
});
