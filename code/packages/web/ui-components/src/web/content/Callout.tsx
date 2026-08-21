import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { CalloutModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { ModuleCta } from "../layout/Cta";

const VARIANT_STYLES: Record<NonNullable<CalloutModule["variant"]>, string> = {
  info: "bg-muted text-foreground ring-border",
  success:
    "bg-emerald-50 text-emerald-950 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-50 dark:ring-emerald-900",
  warning:
    "bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-900",
  // `text-destructive-foreground` (white) sits on `bg-destructive/10` (a
  // near-white red tint) — invisible. Use the saturated `text-destructive`
  // on the same tint instead, both in light + dark.
  danger:
    "bg-destructive/10 text-destructive ring-destructive/30 dark:bg-destructive/15 dark:text-destructive-foreground dark:ring-destructive/40",
};

export function Callout(
  props: CalloutModule & { components: PortableTextComponents },
) {
  if (!props.content) return null;
  const variant = props.variant ?? "info";
  return (
    <aside
      id={props.anchor}
      role={variant === "danger" || variant === "warning" ? "alert" : "note"}
      className={cn(
        "mx-auto my-4 max-w-3xl rounded-lg px-5 py-3 ring-1 md:my-6",
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
  );
}
