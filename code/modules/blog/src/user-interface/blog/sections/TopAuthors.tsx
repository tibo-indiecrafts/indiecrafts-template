import Image from "next/image";
import { Link } from "@indiecrafts/i18n";
import type { Author } from "@indiecrafts/blog/sanity/types";

/**
 * Top authors block — ported from `sections-team/team-05` in the
 * library. Same compact 2-col / @xl:3-col layout the `PersonList`
 * module uses on the post page, so authors on the blog frontpage and
 * people on a post page share one visual language.
 *
 * The whole tile is a Link to the author's detail page.
 */
export function TopAuthors({
  authors,
  heading,
  subheading,
  viewAllLabel,
}: {
  authors: Author[];
  heading: string;
  subheading?: string;
  viewAllLabel: string;
}) {
  if (!authors.length) return null;
  const top = [...authors]
    .sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
    .slice(0, 6);
  const headingId = "top-authors-title";

  return (
    <section aria-labelledby={headingId} className="@container py-12 md:py-20">
      <div className="mx-auto max-w-2xl px-(--gutter)">
        <div className="space-y-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold md:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="text-muted-foreground text-balance">{subheading}</p>
          ) : null}
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 text-sm @xl:grid-cols-3 @xl:gap-x-6 @xl:gap-y-12">
          {top.map((author) => {
            const href = author.slug ? `/author/${author.slug}` : "/author";
            return (
              <li key={author._id}>
                <Link
                  href={href}
                  aria-label={author.name ?? undefined}
                  className="focus-visible:ring-ring group flex flex-col items-center gap-4 rounded-xl text-center focus-visible:ring-2 focus-visible:outline-none"
                >
                  {author.image?.asset?.url ? (
                    <div className="before:border-foreground/10 shadow-foreground/6.5 relative size-28 shrink-0 overflow-hidden rounded-xl shadow-md before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border dark:shadow-black/[0.065]">
                      <Image
                        src={author.image.asset.url}
                        alt={author.name ?? ""}
                        width={120}
                        height={120}
                        className="size-full rounded-xl object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="bg-muted size-28 shrink-0 rounded-xl"
                    />
                  )}
                  <div className="space-y-1">
                    <p className="text-foreground group-hover:text-muted-foreground text-sm font-medium transition-colors">
                      {author.name}
                    </p>
                    {author.position ? (
                      <p className="text-muted-foreground text-sm">{author.position}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {authors.length > top.length ? (
          <div className="mt-10 text-center">
            <Link
              href="/author"
              className="border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring inline-block rounded-md border px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {viewAllLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
