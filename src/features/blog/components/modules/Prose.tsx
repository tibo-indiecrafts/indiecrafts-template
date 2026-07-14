import { PortableText } from "@portabletext/react";
import type { ProseModule } from "@/features/blog/sanity/types";
import { cn } from "@/lib/utils";
import { portableComponents } from "./portable-text-components";

export function Prose(props: ProseModule) {
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
        <PortableText value={props.content} components={portableComponents} />
      </div>
    </section>
  );
}
