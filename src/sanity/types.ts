import type { PortableTextBlock } from "@portabletext/react";

export type ImageRef = {
  asset?: { url?: string; metadata?: { lqip?: string; dimensions?: unknown } };
  alt?: string;
};

export type AuthorRef = {
  name?: string;
  position?: string;
  slug?: string;
  image?: { asset?: { url?: string } };
};

export type CategoryRef = {
  _id: string;
  title?: string;
};

/** Reusable `metadata` object — see `src/sanity/schema/objects/metadata.ts`. */
export type PostMetadata = {
  title?: string;
  description?: string;
  image?: ImageRef;
  noIndex?: boolean;
};

export type PostListItem = {
  _id: string;
  title?: string;
  publishedAt?: string;
  featured?: boolean;
  slug?: string;
  metadata?: PostMetadata;
  author?: AuthorRef;
  categories?: CategoryRef[];
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

export type PostSlug = { slug?: string };

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

export type CardListModule = ModuleBase & {
  _type: "module.card-list";
  title?: string;
  intro?: string;
  columns?: number;
  cards?: {
    _key: string;
    icon?: string;
    title?: string;
    content?: PortableTextBlock[];
    image?: ImageRef;
    cta?: Cta;
  }[];
};

export type HeroSplitModule = ModuleBase & {
  _type: "module.hero-split";
  eyebrow?: string;
  title?: string;
  content?: PortableTextBlock[];
  ctas?: Cta[];
  image?: ImageRef;
  imagePosition?: "left" | "right";
};

export type LogoListModule = ModuleBase & {
  _type: "module.logo-list";
  title?: string;
  intro?: string;
  logos?: { _id: string; name?: string; url?: string; image?: ImageRef }[];
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

export type BreadcrumbsModule = ModuleBase & {
  _type: "module.breadcrumbs";
  items?: { _key: string; label?: string; href?: string }[];
};

export type CustomHtmlModule = ModuleBase & {
  _type: "module.custom-html";
  html?: string;
};

export type FormField = {
  _key: string;
  name?: string;
  label?: string;
  type?: "text" | "email" | "textarea" | "tel" | "url";
  required?: boolean;
};

export type FormModule = ModuleBase & {
  _type: "module.form";
  title?: string;
  intro?: string;
  form?: {
    _id: string;
    name?: string;
    title?: string;
    intro?: string;
    submitLabel?: string;
    fields?: FormField[];
  };
};

export type SearchModule = ModuleBase & {
  _type: "module.search";
  title?: string;
  placeholder?: string;
  scope?: "post";
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
  | HeroSplitModule
  | LogoListModule
  | PersonListModule
  | ProseModule
  | StatListModule
  | StepListModule
  | QuoteListModule
  | BreadcrumbsModule
  | CustomHtmlModule
  | FormModule
  | SearchModule
  | BlogIndexModule
  | BlogPostContentModule
  | BlogPostListModule;

export type BlogSingleton = {
  frontpageModules?: AnyModule[];
  postModules?: AnyModule[];
};
