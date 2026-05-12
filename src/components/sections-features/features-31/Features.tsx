import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check, CreditCard, ScanFace, Scroll } from "lucide-react";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-landing-container";
import {
  FeatureCard,
  FeatureCardContent,
} from "@/components/ui-primitives/grid-2-landing-feature-card";
import { CreditCardIllustration } from "@/components/ui-illustrations/grid-2-landing-credit-card-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/grid-2-landing-flow-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/grid-2-landing-invoice-illustration";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-2-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { features31Namespace } from "./config";
import type { Features31Block } from "./schema";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

/**
 * Features-31 — JSX verbatim. Three alternating-side feature rows
 * + a closing Vercel testimonial.
 */
export default function Features(props: Readonly<Features31Block>) {
  const [t, , tRoot] = useScopedT(features31Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <h2 id={`${props.id}-heading`} className="sr-only">
        Platform features
      </h2>
      <Container asGrid className="grid-cols-2 @4xl:grid-cols-4">
        <FeatureCard className="col-span-full grid-rows-1 @4xl:col-span-2">
          <FeatureCardContent className="flex h-full flex-col space-y-6 @4xl:pb-12">
            <div className="bg-card ring-foreground/3 flex size-12 rounded-full shadow-xl ring-1 shadow-black/5">
              <Scroll className="text-muted-foreground m-auto size-4" />
            </div>
            <h3 className="text-3xl font-semibold">{t("row1.title")}</h3>
            <p className="text-muted-foreground text-balance">
              {tRoot.rich("blocks.features-31.row1.body", RICH_STRONG)}
            </p>
            <ul className="w-full space-y-2">
              {[t("row1.bullet1"), t("row1.bullet2"), t("row1.bullet3")].map(
                (feature, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-center gap-2"
                  >
                    <Check className="size-4 text-emerald-500" />
                    {feature}
                  </li>
                ),
              )}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
              <Link href="#">{t("cta")}</Link>
            </Button>
          </FeatureCardContent>
        </FeatureCard>
        <div className="col-span-full @4xl:col-span-2">
          <div className="mx-auto self-center">
            <InvoiceIllustration />
          </div>
        </div>
      </Container>

      <Separator className="h-24" />

      <Container asGrid className="grid-cols-2 @4xl:grid-cols-4">
        <div className="col-span-full @4xl:col-span-2">
          <div className="mx-auto self-center">
            <FlowIllustration />
          </div>
        </div>
        <FeatureCard className="col-span-full grid-rows-1 @max-4xl:row-start-1 @4xl:col-span-2">
          <FeatureCardContent className="flex h-full flex-col space-y-6 @4xl:pb-12">
            <div className="bg-card ring-foreground/3 flex size-12 rounded-full shadow-xl ring-1 shadow-black/5">
              <ScanFace className="text-muted-foreground m-auto size-4" />
            </div>
            <h3 className="text-3xl font-semibold">{t("row2.title")}</h3>
            <p className="text-muted-foreground text-balance">
              {tRoot.rich("blocks.features-31.row2.body", RICH_STRONG)}
            </p>
            <ul className="w-full space-y-2">
              {[t("row2.bullet1"), t("row2.bullet2"), t("row2.bullet3")].map(
                (feature, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-center gap-2"
                  >
                    <Check className="size-4 text-emerald-500" />
                    {feature}
                  </li>
                ),
              )}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
              <Link href="#">{t("cta")}</Link>
            </Button>
          </FeatureCardContent>
        </FeatureCard>
      </Container>

      <Separator className="h-24" />

      <Container asGrid className="grid-cols-2 @4xl:grid-cols-4">
        <FeatureCard className="col-span-full grid-rows-1 @4xl:col-span-2">
          <FeatureCardContent className="flex h-full flex-col space-y-6 @4xl:pb-12">
            <div className="bg-card ring-foreground/3 flex size-12 rounded-full shadow-xl ring-1 shadow-black/5">
              <CreditCard className="text-muted-foreground m-auto size-4" />
            </div>
            <h3 className="text-3xl font-semibold">{t("row3.title")}</h3>
            <p className="text-muted-foreground text-balance">
              {tRoot.rich("blocks.features-31.row3.body", RICH_STRONG)}
            </p>
            <ul className="w-full space-y-2">
              {[t("row3.bullet1"), t("row3.bullet2"), t("row3.bullet3")].map(
                (feature, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-center gap-2"
                  >
                    <Check className="size-4 text-emerald-500" />
                    {feature}
                  </li>
                ),
              )}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
              <Link href="#">{t("cta")}</Link>
            </Button>
          </FeatureCardContent>
        </FeatureCard>
        <div className="col-span-full @4xl:col-span-2">
          <CreditCardIllustration />
        </div>
      </Container>

      <Separator className="h-24" />

      <Container className="bg-background border-dashed">
        <div className="mx-auto max-w-2xl p-6 md:py-12 lg:py-20">
          <VercelFull className="h-6 w-24" />
          <div className="mt-6 lg:mt-12">
            <p className='text-xl *:leading-relaxed before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-2xl'>
              {t("quote.text")}
            </p>
            <div className="mt-12 flex items-center gap-3">
              <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                <Image
                  src={MESCHAC_AVATAR}
                  alt={t("quote.name")}
                  width={56}
                  height={56}
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">{t("quote.name")}</p>
                <p className="text-muted-foreground text-xs">{t("quote.role")}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Separator className="h-24" />
    </section>
  );
}
