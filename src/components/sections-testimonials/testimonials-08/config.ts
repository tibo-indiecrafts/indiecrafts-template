import type { TestimonialsBlock } from "./schema";

export const testimonials08Key = "testimonials-08" as const;
export const testimonials08Namespace = "blocks.testimonials-08" as const;

export const testimonials08Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-08",
  quoteKey: "blocks.testimonials-08.quote",
  authorKey: "blocks.testimonials-08.author",
  handleKey: "blocks.testimonials-08.handle",
  avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
};
