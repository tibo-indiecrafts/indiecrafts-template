import type { IntegrationsBlock } from "./schema";

export const integrations10Key = "integrations-10" as const;
export const integrations10Namespace = "blocks.integrations-10" as const;

export const integrations10Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-10",
  rows: [
    { reverse: true, cells: [null, null, null, null] },
    { reverse: true, cells: [null, "mediaWiki", null, null, null] },
    { cells: [null, "replit", null, "vercel", "linear", null] },
    { cells: [null, "vsCode", null, "openai", null, "cloudflare", null] },
    { cells: [null, "claude", "gemini", null, "googlePalm", null] },
    { cells: [null, "mediaWiki", null, null, null] },
    { reverse: true, cells: [null, null, null, null] },
  ],
  headerTitleKey: "blocks.integrations-10.headerTitle",
  headerBodyKey: "blocks.integrations-10.headerBody",
  ctaLabelKey: "blocks.integrations-10.ctaLabel",
  ctaHref: "#",
};
