import type { Faq4Block } from "./schema";

export const faq4Sample: Omit<Faq4Block, "id"> = {
  type: "faq-4",
  titleKey: "blocks.faq-4.title",
  bodyKey: "blocks.faq-4.body",
  items: [
    {
      id: "shipping",
      questionKey: "blocks.faq-4.items.shipping.q",
      answerKey: "blocks.faq-4.items.shipping.a",
    },
    {
      id: "payment",
      questionKey: "blocks.faq-4.items.payment.q",
      answerKey: "blocks.faq-4.items.payment.a",
    },
    {
      id: "changes",
      questionKey: "blocks.faq-4.items.changes.q",
      answerKey: "blocks.faq-4.items.changes.a",
    },
    {
      id: "international",
      questionKey: "blocks.faq-4.items.international.q",
      answerKey: "blocks.faq-4.items.international.a",
    },
    {
      id: "returns",
      questionKey: "blocks.faq-4.items.returns.q",
      answerKey: "blocks.faq-4.items.returns.a",
    },
  ],
  supportTextKey: "blocks.faq-4.support.text",
  supportLinkKey: "blocks.faq-4.support.link",
  supportHref: "#contact",
};
