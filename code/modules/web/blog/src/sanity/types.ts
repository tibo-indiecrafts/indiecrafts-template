/**
 * Declares the blog's shared content types — documents, fragments, and modules.
 *
 * @see docs/reference/modules/web/blog/src/sanity/types.md
 */
import type { PortableTextBlock } from "@portabletext/react";
import type {
  ImageRef,
  ModuleBase,
  BlockModule,
} from "@indiecrafts/packages-web-ui-components/shared/types";

// The generic block types + shared presentational types now live in
// `@indiecrafts/packages-web-ui-components`. Re-export them so existing importers of
// `@indiecrafts/modules-web-blog/sanity/types` keep resolving them unchanged.
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
} from "@indiecrafts/packages-web-ui-components/shared/types";

/**
 * Lightweight author reference embedded inside post fragments.
 *
 * Note: `bio` is typed as `string` here even though the Sanity schema
 * stores it as an array of PortableText blocks. The GROQ projections
 * (`POST_CARD_PROJECTION`, `AUTHOR_FRAGMENT`) flatten it via `pt::text(bio)`
 * so consumers can render it as a plain paragraph. If you ever need
 * rich-text bios on the public site, switch the projections back to
 * `bio` and update this type to `PortableTextBlock[]`.
 */
/** Slug-less SEO + visibility override — schema in `@indiecrafts/packages-web-schema` (`seoMeta`). */
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

/** One external profile link on an author (platform + URL). */
export type AuthorSocial = {
  platform?: "x" | "linkedin" | "github" | "instagram" | "mastodon" | "website";
  url?: string;
};

/** Full author document — used by /author and /author/[slug]. */
export type Author = {
  _id: string;
  name?: string;
  position?: string;
  slug?: string;
  bio?: string;
  image?: { asset?: { url?: string } };
  social?: AuthorSocial[];
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

/** Full series document — used by /blog/series/[slug]. */
export type Series = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  postCount?: number;
  seo?: SeoMeta;
};

/** A post's series membership + its ordered sibling parts (from `postBySlugQuery`). */
export type SeriesRef = {
  title?: string;
  slug?: string;
  parts?: { _id: string; title?: string; slug?: string }[];
};

/** Reusable `metadata` object — see `src/sanity/schema/objects/metadata.ts`. */
export type PostMetadata = {
  title?: string;
  description?: string;
  image?: ImageRef;
  /**
   * Optional featured video — resolved in GROQ as `coalesce(videoFile.asset->url,
   * videoUrl)`, so it's either an uploaded file's CDN url or an embed link
   * (YouTube / Vimeo / Dailymotion). When set, the hero plays it instead of the
   * cover image; `image` stays the poster + OG/social + card thumbnail. Parsed
   * by `parseVideoEmbed` (a Sanity file url ends `.mp4`/`.webm` → `kind:"file"`).
   */
  video?: string;
  /** Auto-play the video muted + looping (ambient backdrop). Hero only. */
  videoAutoplay?: boolean;
  /** Show the player controls (default true). */
  videoControls?: boolean;
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
  /** One or more authors, in display order — the first is the lead. */
  authors?: AuthorRef[];
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
  /** Sanity `_updatedAt` — feeds Article `dateModified` (SEO freshness). */
  updatedAt?: string;
  /** Series membership + ordered parts — drives the "Part N of M" nav. */
  series?: SeriesRef;
};

export type PostSlug = { slug?: string; language?: string };

/** Reduced shape used by the RSS route. */
export type RssPost = {
  title?: string;
  publishedAt?: string;
  slug?: string;
  metadata?: Pick<PostMetadata, "title" | "description" | "image">;
  authors?: { name?: string }[];
  categories?: { title?: string }[];
};

// ─── Blog-specific page-builder modules ──────────────────────
// The generic blocks (callout, card-list, …) live in `@indiecrafts/packages-web-ui-components`
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

/** The frontpage "Big Hero" — the latest post, or one the editor pins. */
export type BlogHeroModule = ModuleBase & {
  _type: "module.blog-hero";
  source?: "latest" | "pinned";
  pinned?: { _ref: string };
  showMeta?: boolean;
};

/** The frontpage "Featured" block — a big lead card + a grid of picks. */
export type BlogFeaturedModule = ModuleBase & {
  _type: "module.blog-featured";
  title?: string;
  source?: "flag" | "pinned";
  pinned?: { _ref: string }[];
  limit?: number;
  leadCard?: boolean;
};

/** The frontpage "Explore" block — wraps the existing categories/tags/authors sections. */
export type BlogExploreModule = ModuleBase & {
  _type: "module.blog-explore";
  variant: "categories" | "tags" | "authors";
  heading?: string;
  subheading?: string;
  viewAll?: string;
};

/** The frontpage "Category Spotlight" block — a curated selection from one category. */
export type BlogCategorySpotlightModule = ModuleBase & {
  _type: "module.blog-category-spotlight";
  category: { _ref: string };
  heading?: string;
  subheading?: string;
  count?: number;
  pinned?: { _ref: string }[];
};

/** The frontpage "Collection" block — a pinned, ordered selection shown in a carousel. */
export type BlogCollectionModule = ModuleBase & {
  _type: "module.blog-collection";
  title?: string;
  intro?: string;
  posts?: { _ref: string }[];
};

/**
 * The frontpage "Trending" block — the most popular posts (`getPopularPostIds`,
 * `lib/popularity.ts`), falling back to most-recent while Project 1 has no
 * read-count source. `pinned` posts always show first.
 */
export type BlogTrendingModule = ModuleBase & {
  _type: "module.blog-trending";
  title?: string;
  count?: number;
  pinned?: { _ref: string }[];
};

/**
 * The frontpage "Topic Cards" block — one to three categories/tags shown as
 * large cards. Unlike every other block, it points at taxonomy, not posts:
 * `cards[].target` (a `category` or `tag` reference) and `cards[].image` are
 * resolved by the blog's `MODULES_FRAGMENT` (see `sanity/queries.ts`).
 */
export type BlogTopicCardsModule = ModuleBase & {
  _type: "module.blog-topic-cards";
  cards?: {
    _key: string;
    target?: { _type: "category" | "tag"; title?: string; slug?: string };
    image?: string;
    imageAlt?: string;
    title?: string;
    blurb?: string;
  }[];
};

/** Every module a blog page can hold — the shared blocks plus the blog's own. */
export type AnyModule =
  | BlockModule
  | BlogCategorySpotlightModule
  | BlogCollectionModule
  | BlogExploreModule
  | BlogFeaturedModule
  | BlogHeroModule
  | BlogIndexModule
  | BlogPostContentModule
  | BlogPostListModule
  | BlogTopicCardsModule
  | BlogTrendingModule;

export type BlogSingleton = {
  postModules?: AnyModule[];
  frontpageModules?: AnyModule[];
  comments?: CommentsCopy;
  seo?: SeoMeta;
};

/**
 * Raw `blog.display` as stored in Sanity — every toggle optional. An unset
 * toggle means "shown" (the schema defaults each to `true`, but older docs
 * may lack the field entirely). Resolve via `getBlogSettings`.
 */
export type BlogDisplayRaw = {
  taxonomy?: {
    categories?: boolean;
    tags?: boolean;
    authors?: boolean;
    categoryNav?: boolean;
  };
  post?: {
    date?: boolean;
    readingTime?: boolean;
    tableOfContents?: boolean;
    relatedPosts?: boolean;
    readingProgress?: boolean;
  };
  frontpage?: { featuredHero?: boolean };
  cards?: { excerpt?: boolean };
};

/**
 * Resolved display settings — every toggle a concrete boolean. Taxonomy folds
 * in `features.blogTaxonomy.*` (code capability AND editor toggle); the rest
 * are editor-only. Produced by `getBlogSettings` / `resolveBlogDisplay`.
 */
export type BlogDisplay = {
  taxonomy: {
    categories: boolean;
    tags: boolean;
    authors: boolean;
    categoryNav: boolean;
  };
  post: {
    date: boolean;
    readingTime: boolean;
    tableOfContents: boolean;
    relatedPosts: boolean;
    readingProgress: boolean;
  };
  frontpage: { featuredHero: boolean };
  cards: { excerpt: boolean };
};

/** A public blog comment, as shown on a post (email is never fetched). */
export type Comment = {
  _id: string;
  authorName?: string;
  body?: string;
  /** The parent comment's id when this is a reply (1-level threading). */
  parentId?: string;
  createdAt?: string;
};

/** Per-locale value (`{ en: "…", fr: "…" }`) from a `localeString` field. */
export type LocaleString = Record<string, string | undefined>;

/** Editor-managed, per-locale copy for the comment section (`blog.comments`). */
export type CommentsCopy = {
  heading?: LocaleString;
  nameLabel?: LocaleString;
  emailLabel?: LocaleString;
  bodyLabel?: LocaleString;
  consentLabel?: LocaleString;
  submitLabel?: LocaleString;
  replyLabel?: LocaleString;
  cancelLabel?: LocaleString;
  successMessage?: LocaleString;
  emptyMessage?: LocaleString;
  errorMessage?: LocaleString;
};
