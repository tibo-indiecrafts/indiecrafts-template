import { describe, expect, it, vi } from "vitest";
import {
  fetchEmailPreferences,
  type PrefCategory,
} from "./email-preferences-sanity";

const env = { SANITY_PROJECT_ID: "p", SANITY_DATASET: "production" };

const category: PrefCategory = {
  key: "offers",
  name: "Offers",
  description: "Discounts and promotions.",
  includeAtSignup: false,
  resendTopicId: "topic_123",
};

describe("fetchEmailPreferences", () => {
  it("resolves categories and notices to the requested locale", async () => {
    const f = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            result: {
              categories: [
                {
                  key: "offers",
                  name: { en: "Offers", fr: "Offres" },
                  description: {
                    en: "Discounts and promotions.",
                    fr: "Réductions et promotions.",
                  },
                  includeAtSignup: false,
                  resendTopicId: "topic_123",
                },
              ],
              notices: [
                {
                  name: { en: "Orders", fr: "Commandes" },
                  description: {
                    en: "Order confirmations.",
                    fr: "Confirmations de commande.",
                  },
                },
              ],
            },
          }),
          { status: 200 },
        ),
    );
    const r = await fetchEmailPreferences(
      env,
      "fr",
      f as unknown as typeof fetch,
    );
    expect(r.categories).toEqual([
      {
        key: "offers",
        name: "Offres",
        description: "Réductions et promotions.",
        includeAtSignup: false,
        resendTopicId: "topic_123",
      },
    ]);
    expect(r.notices).toEqual([
      { name: "Commandes", description: "Confirmations de commande." },
    ]);
    expect(String(f.mock.calls[0][0])).toContain("emailPreferences");
  });

  it("never throws — unset Sanity returns the news-only default", async () => {
    const f = vi.fn();
    const r = await fetchEmailPreferences(
      {},
      "en",
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
    expect(r.notices).toEqual([]);
    expect(r.categories).toEqual([
      {
        key: "news",
        name: "News",
        description: "Product updates and company news.",
        includeAtSignup: true,
      },
    ]);
  });

  it("never throws — unreachable Sanity (non-ok or thrown fetch) returns the news default", async () => {
    const bad = vi.fn(async () => new Response("", { status: 500 }));
    expect(
      (await fetchEmailPreferences(env, "en", bad as unknown as typeof fetch))
        .categories[0].key,
    ).toBe("news");
    const threw = vi.fn(async () => {
      throw new Error("net");
    });
    expect(
      (await fetchEmailPreferences(env, "en", threw as unknown as typeof fetch))
        .categories[0].key,
    ).toBe("news");
  });

  it("never throws — an empty Sanity result returns the news default", async () => {
    const f = vi.fn(
      async () =>
        new Response(JSON.stringify({ result: null }), { status: 200 }),
    );
    const r = await fetchEmailPreferences(
      env,
      "en",
      f as unknown as typeof fetch,
    );
    expect(r.categories[0].key).toBe("news");
  });

  it("resolves the news default in the requested locale", async () => {
    const f = vi.fn();
    const r = await fetchEmailPreferences(
      {},
      "fr",
      f as unknown as typeof fetch,
    );
    expect(r.categories[0].name).toBe("Actualités");
  });
});
