import type { FaqBlock } from "./schema";

export const faq05Key = "faq-05" as const;
export const faq05Namespace = "blocks.faq-05" as const;

export const faq05Sample: Omit<FaqBlock, "id"> = {
  type: "faq-05",
  titleKey: "blocks.faq-05.title",
  bodyKey: "blocks.faq-05.body",
  contactPromptKey: "blocks.faq-05.contactPrompt",
  contactLinkKey: "blocks.faq-05.contactLink",
  contactHref: "#",
  items: [
    {
      questionKey: "blocks.faq-05.items.trial.question",
      answerKey: "blocks.faq-05.items.trial.answer",
    },
    {
      questionKey: "blocks.faq-05.items.changePlan.question",
      answerKey: "blocks.faq-05.items.changePlan.answer",
    },
    {
      questionKey: "blocks.faq-05.items.payment.question",
      answerKey: "blocks.faq-05.items.payment.answer",
    },
    {
      questionKey: "blocks.faq-05.items.setupFee.question",
      answerKey: "blocks.faq-05.items.setupFee.answer",
    },
    {
      questionKey: "blocks.faq-05.items.refunds.question",
      answerKey: "blocks.faq-05.items.refunds.answer",
    },
    {
      questionKey: "blocks.faq-05.items.cancel.question",
      answerKey: "blocks.faq-05.items.cancel.answer",
    },
  ],
};
