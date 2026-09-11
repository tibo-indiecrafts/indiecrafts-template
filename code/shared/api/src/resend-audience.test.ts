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
