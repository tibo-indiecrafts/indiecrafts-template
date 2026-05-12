import type { TestimonialsBlock } from "./schema";

export const testimonials10Key = "testimonials-10" as const;
export const testimonials10Namespace = "blocks.testimonials-10" as const;

export const testimonials10Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-10",
  quoteKey: "blocks.testimonials-10.quote",
  authorKey: "blocks.testimonials-10.author",
  roleKey: "blocks.testimonials-10.role",
  avatarUrl: "https://avatars.githubusercontent.com/u/68236786?v=4",
};
