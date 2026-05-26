"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
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
import { KanbanTasksIllustration } from "@/components/ui-illustrations/kanban-tasks-illustration";
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
import { featuresExpandable21Namespace } from "./config";
import type {
  FeatureIcon,
  FeatureIllustration,
  FeaturesExpandableBlock,
  GradientKind,
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
  kanbanTasks: KanbanTasksIllustration,
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
  bot: Bot,
  globe: Globe,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  shieldCheck: ShieldCheck,
  hourglass: Hourglass,
  rocket: Rocket,
  lock: Lock,
};

const GRADIENT_TEXT: Record<GradientKind, string> = {
  amberFuchsia:
    "data-expanded:bg-gradient-to-br data-expanded:from-amber-400 data-expanded:to-fuchsia-500",
  greenSky:
    "data-expanded:bg-gradient-to-r data-expanded:from-green-600 data-expanded:to-sky-600",
  blueViolet:
    "data-expanded:bg-gradient-to-r data-expanded:from-blue-500 data-expanded:to-violet-500",
};

const GRADIENT_GLOW: Record<GradientKind, string> = {
  amberFuchsia: "bg-linear-to-r from-amber-500 to-fuchsia-500",
  greenSky: "bg-linear-to-r from-green-600 to-sky-500",
  blueViolet: "bg-linear-to-r from-blue-500 to-violet-500",
};

const ILLUSTRATION_VARIANTS = {
  initial: { opacity: 0, scale: 0.99, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.99, filter: "blur(4px)" },
};

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, , tRoot] = useScopedT(featuresExpandable21Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];
  const ctaExternal = active.ctaHref.startsWith("http");

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
      <div className="border-foreground/10 border-b border-dashed pb-8 sm:pb-12">
        <div className="mx-auto max-w-5xl px-8 sm:px-18">
          <h2
            id={`${props.id}-title`}
            className="text-foreground/50 mb-12 font-mono text-xs uppercase"
          >
            {tRoot(props.eyebrowKey)}
          </h2>
          <p className="text-foreground/60 text-4xl leading-[1.2] font-medium sm:text-5xl">
            {tRoot(props.headlineLeadKey)}{" "}
            <InlineFeatureTrigger
              isExpanded={expandedIndex === 0}
              onClick={() => handleSelect(0)}
              icon={ICONS[props.items[0].iconKey]}
              label={tRoot(props.items[0].triggerLabelKey)}
              gradient={GRADIENT_TEXT[props.items[0].gradientKind]}
              glowGradient={GRADIENT_GLOW[props.items[0].gradientKind]}
            />{" "}
            {tRoot(props.headlineMidKey)}{" "}
            <InlineFeatureTrigger
              isExpanded={expandedIndex === 1}
              onClick={() => handleSelect(1)}
              icon={ICONS[props.items[1].iconKey]}
              label={tRoot(props.items[1].triggerLabelKey)}
              gradient={GRADIENT_TEXT[props.items[1].gradientKind]}
              glowGradient={GRADIENT_GLOW[props.items[1].gradientKind]}
            />{" "}
            {tRoot(props.headlineTailKey)}
          </p>
        </div>
      </div>

      <div className="mx-auto my-1 max-w-5xl px-2 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative p-6 sm:p-12">
            <div
              aria-hidden
              className="border-foreground/10 pointer-events-none absolute -inset-x-1 -inset-y-56 border-x border-dashed mask-y-from-80%"
            />
            <div className="flex h-full flex-col gap-12">
              <div className="max-w-sm text-balance">
                <h3 className="text-foreground text-xl font-medium">
                  {tRoot(active.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-4 mb-6 text-balance">
                  {tRoot(active.bodyKey)}
                </p>
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

          <div className="relative h-fit">
            <div
              aria-hidden
              className="border-foreground/10 pointer-events-none absolute -inset-x-1 -inset-y-56 border-x border-dashed mask-y-from-80%"
            />
            <div className="relative aspect-7/8 overflow-hidden rounded-xl">
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
                    className="size-full object-cover opacity-65 dark:opacity-35"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="border-foreground/10 h-px border-t border-dashed" />
    </section>
  );
}

function InlineFeatureTrigger({
  isExpanded,
  onClick,
  icon: Icon,
  label,
  gradient,
  glowGradient,
}: Readonly<{
  isExpanded: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  gradient: string;
  glowGradient: string;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(isExpanded ? { "data-expanded": true } : {})}
      className={cn(
        "text-foreground not-data-expanded:hover:text-foreground/80 relative cursor-pointer pl-12.5 data-expanded:bg-clip-text data-expanded:text-transparent sm:pl-13.5",
        isExpanded ? gradient : "",
      )}
    >
      <span className="pointer-events-none absolute top-0.5 left-0.5 size-10 sm:top-[7px] sm:left-0 sm:size-11">
        <div
          className={cn(
            "absolute inset-x-2 top-2 bottom-0.5 rounded-xl opacity-75 blur duration-200 not-in-data-expanded:hidden starting:opacity-0",
            glowGradient,
          )}
        />
        <span className="bg-illustration ring-border absolute inset-0 z-0 flex rounded-xl shadow ring shadow-black/5 *:m-auto *:size-5">
          <Icon
            className="text-foreground drop-shadow-md drop-shadow-black/40"
            aria-hidden="true"
          />
        </span>
      </span>
      <span className="duration-200 in-data-expanded:text-transparent">{label}</span>
    </button>
  );
}

function SupportivePanel({ content }: Readonly<{ content: SupportiveContent }>) {
  const [, , tRoot] = useScopedT(featuresExpandable21Namespace);

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
