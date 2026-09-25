/**
 * Renders a single category card linking to its /blog/category/<slug> page.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/category/components/CategoryCard.md
 */
import { Link } from "@indiecrafts/packages-web-i18n";
import type { Category } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Single category card — used by /blog/category. Displays the title,
 * post count, and (optional) description. The whole card is a link to
 * `/blog/category/<slug>`.
 */
export function CategoryCard({
  category,
  postsLabel,
}: {
  category: Category;
  postsLabel: string;
}) {
  const slug = category.slug ?? "";
  if (!slug) return null;
  const count = category.postCount ?? 0;

  return (
    <article className="bg-card ring-border/60 group flex h-full flex-col gap-3 rounded-xl p-6 shadow-sm ring-1 transition hover:scale-[1.01] hover:shadow-md">
      <Link
        href={`/blog/category/${slug}`}
        className="focus-visible:ring-ring flex flex-col gap-3 focus-visible:ring-2 focus-visible:outline-none"
      >
        <header className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold capitalize">{category.title}</h2>
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium">
            {postsLabel.replace("{count}", String(count))}
          </span>
        </header>
        {category.description ? (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {category.description}
          </p>
        ) : null}
        <span
          aria-hidden="true"
          className="text-muted-foreground group-hover:text-foreground mt-auto text-xs"
        >
          →
        </span>
      </Link>
    </article>
  );
}
