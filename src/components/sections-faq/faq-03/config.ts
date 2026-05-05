import type { FaqBlock } from "./schema";

export const faq03Key = "faq-03" as const;
export const faq03Namespace = "blocks.faq-03" as const;

export const faq03Sample: Omit<FaqBlock, "id"> = {
  type: "faq-03",
  titleKey: "blocks.faq-03.title",
  supportTextKey: "blocks.faq-03.support.text",
  supportLinkKey: "blocks.faq-03.support.link",
  supportHref: "#contact",
  items: [
    {
      id: "hours",
      icon: "clock",
      questionKey: "blocks.faq-03.items.hours.q",
      answerKey: "blocks.faq-03.items.hours.a",
    },
    {
      id: "subscription",
      icon: "credit-card",
      questionKey: "blocks.faq-03.items.subscription.q",
      answerKey: "blocks.faq-03.items.subscription.a",
    },
    {
      id: "expedited",
      icon: "truck",
      questionKey: "blocks.faq-03.items.expedited.q",
      answerKey: "blocks.faq-03.items.expedited.a",
    },
    {
      id: "localized",
      icon: "globe",
      questionKey: "blocks.faq-03.items.localized.q",
      answerKey: "blocks.faq-03.items.localized.a",
    },
    {
      id: "tracking",
      icon: "package",
      questionKey: "blocks.faq-03.items.tracking.q",
      answerKey: "blocks.faq-03.items.tracking.a",
    },
  ],
};
