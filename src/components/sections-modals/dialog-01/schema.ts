import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-01` — success confirmation modal:
 * centered green check, title, description, single full-width CTA.
 * All copy resolves through `blocks.dialog-01.*`.
 */
export type DialogBlock = {
  type: "dialog-01";
  id: string;
  /** Open the dialog on mount — defaults `true` so Storybook displays it. */
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  ctaKey?: MessageKey;
};
