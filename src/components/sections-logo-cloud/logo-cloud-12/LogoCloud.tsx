"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui-primitives/grid-1-landing-container";
import { Beacon } from "@/components/ui-primitives/svgs/grid-1-landing-beacon";
import { Bolt } from "@/components/ui-primitives/svgs/grid-1-landing-bolt";
import { Cisco } from "@/components/ui-primitives/svgs/grid-1-landing-cisco";
import { Hulu } from "@/components/ui-primitives/svgs/grid-1-landing-hulu";
import { OpenaiWordmarkLight as OpenAIFull } from "@/components/ui-primitives/svgs/grid-1-landing-openai";
import { Paypal as PayPal } from "@/components/ui-primitives/svgs/grid-1-landing-paypal";
import { Polars } from "@/components/ui-primitives/svgs/grid-1-landing-polars";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/grid-1-landing-prime-video";
import { Spotify } from "@/components/ui-primitives/svgs/grid-1-landing-spotify";
import { Stripe } from "@/components/ui-primitives/svgs/grid-1-landing-stripe";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/grid-1-landing-supabase";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-1-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { logoCloud12Namespace } from "./config";
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

/**
 * 4-group logo cloud with same rotator behavior as logo-cloud-11,
 * but wrapped in the grid-1 `Container` (bordered grid frame) and
 * a 4-column motion grid. Section follows the surrounding theme
 * (no `data-theme="dark"` override).
 */
export default function LogoCloud(props: Readonly<LogoCloudBlock>) {
  const [t, , tRoot] = useScopedT(logoCloud12Namespace);
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
      <Container className="bg-background lg:**:data-[slot=content]:py-16">
        <div className="mx-auto mb-12 max-w-xl text-center text-balance md:mb-16">
          <p
            data-current={currentGroup}
            className="text-muted-foreground mt-4 md:text-lg"
          >
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
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 perspective-dramatic md:h-10 md:grid-cols-4">
          <AnimatePresence initial={false} mode="popLayout">
            {logos[currentGroup].map((logo, i) => (
              <motion.div
                key={`${currentGroup}-${i}`}
                className="**:fill-foreground! flex items-center justify-center"
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(6px)", scale: 0.5 }}
                transition={{
                  delay: i * 0.05,
                  duration: 1,
                  type: "spring",
                  bounce: 0.2,
                }}
              >
                {logo}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
