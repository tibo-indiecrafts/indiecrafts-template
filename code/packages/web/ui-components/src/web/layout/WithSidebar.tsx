/**
 * Lay out a page's main content beside a sidebar of cards.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/WithSidebar.md
 */
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/**
 * Main content, then a labelled `<aside>` of cards. With no `aside`, the children render
 * unchanged — a page without a sidebar keeps its full-width layout.
 *
 * - From `lg`: two columns (content · 18rem); the cards stick below the header and scroll
 *   on their own when taller than the screen. The scroll box has a 4px inset (offset by a
 *   negative margin) so the cards' outer rings and focus rings are not clipped.
 * - Below `lg`: the cards follow the content (two per row from `sm`). DOM order is reading
 *   order, so a screen reader and a phone both meet the content first.
 * - `contained` (default) adds the page container (max width + gutters) and zeroes the
 *   inner sections' own gutter. Pass `false` when the host already sits in a container.
 */
export function WithSidebar({
  aside,
  label,
  contained = true,
  className,
  children,
}: {
  aside?: React.ReactNode;
  /** The sidebar's accessible name (a visually hidden heading). */
  label: string;
  contained?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!aside) return <>{children}</>;
  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10 xl:gap-12",
        contained && "mx-auto max-w-(--max-container) px-(--gutter)",
        className,
      )}
    >
      <div className={cn("min-w-0", contained && "[--gutter:0px]")}>
        {children}
      </div>
      <aside aria-labelledby="page-sidebar-title" className="mt-12 lg:mt-0">
        <h2 id="page-sidebar-title" className="sr-only">
          {label}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:grid-cols-1 lg:overflow-y-auto lg:-m-1 lg:p-1">
          {aside}
        </div>
      </aside>
    </div>
  );
}
