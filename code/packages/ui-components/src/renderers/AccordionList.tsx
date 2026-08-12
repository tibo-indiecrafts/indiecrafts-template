import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { AccordionListModule } from "@indiecrafts/ui-components/types";
import { ModuleSection } from "./ModuleSection";

export function AccordionList({
  inline,
  components,
  ...props
}: AccordionListModule & { inline?: boolean; components: PortableTextComponents }) {
  if (!props.items?.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline}>
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
                  <PortableText value={item.content} components={components} />
                </div>
              ) : null}
            </details>
          </li>
        ))}
      </ul>
    </ModuleSection>
  );
}
