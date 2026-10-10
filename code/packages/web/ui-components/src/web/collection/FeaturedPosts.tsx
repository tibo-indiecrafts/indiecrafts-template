/**
 * Render featured posts: a lead card over a grid, or a lead card beside a short list.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/FeaturedPosts.md
 */
import Image from "next/image";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { ModuleSection } from "../layout/ModuleSection";
import { FeaturedEditorial } from "./FeaturedEditorial";
import { PostCard, PostMeta } from "./PostCard";

/**
 * Featured posts, under an optional header (eyebrow · heading · intro · "view all" link).
 *
 * - `grid` (default) — an optional large `lead` card (the `PostHero` image + scrim, at card
 *   size) spanning 2 columns/rows, plus compact `PostCard`s. With no `lead`, a plain grid.
 * - `editorial` — the lead card beside a short list of runners-up (`FeaturedEditorial`): it
 *   reads differently from a uniform grid because the lead outranks the rest.
 *
 * Data-driven: every `PostCardItem` field is resolved (plain `href`, formatted `date`), so
 * this stays pure — no i18n, no routing. Container-driven, so it fits a full-width section,
 * a narrow column and a page with a sidebar. Renders nothing with no post.
 */
export function FeaturedPosts({
  layout = "grid",
  eyebrow,
  heading,
  intro,
  viewAll,
  lead,
  items,
  anchor,
  playLabel = "Play video",
}: {
  layout?: "grid" | "editorial";
  eyebrow?: string;
  heading?: string;
  intro?: string;
  viewAll?: { label: string; href: string };
  lead?: PostCardItem;
  items: PostCardItem[];
  anchor?: string;
  /** The editorial lead's video play label (i18n, from the host). */
  playLabel?: string;
}) {
  if (!lead && !items.length) return null;
  const headingId = anchor ? `${anchor}-title` : undefined;

  return (
    <ModuleSection anchor={anchor} className="@container">
      {eyebrow || heading || intro || viewAll ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 @2xl:mb-10">
          <div className="max-w-xl">
            {eyebrow ? (
              <p className="text-brand flex items-center gap-3 text-xs font-medium tracking-widest uppercase">
                <span aria-hidden="true" className="bg-brand h-px w-8" />
                {eyebrow}
              </p>
            ) : null}
            {heading ? (
              <h2
                id={headingId}
                className={cn(
                  "text-2xl font-semibold tracking-tight text-balance @2xl:text-3xl @4xl:text-4xl",
                  eyebrow && "mt-4",
                )}
              >
                {heading}
              </h2>
            ) : null}
            {intro ? (
              <p className="text-muted-foreground mt-3 text-balance">{intro}</p>
            ) : null}
          </div>
          {viewAll ? (
            <a
              href={viewAll.href}
              className="group hover:text-brand focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {viewAll.label}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                →
              </span>
            </a>
          ) : null}
        </div>
      ) : null}
      {layout === "editorial" ? (
        <FeaturedEditorial
          posts={lead ? [lead, ...items] : items}
          playLabel={playLabel}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-flow-dense @4xl:grid-cols-3">
          {lead ? (
            <LeadCard
              post={lead}
              className="@xl:col-span-2 @4xl:col-span-2 @4xl:row-span-2"
            />
          ) : null}
          {items.map((post) => (
            <PostCard key={post._key} post={post} />
          ))}
        </div>
      )}
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
        <PostMeta post={post} className="text-white/85" />
      </div>
    </article>
  );
}
