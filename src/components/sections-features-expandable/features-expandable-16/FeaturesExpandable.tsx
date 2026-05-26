"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ComponentType } from "react";
import { AgentFeedbackIllustration } from "@/components/ui-illustrations/agent-feedback-illustration";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/agent-task-planning-illustration";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { AiSearchIllustration } from "@/components/ui-illustrations/ai-search-illustration";
import { CalendarIllustration } from "@/components/ui-illustrations/calendar-illustration";
import { CalendarMeetingIllustration } from "@/components/ui-illustrations/calendar-meeting-illustration";
import { CampaignIllustration } from "@/components/ui-illustrations/campaign-illustration";
import { CollaborationCommentIllustration } from "@/components/ui-illustrations/collaboration-comment-illustration";
import { CollaborationTextIllustration } from "@/components/ui-illustrations/collaboration-text-illustration";
import { EmailIllustration } from "@/components/ui-illustrations/email-illustration";
import { FlowCardsIllustration } from "@/components/ui-illustrations/flow-cards-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/flow-illustration";
import { KanbanIllustration } from "@/components/ui-illustrations/kanban-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import { ModelsCreditsIllustration } from "@/components/ui-illustrations/models-credits-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { NotesIllustration } from "@/components/ui-illustrations/notes-illustration";
import { NotesMeetingIllustration } from "@/components/ui-illustrations/notes-meeting-illustration";
import { TokenCounterIllustration } from "@/components/ui-illustrations/token-counter-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { WorkflowIllustration } from "@/components/ui-illustrations/workflow-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable16Namespace } from "./config";
import type { FeatureIllustration, FeaturesExpandableBlock } from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  campaign: CampaignIllustration,
  collaborationText: CollaborationTextIllustration,
  notesMeeting: NotesMeetingIllustration,
  agentFeedback: AgentFeedbackIllustration,
  agentTaskPlanning: AgentTaskPlanningIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  aiSearch: AiSearchIllustration,
  calendar: CalendarIllustration,
  calendarMeeting: CalendarMeetingIllustration,
  collaborationComment: CollaborationCommentIllustration,
  email: EmailIllustration,
  flow: FlowIllustration,
  flowCards: FlowCardsIllustration,
  kanban: KanbanIllustration,
  map: MapIllustration,
  models: ModelsIllustration,
  modelsCredits: ModelsCreditsIllustration,
  notes: NotesIllustration,
  notesChecklist: NotesChecklistIllustration,
  tokenCounter: TokenCounterIllustration,
  translation: TranslationIllustration,
  workflow: WorkflowIllustration,
};

const FRAME_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable16Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container relative overflow-hidden py-24"
    >
      <div className="mx-auto my-1 max-w-6xl px-(--gutter)">
        <div className="bg-background relative mb-12 grid items-end gap-6 rounded-t-[15px] sm:mb-20 md:grid-cols-2 lg:gap-12 lg:px-12">
          <h2
            id={`${props.id}-title`}
            className="text-foreground text-4xl font-semibold text-balance"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            {tr(props.bodyKey, "body")}
          </p>
        </div>

        <div className="bg-background relative overflow-hidden rounded-2xl p-3 sm:p-12">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={`illustration-${expandedIndex}`}
              variants={FRAME_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
              className="bg-card ring-border relative z-10 flex aspect-square h-full items-center justify-center rounded-xl shadow-md ring shadow-black/4 *:scale-85 md:aspect-video"
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
              className="before:border-foreground/10 absolute inset-0 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-2xl before:border"
            >
              <div className="dither absolute inset-0 opacity-25 dark:opacity-30">
                <Image
                  src={active.bgImageUrl}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="size-full object-cover opacity-50"
                  unoptimized
                />
              </div>
              <Image
                src={active.bgImageUrl}
                alt=""
                aria-hidden="true"
                fill
                className="size-full object-cover opacity-50"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative py-4 lg:px-9">
          <div role="tablist" className="flex max-lg:-ml-3">
            {props.items.map((item, index) => {
              const isActive = expandedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-expanded={isActive}
                  onClick={() => handleSelect(index)}
                  className="not-data-[expanded=true]:hover:bg-foreground/5 group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left duration-200 active:scale-98"
                >
                  <span
                    className={cn(
                      "group-hover:text-foreground text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {tRoot(item.titleKey)}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            <motion.p
              key={`body-${expandedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground mt-2 max-w-xl text-lg text-balance lg:pl-3"
            >
              {tRoot(active.bodyKey)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
