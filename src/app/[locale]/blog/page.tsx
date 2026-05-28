import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { BlogHero } from "@/components/blog-components/BlogHero";
import { ExploreCategories } from "@/components/blog-components/ExploreCategories";
import { ExploreTags } from "@/components/blog-components/ExploreTags";
import { TopAuthors } from "@/components/blog-components/TopAuthors";
import { NewsletterSignup } from "@/components/blog-components/NewsletterSignup";
import { BlogListing } from "@/components/blog-components/BlogListing";
import { Modules } from "@/components/blog-components/modules/ModuleRenderer";
import { sanityFetchLive } from "@/sanity/live";
import {
  allPostsQuery,
  authorsForLocaleQuery,
  blogSingletonQuery,
  categoriesForLocaleQuery,
  tagsForLocaleQuery,
} from "@/sanity/queries";
import type { Author, BlogSingleton, Category, PostListItem, Tag } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.blog, locale });
}

/**
 * Blog frontpage. Module-driven when the `blog` singleton has
 * `frontpageModules` populated; otherwise renders the blog-forge style
 * default: hero card grid → category explorer → top authors → newsletter.
 *
 * The plain three-column listing still lives at /blog/two-column.
 */
export default async function BlogPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.blog)) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const blog = await sanityFetchLive<BlogSingleton | null>({
    query: blogSingletonQuery,
    params: { locale },
  });
  const modules = blog?.frontpageModules ?? [];

  return (
    <DefaultLayout>
      <PageSchemas page={pages.blog} locale={locale} />
      {modules.length > 0 ? (
        <Modules modules={modules} context={{ locale }} />
      ) : (
        <DefaultBlogFrontpage locale={locale} />
      )}
    </DefaultLayout>
  );
}

async function DefaultBlogFrontpage({ locale }: { locale: Locale }) {
  const [posts, authors, categories, tags, t] = await Promise.all([
    sanityFetchLive<PostListItem[]>({ query: allPostsQuery, params: { locale } }),
    sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } }),
    sanityFetchLive<Category[]>({
      query: categoriesForLocaleQuery,
      params: { locale },
    }),
    sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } }),
    getTranslations("pages.blog"),
  ]);

  if (posts.length === 0) {
    return (
      <BlogListing
        posts={posts}
        locale={locale}
        heading={t("heading")}
        subheading={t("subheading")}
        noPostsLabel={t("noPosts")}
        cols={3}
      />
    );
  }

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>
      <BlogHero posts={posts} locale={locale} label={t("heroLabel")} />

      <ExploreCategories
        categories={categories}
        posts={posts}
        locale={locale}
        heading={t("categories.heading")}
        subheading={t("categories.subheading")}
        viewAllLabel={t("categories.viewAll")}
        allHref="/blog/two-column"
      />

      <ExploreTags
        tags={tags}
        heading={t("tags.heading")}
        subheading={t("tags.subheading")}
        viewAllLabel={t("tags.viewAll")}
      />

      <TopAuthors
        authors={authors}
        heading={t("authors.heading")}
        viewAllLabel={t("authors.viewAll")}
        postsLabel={t.raw("authors.posts")}
      />

      <NewsletterSignup
        heading={t("newsletter.heading")}
        subheading={t("newsletter.subheading")}
        placeholder={t("newsletter.placeholder")}
        submitLabel={t("newsletter.submit")}
        successLabel={t("newsletter.success")}
        errorLabel={t("newsletter.error")}
      />
    </>
  );
}
