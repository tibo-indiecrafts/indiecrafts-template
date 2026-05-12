import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui-effects/libre-customers-one-card";
import { Stripe } from "@/components/ui-primitives/svgs/libre-customers-one-stripe";
import { SupabaseLight as Supabase } from "@/components/ui-primitives/svgs/libre-customers-one-supabase";
import { Hulu } from "@/components/ui-primitives/svgs/libre-customers-one-hulu";
import { VercelWordmark as Vercel } from "@/components/ui-primitives/svgs/libre-customers-one-vercel";
import { Polars } from "@/components/ui-primitives/svgs/libre-customers-one-polars";
import { Cisco } from "@/components/ui-primitives/svgs/libre-customers-one-cisco";
import { Spotify } from "@/components/ui-primitives/svgs/libre-customers-one-spotify";
import { Beacon } from "@/components/ui-primitives/svgs/libre-customers-one-beacon";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/libre-customers-one-prime-video";
import { LeapWalletLight as LeapWallet } from "@/components/ui-primitives/svgs/libre-customers-one-leap-wallet";

export function MainCustomers() {
  return (
    <section className="@container">
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-24 md:py-24 lg:pb-36">
        <div className="lg:-mx-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 @3xl:grid-cols-4 @3xl:grid-rows-5">
            <Card className="group relative col-span-full p-6 shadow-2xl shadow-indigo-900/25 lg:p-12 @3xl:col-span-2 @3xl:row-span-2">
              <div className="max-w-md space-y-12">
                <Stripe className="h-8 w-18" />
                <p className="text-3xl font-normal">
                  Bolt implemented our streaming optimization suite to{" "}
                  <span className="text-foreground font-semibold">
                    reduce buffering by 62% during peak viewing hours.
                  </span>
                </p>
                <Link
                  href="#"
                  className="text-primary flex items-center font-medium before:absolute before:inset-0"
                >
                  Read Story
                  <ChevronRight
                    className="ml-2 size-3 translate-y-0.5 duration-200 group-hover:translate-x-0.5"
                    strokeWidth={3}
                  />
                </Link>
              </div>
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12">
              <Polars className="*:fill-foreground h-8 w-18" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12">
              <Cisco className="*:last:fill-foreground! h-8 w-18" />
            </Card>
            <Card className="group relative col-span-full p-6 shadow-2xl shadow-indigo-900/25 lg:p-12 @3xl:col-span-2 @3xl:row-span-2">
              <div className="max-w-md space-y-12">
                <Supabase className="h-8 w-36" />
                <p className="text-3xl font-normal">
                  Bolt implemented our streaming optimization suite to{" "}
                  <span className="text-foreground font-semibold">
                    reduce buffering by 62% during peak viewing hours.
                  </span>
                </p>
                <Link
                  href="#"
                  className="text-primary flex items-center font-medium before:absolute before:inset-0"
                >
                  Read Story
                  <ChevronRight
                    className="ml-2 size-3 translate-y-0.5 duration-200 group-hover:translate-x-0.5"
                    strokeWidth={3}
                  />
                </Link>
              </div>
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12">
              <Hulu className="*:fill-foreground h-8 w-18" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12">
              <Vercel className="*:fill-foreground h-8 w-18" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12 @3xl:col-start-2">
              <Spotify className="*:fill-foreground h-8 w-24" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12 @3xl:col-start-3">
              <Beacon className="*:fill-foreground h-8 w-24" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12 @3xl:col-start-4">
              <Primevideo className="*:fill-foreground h-8 w-24" />
            </Card>
            <Card className="flex items-center justify-center bg-transparent p-6 shadow-none lg:p-12 @3xl:col-start-3 @3xl:row-start-5">
              <LeapWallet className="*:fill-foreground h-8 w-24" />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
