"use client";
import { Hourglass, Lock, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import { featuresExpandable11Namespace } from "./config";
import type {
  FeatureIllustration,
  FeaturesExpandableBlock,
  IdeIcon,
  StatIcon,
  SupportiveContent,
} from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
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

const ROW_TEMPLATES: readonly string[] = [
  "grid-rows-[1fr_auto_auto]",
  "grid-rows-[auto_1fr_auto]",
  "grid-rows-[auto_auto_1fr]",
];

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable11Namespace);
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
    <section aria-labelledby={`${props.id}-title`} className="bg-background @container">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-end gap-4 border-x border-dashed px-6 pt-24 pb-6 md:grid-cols-2">
          <h2 id={`${props.id}-title`} className="text-foreground text-4xl font-semibold">
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            {tr(props.bodyKey, "body")}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed">
        <div className="mx-auto grid h-6 max-w-5xl grid-cols-2 border-x border-dashed" />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div
          aria-hidden
          className="border-r-card border-y border-r border-dashed max-lg:hidden"
        />
        <div className="border-b-card mx-auto max-w-5xl border lg:min-w-5xl">
          <div className="border-t-card border-y">
            <div className="not-dark:bg-foreground/2 relative grid sm:grid-cols-5 lg:grid-cols-3">
              <div
                aria-hidden
                className="absolute inset-0 z-0 mask-l-from-50% dark:opacity-75"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div
                role="tablist"
                className={cn(
                  "grid gap-3 py-6 pl-6 transition-all duration-300 max-sm:pr-6 sm:col-span-2 lg:col-span-1",
                  ROW_TEMPLATES[expandedIndex],
                )}
              >
                {props.items.map((item, index) => {
                  const isActive = expandedIndex === index;
                  return (
                    <div
                      key={index}
                      data-expanded={isActive}
                      className="data-[expanded=true]:bg-card ring-border group relative grid grid-rows-[auto_1fr] rounded-xl shadow-lg ring-1 shadow-transparent data-[expanded=true]:z-1 data-[expanded=true]:shadow-black/4"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`${props.id}-panel-${index}`}
                        onClick={() => handleSelect(index)}
                        className="group flex w-full cursor-pointer items-center gap-3 px-6 py-4 text-left"
                      >
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
                        id={`${props.id}-panel-${index}`}
                        role="region"
                        className={cn(
                          "grid px-6 transition-[grid-template-rows] duration-300",
                          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="flex h-full flex-col pb-6">
                            <p className="text-muted-foreground max-w-sm text-balance">
                              {tRoot(item.bodyKey)}
                            </p>
                            <div className="mt-auto delay-250 duration-400 in-data-[expanded=true]:opacity-100 starting:opacity-0 starting:blur-xs">
                              <SupportiveSlot
                                supportive={item.supportive}
                                tRoot={tRoot}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative flex h-120 items-center justify-center overflow-hidden p-12 max-sm:row-start-1 sm:col-span-3 sm:h-144 lg:col-span-2">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={expandedIndex}
                    className="scale-90"
                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.85, y: 6 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 0.9, y: 0 }}
                    exit={{ opacity: 0, filter: "blur(4px)", scale: 0.85, y: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActiveIllustration />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="border-l-card border-y border-l border-dashed max-lg:hidden"
        />
      </div>

      <div className="mx-auto w-full max-w-5xl border-x border-dashed pb-24" />
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
      <div className="mt-auto space-y-3 pt-8">
        <h4 className="text-sm font-medium">{tRoot(supportive.labelKey)}</h4>
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
      <ul className="text-muted-foreground mt-auto space-y-3 pt-8 text-sm">
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
    <div className="before:bg-border relative mt-auto max-w-xl pt-8 before:absolute before:inset-y-0 before:-left-4 before:w-0.5 before:rounded-full">
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
