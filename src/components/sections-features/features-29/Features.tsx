/* eslint-disable @next/next/no-img-element -- avatars are remote thumbnails */

import { Quote } from "lucide-react";
import { Container } from "@/components/ui-primitives/grid-1-landing-container";
import { AiSuggestionIllustration } from "@/components/ui-illustrations/grid-1-landing-ai-suggestion-illustration";
import { ChatIllustration } from "@/components/ui-illustrations/grid-1-landing-chat-illustration";
import { IntegrationsIllustration } from "@/components/ui-illustrations/grid-1-landing-integrations-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/grid-1-landing-invoice-illustration";
import { Stripe } from "@/components/ui-primitives/svgs/grid-1-landing-stripe";
import { useScopedT } from "@/i18n/scoped-t";
import { features29Namespace } from "./config";
import type { Features29Block } from "./schema";

const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";
const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

/**
 * Features-29 — JSX verbatim. Eyebrow + intro, 4-card grid (AI /
 * invoice / integrations / chat) interleaved with 2 stat tiles
 * and 2 quote cards (one inline, one in a trailing Container with
 * the Stripe wordmark).
 */
export default function Features(props: Readonly<Features29Block>) {
  const [t] = useScopedT(features29Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container>
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-foreground font-mono text-sm uppercase">
              <span className="text-foreground/50">{t("eyebrow.tag")}</span>{" "}
              {t("eyebrow.label")}
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
      <Container className="border-foreground/10 border-dashed **:data-[slot=content]:py-0">
        <div className="divide-foreground/10 grid grid-cols-2 divide-x divide-y overflow-hidden *:p-4 @4xl:grid-cols-4 @4xl:*:p-8 @5xl:*:p-12">
          <div className="col-span-full row-span-2 grid grid-rows-subgrid gap-8 @max-4xl:border-r-0 @4xl:col-span-2">
            <div className="mx-auto self-center">
              <AiSuggestionIllustration />
            </div>
            <div className="relative z-10 mx-auto max-w-sm text-center">
              <h3 className="font-semibold text-balance">{t("cards.ai.title")}</h3>
              <p className="text-muted-foreground mt-3">{t("cards.ai.body")}</p>
            </div>
          </div>
          <div className="col-span-full row-span-2 grid grid-rows-subgrid gap-8 border-r-0 @4xl:col-span-2">
            <div className="mx-auto min-w-xs self-center">
              <InvoiceIllustration />
            </div>
            <div className="relative z-10 mx-auto max-w-sm text-center">
              <h3 className="font-semibold text-balance">{t("cards.invoice.title")}</h3>
              <p className="text-muted-foreground mt-3">{t("cards.invoice.body")}</p>
            </div>
          </div>

          <div className="bg-card flex flex-col items-center justify-center space-y-1 text-center md:text-center @max-2xl:p-4 @4xl:border-b-0">
            <div className="text-foreground text-4xl font-bold">
              {t("stats.uptime.value")}
            </div>
            <p className="text-muted-foreground">{t("stats.uptime.label")}</p>
          </div>

          <div className="bg-card flex flex-col items-center justify-center space-y-1 text-center md:text-center @max-4xl:border-r-0 @max-2xl:p-4 @4xl:border-b-0">
            <div className="text-foreground text-4xl font-bold">
              {t("stats.savings.value")}
            </div>
            <p className="text-muted-foreground">{t("stats.savings.label")}</p>
          </div>
          <div className="bg-card relative col-span-2 border-r-0 border-b-0 @max-2xl:col-span-full @max-2xl:p-4">
            <blockquote className="relative max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-indigo-500">
              <p className="text-foreground">{t("quote1.text")}</p>

              <footer className="mt-4 flex items-center gap-2">
                <div className="ring-foreground/10 size-6 overflow-hidden rounded-md border border-transparent shadow ring-1">
                  <img
                    src={THEO_AVATAR}
                    alt={t("quote1.name")}
                    loading="lazy"
                    width={46}
                    height={46}
                  />
                </div>

                <cite>{t("quote1.name")}</cite>

                <span aria-hidden className="bg-foreground/15 size-1 rounded-full" />
                <span className="text-muted-foreground">{t("quote1.role")}</span>
              </footer>
            </blockquote>
          </div>
          <div className="col-span-2 row-span-2 grid grid-rows-subgrid gap-8 border-t border-b-0 p-8 @max-4xl:border-r-0">
            <div className="mx-auto w-84 max-w-lg scale-80 self-center">
              <IntegrationsIllustration />
            </div>

            <div className="mx-auto max-w-sm text-center">
              <h3 className="font-semibold text-balance">
                {t("cards.integrations.title")}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {t("cards.integrations.body")}
              </p>
            </div>
          </div>

          <div className="relative col-span-2 row-span-2 grid grid-rows-subgrid gap-8 border-t p-8">
            <div className="mx-auto w-full max-w-md self-center @4xl:px-8">
              <ChatIllustration />
            </div>

            <div className="relative z-10 mx-auto max-w-sm text-center">
              <h3 className="font-semibold text-balance">{t("cards.chat.title")}</h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {t("cards.chat.body")}
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Container className="**:data-[slot=content]:bg-background border-dashed **:data-[slot=content]:py-0 max-lg:**:data-[slot=content]:px-6">
        <div className="mx-auto max-w-2xl py-12 lg:pt-16">
          <Quote
            aria-hidden
            className="fill-background stroke-background size-6 drop-shadow-sm"
          />
          <Stripe className="mt-6 h-auto w-16" />
          <div className="mt-6">
            <p className='text-xl *:leading-relaxed before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-2xl'>
              {t("quote2.text")}
            </p>

            <div className="mt-12 flex items-center gap-3">
              <div className="ring-foreground/10 aspect-square size-10 overflow-hidden rounded-lg border border-transparent shadow-md ring-1 shadow-black/15">
                <img
                  src={MESCHAC_AVATAR}
                  alt={t("quote2.name")}
                  loading="lazy"
                  width={460}
                  height={460}
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">{t("quote2.name")}</p>
                <p className="text-muted-foreground text-xs">{t("quote2.role")}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
