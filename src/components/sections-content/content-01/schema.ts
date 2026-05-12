import type { MessageKey } from "@/types/messages";

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
