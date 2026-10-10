/**
 * Render a variant-styled callout aside.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/Callout.md
 */
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CalloutModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { ModuleCta } from "../layout/Cta";
import { ModuleSection } from "../layout/ModuleSection";

const VARIANT_STYLES: Record<NonNullable<CalloutModule["variant"]>, string> = {
  info: "bg-muted text-foreground ring-border",
  success:
    "bg-emerald-50 text-emerald-950 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-50 dark:ring-emerald-900",
  warning:
    "bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-900",
  // `text-destructive` on its own tint in both themes — `destructive-foreground` is the text
  // for a SOLID destructive fill, never for a tint.
  danger:
    "bg-destructive/10 text-destructive ring-destructive/30 dark:bg-destructive/15 dark:ring-destructive/40",
};

export function Callout({
  inline,
  ...props
}: CalloutModule & { inline?: boolean; components: PortableTextComponents }) {
  if (!props.content) return null;
  const variant = props.variant ?? "info";
  return (
    <ModuleSection anchor={props.anchor} inline={inline}>
      <aside
        // Static editorial content: `note`, never `alert` (an alert interrupts the reader on load).
        role="note"
        className={cn(
          "mx-auto max-w-3xl rounded-lg px-5 py-3 ring-1",
          VARIANT_STYLES[variant],
        )}
      >
        <div className="prose prose-neutral dark:prose-invert max-w-none [&_p]:my-0 [&_p]:leading-relaxed">
          <PortableText value={props.content} components={props.components} />
        </div>
        {props.cta ? (
          <div className="mt-4">
            <ModuleCta cta={props.cta} />
          </div>
        ) : null}
      </aside>
    </ModuleSection>
  );
}
