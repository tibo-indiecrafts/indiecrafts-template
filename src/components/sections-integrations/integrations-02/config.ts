import type { IntegrationsBlock } from "./schema";

export const integrations02Key = "integrations-02" as const;
export const integrations02Namespace = "blocks.integrations-02" as const;

const SHARED_HREF = "https://github.com/meschacirung/cnblocks";

export const integrations02Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-02",
  cards: [
    {
      iconKey: "gemini",
      titleKey: "blocks.integrations-02.cards.card1.title",
      bodyKey: "blocks.integrations-02.cards.card1.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "replit",
      titleKey: "blocks.integrations-02.cards.card2.title",
      bodyKey: "blocks.integrations-02.cards.card2.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "mistralAi",
      titleKey: "blocks.integrations-02.cards.card3.title",
      bodyKey: "blocks.integrations-02.cards.card3.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "vsCodium",
      titleKey: "blocks.integrations-02.cards.card4.title",
      bodyKey: "blocks.integrations-02.cards.card4.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "mediaWiki",
      titleKey: "blocks.integrations-02.cards.card5.title",
      bodyKey: "blocks.integrations-02.cards.card5.body",
      href: SHARED_HREF,
    },
    {
      iconKey: "googlePalm",
      titleKey: "blocks.integrations-02.cards.card6.title",
      bodyKey: "blocks.integrations-02.cards.card6.body",
      href: SHARED_HREF,
    },
  ],
};
