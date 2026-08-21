import type { Category } from "@indiecrafts/modules-web-blog/sanity/types";
import { CategoryCard } from "@indiecrafts/modules-web-blog/user-interface/category/components/CategoryCard";
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/modules-web-blog/user-interface/shared/components/Breadcrumbs";
import {
  PageHero,
  type PageHeroPill,
} from "@indiecrafts/modules-web-blog/user-interface/shared/sections/PageHero";

/**
 * Category index page section — `/blog/category`. Sorted by post count
 * desc so the most active topics lead.
 */
export function CategoryListing({
  categories,
  breadcrumbs,
  breadcrumbsLabel,
  heading,
  subheading,
  emptyLabel,
  postsLabel,
  pills,
}: {
  categories: Category[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
  pills?: PageHeroPill[];
}) {
  const sorted = [...categories].sort(
    (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0),
  );

  return (
    <section
      aria-labelledby="category-listing-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <PageHero
          titleId="category-listing-title"
          title={heading}
          subtitle={subheading}
          pills={pills}
        />

        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-center">{emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((category) => (
              <li key={category._id}>
                <CategoryCard category={category} postsLabel={postsLabel} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
