import type { Author } from "@indiecrafts/blog/sanity/types";
import { AuthorCard } from "@indiecrafts/blog/user-interface/author/components/AuthorCard";
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/blog/user-interface/shared/components/Breadcrumbs";
import {
  PageHero,
  type PageHeroPill,
} from "@indiecrafts/blog/user-interface/shared/sections/PageHero";

/**
 * Author index page section — `/author`. Each author card links to its
 * detail page; the list comes pre-filtered to those with at least one
 * published post in the current locale.
 */
export function AuthorListing({
  authors,
  breadcrumbs,
  breadcrumbsLabel,
  heading,
  subheading,
  emptyLabel,
  postsLabel,
  pills,
}: {
  authors: Author[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
  pills?: PageHeroPill[];
}) {
  return (
    <section
      aria-labelledby="author-listing-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <PageHero
          titleId="author-listing-title"
          title={heading}
          subtitle={subheading}
          pills={pills}
        />

        {authors.length === 0 ? (
          <p className="text-muted-foreground text-center">{emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {authors.map((author) => (
              <li key={author._id}>
                <AuthorCard author={author} postsLabel={postsLabel} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
