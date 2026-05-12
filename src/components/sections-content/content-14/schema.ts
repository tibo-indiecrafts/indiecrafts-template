import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-3` (named `content-14` locally to continue
 * the zero-padded sequence). Two-column grid that pairs a small
 * heading + square image card + paragraph using CSS `grid-rows-
 * subgrid` so columns align across all three rows. Each item's
 * paragraph supports inline `<strong>` markup via `t.rich(...)`.
 */
export type ContentItem = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
  altKey: MessageKey;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type ContentBlock = {
  type: "content-14";
  id: string;
  items: ReadonlyArray<ContentItem>;
};
