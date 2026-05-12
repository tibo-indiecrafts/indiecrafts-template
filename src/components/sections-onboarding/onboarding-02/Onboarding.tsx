"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { onboarding02Namespace, onboarding02Steps } from "./config";
import type { OnboardingBlock } from "./schema";

function getIconColor(isCompleted: boolean, isActive: boolean) {
  if (isCompleted) {
    return "text-muted-foreground/30";
  }
  if (isActive) {
    return "text-primary";
  }
  return "text-muted-foreground/40";
}

function getTitleClass(isCompleted: boolean, isActive: boolean) {
  if (isCompleted) {
    return "text-muted-foreground/50 line-through";
  }
  if (isActive) {
    return "text-foreground";
  }
  return "text-muted-foreground";
}

function StepIndicator({
  index,
  isCompleted,
  isActive,
}: {
  index: number;
  isCompleted: boolean;
  isActive: boolean;
}) {
  if (isCompleted) {
    return (
      <div className="flex size-7 items-center justify-center">
        <IconCircleCheckFilled aria-hidden="true" className="size-7 text-emerald-500" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}
    >
      {index + 1}
    </div>
  );
}

export default function Onboarding(props: Readonly<OnboardingBlock>) {
  const [t, tr] = useScopedT(onboarding02Namespace);
  const steps = props.steps ?? onboarding02Steps;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    () =>
      new Set(
        steps.map((s, i) => (s.completed ? i : -1)).filter((i): i is number => i >= 0),
      ),
  );
  const titleId = `${props.id}-title`;

  const currentStep = steps.findIndex((_, i) => !completedSteps.has(i));
  const completedCount = completedSteps.size;
  const allDone = completedCount === steps.length;

  const handleComplete = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h3 id={titleId} className="text-foreground text-lg font-semibold">
            {tr(props.titleKey, "title")}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {tr(props.descriptionKey, "description")}
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {allDone ? (
                  <span className="font-medium text-emerald-600">{t("allDone")}</span>
                ) : (
                  <>
                    <span className="text-foreground font-medium">{completedCount}</span>{" "}
                    {t("completedOf")} {steps.length} {t("completedSuffix")}
                  </>
                )}
              </span>
            </div>
            <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(completedCount / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isActive = index === currentStep;
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  isActive && "border-primary/30 bg-muted/50",
                  !isActive && "border-border bg-background",
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <StepIndicator
                      index={index}
                      isActive={isActive}
                      isCompleted={isCompleted}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "leading-6 font-medium",
                            getTitleClass(isCompleted, isActive),
                          )}
                        >
                          {t(`items.${step.id}.title`)}
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 text-sm leading-5",
                            isActive
                              ? "text-muted-foreground"
                              : "text-muted-foreground/60",
                          )}
                        >
                          {t(`items.${step.id}.description`)}
                        </p>
                        {isActive && (
                          <Button
                            type="button"
                            className="mt-3"
                            onClick={() => handleComplete(index)}
                            size="sm"
                          >
                            <StepIcon
                              aria-hidden="true"
                              className="-ml-0.5 size-4 shrink-0"
                            />
                            {t(`items.${step.id}.actionLabel`)}
                          </Button>
                        )}
                      </div>
                      <StepIcon
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          getIconColor(isCompleted, isActive),
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
