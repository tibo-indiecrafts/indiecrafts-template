import type { FaqBlock } from "./schema";

export const faq08Key = "faq-08" as const;
export const faq08Namespace = "blocks.faq-08" as const;

export const faq08Sample: Omit<FaqBlock, "id"> = {
  type: "faq-08",
  titleKey: "blocks.faq-08.title",
  bodyKey: "blocks.faq-08.body",
  contactPromptKey: "blocks.faq-08.contactPrompt",
  contactLinkKey: "blocks.faq-08.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      questionKey: "blocks.faq-08.item1Question",
      answerKey: "blocks.faq-08.item1Answer",
    },
    {
      id: "item-2",
      questionKey: "blocks.faq-08.item2Question",
      answerKey: "blocks.faq-08.item2Answer",
    },
    {
      id: "item-3",
      questionKey: "blocks.faq-08.item3Question",
      answerKey: "blocks.faq-08.item3Answer",
    },
    {
      id: "item-4",
      questionKey: "blocks.faq-08.item4Question",
      answerKey: "blocks.faq-08.item4Answer",
    },
    {
      id: "item-5",
      questionKey: "blocks.faq-08.item5Question",
      answerKey: "blocks.faq-08.item5Answer",
    },
  ],
};
