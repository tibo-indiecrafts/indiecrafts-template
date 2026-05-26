import type { Cta as CtaProps } from "@/sanity/types";
import { cn } from "@/lib/utils";

/**
 * CTA button rendered from the module-builder `cta` object. Uses the
 * resolved `href` from the LINK_FRAGMENT — internal Sanity refs are
 * already converted to `/blog/<slug>` strings.
 */
export function ModuleCta({ cta }: { cta?: CtaProps }) {
  const href = cta?.link?.href;
  if (!href) return null;
  const label = cta.link?.label ?? "Read more";
  const variant = cta.variant ?? "primary";
  const className = cn(
    "focus-visible:ring-ring inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none",
    variant === "primary" &&
      "bg-foreground text-background hover:bg-foreground/90 shadow-sm",
    variant === "secondary" &&
      "bg-muted text-foreground hover:bg-muted/80 ring-border ring-1",
    variant === "ghost" && "text-foreground hover:bg-muted",
  );

  if (cta.link?.newTab) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
