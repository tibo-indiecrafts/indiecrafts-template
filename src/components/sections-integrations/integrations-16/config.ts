import type { IntegrationsBlock } from "./schema";

export const integrations16Key = "integrations-16" as const;
export const integrations16Namespace = "blocks.integrations-16" as const;

export const integrations16Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-16",
  titleKey: "blocks.integrations-16.title",
  bodyKey: "blocks.integrations-16.body",
  ctaLabelKey: "blocks.integrations-16.cta",
  ctaHref: "#",
  testimonial: {
    iconKey: "mediaWiki",
    quoteKey: "blocks.integrations-16.testimonial.quote",
    authorKey: "blocks.integrations-16.testimonial.author",
    roleKey: "blocks.integrations-16.testimonial.role",
  },
  cells: [
    {
      iconKey: "gemini",
      nameKey: "blocks.integrations-16.cells.1.name",
      descriptionKey: "blocks.integrations-16.cells.1.description",
    },
    {
      iconKey: "replit",
      nameKey: "blocks.integrations-16.cells.2.name",
      descriptionKey: "blocks.integrations-16.cells.2.description",
    },
    {
      iconKey: "googlePalm",
      nameKey: "blocks.integrations-16.cells.3.name",
      descriptionKey: "blocks.integrations-16.cells.3.description",
    },
    {
      iconKey: "magicUi",
      nameKey: "blocks.integrations-16.cells.4.name",
      descriptionKey: "blocks.integrations-16.cells.4.description",
    },
    {
      iconKey: "vsCodium",
      nameKey: "blocks.integrations-16.cells.5.name",
      descriptionKey: "blocks.integrations-16.cells.5.description",
    },
    {
      iconKey: "mediaWiki",
      nameKey: "blocks.integrations-16.cells.6.name",
      descriptionKey: "blocks.integrations-16.cells.6.description",
    },
  ],
};
