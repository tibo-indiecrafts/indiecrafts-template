import { describe, expect, it, vi } from "vitest";
import { createResendErasureAdapter } from "./resend";

const env = { RESEND_API_KEY: "re_test" };
const fetchStatus = (status: number) =>
  vi.fn(
    async (_url: string, _init?: RequestInit) => new Response(null, { status }),
  ) as unknown as typeof fetch & ReturnType<typeof vi.fn>;

describe("createResendErasureAdapter", () => {
  it("delete removes the contact by its lowercased email", async () => {
    const doFetch = fetchStatus(200);
    const result = await createResendErasureAdapter(env, doFetch).delete(
      " Reader@Example.com ",
    );
    expect(doFetch).toHaveBeenCalledWith(
      "https://api.resend.com/contacts/reader@example.com",
      { method: "DELETE", headers: { Authorization: "Bearer re_test" } },
    );
    expect(result).toEqual({
      store: "resend",
      anonymized: {},
      deleted: { resend_contact: 1 },
    });
  });

  it("a 404 (already gone) is success", async () => {
    await expect(
      createResendErasureAdapter(env, fetchStatus(404)).delete("a@b.co"),
    ).resolves.toMatchObject({ store: "resend" });
  });

  it("another error throws so the engine records it", async () => {
    await expect(
      createResendErasureAdapter(env, fetchStatus(500)).delete("a@b.co"),
    ).rejects.toThrow("resend 500");
  });

  it("lookup, preview and anonymize never call Resend", async () => {
    const doFetch = fetchStatus(200);
    const adapter = createResendErasureAdapter(env, doFetch);
    expect(await adapter.findByEmail("a@b.co")).toEqual({ found: false });
    expect(await adapter.preview("a@b.co")).toEqual({
      store: "resend",
      wouldAnonymize: {},
      wouldDelete: {},
    });
    expect(await adapter.anonymize("a@b.co")).toEqual({
      store: "resend",
      anonymized: {},
      deleted: {},
    });
    expect(doFetch).not.toHaveBeenCalled();
  });
});

describe("createResendErasureAdapter export", () => {
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });
  const contactFetch = (contactStatus = 200) =>
    vi.fn(async (url: string) => {
      if (url.endsWith("/segments?limit=100"))
        return reply({ data: [{ id: "s1", name: "newsletter-fr" }] });
      if (url.endsWith("/topics?limit=100"))
        return reply({ data: [{ id: "t1", subscription: "opt_in" }] });
      return reply(
        {
          object: "contact",
          id: "c1",
          email: "reader@example.com",
          first_name: "",
          unsubscribed: false,
          created_at: "2026-10-08 09:30:00",
          properties: { locale: { value: "fr", type: "string" } },
        },
        contactStatus,
      );
    }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;

  it("returns the contact, its topics and its segment names", async () => {
    const doFetch = contactFetch();
    expect(
      await createResendErasureAdapter(env, doFetch).export(
        " Reader@Example.com ",
      ),
    ).toEqual({
      email: "reader@example.com",
      unsubscribed: false,
      created_at: "2026-10-08 09:30:00",
      properties: { locale: { value: "fr", type: "string" } },
      topics: [{ id: "t1", subscription: "opt_in" }],
      segments: ["newsletter-fr"],
    });
    expect(doFetch.mock.calls[0][0]).toBe(
      "https://api.resend.com/contacts/reader@example.com",
    );
  });

  it("an unknown contact (404) exports null", async () => {
    expect(
      await createResendErasureAdapter(env, contactFetch(404)).export("a@b.co"),
    ).toBeNull();
  });

  it("never throws — a network error exports null", async () => {
    const doFetch = vi.fn(async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    expect(
      await createResendErasureAdapter(env, doFetch).export("a@b.co"),
    ).toBeNull();
  });

  it("no RESEND_API_KEY → null, no call", async () => {
    const doFetch = contactFetch();
    expect(
      await createResendErasureAdapter({}, doFetch).export("a@b.co"),
    ).toBeNull();
    expect(doFetch).not.toHaveBeenCalled();
  });
});
