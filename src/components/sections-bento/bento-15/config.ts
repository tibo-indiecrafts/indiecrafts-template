import type { BentoBlock } from "./schema";

export const bento15Key = "bento-15" as const;
export const bento15Namespace = "blocks.bento-15" as const;

export const bento15Sample: Omit<BentoBlock, "id"> = {
  type: "bento-15",
  titleKey: "blocks.bento-15.title",
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop",
      titleKey: "blocks.bento-15.items.project1.title",
    },
    {
      image:
        "https://images.unsplash.com/photo-1704677982215-a2248af6009b?q=80&w=1200&auto=format&fit=crop",
      titleKey: "blocks.bento-15.items.project2.title",
    },
    {
      image:
        "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop",
      titleKey: "blocks.bento-15.items.project3.title",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=800&auto=format&fit=crop",
      titleKey: "blocks.bento-15.items.project4.title",
    },
  ],
};
