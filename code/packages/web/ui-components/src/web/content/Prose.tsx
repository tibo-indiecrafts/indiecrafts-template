/**
 * Render a portable-text prose section.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/Prose.md
 */
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ProseModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/** Rich text as a section (narrow or wide column), or bare when `inline` (a body, a card). */
export function Prose({
  inline,
  ...props
}: ProseModule & { inline?: boolean; components: PortableTextComponents }) {
  if (!props.content) return null;
  if (inline) {
    return (
      <div
        id={props.anchor}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <PortableText value={props.content} components={props.components} />
      </div>
    );
  }
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
