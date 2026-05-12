/* eslint-disable @next/next/no-img-element -- avatar is a remote thumbnail */

import { Quote } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials06Namespace } from "./config";
import type { Testimonials06Block } from "./schema";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

/**
 * Tailark Pro `libre-landing-two` TestimonialSection — JSX
 * verbatim. Single-quote panel with a Quote icon, large pull
 * quote, avatar + name + role.
 */
export default function Testimonials(props: Readonly<Testimonials06Block>) {
  const [t] = useScopedT(testimonials06Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="py-16 md:py-32">
      <h2 id={`${props.id}-heading`} className="sr-only">
        Customer testimonial
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          <Quote aria-hidden className="fill-card stroke-card size-5 drop-shadow-md" />
          <p className="my-12 text-lg font-medium sm:text-xl md:text-3xl md:leading-10">
            {t("quote")}
          </p>

          <div className="grid grid-cols-[auto_1fr] items-center gap-3 pl-px">
            <div className="ring-foreground/10 aspect-square size-12 overflow-hidden rounded-xl border border-transparent shadow-md ring-1 shadow-black/15">
              <img
                src={MESCHAC_AVATAR}
                alt={t("name")}
                loading="lazy"
                width={460}
                height={460}
              />
            </div>
            <div className="space-y-0.5 text-base *:block">
              <span className="text-foreground font-medium">{t("name")}</span>
              <span className="text-muted-foreground text-sm">{t("role")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
