import type { Category } from "@/sanity/types";
import { CategoryCard } from "./CategoryCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

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
}: {
  categories: Category[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
}) {
  const sorted = [...categories].sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0));

  return (
    <section
      aria-labelledby="category-listing-title"
      className="pt-28 pb-14 md:pt-40 md:pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-9 px-(--gutter) md:gap-14">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="bg-card ring-border/60 flex flex-col gap-3 rounded-xl p-8 shadow-sm ring-1 md:p-12">
          <h1 id="category-listing-title" className="text-4xl font-semibold lg:text-6xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            {subheading}
          </p>
        </header>

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
