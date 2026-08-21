import type { Locale } from "@indiecrafts/packages-shared-config";
import type { PostListItem, Series } from "@indiecrafts/modules-web-blog/sanity/types";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";
import { Pager } from "@indiecrafts/modules-web-blog/user-interface/shared/components/Pager";
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/modules-web-blog/user-interface/shared/components/Breadcrumbs";

/**
 * Series landing — `/blog/series/[slug]`. Header shows the series title +
 * part count + description, above the posts **in reading order**
 * (`seriesOrder`, then date). Paginated like the taxonomy listings.
 */
export function SeriesDetail({
  series,
  posts,
  total,
  locale,
  breadcrumbs,
  breadcrumbsLabel,
  partsLabel,
  noPostsLabel,
  page,
  pageCount,
  basePath,
  pagerLabels,
}: {
  series: Series;
  posts: PostListItem[];
  total: number;
  locale: Locale;
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  partsLabel?: string;
  noPostsLabel: string;
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
  const countLabel = partsLabel
    ? partsLabel.replace("{count}", String(total))
    : String(total);

  return (
    <section
      aria-labelledby="series-detail-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />

        <header className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">{countLabel}</span>
          <h1
            id="series-detail-title"
            className="text-3xl font-semibold md:text-4xl"
          >
            {series.title}
          </h1>
          {series.description ? (
            <p className="text-muted-foreground max-w-2xl text-balance">
              {series.description}
            </p>
          ) : null}
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center">{noPostsLabel}</p>
        ) : (
          <>
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <BlogCard post={post} locale={locale} />
                </li>
              ))}
            </ol>
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
