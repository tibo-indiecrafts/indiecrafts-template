/**
 * Wraps a module as a full-width section or an inline body embed.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/ModuleSection.md
 */
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/**
 * Shared chrome for modules that double as full-width `postModules` slots
 * AND inline body embeds.
 *
 * As a slot it's a centered `max-w-6xl` section with page gutters + vertical
 * rhythm. Inline — rendered inside the article's `.prose` column, which
 * already owns width and horizontal padding — it drops all of that (the
 * gutter would otherwise double-pad and squeeze the module on mobile) and
 * just adds `not-prose` + modest vertical spacing so the typography plugin
 * doesn't restyle the module's own markup.
 *
 * `w-full` in both modes: blocks put `@container` here, and a size container in a
 * shrink-to-fit parent (a flex column, a centered landing) would collapse to zero width.
 */
export function ModuleSection({
  anchor,
  inline,
  className,
  children,
}: {
  anchor?: string;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (inline) {
    return (
      <div id={anchor} className={cn("not-prose my-8 w-full", className)}>
        {children}
      </div>
    );
  }
  return (
    <section
      id={anchor}
      className={cn(
        "mx-auto w-full max-w-6xl px-(--gutter) py-8 md:py-12",
        className,
      )}
    >
      {children}
    </section>
  );
}
