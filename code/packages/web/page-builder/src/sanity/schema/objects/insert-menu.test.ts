import { describe, expect, it } from "vitest";
import { MODULE_TYPES } from "../modules";
import { blockInsertMenu } from "./insert-menu";

const names = (types: readonly string[]) =>
  blockInsertMenu(types).groups.map((g) => g.name);

describe("blockInsertMenu", () => {
  it("puts every accepted block in exactly one group", () => {
    const types = [...MODULE_TYPES, "module.blog-featured", "module.x"];
    const listed = blockInsertMenu(types).groups.flatMap((g) => g.of);
    expect([...listed].sort()).toEqual([...types].sort());
  });

  it("files every generic block under a named group, never 'Autres'", () => {
    expect(names(MODULE_TYPES)).toEqual([
      "layout",
      "content",
      "media",
      "forms",
    ]);
  });

  it("drops groups the array does not accept, and groups blog blocks", () => {
    expect(names(["module.callout", "module.blog-trending"])).toEqual([
      "content",
      "blog",
    ]);
  });
});
