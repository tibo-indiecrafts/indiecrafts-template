import type { MessageKey } from "@/types/messages";

/**
 * Tailark `content-4` — image-less 2-column: heading on left, two paragraphs
 * + CTA on the right.
 */
export type ContentBlock = {
  type: "content-04";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  ctaLabelKey?: MessageKey;
  ctaHref: string;
};
