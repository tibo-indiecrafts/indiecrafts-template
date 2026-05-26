import { PortableText } from "@portabletext/react";
import type { StepListModule } from "@/sanity/types";
import { portableComponents } from "./portable-text-components";

export function StepList(props: StepListModule) {
  if (!props.steps?.length) return null;
  return (
    <section id={props.anchor} className="mx-auto max-w-3xl px-(--gutter) py-12 md:py-20">
      {props.title ? (
        <header>
          <h2 className="text-3xl font-semibold md:text-4xl">{props.title}</h2>
          {props.intro ? (
            <p className="text-muted-foreground mt-3">{props.intro}</p>
          ) : null}
        </header>
      ) : null}
      <ol className="mt-10 space-y-8">
        {props.steps.map((step, i) => (
          <li key={step._key} className="flex gap-5">
            <span
              aria-hidden="true"
              className="bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            >
              {i + 1}
            </span>
            <div className="flex-1">
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
        ))}
      </ol>
    </section>
  );
}
