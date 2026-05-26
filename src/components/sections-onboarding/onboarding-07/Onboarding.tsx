"use client";

import { IconCircleCheckFilled, IconLoader2, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { Button } from "@/components/ui-primitives/button";
import { Progress } from "@/components/ui-primitives/progress";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { onboarding07Namespace, onboarding07Steps } from "./config";
import type { OnboardingBlock, OnboardingStep } from "./schema";

export default function Onboarding(props: Readonly<OnboardingBlock>) {
  const [t, tr] = useScopedT(onboarding07Namespace);
  const initialSteps = props.steps ?? onboarding07Steps;
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const titleId = `${props.id}-title`;
  const animatingId = initialSteps.find((s) => s.type === "in-progress")?.id;

  const allComplete = steps.every((s) => s.value === 100);

  const startAnimation = useCallback(() => {
    if (!animatingId) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setSteps((prev) => {
        const next = prev.map((step) => {
          if (step.id !== animatingId || step.value >= 100) {
            return step;
          }
          const increment = Math.random() * 0.8 + 0.3;
          const newValue = Math.min(step.value + increment, 100);
          if (newValue >= 100) {
            return { ...step, value: 100, type: "created" as const };
          }
          return { ...step, value: newValue };
        });
        const animating = next.find((s) => s.id === animatingId);
        if (animating && animating.value >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, 50);
  }, [animatingId]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAnimation]);

  const handleRunAgain = () => {
    setSteps(initialSteps);
    startAnimation();
  };

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between">
          <h3 id={titleId} className="text-foreground font-semibold">
            {tr(props.titleKey, "title")}
          </h3>
          <Button
            type="button"
            className={cn(allComplete ? "opacity-100" : "pointer-events-none opacity-0")}
            onClick={handleRunAgain}
            size="icon"
            variant="secondary"
          >
            <IconRefresh aria-hidden="true" className="size-4" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {tr(props.descriptionKey, "description")}
        </p>
        <div className="mt-6 flex items-center space-x-2">
          {steps.map((step) => (
            <div className="w-full truncate" key={step.id}>
              <Progress className="h-1.5" value={step.value} />
              <div className="mt-2 flex items-center space-x-1 truncate">
                {step.value === 100 ? (
                  <IconCircleCheckFilled
                    aria-hidden="true"
                    className="text-primary size-4 shrink-0"
                  />
                ) : (
                  <IconLoader2
                    aria-hidden="true"
                    className="text-primary size-4 shrink-0 animate-spin"
                  />
                )}
                <p className="text-muted-foreground truncate text-xs">
                  {t(`items.${step.id}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Accordion className="mt-8" collapsible defaultValue="logs" type="single">
          <AccordionItem className="rounded-sm border-b-0" value="logs">
            <AccordionTrigger className="text-foreground text-sm font-medium">
              {t("logsLabel", { count: steps.length })}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="mt-2 space-y-6 pb-2">
                {steps.map((step, idx) => (
                  <li className="relative flex gap-x-3" key={step.id}>
                    <div
                      className={cn(
                        "absolute top-0 left-0 flex w-6 justify-center",
                        idx === steps.length - 1 ? "h-6" : "-bottom-6",
                      )}
                    >
                      <span aria-hidden="true" className="bg-border w-px" />
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="bg-background relative flex size-6 flex-none items-center justify-center">
                        {step.type === "created" ? (
                          <div className="border-border bg-muted/50 ring-background size-3 rounded-full border ring-4" />
                        ) : (
                          <div className="border-border bg-background ring-background size-3 rounded-full border ring-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {t(`items.${step.id}.description`)}
                        </p>
                        <p className="text-muted-foreground text-sm leading-6">
                          {step.type === "created"
                            ? t(`items.${step.id}.createdLog`)
                            : t(`items.${step.id}.inProgressLog`)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
