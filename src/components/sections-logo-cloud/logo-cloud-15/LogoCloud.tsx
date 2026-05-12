import { Beacon } from "@/components/ui-primitives/svgs/libre-landing-two-beacon";
import { Hulu } from "@/components/ui-primitives/svgs/libre-landing-two-hulu";
import { Spotify } from "@/components/ui-primitives/svgs/libre-landing-two-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/libre-landing-two-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/libre-landing-two-supabase";
import { Tailwindcss as TailwindCSS } from "@/components/ui-primitives/svgs/libre-landing-two-tailwindcss";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/libre-landing-two-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud15Namespace } from "./config";
import type { LogoCloud15Block } from "./schema";

export default function LogoCloud(props: Readonly<LogoCloud15Block>) {
  const [t] = useScopedT(logoCloud15Namespace);
  return (
    <section aria-labelledby={`${props.id}-heading`} className="py-24">
      <h2 id={`${props.id}-heading`} className="sr-only">
        {t("label")}
      </h2>
      <div className="mx-auto max-w-5xl px-6">
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
    </section>
  );
}
