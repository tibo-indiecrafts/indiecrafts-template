import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { MODULES_FRAGMENT } from "./queries";
import { resolveSidebar, sidebarSettingsQuery } from "./sidebar";

const a = { _key: "a" };
const b = { _key: "b" };
const c = { _key: "c" };

describe("resolveSidebar", () => {
  const settings = {
    default: [a],
    type: { mode: "custom" as const, blocks: [b] },
  };

  it("uses the document's own cards", () => {
    expect(resolveSidebar({ mode: "custom", blocks: [c] }, settings)).toEqual([
      c,
    ]);
  });

  it("shows nothing when the document says none, whatever the settings", () => {
    expect(resolveSidebar({ mode: "none" }, settings)).toEqual([]);
  });

  it("falls back to the page type's cards when the document inherits", () => {
    expect(resolveSidebar({ mode: "inherit" }, settings)).toEqual([b]);
    expect(resolveSidebar(undefined, settings)).toEqual([b]);
    expect(resolveSidebar(null, settings)).toEqual([b]);
  });

  it("shows nothing when the page type says none", () => {
    expect(
      resolveSidebar(undefined, { default: [a], type: { mode: "none" } }),
    ).toEqual([]);
  });

  it("falls back to the default when the page type inherits or is unset", () => {
    expect(
      resolveSidebar(undefined, { default: [a], type: { mode: "inherit" } }),
    ).toEqual([a]);
    expect(resolveSidebar(undefined, { default: [a] })).toEqual([a]);
  });

  it("shows nothing with no settings at all", () => {
    expect(resolveSidebar(undefined, null)).toEqual([]);
    expect(resolveSidebar({ mode: "custom" }, null)).toEqual([]);
  });
});

describe("sidebarSettingsQuery", () => {
  const run = async (pageType: string) =>
    (await (
      await evaluate(parse(sidebarSettingsQuery(MODULES_FRAGMENT, pageType)), {
        dataset: [
          {
            _id: "sidebarSettings-en",
            _type: "sidebarSettings",
            default: [
              { _key: "d", _type: "module.callout" },
              { _key: "h", _type: "module.callout", hidden: true },
            ],
            byType: {
              post: {
                mode: "custom",
                blocks: [{ _key: "p", _type: "module.newsletter" }],
              },
            },
          },
          { _id: "sidebarSettings-fr", _type: "sidebarSettings", default: [] },
        ],
        params: { locale: "en" },
      })
    ).get()) as {
      default: { _key: string }[];
      type: {
        mode: string;
        blocks: { _key: string; enabled?: boolean }[];
      } | null;
    };

  it("reads the locale's default, without hidden cards", async () => {
    expect((await run("post")).default.map((x) => x._key)).toEqual(["d"]);
  });

  it("reads only the requested page type, its cards resolved", async () => {
    const { type } = await run("post");
    expect(type?.mode).toBe("custom");
    expect(type?.blocks[0]).toMatchObject({ _key: "p", enabled: true });
    expect((await run("page")).type).toBeNull();
  });

  it("refuses a page type that is not a plain field name", () => {
    expect(() => sidebarSettingsQuery(MODULES_FRAGMENT, "post}{x")).toThrow();
  });
});
