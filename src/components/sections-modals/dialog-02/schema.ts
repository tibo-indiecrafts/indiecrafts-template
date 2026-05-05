import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-02` — success confirmation modal with
 * a two-button split footer (primary + secondary). All copy resolves
 * through `blocks.dialog-02.*`.
 */
export type DialogBlock = {
  type: "dialog-02";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  primaryCtaKey?: MessageKey;
  secondaryCtaKey?: MessageKey;
};
