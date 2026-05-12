import type { IntegrationsBlock } from "./schema";

export const integrations1Key = "integrations-1" as const;
export const integrations1Namespace = "blocks.integrations-1" as const;

const SHARED_HREF = "https://github.com/meschacirung/cnblocks";

export const integrations1Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-1",
  cards: [
    {
      iconKey: "gemini",
      titleKey: "blocks.integrations-1.cards.card1.title",
      bodyKey: "blocks.integrations-1.cards.card1.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "replit",
      titleKey: "blocks.integrations-1.cards.card2.title",
      bodyKey: "blocks.integrations-1.cards.card2.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "mistralAi",
      titleKey: "blocks.integrations-1.cards.card3.title",
      bodyKey: "blocks.integrations-1.cards.card3.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "vsCodium",
      titleKey: "blocks.integrations-1.cards.card4.title",
      bodyKey: "blocks.integrations-1.cards.card4.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "mediaWiki",
      titleKey: "blocks.integrations-1.cards.card5.title",
      bodyKey: "blocks.integrations-1.cards.card5.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "googlePalm",
      titleKey: "blocks.integrations-1.cards.card6.title",
      bodyKey: "blocks.integrations-1.cards.card6.body",
      href: SHARED_HREF,
    },
  ],
};
