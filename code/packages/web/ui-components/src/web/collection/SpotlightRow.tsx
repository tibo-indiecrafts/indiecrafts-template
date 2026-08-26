import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { ModuleSection } from "../layout/ModuleSection";
import { PostCard } from "./PostCard";

/**
 * A category/tag "spotlight" — a heading (+ optional subheading and a
 * "view all" link) over a reflowing row of compact post cards, sharing
 * `PostCard` with `FeaturedPosts` for a consistent card treatment. Built for
 * the blog's `module.blog-category-spotlight`; generic over already-resolved
 * data, so any curated-collection surface can reuse it. Renders nothing when
 * `items` is empty.
 */
export function SpotlightRow({
  heading,
  subheading,
  items,
  viewAll,
}: {
  heading: string;
  subheading?: string;
  items: PostCardItem[];
  viewAll?: { label: string; href: string };
}) {
  if (!items.length) return null;

  return (
    <ModuleSection className="@container">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10">
        <div>
          <h2 className="text-3xl font-semibold text-balance md:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="text-muted-foreground mt-2 max-w-2xl">{subheading}</p>
          ) : null}
        </div>
        {viewAll ? (
          <a
            href={viewAll.href}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring shrink-0 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {viewAll.label} →
          </a>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-4">
        {items.map((post) => (
          <PostCard key={post._key} post={post} />
        ))}
      </div>
    </ModuleSection>
  );
}
