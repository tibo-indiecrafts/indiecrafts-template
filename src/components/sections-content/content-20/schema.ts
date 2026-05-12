import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-2-landing-one` Manifesto — JSX verbatim.
 * Same collapsible essay shape as content-19 but rendered inside
 * the grid-2 `Container` (not asGrid) with different padding.
 */
export type ContentBlock = {
  type: "content-20";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  readMoreLabelKey: MessageKey;
  readLessLabelKey: MessageKey;
};
