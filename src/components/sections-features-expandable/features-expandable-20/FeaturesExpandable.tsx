"use client";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Bot, Brain, Globe, LassoSelect, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui-primitives/card";
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
import type { MessageKey } from "@/types/messages";
import { cn } from "@/lib/utils";
import { featuresExpandable20Namespace } from "./config";
import type {
  FeatureIcon,
  FeatureIllustration,
  FeaturesExpandableBlock,
  FeaturesExpandableItem,
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
  lassoSelect: LassoSelect,
  brain: Brain,
  globe: Globe,
  bot: Bot,
};

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable20Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      className="bg-background @container py-24 max-lg:px-1"
    >
      <div className="mx-auto max-w-5xl max-lg:px-(--gutter)">
        <div className="mb-12 grid items-end gap-6 sm:mb-20 md:grid-cols-2 lg:gap-12">
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

        <div
          className={cn(
            "bg-foreground/10 grid gap-px rounded-2xl p-px transition-[grid-template-columns] duration-300 ease-in-out",
            expandedIndex === 0 ? "md:grid-cols-[2fr_1fr]" : "md:grid-cols-[1fr_2fr]",
          )}
        >
          {props.items.map((item, index) => (
            <ExpandableCard
              key={index}
              item={item}
              index={index}
              isActive={expandedIndex === index}
              onSelect={() => handleSelect(index)}
              tRoot={tRoot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpandableCard({
  item,
  index,
  isActive,
  onSelect,
  tRoot,
}: Readonly<{
  item: FeaturesExpandableItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  tRoot: (key: MessageKey) => string;
}>) {
  const Illustration = ILLUSTRATIONS[item.illustration];
  const Icon = ICONS[item.iconKey];
  const isLast = index === 1;

  return (
    <Card
      data-expanded={isActive}
      className={cn(
        "bg-background relative overflow-hidden rounded-none text-left shadow-md shadow-black/4 ring-transparent",
        isLast
          ? "max-md:rounded-b-[15px] md:rounded-r-[15px]"
          : "max-md:rounded-t-[15px] md:rounded-l-[15px]",
      )}
    >
      <div className="grid h-full gap-3 *:h-full sm:w-162 sm:grid-cols-2 md:w-158 lg:w-162">
        <div className="flex h-full flex-col justify-between gap-12 py-8 pl-8">
          <Icon className="size-4" aria-hidden="true" />
          <div>
            <button
              type="button"
              className="absolute inset-0 cursor-pointer"
              aria-label={`Expand ${item.ariaSlug.replace(/-/g, " ")} feature`}
              onClick={onSelect}
              aria-expanded={isActive}
            />
            <h3 className="text-foreground font-medium">{tRoot(item.titleKey)}</h3>
            <p className="text-muted-foreground mt-4 text-balance">
              {tRoot(item.bodyKey)}
            </p>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className={cn(
              isLast ? "*:origin-left *:scale-90 sm:py-6" : "*:scale-95 sm:py-12",
            )}
          >
            <Illustration />
          </div>
        </div>
      </div>
    </Card>
  );
}
