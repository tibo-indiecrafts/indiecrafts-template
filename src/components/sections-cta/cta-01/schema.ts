import type { MessageKey } from "@/types/messages";

/**
 * Tailark `call-to-action` block converted to the template's typed/i18n pattern:
 *   - Every visible string becomes a `MessageKey` field, resolved via next-intl.
 *   - Theme tokens replace Tailark's `bg-zinc-*` / raw hex.
 *   - `<section aria-labelledby>` landmark.
 */
export type CallToActionBlock = {
  type: "cta-01";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  emailPlaceholderKey?: MessageKey;
  submitLabelKey?: MessageKey;
};
