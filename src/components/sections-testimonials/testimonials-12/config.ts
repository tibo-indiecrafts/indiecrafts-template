import type { TestimonialsBlock } from "./schema";

export const testimonials12Key = "testimonials-12" as const;
export const testimonials12Namespace = "blocks.testimonials-12" as const;

export const testimonials12Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-12",
  titleKey: "blocks.testimonials-12.title",
  bodyKey: "blocks.testimonials-12.body",
  items: [
    {
      nameKey: "blocks.testimonials-12.items.1.name",
      roleKey: "blocks.testimonials-12.items.1.role",
      contentKey: "blocks.testimonials-12.items.1.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    },
    {
      nameKey: "blocks.testimonials-12.items.2.name",
      roleKey: "blocks.testimonials-12.items.2.role",
      contentKey: "blocks.testimonials-12.items.2.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    },
    {
      nameKey: "blocks.testimonials-12.items.3.name",
      roleKey: "blocks.testimonials-12.items.3.role",
      contentKey: "blocks.testimonials-12.items.3.content",
      avatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
    },
  ],
};
