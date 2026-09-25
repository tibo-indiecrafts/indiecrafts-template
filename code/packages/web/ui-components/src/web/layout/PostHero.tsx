/**
 * Renders a full-width lead-post media hero with title, category, and byline overlay.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/PostHero.md
 */
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { FeaturedMedia } from "../media/FeaturedMedia";

/**
 * Frontpage lead post — a large, full-width media hero with the title,
 * category chip, excerpt, and author · date overlaid on a gradient scrim.
 * Data-driven: every value is already resolved (a plain `href`, image/video
 * url, formatted `date`), so the host owns i18n + routing and this owns the
 * layout. Whole-card click via the title link's stretched `after` overlay;
 * `FeaturedMedia`'s own play button sits above it (z-10) and stops
 * propagation, so a video hero still opens the player in place.
 *
 * `headingLevel` controls the title tag — `"h2"` when the hero sits inside a
 * page (e.g. the blog frontpage), `"h1"` when it IS the page's main heading.
 */
export function PostHero({
  href,
  title,
  excerpt,
  image,
  lqip,
  alt,
  video,
  category,
  author,
  date,
  playLabel,
  headingLevel = "h2",
}: {
  href: string;
  title: string;
  excerpt?: string;
  image?: string;
  lqip?: string;
  alt?: string;
  video?: string;
  category?: { title: string; href?: string };
  author?: string;
  date?: string;
  playLabel: string;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <div className="@container relative overflow-hidden rounded-2xl">
      <FeaturedMedia
        image={image}
        alt={alt ?? title}
        videoUrl={video}
        lqip={lqip}
        aspect="aspect-[4/3] @md:aspect-video @xl:aspect-[21/9]"
        sizes="100vw"
        priority
        playLabel={playLabel}
        className={cn(!image && !video && "bg-black")}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-white @sm:p-8 @lg:gap-4 @lg:p-10 @xl:p-14">
        {category ? (
          category.href ? (
            <a
              href={category.href}
              className="bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:ring-ring relative z-10 w-fit rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {category.title}
            </a>
          ) : (
            <span className="bg-brand text-brand-foreground w-fit rounded-md px-3 py-1 text-xs font-semibold capitalize">
              {category.title}
            </span>
          )
        ) : null}

        <Heading className="text-2xl font-bold text-balance @sm:text-3xl @lg:text-4xl @xl:text-5xl">
          <a
            href={href}
            className="focus-visible:ring-ring rounded after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            {title}
          </a>
        </Heading>

        {excerpt ? (
          <p className="line-clamp-2 max-w-2xl text-sm text-white/85 @lg:line-clamp-3 @lg:text-base">
            {excerpt}
          </p>
        ) : null}

        {author || date ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/80 @lg:text-sm">
            {author ? (
              <span className="font-medium text-white">{author}</span>
            ) : null}
            {author && date ? <span aria-hidden="true">·</span> : null}
            {date ? <span>{date}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
