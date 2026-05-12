import type { MessageKey } from "@/types/messages";

export type TestimonialItem = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  quoteKey: MessageKey;
  avatarUrl: string;
};

export type TestimonialsBlock = {
  type: "testimonials-14";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: ReadonlyArray<TestimonialItem>;
};
