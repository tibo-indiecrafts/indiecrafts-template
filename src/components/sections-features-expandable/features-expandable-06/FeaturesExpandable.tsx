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
import { useState, type ComponentType, type ReactNode } from "react";
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
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable06Namespace } from "./config";
import type {
  FeatureIllustration,
  FeaturesExpandableBlock,
  StatIcon,
  TabIcon,
} from "./schema";

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

/**
 * Maps the active index to the grid-rows template that allocates the
 * vertical fr to the expanded item. Hardcoded for 3 slots since the
 * Tailark layout is built for exactly three.
 */
const ROW_TEMPLATES: readonly string[] = [
  "grid-rows-[1fr_auto_auto]",
  "grid-rows-[auto_1fr_auto]",
  "grid-rows-[auto_auto_1fr]",
];

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable06Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = props.items[expandedIndex];
  const ActiveIllustration = ILLUSTRATIONS[active.illustration];
  const external = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container overflow-hidden py-24"
    >
      <div aria-hidden className="h-px border-b border-dashed" />

      <div className="mx-auto my-1 max-w-5xl px-2 sm:px-(--gutter)">
        <div className="grid sm:gap-6 md:grid-cols-2">
          <div className="relative">
            <div
              aria-hidden
              className="border-foreground/10 pointer-events-none absolute -inset-x-1 -top-24 -bottom-96 border-x border-dashed mask-y-from-85%"
            />
            <div className="flex h-full flex-col gap-12 px-(--gutter) pt-6 sm:p-12 sm:pb-6">
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
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {tr(props.ctaLabelKey, "cta")}
                  </a>
                </Button>
              </div>

              <div
                role="tablist"
                aria-label={tr(props.titleKey, "title")}
                className={cn(
                  "mt-auto grid divide-y transition-all duration-300",
                  ROW_TEMPLATES[expandedIndex],
                )}
              >
                {props.items.map((item, index) => {
                  const Icon = TAB_ICONS[item.iconKey];
                  const isActive = expandedIndex === index;
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
                        aria-controls={`${props.id}-panel-${index}`}
                        onClick={() => setExpandedIndex(index)}
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
                        id={`${props.id}-panel-${index}`}
                        role="region"
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300",
                          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="text-muted-foreground pb-6 pl-6.5 text-balance">
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

          <div className="relative aspect-4/5 sm:aspect-square md:aspect-auto">
            <div
              aria-hidden
              className="border-foreground/10 pointer-events-none absolute -inset-x-1 -top-24 -bottom-96 border-x border-dashed mask-y-from-85%"
            />

            <div className="relative h-full overflow-hidden rounded-xl">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`illustration-${expandedIndex}`}
                  variants={ILLUSTRATION_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                  className="relative z-10 h-full"
                >
                  <div className="absolute inset-0 m-auto size-fit scale-85 overflow-hidden">
                    <ActiveIllustration />
                  </div>
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
        </div>
      </div>

      <div aria-hidden className="h-px border-t border-dashed" />

      <div className="mx-auto max-w-5xl px-2 py-6 sm:px-(--gutter) sm:py-12">
        <div className="grid gap-12 px-(--gutter) sm:px-12 @xl:grid-cols-2 @xl:gap-6">
          <ul className="text-muted-foreground mt-auto space-y-3 text-sm">
            {props.stats.map((stat, i) => {
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

          <div className="flex flex-col justify-end @2xl:pl-12">
            <div className="relative mt-auto max-w-xl">
              <p className="text-foreground max-w-xs text-balance">
                &ldquo;{tRoot(props.testimonial.quoteKey)}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                  <Image
                    src={props.testimonial.authorAvatarUrl}
                    alt={tRoot(props.testimonial.authorNameKey)}
                    width={56}
                    height={56}
                    loading="lazy"
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

      <div aria-hidden className="h-px border-t border-dashed" />
    </section>
  );
}
