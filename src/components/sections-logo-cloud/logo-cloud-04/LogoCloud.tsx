import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud04Namespace } from "./config";

export function LogoCloud() {
  const [t] = useScopedT(logoCloud04Namespace);

  return (
    <section aria-labelledby="logo-cloud-04-headline" className="mx-auto mt-44 max-w-sm">
      <div>
        <p
          id="logo-cloud-04-headline"
          className="text-foreground mx-auto w-fit max-w-56 text-sm text-balance"
        >
          {t("headline")}
        </p>
      </div>
      <div className="**:fill-foreground mt-4 grid grid-cols-2 items-center justify-center *:h-16 sm:grid-cols-3">
        <div className="flex h-full items-center justify-center px-2">
          <Hulu height={16} width="auto" aria-label="Hulu" />
        </div>
        <div className="flex items-center justify-center px-2">
          <Spotify height={22} width="auto" aria-label="Spotify" />
        </div>
        <div className="flex items-center justify-center px-2">
          <Stripe height={20} width="auto" aria-label="Stripe" />
        </div>
        <div className="flex items-center justify-center px-2">
          <Beacon height={16} width="auto" aria-label="Beacon" />
        </div>
        <div className="flex items-center justify-center px-2">
          <VercelFull height={16} width="auto" aria-label="Vercel" />
        </div>
        <div className="flex items-center justify-center px-2">
          <Supabase height={20} width="auto" aria-label="Supabase" />
        </div>
      </div>
    </section>
  );
}
