/**
 * Core JSON-LD components — the schemas auto-emitted on every page, gated by
 * `features.structuredData`. The schema *builders* live in `./jsonld-core`
 * (this file stays components-only); on-demand schema (Article, Service,
 * Product, Person, Breadcrumb) comes from `./jsonld-factories`.
 *
 * - `<PageSchemas>` emits `WebPage` (+ `FAQPage` when the page has `faq`
 *   content), plus anything in `page.seo.structuredData`.
 * - `<JsonLdScript>` renders the `<script type="application/ld+json">` tag.
 */

import type { PageConfig } from "@indiecrafts/config";
import { features, site } from "@indiecrafts/config";
import { getStaticPathname } from "@/i18n/routing";
import type { Locale } from "@indiecrafts/config";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { getFaqItems } from "@/lib/faq";
import { buildFAQPageSchema, buildGlobalSchemas } from "./jsonld-factories";
import { buildWebPageSchema, type SchemaObject } from "./jsonld-core";

// Pure image helpers — no render state, so hoisted out of PageSchemas to a
// one-time module binding (react-doctor prefer-module-scope-pure-function).
const toImageList = (v?: string | readonly string[]): string[] =>
  (Array.isArray(v) ? [...v] : v ? [v] : []).filter(Boolean);

const toAbsolute = (src: string): string =>
  src.startsWith("http") ? src : `${site.url}${src}`;

/**
 * Renders the auto-derived WebPage schema + anything in
 * `page.seo.structuredData`. Drop into each route's `page.tsx`:
 *
 *   <PageSchemas page={pages.home} locale={locale} />
 *
 * Dynamic detail routes pass `pathname` (their locale-aware slug path) so
 * the WebPage `@id`/`url` self-references instead of colliding on the
 * shared index route.
 */
export async function PageSchemas({
  page,
  locale,
  pathname,
}: Readonly<{ page: PageConfig; locale: Locale; pathname?: string }>) {
  // SEO copy — Sanity only. WebPage `name` is required, so fall back to the
  // brand name (identity, not editorial copy) when the locale has no entry.
  const [siteSeo, settings] = await Promise.all([getSiteSeo(locale), getSiteSettings()]);
  // Gate: code `features.structuredData` (master) + the Sanity editor toggle.
  if (!features.structuredData || settings.showStructuredData === false) return null;
  const pageSeo = siteSeo.pageSeo.get(page.id);
  const title = pageSeo?.title ?? settings.siteName ?? DEFAULT_SITE_NAME;
  const description = pageSeo?.description;
  const ogImage = pageSeo?.ogImage ?? siteSeo.ogImage;

  const path = pathname ?? getStaticPathname(page.key, locale);
  const url = `${site.url}${path}`;
  // The image(s) Google may show next to the result: Sanity per-page
  // `schemaImage` > config per-page `schemaImage` > site `siteSettings.schemaImage`
  // > the page's Sanity OG image. Emit a string for one, an array for many.
  const sanitySchemaImage = toImageList(pageSeo?.schemaImage);
  const pageImages = toImageList(page.seo?.schemaImage);
  const defaultImages = toImageList(settings.schemaImage);
  const schemaImages =
    sanitySchemaImage.length > 0
      ? sanitySchemaImage
      : pageImages.length > 0
        ? pageImages
        : defaultImages.length > 0
          ? defaultImages
          : ogImage
            ? [ogImage]
            : [];
  const absoluteImages = schemaImages.map(toAbsolute);
  const image =
    absoluteImages.length === 0
      ? undefined
      : absoluteImages.length === 1
        ? absoluteImages[0]
        : absoluteImages;

  const webPage = buildWebPageSchema({
    id: page.id,
    url,
    locale,
    title,
    description,
    image,
  });

  // Per-page JSON-LD: config `structuredData` + editor-authored Sanity entries.
  const extras: SchemaObject[] = [
    ...((page.seo?.structuredData ?? []) as readonly SchemaObject[]),
    ...buildGlobalSchemas(pageSeo?.structuredData ?? []),
  ];

  // Auto-emit FAQPage rich-result markup from the page's translated `faq`
  // array — zero per-page config, in sync with what the <Faq> section shows.
  const faqItems =
    features.faq && settings.showFaq !== false ? await getFaqItems(locale, page.id) : [];
  const faqSchema: SchemaObject[] = faqItems.length ? [buildFAQPageSchema(faqItems)] : [];

  return <JsonLdScript data={[webPage, ...extras, ...faqSchema]} />;
}

// ── Script renderer ──────────────────────────────────────────

/**
 * Renders a JSON-LD <script>. Pass one schema or an array — multiple get
 * wrapped in `@graph` (one tag per page is preferred — saves bytes and lets
 * Google build a single connected graph). Data must be static/trusted.
 */
export function JsonLdScript({
  data,
}: Readonly<{ data: SchemaObject | readonly SchemaObject[] }>) {
  const body = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeHtml(JSON.stringify(body)) }}
    />
  );
}

/**
 * `JSON.stringify` doesn't HTML-escape, so a `</script>` in schema text (page
 * copy, CMS-authored post fields) would close the tag early and let following
 * markup execute. Escaping `<`, `>`, `&` as unicode sequences keeps the JSON
 * valid (parsers read them back) while making script-context breakout
 * impossible. See react-doctor unsafe-json-in-html / dangerous-html-sink.
 */
function escapeHtml(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
