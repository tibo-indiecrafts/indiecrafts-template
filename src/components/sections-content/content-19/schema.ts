import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-1-landing-one` Manifesto — JSX verbatim. The
 * collapsible-essay pattern from content-12, but rendered inside
 * the grid-1 `Container` (bordered grid frame) with a corner-tagged
 * Read More toggle below the body. Same five paragraphs.
 */
export type ContentBlock = {
  type: "content-19";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  readMoreLabelKey: MessageKey;
  readLessLabelKey: MessageKey;
};
