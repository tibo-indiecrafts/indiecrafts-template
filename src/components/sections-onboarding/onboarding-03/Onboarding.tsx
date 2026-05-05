"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Progress } from "@/components/ui-primitives/progress";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { onboarding03Namespace, onboarding03Steps } from "./config";
import type { OnboardingBlock } from "./schema";

/**
 * Numbered click-through setup list with progress meter and a "Need
 * help?" support block. Sourced from `@blocks-so/onboarding-03`.
 */
export default function Onboarding(props: Readonly<OnboardingBlock>) {
  const [t, tr] = useScopedT(onboarding03Namespace);
  const steps = props.steps ?? onboarding03Steps;
  const helpEmail = props.helpEmail ?? "help@example.com";
  const [activeStep, setActiveStep] = useState(0);
  const titleId = `${props.id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex items-center justify-center p-4"
    >
      <div className="sm:mx-auto sm:max-w-lg">
        <h3 id={titleId} className="text-foreground text-lg font-semibold">
          {tr(props.titleKey, "title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {tr(props.descriptionKey, "description")}
        </p>
        <div className="mt-4 flex items-center justify-end space-x-4">
          <span className="text-muted-foreground text-sm">
            {t("stepCounter", {
              current: activeStep + 1,
              total: steps.length,
            })}
          </span>
          <Progress className="w-32" value={(activeStep / steps.length) * 100} />
        </div>
        <ul className="mt-4 space-y-4">
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                className={cn(
                  "bg-card focus-visible:ring-ring relative w-full cursor-pointer rounded-lg border p-4 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  index === activeStep ? "border-foreground/20" : "border-border",
                )}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start space-x-3">
                  {index < activeStep ? (
                    <IconCircleCheckFilled
                      aria-hidden="true"
                      className="text-foreground size-6 shrink-0"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground flex size-6 items-center justify-center font-medium"
                    >
                      {step.label}
                    </span>
                  )}
                  <div>
                    <h4
                      className={cn(
                        "font-medium",
                        index < activeStep
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}
                    >
                      {t(`items.${step.id}.title`)}
                    </h4>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                      {t(`items.${step.id}.description`)}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <div className="bg-muted mt-6 rounded-lg p-4">
          <h4 className="text-foreground text-sm font-medium">{t("needHelp")}</h4>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("helpPrompt")}{" "}
            <a className="text-primary font-medium" href={`mailto:${helpEmail}`}>
              {helpEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
