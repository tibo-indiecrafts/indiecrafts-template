import { cn } from "@/lib/utils";

import { Container } from "@/components/ui-primitives/grid-2-customers-one-container";

import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-2-customers-one-vercel";
import { Hulu } from "@/components/ui-primitives/svgs/grid-2-customers-one-hulu";
import { Beacon } from "@/components/ui-primitives/svgs/grid-2-customers-one-beacon";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/grid-2-customers-one-openai";
import { Bolt } from "@/components/ui-primitives/svgs/grid-2-customers-one-bolt";
import { LeapWalletLight as LeapWallet } from "@/components/ui-primitives/svgs/grid-2-customers-one-leap-wallet";
import { Paypal as PayPal } from "@/components/ui-primitives/svgs/grid-2-customers-one-paypal";
import { Polars } from "@/components/ui-primitives/svgs/grid-2-customers-one-polars";
import { Spotify } from "@/components/ui-primitives/svgs/grid-2-customers-one-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/grid-2-customers-one-stripe";
import { Cisco } from "@/components/ui-primitives/svgs/grid-2-customers-one-cisco";
import { PrimeVideo } from "@/components/ui-primitives/svgs/grid-2-customers-one-prime-video";

import Link from "next/link";

export function Customers() {
  return (
    <section>
      <Container asGrid className="grid @4xl:grid-cols-10">
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="@4xl:col-span-8">
          <div className="grid grid-cols-2 gap-px @lg:grid-cols-3 @3xl:grid-cols-4">
            <Integration name="Bolt" url="https://bolt.com">
              <Bolt className="w-16" />
            </Integration>
            <Integration name="LeapWallet" url="https://leapwallet.com">
              <LeapWallet className="w-24" />
            </Integration>
            <Integration name="Vercel" url="https://vercel.com">
              <VercelFull className="w-28" />
            </Integration>
            <Integration name="PayPal" url="https://paypal.com">
              <PayPal className="w-28" />
            </Integration>
            <Integration name="Polars" url="https://polars.com">
              <Polars className="w-28" />
            </Integration>
            <Integration name="Spotify" url="https://spotify.com">
              <Spotify className="w-28" />
            </Integration>

            <Integration name="Linear" url="https://linear.app">
              <OpenAIFull className="w-28" />
            </Integration>
            <Integration name="Hulu" url="https://hulu.com">
              <Hulu className="w-18" />
            </Integration>
            <Integration name="Beacon" url="https://beacon.com">
              <Beacon className="w-28" />
            </Integration>
            <Integration name="Stripe" url="https://stripe.com">
              <Stripe className="w-18" />
            </Integration>
            <Integration name="Cisco" url="https://cisco.com">
              <Cisco className="w-24" />
            </Integration>
            <Integration name="Primevideo" url="https://primevideo.com">
              <PrimeVideo className="w-24" />
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

const Integration = ({
  children,
  className,
  url,
  name,
}: {
  children: React.ReactNode;
  className?: string;
  url: string;
  name?: string;
}) => {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name} site`}
      className={cn("group relative flex aspect-square hover:z-10", className)}
    >
      <div className="pointer-events-none absolute inset-0 z-1 flex size-full duration-200 ease-out *:m-auto *:h-9 *:duration-200 group-hover:opacity-65 group-hover:*:-translate-y-3">
        {children}
      </div>
      <span className="pointer-events-none absolute inset-0 z-10 m-auto block size-fit translate-y-[150%] scale-97 text-sm font-medium opacity-0 duration-200 group-hover:scale-100 group-hover:opacity-100">
        Visit site
      </span>
      <div
        aria-hidden
        className="absolute inset-0 rounded opacity-0 shadow-2xl shadow-indigo-900/15 duration-200 group-hover:opacity-100"
      />
      <div
        data-grid-content
        className="**:fill-foreground group-hover:**:fill-muted-foreground hover:dither-lg relative flex size-full *:m-auto *:h-9 *:duration-200 group-hover:*:-translate-y-3"
      >
        {children}
      </div>
    </Link>
  );
};
