import { Testimonials } from "@/components/ui-effects/libre-landing-testimonials";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials05Namespace } from "./config";
import type { Testimonials05Block } from "./schema";

/**
 * Testimonials-05 — JSX verbatim. Eyebrow + intro centered above
 * the upstream `<Testimonials />` rotator (motion-driven 3-card
 * stack that lives in `ui-effects/libre-landing-testimonials.tsx`).
 */
export default function Testimonials05(props: Readonly<Testimonials05Block>) {
  const [t] = useScopedT(testimonials05Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-2xl space-y-6 text-center">
          <span className="text-primary font-mono text-sm uppercase">{t("eyebrow")}</span>
          <h2
            id={`${props.id}-heading`}
            className="text-foreground mt-8 text-4xl font-semibold text-balance md:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
        </div>

        <Testimonials />
      </div>
    </section>
  );
}
