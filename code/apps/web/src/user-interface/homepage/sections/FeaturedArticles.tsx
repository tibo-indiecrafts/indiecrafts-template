import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Locale } from "@indiecrafts/config";
import { parseVideoEmbed } from "@indiecrafts/utils";
import { formatPostDate } from "@indiecrafts/utils";
import type { PostListItem } from "@indiecrafts/blog/sanity/types";
import { PlayBadge } from "@indiecrafts/blog/user-interface/shared/components/PlayBadge";

/**
 * Homepage "editor's desk" — a curated strip of featured articles, laid out
 * as one lead pick beside a compact list of runners-up. The asymmetry is
 * the point: it reads differently from the uniform `/blog` grid because the
 * lead genuinely outranks the rest.
 *
 * Pure display. The home page fetches `featuredPostsQuery` (gated behind
 * `features.blog`), resolves the labels via i18n, and renders this only
 * when at least one post is marked featured — mirroring `BlogListing`.
 */
export function FeaturedArticles({
  id,
  posts,
  locale,
  eyebrow,
  title,
  body,
  viewAllLabel,
}: {
  id: string;
  posts: PostListItem[];
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  viewAllLabel: string;
}) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  const secondary = rest.slice(0, 3);
  const hasList = secondary.length > 0;

  return (
    <section aria-labelledby={`${id}-title`} className="border-t py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-xl">
            <p className="text-brand flex items-center gap-3 text-xs font-medium tracking-widest uppercase">
              <span aria-hidden="true" className="bg-brand h-px w-8" />
              {eyebrow}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-4 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mt-3 text-balance">{body}</p>
          </div>
          <Link
            href="/blog"
            className="group hover:text-brand focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {viewAllLabel}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className={hasList ? "lg:col-span-7" : "lg:col-span-12"}>
            <LeadCard post={lead} locale={locale} />
          </div>
          {hasList ? (
            <ul className="divide-border/60 lg:border-border/60 lg:col-span-5 lg:divide-y lg:border-t lg:border-b">
              {secondary.map((post) => (
                <li key={post._id}>
                  <SecondaryRow post={post} locale={locale} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function LeadCard({ post, locale }: { post: PostListItem; locale: Locale }) {
  const slug = post.slug ?? "";
  const title = post.metadata?.title ?? post.title ?? "";
  const image = post.metadata?.image?.asset?.url;
  const alt = post.metadata?.image?.alt ?? title;
  const category = post.categories?.[0]?.title;
  const description = post.metadata?.description;
  const date = formatDate(locale, post.publishedAt);
  const hasVideo = !!parseVideoEmbed(post.metadata?.videoUrl);

  return (
    <article className="group bg-card ring-border/60 flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1">
      <Link
        href={`/blog/${slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[3/2] overflow-hidden"
      >
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 56vw, (min-width: 768px) 92vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="bg-muted h-full w-full" aria-hidden="true" />
        )}
        {hasVideo ? <PlayBadge /> : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {category ? (
          <span className="bg-brand text-brand-foreground w-fit rounded-md px-2 py-1 text-xs font-medium capitalize">
            {category}
          </span>
        ) : null}
        <Link
          href={`/blog/${slug}`}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <h3 className="group-hover:text-brand text-2xl font-semibold tracking-tight text-pretty transition-colors lg:text-3xl">
            {title}
          </h3>
        </Link>
        {description ? (
          <p className="text-muted-foreground line-clamp-2 text-pretty">{description}</p>
        ) : null}
        <p className="text-muted-foreground mt-auto pt-2 text-sm">
          {[post.author?.name, date].filter(Boolean).join(" · ")}
        </p>
      </div>
    </article>
  );
}

function SecondaryRow({ post, locale }: { post: PostListItem; locale: Locale }) {
  const slug = post.slug ?? "";
  const title = post.metadata?.title ?? post.title ?? "";
  const image = post.metadata?.image?.asset?.url;
  const alt = post.metadata?.image?.alt ?? title;
  const date = formatDate(locale, post.publishedAt);
  const hasVideo = !!parseVideoEmbed(post.metadata?.videoUrl);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group focus-visible:ring-ring max-lg:border-border/60 flex gap-4 rounded-lg py-4 focus-visible:ring-2 focus-visible:outline-none max-lg:border-b lg:px-1"
    >
      <div className="bg-muted relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg sm:w-28">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}
        {hasVideo ? <PlayBadge size="sm" /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <h3 className="group-hover:text-brand line-clamp-2 leading-snug font-medium text-pretty transition-colors">
          {title}
        </h3>
        {date ? (
          <p className="text-muted-foreground text-xs">
            {[post.author?.name, date].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function formatDate(locale: Locale, iso?: string | null): string | null {
  return formatPostDate(locale, iso);
}
