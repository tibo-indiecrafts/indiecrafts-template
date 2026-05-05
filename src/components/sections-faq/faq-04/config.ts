import type { FaqBlock } from "./schema";

export const faq04Key = "faq-04" as const;
export const faq04Namespace = "blocks.faq-04" as const;

export const faq04Sample: Omit<FaqBlock, "id"> = {
  type: "faq-04",
  titleKey: "blocks.faq-04.title",
  bodyKey: "blocks.faq-04.body",
  items: [
    {
      id: "shipping",
      questionKey: "blocks.faq-04.items.shipping.q",
      answerKey: "blocks.faq-04.items.shipping.a",
    },
    {
      id: "payment",
      questionKey: "blocks.faq-04.items.payment.q",
      answerKey: "blocks.faq-04.items.payment.a",
    },
    {
      id: "changes",
      questionKey: "blocks.faq-04.items.changes.q",
      answerKey: "blocks.faq-04.items.changes.a",
    },
    {
      id: "international",
      questionKey: "blocks.faq-04.items.international.q",
      answerKey: "blocks.faq-04.items.international.a",
    },
    {
      id: "returns",
      questionKey: "blocks.faq-04.items.returns.q",
      answerKey: "blocks.faq-04.items.returns.a",
    },
  ],
  supportTextKey: "blocks.faq-04.support.text",
  supportLinkKey: "blocks.faq-04.support.link",
  supportHref: "#contact",
};
