import type { FaqBlock } from "./schema";

export const faq01Key = "faq-01" as const;
export const faq01Namespace = "blocks.faq-01" as const;

export const faq01Sample: Omit<FaqBlock, "id"> = {
  type: "faq-01",
  titleKey: "blocks.faq-01.title",
  bodyKey: "blocks.faq-01.body",
  items: [
    {
      id: "refund",
      questionKey: "blocks.faq-01.items.refund.q",
      answerKey: "blocks.faq-01.items.refund.a",
    },
    {
      id: "cancel",
      questionKey: "blocks.faq-01.items.cancel.q",
      answerKey: "blocks.faq-01.items.cancel.a",
    },
    {
      id: "upgrade",
      questionKey: "blocks.faq-01.items.upgrade.q",
      answerKey: "blocks.faq-01.items.upgrade.a",
    },
    {
      id: "phone",
      questionKey: "blocks.faq-01.items.phone.q",
      answerKey: "blocks.faq-01.items.phone.a",
    },
  ],
};
