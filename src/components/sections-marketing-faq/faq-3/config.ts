import type { Faq3Block } from "./schema";

export const faq3Sample: Omit<Faq3Block, "id"> = {
  type: "faq-3",
  titleKey: "blocks.faq-3.title",
  supportTextKey: "blocks.faq-3.support.text",
  supportLinkKey: "blocks.faq-3.support.link",
  supportHref: "#contact",
  items: [
    {
      id: "hours",
      icon: "clock",
      questionKey: "blocks.faq-3.items.hours.q",
      answerKey: "blocks.faq-3.items.hours.a",
    },
    {
      id: "subscription",
      icon: "credit-card",
      questionKey: "blocks.faq-3.items.subscription.q",
      answerKey: "blocks.faq-3.items.subscription.a",
    },
    {
      id: "expedited",
      icon: "truck",
      questionKey: "blocks.faq-3.items.expedited.q",
      answerKey: "blocks.faq-3.items.expedited.a",
    },
    {
      id: "localized",
      icon: "globe",
      questionKey: "blocks.faq-3.items.localized.q",
      answerKey: "blocks.faq-3.items.localized.a",
    },
    {
      id: "tracking",
      icon: "package",
      questionKey: "blocks.faq-3.items.tracking.q",
      answerKey: "blocks.faq-3.items.tracking.a",
    },
  ],
};
