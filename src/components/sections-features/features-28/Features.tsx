import { Card } from "@/components/ui-primitives/dark-landing-card";
import { CompletePaymentIllustration } from "@/components/ui-illustrations/dark-landing-complete-payment-illustration";
import { LinkPaymentIllustration } from "@/components/ui-illustrations/dark-landing-link-payment-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features28Namespace } from "./config";
import type { FeaturesBlock } from "./schema";

/**
 * 2-card MoreFeatures bento — JSX verbatim against upstream
 * `dark-landing-one`. Both cards stack title-over-illustration.
 */
export default function Features(props: Readonly<FeaturesBlock>) {
  const [, , tRoot] = useScopedT(features28Namespace);
  const [card1, card2] = props.cards;

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="@container py-16 [--color-card:transparent] lg:py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <span className="text-primary font-mono text-sm uppercase">
              {tRoot(props.eyebrowKey)}
            </span>
            <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
              <h2
                id={`${props.id}-heading`}
                className="text-foreground text-4xl font-semibold md:text-5xl"
              >
                {tRoot(props.titleKey)}
              </h2>
              <div className="lg:pl-12">
                <p className="text-muted-foreground text-balance">
                  {tRoot(props.bodyKey)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-16 grid gap-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] *:shadow-lg *:shadow-black/5 lg:-mx-8 @xl:grid-cols-2">
            <Card className="group grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{tRoot(card1.titleKey)}</h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {tRoot(card1.bodyKey)}
                </p>
              </div>
              <CompletePaymentIllustration />
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{tRoot(card2.titleKey)}</h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {tRoot(card2.bodyKey)}
                </p>
              </div>
              <LinkPaymentIllustration />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
