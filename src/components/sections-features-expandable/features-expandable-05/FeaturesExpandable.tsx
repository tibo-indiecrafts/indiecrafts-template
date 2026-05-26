"use client";
import { Bot, Brain, Cpu, Globe, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ComponentType } from "react";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/agent-task-planning-illustration";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { CalendarIllustration } from "@/components/ui-illustrations/calendar-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/flow-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { ModelsCreditsIllustration } from "@/components/ui-illustrations/models-credits-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { NotesIllustration } from "@/components/ui-illustrations/notes-illustration";
import { NotesMeetingIllustration } from "@/components/ui-illustrations/notes-meeting-illustration";
import { TokenCounterIllustration } from "@/components/ui-illustrations/token-counter-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { WorkflowIllustration } from "@/components/ui-illustrations/workflow-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable05Namespace } from "./config";
import type { FeatureIllustration, FeaturesExpandableBlock, TabIcon } from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  notesMeeting: NotesMeetingIllustration,
  calendar: CalendarIllustration,
  agentTaskPlanning: AgentTaskPlanningIllustration,
  models: ModelsIllustration,
  modelsCredits: ModelsCreditsIllustration,
  notes: NotesIllustration,
  notesChecklist: NotesChecklistIllustration,
  map: MapIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  workflow: WorkflowIllustration,
  tokenCounter: TokenCounterIllustration,
  translation: TranslationIllustration,
  flow: FlowIllustration,
};

const ICONS: Record<TabIcon, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  bot: Bot,
  sparkles: Sparkles,
  zap: Zap,
  cpu: Cpu,
};

const ILLUSTRATION_VARIANTS = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable05Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 grid items-end gap-6 px-(--gutter) text-balance md:mb-16 md:grid-cols-2">
          <h2
            id={`${props.id}-title`}
            className="text-foreground max-w-lg text-3xl font-semibold lg:text-4xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground text-lg">{tr(props.bodyKey, "body")}</p>
        </div>

        <div className="relative max-sm:pr-1 sm:pl-1 md:px-4">
          <div
            role="tablist"
            aria-label={tr(props.titleKey, "title")}
            className="pl-6 max-sm:pb-6 sm:absolute sm:bottom-20 sm:left-0 sm:z-20 sm:pt-4 sm:pl-8 md:bottom-14 md:pl-6 lg:bottom-22 lg:pl-10"
          >
            <div className="mt-auto flex flex-col">
              {props.items.map((item, index) => {
                const Icon = ICONS[item.iconKey];
                const isActive = expandedIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setExpandedIndex(index)}
                    className={cn(
                      "relative flex w-fit cursor-pointer items-center gap-2.5 pt-2 pb-3 text-left text-sm font-medium duration-200 active:scale-98 md:px-6",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/75",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {tRoot(item.tabLabelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mask-[url(/illustration-mask.svg)] mask-cover mask-no-repeat max-sm:mask-right md:mask-contain">
            <div className="absolute inset-0">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`illustration-${expandedIndex}`}
                  variants={ILLUSTRATION_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                  className="relative z-10 flex h-full scale-80 items-center justify-center"
                >
                  <ActiveIllustration />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`bg-${expandedIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none aspect-6/5 md:aspect-video @max-xl:aspect-5/7"
              >
                <Image
                  src={active.bgImageUrl}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="bg-muted size-full object-cover opacity-75 dark:opacity-50"
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
