"use client";
import {
  Bot,
  Brain,
  Cpu,
  Globe,
  Hourglass,
  Lock,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { AgentFeedbackIllustration } from "@/components/ui-illustrations/agent-feedback-illustration";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/agent-task-planning-illustration";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { CalendarIllustration } from "@/components/ui-illustrations/calendar-illustration";
import { EmailIllustration } from "@/components/ui-illustrations/email-illustration";
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
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable07Namespace } from "./config";
import type {
  FeatureIllustration,
  FeaturesExpandableBlock,
  FeaturesExpandableItem,
  StatIcon,
  StatItem,
  SupportiveContent,
  TabIcon,
} from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
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

const TAB_ICONS: Record<TabIcon, LucideIcon> = {
  brain: Brain,
  globe: Globe,
  bot: Bot,
  sparkles: Sparkles,
  zap: Zap,
  cpu: Cpu,
  shield: Shield,
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

const RICH_STAT = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable07Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const btn = buttonsRef.current[expandedIndex];
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [expandedIndex]);

  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];
  const external = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <h2 id={`${props.id}-title`} className="sr-only">
        {tRoot(active.tabLabelKey)}
      </h2>

      <div className="border-foreground/10 border-y border-dashed">
        <div className="mx-auto max-w-5xl px-(--gutter) sm:px-14">
          <div role="tablist" className="relative flex">
            <motion.div
              aria-hidden
              className="before:bg-foreground absolute -bottom-px h-px before:absolute before:inset-x-4 before:inset-y-0 before:rounded-full"
              initial={false}
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {props.items.map((item, index) => {
              const Icon = TAB_ICONS[item.iconKey];
              const isActive = expandedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  ref={(el) => {
                    buttonsRef.current[index] = el;
                  }}
                  onClick={() => setExpandedIndex(index)}
                  data-state={isActive ? "expanded" : "collapsed"}
                  className="group cursor-pointer px-4 duration-200 active:scale-98"
                >
                  <div className="flex items-center justify-center gap-3 py-4 duration-200">
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
                      {tRoot(item.tabLabelKey)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto my-1 max-w-5xl px-2 sm:px-(--gutter)">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative p-6 sm:p-12">
            <div
              aria-hidden
              className="border-foreground/10 pointer-events-none absolute -inset-x-1 -inset-y-56 border-x border-dashed mask-y-from-80%"
            />
            <div className="flex h-full flex-col gap-12">
              <div className="max-w-sm text-balance">
                <h3 className="text-foreground text-4xl font-medium">
                  {tRoot(active.titleKey)}
                </h3>
                <p className="text-muted-foreground my-6">{tRoot(active.bodyKey)}</p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={props.ctaHref}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {tr(props.ctaLabelKey, "cta")}{" "}
                    <span
                      aria-hidden
                      className="border-l-foreground/50 ml-0.5 block size-0 border-y-4 border-l-4 border-y-transparent"
                    />
                  </a>
                </Button>
              </div>

              <div className="mt-auto max-w-sm">
                <SupportiveSlot
                  supportive={active.supportive}
                  tRoot={tRoot}
                  STAT_ICONS={STAT_ICONS}
                />
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

      <div aria-hidden className="border-foreground/10 h-px border-t border-dashed" />
    </section>
  );
}

type SupportiveSlotProps = Readonly<{
  supportive: SupportiveContent;
  tRoot: ReturnType<typeof useScopedT>[2];
  STAT_ICONS: Record<StatIcon, LucideIcon>;
}>;

function SupportiveSlot({ supportive, tRoot, STAT_ICONS }: SupportiveSlotProps) {
  if (supportive.kind === "metrics") {
    return (
      <ul className="text-muted-foreground mt-auto space-y-3 pt-8 text-sm">
        {supportive.stats.map((stat: StatItem, i) => {
          const StatIconCmp = STAT_ICONS[stat.iconKey];
          const tone =
            stat.iconKey === "hourglass"
              ? "text-muted-foreground dark:text-blue-500/25"
              : "*:nth-2:text-emerald-600 dark:text-emerald-500/25";
          return (
            <li key={i} className="flex items-center gap-3">
              <StatIconCmp className={`size-4 ${tone}`} aria-hidden="true" />
              <span>{tRoot.rich(stat.labelKey, RICH_STAT)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="relative mt-auto max-w-xl">
      <p className="text-foreground max-w-xs text-balance">
        &ldquo;{tRoot(supportive.quoteKey)}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2">
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
      </div>
    </div>
  );
}

// Re-export FeaturesExpandableItem so consumers can build typed item arrays.
export type { FeaturesExpandableItem };
