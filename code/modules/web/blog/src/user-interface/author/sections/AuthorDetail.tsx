/**
 * Renders the /author/[slug] section — author hero plus a paged post grid.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/author/sections/AuthorDetail.md
 */
import Image from "next/image";
import { Globe } from "lucide-react";
import type { Locale } from "@indiecrafts/packages-shared-config";
import type {
  Author,
  AuthorSocial,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";
import { Pager } from "@indiecrafts/modules-web-blog/user-interface/shared/components/Pager";
import { BrandIcon, isBrand } from "@indiecrafts/packages-web-ui-icons/web";
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/modules-web-blog/user-interface/shared/components/Breadcrumbs";

/**
 * Author detail section — `/author/[slug]`. Hero block shows the
 * portrait + bio + social links; below it, every published post by this
 * author in the current locale.
 */
export function AuthorDetail({
  author,
  posts,
  total,
  locale,
  breadcrumbs,
  breadcrumbsLabel,
  postsLabel,
  noPostsLabel,
  socialLabels,
  page,
  pageCount,
  basePath,
  pagerLabels,
}: {
  author: Author;
  posts: PostListItem[];
  total: number;
  locale: Locale;
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  postsLabel?: (count: number) => string;
  noPostsLabel: string;
  socialLabels: Record<string, string>;
  page: number;
  pageCount: number;
  basePath: string;
  pagerLabels: {
    label: string;
    previous: string;
    next: string;
    status: string;
  };
}) {
  const postCountLabel = postsLabel ? postsLabel(total) : String(total);
  return (
    <section
      aria-labelledby="author-detail-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {author.image?.asset?.url ? (
            <Image
              src={author.image.asset.url}
              alt={author.name ?? ""}
              width={160}
              height={160}
              className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-muted flex h-28 w-28 items-center justify-center rounded-full text-3xl sm:h-32 sm:w-32 md:h-40 md:w-40"
            >
              {(author.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <h1
              id="author-detail-title"
              className="text-3xl font-semibold md:text-4xl"
            >
              {author.name}
            </h1>
            {author.position ? (
              <p className="text-muted-foreground text-sm">{author.position}</p>
            ) : null}
            {author.bio ? (
              <p className="text-muted-foreground max-w-2xl text-balance">
                {author.bio}
              </p>
            ) : null}
            <span className="text-muted-foreground mt-1 text-xs">
              {postCountLabel}
            </span>
            {author.social && author.social.length > 0 ? (
              <ul className="mt-2 flex items-center gap-2">
                {author.social.map((s, i) => {
                  if (!s.url || !s.platform) return null;
                  return (
                    <li key={`${s.platform}-${i}`}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={socialLabels[s.platform] ?? s.platform}
                        className="text-muted-foreground hover:text-foreground hover:border-foreground/30 ring-border/60 focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {isBrand(s.platform) ? (
                          <BrandIcon
                            name={s.platform}
                            aria-hidden="true"
                            className="size-4"
                          />
                        ) : (
                          <Globe aria-hidden="true" className="size-4" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">{noPostsLabel}</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <BlogCard post={post} locale={locale} />
                </li>
              ))}
            </ul>
            <Pager
              page={page}
              pageCount={pageCount}
              basePath={basePath}
              labels={pagerLabels}
            />
          </>
        )}
      </div>
    </section>
  );
}
