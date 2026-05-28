import { PortableText } from "@portabletext/react";
import type { AccordionListModule } from "@/sanity/types";
import { portableComponents } from "./portable-text-components";

export function AccordionList(props: AccordionListModule) {
  if (!props.items?.length) return null;
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-8 md:py-12">
      <ul className="divide-border mx-auto max-w-3xl divide-y rounded-xl border">
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
