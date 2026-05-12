import type { IntegrationsBlock } from "./schema";

export const integrations15Key = "integrations-15" as const;
export const integrations15Namespace = "blocks.integrations-15" as const;

export const integrations15Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-15",
  titleKey: "blocks.integrations-15.title",
  bodyKey: "blocks.integrations-15.body",
  ctaLabelKey: "blocks.integrations-15.cta",
  ctaHref: "#",
  spokes: [
    { iconKey: "gemini", position: "left-top" },
    { iconKey: "replit", position: "left-middle" },
    { iconKey: "magicUi", position: "left-bottom" },
    { iconKey: "vsCodium", position: "right-top" },
    { iconKey: "mediaWiki", position: "right-middle" },
    { iconKey: "googlePalm", position: "right-bottom" },
  ],
};
