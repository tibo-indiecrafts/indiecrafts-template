import type { IntegrationsBlock } from "./schema";

export const integrations13Key = "integrations-13" as const;
export const integrations13Namespace = "blocks.integrations-13" as const;

export const integrations13Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-13",
  ctaLabelKey: "blocks.integrations-13.cta",
  ctaHref: "#",
};
