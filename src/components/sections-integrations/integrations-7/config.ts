import type { IntegrationsBlock } from "./schema";

export const integrations7Key = "integrations-7" as const;
export const integrations7Namespace = "blocks.integrations-7" as const;

export const integrations7Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-7",
  headerTitleKey: "blocks.integrations-7.headerTitle",
  headerBodyKey: "blocks.integrations-7.headerBody",
  icons: ["gemini", "linear", "replit", "vercel", "openai", "mediaWiki", "claude"],
};
