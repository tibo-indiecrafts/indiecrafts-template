import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { pageBySlugQuery } from "./page-queries";

// `groq-js` runs the real query string against an in-memory dataset.
const sections = async (dataset: unknown[]) => {
  const page = (await (
    await evaluate(parse(pageBySlugQuery), {
      dataset,
      params: { slug: "p", locale: "en" },
    })
  ).get()) as { sections: { _type: string; enabled?: boolean }[] };
  return Object.fromEntries(page.sections.map((s) => [s._type, s.enabled]));
};

const page = {
  _id: "page.p",
  _type: "page",
  language: "en",
  slug: { current: "p" },
  sections: [
    { _key: "c", _type: "module.contact" },
    { _key: "w", _type: "module.waitlist" },
    { _key: "n", _type: "module.newsletter" },
    { _key: "l", _type: "module.lead-magnet" },
  ],
};

describe("form blocks carry their feature's Studio switch", () => {
  it("a switch turned off reaches every block of that feature", async () => {
    expect(
      await sections([
        page,
        { _id: "contactSettings", _type: "contactSettings", enabled: false },
        { _id: "waitlistSettings", _type: "waitlistSettings", enabled: true },
        { _id: "newsletterSettings", _type: "newsletterSettings", enabled: false },
      ]),
    ).toEqual({
      "module.contact": false,
      "module.waitlist": true,
      "module.newsletter": false,
      "module.lead-magnet": false,
    });
  });

  it("a missing settings document or an unset switch reads as on", async () => {
    expect(
      await sections([page, { _id: "contactSettings", _type: "contactSettings" }]),
    ).toEqual({
      "module.contact": true,
      "module.waitlist": true,
      "module.newsletter": true,
      "module.lead-magnet": true,
    });
  });

  it("reaches a form inside a container's rich text (prose, card)", async () => {
    const nested = {
      ...page,
      sections: [
        {
          _key: "p",
          _type: "module.prose",
          content: [{ _key: "c", _type: "module.contact" }],
        },
        {
          _key: "k",
          _type: "module.card-list",
          cards: [{ _key: "1", content: [{ _key: "w", _type: "module.waitlist" }] }],
        },
      ],
    };
    const result = (await (
      await evaluate(parse(pageBySlugQuery), {
        dataset: [
          nested,
          { _id: "contactSettings", _type: "contactSettings", enabled: false },
        ],
        params: { slug: "p", locale: "en" },
      })
    ).get()) as {
      sections: [
        { content: { enabled?: boolean }[] },
        { cards: { content: { enabled?: boolean }[] }[] },
      ];
    };
    expect(result.sections[0].content[0]?.enabled).toBe(false);
    expect(result.sections[1].cards[0]?.content[0]?.enabled).toBe(true);
  });
});

describe("pageBySlugQuery", () => {
  const find = async (seo?: Record<string, unknown>) =>
    (await (
      await evaluate(parse(pageBySlugQuery), {
        dataset: [{ ...page, seo }],
        params: { slug: "p", locale: "en" },
      })
    ).get()) as unknown;

  it("finds a published page", async () => {
    expect(await find()).not.toBeNull();
    expect(await find({ noIndex: true })).not.toBeNull();
  });

  it("finds no page marked unpublished, so the route 404s", async () => {
    expect(await find({ unpublished: true })).toBeNull();
  });
});
