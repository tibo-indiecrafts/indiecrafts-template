import type { Features12Block } from "./schema";

export const features12Sample: Omit<Features12Block, "id"> = {
  type: "features-12",
  titleKey: "blocks.features-12.title",
  bodyKey: "blocks.features-12.body",
  items: [
    {
      id: "item-1",
      icon: "database",
      labelKey: "blocks.features-12.items.database.label",
      bodyKey: "blocks.features-12.items.database.body",
      imageUrl: "/placeholder.svg",
      imageAltKey: "blocks.features-12.items.database.alt",
    },
    {
      id: "item-2",
      icon: "fingerprint",
      labelKey: "blocks.features-12.items.auth.label",
      bodyKey: "blocks.features-12.items.auth.body",
      imageUrl: "/placeholder.svg",
      imageAltKey: "blocks.features-12.items.auth.alt",
    },
    {
      id: "item-3",
      icon: "idCard",
      labelKey: "blocks.features-12.items.identity.label",
      bodyKey: "blocks.features-12.items.identity.body",
      imageUrl: "/placeholder.svg",
      imageAltKey: "blocks.features-12.items.identity.alt",
    },
    {
      id: "item-4",
      icon: "chartBar",
      labelKey: "blocks.features-12.items.analytics.label",
      bodyKey: "blocks.features-12.items.analytics.body",
      imageUrl: "/placeholder.svg",
      imageAltKey: "blocks.features-12.items.analytics.alt",
    },
  ],
};
