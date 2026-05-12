import { Card } from "@/components/ui-effects/dark-landing-card";
import { KitIllustration } from "@/components/ui-illustrations/kit-illustration-02";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration-02";
import { ScheduleIllustation } from "@/components/ui-illustrations/schedule-illustration-02";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration-02";
import { useScopedT } from "@/i18n/scoped-t";
import { features27Namespace } from "./config";
import type { FeaturesBlock } from "./schema";

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, , tRoot] = useScopedT(features27Namespace);
  const [card1, card2, card3, card4] = props.cards;

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="@container py-24 [--color-card:transparent]">
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
          <div className="mt-16 grid gap-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] *:shadow-lg *:shadow-black/5 lg:-mx-8 @2xl:grid-cols-2 @2xl:grid-rows-4">
            <Card className="group grid grid-rows-[auto_1fr] rounded-2xl p-0 @2xl:row-span-3">
              <div className="p-8 text-balance">
                <h3 className="text-foreground font-semibold">{tRoot(card1.titleKey)}</h3>
                <p className="text-muted-foreground mt-3">{tRoot(card1.bodyKey)}</p>
              </div>
              <KitIllustration />
            </Card>

            <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 @2xl:row-span-2">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">{tRoot(card2.titleKey)}</h3>
                <p className="text-muted-foreground mt-3">{tRoot(card2.bodyKey)}</p>
              </div>
              <ScheduleIllustation />
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 @max-3xl:row-start-1 @xl:@max-3xl:col-start-2 @2xl:row-span-2">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">{tRoot(card3.titleKey)}</h3>
                <p className="text-muted-foreground mt-3">{tRoot(card3.bodyKey)}</p>
              </div>
              <div aria-hidden className="flex flex-col justify-center">
                <VisualizationIllustration />
              </div>
            </Card>

            <Card className="from-foreground/5 grid gap-8 overflow-hidden rounded-2xl bg-linear-to-l p-8 @md:grid-cols-[1fr_auto]">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">{tRoot(card4.titleKey)}</h3>
                <p className="text-muted-foreground mt-2">{tRoot(card4.bodyKey)}</p>
              </div>
              <div className="-mt-8 -mr-16 max-w-xs @max-md:row-start-1 @md:-mr-12">
                <ReplyIllustration />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
