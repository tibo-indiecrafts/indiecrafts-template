import type { Faq1Block } from "./schema";

export const faq1Sample: Omit<Faq1Block, "id"> = {
  type: "faq-1",
  titleKey: "blocks.faq-1.title",
  bodyKey: "blocks.faq-1.body",
  items: [
    {
      id: "refund",
      questionKey: "blocks.faq-1.items.refund.q",
      answerKey: "blocks.faq-1.items.refund.a",
    },
    {
      id: "cancel",
      questionKey: "blocks.faq-1.items.cancel.q",
      answerKey: "blocks.faq-1.items.cancel.a",
    },
    {
      id: "upgrade",
      questionKey: "blocks.faq-1.items.upgrade.q",
      answerKey: "blocks.faq-1.items.upgrade.a",
    },
    {
      id: "phone",
      questionKey: "blocks.faq-1.items.phone.q",
      answerKey: "blocks.faq-1.items.phone.a",
    },
  ],
};
