import type { IntegrationsBlock } from "./schema";

export const integrations06Key = "integrations-06" as const;
export const integrations06Namespace = "blocks.integrations-06" as const;

export const integrations06Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-06",
  rowTop: ["vsCode", "mediaWiki", "windsurf", "claude", "openai", "mistralAi"],
  rowMiddle: ["gemini", "linear", "vercel", "mistralAi", "vsCodium", "googlePalm"],
  rowBottom: ["replit", "mistralAi", "gemini", "vsCodium", "mediaWiki", "googlePalm"],
  headerTitleKey: "blocks.integrations-06.headerTitle",
  headerBodyKey: "blocks.integrations-06.headerBody",
  ctaLabelKey: "blocks.integrations-06.ctaLabel",
  ctaHref: "#",
};
