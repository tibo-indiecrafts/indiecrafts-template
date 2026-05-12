import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-01";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  quoteKey?: MessageKey;
  quoteAuthorKey?: MessageKey;

  imageLightUrl: string;
  imageDarkUrl?: string;

  imageAltKey?: MessageKey;
};
