import type { MessageKey } from "@/types/messages";

export type TestimonialItem = {
  nameKey: MessageKey;
  roleKey: MessageKey;
  contentKey: MessageKey;
  avatarUrl: string;
  /** 0-5; cells beyond are rendered as muted (unfilled) stars. */
  stars: 0 | 1 | 2 | 3 | 4 | 5;
};

export type TestimonialsBlock = {
  type: "testimonials-11";
  id: string;
  items: ReadonlyArray<TestimonialItem>;
};
