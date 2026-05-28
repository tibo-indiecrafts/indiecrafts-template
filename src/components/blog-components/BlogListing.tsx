import type { Locale } from "@/config";
import type { PostListItem } from "@/sanity/types";
import { BlogCard } from "./BlogCard";

/**
 * Blog listing section — three-column on desktop, two-column wide variant.
 * Used by /blog (cols=3) and /blog/two-column (cols=2).
 */
export function BlogListing({
  posts,
  locale,
  heading,
  subheading,
  noPostsLabel,
  cols = 3,
}: {
  posts: PostListItem[];
  locale: Locale;
  heading: string;
  subheading: string;
  noPostsLabel: string;
  cols?: 2 | 3;
}) {
  const grid =
    cols === 2 ? "md:grid-cols-2 lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      aria-labelledby="blog-listing-title"
      className="pt-28 pb-14 md:pt-40 md:pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-14">
        <header className="flex flex-col items-center gap-3.5 text-center">
          <h1 id="blog-listing-title" className="text-4xl font-semibold lg:text-5xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-lg">{subheading}</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center">{noPostsLabel}</p>
        ) : (
          <ul className={`grid grid-cols-1 gap-6 ${grid}`}>
            {posts.map((post) => (
              <li key={post._id}>
                <BlogCard
                  post={post}
                  locale={locale}
                  variant={cols === 2 ? "wide" : "tall"}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
