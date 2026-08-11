import type { PortableTextBlock } from "@portabletext/react";

export type ImageRef = {
  asset?: { url?: string; metadata?: { lqip?: string; dimensions?: unknown } };
  alt?: string;
};

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
   * Optional featured video (YouTube / Vimeo / direct file URL). When set,
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

// ─── Blog page-builder ────────────────────────────────────────

/** Resolved link — GROQ's LINK_FRAGMENT collapses the type union. */
export type ResolvedLink = {
  type?: "internal" | "external";
  label?: string;
  href?: string;
  newTab?: boolean;
};

export type Cta = {
  link?: ResolvedLink;
  variant?: "primary" | "secondary" | "ghost";
};

type ModuleBase = {
  _key: string;
  anchor?: string;
  hidden?: boolean;
};

export type AccordionListModule = ModuleBase & {
  _type: "module.accordion-list";
  title?: string;
  intro?: string;
  items?: { _key: string; title?: string; content?: PortableTextBlock[] }[];
};

export type CalloutModule = ModuleBase & {
  _type: "module.callout";
  variant?: "info" | "success" | "warning" | "danger";
  content?: PortableTextBlock[];
  cta?: Cta;
};

export type GalleryImage = {
  _key: string;
  url?: string | null;
  alt?: string | null;
  /** Base64 blur placeholder from Sanity's asset metadata. */
  lqip?: string | null;
  aspectRatio?: number | null;
  width?: number | null;
  height?: number | null;
};

export type GalleryModule = ModuleBase & {
  _type: "module.gallery";
  title?: string;
  intro?: string;
  ratio?: "3:2" | "4:3" | "16:9" | "1:1" | "4:5";
  images?: GalleryImage[];
};

export type CardListModule = ModuleBase & {
  _type: "module.card-list";
  title?: string;
  intro?: string;
  columns?: number;
  cards?: {
    _key: string;
    title?: string;
    content?: PortableTextBlock[];
    image?: ImageRef;
    cta?: Cta;
  }[];
};

export type PersonListModule = ModuleBase & {
  _type: "module.person-list";
  title?: string;
  intro?: string;
  people?: {
    _id: string;
    name?: string;
    role?: string;
    bio?: string;
    image?: ImageRef;
    social?: ResolvedLink[];
  }[];
};

export type ProseModule = ModuleBase & {
  _type: "module.prose";
  content?: PortableTextBlock[];
  width?: "narrow" | "wide";
};

export type StatListModule = ModuleBase & {
  _type: "module.stat-list";
  title?: string;
  intro?: string;
  stats?: { _key: string; value?: string; label?: string }[];
};

export type StepListModule = ModuleBase & {
  _type: "module.step-list";
  title?: string;
  intro?: string;
  steps?: { _key: string; title?: string; content?: PortableTextBlock[] }[];
};

export type QuoteListModule = ModuleBase & {
  _type: "module.quote-list";
  title?: string;
  quotes?: {
    _id: string;
    content?: string;
    author?: string;
    role?: string;
    image?: ImageRef;
  }[];
};

export type CustomHtmlModule = ModuleBase & {
  _type: "module.custom-html";
  html?: string;
};

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

export type AnyModule =
  | AccordionListModule
  | CalloutModule
  | CardListModule
  | GalleryModule
  | PersonListModule
  | ProseModule
  | StatListModule
  | StepListModule
  | QuoteListModule
  | CustomHtmlModule
  | BlogIndexModule
  | BlogPostContentModule
  | BlogPostListModule;

export type BlogSingleton = {
  postModules?: AnyModule[];
  seo?: SeoMeta;
};
