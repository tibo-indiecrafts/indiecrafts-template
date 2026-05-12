"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud01Namespace } from "./config";
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
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { PayPal } from "@/components/ui-primitives/svgs/paypal";
import { LeapWallet } from "@/components/ui-primitives/svgs/leap-wallet";

const aiLogos: ReactNode[] = [
  <OpenAIFull key="openai" height={24} width="auto" />,
  <Bolt key="bolt" height={20} width="auto" />,
  <Cisco key="cisco" height={32} width="auto" />,
  <Hulu key="hulu" height={22} width="auto" />,
  <Spotify key="spotify" height={24} width="auto" />,
];

const hostingLogos: ReactNode[] = [
  <Supabase key="supabase" height={24} width="auto" />,
  <Cisco key="cisco" height={32} width="auto" />,
  <Hulu key="hulu" height={22} width="auto" />,
  <Spotify key="spotify" height={24} width="auto" />,
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
  <Hulu key="hulu" height={22} width="auto" />,
  <Spotify key="spotify" height={24} width="auto" />,
  <Cisco key="cisco" height={32} width="auto" />,
  <Beacon key="beacon" height={20} width="auto" />,
];

const logos: Record<"ai" | "hosting" | "streaming" | "payments", ReactNode[]> = {
  ai: aiLogos,
  hosting: hostingLogos,
  payments: paymentsLogos,
  streaming: streamingLogos,
};

type LogoGroup = keyof typeof logos;

/**
 * Logo cloud — cycles through brand-logo groups (AI / hosting / payments
 * / streaming) with a per-group caption highlighting the active set.
 * Sourced from `@tailark-pro/logo-cloud-02` (bundled with hero-section-3),
 * refactored to the project pattern: section semantics, translations
 * via `blocks.logo-cloud-01.*`, brand SVGs from `ui-primitives/svgs`.
 */
export function LogoCloud() {
  const [t] = useScopedT(logoCloud01Namespace);
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
    <section aria-label={t("label")}>
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="py-8 md:py-16">
          <div className="mx-auto mb-12 max-w-xl text-center text-balance md:mb-16">
            <p
              data-current={currentGroup}
              className="text-muted-foreground mt-4 md:text-lg"
            >
              {t("intro")}{" "}
              <span className="in-data-[current=ai]:text-foreground transition-colors duration-200">
                {t("groups.ai")},
              </span>{" "}
              <span className="in-data-[current=hosting]:text-foreground transition-colors duration-200">
                {t("groups.hosting")},
              </span>{" "}
              <span className="in-data-[current=payments]:text-foreground transition-colors duration-200">
                {t("groups.payments")},
              </span>{" "}
              <span className="in-data-[current=streaming]:text-foreground transition-colors duration-200">
                {t("groups.streaming")}
              </span>
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-3 items-center gap-8 perspective-dramatic md:h-10 md:grid-cols-5">
            <AnimatePresence initial={false} mode="popLayout">
              {logos[currentGroup].map((logo, i) => (
                <motion.div
                  key={`${currentGroup}-${i}`}
                  className="**:fill-foreground! flex items-center justify-center"
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
      </div>
    </section>
  );
}
