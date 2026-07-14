import type { Locale } from "@/config";
import type { PostListItem } from "@/features/blog/sanity/types";
import { BlogCard } from "@/features/blog/user-interface/components/BlogCard";

/**
 * Blog listing section — three-column on desktop by default, switch to
 * two columns via the `cols` prop when each card needs more horizontal
 * room. Used as the empty-state fallback on /blog (cols=3).
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
    <section aria-labelledby="blog-listing-title" className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <header className="flex flex-col gap-2">
          <h1 id="blog-listing-title" className="text-3xl font-semibold md:text-4xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-balance">{subheading}</p>
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
