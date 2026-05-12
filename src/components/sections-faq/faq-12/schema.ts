import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FaqIcon = "clock" | "creditCard" | "truck" | "globe" | "package";

export type FaqItem = {
  id: string;
  iconKey: FaqIcon;
  questionKey: MessageKey;
  answerKey: MessageKey;
};

export type FaqBlock = {
  type: "faq-12";
  id: string;
  titleKey: MessageKey;
  contactPromptKey: MessageKey;
  contactLinkKey: MessageKey;
  contactHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: ReadonlyArray<FaqItem>;
};
