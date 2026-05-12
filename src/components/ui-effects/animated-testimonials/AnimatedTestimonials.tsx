"use client";

import { useTranslations } from "next-intl";
import { AnimatedTestimonials as AnimatedTestimonialsPrimitive } from "@/components/ui-effects/animated-testimonials";
import { animatedTestimonialsItems, animatedTestimonialsNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof AnimatedTestimonialsPrimitive>;
type Testimonial = PrimitiveProps["testimonials"][number];

export type AnimatedTestimonialsProps = {
  testimonials?: Testimonial[];
  autoplay?: PrimitiveProps["autoplay"];
};

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
