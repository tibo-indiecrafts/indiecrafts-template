import { PortableText } from "@portabletext/react";
import type { StepListModule } from "@/sanity/types";
import { portableComponents } from "./portable-text-components";
import { ModuleSection } from "./ModuleSection";

/**
 * Step list — vertical timeline. Each step's number sits in a circle;
 * a hairline separator runs between consecutive circles to make the
 * sequence read as a flow rather than a stack of cards.
 */
export function StepList({ inline, ...props }: StepListModule & { inline?: boolean }) {
  if (!props.steps?.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline}>
      <ol className="relative mx-auto max-w-3xl">
        {props.steps.map((step, i) => {
          const isLast = i === props.steps!.length - 1;
          return (
            <li key={step._key} className="relative flex gap-5 pb-10 last:pb-0">
              {/* Light vertical connector between numbered circles. */}
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="bg-border/60 absolute top-9 bottom-0 left-[1.125rem] w-px"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="bg-foreground text-background ring-background relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4"
              >
                {i + 1}
              </span>
              <div className="flex-1 pt-1">
                {step.title ? (
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                ) : null}
                {step.content ? (
                  <div className="prose prose-neutral dark:prose-invert prose-sm mt-2 max-w-none">
                    <PortableText value={step.content} components={portableComponents} />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </ModuleSection>
  );
}
