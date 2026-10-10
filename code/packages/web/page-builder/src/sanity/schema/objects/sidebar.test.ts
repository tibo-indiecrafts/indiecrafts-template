import { describe, expect, it } from "vitest";
import { GENERIC_SIDEBAR_TYPES, SIDEBAR_MAX, sidebarSchemas } from "./sidebar";

type Field = {
  name: string;
  type: string;
  fields?: Field[];
  hidden?: (ctx: { parent?: unknown }) => boolean;
};
type Def = {
  name: string;
  type: string;
  of?: { type: string }[];
  fields?: Field[];
};

const [blocks, sidebar, settings] = sidebarSchemas(
  [...GENERIC_SIDEBAR_TYPES, "module.blog-toc"],
  [
    { name: "post", title: "Articles" },
    { name: "page", title: "Pages" },
  ],
) as unknown as Def[];

describe("sidebarSchemas", () => {
  it("lists exactly the given card types", () => {
    expect(blocks.name).toBe("sidebarBlocks");
    expect(blocks.of?.map((m) => m.type)).toEqual([
      ...GENERIC_SIDEBAR_TYPES,
      "module.blog-toc",
    ]);
    expect(SIDEBAR_MAX).toBe(6);
  });

  it("shows a sidebar's cards only in custom mode", () => {
    const cards = sidebar.fields!.find((f) => f.name === "blocks")!;
    expect(cards.type).toBe("sidebarBlocks");
    expect(cards.hidden!({ parent: { mode: "custom" } })).toBe(false);
    expect(cards.hidden!({ parent: { mode: "inherit" } })).toBe(true);
    expect(cards.hidden!({ parent: undefined })).toBe(true);
  });

  it("gives the settings a default and one sidebar per page type", () => {
    expect(settings.name).toBe("sidebarSettings");
    const byType = settings.fields!.find((f) => f.name === "byType")!;
    expect(byType.fields!.map((f) => [f.name, f.type])).toEqual([
      ["post", "sidebar"],
      ["page", "sidebar"],
    ]);
    expect(settings.fields!.find((f) => f.name === "default")!.type).toBe(
      "sidebarBlocks",
    );
  });
});
