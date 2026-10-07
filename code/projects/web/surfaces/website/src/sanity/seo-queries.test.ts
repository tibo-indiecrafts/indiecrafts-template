import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { blogSeoQuery, contactSeoQuery, waitlistSeoQuery } from "./seo-queries";

// `groq-js` runs the real query strings against an in-memory dataset.
const run = async (query: string, dataset: unknown[], locale: string) =>
  (await evaluate(parse(query), { dataset, params: { locale } })).get();

type BlogSeo = Record<"seo" | "author" | "category" | "tag", { title: string }>;

const fr = (title: string) => ({ _key: "fr", language: "fr", seo: { title } });

describe("singleton SEO — the $locale entry of seoTranslations, else the default", () => {
  const blog = {
    _id: "blog",
    _type: "blog",
    seo: { title: "Blog" },
    seoTranslations: [fr("Le blog")],
    indexSeo: {
      author: { title: "Authors" },
      category: { title: "Categories" },
      tag: { title: "Tags" },
      seoTranslations: [
        {
          _key: "fr",
          language: "fr",
          author: { title: "Auteurs" },
          category: { title: "Catégories" },
        },
      ],
    },
  };

  it("reads the French blog and index SEO in French", async () => {
    const res = (await run(blogSeoQuery, [blog], "fr")) as BlogSeo;
    expect(res.seo.title).toBe("Le blog");
    expect(res.author.title).toBe("Auteurs");
    expect(res.category.title).toBe("Catégories");
    // No French tag entry → the default-locale value.
    expect(res.tag.title).toBe("Tags");
  });

  it("reads the default locale from the base fields", async () => {
    const res = (await run(blogSeoQuery, [blog], "en")) as BlogSeo;
    expect(res.seo.title).toBe("Blog");
    expect(res.author.title).toBe("Authors");
  });

  it.each([
    ["contactSettings", contactSeoQuery],
    ["waitlistSettings", waitlistSeoQuery],
  ])("%s SEO follows the locale", async (_type, query) => {
    const doc = { _id: _type, _type, seo: { title: "EN" }, seoTranslations: [fr("FR")] };
    expect(await run(query, [doc], "fr")).toMatchObject({ title: "FR" });
    expect(await run(query, [doc], "en")).toMatchObject({ title: "EN" });
    expect(
      await run(query, [{ ...doc, seoTranslations: undefined }], "fr"),
    ).toMatchObject({
      title: "EN",
    });
  });

  it("merges a partial translation field by field — visibility stays on the base", async () => {
    const doc = {
      _id: "waitlistSettings",
      _type: "waitlistSettings",
      seo: {
        title: "EN",
        description: "EN desc",
        noIndex: true,
        canonical: "https://x.test/w",
      },
      seoTranslations: [fr("FR")],
    };
    expect(await run(waitlistSeoQuery, [doc], "fr")).toMatchObject({
      title: "FR",
      description: "EN desc",
      noIndex: true,
      canonical: "https://x.test/w",
    });
  });

  it("is null when the document has no SEO in any locale", async () => {
    const doc = { _id: "contactSettings", _type: "contactSettings" };
    expect(await run(contactSeoQuery, [doc], "fr")).toBeNull();
  });
});
