"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Beacon } from "@/components/ui-primitives/svgs/dark-landing-beacon";
import { Bolt } from "@/components/ui-primitives/svgs/dark-landing-bolt";
import { Cisco } from "@/components/ui-primitives/svgs/dark-landing-cisco";
import { Hulu } from "@/components/ui-primitives/svgs/dark-landing-hulu";
import { LeapWalletDark as LeapWallet } from "@/components/ui-primitives/svgs/dark-landing-leap-wallet";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/dark-landing-openai";
import { Paypal as PayPal } from "@/components/ui-primitives/svgs/dark-landing-paypal";
import { Polars } from "@/components/ui-primitives/svgs/dark-landing-polars";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/dark-landing-prime-video";
import { Spotify } from "@/components/ui-primitives/svgs/dark-landing-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/dark-landing-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/dark-landing-supabase";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/dark-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud11Namespace } from "./config";
import type { LogoCloudBlock, LogoCloudGroupId } from "./schema";

const aiLogos: ReactNode[] = [
  <OpenAIFull key="openai" height={24} width="auto" />,
  <Bolt key="bolt" height={20} width="auto" />,
  <Cisco key="cisco-ai" height={32} width="auto" />,
  <Hulu key="hulu-ai" height={22} width="auto" />,
  <Spotify key="spotify-ai" height={24} width="auto" />,
];

const hostingLogos: ReactNode[] = [
  <Supabase key="supabase" height={24} width="auto" />,
  <Cisco key="cisco-hosting" height={32} width="auto" />,
  <Hulu key="hulu-hosting" height={22} width="auto" />,
  <Spotify key="spotify-hosting" height={24} width="auto" />,
  <VercelFull key="vercel" height={20} width="auto" />,
];

const paymentsLogos: ReactNode[] = [
  <Stripe key="stripe" height={24} width="auto" />,
  <PayPal key="paypal" height={24} width="auto" />,
  <LeapWallet key="leapwallet" height={24} width="auto" />,
  <Beacon key="beacon" height={20} width="auto" />,
  <Polars key="polars" height={24} width="auto" />,
];

const streamingLogos: ReactNode[] = [
  <Primevideo key="primevideo" height={28} width="auto" />,
  <Hulu key="hulu-streaming" height={22} width="auto" />,
  <Spotify key="spotify-streaming" height={24} width="auto" />,
  <Cisco key="cisco-streaming" height={32} width="auto" />,
  <Beacon key="beacon-streaming" height={20} width="auto" />,
];

const logos: Record<LogoCloudGroupId, ReactNode[]> = {
  ai: aiLogos,
  hosting: hostingLogos,
  payments: paymentsLogos,
  streaming: streamingLogos,
};

/**
 * Dark logo cloud with a single intro line whose inline category
 * accents flip color based on the currently-shown group, and a
 * 5-column motion grid rotating between groups every `rotationMs`.
 * JSX kept verbatim against the upstream Tailark staging file.
 */
export default function LogoCloud(props: Readonly<LogoCloudBlock>) {
  const [t, , tRoot] = useScopedT(logoCloud11Namespace);
  const interval = props.rotationMs ?? 2500;
  const [currentGroup, setCurrentGroup] = useState<LogoCloudGroupId>(
    props.groups[0]?.id ?? "ai",
  );

  useEffect(() => {
    if (props.groups.length <= 1) return;
    const id = setInterval(() => {
      setCurrentGroup((prev) => {
        const ids = props.groups.map((g) => g.id);
        const i = ids.indexOf(prev);
        return ids[(i + 1) % ids.length] ?? prev;
      });
    }, interval);
    return () => clearInterval(id);
  }, [props.groups, interval]);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background pb-16">
      <h2 id={`${props.id}-heading`} className="sr-only">
        {t("introLead")}
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center text-balance md:mb-16">
          <p data-current={currentGroup} className="text-muted-foreground text-lg">
            {t("introLead")}{" "}
            {props.groups.map((group, index) => (
              <span
                key={group.id}
                className={`in-data-[current=${group.id}]:text-foreground transition-colors duration-200`}
              >
                {tRoot(group.labelKey)}
                {index < props.groups.length - 1 ? " " : null}
              </span>
            ))}
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
