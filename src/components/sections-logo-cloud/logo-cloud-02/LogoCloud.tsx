import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import TailwindCSS from "@/components/ui-primitives/svgs/tailwindcss";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud02CaseStudiesHref, logoCloud02Namespace } from "./config";

export function LogoCloud() {
  const [t] = useScopedT(logoCloud02Namespace);

  return (
    <section aria-labelledby="logo-cloud-02-headline" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-6">
          <div className="space-y-4 max-lg:text-center">
            <p
              id="logo-cloud-02-headline"
              className="text-foreground w-fit max-w-sm text-xl text-balance max-lg:mx-auto"
            >
              {t("headline")}
            </p>

            <Link
              href={logoCloud02CaseStudiesHref as Parameters<typeof Link>[0]["href"]}
              className="text-primary text-sm underline"
            >
              {t("caseStudiesLabel")}
            </Link>
          </div>
          <div className="**:fill-foreground grid grid-cols-3 items-center gap-y-12 sm:grid-cols-4">
            <div className="flex h-full items-center justify-center px-2">
              <Hulu height={16} width="auto" aria-label="Hulu" />
            </div>
            <div className="flex items-center justify-center px-2">
              <Spotify height={22} width="auto" aria-label="Spotify" />
            </div>
            <div className="flex items-center justify-center px-2">
              <Supabase height={20} width="auto" aria-label="Supabase" />
            </div>
            <div className="flex items-center justify-center px-2">
              <Beacon height={16} width="auto" aria-label="Beacon" />
            </div>
            <div className="flex items-center justify-center px-2">
              <VercelFull height={16} width="auto" aria-label="Vercel" />
            </div>
            <div className="flex items-center justify-center px-2">
              <Stripe height={20} width="auto" aria-label="Stripe" />
            </div>
            <div className="flex items-center justify-center px-2">
              <TailwindCSS height={20} width="auto" aria-label="Tailwind CSS" />
            </div>
            <div className="flex items-center justify-center px-2">
              <Stripe height={20} width="auto" aria-label="Stripe" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
