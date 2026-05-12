import type { TestimonialsBlock } from "./schema";

export const testimonials14Key = "testimonials-14" as const;
export const testimonials14Namespace = "blocks.testimonials-14" as const;

export const testimonials14Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-14",
  titleKey: "blocks.testimonials-14.title",
  bodyKey: "blocks.testimonials-14.body",
  items: [
    {
      nameKey: "blocks.testimonials-14.items.1.name",
      roleKey: "blocks.testimonials-14.items.1.role",
      quoteKey: "blocks.testimonials-14.items.1.quote",
      avatarUrl: "https://avatars.githubusercontent.com/u/47919550?v=4",
    },
    {
      nameKey: "blocks.testimonials-14.items.2.name",
      roleKey: "blocks.testimonials-14.items.2.role",
      quoteKey: "blocks.testimonials-14.items.2.quote",
      avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
    },
    {
      nameKey: "blocks.testimonials-14.items.3.name",
      roleKey: "blocks.testimonials-14.items.3.role",
      quoteKey: "blocks.testimonials-14.items.3.quote",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    },
    {
      nameKey: "blocks.testimonials-14.items.4.name",
      roleKey: "blocks.testimonials-14.items.4.role",
      quoteKey: "blocks.testimonials-14.items.4.quote",
      avatarUrl: "https://avatars.githubusercontent.com/u/34567890?v=4",
    },
  ],
};
