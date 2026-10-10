import { describe, expect, it } from "vitest";
import { INLINE_MODULES } from "@indiecrafts/packages-web-page-builder/sanity/schema/blockContent";
import { INLINE_TYPES } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";

// The Studio picker (`INLINE_MODULES`) and the renderer map (`INLINE_TYPES`) live in two bricks.
// A block insertable in rich text with no renderer would vanish from the page; this keeps them equal.
describe("inline blocks", () => {
  it("every block insertable in rich text has an inline renderer, and no more", () => {
    expect([...INLINE_TYPES].sort()).toEqual([...INLINE_MODULES].sort());
  });
});
