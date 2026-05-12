import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui-effects/grid-2-landing-button";
import { Container, Separator } from "@/components/ui-effects/grid-2-landing-container";
import {
  FeatureCard,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardDescription,
} from "@/components/ui-effects/grid-2-landing-feature-card";
import { Hulu } from "@/components/ui-primitives/svgs/grid-2-landing-hulu";
import { PrimeVideo } from "@/components/ui-primitives/svgs/grid-2-landing-prime-video";
import { Vercel } from "@/components/ui-primitives/svgs/grid-2-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials04Namespace } from "./config";
import type { Testimonials04Block } from "./schema";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";
const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";

export default function Testimonials(props: Readonly<Testimonials04Block>) {
  const [t] = useScopedT(testimonials04Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container className="py-16 lg:py-24">
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2
              id={`${props.id}-heading`}
              className="text-foreground text-4xl font-semibold text-balance lg:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
          </div>
        </div>
      </Container>
      <Container asGrid className="@4xl:grid-cols-23">
        <div className="col-span-2 @max-4xl:hidden">
          <div data-grid-content />
        </div>

        <div className="relative @4xl:col-span-19">
          <FeatureCard>
            <FeatureCardContent className="bg-card! relative">
              <div className="relative z-1">
                <div className="max-w-md">
                  <PrimeVideo className="mb-8 h-8 w-24" />
                  <FeatureCardDescription className="text-2xl font-normal">
                    {t("hero.boldHead")}{" "}
                    <span className="text-foreground font-medium">{t("hero.tail")}</span>
                  </FeatureCardDescription>

                  <Button className="mt-8" variant="outline" size="sm" asChild>
                    <Link href="#">{t("hero.ctaLabel")}</Link>
                  </Button>
                </div>

                <p className='mt-12 max-w-lg text-xl before:mr-1 before:font-serif before:content-["\201C"] after:ml-1 after:font-serif after:content-["\201D"]'>
                  {t("hero.quote")}
                </p>
              </div>

              <div className="absolute inset-y-1 right-1 left-1/3 overflow-hidden rounded-xl mask-radial-[100%_90%] mask-radial-from-35% mask-radial-at-bottom-right opacity-75">
                <Image
                  src="https://images.unsplash.com/photo-1762951566605-ba55030a5666?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                  className="size-full object-cover"
                  width={1974}
                  height={1481}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
                />
              </div>
            </FeatureCardContent>

            <FeatureCardCIllustration className="px-0 pt-0 pb-0 @4xl:px-0 @4xl:pt-0 @4xl:pb-0">
              <div className="bg-card grid w-full grid-cols-[1fr_auto] p-6 @4xl:px-12">
                <div className="grid grid-cols-[auto_1fr] items-center gap-3 pl-px">
                  <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                    <Image
                      src={SHADCN_AVATAR}
                      alt={t("hero.name")}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="text-base *:block">
                    <span className="text-foreground font-medium">{t("hero.name")}</span>
                    <span className="text-muted-foreground text-sm">
                      {t("hero.role")}
                    </span>
                  </div>
                </div>
              </div>
            </FeatureCardCIllustration>
          </FeatureCard>
        </div>

        <div className="col-span-2 @max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>

      <Separator className="h-12" />

      <Container asGrid className="@2xl:grid-cols-2 @4xl:grid-cols-23">
        <div className="col-span-2 @max-4xl:hidden">
          <div data-grid-content />
        </div>

        <div className="relative @4xl:col-span-9">
          <FeatureCard>
            <FeatureCardContent className="bg-card!">
              <p className='text-lg before:mr-1 before:font-serif before:content-["\201C"] after:ml-1 after:font-serif after:content-["\201D"] lg:text-xl'>
                {t("card1.quote")}
              </p>
            </FeatureCardContent>

            <FeatureCardCIllustration className="px-0 pt-0 pb-0 @4xl:px-0 @4xl:pt-0 @4xl:pb-0">
              <div className="bg-card grid w-full grid-cols-[1fr_auto] p-6 @4xl:px-12">
                <div className="grid grid-cols-[auto_1fr] items-center gap-3 pl-px">
                  <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                    <Image
                      src={MESCHAC_AVATAR}
                      alt={t("card1.name")}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="text-base *:block">
                    <span className="text-foreground font-medium">{t("card1.name")}</span>
                    <span className="text-muted-foreground text-sm">
                      {t("card1.role")}
                    </span>
                  </div>
                </div>

                <div>
                  <Hulu className="h-7 w-16" />
                </div>
              </div>
            </FeatureCardCIllustration>
          </FeatureCard>
        </div>

        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>

        <div className="@4xl:col-span-9">
          <FeatureCard className="grid-rows-[1fr_auto]">
            <FeatureCardContent className="bg-background!">
              <p className='text-lg before:mr-1 before:font-serif before:content-["\201C"] after:ml-1 after:font-serif after:content-["\201D"] lg:text-xl'>
                {t("card2.quote")}
              </p>
            </FeatureCardContent>

            <FeatureCardCIllustration className="bg-background! px-0 pt-0 pb-0 @4xl:px-0 @4xl:pt-0 @4xl:pb-0">
              <div className="border-foreground/10 relative grid w-full grid-cols-[1fr_auto] p-6 @3xl:px-12">
                <div className="relative grid grid-cols-[auto_1fr] items-center gap-3 pl-px">
                  <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                    <Image
                      src={THEO_AVATAR}
                      alt={t("card2.name")}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="text-base *:block">
                    <span className="text-foreground font-medium">{t("card2.name")}</span>
                    <span className="text-foreground/65 text-sm">{t("card2.role")}</span>
                  </div>
                </div>

                <div className="relative">
                  <Vercel className="size-7" />
                </div>
              </div>
            </FeatureCardCIllustration>
          </FeatureCard>
        </div>

        <div className="col-span-2 @max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
      <Separator className="h-12" />
    </section>
  );
}
