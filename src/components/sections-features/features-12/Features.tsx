"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChartBarIncreasingIcon,
  Database,
  Fingerprint,
  IdCard,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { BorderBeam } from "@/components/ui-effects/border-beam";
import { useScopedT } from "@/i18n/scoped-t";
import { features12Namespace } from "./config";
import type { FeaturesBlock, FeaturesIcon } from "./schema";

const ICONS: Record<FeaturesIcon, LucideIcon> = {
  database: Database,
  fingerprint: Fingerprint,
  idCard: IdCard,
  chartBar: ChartBarIncreasingIcon,
  zap: Zap,
  shield: Shield,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features12Namespace);
  const [activeId, setActiveId] = useState(props.items[0]?.id ?? "");
  const active = props.items.find((item) => item.id === activeId) ?? props.items[0];

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-12 md:py-20 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-linear-to-b sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]" />
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16 lg:space-y-20">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-6xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground">{tr(props.bodyKey, "body")}</p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeId}
            onValueChange={(value) => value && setActiveId(value)}
            className="w-full"
          >
            {props.items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 text-base">
                      <Icon className="size-4" aria-hidden="true" />
                      {tRoot(item.labelKey)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>{tRoot(item.bodyKey)}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
            <div className="absolute inset-0 right-0 ml-auto w-15 border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]" />
            <div className="bg-background relative aspect-76/59 w-[calc(3/4*100%+3rem)] rounded-2xl">
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-muted size-full overflow-hidden rounded-2xl border shadow-md"
                  >
                    <Image
                      src={active.imageUrl}
                      className="size-full object-cover object-left-top"
                      alt={tRoot(active.imageAltKey)}
                      width={1207}
                      height={929}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
