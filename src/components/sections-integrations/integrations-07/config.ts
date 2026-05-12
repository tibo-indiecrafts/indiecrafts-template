import type { IntegrationsBlock } from "./schema";

export const integrations07Key = "integrations-07" as const;
export const integrations07Namespace = "blocks.integrations-07" as const;

export const integrations07Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-07",
  headerTitleKey: "blocks.integrations-07.headerTitle",
  headerBodyKey: "blocks.integrations-07.headerBody",
  icons: ["gemini", "linear", "replit", "vercel", "openai", "mediaWiki", "claude"],
};
