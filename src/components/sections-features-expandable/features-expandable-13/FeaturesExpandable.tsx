"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AgentFeedbackIllustration } from "@/components/ui-illustrations/agent-feedback-illustration";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/agent-task-planning-illustration";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { AiSearchIllustration } from "@/components/ui-illustrations/ai-search-illustration";
import { CalendarIllustration } from "@/components/ui-illustrations/calendar-illustration";
import { CalendarMeetingIllustration } from "@/components/ui-illustrations/calendar-meeting-illustration";
import { CollaborationCommentIllustration } from "@/components/ui-illustrations/collaboration-comment-illustration";
import { EmailIllustration } from "@/components/ui-illustrations/email-illustration";
import { FlowCardsIllustration } from "@/components/ui-illustrations/flow-cards-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/flow-illustration";
import { KanbanIllustration } from "@/components/ui-illustrations/kanban-illustration";
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
import { featuresExpandable13Namespace } from "./config";
import type { FeatureIllustration, FeaturesExpandableBlock } from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  notesMeeting: NotesMeetingIllustration,
  calendarMeeting: CalendarMeetingIllustration,
  agentTaskPlanning: AgentTaskPlanningIllustration,
  calendar: CalendarIllustration,
  collaborationComment: CollaborationCommentIllustration,
  flowCards: FlowCardsIllustration,
  kanban: KanbanIllustration,
  aiSearch: AiSearchIllustration,
  agentFeedback: AgentFeedbackIllustration,
  email: EmailIllustration,
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

const DEFAULT_AUTOPLAY_MS = 6000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable13Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setExpandedIndex((current) => (current + 1) % props.items.length);
    }, autoplayMs);
  }, [autoplayMs, props.items.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
    resetTimer();
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <div className="mx-auto max-w-6xl px-(--gutter) lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
          <div className="grid pt-6 max-lg:row-span-2 max-lg:grid-rows-subgrid lg:pb-6">
            <div className="text-balance">
              <h2
                id={`${props.id}-title`}
                className="text-foreground text-4xl font-medium"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg">
                {tr(props.bodyKey, "body")}
              </p>
            </div>

            <div role="tablist" className="mt-auto -ml-6 flex flex-col">
              {props.items.map((item, index) => {
                const isActive = expandedIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelect(index)}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-2 py-2 pr-6 text-left text-sm font-medium duration-200 active:scale-98",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/75",
                    )}
                  >
                    <div className="size-4">
                      {isActive ? <ProgressLoader durationMs={autoplayMs} /> : null}
                    </div>
                    {tRoot(item.tabLabelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative grid max-lg:row-span-2 max-lg:grid-rows-subgrid lg:col-span-2 lg:grid-cols-7 lg:gap-0">
            <div className="relative lg:col-span-4">
              <div
                aria-hidden
                className="border-foreground/15 pointer-events-none absolute -inset-x-1 -inset-y-8 rotate-45 border-y border-dashed mask-x-from-45%"
              />
              <div
                aria-hidden
                className="border-foreground/15 pointer-events-none absolute -inset-x-1 -inset-y-24 border-x border-dashed mask-y-from-75%"
              />

              <div
                style={{ "--bevel-size": "3rem" } as React.CSSProperties}
                className="corner-tr-bevel corner-bl-bevel bg-muted relative aspect-4/5 overflow-hidden rounded-xl rounded-tr-[3rem] rounded-bl-[3rem] lg:aspect-3/4 lg:h-full"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`illustration-${expandedIndex}`}
                    variants={ILLUSTRATION_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                    className="relative z-10 flex h-full scale-85 items-center justify-center"
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
            <div className="flex flex-col justify-center gap-3 lg:col-span-3 lg:pl-12">
              <h3 className="text-foreground text-lg font-medium">
                {tRoot(active.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm text-balance">
                {tRoot(active.bodyKey)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const LOADER_R = 10;
const LOADER_CIRCUMFERENCE = 2 * Math.PI * LOADER_R;

function ProgressLoader({ durationMs }: Readonly<{ durationMs: number }>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="size-4"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r={LOADER_R}
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.1"
      />
      <circle
        cx="12"
        cy="12"
        r={LOADER_R}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
        strokeDasharray={LOADER_CIRCUMFERENCE}
        strokeDashoffset={LOADER_CIRCUMFERENCE}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={LOADER_CIRCUMFERENCE}
          to={0}
          dur={`${durationMs}ms`}
          fill="freeze"
        />
      </circle>
    </svg>
  );
}
