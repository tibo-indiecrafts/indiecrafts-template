import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-6` (named `content-17` locally to continue
 * the zero-padded sequence). Headline-image-paragraphs vertical
 * stack: large muted heading at the top (with inline `<strong>`),
 * a featured aspect-video image card, then a two-column grid of
 * supporting paragraphs. Heading and each paragraph support rich
 * markup via `t.rich(...)`.
 */
export type ContentBlock = {
  type: "content-17";
  id: string;
  titleKey: MessageKey;
  bodyKeys: ReadonlyArray<MessageKey>;
  image: {
    src: string;
    width: number;
    height: number;
    altKey: MessageKey;
  };
};
