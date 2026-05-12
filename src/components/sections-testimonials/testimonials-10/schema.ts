import type { MessageKey } from "@/types/messages";

export type TestimonialsBlock = {
  type: "testimonials-10";
  id: string;
  quoteKey: MessageKey;
  authorKey: MessageKey;
  roleKey: MessageKey;
  avatarUrl: string;
};
