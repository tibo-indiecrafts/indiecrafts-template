import { CalendarDays, Clock2, Zap } from "lucide-react";
import { Card } from "@/components/ui-effects/libre-landing-two-card";
import { AiOverviewIllustration } from "@/components/ui-illustrations/ai-overview-illustration";
import { ChartIllustration } from "@/components/ui-illustrations/chart-illustration-02";
import { LanguagesIllustration } from "@/components/ui-illustrations/languages-illustration";
import { LinkPaymentIllustration } from "@/components/ui-illustrations/link-payment-illustration-02";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features38Namespace } from "./config";
import type { Features38Block } from "./schema";

const subFeatures = [
  { icon: Clock2, key: "tile1" },
  { icon: Zap, key: "tile2" },
  { icon: CalendarDays, key: "tile3" },
] as const;

export default function Features(props: Readonly<Features38Block>) {
  const [t] = useScopedT(features38Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="@container overflow-hidden py-16"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-end gap-6 md:grid-cols-2">
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

        <div className="mt-16 grid gap-2 *:shadow-lg *:shadow-black/5 lg:-mx-8 @4xl:grid-cols-6">
          <Card className="row-span-2 grid grid-rows-subgrid gap-8 @4xl:col-span-3">
            <div className="px-8 pt-8">
              <h3 className="font-semibold text-balance">{t("cards.chart.title")}</h3>
              <p className="text-muted-foreground mt-3">{t("cards.chart.body")}</p>
            </div>
            <div className="self-end pb-4">
              <ChartIllustration />
            </div>
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid gap-8 @4xl:col-span-3">
            <div className="relative z-10 px-8 pt-8">
              <h3 className="font-semibold text-balance">{t("cards.ai.title")}</h3>
              <p className="text-muted-foreground mt-3">{t("cards.ai.body")}</p>
            </div>
            <div className="self-end px-8 pb-8">
              <AiOverviewIllustration />
            </div>
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid gap-8 @4xl:col-span-2">
            <div className="relative z-10 px-8 pt-8">
              <h3 className="font-semibold text-balance">{t("cards.languages.title")}</h3>
              <p className="text-muted-foreground mt-3">{t("cards.languages.body")}</p>
            </div>
            <div className="self-end px-8 pb-8">
              <LanguagesIllustration />
            </div>
          </Card>
          <Card className="row-span-2 grid grid-rows-subgrid @4xl:col-span-4">
            <div className="relative z-10 px-8 pt-8">
              <h3 className="font-semibold text-balance">
                {t("cards.linkPayment.title")}
              </h3>
              <p className="text-muted-foreground mt-3">{t("cards.linkPayment.body")}</p>
            </div>
            <div className="self-end px-8 pb-8">
              <LinkPaymentIllustration />
            </div>
          </Card>
        </div>

        <div className="relative mt-16 grid grid-cols-2 gap-6 @4xl:grid-cols-3 @4xl:gap-12">
          {subFeatures.map((feature, index) => (
            <div key={index} className="space-y-1.5">
              <feature.icon className="fill-foreground/10 size-4" />
              <h3 className="mt-3 font-medium">
                {t(`subFeatures.${feature.key}.title`)}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t(`subFeatures.${feature.key}.body`)}
              </p>
            </div>
          ))}
          <div className="space-y-1.5 md:hidden">
            <CalendarDays className="fill-foreground/10 size-4" />
            <h3 className="mt-3 font-medium">{t("subFeatures.tile3.title")}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {t("subFeatures.tile3.body")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
