/* eslint-disable @next/next/no-img-element -- avatars are remote thumbnails */

import { Card } from "@/components/ui-effects/libre-landing-two-card";
import { Hulu } from "@/components/ui-primitives/svgs/libre-landing-two-hulu";
import { PrimeVideo } from "@/components/ui-primitives/svgs/libre-landing-two-prime-video";
import { Stripe } from "@/components/ui-primitives/svgs/libre-landing-two-stripe";
import { Tailwindcss as TailwindcssWordmark } from "@/components/ui-primitives/svgs/libre-landing-two-tailwindcss";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials07Namespace } from "./config";
import type { Testimonials07Block } from "./schema";

const ADAM_AVATAR = "https://avatars.githubusercontent.com/u/4323180?v=4";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";

const testimonials = [
  {
    id: "tailwindcss",
    Logo: TailwindcssWordmark,
    cardLogoProps: { className: "h-7 w-36" } as const,
    avatar: ADAM_AVATAR,
  },
  {
    id: "prime",
    Logo: PrimeVideo,
    cardLogoProps: { className: "h-7 w-20" } as const,
    avatar: GLODIE_AVATAR,
  },
  {
    id: "hulu",
    Logo: Hulu,
    cardLogoProps: { className: "h-7 w-16" } as const,
    avatar: SHADCN_AVATAR,
  },
  {
    id: "stripe",
    Logo: Stripe,
    cardLogoProps: { className: "h-7 w-16" } as const,
    avatar: GLODIE_AVATAR,
  },
] as const;

export default function Testimonials(props: Readonly<Testimonials07Block>) {
  const [t] = useScopedT(testimonials07Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="pt-24 pb-44">
      <div className="mx-auto w-full max-w-5xl px-6">
        <span className="text-primary font-mono text-sm uppercase">{t("eyebrow")}</span>

        <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
          <h2
            id={`${props.id}-heading`}
            className="text-foreground text-4xl font-semibold md:text-5xl"
          >
            {t("title")}
          </h2>
          <div className="lg:pl-12">
            <p className="text-muted-foreground text-balance">{t("body")}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-2 sm:gap-6 md:grid-cols-2 md:grid-rows-5 lg:-mx-8 lg:gap-8">
          {testimonials.map((testimonial) => {
            const name = t(`items.${testimonial.id}.name`);
            return (
              <Card
                key={testimonial.id}
                className="ring-foreground/10 relative space-y-8 rounded-2xl p-10 shadow-lg shadow-black/5 first:col-start-1 first:row-start-1 md:row-span-2 md:nth-2:col-start-2 md:nth-2:row-start-2 md:nth-2:bg-transparent md:nth-2:shadow-none md:nth-3:bg-transparent md:nth-3:shadow-none lg:nth-3:ml-8"
                style={{ touchAction: "none" }}
              >
                <div>
                  <testimonial.Logo {...testimonial.cardLogoProps} />
                </div>
                <p className='text-lg before:mr-1 before:font-serif before:content-["\\201C"] after:ml-1 after:font-serif after:content-["\\201D"]'>
                  {t(`items.${testimonial.id}.text`)}
                </p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3 pl-px">
                  <div className="ring-foreground/10 aspect-square size-12 overflow-hidden rounded-xl border border-transparent shadow-md ring-1 shadow-black/15">
                    <img src={testimonial.avatar} alt={name} />
                  </div>
                  <div className="space-y-0.5 text-base *:block">
                    <span className="text-foreground font-medium">{name}</span>
                    <span className="text-muted-foreground text-sm">
                      {t(`items.${testimonial.id}.role`)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
          <div
            aria-hidden
            className="ring-border-illustration col-start-2 row-start-1 w-2/3 rounded-2xl ring max-md:hidden"
          />
          <div
            aria-hidden
            className="ring-border-illustration ml-auto h-2/3 w-2/3 rounded-2xl ring max-md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
