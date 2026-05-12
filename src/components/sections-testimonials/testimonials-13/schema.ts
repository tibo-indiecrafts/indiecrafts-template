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

  featured: TestimonialItem;

  others: readonly [TestimonialItem, TestimonialItem, TestimonialItem];
};
