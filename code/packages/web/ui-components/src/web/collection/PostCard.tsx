/**
 * Render one compact post card.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/PostCard.md
 */
import Image from "next/image";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";

/**
 * A compact post card — mirrors `BlogCard`: image, category chip, title,
 * author · date. Shared by `FeaturedPosts` and `SpotlightRow` so the two
 * primitives render identical cards. Whole-card click via a plain `<a>`
 * stretched over the title, like `PostHero`/`FeaturedPosts`.
 */
export function PostCard({ post }: { post: PostCardItem }) {
  return (
    <article className="group bg-card ring-border/60 relative flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            placeholder={post.lqip ? "blur" : undefined}
            blurDataURL={post.lqip ?? undefined}
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.category ? (
          <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium capitalize">
            {post.category}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold">
          <a
            href={post.href}
            className="group-hover:text-brand focus-visible:ring-ring rounded transition-colors after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="line-clamp-2">{post.title}</span>
          </a>
        </h3>
        <PostMeta post={post} className="text-muted-foreground mt-auto pt-2" />
      </div>
    </article>
  );
}

/** "Author · date", when either is set. */
export function PostMeta({
  post,
  className,
}: {
  post: PostCardItem;
  className?: string;
}) {
  if (!post.author && !post.date) return null;
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
        className,
      )}
    >
      {post.author ? <span className="font-medium">{post.author}</span> : null}
      {post.author && post.date ? <span aria-hidden="true">·</span> : null}
      {post.date ? <span>{post.date}</span> : null}
    </p>
  );
}
