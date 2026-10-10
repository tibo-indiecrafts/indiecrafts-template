/**
 * Frame one sidebar block as a card.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/SidebarCard.md
 */
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/**
 * Generic blocks that already draw their own card (a ring, a border or a tinted panel). Not
 * the card and stat lists: their hairline grid shows no edge with one item.
 */
const SELF_FRAMED = new Set([
  "module.callout",
  "module.newsletter",
  "module.waitlist",
  "module.lead-magnet",
  "module.contact",
]);

/**
 * One block in a sidebar: a card frame (the `bg-card` + hairline ring of the site's cards)
 * around the block, unless the block `type` draws its own. A container, so the block sizes
 * to the card, not the screen. The block's own outer margin is dropped: the sidebar grid
 * spaces the cards (`!`: a block's responsive margin, e.g. `md:my-12`, would win otherwise). A block that renders nothing leaves no empty card (`empty:hidden`).
 */
export function SidebarCard({
  type,
  className,
  children,
}: {
  /** The block's `_type`. */
  type: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "@container min-w-0 empty:hidden *:my-0!",
        !SELF_FRAMED.has(type) &&
          "bg-card ring-border/60 rounded-xl p-5 ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </div>
  );
}
