import type { CallToActionBlock } from "./schema";

export const cta11Key = "cta-11" as const;
export const cta11Namespace = "blocks.cta-11" as const;

export const cta11Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-11",
  titleMutedKey: "blocks.cta-11.titleMuted",
  titleAccentKey: "blocks.cta-11.titleAccent",
  bodyKey: "blocks.cta-11.body",
  primary: { labelKey: "blocks.cta-11.primary", href: "#" },
  secondary: { labelKey: "blocks.cta-11.secondary", href: "#" },
};
