import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/_chrome/DefaultLayout";
import { sanityFetchLive } from "@/sanity/live";
import { allPostsQuery } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.blog, locale });
}

/**
 * Blog list — server-renders the latest posts via Sanity. Refetches at
 * build time and on demand (no `revalidate` set, so this is fully static
 * unless a webhook calls `revalidatePath('/blog')`).
 */
export default async function BlogPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.blog)) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.blog");

  const posts = await sanityFetchLive<PostListItem[]>({ query: allPostsQuery });

  return (
    <DefaultLayout>
      <PageSchemas page={pages.blog} locale={locale} />
      <section
        aria-labelledby="blog-title"
        className="mx-auto max-w-6xl px-(--gutter) py-16 md:py-24"
      >
        <header className="mx-auto max-w-2xl text-center">
          <h1 id="blog-title" className="text-4xl font-semibold lg:text-5xl">
            {t("heading")}
          </h1>
          <p className="text-muted-foreground mt-4 text-balance">{t("subheading")}</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-16 text-center">{t("noPosts")}</p>
        ) : (
          <ul className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </DefaultLayout>
  );
}

function PostCard({ post, locale }: { post: PostListItem; locale: Locale }) {
  const image = post.metadata?.image?.asset?.url;
  const category = post.categories?.[0]?.title;
  const date = post.publishedAt ? formatDate(post.publishedAt, locale) : null;
  const slug = post.slug ?? "";
  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;

  return (
    <article className="bg-card ring-border/60 group flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1 transition hover:shadow-md">
      <Link
        href={`/blog/${slug}`}
        className="focus-visible:ring-ring relative block aspect-[4/3] overflow-hidden focus-visible:ring-2 focus-visible:outline-none"
      >
        {image ? (
          <Image
            src={image}
            alt={post.metadata?.image?.alt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="bg-muted h-full w-full" aria-hidden="true" />
        )}
        {category ? (
          <span className="bg-background/90 text-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-medium">
            {category}
          </span>
        ) : null}
        {post.featured ? (
          <span className="bg-brand text-brand-foreground absolute top-3 right-3 rounded-md px-2 py-1 text-xs font-medium">
            ★
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link
          href={`/blog/${slug}`}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <h2 className="line-clamp-2 text-lg font-semibold">{title}</h2>
        </Link>
        {description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        ) : null}
        <div className="text-muted-foreground mt-auto flex items-center justify-between pt-3 text-xs">
          {post.author?.name ? <span>{post.author.name}</span> : <span />}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}
