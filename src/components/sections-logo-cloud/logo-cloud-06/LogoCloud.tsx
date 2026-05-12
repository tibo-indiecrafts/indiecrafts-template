"use client";
import { GeminiFull } from "@/components/ui-primitives/svgs/gemini";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { OpenAIFull } from "@/components/ui-primitives/svgs/open-ai";
import { Primevideo } from "@/components/ui-primitives/svgs/prime";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Polars } from "@/components/ui-primitives/svgs/polars";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { PayPal } from "@/components/ui-primitives/svgs/paypal";
import { LeapWallet } from "@/components/ui-primitives/svgs/leap-wallet";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud06Namespace } from "./config";

const aiLogos: ReactNode[] = [
  <OpenAIFull key="openai" height={24} width="auto" />,
  <Bolt key="bolt" height={20} width="auto" />,
  <GeminiFull key="gemini" height={24} width="auto" className="-translate-y-0.5" />,
];
const hostingLogos: ReactNode[] = [
  <Supabase key="supabase" height={24} width="auto" />,
  <Cloudflare key="cloudflare" height={24} width="auto" />,
  <VercelFull key="vercel" height={20} width="auto" />,
];
const paymentsLogos: ReactNode[] = [
  <Stripe key="stripe" height={24} width="auto" />,
  <PayPal key="paypal" height={24} width="auto" />,
  <LeapWallet key="leapwallet" height={24} width="auto" />,
];
const streamingLogos: ReactNode[] = [
  <Primevideo key="primevideo" height={28} width="auto" />,
  <Hulu key="hulu" height={22} width="auto" />,
  <Spotify key="spotify" height={24} width="auto" />,
];
const otherLogos: ReactNode[] = [
  <Cisco key="cisco" height={32} width="auto" />,
  <Beacon key="beacon" height={20} width="auto" />,
  <Polars key="polars" height={24} width="auto" />,
];

const SLOTS: { logos: ReactNode[]; group: string; mobileVisible: boolean }[] = [
  { logos: aiLogos, group: "ai", mobileVisible: true },
  { logos: hostingLogos, group: "hosting", mobileVisible: true },
  { logos: paymentsLogos, group: "payments", mobileVisible: true },
  { logos: streamingLogos, group: "streaming", mobileVisible: true },
  { logos: otherLogos, group: "other", mobileVisible: false },
];

export function LogoCloud() {
  const [t] = useScopedT(logoCloud06Namespace);
  const [logoIndices, setLogoIndices] = useState<number[]>(SLOTS.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndices((prev) => prev.map((idx, i) => (idx + 1) % SLOTS[i].logos.length));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-label={t("label")} className="bg-background py-24">
      <h2 className="sr-only">{t("label")}</h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-4 lg:grid-cols-5">
          {SLOTS.map((slot, i) => (
            <SlotCycle
              key={slot.group}
              logos={slot.logos}
              group={slot.group}
              logoIndex={logoIndices[i]}
              className={slot.mobileVisible ? undefined : "max-lg:hidden"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const SlotCycle = ({
  logos,
  group,
  logoIndex = 0,
  className,
}: {
  logos: ReactNode[];
  group?: string;
  logoIndex?: number;
  className?: string;
}) => (
  <div className={cn("relative h-10", className)}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={`${group}-${logoIndex}`}
        initial={{ opacity: 0, scale: 0.75, y: -24, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.75, y: 24, filter: "blur(6px)" }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex *:m-auto"
      >
        {logos[logoIndex]}
      </motion.div>
    </AnimatePresence>
  </div>
);
