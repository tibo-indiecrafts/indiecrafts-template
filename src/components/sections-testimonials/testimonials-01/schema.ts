import type { MessageKey } from "@/types/messages";

export type TestimonialsQuote = {
  id: string;
  quoteKey: MessageKey;
  authorKey: MessageKey;
  roleKey?: MessageKey;

  avatarUrl?: string;
};

export type TestimonialsBlock = {
  type: "testimonials-01";
  id: string;
  quotes: TestimonialsQuote[];
};
