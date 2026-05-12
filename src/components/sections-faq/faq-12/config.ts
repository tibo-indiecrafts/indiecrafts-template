import type { FaqBlock } from "./schema";

export const faq12Key = "faq-12" as const;
export const faq12Namespace = "blocks.faq-12" as const;

export const faq12Sample: Omit<FaqBlock, "id"> = {
  type: "faq-12",
  titleKey: "blocks.faq-12.title",
  contactPromptKey: "blocks.faq-12.contactPrompt",
  contactLinkKey: "blocks.faq-12.contactLink",
  contactHref: "#",
  items: [
    {
      id: "item-1",
      iconKey: "clock",
      questionKey: "blocks.faq-12.item1Question",
      answerKey: "blocks.faq-12.item1Answer",
    },
    {
      id: "item-2",
      iconKey: "creditCard",
      questionKey: "blocks.faq-12.item2Question",
      answerKey: "blocks.faq-12.item2Answer",
    },
    {
      id: "item-3",
      iconKey: "truck",
      questionKey: "blocks.faq-12.item3Question",
      answerKey: "blocks.faq-12.item3Answer",
    },
    {
      id: "item-4",
      iconKey: "globe",
      questionKey: "blocks.faq-12.item4Question",
      answerKey: "blocks.faq-12.item4Answer",
    },
    {
      id: "item-5",
      iconKey: "package",
      questionKey: "blocks.faq-12.item5Question",
      answerKey: "blocks.faq-12.item5Answer",
    },
  ],
};
