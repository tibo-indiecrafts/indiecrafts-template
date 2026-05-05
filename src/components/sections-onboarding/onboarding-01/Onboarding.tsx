"use client";

import {
  IconArchive,
  IconChevronRight,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconDots,
  IconMail,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Collapsible, CollapsibleContent } from "@/components/ui-primitives/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { onboarding01Namespace, onboarding01Steps } from "./config";
import type { OnboardingBlock, OnboardingStep } from "./schema";

function CircularProgress({ completed, total }: { completed: number; total: number }) {
  const progress = total > 0 ? ((total - completed) / total) * 100 : 0;
  const strokeDashoffset = 100 - progress;

  return (
    <svg className="-rotate-90" height="14" viewBox="0 0 14 14" width="14">
      <circle
        className="stroke-muted"
        cx="7"
        cy="7"
        fill="none"
        pathLength="100"
        r="6"
        strokeWidth="2"
      />
      <circle
        className="stroke-primary"
        cx="7"
        cy="7"
        fill="none"
        pathLength="100"
        r="6"
        strokeDasharray="100"
        strokeLinecap="round"
        strokeWidth="2"
        style={{ strokeDashoffset }}
      />
    </svg>
  );
}

function StepIndicator({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <IconCircleCheckFilled
        aria-hidden="true"
        className="text-primary mt-1 size-4.5 shrink-0"
      />
    );
  }
  return (
    <IconCircleDashed
      aria-hidden="true"
      className="stroke-muted-foreground/40 mt-1 size-5 shrink-0"
      strokeWidth={2}
    />
  );
}

/**
 * Interactive setup checklist with circular progress, expanding step
 * rows, and a dismiss/feedback dropdown menu. Sourced from
 * `@blocks-so/onboarding-01`.
 */
export default function Onboarding(props: Readonly<OnboardingBlock>) {
  const [t, tr] = useScopedT(onboarding01Namespace);
  const initialSteps = props.steps ?? onboarding01Steps;
  const feedbackEmail = props.feedbackEmail ?? "support@acme.com";
  const [currentSteps, setCurrentSteps] = useState<OnboardingStep[]>(initialSteps);
  const [openStepId, setOpenStepId] = useState<string | null>(() => {
    const firstIncomplete = initialSteps.find((s) => !s.completed);
    return firstIncomplete?.id ?? initialSteps[0]?.id ?? null;
  });
  const [dismissed, setDismissed] = useState(false);
  const titleId = `${props.id}-title`;
  const completedCount = currentSteps.filter((s) => s.completed).length;
  const remainingCount = currentSteps.length - completedCount;

  const handleStepClick = (stepId: string) => {
    setOpenStepId(openStepId === stepId ? null : stepId);
  };

  const handleStepAction = (step: OnboardingStep) => {
    const updated = currentSteps.map((s) =>
      s.id === step.id ? { ...s, completed: true } : s,
    );
    setCurrentSteps(updated);
    const nextIncomplete = updated.find((s) => !s.completed);
    setOpenStepId(nextIncomplete?.id ?? null);
  };

  if (dismissed) {
    return (
      <section
        aria-labelledby={titleId}
        className="bg-background flex items-center justify-center p-4"
      >
        <h2 id={titleId} className="sr-only">
          {tr(props.titleKey, "title")}
        </h2>
        <div className="text-center">
          <p className="text-muted-foreground text-pretty">{t("dismissedMessage")}</p>
          <Button
            type="button"
            variant="link"
            className="text-primary mt-2 text-sm underline"
            onClick={() => setDismissed(false)}
          >
            {t("showAgain")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg">
        <div className="bg-card text-card-foreground w-md rounded-lg border p-4 shadow-xs">
          <div className="mr-2 mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
            <h3 id={titleId} className="text-foreground ml-2 font-semibold text-balance">
              {tr(props.titleKey, "title")}
            </h3>
            <div className="mt-2 flex items-center justify-end sm:mt-0">
              <CircularProgress completed={remainingCount} total={currentSteps.length} />
              <div className="text-muted-foreground mr-3 ml-1.5 text-sm">
                <span className="text-foreground font-medium">{completedCount}</span>
                {` ${t("completedSeparator")} `}
                <span className="text-foreground font-medium">
                  {currentSteps.length}
                </span>{" "}
                {t("completedLabel")}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-6 w-6" size="icon" variant="ghost">
                    <IconDots aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="sr-only">{t("options")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setDismissed(true)}>
                    <IconArchive aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" />
                    {t("dismiss")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const subject = encodeURIComponent(t("feedbackSubject"));
                      window.open(`mailto:${feedbackEmail}?subject=${subject}`);
                    }}
                  >
                    <IconMail aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" />
                    {t("giveFeedback")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-0">
            {currentSteps.map((step, index) => {
              const isOpen = openStepId === step.id;
              const isFirst = index === 0;
              const prevStep = currentSteps[index - 1];
              const isPrevOpen = prevStep && openStepId === prevStep.id;

              const showBorderTop = !(isFirst || isOpen || isPrevOpen);

              return (
                <div
                  className={cn(
                    "group",
                    isOpen && "rounded-lg",
                    showBorderTop && "border-border border-t",
                  )}
                  key={step.id}
                >
                  <div
                    className={cn(
                      "focus-visible:ring-ring block w-full cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                      isOpen && "rounded-lg",
                    )}
                    onClick={() => handleStepClick(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleStepClick(step.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg transition-colors",
                        isOpen && "border-border bg-muted border",
                      )}
                    >
                      <div className="relative flex items-center justify-between gap-3 py-3 pr-2 pl-4">
                        <div className="flex w-full gap-3">
                          <div className="shrink-0">
                            <StepIndicator completed={step.completed} />
                          </div>
                          <div className="mt-0.5 grow">
                            <h4
                              className={cn(
                                "font-semibold",
                                step.completed ? "text-primary" : "text-foreground",
                              )}
                            >
                              {t(`items.${step.id}.title`)}
                            </h4>
                            <Collapsible open={isOpen}>
                              <CollapsibleContent>
                                <p className="text-muted-foreground mt-2 text-sm text-pretty sm:max-w-64 md:max-w-xs">
                                  {t(`items.${step.id}.description`)}
                                </p>
                                <Button
                                  asChild
                                  className="mt-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepAction(step);
                                  }}
                                  size="sm"
                                >
                                  <a href={step.actionHref}>
                                    {t(`items.${step.id}.actionLabel`)}
                                  </a>
                                </Button>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </div>
                        {!isOpen && (
                          <IconChevronRight
                            aria-hidden="true"
                            className="text-muted-foreground h-4 w-4 shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
