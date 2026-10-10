/**
 * Render a lead post card beside a short list of runners-up.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/FeaturedEditorial.md
 */
import Image from "next/image";
import type { PostCardItem } from "@indiecrafts/packages-web-ui-components/shared/types";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { FeaturedMedia } from "../media/FeaturedMedia";
import { PostMeta } from "./PostCard";

/** Most posts the editorial layout shows: the lead + 3 rows. */
export const EDITORIAL_MAX = 4;

/**
 * The `editorial` layout of `FeaturedPosts`: the first post as a large card (image or a video
 * it plays in place, category, title, excerpt, meta), the next three as compact rows beside it. Side by side from a
 * `@4xl` container; stacked below. Renders nothing with no post.
 */
export function FeaturedEditorial({
  posts,
  playLabel,
}: {
  posts: PostCardItem[];
  /** The lead's video play button label (i18n, from the host). */
  playLabel: string;
}) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  const rows = rest.slice(0, EDITORIAL_MAX - 1);

  return (
    <div className="grid gap-6 @4xl:grid-cols-12 @4xl:gap-8">
      <article
        className={cn(
          "group bg-card ring-border/60 relative flex flex-col overflow-hidden rounded-xl shadow-sm ring-1",
          rows.length ? "@4xl:col-span-7" : "@4xl:col-span-12",
        )}
      >
        <FeaturedMedia
          image={lead.image}
          alt={lead.imageAlt ?? lead.title}
          videoUrl={lead.video}
          lqip={lead.lqip}
          aspect="aspect-[3/2]"
          sizes="(min-width: 1024px) 56vw, 100vw"
          playLabel={playLabel}
        />
        <div className="flex flex-1 flex-col gap-3 p-6">
          {lead.category ? (
            <span className="bg-brand text-brand-foreground w-fit rounded-md px-2 py-1 text-xs font-medium capitalize">
              {lead.category}
            </span>
          ) : null}
          <h3 className="text-2xl font-semibold tracking-tight text-pretty @4xl:text-3xl">
            <a
              href={lead.href}
              className="group-hover:text-brand focus-visible:ring-ring rounded transition-colors after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
            >
              {lead.title}
            </a>
          </h3>
          {lead.excerpt ? (
            <p className="text-muted-foreground line-clamp-2 text-pretty">
              {lead.excerpt}
            </p>
          ) : null}
          <PostMeta
            post={lead}
            className="text-muted-foreground mt-auto pt-2"
          />
        </div>
      </article>
      {rows.length ? (
        <ul className="divide-border/60 border-border/60 divide-y @4xl:col-span-5 @4xl:border-y">
          {rows.map((post) => (
            <li key={post._key}>
              <a
                href={post.href}
                className="group focus-visible:ring-ring flex gap-4 rounded-lg py-4 focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="bg-muted relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg @md:w-28">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="112px"
                      placeholder={post.lqip ? "blur" : undefined}
                      blurDataURL={post.lqip ?? undefined}
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                  <h3 className="group-hover:text-brand line-clamp-2 leading-snug font-medium text-pretty transition-colors">
                    {post.title}
                  </h3>
                  <PostMeta post={post} className="text-muted-foreground" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
