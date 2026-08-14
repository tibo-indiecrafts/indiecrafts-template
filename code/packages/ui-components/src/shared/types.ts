import type { PortableTextBlock } from "@portabletext/react";

/**
 * Shared presentational types for the page-builder **blocks** — the generic,
 * feature-independent modules rendered by `@indiecrafts/ui-components/web/*`.
 * Consumed by the renderers here AND by `@indiecrafts/blog` (which composes
 * `BlockModule` with its own blog-specific modules into `AnyModule`).
 *
 * These carry **resolved** data (GROQ has already dereferenced images, links,
 * people, quotes), so the renderers stay pure — no Sanity client, no fetching.
 */

export type ImageRef = {
  asset?: { url?: string; metadata?: { lqip?: string; dimensions?: unknown } };
  alt?: string;
};

/** Resolved link — GROQ's LINK_FRAGMENT collapses the internal/external union. */
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

export type ModuleBase = {
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

export type NewsletterModule = ModuleBase & {
  _type: "module.newsletter";
  heading?: string;
  body?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  consentText?: string;
  successMessage?: string;
  alreadyMessage?: string;
  errorMessage?: string;
  variant?: "card" | "inline" | "banner";
};

export type WaitlistModule = ModuleBase & {
  _type: "module.waitlist";
  heading?: string;
  body?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  buttonLabel?: string;
  consentText?: string;
  successMessage?: string;
  alreadyMessage?: string;
  errorMessage?: string;
  variant?: "card" | "inline" | "banner";
};

// ── Marketing / page blocks ──────────────────────────────────

export type HeroModule = ModuleBase & {
  _type: "module.hero";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta?: Cta;
};

/** The fixed icon set the feature grid offers — Lucide glyphs the UI ships. */
export type FeatureIcon = "zap" | "settings" | "sparkles" | "shield" | "globe" | "users";

export type FeatureGridModule = ModuleBase & {
  _type: "module.feature-grid";
  title?: string;
  intro?: string;
  items?: { _key: string; icon?: FeatureIcon; title?: string; body?: string }[];
};

export type PricingTier = {
  _key: string;
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  highlighted?: boolean;
  badge?: string;
  features?: string[];
  cta?: Cta;
};

export type PricingModule = ModuleBase & {
  _type: "module.pricing";
  title?: string;
  intro?: string;
  tiers?: PricingTier[];
};

/** The generic block modules — feature-independent, rendered by `BLOCK_RENDERERS`. */
export type BlockModule =
  | HeroModule
  | FeatureGridModule
  | PricingModule
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
  | NewsletterModule
  | WaitlistModule;
