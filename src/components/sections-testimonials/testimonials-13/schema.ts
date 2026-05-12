import type { MessageKey } from "@/types/messages";

export type TestimonialItem = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  contentKey: MessageKey;
  avatarUrl: string;
};

export type TestimonialsBlock = {
  type: "testimonials-13";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Featured (large) testimonial — rendered with the Hulu wordmark above the quote. */
  featured: TestimonialItem;
  /** Three follow-up testimonials filling the rest of the bento. */
  others: readonly [TestimonialItem, TestimonialItem, TestimonialItem];
};
