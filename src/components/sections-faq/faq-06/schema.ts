import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type FaqIcon = "package" | "creditCard" | "helpCircle";

export type FaqItem = {
  id: string;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqCategory = {
  iconKey: FaqIcon;
  titleKey: MessageKey;
  items: ReadonlyArray<FaqItem>;
};

export type FaqBlock = {
  type: "faq-06";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  categories: ReadonlyArray<FaqCategory>;
  contactPromptKey: MessageKey;
  contactLinkKey: MessageKey;
  contactHref: StaticAppPathname | `http${string}` | `#${string}`;
};
