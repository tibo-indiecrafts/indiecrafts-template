import type { MessageKey } from "@/types/messages";

export type TestimonialLogoId = "tailwindcss" | "vercel" | "prime-video";

export type TestimonialItem = {
  id: string;
  logo: TestimonialLogoId;
  logoClassName?: string;
  textKey: MessageKey;
  avatarUrl: string;
  nameKey: MessageKey;
  titleKey: MessageKey;
  resultTextKey: MessageKey;
  resultText2Key: MessageKey;
};

export type TestimonialsBlock = {
  type: "testimonials-02";
  id: string;
  testimonials: ReadonlyArray<TestimonialItem>;
};
