import type { MessageKey } from "@/types/messages";

/**
 * Tailark `testimonials` — single large quote with avatar + author block.
 * Converted to template pattern: props-driven content, MessageKey strings.
 */
export type Testimonials1Block = {
  type: "testimonials-1";
  id: string;
  quoteKey: MessageKey;
  authorKey: MessageKey;
  roleKey?: MessageKey;
  /** Root-relative or absolute URL for the avatar image. */
  avatarUrl?: string;
};
