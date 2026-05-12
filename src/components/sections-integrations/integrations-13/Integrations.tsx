import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import { Container } from "@/components/ui-primitives/grid-2-landing-container";
import { Claude as ClaudeAiIcon } from "@/components/ui-primitives/svgs/grid-2-landing-claude";
import { Cloudflare } from "@/components/ui-primitives/svgs/grid-2-landing-cloudflare";
import { GooglePalm } from "@/components/ui-primitives/svgs/grid-2-landing-google-palm";
import { Vercel } from "@/components/ui-primitives/svgs/grid-2-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations13Namespace } from "./config";
import type { IntegrationsBlock } from "./schema";

function Integration({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("group relative flex aspect-square hover:z-10", className)}>
      <div className="pointer-events-none absolute inset-0 z-1 flex size-full duration-200 ease-out *:m-auto *:size-10 *:duration-200 group-hover:opacity-65 group-hover:*:-translate-y-3">
        {children}
      </div>
      <span className="pointer-events-none absolute inset-0 z-10 m-auto block size-fit translate-y-[125%] scale-97 text-sm font-medium opacity-0 duration-200 group-hover:scale-100 group-hover:opacity-100">
        {label}
      </span>
      <div className="absolute inset-0 rounded opacity-0 shadow-2xl shadow-indigo-900/15 duration-200 group-hover:opacity-100" />
      <div
        data-grid-content
        className="**:fill-foreground group-hover:**:fill-muted-foreground hover:dither-lg relative flex size-full *:m-auto *:size-10 *:duration-200 group-hover:*:-translate-y-3"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Integrations-13 — JSX verbatim. Intro + 4 hover-reveal logo cells
 * split between Platform / LLMs.
 */
export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [t] = useScopedT(integrations13Namespace);
  const external = props.ctaHref.startsWith("http");

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
            <p className="text-muted-foreground mb-8 text-lg text-balance">{t("body")}</p>

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

      <Container asGrid className="grid @4xl:grid-cols-6">
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>

        <div className="@4xl:col-span-4">
          <div className="grid gap-px @lg:grid-cols-4">
            <div data-grid-content className="col-span-2 p-4! text-center">
              <span className="text-muted-foreground font-mono text-sm">
                {t("groups.platform")}
              </span>
            </div>

            <div
              data-grid-content
              className="col-span-2 p-4! text-center @max-lg:row-start-3"
            >
              <span className="text-muted-foreground font-mono text-sm">
                {t("groups.llms")}
              </span>
            </div>

            <Integration label={t("cells.cloudflare")}>
              <Cloudflare />
            </Integration>

            <Integration label={t("cells.vercel")}>
              <Vercel />
            </Integration>

            <Integration label={t("cells.googlePalm")}>
              <GooglePalm />
            </Integration>

            <Integration label={t("cells.claude")}>
              <ClaudeAiIcon />
            </Integration>
          </div>
        </div>

        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
    </section>
  );
}
