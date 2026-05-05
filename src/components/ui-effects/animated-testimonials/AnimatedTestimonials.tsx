"use client";

import { useTranslations } from "next-intl";
import { AnimatedTestimonials as AnimatedTestimonialsPrimitive } from "@/components/ui-effects/animated-testimonials";
import { animatedTestimonialsItems, animatedTestimonialsNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof AnimatedTestimonialsPrimitive>;
type Testimonial = PrimitiveProps["testimonials"][number];

export type AnimatedTestimonialsProps = {
  /**
   * Override the testimonials list. When omitted, the wrapper builds the
   * default list by pairing `animatedTestimonialsItems` (asset URLs) with
   * the translated copy under `blocks.animated-testimonials.items.<id>`.
   */
  testimonials?: Testimonial[];
  autoplay?: PrimitiveProps["autoplay"];
};

/**
 * Wraps `AnimatedTestimonials` so consumers can drop it in with no props
 * and get a localized, branded carousel out of the box. Pass `testimonials`
 * to override with caller-supplied data (e.g. fetched from a CMS).
 */
export function AnimatedTestimonials({
  testimonials,
  autoplay,
}: AnimatedTestimonialsProps = {}) {
  const t = useTranslations(animatedTestimonialsNamespace);
  const resolved =
    testimonials ??
    animatedTestimonialsItems.map((item) => ({
      src: item.src,
      name: t(`items.${item.id}.name`),
      designation: t(`items.${item.id}.designation`),
      quote: t(`items.${item.id}.quote`),
    }));
  return <AnimatedTestimonialsPrimitive testimonials={resolved} autoplay={autoplay} />;
}
