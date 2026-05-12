import type { TestimonialsBlock } from "./schema";

export const testimonials09Key = "testimonials-09" as const;
export const testimonials09Namespace = "blocks.testimonials-09" as const;

export const testimonials09Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-09",
  quoteKey: "blocks.testimonials-09.quote",
  authorKey: "blocks.testimonials-09.author",
  roleKey: "blocks.testimonials-09.role",
};
