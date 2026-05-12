import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-1` (named `content-12` locally to continue
 * the zero-padded sequence) — collapsible long-form essay block.
 * `bg-card` rounded panel with a "Read More / Read Less" toggle
 * pinned bottom-left. Body initially shows ~22rem with a
 * `mask-b-from-45%` fade-out, expanding to natural height when
 * toggled.
 *
 * `paragraphKeys` is an open-ended array — each MessageKey supports
 * inline `<strong>` markup via `t.rich(...)`. Add or remove
 * paragraphs by editing the config.
 */
export type ContentBlock = {
  type: "content-12";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  readMoreLabelKey: MessageKey;
  readLessLabelKey: MessageKey;
};
