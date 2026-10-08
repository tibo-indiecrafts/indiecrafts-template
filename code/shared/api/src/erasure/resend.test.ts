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

  it("lookup, export, preview and anonymize never call Resend", async () => {
    const doFetch = fetchStatus(200);
    const adapter = createResendErasureAdapter(env, doFetch);
    expect(await adapter.findByEmail("a@b.co")).toEqual({ found: false });
    expect(await adapter.export("a@b.co")).toBeNull();
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
