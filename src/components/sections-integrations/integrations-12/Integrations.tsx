import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-effects/grid-1-landing-button";
import { Container } from "@/components/ui-effects/grid-1-landing-container";
import { Claude as ClaudeAI } from "@/components/ui-primitives/svgs/grid-1-landing-claude";
import { Cloudflare } from "@/components/ui-primitives/svgs/grid-1-landing-cloudflare";
import { Gemini } from "@/components/ui-primitives/svgs/grid-1-landing-gemini";
import { GooglePalm } from "@/components/ui-primitives/svgs/grid-1-landing-google-palm";
import { Linear } from "@/components/ui-primitives/svgs/grid-1-landing-linear";
import { Mediawiki } from "@/components/ui-primitives/svgs/grid-1-landing-mediawiki";
import { Openai as OpenAI } from "@/components/ui-primitives/svgs/grid-1-landing-openai";
import { Replit } from "@/components/ui-primitives/svgs/grid-1-landing-replit";
import { Vercel } from "@/components/ui-primitives/svgs/grid-1-landing-vercel";
import { Vscodium } from "@/components/ui-primitives/svgs/grid-1-landing-vscodium";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations12Namespace } from "./config";
import type { IntegrationsBlock } from "./schema";

function Integration({
  children,
  isHighlighted = false,
  className,
}: {
  children: ReactNode;
  isHighlighted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        isHighlighted
          ? "bg-card ring-border-illustration shadow ring shadow-black/6.5"
          : "border-border-illustration bg-foreground/3 border *:size-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [t] = useScopedT(integrations12Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container>
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-foreground font-mono text-sm uppercase">
              <span className="text-muted-foreground">{t("eyebrow.tag")}</span>{" "}
              {t("eyebrow.label")}
            </span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-6 text-4xl font-semibold text-balance lg:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground mb-6 text-lg text-balance">{t("body")}</p>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={props.ctaHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {t("cta")}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
      <Container className="**:data-[slot=content]:pt-0">
        <div className="border-b">
          <div className="relative mx-auto max-w-4xl border-x">
            <div className="grid grid-cols-4 gap-0 *:relative *:flex *:aspect-square *:items-center *:justify-center sm:grid-cols-8 md:grid-cols-12">
              <Integration isHighlighted>
                <Cloudflare className="size-6" />
              </Integration>
              <Integration isHighlighted className="col-start-3">
                <Gemini className="size-6" />
              </Integration>
              <Integration className="col-start-5 max-sm:hidden lg:border-t-0">
                <Vercel className="size-6" />
              </Integration>
              <Integration className="col-start-7 max-sm:hidden lg:border-t-0">
                <Vscodium className="*:fill-foreground size-6" />
              </Integration>
              <Integration isHighlighted className="col-start-9 max-md:hidden">
                <Linear className="size-6" />
              </Integration>
              <Integration className="col-start-11 max-md:hidden lg:border-t-0">
                <Replit className="*:fill-foreground size-6" />
              </Integration>
              <Integration className="col-start-2 row-start-2 lg:border-b-0">
                <OpenAI className="size-6" />
              </Integration>
              <Integration isHighlighted className="col-start-4 row-start-2">
                <ClaudeAI className="size-6" />
              </Integration>
              <Integration
                isHighlighted
                className="col-start-6 row-start-2 max-sm:hidden"
              >
                <GooglePalm className="size-6" />
              </Integration>
              <Integration className="col-start-8 row-start-2 max-sm:hidden lg:border-b-0">
                <OpenAI className="size-6" />
              </Integration>
              <Integration className="col-start-10 row-span-2 max-md:hidden lg:border-b-0">
                <Vercel className="size-6" />
              </Integration>
              <Integration
                isHighlighted
                className="col-start-12 row-start-2 max-md:hidden"
              >
                <Mediawiki className="size-6" />
              </Integration>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
