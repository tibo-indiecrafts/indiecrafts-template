import type { FaqBlock } from "./schema";

export const faq02Key = "faq-02" as const;
export const faq02Namespace = "blocks.faq-02" as const;

export const faq02Sample: Omit<FaqBlock, "id"> = {
  type: "faq-02",
  titleKey: "blocks.faq-02.title",
  bodyKey: "blocks.faq-02.body",
  items: [
    {
      id: "shipping",
      questionKey: "blocks.faq-02.items.shipping.q",
      answerKey: "blocks.faq-02.items.shipping.a",
    },
    {
      id: "payment",
      questionKey: "blocks.faq-02.items.payment.q",
      answerKey: "blocks.faq-02.items.payment.a",
    },
    {
      id: "changes",
      questionKey: "blocks.faq-02.items.changes.q",
      answerKey: "blocks.faq-02.items.changes.a",
    },
    {
      id: "international",
      questionKey: "blocks.faq-02.items.international.q",
      answerKey: "blocks.faq-02.items.international.a",
    },
    {
      id: "returns",
      questionKey: "blocks.faq-02.items.returns.q",
      answerKey: "blocks.faq-02.items.returns.a",
    },
  ],
  supportTextKey: "blocks.faq-02.support.text",
  supportLinkKey: "blocks.faq-02.support.link",
  supportHref: "#contact",
};
