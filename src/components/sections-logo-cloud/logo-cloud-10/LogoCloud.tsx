import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud10Namespace } from "./config";

export function LogoCloud() {
  const [t] = useScopedT(logoCloud10Namespace);

  return (
    <section aria-labelledby="logo-cloud-10-intro" className="relative py-24">
      <div className="relative text-center">
        <div className="px-6">
          <p
            id="logo-cloud-10-intro"
            className="text-muted-foreground mx-auto max-w-xl text-balance md:text-lg"
          >
            {t("intro")}
          </p>
        </div>
        <div className="border-foreground/10 mt-6 border-y">
          <div className="mx-auto max-w-5xl px-2">
            <div className="**:fill-foreground bg-foreground/10 *:hover:bg-background/70 *:bg-background/95 mx-px grid grid-cols-2 items-center justify-center gap-px *:h-20 *:transition-colors *:duration-200 sm:grid-cols-4">
              <div className="flex items-center justify-center rounded px-6">
                <Hulu height={20} width="auto" aria-label="Hulu" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <Spotify height={26} width="auto" aria-label="Spotify" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <Supabase height={24} width="auto" aria-label="Supabase" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <Beacon height={20} width="auto" aria-label="Beacon" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <VercelFull height={20} width="auto" aria-label="Vercel" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <Stripe height={26} width="auto" aria-label="Stripe" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <OpenAIFull height={24} width="auto" aria-label="OpenAI" />
              </div>
              <div className="flex items-center justify-center rounded px-6">
                <Cloudflare height={20} width="auto" aria-label="Cloudflare" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="border-foreground/10 pointer-events-none absolute inset-0 mx-auto flex max-w-5xl justify-between border-x"
      >
        <div className="border-foreground/10 relative h-full w-2 border-r" />
        <div className="border-foreground/10 relative h-full w-2 border-l" />
      </div>
    </section>
  );
}
