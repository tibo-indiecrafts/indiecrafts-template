import type { FaqBlock } from "./schema";

export const faq07Key = "faq-07" as const;
export const faq07Namespace = "blocks.faq-07" as const;

export const faq07Sample: Omit<FaqBlock, "id"> = {
  type: "faq-07",
  titleKey: "blocks.faq-07.title",
  contactPromptKey: "blocks.faq-07.contactPrompt",
  contactLinkKey: "blocks.faq-07.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      questionKey: "blocks.faq-07.item1Question",
      answerKey: "blocks.faq-07.item1Answer",
    },
    {
      id: "item-2",
      questionKey: "blocks.faq-07.item2Question",
      answerKey: "blocks.faq-07.item2Answer",
    },
    {
      id: "item-3",
      questionKey: "blocks.faq-07.item3Question",
      answerKey: "blocks.faq-07.item3Answer",
    },
    {
      id: "item-4",
      questionKey: "blocks.faq-07.item4Question",
      answerKey: "blocks.faq-07.item4Answer",
    },
    {
      id: "item-5",
      questionKey: "blocks.faq-07.item5Question",
      answerKey: "blocks.faq-07.item5Answer",
    },
  ],
};
