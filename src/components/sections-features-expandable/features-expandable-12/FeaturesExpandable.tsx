"use client";
import { Hourglass, Lock, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import { AgentFeedbackIllustration } from "@/components/ui-illustrations/agent-feedback-illustration";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/agent-task-planning-illustration";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { AiSearchIllustration } from "@/components/ui-illustrations/ai-search-illustration";
import { CalendarIllustration } from "@/components/ui-illustrations/calendar-illustration";
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
import { Antigravity } from "@/components/ui-primitives/svgs/antigravity";
import { Cursor } from "@/components/ui-primitives/svgs/cursor";
import { Windsurf } from "@/components/ui-primitives/svgs/windsurf";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable12Namespace } from "./config";
import type {
  FeatureIllustration,
  FeaturesExpandableBlock,
  IdeIcon,
  StatIcon,
  SupportiveContent,
} from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  collaborationComment: CollaborationCommentIllustration,
  flowCards: FlowCardsIllustration,
  kanban: KanbanIllustration,
  aiSearch: AiSearchIllustration,
  agentFeedback: AgentFeedbackIllustration,
  email: EmailIllustration,
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

const IDE_ICONS: Record<IdeIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  antigravity: Antigravity,
  cursor: Cursor,
  windsurf: Windsurf,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  shieldCheck: ShieldCheck,
  hourglass: Hourglass,
  rocket: Rocket,
  lock: Lock,
};

const RICH_STAT = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable12Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setExpandedIndex((current) => (current + 1) % props.items.length);
      setProgressKey((k) => k + 1);
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
    setProgressKey((k) => k + 1);
    resetTimer();
  };

  const setPausedState = (next: boolean) => {
    pausedRef.current = next;
    setPaused(next);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="border-b pb-8 *:max-w-lg lg:pb-12">
          <h2
            id={`${props.id}-title`}
            className="text-foreground text-3xl font-semibold lg:text-4xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-balance">
            {tr(props.bodyKey, "body")}
          </p>
        </div>

        <div role="tablist" className="border-card border-t">
          {props.items.map((item, index) => {
            const isActive = expandedIndex === index;
            const Illustration = ILLUSTRATIONS[item.illustration];
            const number = String(index + 1).padStart(2, "0");
            return (
              <div key={index} data-expanded={isActive} className="group relative">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${props.id}-panel-${index}`}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => isActive && setPausedState(true)}
                  onMouseLeave={() => isActive && setPausedState(false)}
                  onFocus={() => isActive && setPausedState(true)}
                  onBlur={() => isActive && setPausedState(false)}
                  className="group flex w-full cursor-pointer items-center gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "font-mono text-sm transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {number}
                  </span>
                  <h3
                    className={cn(
                      "group-hover:text-foreground text-lg font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {tRoot(item.titleKey)}
                  </h3>
                  <div className="ml-auto">
                    <div
                      className={cn(
                        "size-1.5 rounded-full transition-colors",
                        isActive ? "bg-primary" : "bg-border",
                      )}
                    />
                  </div>
                </button>

                <div
                  id={`${props.id}-panel-${index}`}
                  role="region"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500",
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 pl-10 lg:grid-cols-2">
                      <div className="flex flex-col">
                        <p className="text-muted-foreground max-w-sm text-balance">
                          {tRoot(item.bodyKey)}
                        </p>
                        <SupportiveSlot supportive={item.supportive} tRoot={tRoot} />
                      </div>
                      <div className="origin-top-left scale-95">
                        <Illustration />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 -bottom-px h-px [background-image:linear-gradient(90deg,--alpha(var(--color-foreground)/20%)_1px,transparent_1px)] bg-[length:4px_1px] bg-repeat-x">
                  {isActive ? (
                    <div
                      key={progressKey}
                      className="absolute inset-0 h-full origin-left rounded-full [background-image:linear-gradient(90deg,var(--color-primary)_1px,transparent_1px)] bg-[length:4px_1px] bg-repeat-x"
                      style={{
                        animation: `features-expandable-12-progress ${autoplayMs}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type SupportiveSlotProps = Readonly<{
  supportive: SupportiveContent;
  tRoot: ReturnType<typeof useScopedT>[2];
}>;

function SupportiveSlot({ supportive, tRoot }: SupportiveSlotProps) {
  if (supportive.kind === "ideSupport") {
    return (
      <div className="mt-auto space-y-3 pt-6">
        <h4 className="font-medium">{tRoot(supportive.labelKey)}</h4>
        <div className="*:bg-foreground/5 grid max-w-56 grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
          {supportive.ides.map((ide, i) => {
            const Icon = IDE_ICONS[ide];
            const radius =
              i === 0
                ? "!rounded-l-lg"
                : i === supportive.ides.length - 1
                  ? "!rounded-r-lg"
                  : "";
            const tone =
              ide === "cursor"
                ? "fill-foreground size-4.5"
                : ide === "windsurf"
                  ? "*:fill-foreground! size-6"
                  : "size-5";
            return (
              <div key={ide} className={radius}>
                <Icon className={tone} aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (supportive.kind === "metrics") {
    return (
      <ul className="text-muted-foreground mt-auto space-y-3 pt-6 text-sm">
        {supportive.stats.map((stat, i) => {
          const StatIconCmp = STAT_ICONS[stat.iconKey];
          const tone =
            stat.iconKey === "hourglass"
              ? ""
              : "*:nth-2:text-emerald-600 dark:text-emerald-500/25";
          return (
            <li key={i} className="flex items-center gap-2">
              <StatIconCmp className={`size-4 ${tone}`} aria-hidden />
              <span>{tRoot.rich(stat.labelKey, RICH_STAT)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="before:bg-border relative mt-auto max-w-xl pt-6 before:absolute before:inset-y-0 before:-left-4 before:w-0.5 before:rounded-full">
      <p className="text-foreground max-w-xs text-balance">
        &ldquo;{tRoot(supportive.quoteKey)}&rdquo;
      </p>
      <footer className="mt-4 flex items-center gap-2">
        <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
          <Image
            src={supportive.authorAvatarUrl}
            alt={tRoot(supportive.authorNameKey)}
            width={56}
            height={56}
            loading="lazy"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-foreground text-sm font-medium">
            {tRoot(supportive.authorNameKey)}
          </p>
          <span className="text-muted-foreground block text-xs">
            {tRoot(supportive.authorRoleKey)}
          </span>
        </div>
      </footer>
    </div>
  );
}
