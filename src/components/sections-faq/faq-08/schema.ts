import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FaqItem = {
  id: string;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqBlock = {
  type: "faq-08";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<FaqItem>;
  contactPromptKey: MessageKey;
  contactLinkKey: MessageKey;
  contactHref: StaticAppPathname | `http${string}` | `#${string}`;
};
