import { Link } from "@indiecrafts/packages-web-i18n";

/**
 * Shared page hero — centered editorial header used by every top-level
 * blog listing page (blog frontpage, authors, categories, tags). Mirrors
 * `sections-secondary-hero/secondary-hero-08` from the sibling library:
 *
 *   - Optional pill `tag` above the h1
 *   - Large balanced h1 (`text-4xl md:text-5xl lg:text-6xl`)
 *   - Optional balanced subtitle in muted color
 *   - Optional pill-style sub-nav row (pages within the blog cluster)
 *
 * Centered, max-w-3xl text, breathing-room padding. No card chrome —
 * the visual rhythm comes from the type scale and the pill row.
 */
export type PageHeroPill = {
  label: string;
  href: string;
  active?: boolean;
};

export function PageHero({
  tag,
  title,
  subtitle,
  titleId,
  pills,
  pillsLabel,
}: {
  tag?: string;
  title: string;
  subtitle?: string;
  titleId?: string;
  pills?: PageHeroPill[];
  /** Accessible label for the pill sub-nav. Pass a translated string;
   *  falls back to the (already-translated) `title` so it's never hardcoded. */
  pillsLabel?: string;
}) {
  return (
    <header className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        {tag ? (
          <span className="text-primary bg-primary/5 border-primary/10 inline-flex rounded-full border px-3 py-1 text-sm font-medium">
            {tag}
          </span>
        ) : null}
        <h1
          id={titleId}
          className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg text-balance">
            {subtitle}
          </p>
        ) : null}
        {pills && pills.length > 0 ? (
          <nav aria-label={pillsLabel ?? title} className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2">
              {pills.map((pill) => (
                <li key={pill.href}>
                  <Link
                    href={pill.href}
                    aria-current={pill.active ? "page" : undefined}
                    className={
                      pill.active
                        ? "bg-foreground text-background inline-flex rounded-full border border-transparent px-4 py-1.5 text-sm font-medium"
                        : "border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-ring inline-flex rounded-full border bg-transparent px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    }
                  >
                    {pill.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
