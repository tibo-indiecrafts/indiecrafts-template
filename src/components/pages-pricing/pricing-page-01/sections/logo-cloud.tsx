"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { Beacon } from "@/components/ui-primitives/svgs/dark-pricing-beacon";
import { Bolt } from "@/components/ui-primitives/svgs/dark-pricing-bolt";
import { Cisco } from "@/components/ui-primitives/svgs/dark-pricing-cisco";
import { Hulu } from "@/components/ui-primitives/svgs/dark-pricing-hulu";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/dark-pricing-openai";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/dark-pricing-prime-video";
import { Stripe } from "@/components/ui-primitives/svgs/dark-pricing-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/dark-pricing-supabase";
import { Polars } from "@/components/ui-primitives/svgs/dark-pricing-polars";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/dark-pricing-vercel";
import { Spotify } from "@/components/ui-primitives/svgs/dark-pricing-spotify";
import { Paypal as PayPal } from "@/components/ui-primitives/svgs/dark-pricing-paypal";
import { LeapWalletDark as LeapWallet } from "@/components/ui-primitives/svgs/dark-pricing-leap-wallet";

const aiLogos: React.ReactNode[] = [
  <OpenAIFull key="openai" height={24} width="auto" />,
  <Bolt key="bolt" height={20} width="auto" />,
  <Cisco key="cisco-ai" height={32} width="auto" />,
  <Hulu key="hulu-ai" height={22} width="auto" />,
  <Spotify key="spotify-ai" height={24} width="auto" />,
];

const hostingLogos: React.ReactNode[] = [
  <Supabase key="supabase" height={24} width="auto" />,
  <Cisco key="cisco-hosting" height={32} width="auto" />,
  <Hulu key="hulu-hosting" height={22} width="auto" />,
  <Spotify key="spotify-hosting" height={24} width="auto" />,
  <VercelFull key="vercel" height={20} width="auto" />,
];

const paymentsLogos: React.ReactNode[] = [
  <Stripe key="stripe" height={24} width="auto" />,
  <PayPal key="paypal" height={24} width="auto" />,
  <LeapWallet key="leapwallet" height={24} width="auto" />,
  <Beacon key="beacon" height={20} width="auto" />,
  <Polars key="polars" height={24} width="auto" />,
];

const streamingLogos: React.ReactNode[] = [
  <Primevideo key="primevideo" height={28} width="auto" />,
  <Hulu key="hulu-streaming" height={22} width="auto" />,
  <Spotify key="spotify-streaming" height={24} width="auto" />,
  <Cisco key="cisco-streaming" height={32} width="auto" />,
  <Beacon key="beacon-streaming" height={20} width="auto" />,
];

const logos: Record<"ai" | "hosting" | "streaming" | "payments", React.ReactNode[]> = {
  ai: aiLogos,
  hosting: hostingLogos,
  payments: paymentsLogos,
  streaming: streamingLogos,
};

type LogoGroup = keyof typeof logos;

export function LogoCloud() {
  const [currentGroup, setCurrentGroup] = useState<LogoGroup>("ai");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroup((prev) => {
        const groups = Object.keys(logos) as LogoGroup[];
        const currentIndex = groups.indexOf(prev);
        const nextIndex = (currentIndex + 1) % groups.length;
        return groups[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center text-balance md:mb-16">
          <p data-current={currentGroup} className="text-muted-foreground text-lg">
            Acme is trusted by leading teams from{" "}
            <span className="in-data-[current=ai]:text-foreground transition-colors duration-200">
              Generative AI Companies,
            </span>{" "}
            <span className="in-data-[current=hosting]:text-foreground transition-colors duration-200">
              Hosting Providers,
            </span>{" "}
            <span className="in-data-[current=payments]:text-foreground transition-colors duration-200">
              Payments Providers,
            </span>{" "}
            <span className="in-data-[current=streaming]:text-foreground transition-colors duration-200">
              Streaming Providers
            </span>
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-3 items-center gap-8 perspective-dramatic md:h-10 md:grid-cols-5">
          <AnimatePresence initial={false} mode="popLayout">
            {logos[currentGroup].map((logo, i) => (
              <motion.div
                key={`${currentGroup}-${i}`}
                className="**:fill-foreground! flex h-10 items-center justify-center mask-b-from-55%"
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(6px)", scale: 0.5 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                {logo}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
