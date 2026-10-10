/**
 * Render a sidebar list of related-topic links.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/MoreOnTopic.md
 */

/** One link in a "More on this topic" list — a resolved title + href (+ optional meta). */
export type MoreOnTopicItem = {
  /** Stable key for the list. */
  _key?: string;
  title: string;
  href: string;
  /** Optional secondary line (e.g. a date or read time). */
  meta?: string;
};

/**
 * "More on this topic" — a compact list for a sidebar card (`SidebarCard` draws the frame):
 * a heading over a list of related links. Data-driven (resolved `title`/`href` items, plain
 * `<a>` like the other renderers), so the host owns the content and this owns
 * the layout. Renders nothing when there are no items.
 *
 * `title` — the heading (e.g. "More on Engineering"). `items` — the links.
 * `footer` — an optional "see all" link under the list.
 */
export function MoreOnTopic({
  title,
  items,
  footer,
  className,
}: {
  title: string;
  items: MoreOnTopicItem[];
  footer?: { label: string; href: string };
  className?: string;
}) {
  if (!items?.length) return null;
  return (
    <section aria-label={title} className={className}>
      <h2 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {title}
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item._key ?? item.href ?? i}>
            <a
              href={item.href}
              className="focus-visible:ring-ring group block rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-foreground group-hover:text-brand text-sm leading-snug font-medium transition-colors">
                {item.title}
              </span>
              {item.meta ? (
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {item.meta}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
      {footer ? (
        <a
          href={footer.href}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mt-4 inline-block rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {footer.label} →
        </a>
      ) : null}
    </section>
  );
}
