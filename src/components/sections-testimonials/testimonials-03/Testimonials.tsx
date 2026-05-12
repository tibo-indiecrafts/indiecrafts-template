/* eslint-disable @next/next/no-img-element -- avatars are remote thumbnails */

import { Container } from "@/components/ui-primitives/grid-1-landing-container";
import { Hulu } from "@/components/ui-primitives/svgs/grid-1-landing-hulu";
import { Stripe } from "@/components/ui-primitives/svgs/grid-1-landing-stripe";
import { Tailwindcss } from "@/components/ui-primitives/svgs/grid-1-landing-tailwindcss";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials03Namespace } from "./config";
import type { Testimonials03Block } from "./schema";

const YVES_AVATAR = "https://avatars.githubusercontent.com/u/76200933?v=4";
const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const BERNARD_AVATAR = "https://avatars.githubusercontent.com/u/31113941?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";
const ADAM_AVATAR = "https://avatars.githubusercontent.com/u/4323180?v=4";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";
const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";
const MICKY_AVATAR = "https://avatars.githubusercontent.com/u/87156634?v=4";

const TESTIMONIAL_KEYS = [
  { id: "yves", avatar: YVES_AVATAR },
  { id: "meschac", avatar: MESCHAC_AVATAR },
  { id: "bernard", avatar: BERNARD_AVATAR },
  { id: "glodie", avatar: GLODIE_AVATAR },
  { id: "theo", avatar: THEO_AVATAR },
  { id: "micky", avatar: MICKY_AVATAR },
] as const;

type TFn = (key: string) => string;

function TestimonialCard({ id, avatar, t }: { id: string; avatar: string; t: TFn }) {
  const name = t(`items.${id}.name`);
  return (
    <div className="ring-foreground/5 flex flex-col justify-end gap-8 border border-transparent p-8 ring">
      <p className='text-foreground self-end text-lg text-balance before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"]'>
        {t(`items.${id}.quote`)}
      </p>
      <div className="flex items-center gap-3">
        <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md ring shadow-black/15">
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
            width={460}
            height={460}
            loading="lazy"
          />
        </div>
        <div className="space-y-px">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">{t(`items.${id}.role`)}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials(props: Readonly<Testimonials03Block>) {
  const [t] = useScopedT(testimonials03Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container>
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-foreground font-mono text-sm uppercase">
              {t("eyebrow")}
            </span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-6 text-4xl font-semibold text-balance lg:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
          </div>
        </div>
      </Container>
      <Container className="**:data-[slot=content]:py-0">
        <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3 lg:gap-px lg:*:nth-1:rounded-t-none lg:*:nth-2:rounded-tl-none lg:*:nth-2:rounded-br-none lg:*:nth-3:rounded-l-none lg:*:nth-4:rounded-r-none lg:*:nth-5:rounded-tl-none lg:*:nth-5:rounded-br-none lg:*:nth-6:rounded-b-none">
          {TESTIMONIAL_KEYS.map((item) => (
            <TestimonialCard key={item.id} id={item.id} avatar={item.avatar} t={t} />
          ))}

          <div className="bg-card ring-foreground/5 row-start-1 flex flex-col justify-between gap-8 border border-transparent p-8 shadow-lg ring shadow-black/6.5 lg:col-start-1">
            <div className="space-y-6">
              <Tailwindcss height={20} width={136} />
              <p className="text-lg text-balance">{t("items.adam.quote")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md ring shadow-black/15">
                <img
                  src={ADAM_AVATAR}
                  alt={t("items.adam.name")}
                  className="h-full w-full object-cover"
                  width={460}
                  height={460}
                  loading="lazy"
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">{t("items.adam.name")}</p>
                <p className="text-muted-foreground text-xs">{t("items.adam.role")}</p>
              </div>
            </div>
          </div>
          <div className="bg-card ring-foreground/5 row-start-3 flex flex-col justify-between gap-8 border border-transparent p-8 shadow-lg ring shadow-black/6.5 sm:col-start-2 lg:row-start-2">
            <div className="space-y-6">
              <Hulu height={20} width={56} />
              <p className="text-lg text-balance">{t("items.shadcn.quote")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md ring shadow-black/15">
                <img
                  src={SHADCN_AVATAR}
                  alt={t("items.shadcn.name")}
                  className="h-full w-full object-cover"
                  width={460}
                  height={460}
                  loading="lazy"
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">{t("items.shadcn.name")}</p>
                <p className="text-muted-foreground text-xs">{t("items.shadcn.role")}</p>
              </div>
            </div>
          </div>
          <div className="bg-card ring-foreground/5 flex flex-col justify-between gap-8 border border-transparent p-8 shadow-lg ring shadow-black/6.5 sm:row-start-2 lg:col-start-3 lg:row-start-3 lg:rounded-tr-none lg:rounded-bl-none">
            <div className="space-y-6">
              <Stripe height={24} width={56} />
              <p className="text-lg text-balance">{t("items.glodie2.quote")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md ring shadow-black/15">
                <img
                  src={GLODIE_AVATAR}
                  alt={t("items.glodie2.name")}
                  className="h-full w-full object-cover"
                  width={460}
                  height={460}
                  loading="lazy"
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">{t("items.glodie2.name")}</p>
                <p className="text-muted-foreground text-xs">{t("items.glodie2.role")}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
