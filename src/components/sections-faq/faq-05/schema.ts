import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type FaqItem = {
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqBlock = {
  type: "faq-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<FaqItem>;
  contactPromptKey: MessageKey;
  contactLinkKey: MessageKey;
  contactHref: StaticAppPathname | `http${string}` | `#${string}`;
};
