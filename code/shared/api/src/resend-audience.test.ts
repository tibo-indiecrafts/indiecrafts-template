import { describe, expect, it, vi } from "vitest";
import {
  upsertResendContact,
  deleteResendContact,
  syncContactTopics,
  suppressResendContact,
} from "./resend-audience";

const env = { RESEND_API_KEY: "k" };

describe("resend-audience", () => {
  it("no-ops when RESEND_API_KEY is unset", async () => {
    const f = vi.fn();
    await upsertResendContact(
      {},
      { email: "u@x.com", granted: true },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("creates a global contact with unsubscribed = !granted", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return new Response("{}", { status: 200 });
    });
    await upsertResendContact(
      env,
      { email: "u@x.com", granted: false },
      f as unknown as typeof fetch,
    );
    expect(calls[0].url).toBe("https://api.resend.com/contacts");
    expect(calls[0].body).toMatchObject({
      email: "u@x.com",
      unsubscribed: true,
    });
  });

  it("falls back to PATCH by email when the contact already exists", async () => {
    const seen: string[] = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      seen.push(`${init.method} ${url}`);
      return new Response("{}", {
        status: init.method === "POST" ? 409 : 200,
      });
    });
    await upsertResendContact(
      env,
      { email: "u@x.com", granted: true },
      f as unknown as typeof fetch,
    );
    expect(seen[0]).toBe("POST https://api.resend.com/contacts");
    expect(seen[1]).toBe("PATCH https://api.resend.com/contacts/u@x.com");
  });

  it("deletes a contact by email (404 is success)", async () => {
    const f = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response("{}", { status: 200 }),
    );
    await deleteResendContact(
      env,
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toBe("https://api.resend.com/contacts/u@x.com");
    expect(init?.method).toBe("DELETE");
  });
});

describe("syncContactTopics", () => {
  it("no-ops when RESEND_API_KEY is unset", async () => {
    const f = vi.fn();
    await syncContactTopics(
      {},
      { email: "u@x.com", topics: [{ topicId: "t1", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("no-ops when email is empty", async () => {
    const f = vi.fn();
    await syncContactTopics(
      env,
      { email: "", topics: [{ topicId: "t1", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("no-ops when topics is empty after dropping entries with no topicId", async () => {
    const f = vi.fn();
    await syncContactTopics(
      env,
      { email: "u@x.com", topics: [{ topicId: "", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("POSTs mapping granted -> opt_in and false -> opt_out, dropping empty topicIds", async () => {
    const calls: Array<{ url: string; method: string; body: unknown }> = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      calls.push({
        url,
        method: String(init.method),
        body: JSON.parse(String(init.body)),
      });
      return new Response("{}", { status: 200 });
    });
    await syncContactTopics(
      env,
      {
        email: "u@x.com",
        topics: [
          { topicId: "t1", granted: true },
          { topicId: "t2", granted: false },
          { topicId: "", granted: true },
        ],
      },
      f as unknown as typeof fetch,
    );
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url).toBe("https://api.resend.com/contacts");
    expect(calls[0].body).toMatchObject({
      email: "u@x.com",
      topics: [
        { id: "t1", subscription: "opt_in" },
        { id: "t2", subscription: "opt_out" },
      ],
    });
  });

  it("falls back to the dedicated /topics endpoint (bare array) on 409/422", async () => {
    const calls: Array<{ url: string; method: string; body: unknown }> = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      calls.push({
        url,
        method: String(init.method),
        body: JSON.parse(String(init.body)),
      });
      return new Response("{}", {
        status: init.method === "POST" ? 409 : 200,
      });
    });
    await syncContactTopics(
      env,
      { email: "u@x.com", topics: [{ topicId: "t1", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(calls[0].method).toBe("POST");
    expect(calls[1].method).toBe("PATCH");
    expect(calls[1].url).toBe("https://api.resend.com/contacts/u@x.com/topics");
    // Topics body is a bare array, not wrapped in a `topics` property.
    expect(calls[1].body).toEqual([{ id: "t1", subscription: "opt_in" }]);
  });

  it("throws on a non-ok, non-409/422 response", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 500 }));
    await expect(
      syncContactTopics(
        env,
        { email: "u@x.com", topics: [{ topicId: "t1", granted: true }] },
        f as unknown as typeof fetch,
      ),
    ).rejects.toThrow("resend 500");
  });
});

describe("syncContactTopics — newsletter language segment", () => {
  const SEGMENTS = [
    { id: "seg-en", name: "newsletter-en" },
    { id: "seg-fr", name: "newsletter-fr" },
    { id: "seg-vip", name: "vip" },
  ];
  /** Routes by URL; the contact is in `newsletter-en` + `vip`. Returns `METHOD path` lines. */
  function stub() {
    const calls: Array<{ line: string; body: unknown }> = [];
    const f = vi.fn(async (url: string, init: RequestInit = {}) => {
      const path = url.replace("https://api.resend.com", "");
      calls.push({
        line: `${init.method ?? "GET"} ${path}`,
        body: init.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (path === "/segments?limit=100")
        return new Response(JSON.stringify({ data: SEGMENTS }));
      if (path.endsWith("/segments?limit=100"))
        return new Response(
          JSON.stringify({ data: [SEGMENTS[0], SEGMENTS[2]] }),
        );
      return new Response("{}", { status: 200 });
    });
    return { calls, f: f as unknown as typeof fetch };
  }

  it("news granted: sets the locale property and moves the contact to its segment", async () => {
    const { calls, f } = stub();
    await syncContactTopics(
      env,
      {
        email: "u@x.com",
        topics: [{ topicId: "t1", granted: true }],
        newsletterLocale: "fr",
      },
      f,
    );
    expect(calls[0].body).toEqual({
      email: "u@x.com",
      properties: { locale: "fr" },
      topics: [{ id: "t1", subscription: "opt_in" }],
    });
    expect(calls.map((c) => c.line)).toEqual([
      "POST /contacts",
      "GET /segments?limit=100",
      "GET /contacts/u@x.com/segments?limit=100",
      "POST /contacts/u@x.com/segments/seg-fr",
      "DELETE /contacts/u@x.com/segments/seg-en",
    ]);
  });

  it("news revoked: leaves every newsletter segment, keeps other segments", async () => {
    const { calls, f } = stub();
    await syncContactTopics(
      env,
      { email: "u@x.com", topics: [], newsletterLocale: null },
      f,
    );
    expect(calls.map((c) => c.line)).toEqual([
      "GET /contacts/u@x.com/segments?limit=100",
      "DELETE /contacts/u@x.com/segments/seg-en",
    ]);
  });

  it("a 404 on a segment removal is fine; another error throws", async () => {
    const segs = (status: number) =>
      vi.fn(async (url: string, init: RequestInit = {}) =>
        init.method === "DELETE"
          ? new Response("{}", { status })
          : new Response(JSON.stringify({ data: [SEGMENTS[0]] })),
      ) as unknown as typeof fetch;
    const args = { email: "u@x.com", topics: [], newsletterLocale: null };
    await expect(syncContactTopics(env, args, segs(404))).resolves.toBe(
      undefined,
    );
    await expect(syncContactTopics(env, args, segs(500))).rejects.toThrow(
      "resend 500",
    );
  });
});

describe("suppressResendContact", () => {
  it("no-ops without a key", async () => {
    const f = vi.fn();
    await suppressResendContact(
      {},
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("sets unsubscribed + opt_out marketing + churned opt_in + property on create", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await suppressResendContact(
      env,
      {
        email: "u@x.com",
        reason: "too_expensive",
        churnedTopicId: "top_churn",
        optOutTopicIds: ["top_news", "top_offers"],
      },
      f as unknown as typeof fetch,
    );
    expect(f.mock.calls[0][0]).toBe("https://api.resend.com/contacts");
    const body = JSON.parse(
      (f.mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.unsubscribed).toBe(true);
    expect((body.properties as Record<string, unknown>).churn_reason).toBe(
      "too_expensive",
    );
    expect(body.topics).toEqual([
      { id: "top_news", subscription: "opt_out" },
      { id: "top_offers", subscription: "opt_out" },
      { id: "top_churn", subscription: "opt_in" },
    ]);
    expect(body.email).toBe("u@x.com");
  });

  it("omits topics when no churnedTopicId and no optOutTopicIds", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await suppressResendContact(
      env,
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const body = JSON.parse(
      (f.mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.unsubscribed).toBe(true);
    expect(body.topics).toBeUndefined();
  });

  it("on 409/422 PATCHes fields by email then topics on the dedicated endpoint", async () => {
    const seen: string[] = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      seen.push(`${String(init.method)} ${url}`);
      return new Response("{}", {
        status: init.method === "POST" ? 409 : 200,
      });
    });
    await suppressResendContact(
      env,
      { email: "u@x.com", reason: "privacy", churnedTopicId: "top_churn" },
      f as unknown as typeof fetch,
    );
    expect(f).toHaveBeenCalledTimes(3);
    expect(seen[0]).toBe("POST https://api.resend.com/contacts");
    expect(seen[1]).toBe("PATCH https://api.resend.com/contacts/u@x.com");
    expect(seen[2]).toBe(
      "PATCH https://api.resend.com/contacts/u@x.com/topics",
    );
  });
});
