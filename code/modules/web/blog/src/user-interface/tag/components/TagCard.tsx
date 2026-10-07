/**
 * Render a single tag card linking to the tag's post archive.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/tag/components/TagCard.md
 */
import { Link } from "@indiecrafts/packages-web-i18n";
import type { Tag } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Single tag card — used by /blog/tag. Visually lighter than the
 * category card (tags are finer-grained labels) but built on the same
 * primitives so they fit on the same surface.
 */
export function TagCard({
  tag,
  postsLabel,
}: {
  tag: Tag;
  postsLabel: (count: number) => string;
}) {
  const slug = tag.slug ?? "";
  if (!slug) return null;
  const count = tag.postCount ?? 0;
  const label = postsLabel(count);

  return (
    <article className="bg-card ring-border/60 group flex h-full flex-col gap-3 rounded-xl p-5 shadow-sm ring-1 transition hover:scale-[1.01] hover:shadow-md">
      <Link
        href={`/blog/tag/${slug}`}
        className="focus-visible:ring-ring flex flex-col gap-3 focus-visible:ring-2 focus-visible:outline-none"
      >
        <header className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold capitalize">#{tag.title}</h2>
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium">
            {label}
          </span>
        </header>
        {tag.description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {tag.description}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
