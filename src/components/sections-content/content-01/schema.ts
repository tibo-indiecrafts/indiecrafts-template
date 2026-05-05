import type { MessageKey } from "@/types/messages";

/**
 * Tailark `content-1` block converted to the template's typed/i18n pattern.
 * Two-column editorial layout: image on the left, copy + quote on the right.
 */
export type ContentBlock = {
  type: "content-01";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  quoteKey?: MessageKey;
  quoteAuthorKey?: MessageKey;
  /** Public path or absolute URL. `dark` optional fallback to `light`. */
  imageLightUrl: string;
  imageDarkUrl?: string;
  /** Pure-decoration images still need accessible alt text when not purely decorative. */
  imageAltKey?: MessageKey;
};
