import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-04";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  ctaLabelKey?: MessageKey;
  ctaHref: string;
};
