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
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable17Namespace } from "./config";
import type {
  FeatureIcon,
  FeatureIllustration,
  FeaturesExpandableBlock,
  StatIcon,
  SupportiveContent,
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

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, , tRoot] = useScopedT(featuresExpandable17Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];
  const ctaExternal = active.ctaHref.startsWith("http");

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container overflow-hidden py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto max-w-5xl px-2 md:px-6">
        <div className="bg-foreground/10 grid gap-px rounded-2xl p-px md:grid-cols-2">
          <div className="bg-background relative grid grid-rows-[auto_1fr] rounded-[15px] p-6 sm:p-12">
            <div role="tablist" className="flex gap-2">
              {props.items.map((item, index) => {
                const isActive = expandedIndex === index;
                const Icon = ICONS[item.iconKey];
                return (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelect(index)}
                    data-state={isActive ? "expanded" : "collapsed"}
                    className="data-[state=expanded]:bg-illustration data-[state=expanded]:ring-border not-data-[state=expanded]:hover:ring-foreground/10 ring-border group flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 shadow-sm ring shadow-transparent duration-200 active:scale-98 data-[state=expanded]:shadow-black/4"
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
                    <span
                      className={cn(
                        "group-hover:text-foreground text-sm font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {tRoot(item.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col gap-16">
              <div className="max-w-sm text-balance">
                <h3 className="text-foreground text-4xl font-medium">
                  {tRoot(active.titleKey)}
                </h3>
                <p className="text-muted-foreground my-6">{tRoot(active.bodyKey)}</p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={active.ctaHref}
                    target={ctaExternal ? "_blank" : undefined}
                    rel={ctaExternal ? "noopener noreferrer" : undefined}
                  >
                    {tRoot(active.ctaLabelKey)}{" "}
                    <span
                      aria-hidden="true"
                      className="border-l-foreground/50 ml-0.5 block size-0 border-y-4 border-l-4 border-y-transparent"
                    />
                  </a>
                </Button>
              </div>

              <div className="mt-auto max-w-sm">
                <SupportivePanel content={active.supportive} />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-background relative aspect-3/4 overflow-hidden rounded-[15px]">
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
                  <div className="dither absolute inset-0 opacity-65 dark:opacity-35">
                    <Image
                      src={active.bgImageUrl}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="size-full object-cover"
                      unoptimized
                    />
                  </div>
                  <Image
                    src={active.bgImageUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="size-full object-cover opacity-65 dark:opacity-35"
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

function SupportivePanel({ content }: Readonly<{ content: SupportiveContent }>) {
  const [, , tRoot] = useScopedT(featuresExpandable17Namespace);

  if (content.kind === "metrics") {
    return (
      <ul className="text-muted-foreground mt-auto space-y-3 pt-8 text-sm">
        {content.stats.map((stat, index) => {
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
              <span className="text-foreground font-medium">{tRoot(stat.labelKey)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  const { quoteKey, authorNameKey, authorRoleKey, authorAvatarUrl } = content.testimonial;
  return (
    <div className="relative mt-auto max-w-xl">
      <p className="text-foreground max-w-xs text-balance">
        &ldquo;{tRoot(quoteKey)}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
          <Image src={authorAvatarUrl} alt="" aria-hidden="true" width={56} height={56} />
        </div>
        <div className="space-y-0.5">
          <p className="text-foreground text-sm font-medium">{tRoot(authorNameKey)}</p>
          <span className="text-muted-foreground block text-xs">
            {tRoot(authorRoleKey)}
          </span>
        </div>
      </div>
    </div>
  );
}
