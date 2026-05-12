import type { IntegrationsBlock } from "./schema";

export const integrations05Key = "integrations-05" as const;
export const integrations05Namespace = "blocks.integrations-05" as const;

export const integrations05Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-05",
  headerTitleKey: "blocks.integrations-05.headerTitle",
  headerBodyKey: "blocks.integrations-05.headerBody",
  icons: ["gemini", "vercel", "claude", "openai", "stripe"],
};
