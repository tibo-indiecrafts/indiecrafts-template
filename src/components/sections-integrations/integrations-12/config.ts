import type { IntegrationsBlock } from "./schema";

export const integrations12Key = "integrations-12" as const;
export const integrations12Namespace = "blocks.integrations-12" as const;

export const integrations12Sample: Omit<IntegrationsBlock, "id"> = {
  type: "integrations-12",
  ctaLabelKey: "blocks.integrations-12.cta",
  ctaHref: "#",
};
