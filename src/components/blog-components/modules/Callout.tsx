import { PortableText } from "@portabletext/react";
import type { CalloutModule } from "@/sanity/types";
import { cn } from "@/lib/utils";
import { ModuleCta } from "./Cta";
import { portableComponents } from "./portable-text-components";

const VARIANT_STYLES: Record<NonNullable<CalloutModule["variant"]>, string> = {
  info: "bg-muted text-foreground ring-border",
  success:
    "bg-emerald-50 text-emerald-950 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-50 dark:ring-emerald-900",
  warning:
    "bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-900",
  danger: "bg-destructive/10 text-destructive-foreground ring-destructive/30",
};

export function Callout(props: CalloutModule) {
  if (!props.content) return null;
  const variant = props.variant ?? "info";
  return (
    <aside
      id={props.anchor}
      role={variant === "danger" || variant === "warning" ? "alert" : "note"}
      className={cn(
        "mx-auto my-8 max-w-3xl rounded-lg p-5 ring-1",
        VARIANT_STYLES[variant],
      )}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <PortableText value={props.content} components={portableComponents} />
      </div>
      {props.cta ? (
        <div className="mt-4">
          <ModuleCta cta={props.cta} />
        </div>
      ) : null}
    </aside>
  );
}
