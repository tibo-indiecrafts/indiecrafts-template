import type { FaqBlock } from "./schema";

export const faq10Key = "faq-10" as const;
export const faq10Namespace = "blocks.faq-10" as const;

export const faq10Sample: Omit<FaqBlock, "id"> = {
  type: "faq-10",
  titleKey: "blocks.faq-10.title",
  contactPromptKey: "blocks.faq-10.contactPrompt",
  contactLinkKey: "blocks.faq-10.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      questionKey: "blocks.faq-10.item1Question",
      answerKey: "blocks.faq-10.item1Answer",
    },
    {
      id: "item-2",
      questionKey: "blocks.faq-10.item2Question",
      answerKey: "blocks.faq-10.item2Answer",
    },
    {
      id: "item-3",
      questionKey: "blocks.faq-10.item3Question",
      answerKey: "blocks.faq-10.item3Answer",
    },
    {
      id: "item-4",
      questionKey: "blocks.faq-10.item4Question",
      answerKey: "blocks.faq-10.item4Answer",
    },
    {
      id: "item-5",
      questionKey: "blocks.faq-10.item5Question",
      answerKey: "blocks.faq-10.item5Answer",
    },
  ],
};
