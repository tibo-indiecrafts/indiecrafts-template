import type { MessageKey } from "@/types/messages";
import type { FaqItem } from "@/components/sections-faq/faq-01/schema";

export type { FaqItem };

export type FaqBlock = {
  type: "faq-02";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  items: readonly FaqItem[];

  supportTextKey?: MessageKey;
  supportLinkKey?: MessageKey;
  supportHref?: string;
};
