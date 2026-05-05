import type { FeaturesBlock } from "./schema";

export const features24Key = "features-24" as const;
export const features24Namespace = "blocks.features-24" as const;

export const features24Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-24",
  titleKey: "blocks.features-24.title",
  bodyKey: "blocks.features-24.body",
  ctaLabelKey: "blocks.features-24.cta",
  ctaHref: "#",
  ideListLabelKey: "blocks.features-24.ideListLabel",
  ides: ["intellij", "vsCode", "windsurf"],
  screenshotUrl:
    "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/tailark_zazuhl.png",
  screenshotAltKey: "blocks.features-24.screenshotAlt",
  cards: [
    {
      illustration: "invoice",
      titleKey: "blocks.features-24.cards.invoicing.title",
      bodyKey: "blocks.features-24.cards.invoicing.body",
    },
    {
      illustration: "integrations",
      titleKey: "blocks.features-24.cards.integrations.title",
      bodyKey: "blocks.features-24.cards.integrations.body",
    },
  ],
  stats: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-24.stats.fast.title",
      bodyKey: "blocks.features-24.stats.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-24.stats.powerful.title",
      bodyKey: "blocks.features-24.stats.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-24.stats.security.title",
      bodyKey: "blocks.features-24.stats.security.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-24.stats.aiPowered.title",
      bodyKey: "blocks.features-24.stats.aiPowered.body",
    },
  ],
};
