import type { IntegrationsBlock } from "./schema";

export const integrations9Key = "integrations-9" as const;
export const integrations9Namespace = "blocks.integrations-9" as const;

export const integrations9Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-9",
  headerTitleKey: "blocks.integrations-9.headerTitle",
  headerBodyKey: "blocks.integrations-9.headerBody",
  ctaLabelKey: "blocks.integrations-9.ctaLabel",
  ctaHref: "#",
  groups: [
    {
      labelKey: "blocks.integrations-9.groups.group1.label",
      icons: ["intellij", "vsCode"],
    },
    {
      labelKey: "blocks.integrations-9.groups.group2.label",
      icons: ["openai", "claude", "gemini"],
      iconsPerRow: 3,
      isWide: true,
    },
    {
      labelKey: "blocks.integrations-9.groups.group3.label",
      icons: ["cloudflare", "vercel"],
    },
  ],
};
