import { describe, expect, it, vi } from "vitest";
import { upsertResendContact, deleteResendContact } from "./resend-audience";

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
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    await deleteResendContact(
      env,
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toContain("/audiences/aud_1/contacts/u@x.com");
    expect((init as RequestInit).method).toBe("DELETE");
  });
});
