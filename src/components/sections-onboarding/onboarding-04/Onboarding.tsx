"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { onboarding04Namespace, onboarding04Steps } from "./config";
import type { OnboardingBlock } from "./schema";

/**
 * Accordion-based step list with per-item illustration, subtitle,
 * description, and primary action. Sourced from
 * `@blocks-so/onboarding-04`.
 */
export default function Onboarding(props: Readonly<OnboardingBlock>) {
  const [t, tr] = useScopedT(onboarding04Namespace);
  const steps = props.steps ?? onboarding04Steps;
  const initial = props.initialActiveStep ?? 1;
  const [activeStep, setActiveStep] = useState(initial);
  const [openItem, setOpenItem] = useState(
    activeStep < steps.length ? steps[activeStep].id : "",
  );
  const titleId = `${props.id}-title`;

  const handleComplete = () => {
    const next = activeStep + 1;
    setActiveStep(next);
    setOpenItem(next < steps.length ? steps[next].id : "");
  };

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex items-center justify-center p-4"
    >
      <div className="mx-auto w-full max-w-sm min-w-0 sm:min-w-sm">
        <h3 id={titleId} className="text-foreground text-lg font-semibold">
          {tr(props.titleKey, "title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {tr(props.descriptionKey, "description")}
        </p>
        <Accordion
          className="mt-6 space-y-2"
          collapsible
          onValueChange={setOpenItem}
          type="single"
          value={openItem}
        >
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            let status: "complete" | "current" | "upcoming" = "upcoming";
            if (index < activeStep) {
              status = "complete";
            } else if (index === activeStep) {
              status = "current";
            }

            return (
              <AccordionItem
                className="rounded-lg border !border-b shadow-xs"
                key={step.id}
                value={step.id}
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center space-x-2">
                    {status === "complete" ? (
                      <span
                        aria-hidden="true"
                        className="flex size-5 items-center justify-center"
                      >
                        <IconCircleCheckFilled
                          aria-hidden="true"
                          className="text-foreground size-6 shrink-0"
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="border-border size-5 shrink-0 rounded-full border"
                      />
                    )}
                    <p
                      className={cn(
                        "text-sm font-medium",
                        status === "upcoming"
                          ? "text-muted-foreground/60"
                          : "text-foreground",
                      )}
                    >
                      {t(`items.${step.id}.title`)}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="bg-muted ring-ring flex items-center justify-center rounded-md px-4 py-5 ring-1 ring-inset">
                    <div className="max-w-xs text-center">
                      <StepIcon
                        aria-hidden="true"
                        className="text-muted-foreground mx-auto size-7 shrink-0"
                      />
                      <p className="text-muted-foreground mt-4 text-sm font-semibold">
                        {t(`items.${step.id}.subtitle`)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {t(`items.${step.id}.description`)}
                      </p>
                      {status === "complete" ? (
                        <Button
                          type="button"
                          className="mt-6"
                          size="sm"
                          variant="outline"
                        >
                          {t(`items.${step.id}.actionLabel`)}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="mt-6"
                          disabled={status === "upcoming"}
                          onClick={() => {
                            if (status === "current") {
                              handleComplete();
                            }
                          }}
                          size="sm"
                        >
                          {t(`items.${step.id}.actionLabel`)}
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
