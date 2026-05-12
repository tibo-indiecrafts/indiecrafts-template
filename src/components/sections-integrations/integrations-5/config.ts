import type { IntegrationsBlock } from "./schema";

export const integrations5Key = "integrations-5" as const;
export const integrations5Namespace = "blocks.integrations-5" as const;

export const integrations5Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-5",
  headerTitleKey: "blocks.integrations-5.headerTitle",
  headerBodyKey: "blocks.integrations-5.headerBody",
  icons: ["gemini", "vercel", "claude", "openai", "stripe"],
};
