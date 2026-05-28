import type { Tag } from "@/sanity/types";
import { TagCard } from "./TagCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Tag index page — `/blog/tag`. Sorted by post count desc so the most
 * active tags lead. Empty (zero-post) tags are filtered out by the
 * GROQ query that feeds this list.
 */
export function TagListing({
  tags,
  breadcrumbs,
  breadcrumbsLabel,
  heading,
  subheading,
  emptyLabel,
  postsLabel,
}: {
  tags: Tag[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
}) {
  const sorted = [...tags].sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0));

  return (
    <section
      aria-labelledby="tag-listing-title"
      className="pt-28 pb-14 md:pt-40 md:pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-9 px-(--gutter) md:gap-14">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="bg-card ring-border/60 flex flex-col gap-3 rounded-xl p-8 shadow-sm ring-1 md:p-12">
          <h1 id="tag-listing-title" className="text-4xl font-semibold lg:text-6xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            {subheading}
          </p>
        </header>

        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-center">{emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((tag) => (
              <li key={tag._id}>
                <TagCard tag={tag} postsLabel={postsLabel} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
