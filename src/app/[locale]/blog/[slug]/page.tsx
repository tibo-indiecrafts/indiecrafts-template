import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { features, isPageVisible, pages, site, type Locale } from "@/config";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildArticleSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { Toc } from "@/components/blog-components/Toc";
import { Modules } from "@/components/blog-components/modules/ModuleRenderer";
import { portableComponents } from "@/components/blog-components/modules/portable-text-components";
import { client } from "@/sanity/client";
import { sanityFetchLive } from "@/sanity/live";
import { allPostSlugsQuery, blogSingletonQuery, postBySlugQuery } from "@/sanity/queries";
import type { BlogSingleton, Post, PostSlug } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
  // `sanityFetchLive` reads `draftMode()` which isn't allowed inside
  // `generateStaticParams` (build time, no request). Use the unauthed
  // client directly — `noIndex` filtering happens in the query anyway.
  const slugs = await client.fetch<PostSlug[]>(allPostSlugsQuery);
  // Each post now belongs to one locale (post.language); pair its slug
  // with that locale only so the FR post doesn't statically render at
  // /en and vice versa.
  return slugs.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = await sanityFetchLive<Post | null>({
    query: postBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.blog, locale });
  if (!post) return base;

  const title = post.metadata?.title ?? post.title;
  const description = post.metadata?.description;
  const ogImage = post.metadata?.image?.asset?.url;

  return {
    ...base,
    title,
    description,
    robots: post.metadata?.noIndex ? { index: false, follow: false } : base.robots,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
    // Advertise the markdown + RSS alternates so AI agents + feed readers
    // can find them without scraping the page.
    alternates: {
      ...base.alternates,
      types: {
        ...(base.alternates?.types ?? {}),
        "text/markdown": `/${locale}/blog/${slug}/md`,
        "application/rss+xml": `/${locale}/blog/rss.xml`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.blog)) notFound();
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Fetch post + blog singleton in parallel — the singleton drives the
  // module layout when its `postModules` array is populated.
  const [post, blog] = await Promise.all([
    sanityFetchLive<Post | null>({ query: postBySlugQuery, params: { slug, locale } }),
    sanityFetchLive<BlogSingleton | null>({
      query: blogSingletonQuery,
      params: { locale },
    }),
  ]);
  if (!post) notFound();

  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;
  const image = post.metadata?.image?.asset?.url;
  const modules = blog?.postModules ?? [];

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.blog,
          seo: {
            ...pages.blog.seo,
            structuredData: [
              buildArticleSchema({
                headline: title,
                description,
                datePublished: post.publishedAt ?? new Date().toISOString(),
                authorName: post.author?.name,
                image,
                url: `${site.url}/${locale}/blog/${slug}`,
              }),
            ],
          },
        }}
        locale={locale}
      />
      {modules.length > 0 ? (
        <Modules modules={modules} context={{ locale, post }} />
      ) : (
        <DefaultPostLayout
          post={post}
          locale={locale}
          image={image}
          title={title}
          description={description}
        />
      )}
    </DefaultLayout>
  );
}

// ─── Hard-coded fallback when no postModules are configured ─────

async function DefaultPostLayout({
  post,
  locale,
  image,
  title,
  description,
}: {
  post: Post;
  locale: Locale;
  image?: string;
  title: string;
  description?: string;
}) {
  const t = await getTranslations("pages.blog");
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const readTime = post.readTime && post.readTime > 0 ? post.readTime : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-(--gutter) py-16 md:grid-cols-[1fr_220px] md:py-24">
      <article className="min-w-0">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("backToList")}
        </Link>

        <header className="mt-8 flex flex-col gap-4">
          {post.categories?.[0]?.title ? (
            <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium">
              {post.categories[0].title}
            </span>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-balance">{description}</p>
          ) : null}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            {post.author?.name ? (
              <span>{t("by", { name: post.author.name })}</span>
            ) : null}
            {post.author?.name && date ? <span aria-hidden="true">·</span> : null}
            {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
            {readTime ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{t("minRead", { minutes: readTime })}</span>
              </>
            ) : null}
          </div>
        </header>

        {image ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={post.metadata?.image?.alt ?? title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        {post.body ? (
          <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
            <PortableText value={post.body} components={portableComponents} />
          </div>
        ) : null}
      </article>

      {post.headings?.length ? (
        <aside className="md:pt-[3.5rem]">
          <Toc headings={post.headings} title={t("onThisPage")} />
        </aside>
      ) : null}
    </div>
  );
}
