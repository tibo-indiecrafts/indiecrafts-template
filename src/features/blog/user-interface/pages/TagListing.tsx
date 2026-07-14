import type { Tag } from "@/features/blog/sanity/types";
import { TagCard } from "@/features/blog/user-interface/components/TagCard";
import {
  Breadcrumbs,
  type Crumb,
} from "@/features/blog/user-interface/components/Breadcrumbs";
import {
  PageHero,
  type PageHeroPill,
} from "@/features/blog/user-interface/sections/PageHero";

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
  pills,
}: {
  tags: Tag[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
  pills?: PageHeroPill[];
}) {
  const sorted = [...tags].sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0));

  return (
    <section aria-labelledby="tag-listing-title" className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <PageHero
          titleId="tag-listing-title"
          title={heading}
          subtitle={subheading}
          pills={pills}
        />

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
