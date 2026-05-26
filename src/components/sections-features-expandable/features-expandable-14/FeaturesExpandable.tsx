"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ComponentType } from "react";
import { Bot, Brain, Globe, type LucideIcon } from "lucide-react";
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
import { featuresExpandable14Namespace } from "./config";
import type { FeatureIcon, FeatureIllustration, FeaturesExpandableBlock } from "./schema";

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

const ICONS: Record<FeatureIcon, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  bot: Bot,
};

const FRAME_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable14Namespace);
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
      className="bg-background @container overflow-hidden py-24"
    >
      <div className="mx-auto my-1 max-w-6xl px-(--gutter)">
        <div className="mb-12 grid items-end gap-6 md:mb-20 md:grid-cols-2 lg:px-12">
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

        <div className="mask-b-from-35% mask-b-to-95%">
          <div className="bg-background relative overflow-hidden rounded-t-2xl px-3 pt-3 sm:px-12 sm:pt-12">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`illustration-${expandedIndex}`}
                variants={FRAME_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                className="bg-card ring-border relative z-10 flex aspect-4/5 h-full items-center justify-center overflow-hidden rounded-xl shadow-md ring shadow-black/4 *:scale-85 sm:aspect-square md:aspect-video"
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
                className="before:border-foreground/10 absolute inset-0 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-t-2xl before:border"
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
        </div>

        <div
          role="tablist"
          className="divide-foreground/10 grid divide-dashed max-sm:divide-y sm:mt-12 sm:grid-cols-3 sm:divide-x lg:px-6"
        >
          {props.items.map((item, index) => {
            const isActive = expandedIndex === index;
            const Icon = ICONS[item.iconKey];
            return (
              <div key={index} className="group">
                <div
                  data-expanded={isActive}
                  className="group relative not-data-[expanded=true]:opacity-50 not-data-[expanded=true]:hover:opacity-75 max-lg:group-first:pl-0 max-lg:group-last:pr-0 max-sm:py-6 sm:px-6"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelect(index)}
                    className="group flex w-full cursor-pointer items-center gap-3 text-left before:absolute before:inset-0"
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <h3
                      className={cn(
                        "group-hover:text-foreground font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {tRoot(item.titleKey)}
                    </h3>
                  </button>

                  <p className="text-muted-foreground mt-3 text-balance">
                    {tRoot(item.bodyKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
