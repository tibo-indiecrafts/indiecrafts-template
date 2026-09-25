/**
 * Build the shared PortableText render map for module bodies.
 *
 * @see docs/reference/packages/web/ui-components/src/web/portable-text-components.md
 */
import Image from "next/image";
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import { slugify } from "@indiecrafts/packages-shared-utils/slugify";
import { BLOCK_RENDERERS } from "./registry";
import { CodeBlock } from "./content/CodeBlock";

/**
 * Shared PortableText render map for module bodies.
 *
 * Block / list / mark base styling comes from `@tailwindcss/typography`
 * (the body wrapper carries `prose prose-neutral dark:prose-invert`) —
 * we override only what the plugin can't infer from markup alone:
 *
 *   - h2/h3/h4 get a deterministic `id` (slugified from text content) so
 *     the Table of Contents can anchor-link. `scroll-mt-24` clears the
 *     fixed nav when scrolled to via hash.
 *   - The `link` mark promotes `http(s)://` URLs to `target="_blank"`.
 *   - Twelve inline-module `_type`s map to the same React components
 *     `ModuleRenderer` uses for `postModules`, so a Callout inline in a
 *     body and a Callout in the layout slot render identically.
 */
function headingId(value: PortableTextBlock | undefined): string {
  const children = ((value?.children ?? []) as { text?: string }[])
    .map((c) => c.text ?? "")
    .join("");
  return slugify(children);
}

// The `value` Sanity hands to each block-content renderer is the module
// shape itself — same as what `ModuleRenderer` passes. The `unknown`
// cast keeps the wider union safe at the boundary; each component
// re-narrows on its own props type. `inline: true` is injected so the
// section-chrome modules (stat/step/accordion/person) render bare inside
// the article's `.prose` column instead of double-padding; modules that
// don't read `inline` ignore the extra field.
const m =
  <P,>(Cmp: (props: P) => React.ReactNode) =>
  ({ value }: { value: unknown }) =>
    // Pass `components` in so a module rendered inline can recurse into nested
    // modules without importing this map (which would form an import cycle).
    Cmp({
      ...(value as Record<string, unknown>),
      inline: true,
      components: portableComponents,
    } as P);

/**
 * Inline-embeddable module types — must stay in lockstep with
 * `INLINE_MODULES` in `@indiecrafts/packages-web-page-builder` (`sanity/schema/blockContent.ts`). The 12 types
 * listed here are the subset of the full module catalogue that editors
 * can drop directly into a post body (the others are layout-slot only).
 */
const INLINE_TYPES = [
  "module.callout",
  "module.card-list",
  "module.gallery",
  "module.person-list",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.accordion-list",
  "module.custom-html",
  "module.newsletter",
  "module.waitlist",
  "module.lead-magnet",
  "module.contact",
] as const;

const inlineTypes = Object.fromEntries(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  INLINE_TYPES.map((t) => [t, m(BLOCK_RENDERERS[t] as any)]),
);

export const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={headingId(value)} className="scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={headingId(value)} className="scroll-mt-24">
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4 id={headingId(value)} className="scroll-mt-24">
        {children}
      </h4>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
  // Inline modules — editors insert these in the body picker; the
  // schema (`blockContent.ts`) controls which `_type`s are insertable.
  // The bare `image` type covers inline images dropped via the "+" menu.
  types: {
    image: ({ value }) => {
      const url = (value as { asset?: { url?: string } })?.asset?.url;
      const alt = (value as { alt?: string })?.alt ?? "";
      if (!url) return null;
      return (
        <Image
          src={url}
          alt={alt}
          width={1200}
          height={675}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="my-8 aspect-[16/9] w-full rounded-xl object-cover"
        />
      );
    },
    // Syntax-highlighted code block (Shiki, server-rendered). Schema
    // `codeBlock` lives in `@indiecrafts/packages-web-page-builder` (`blockContent.ts`).
    codeBlock: CodeBlock,
    ...inlineTypes,
  },
};
