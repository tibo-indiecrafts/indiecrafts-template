import type { Faq2Block } from "./schema";

export const faq2Sample: Omit<Faq2Block, "id"> = {
  type: "faq-2",
  titleKey: "blocks.faq-2.title",
  bodyKey: "blocks.faq-2.body",
  items: [
    {
      id: "shipping",
      questionKey: "blocks.faq-2.items.shipping.q",
      answerKey: "blocks.faq-2.items.shipping.a",
    },
    {
      id: "payment",
      questionKey: "blocks.faq-2.items.payment.q",
      answerKey: "blocks.faq-2.items.payment.a",
    },
    {
      id: "changes",
      questionKey: "blocks.faq-2.items.changes.q",
      answerKey: "blocks.faq-2.items.changes.a",
    },
    {
      id: "international",
      questionKey: "blocks.faq-2.items.international.q",
      answerKey: "blocks.faq-2.items.international.a",
    },
    {
      id: "returns",
      questionKey: "blocks.faq-2.items.returns.q",
      answerKey: "blocks.faq-2.items.returns.a",
    },
  ],
  supportTextKey: "blocks.faq-2.support.text",
  supportLinkKey: "blocks.faq-2.support.link",
  supportHref: "#contact",
};
