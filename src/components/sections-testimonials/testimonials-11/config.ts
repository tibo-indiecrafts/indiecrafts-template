import type { TestimonialsBlock } from "./schema";

export const testimonials11Key = "testimonials-11" as const;
export const testimonials11Namespace = "blocks.testimonials-11" as const;

export const testimonials11Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-11",
  items: [
    {
      nameKey: "blocks.testimonials-11.items.1.name",
      roleKey: "blocks.testimonials-11.items.1.role",
      contentKey: "blocks.testimonials-11.items.1.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
      stars: 5,
    },
    {
      nameKey: "blocks.testimonials-11.items.2.name",
      roleKey: "blocks.testimonials-11.items.2.role",
      contentKey: "blocks.testimonials-11.items.2.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
      stars: 4,
    },
    {
      nameKey: "blocks.testimonials-11.items.3.name",
      roleKey: "blocks.testimonials-11.items.3.role",
      contentKey: "blocks.testimonials-11.items.3.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
      stars: 5,
    },
  ],
};
