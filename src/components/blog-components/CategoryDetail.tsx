import type { Locale } from "@/config";
import type { Category, PostListItem } from "@/sanity/types";
import { BlogCard } from "./BlogCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Category detail section — `/blog/category/[slug]`. Header card shows
 * the category name + post count + optional description. A back-link
 * returns to the category index.
 */
export function CategoryDetail({
  category,
  posts,
  locale,
  breadcrumbs,
  breadcrumbsLabel,
  postsLabel,
  noPostsLabel,
}: {
  category: Category;
  posts: PostListItem[];
  locale: Locale;
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  postsLabel?: string;
  noPostsLabel: string;
}) {
  const count = category.postCount ?? posts.length;
  const countLabel = postsLabel
    ? postsLabel.replace("{count}", String(count))
    : String(count);

  return (
    <section
      aria-labelledby="category-detail-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />

        <header className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">{countLabel}</span>
          <h1
            id="category-detail-title"
            className="text-3xl font-semibold capitalize md:text-4xl"
          >
            {category.title}
          </h1>
          {category.description ? (
            <p className="text-muted-foreground max-w-2xl text-balance">
              {category.description}
            </p>
          ) : null}
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center">{noPostsLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id}>
                <BlogCard post={post} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
