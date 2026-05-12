import type { MessageKey } from "@/types/messages";

export type TestimonialItem = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  contentKey: MessageKey;
  avatarUrl: string;

  stars: 0 | 1 | 2 | 3 | 4 | 5;
};

export type TestimonialsBlock = {
  type: "testimonials-11";
  id: string;
  items: ReadonlyArray<TestimonialItem>;
};
