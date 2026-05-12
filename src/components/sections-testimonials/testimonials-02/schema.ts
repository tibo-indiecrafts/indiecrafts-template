import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` Testimonials — JSX verbatim.
 * Tabbed quotes panel: avatar + name + role on the left with a
 * row of small avatar buttons that switch the active quote;
 * right column shows the quote (curly quotes via ::before/::after),
 * customer logo, and a 2-column results panel with star/zap rows
 * and animated `TextEffect` reveals. Quote + logo cross-fade on
 * switch via motion's `AnimatePresence`.
 *
 * `logo` discriminator picks the SVG mark inside the right column.
 */
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
