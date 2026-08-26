import Image from "next/image";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { ModuleSection } from "./ModuleSection";

export type TopicCardItem = {
  _key: string;
  title: string;
  blurb?: string;
  image?: string;
  href: string;
};

const GRID_COLS: Record<number, string> = {
  1: "@lg:grid-cols-1",
  2: "@lg:grid-cols-2",
  3: "@lg:grid-cols-3",
};

/**
 * Topic cards — one to three large image cards, each linking to a category
 * or tag listing page. Same full-bleed image + gradient-scrim treatment as
 * `PostHero`/`FeaturedPosts`' lead card, columned by item count (1 fills the
 * row, 2 or 3 split it evenly). Built for the blog's `module.blog-topic-cards`
 * — unlike every other blog block, this one points at taxonomy, not posts,
 * so it takes its own small item shape instead of `PostCardItem`. Generic
 * over already-resolved data (no i18n, no routing). Whole-card click via a
 * plain `<a>` stretched over the title. Renders nothing when `items` is
 * empty.
 */
export function TopicCards({ items }: { items: TopicCardItem[] }) {
  if (!items.length) return null;

  return (
    <ModuleSection className="@container">
      <div className={cn("grid grid-cols-1 gap-6", GRID_COLS[items.length] ?? GRID_COLS[3])}>
        {items.map((item) => (
          <TopicCard key={item._key} item={item} />
        ))}
      </div>
    </ModuleSection>
  );
}

function TopicCard({ item }: { item: TopicCardItem }) {
  return (
    <article className="group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-xl @lg:min-h-96">
      <div className="bg-muted absolute inset-0 -z-10">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
      />
      <div className="flex flex-col gap-2 p-6 text-white @lg:gap-3 @lg:p-8">
        <h3 className="text-xl font-bold text-balance @lg:text-2xl">
          <a
            href={item.href}
            className="focus-visible:ring-ring rounded after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            {item.title}
          </a>
        </h3>
        {item.blurb ? (
          <p className="line-clamp-2 text-sm text-white/85 @lg:text-base">{item.blurb}</p>
        ) : null}
      </div>
    </article>
  );
}
