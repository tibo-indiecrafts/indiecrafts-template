import type { IntegrationsBlock } from "./schema";

export const integrations14Key = "integrations-14" as const;
export const integrations14Namespace = "blocks.integrations-14" as const;

export const integrations14Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-14",
  titleKey: "blocks.integrations-14.title",
  bodyKey: "blocks.integrations-14.body",
  ctaLabelKey: "blocks.integrations-14.cta",
  ctaHref: "#",
  rows: [
    {
      iconKey: "gemini",
      nameKey: "blocks.integrations-14.rows.1.name",
      descriptionKey: "blocks.integrations-14.rows.1.description",
    },
    {
      iconKey: "replit",
      nameKey: "blocks.integrations-14.rows.2.name",
      descriptionKey: "blocks.integrations-14.rows.2.description",
    },
    {
      iconKey: "googlePalm",
      nameKey: "blocks.integrations-14.rows.3.name",
      descriptionKey: "blocks.integrations-14.rows.3.description",
    },
  ],
};
