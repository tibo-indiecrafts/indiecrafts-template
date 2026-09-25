/**
 * Renders the frontpage tag explorer — hash-prefixed tag chips.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/blog/sections/ExploreTags.md
 */
import { Link } from "@indiecrafts/packages-web-i18n";
import type { Tag } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Tag explorer for the /blog frontpage. Chip styling mirrors
 * ExploreCategories so the two sections feel like siblings; the only
 * visual cue distinguishing tags is the `#` prefix.
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
  const sorted = [...tags].sort(
    (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0),
  );

  return (
    <section aria-labelledby="explore-tags-title" className="py-14 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-9 px-(--gutter) md:gap-14">
        <header className="flex flex-col items-center gap-3.5 text-center">
          <h2
            id="explore-tags-title"
            className="text-3xl font-semibold md:text-4xl"
          >
            {heading}
          </h2>
          <p className="text-muted-foreground max-w-lg">{subheading}</p>
        </header>

        <ul className="flex flex-wrap justify-center gap-3">
          {sorted.slice(0, 24).map((tag) =>
            tag.slug ? (
              <li key={tag._id}>
                <Link
                  href={`/blog/tag/${tag.slug}`}
                  className="border-border hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md border bg-transparent px-4 py-2 text-base font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  #{tag.title}
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
