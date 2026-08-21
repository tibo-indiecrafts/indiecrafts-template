import { Link } from "@indiecrafts/packages-web-i18n";
import type { Locale } from "@indiecrafts/packages-shared-config";
import type { Category, PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";

/**
 * Server-rendered category explorer for the /blog frontpage.
 *
 * Each chip links to `/blog/category/<slug>` — no client-side filtering,
 * so the chips behave consistently with every other category mention on
 * the site. The 6-post preview below shows the latest articles
 * unfiltered; readers go deeper by clicking a chip or the See-all link.
 */
export function ExploreCategories({
  categories,
  posts,
  locale,
  heading,
  subheading,
  viewAllLabel,
  allHref,
}: {
  categories: Category[];
  posts: PostListItem[];
  locale: Locale;
  heading: string;
  subheading: string;
  viewAllLabel: string;
  /** Where the trailing "view all" button points — typically /blog/category. */
  allHref: "/blog" | "/blog/category";
}) {
  // Hide the entire section when there's nothing to surface — keeps the
  // page from showing an empty heading with no chips beneath it.
  if (categories.length === 0 && posts.length === 0) return null;
  const sorted = [...categories].sort(
    (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0),
  );

  return (
    <section
      aria-labelledby="explore-categories-title"
      className="py-14 md:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-9 px-(--gutter) md:gap-14">
        <header className="flex flex-col items-center gap-3.5 text-center">
          <h2
            id="explore-categories-title"
            className="text-3xl font-semibold md:text-4xl"
          >
            {heading}
          </h2>
          <p className="text-muted-foreground max-w-lg">{subheading}</p>
        </header>

        {sorted.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-3">
            {sorted.map((category) =>
              category.slug ? (
                <li key={category._id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="border-border hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md border bg-transparent px-4 py-2 text-base font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {category.title}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        ) : null}

        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <li key={post._id}>
              <BlogCard post={post} locale={locale} />
            </li>
          ))}
        </ul>

        {posts.length > 6 ? (
          <Link
            href={allHref}
            className="border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md border px-6 py-3 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
