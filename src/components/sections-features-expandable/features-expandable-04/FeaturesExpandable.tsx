"use client";
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
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable04Namespace } from "./config";
import type { FeatureIllustration, FeaturesExpandableBlock } from "./schema";

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

const ILLUSTRATION_VARIANTS = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable04Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="grid sm:grid-cols-7 sm:gap-6 md:gap-12">
          <div className="flex flex-col gap-12 pb-6 sm:col-span-3 md:py-12">
            <div className="text-balance">
              <h2
                id={`${props.id}-title`}
                className="text-foreground text-3xl font-semibold lg:text-4xl"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg">
                {tr(props.bodyKey, "body")}
              </p>
            </div>

            <div
              role="tablist"
              aria-label={tr(props.titleKey, "title")}
              className="mt-auto -ml-6 flex flex-col"
            >
              {props.items.map((item, index) => {
                const isActive = expandedIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setExpandedIndex(index)}
                    className={cn(
                      "relative w-fit cursor-pointer px-6 pt-2 pb-3 text-left text-sm font-medium duration-200 active:scale-98",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/75",
                    )}
                  >
                    {tRoot(item.tabLabelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative not-sm:overflow-hidden sm:col-span-4">
            <div
              aria-hidden
              className="border-foreground/15 pointer-events-none absolute -inset-x-1 -inset-y-10 rotate-45 border-y border-dashed mask-x-from-45% max-lg:hidden"
            />
            <div
              aria-hidden
              className="border-foreground/15 pointer-events-none absolute -inset-x-1 -inset-y-24 border-x border-dashed mask-y-from-75%"
            />

            <div
              // `--bevel-size` matches the paired `rounded-tr-[5rem]` /
              // `rounded-bl-[5rem]` so the clip-path utilities chamfer
              // the corners at the same dimensions as the rounded radii.
              style={{ "--bevel-size": "5rem" } as React.CSSProperties}
              className="corner-tr-bevel corner-bl-bevel bg-muted relative aspect-4/5 overflow-hidden rounded-xl rounded-tr-[5rem] rounded-bl-[5rem]"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`illustration-${expandedIndex}`}
                  variants={ILLUSTRATION_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                  className="relative z-10 flex h-full scale-85 items-center justify-start max-sm:pt-12 md:justify-center"
                >
                  <ActiveIllustration />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`bg-${expandedIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.bgImageUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="size-full object-cover opacity-75 dark:opacity-50"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
