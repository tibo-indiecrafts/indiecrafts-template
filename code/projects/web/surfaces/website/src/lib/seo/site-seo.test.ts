import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@indiecrafts/packages-web-sanity/client", () => ({ client: { fetch } }));

const { getPageSeo } = await import("./site-seo");
const { contactSeoQuery } = await import("@/sanity/seo-queries");

beforeEach(() => fetch.mockReset());

describe("getPageSeo", () => {
  it("reads the contact page SEO from the contactSettings singleton", async () => {
    fetch.mockResolvedValue({ title: "Contact us", description: "Write to us" });
    const seo = await getPageSeo("contact", "en");
    expect(fetch).toHaveBeenCalledWith(contactSeoQuery);
    expect(seo).toMatchObject({ title: "Contact us", description: "Write to us" });
  });
});
