import type { IntegrationsBlock } from "./schema";

export const integrations17Key = "integrations-17" as const;
export const integrations17Namespace = "blocks.integrations-17" as const;

export const integrations17Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-17",
  titleKey: "blocks.integrations-17.title",
  bodyKey: "blocks.integrations-17.body",
  ctaLabelKey: "blocks.integrations-17.cta",
  ctaHref: "#",
  topRow: ["gemini", "replit"],
  middleRow: ["magicUi", "vsCodium"],
  bottomRow: ["mediaWiki", "googlePalm"],
};
