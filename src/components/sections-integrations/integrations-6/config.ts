import type { IntegrationsBlock } from "./schema";

export const integrations6Key = "integrations-6" as const;
export const integrations6Namespace = "blocks.integrations-6" as const;

export const integrations6Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-6",
  rowTop: ["vsCode", "mediaWiki", "windsurf", "claude", "openai", "mistralAi"],
  rowMiddle: ["gemini", "linear", "vercel", "mistralAi", "vsCodium", "googlePalm"],
  rowBottom: ["replit", "mistralAi", "gemini", "vsCodium", "mediaWiki", "googlePalm"],
  headerTitleKey: "blocks.integrations-6.headerTitle",
  headerBodyKey: "blocks.integrations-6.headerBody",
  ctaLabelKey: "blocks.integrations-6.ctaLabel",
  ctaHref: "#",
};
