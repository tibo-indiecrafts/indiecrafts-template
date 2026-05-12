import type { IntegrationsBlock } from "./schema";

export const integrations11Key = "integrations-11" as const;
export const integrations11Namespace = "blocks.integrations-11" as const;

export const integrations11Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-11",
  rows: [
    [null, null, null, "linear", null, null, null, "vercel", null, null],
    [null, null, "claude", null, null, null, "gemini", null, null, null],
    [null, null, null, "googlePalm", null, "openai", null, null, null, null],
  ],
};
