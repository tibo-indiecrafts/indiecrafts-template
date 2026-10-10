import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { MODULES_FRAGMENT } from "./queries";

/** Evaluate the real fragment over an in-memory dataset, the way the routes project `sections[]`. */
const project = async (sections: unknown[], extra: unknown[] = []) => {
  const query = `*[_id == "p"][0]{ "sections": sections[]{ ${MODULES_FRAGMENT} } }.sections`;
  const value = await evaluate(parse(query), {
    dataset: [{ _id: "p", _type: "page", sections }, ...extra],
  });
  return (await value.get()) as Record<string, unknown>[];
};

const asset = {
  _id: "image-a",
  _type: "sanity.imageAsset",
  url: "https://cdn/a.jpg",
  metadata: {
    lqip: "data:x",
    dimensions: { aspectRatio: 1.5, width: 900, height: 600 },
  },
};
const image = {
  _type: "image",
  _key: "i",
  alt: "A",
  asset: { _ref: "image-a" },
};
const gallery = {
  _type: "module.gallery",
  _key: "g",
  images: [{ _key: "gi", alt: "G", asset: { _ref: "image-a" } }],
};
const quote = { _id: "q1", _type: "quote", content: "Nice", author: "Ann" };
const quoteList = {
  _type: "module.quote-list",
  _key: "q",
  quotes: [{ _ref: "q1" }],
};
const newsletter = { _type: "module.newsletter", _key: "n" };
const off = {
  _id: "newsletterSettings",
  _type: "newsletterSettings",
  enabled: false,
};

describe("MODULES_FRAGMENT", () => {
  it("resolves images, galleries, refs and the form switch at the top level", async () => {
    const [g, q, n] = await project(
      [gallery, quoteList, newsletter],
      [asset, quote, off],
    );
    expect((g.images as { url: string }[])[0].url).toBe("https://cdn/a.jpg");
    expect((q.quotes as { author: string }[])[0].author).toBe("Ann");
    expect(n.enabled).toBe(false);
  });

  it.each([
    [
      "prose",
      (content: unknown[]) => ({ _type: "module.prose", _key: "c", content }),
    ],
    [
      "callout",
      (content: unknown[]) => ({ _type: "module.callout", _key: "c", content }),
    ],
    [
      "card",
      (content: unknown[]) => ({
        _type: "module.card-list",
        _key: "c",
        cards: [{ _key: "k", content }],
      }),
    ],
    [
      "accordion item",
      (content: unknown[]) => ({
        _type: "module.accordion-list",
        _key: "c",
        items: [{ _key: "k", content }],
      }),
    ],
    [
      "step",
      (content: unknown[]) => ({
        _type: "module.step-list",
        _key: "c",
        steps: [{ _key: "k", content }],
      }),
    ],
  ])("resolves blocks inside a %s's rich text", async (_, wrap) => {
    const [block] = await project(
      [wrap([image, gallery, quoteList, newsletter])],
      [asset, quote, off],
    );
    const content = (block.content ??
      (block.cards as { content: unknown }[] | undefined)?.[0]?.content ??
      (block.items as { content: unknown }[] | undefined)?.[0]?.content ??
      (block.steps as { content: unknown }[])[0].content) as Record<
      string,
      unknown
    >[];
    const [img, g, q, n] = content;
    expect((img.asset as { url: string }).url).toBe("https://cdn/a.jpg");
    expect((g.images as { url: string }[])[0].url).toBe("https://cdn/a.jpg");
    expect((q.quotes as { author: string }[])[0].author).toBe("Ann");
    expect(n.enabled).toBe(false);
  });

  it("resolves a card cta and keeps the card's nested content", async () => {
    const page = { _id: "about", _type: "page", slug: { current: "about" } };
    const [block] = await project(
      [
        {
          _type: "module.card-list",
          _key: "c",
          cards: [
            {
              _key: "k",
              cta: {
                label: "Go",
                link: { type: "internal", internal: { _ref: "about" } },
              },
              content: [image],
            },
          ],
        },
      ],
      [asset, page],
    );
    const card = (block.cards as Record<string, unknown>[])[0];
    expect((card.cta as { link: { href: string } }).link.href).toBe("/about");
    expect(
      ((card.content as Record<string, unknown>[])[0].asset as { url: string })
        .url,
    ).toBe("https://cdn/a.jpg");
  });
});
