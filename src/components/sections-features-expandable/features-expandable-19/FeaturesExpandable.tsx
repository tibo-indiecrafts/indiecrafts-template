"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ComponentType } from "react";
import {
  Bot,
  Brain,
  Globe,
  Hourglass,
  Lock,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
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
import { featuresExpandable19Namespace } from "./config";
import type {
  FeatureIcon,
  FeatureIllustration,
  FeaturesExpandableBlock,
  StatIcon,
} from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  agentFeedback: AgentFeedbackIllustration,
  agentTaskPlanning: AgentTaskPlanningIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  aiSearch: AiSearchIllustration,
  calendar: CalendarIllustration,
  calendarMeeting: CalendarMeetingIllustration,
  campaign: CampaignIllustration,
  collaborationComment: CollaborationCommentIllustration,
  collaborationText: CollaborationTextIllustration,
  email: EmailIllustration,
  flow: FlowIllustration,
  flowCards: FlowCardsIllustration,
  kanban: KanbanIllustration,
  map: MapIllustration,
  models: ModelsIllustration,
  modelsCredits: ModelsCreditsIllustration,
  notes: NotesIllustration,
  notesChecklist: NotesChecklistIllustration,
  notesMeeting: NotesMeetingIllustration,
  tokenCounter: TokenCounterIllustration,
  translation: TranslationIllustration,
  workflow: WorkflowIllustration,
};

const ICONS: Record<FeatureIcon, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  bot: Bot,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  shieldCheck: ShieldCheck,
  hourglass: Hourglass,
  rocket: Rocket,
  lock: Lock,
};

const ILLUSTRATION_VARIANTS = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
};

const ROW_TEMPLATES = [
  "grid-rows-[1fr_auto_auto]",
  "grid-rows-[auto_1fr_auto]",
  "grid-rows-[auto_auto_1fr]",
] as const;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable19Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];
  const ctaExternal = props.ctaHref.startsWith("http");

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <div className="mx-auto max-w-5xl px-2 md:px-(--gutter)">
        <div className="bg-foreground/10 grid gap-px rounded-2xl p-px md:grid-cols-2">
          <div className="bg-background relative rounded-[15px]">
            <div className="flex h-full flex-col gap-12 px-6 pt-6 sm:p-12 sm:pb-6">
              <div className="text-balance">
                <h2
                  id={`${props.id}-title`}
                  className="text-foreground text-4xl font-medium"
                >
                  {tr(props.titleKey, "title")}
                </h2>
                <p className="text-muted-foreground mt-4 mb-6">
                  {tr(props.bodyKey, "body")}
                </p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={props.ctaHref}
                    target={ctaExternal ? "_blank" : undefined}
                    rel={ctaExternal ? "noopener noreferrer" : undefined}
                  >
                    {tr(props.ctaLabelKey, "ctaLabel")}
                  </a>
                </Button>
              </div>

              <div
                role="tablist"
                className={cn(
                  "mt-auto grid divide-y transition-all duration-300",
                  ROW_TEMPLATES[expandedIndex] ?? ROW_TEMPLATES[0],
                )}
              >
                {props.items.map((item, index) => {
                  const isActive = expandedIndex === index;
                  const Icon = ICONS[item.iconKey];
                  return (
                    <div
                      key={index}
                      data-expanded={isActive}
                      className="not-first:border-t-card group relative grid grid-rows-[auto_1fr] not-first:border-t"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleSelect(index)}
                        className="group flex w-full cursor-pointer items-center gap-3 py-4 text-left"
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

                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300",
                          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="text-muted-foreground pb-6 pl-7 text-balance">
                            {tRoot(item.bodyKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-background relative overflow-hidden rounded-[15px]">
            <div className="relative aspect-3/4 overflow-hidden rounded-[15px] md:h-full">
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
                  className="before:border-foreground/10 absolute inset-0 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[15px] before:border"
                >
                  <div className="dither absolute inset-0 opacity-75 dark:opacity-25">
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
                    className="size-full object-cover opacity-75 dark:opacity-40"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-background rounded-[15px] p-6 sm:p-12">
            <ul className="text-muted-foreground mt-auto space-y-3 text-sm">
              {props.stats.map((stat, index) => {
                const Icon = STAT_ICONS[stat.iconKey];
                return (
                  <li key={index} className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-4",
                        stat.iconKey === "hourglass"
                          ? "text-muted-foreground dark:text-blue-500/25"
                          : "*:nth-2:text-emerald-600 dark:text-emerald-500/25",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-foreground font-medium">
                      {tRoot(stat.labelKey)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-background flex flex-col justify-end rounded-[15px] p-6 sm:p-12">
            <div className="relative mt-auto max-w-xl">
              <p className="text-foreground max-w-xs text-balance">
                &ldquo;{tRoot(props.testimonial.quoteKey)}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                  <Image
                    src={props.testimonial.authorAvatarUrl}
                    alt=""
                    aria-hidden="true"
                    width={56}
                    height={56}
                  />
                </div>

                <div className="space-y-0.5">
                  <p className="text-foreground text-sm font-medium">
                    {tRoot(props.testimonial.authorNameKey)}
                  </p>
                  <span className="text-muted-foreground block text-xs">
                    {tRoot(props.testimonial.authorRoleKey)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
