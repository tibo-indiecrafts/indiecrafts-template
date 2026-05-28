import { Link } from "@/i18n/routing";
import type { Author } from "@/sanity/types";
import { AuthorCard } from "./AuthorCard";

/**
 * Three-author server section — wraps the AuthorCard grid with a
 * heading + a `View all` link. Authors are pre-sorted by `postCount`
 * descending so the most prolific contributors lead.
 */
export function TopAuthors({
  authors,
  heading,
  viewAllLabel,
  postsLabel,
}: {
  authors: Author[];
  heading: string;
  viewAllLabel: string;
  postsLabel: string;
}) {
  if (!authors.length) return null;
  const top = [...authors]
    .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
    .slice(0, 3);

  return (
    <section aria-labelledby="top-authors-title" className="py-10 md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-(--gutter) md:gap-14">
        <header className="flex flex-col items-center justify-between gap-3.5 sm:flex-row sm:items-end">
          <h2 id="top-authors-title" className="text-2xl font-semibold md:text-3xl">
            {heading}
          </h2>
          {authors.length > 3 ? (
            <Link
              href="/author"
              className="border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md border px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </header>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {top.map((author) => (
            <AuthorCard key={author._id} author={author} postsLabel={postsLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}
