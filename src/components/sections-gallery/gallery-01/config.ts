import type { GalleryBlock } from "./schema";

export const gallery01Key = "gallery-01" as const;
export const gallery01Namespace = "blocks.gallery-01" as const;

export const gallery01Sample: Omit<GalleryBlock, "id"> = {
  type: "gallery-01",
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item1.title",
      descriptionKey: "blocks.gallery-01.items.item1.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item2.title",
      descriptionKey: "blocks.gallery-01.items.item2.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item3.title",
      descriptionKey: "blocks.gallery-01.items.item3.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item4.title",
      descriptionKey: "blocks.gallery-01.items.item4.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item5.title",
      descriptionKey: "blocks.gallery-01.items.item5.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item6.title",
      descriptionKey: "blocks.gallery-01.items.item6.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item7.title",
      descriptionKey: "blocks.gallery-01.items.item7.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item8.title",
      descriptionKey: "blocks.gallery-01.items.item8.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1462989856370-729a9c1e2c91?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item9.title",
      descriptionKey: "blocks.gallery-01.items.item9.description",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475727946784-2890c8fdb9c8?q=80&w=1200&auto=format",
      titleKey: "blocks.gallery-01.items.item10.title",
      descriptionKey: "blocks.gallery-01.items.item10.description",
    },
  ],
};
