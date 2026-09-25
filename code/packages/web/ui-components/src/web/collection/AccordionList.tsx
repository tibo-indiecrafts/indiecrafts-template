/**
 * Renders an accordion-list module as native details disclosure items.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/AccordionList.md
 */
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { AccordionListModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { RichTitle } from "../RichTitle";
import { ModuleSection } from "../layout/ModuleSection";

export function AccordionList({
  inline,
  components,
  ...props
}: AccordionListModule & {
  inline?: boolean;
  components: PortableTextComponents;
}) {
  if (!props.items?.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline}>
      {props.title || props.intro ? (
        <div className="mx-auto mb-6 max-w-3xl text-center">
          {props.title ? (
            <RichTitle as="h2" className="text-3xl font-semibold lg:text-4xl">
              {props.title}
            </RichTitle>
          ) : null}
          {props.intro ? (
            <p className="text-muted-foreground mt-3">{props.intro}</p>
          ) : null}
        </div>
      ) : null}
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
