"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui-effects/grid-2-landing-container";
import { Beacon } from "@/components/ui-primitives/svgs/grid-2-landing-beacon";
import { Bolt } from "@/components/ui-primitives/svgs/grid-2-landing-bolt";
import { Cisco } from "@/components/ui-primitives/svgs/grid-2-landing-cisco";
import { Hulu } from "@/components/ui-primitives/svgs/grid-2-landing-hulu";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/grid-2-landing-openai";
import { Paypal as PayPal } from "@/components/ui-primitives/svgs/grid-2-landing-paypal";
import { Polars } from "@/components/ui-primitives/svgs/grid-2-landing-polars";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/grid-2-landing-prime-video";
import { Spotify } from "@/components/ui-primitives/svgs/grid-2-landing-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/grid-2-landing-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/grid-2-landing-supabase";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-2-landing-vercel";
import { useScopedT } from "@/components/_lib/scoped-t";
import { logoCloud13Namespace } from "./config";
import type { LogoCloudBlock, LogoCloudGroupId } from "./schema";

const aiLogos: ReactNode[] = [
  <OpenAIFull key="openai" height={22} width="auto" />,
  <Bolt key="bolt" height={18} width="auto" />,
  <Cisco key="cisco" height={30} width="auto" />,
  <Hulu key="hulu" height={18} width="auto" />,
];
const hostingLogos: ReactNode[] = [
  <Supabase key="supabase" height={22} width="auto" />,
  <Cisco key="cisco" height={30} width="auto" />,
  <Hulu key="hulu" height={18} width="auto" />,
  <VercelFull key="vercel" height={18} width="auto" />,
];
const paymentsLogos: ReactNode[] = [
  <Stripe key="stripe" height={22} width="auto" />,
  <PayPal key="paypal" height={22} width="auto" />,
  <Beacon key="beacon" height={18} width="auto" />,
  <Polars key="polars" height={22} width="auto" />,
];
const streamingLogos: ReactNode[] = [
  <Primevideo key="primevideo" height={26} width="auto" />,
  <Hulu key="hulu" height={18} width="auto" />,
  <Spotify key="spotify" height={22} width="auto" />,
  <Cisco key="cisco" height={30} width="auto" />,
];

const logos: Record<LogoCloudGroupId, ReactNode[]> = {
  ai: aiLogos,
  hosting: hostingLogos,
  payments: paymentsLogos,
  streaming: streamingLogos,
};

export default function LogoCloud(props: Readonly<LogoCloudBlock>) {
  const [t, , tRoot] = useScopedT(logoCloud13Namespace);
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
    <section aria-labelledby={`${props.id}-heading`}>
      <h2 id={`${props.id}-heading`} className="sr-only">
        {t("introLead")}
      </h2>
      <Container asGrid className="grid-cols-2 md:grid-cols-4">
        <div className="col-span-full">
          <div data-grid-content className="py-20">
            <p
              data-current={currentGroup}
              className="text-muted-foreground mx-auto max-w-xl text-center text-balance md:text-lg lg:text-xl"
            >
              {t("introLead")}{" "}
              {props.groups.map((group, index) => (
                <span
                  key={group.id}
                  className={`in-data-[current=${group.id}]:text-indigo-500 transition-colors duration-200`}
                >
                  {tRoot(group.labelKey)}
                  {index < props.groups.length - 1 ? " " : null}
                </span>
              ))}
            </p>
          </div>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {logos[currentGroup].map((logo, i) => (
            <div key={`${currentGroup}-${i}`}>
              <div data-grid-content className="bg-card!">
                <motion.div
                  className="**:fill-foreground! flex h-24 items-center justify-center"
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    y: -24,
                    filter: "blur(6px)",
                    scale: 0.5,
                  }}
                  transition={{
                    delay: i * 0.05,
                    duration: 1,
                    type: "spring",
                    bounce: 0.4,
                  }}
                >
                  {logo}
                </motion.div>
              </div>
            </div>
          ))}
        </AnimatePresence>
      </Container>
    </section>
  );
}
