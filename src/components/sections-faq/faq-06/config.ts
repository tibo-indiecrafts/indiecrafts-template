import type { FaqBlock } from "./schema";

export const faq06Key = "faq-06" as const;
export const faq06Namespace = "blocks.faq-06" as const;

export const faq06Sample: Omit<FaqBlock, "id"> = {
  type: "faq-06",
  titleKey: "blocks.faq-06.title",
  bodyKey: "blocks.faq-06.body",
  contactPromptKey: "blocks.faq-06.contactPrompt",
  contactLinkKey: "blocks.faq-06.contactLink",
  contactHref: "#",
  categories: [
    {
      iconKey: "package",
      titleKey: "blocks.faq-06.gettingStartedTitle",
      items: [
        {
          id: "gs-1",
          questionKey: "blocks.faq-06.gettingStarted1Question",
          answerKey: "blocks.faq-06.gettingStarted1Answer",
        },
        {
          id: "gs-2",
          questionKey: "blocks.faq-06.gettingStarted2Question",
          answerKey: "blocks.faq-06.gettingStarted2Answer",
        },
      ],
    },
    {
      iconKey: "creditCard",
      titleKey: "blocks.faq-06.billingTitle",
      items: [
        {
          id: "b-1",
          questionKey: "blocks.faq-06.billing1Question",
          answerKey: "blocks.faq-06.billing1Answer",
        },
        {
          id: "b-2",
          questionKey: "blocks.faq-06.billing2Question",
          answerKey: "blocks.faq-06.billing2Answer",
        },
      ],
    },
    {
      iconKey: "helpCircle",
      titleKey: "blocks.faq-06.supportTitle",
      items: [
        {
          id: "s-1",
          questionKey: "blocks.faq-06.support1Question",
          answerKey: "blocks.faq-06.support1Answer",
        },
        {
          id: "s-2",
          questionKey: "blocks.faq-06.support2Question",
          answerKey: "blocks.faq-06.support2Answer",
        },
      ],
    },
  ],
};
