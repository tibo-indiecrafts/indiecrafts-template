import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ProseModule } from "@indiecrafts/ui-components/shared/types";
import { cn } from "@indiecrafts/utils/cn";

export function Prose(
  props: ProseModule & { components: PortableTextComponents },
) {
  if (!props.content) return null;
  return (
    <section
      id={props.anchor}
      className={cn(
        "mx-auto px-(--gutter) py-10 md:py-16",
        props.width === "wide" ? "max-w-5xl" : "max-w-2xl",
      )}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <PortableText value={props.content} components={props.components} />
      </div>
    </section>
  );
}
