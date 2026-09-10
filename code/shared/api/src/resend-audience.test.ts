import { describe, expect, it, vi } from "vitest";
import {
  upsertResendContact,
  deleteResendContact,
  syncContactTopics,
  suppressResendContact,
} from "./resend-audience";

const env = { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" };

describe("resend-audience", () => {
  it("no-ops when RESEND_AUDIENCE_ID is unset", async () => {
    const f = vi.fn();
    await upsertResendContact(
      { RESEND_API_KEY: "k" },
      { email: "u@x.com", granted: true },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("creates/updates a contact with unsubscribed = !granted", async () => {
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
    expect(calls[0].url).toContain("/audiences/aud_1/contacts");
    expect(calls[0].body).toMatchObject({
      email: "u@x.com",
      unsubscribed: true,
    });
  });

  it("falls back to PATCH when the contact already exists", async () => {
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
    expect(seen[0]).toContain("POST");
    expect(seen[1]).toBe(
      "PATCH https://api.resend.com/audiences/aud_1/contacts/u@x.com",
    );
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
    expect(String(url)).toContain("/audiences/aud_1/contacts/u@x.com");
    expect(init?.method).toBe("DELETE");
  });
});

describe("syncContactTopics", () => {
  it("no-ops when RESEND_AUDIENCE_ID is unset", async () => {
    const f = vi.fn();
    await syncContactTopics(
      { RESEND_API_KEY: "k" },
      { email: "u@x.com", topics: [{ topicId: "t1", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("no-ops when RESEND_API_KEY is unset", async () => {
    const f = vi.fn();
    await syncContactTopics(
      { RESEND_AUDIENCE_ID: "aud_1" },
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
    expect(calls[0].url).toBe(
      "https://api.resend.com/audiences/aud_1/contacts",
    );
    expect(calls[0].body).toMatchObject({
      email: "u@x.com",
      topics: [
        { id: "t1", subscription: "opt_in" },
        { id: "t2", subscription: "opt_out" },
      ],
    });
  });

  it("falls back to PATCH by email on 409/422", async () => {
    const seen: string[] = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      seen.push(`${init.method} ${url}`);
      return new Response("{}", {
        status: init.method === "POST" ? 409 : 200,
      });
    });
    await syncContactTopics(
      env,
      { email: "u@x.com", topics: [{ topicId: "t1", granted: true }] },
      f as unknown as typeof fetch,
    );
    expect(seen[0]).toContain("POST");
    expect(seen[1]).toBe(
      "PATCH https://api.resend.com/audiences/aud_1/contacts/u@x.com",
    );
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

describe("suppressResendContact", () => {
  it("no-ops without key/audience", async () => {
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
      { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" },
      {
        email: "u@x.com",
        reason: "too_expensive",
        churnedTopicId: "top_churn",
        optOutTopicIds: ["top_news", "top_offers"],
      },
      f as unknown as typeof fetch,
    );
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
      { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" },
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const body = JSON.parse(
      (f.mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.unsubscribed).toBe(true);
    expect(body.topics).toBeUndefined();
  });

  it("falls back to PATCH by email on 409/422", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 409 })
      .mockResolvedValueOnce({ ok: true, status: 200 });
    await suppressResendContact(
      { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" },
      { email: "u@x.com", reason: "privacy", churnedTopicId: "top_churn" },
      f as unknown as typeof fetch,
    );
    expect(f).toHaveBeenCalledTimes(2);
    expect(f.mock.calls[1][0] as string).toContain("/contacts/u@x.com");
    expect((f.mock.calls[1][1] as RequestInit).method).toBe("PATCH");
  });
});
