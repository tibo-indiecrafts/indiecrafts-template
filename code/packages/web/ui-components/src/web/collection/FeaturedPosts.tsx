/**
 * Render a lead post card above a grid of featured posts.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/FeaturedPosts.md
 */
import Image from "next/image";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { ModuleSection } from "../layout/ModuleSection";
import { PostCard } from "./PostCard";

/**
 * Featured posts — an optional large "lead" card (the same image + gradient
 * scrim treatment as `PostHero`, at card size) spanning 2 columns/rows in
 * the grid, plus compact `BlogCard`-style cards for the rest. With no
 * `lead`, every item renders at compact size in a plain grid. Renders
 * nothing when there's nothing to show.
 *
 * Data-driven like `PostHero`: every field on `PostCardItem` is already
 * resolved (a plain `href`, formatted `date`), so this primitive stays pure
 * — no i18n, no routing. Whole-card click via a plain `<a>` stretched over
 * the title.
 */
export function FeaturedPosts({
  heading,
  lead,
  items,
}: {
  heading?: string;
  lead?: PostCardItem;
  items: PostCardItem[];
}) {
  if (!lead && !items.length) return null;

  return (
    <ModuleSection className="@container">
      {heading ? (
        <h2 className="mb-8 text-3xl font-semibold text-balance md:mb-10 md:text-4xl">
          {heading}
        </h2>
      ) : null}
      <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3 @4xl:grid-flow-dense">
        {lead ? (
          <LeadCard
            post={lead}
            className="@2xl:col-span-2 @4xl:col-span-2 @4xl:row-span-2"
          />
        ) : null}
        {items.map((post) => (
          <PostCard key={post._key} post={post} />
        ))}
      </div>
    </ModuleSection>
  );
}

/** The large lead card — `PostHero`'s full-bleed image + scrim, at card size. */
function LeadCard({
  post,
  className,
}: {
  post: PostCardItem;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-xl",
        className,
      )}
    >
      <div className="bg-muted absolute inset-0 -z-10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            placeholder={post.lqip ? "blur" : undefined}
            blurDataURL={post.lqip ?? undefined}
            className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
      />
      <div className="flex flex-col gap-3 p-6 text-white @lg:gap-4 @lg:p-8">
        {post.category ? (
          <span className="bg-brand text-brand-foreground w-fit rounded-md px-3 py-1 text-xs font-semibold capitalize">
            {post.category}
          </span>
        ) : null}
        <h3 className="text-xl font-bold text-balance @lg:text-2xl">
          <a
            href={post.href}
            className="focus-visible:ring-ring rounded after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="line-clamp-3">{post.title}</span>
          </a>
        </h3>
        {post.author || post.date ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/85">
            {post.author ? (
              <span className="font-medium text-white">{post.author}</span>
            ) : null}
            {post.author && post.date ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {post.date ? <span>{post.date}</span> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
