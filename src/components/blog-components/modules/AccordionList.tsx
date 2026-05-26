import { PortableText } from "@portabletext/react";
import type { AccordionListModule } from "@/sanity/types";
import { portableComponents } from "./portable-text-components";

export function AccordionList(props: AccordionListModule) {
  if (!props.items?.length) return null;
  return (
    <section
      id={props.anchor}
      aria-labelledby={props.title ? `${props.anchor ?? "acc"}-title` : undefined}
      className="mx-auto max-w-3xl px-(--gutter) py-12 md:py-16"
    >
      {props.title ? (
        <h2
          id={`${props.anchor ?? "acc"}-title`}
          className="text-2xl font-semibold md:text-3xl"
        >
          {props.title}
        </h2>
      ) : null}
      {props.intro ? <p className="text-muted-foreground mt-2">{props.intro}</p> : null}
      <ul className="divide-border mt-6 divide-y rounded-xl border">
        {props.items.map((item) => (
          <li key={item._key} className="px-5">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className="text-muted-foreground transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              {item.content ? (
                <div className="prose prose-neutral dark:prose-invert mt-3 max-w-none">
                  <PortableText value={item.content} components={portableComponents} />
                </div>
              ) : null}
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
