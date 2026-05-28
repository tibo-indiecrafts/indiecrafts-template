import type { Author } from "@/sanity/types";
import { AuthorCard } from "./AuthorCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

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
}: {
  authors: Author[];
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  heading: string;
  subheading: string;
  emptyLabel: string;
  postsLabel: string;
}) {
  return (
    <section
      aria-labelledby="author-listing-title"
      className="pt-28 pb-14 md:pt-40 md:pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-9 px-(--gutter) pt-9 pb-24 md:gap-14">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="bg-card ring-border/60 flex flex-col gap-3 rounded-xl p-8 shadow-sm ring-1 md:p-12">
          <h1 id="author-listing-title" className="text-4xl font-semibold lg:text-6xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            {subheading}
          </p>
        </header>

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
