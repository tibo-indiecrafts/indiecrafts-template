import type { TestimonialsBlock } from "./schema";

export const testimonials01Key = "testimonials-01" as const;
export const testimonials01Namespace = "blocks.testimonials-01" as const;

export const testimonials01Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-01",
  quotes: [
    {
      id: "lovelace",
      quoteKey: "blocks.testimonials-01.quotes.lovelace.quote",
      authorKey: "blocks.testimonials-01.quotes.lovelace.author",
      roleKey: "blocks.testimonials-01.quotes.lovelace.role",
      // Image path lives in config, not translations — assets are locale-agnostic.
      // Replace with the real avatar when forking for a client.
    },
  ],
};
