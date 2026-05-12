import type { IntegrationsBlock } from "./schema";

export const integrations18Key = "integrations-18" as const;
export const integrations18Namespace = "blocks.integrations-18" as const;

export const integrations18Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-18",
  titleKey: "blocks.integrations-18.title",
  bodyKey: "blocks.integrations-18.body",
  ctaLabelKey: "blocks.integrations-18.cta",
  ctaHref: "#",
  outerRing: ["gemini", "replit", "magicUi"],
  innerRing: ["vsCodium", "mediaWiki", "googlePalm"],
};
