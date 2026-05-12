import Link from "next/link";
import { Beacon } from "@/components/ui-primitives/svgs/libre-landing-beacon";
import { Hulu } from "@/components/ui-primitives/svgs/libre-landing-hulu";
import { Spotify } from "@/components/ui-primitives/svgs/libre-landing-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/libre-landing-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/libre-landing-supabase";
import { Tailwindcss as TailwindCSS } from "@/components/ui-primitives/svgs/libre-landing-tailwindcss";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/libre-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { logoCloud14Namespace } from "./config";
import type { LogoCloudBlock } from "./schema";

export default function LogoCloud(props: Readonly<LogoCloudBlock>) {
  const [, , tRoot] = useScopedT(logoCloud14Namespace);
  const external = props.caseStudyHref.startsWith("http");
  const verticalAligned = props.verticalAligned ?? false;

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <h2 id={`${props.id}-heading`} className="sr-only">
        {tRoot(props.introKey)}
      </h2>
      <div className={cn("bg-muted relative pt-24 pb-32", verticalAligned && "py-6")}>
        <div className="mx-auto max-w-5xl px-6">
          <div
            className={cn(
              "grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-6",
              verticalAligned && "mx-auto max-w-3xl lg:grid-cols-1 lg:gap-12",
            )}
          >
            <div
              className={cn(
                "space-y-4 max-lg:text-center",
                verticalAligned && "mx-auto max-w-md text-center",
              )}
            >
              <p className="text-foreground w-fit max-w-sm text-xl text-balance max-lg:mx-auto">
                {tRoot(props.introKey)}
              </p>

              <Link
                href={props.caseStudyHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-primary text-sm underline"
              >
                {tRoot(props.caseStudyLabelKey)}
              </Link>
            </div>
            <div className="**:fill-foreground grid grid-cols-3 items-center gap-y-12 sm:grid-cols-4">
              <div className="flex h-full items-center justify-center px-2">
                <Hulu height={16} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <Spotify height={22} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <Supabase height={20} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <Beacon height={16} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <VercelFull height={16} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <Stripe height={20} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <TailwindCSS height={20} width="auto" />
              </div>
              <div className="flex items-center justify-center px-2">
                <Stripe height={20} width="auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
