import type { TestimonialsBlock } from "./schema";

export const testimonials13Key = "testimonials-13" as const;
export const testimonials13Namespace = "blocks.testimonials-13" as const;

export const testimonials13Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-13",
  titleKey: "blocks.testimonials-13.title",
  bodyKey: "blocks.testimonials-13.body",
  featured: {
    nameKey: "blocks.testimonials-13.featured.name",
    roleKey: "blocks.testimonials-13.featured.role",
    contentKey: "blocks.testimonials-13.featured.content",
    avatarUrl: "https://tailus.io/images/reviews/shekinah.webp",
  },
  others: [
    {
      nameKey: "blocks.testimonials-13.others.1.name",
      roleKey: "blocks.testimonials-13.others.1.role",
      contentKey: "blocks.testimonials-13.others.1.content",
      avatarUrl: "https://tailus.io/images/reviews/jonathan.webp",
    },
    {
      nameKey: "blocks.testimonials-13.others.2.name",
      roleKey: "blocks.testimonials-13.others.2.role",
      contentKey: "blocks.testimonials-13.others.2.content",
      avatarUrl: "https://tailus.io/images/reviews/yucel.webp",
    },
    {
      nameKey: "blocks.testimonials-13.others.3.name",
      roleKey: "blocks.testimonials-13.others.3.role",
      contentKey: "blocks.testimonials-13.others.3.content",
      avatarUrl: "https://tailus.io/images/reviews/rodrigo.webp",
    },
  ],
};
