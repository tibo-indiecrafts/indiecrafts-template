import { Shield } from "lucide-react";
import { Card } from "@/components/ui-effects/libre-landing-card";
import { ChipIllustration } from "@/components/ui-illustrations/libre-landing-chip-illustration";
import { CurrencyIllustration } from "@/components/ui-illustrations/libre-landing-currency-illustration";
import { KeysIllustration } from "@/components/ui-illustrations/libre-landing-keys-illustration";
import { MemoryUsageIllustration } from "@/components/ui-illustrations/libre-landing-memory-usage-illustration";
import { UptimeIllustration } from "@/components/ui-illustrations/libre-landing-uptime-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features37Namespace } from "./config";
import type { Features37Block } from "./schema";

const HEX_BG_PATH =
  "M6.81602 605.752L38.684 642.748C42.4362 647.104 44.5 652.662 44.5 658.411V1628.23C44.5 1641.59 55.4076 1652.38 68.7652 1652.23L2375.26 1626.76C2388.42 1626.62 2399 1615.92 2399 1602.76V2L2153.06 247.941C2144.06 256.943 2131.85 262 2119.12 262H90.4852C84.094 262 77.9667 264.549 73.4616 269.083L7.97632 334.98C3.50795 339.476 1 345.558 1 351.897V590.089C1 595.838 3.06383 601.396 6.81602 605.752Z";

export default function Features(props: Readonly<Features37Block>) {
  const [t] = useScopedT(features37Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 -left-2 -mt-12 mask-b-from-65% sm:-top-24 lg:inset-x-0 lg:-top-32"
      >
        <svg
          viewBox="0 0 2400 1653"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground/15 fill-background/35 w-full"
        >
          <path d={HEX_BG_PATH} stroke="currentColor" />
        </svg>
      </div>

      <div className="@container relative py-16 lg:py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <span className="text-primary font-mono text-sm uppercase">
              {t("eyebrow")}
            </span>
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
          </div>
          <div className="mt-16 grid gap-2 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] *:shadow-lg *:shadow-black/5 lg:-mx-8 @xl:grid-cols-2 @3xl:grid-cols-3">
            <Card className="group grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {t("cards.uptime.title")}
                </h3>
                <p className="text-muted-foreground mt-3">{t("cards.uptime.body")}</p>
              </div>
              <UptimeIllustration />
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{t("cards.keys.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("cards.keys.body")}</p>
              </div>
              <div
                aria-hidden
                className="border-background -m-8 flex flex-col justify-center border-x bg-linear-to-b from-transparent to-zinc-50 p-8"
              >
                <KeysIllustration />
              </div>
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {t("cards.currency.title")}
                </h3>
                <p className="text-muted-foreground mt-3">{t("cards.currency.body")}</p>
              </div>
              <div
                aria-hidden
                className="border-background -m-8 flex flex-col justify-center border-x bg-linear-to-b from-transparent to-zinc-50 p-8"
              >
                <CurrencyIllustration />
              </div>
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {t("cards.security.title")}
                </h3>
                <p className="text-muted-foreground mt-3">{t("cards.security.body")}</p>
              </div>
              <div className="relative mb-6 flex">
                <Shield className="stroke-background fill-background m-auto size-24 drop-shadow-2xl drop-shadow-purple-900/15" />
                <Shield className="absolute inset-0 m-auto size-32 stroke-purple-900/25 stroke-[0.1]" />
                <Shield className="absolute inset-0 m-auto size-24 mask-b-from-35% fill-purple-100/50 stroke-purple-400 stroke-[0.1]" />
                <Shield
                  strokeDasharray="0.2 0.2"
                  className="absolute inset-0 m-auto size-40 stroke-purple-900/15 stroke-[0.1]"
                />
                <Shield
                  strokeDasharray="0.2 0.2"
                  className="absolute inset-0 m-auto size-48 stroke-purple-900/5 stroke-[0.1]"
                />
              </div>
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {t("cards.memory.title")}
                </h3>
                <p className="text-muted-foreground mt-3">{t("cards.memory.body")}</p>
              </div>
              <MemoryUsageIllustration />
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{t("cards.chip.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("cards.chip.body")}</p>
              </div>
              <ChipIllustration />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
