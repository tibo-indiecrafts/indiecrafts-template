import type { FaqBlock } from "./schema";

export const faq11Key = "faq-11" as const;
export const faq11Namespace = "blocks.faq-11" as const;

export const faq11Sample: Omit<FaqBlock, "id"> = {
  type: "faq-11",
  titleKey: "blocks.faq-11.title",
  bodyKey: "blocks.faq-11.body",
  contactPromptKey: "blocks.faq-11.contactPrompt",
  contactLinkKey: "blocks.faq-11.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      questionKey: "blocks.faq-11.item1Question",
      answerKey: "blocks.faq-11.item1Answer",
    },
    {
      id: "item-2",
      questionKey: "blocks.faq-11.item2Question",
      answerKey: "blocks.faq-11.item2Answer",
    },
    {
      id: "item-3",
      questionKey: "blocks.faq-11.item3Question",
      answerKey: "blocks.faq-11.item3Answer",
    },
    {
      id: "item-4",
      questionKey: "blocks.faq-11.item4Question",
      answerKey: "blocks.faq-11.item4Answer",
    },
    {
      id: "item-5",
      questionKey: "blocks.faq-11.item5Question",
      answerKey: "blocks.faq-11.item5Answer",
    },
  ],
};
