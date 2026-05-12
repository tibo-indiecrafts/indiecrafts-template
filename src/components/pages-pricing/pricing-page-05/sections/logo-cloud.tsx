import { Spotify } from "@/components/ui-primitives/svgs/grid-2-pricing-two-spotify";
import { Hulu } from "@/components/ui-primitives/svgs/grid-2-pricing-two-hulu";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/grid-2-pricing-two-supabase";
import { Beacon as BeaconLogo } from "@/components/ui-primitives/svgs/grid-2-pricing-two-beacon";
import { Stripe } from "@/components/ui-primitives/svgs/grid-2-pricing-two-stripe";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-2-pricing-two-vercel";
import { Cloudflare } from "@/components/ui-primitives/svgs/grid-2-pricing-two-cloudflare";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/grid-2-pricing-two-openai";
import { Container } from "@/components/ui-effects/grid-2-pricing-two-container";

export function LogoCloud() {
  return (
    <section>
      <Container asGrid>
        <div>
          <div data-grid-content className="p-12 text-center">
            <p className="text-muted-foreground mx-auto max-w-xl text-balance md:text-lg">
              Acme is trusted by leading teams from Generative AI Companies, Hosting
              Providers, Payments Providers, Streaming Providers
            </p>
          </div>
        </div>

        <div className="**:fill-foreground *:bg-card/75 grid grid-cols-2 items-center justify-center gap-px p-[0.5px] *:h-20 sm:grid-cols-4">
          <div className="flex items-center justify-center px-6">
            <Hulu height={20} width="auto" />
          </div>

          <div className="flex items-center justify-center px-6">
            <Spotify height={26} width="auto" />
          </div>
          <div className="flex items-center justify-center px-6">
            <Supabase height={24} width="auto" />
          </div>
          <div className="flex items-center justify-center px-6">
            <BeaconLogo height={20} width="auto" />
          </div>
          <div className="flex items-center justify-center px-6">
            <VercelFull height={20} width="auto" />
          </div>

          <div className="flex items-center justify-center px-6">
            <Stripe height={26} width="auto" />
          </div>
          <div className="flex items-center justify-center px-6">
            <OpenAIFull height={24} width="auto" />
          </div>
          <div className="flex items-center justify-center px-6">
            <Cloudflare height={20} width="auto" />
          </div>
        </div>
      </Container>
    </section>
  );
}
