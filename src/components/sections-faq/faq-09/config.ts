import type { FaqBlock } from "./schema";

export const faq09Key = "faq-09" as const;
export const faq09Namespace = "blocks.faq-09" as const;

export const faq09Sample: Omit<FaqBlock, "id"> = {
  type: "faq-09",
  titleKey: "blocks.faq-09.title",
  bodyKey: "blocks.faq-09.body",
  contactPromptKey: "blocks.faq-09.contactPrompt",
  contactLinkKey: "blocks.faq-09.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      questionKey: "blocks.faq-09.item1Question",
      answerKey: "blocks.faq-09.item1Answer",
    },
    {
      id: "item-2",
      questionKey: "blocks.faq-09.item2Question",
      answerKey: "blocks.faq-09.item2Answer",
    },
    {
      id: "item-3",
      questionKey: "blocks.faq-09.item3Question",
      answerKey: "blocks.faq-09.item3Answer",
    },
    {
      id: "item-4",
      questionKey: "blocks.faq-09.item4Question",
      answerKey: "blocks.faq-09.item4Answer",
    },
    {
      id: "item-5",
      questionKey: "blocks.faq-09.item5Question",
      answerKey: "blocks.faq-09.item5Answer",
    },
  ],
};
