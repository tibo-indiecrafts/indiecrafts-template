import type { IntegrationsBlock } from "./schema";

export const integrations09Key = "integrations-09" as const;
export const integrations09Namespace = "blocks.integrations-09" as const;

export const integrations09Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-09",
  headerTitleKey: "blocks.integrations-09.headerTitle",
  headerBodyKey: "blocks.integrations-09.headerBody",
  ctaLabelKey: "blocks.integrations-09.ctaLabel",
  ctaHref: "#",
  groups: [
    {
      labelKey: "blocks.integrations-09.groups.group1.label",
      icons: ["intellij", "vsCode"],
    },
    {
      labelKey: "blocks.integrations-09.groups.group2.label",
      icons: ["openai", "claude", "gemini"],
      iconsPerRow: 3,
      isWide: true,
    },
    {
      labelKey: "blocks.integrations-09.groups.group3.label",
      icons: ["cloudflare", "vercel"],
    },
  ],
};
