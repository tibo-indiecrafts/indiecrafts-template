import type { PortableTextBlock } from "@portabletext/react";
import type {
  ImageRef,
  ModuleBase,
  BlockModule,
} from "@indiecrafts/ui-components/types";

// The generic block types + shared presentational types now live in
// `@indiecrafts/ui-components`. Re-export them so existing importers of
// `@indiecrafts/blog/sanity/types` keep resolving them unchanged.
export type {
  ImageRef,
  ResolvedLink,
  Cta,
  GalleryImage,
  BlockModule,
  AccordionListModule,
  CalloutModule,
  CardListModule,
  GalleryModule,
  PersonListModule,
  ProseModule,
  StatListModule,
  StepListModule,
  QuoteListModule,
  CustomHtmlModule,
} from "@indiecrafts/ui-components/types";

/**
 * Lightweight author reference embedded inside post fragments.
 *
 * Note: `bio` is typed as `string` here even though the Sanity schema
 * stores it as an array of PortableText blocks. The GROQ projections
 * (`POST_LIST_FRAGMENT`, `AUTHOR_FRAGMENT`) flatten it via `pt::text(bio)`
 * so consumers can render it as a plain paragraph. If you ever need
 * rich-text bios on the public site, switch the projections back to
 * `bio` and update this type to `PortableTextBlock[]`.
 */
/** Slug-less SEO + visibility override — see `schema/objects/seo-meta.ts`. */
export type SeoMeta = {
  title?: string;
  description?: string;
  image?: ImageRef;
  /** robots:noindex + drop from sitemap. Page still renders. */
  noIndex?: boolean;
  /** Remove from on-site listings/explore. Page still renders by URL. */
  hideFromDiscovery?: boolean;
  /** Route returns 404 everywhere; document stays editable in the Studio. */
  unpublished?: boolean;
};

export type AuthorRef = {
  _id?: string;
  name?: string;
  position?: string;
  slug?: string;
  bio?: string;
  image?: { asset?: { url?: string } };
};

/** Full author document — used by /author and /author/[slug]. */
export type Author = {
  _id: string;
  name?: string;
  position?: string;
  slug?: string;
  bio?: string;
  image?: { asset?: { url?: string } };
  /** Computed in GROQ — count of posts attributed to this author. */
  postCount?: number;
  seo?: SeoMeta;
};

export type CategoryRef = {
  _id: string;
  title?: string;
  slug?: string;
};

/** Full category document — used by /blog/category/[slug]. */
export type Category = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  /** Computed in GROQ — count of posts in this category, locale-filtered. */
  postCount?: number;
  seo?: SeoMeta;
};

/** Lightweight tag reference — embedded inside post fragments. */
export type TagRef = {
  _id: string;
  title?: string;
  slug?: string;
};

/** Full tag document — used by /blog/tag and /blog/tag/[slug]. */
export type Tag = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  /** Computed in GROQ — count of posts with this tag, locale-filtered. */
  postCount?: number;
  seo?: SeoMeta;
};

/** Reusable `metadata` object — see `src/sanity/schema/objects/metadata.ts`. */
export type PostMetadata = {
  title?: string;
  description?: string;
  image?: ImageRef;
  /**
   * Optional featured video (YouTube / Vimeo / Dailymotion / direct file URL). When set,
   * the post hero plays this instead of the cover image; `image` stays the
   * poster + the OG/social + card thumbnail. Parsed by `parseVideoEmbed`.
   */
  videoUrl?: string;
  noIndex?: boolean;
  hideFromDiscovery?: boolean;
  unpublished?: boolean;
  /** One-line entry for the `/llms.txt` index; else `description`. */
  llmsSummary?: string;
  /** Markdown body for the `/md` export; else the PortableText `body`. */
  llmsFull?: string;
};

export type PostListItem = {
  _id: string;
  title?: string;
  /** Display teaser for cards + the post page; falls back to `metadata.description`. */
  excerpt?: string;
  publishedAt?: string;
  featured?: boolean;
  slug?: string;
  metadata?: PostMetadata;
  author?: AuthorRef;
  categories?: CategoryRef[];
  tags?: TagRef[];
};

export type Heading = {
  style: "h2" | "h3" | "h4";
  text: string;
};

export type Post = PostListItem & {
  body?: PortableTextBlock[];
  /** Approx minutes (200 wpm) — derived in GROQ. */
  readTime?: number;
  /** Flat heading list — derived in GROQ, drives the Table of Contents. */
  headings?: Heading[];
};

export type PostSlug = { slug?: string; language?: string };

/** Reduced shape used by the RSS route. */
export type RssPost = {
  title?: string;
  publishedAt?: string;
  slug?: string;
  metadata?: Pick<PostMetadata, "title" | "description" | "image">;
  author?: { name?: string };
  categories?: { title?: string }[];
};

// ─── Blog-specific page-builder modules ──────────────────────
// The generic blocks (callout, card-list, …) live in `@indiecrafts/ui-components`
// and are re-exported above. These three need the blog's own content/context.

export type BlogIndexModule = ModuleBase & {
  _type: "module.blog-index";
  eyebrow?: string;
  title?: string;
  intro?: string;
};

export type BlogPostContentModule = ModuleBase & {
  _type: "module.blog-post-content";
};

export type BlogPostListModule = ModuleBase & {
  _type: "module.blog-post-list";
  title?: string;
  intro?: string;
  limit?: number;
  categories?: CategoryRef[];
  featuredOnly?: boolean;
};

/** Every module a blog page can hold — the shared blocks plus the blog's own. */
export type AnyModule =
  | BlockModule
  | BlogIndexModule
  | BlogPostContentModule
  | BlogPostListModule;

export type BlogSingleton = {
  postModules?: AnyModule[];
  seo?: SeoMeta;
};
