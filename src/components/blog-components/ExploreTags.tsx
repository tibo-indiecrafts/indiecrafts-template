import { Link } from "@/i18n/routing";
import type { Tag } from "@/sanity/types";

/**
 * Tag cloud for the /blog frontpage. Same shape as ExploreCategories but
 * uses pill-shaped chips with a `#` prefix to make the visual difference
 * obvious. Each chip is a link to `/blog/tag/<slug>`. The trailing CTA
 * links to the full tag index.
 */
export function ExploreTags({
  tags,
  heading,
  subheading,
  viewAllLabel,
}: {
  tags: Tag[];
  heading: string;
  subheading: string;
  viewAllLabel: string;
}) {
  if (tags.length === 0) return null;
  const sorted = [...tags].sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0));

  return (
    <section aria-labelledby="explore-tags-title" className="py-14 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-9 px-(--gutter) md:gap-14">
        <header className="flex flex-col items-center gap-3.5 text-center">
          <h2 id="explore-tags-title" className="text-3xl font-semibold md:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground max-w-lg">{subheading}</p>
        </header>

        <ul className="flex flex-wrap justify-center gap-2">
          {sorted.slice(0, 24).map((tag) =>
            tag.slug ? (
              <li key={tag._id}>
                <Link
                  href={`/blog/tag/${tag.slug}`}
                  className="group bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="capitalize">#{tag.title}</span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground/70 group-hover:text-background/70 text-xs"
                  >
                    {tag.postCount ?? 0}
                  </span>
                </Link>
              </li>
            ) : null,
          )}
        </ul>

        {sorted.length > 24 ? (
          <Link
            href="/blog/tag"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md border px-6 py-3 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
