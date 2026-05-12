import type { MessageKey } from "@/types/messages";

export type TestimonialsBlock = {
  type: "testimonials-08";
  id: string;
  quoteKey: MessageKey;
  authorKey: MessageKey;
  handleKey: MessageKey;
  avatarUrl: string;
};
