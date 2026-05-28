import Image from "next/image";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { slugify } from "@/lib/slugify";
import { AccordionList } from "./AccordionList";
import { Callout } from "./Callout";
import { CardList } from "./CardList";
import { CustomHtml } from "./CustomHtml";
import { PersonList } from "./PersonList";
import { QuoteList } from "./QuoteList";
import { StatList } from "./StatList";
import { StepList } from "./StepList";

/**
 * Shared PortableText render map for module bodies.
 *
 *   - h2/h3/h4 headings get a deterministic `id` from the text so the
 *     Table of Contents can anchor-link to them.
 *   - The `link` mark promotes external URLs to `target="_blank"`.
 *   - Eleven module `_type`s are renderable INLINE inside a body — see
 *     `src/sanity/schema/blockContent.ts`. Each one routes to the same
 *     React component the layout-slot renderer (`ModuleRenderer`) uses,
 *     so a Callout inside a post body looks identical to a Callout
 *     placed in the blog singleton's `frontpageModules`.
 */
function headingId(value: PortableTextBlock | undefined): string {
  const children = ((value?.children ?? []) as { text?: string }[])
    .map((c) => c.text ?? "")
    .join("");
  return slugify(children);
}

// The `value` Sanity hands to each block-content renderer is the module
// shape itself — same as what `ModuleRenderer` passes via spread. The
// `unknown` cast keeps the wider union safe at the boundary; each
// component re-narrows on its own props type.
const m =
  <P,>(Cmp: (props: P) => React.ReactNode) =>
  ({ value }: { value: unknown }) =>
    Cmp(value as P);

export const portableComponents: PortableTextComponents = {
  // Base styling for every default block style + list. The post body
  // wrapper carries `prose` for forward-compat (if the typography plugin
  // is added later), but the project does NOT ship that plugin, so each
  // element is styled explicitly here. Keep these in lockstep with the
  // schema's `styles` array in `src/sanity/schema/blockContent.ts`.
  block: {
    normal: ({ children }) => (
      <p className="text-foreground my-4 leading-7">{children}</p>
    ),
    h1: ({ children, value }) => (
      <h1
        id={headingId(value)}
        className="text-foreground mt-10 mb-4 scroll-mt-24 text-4xl font-bold tracking-tight md:text-5xl"
      >
        {children}
      </h1>
    ),
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="text-foreground mt-10 mb-4 scroll-mt-24 text-3xl font-bold tracking-tight md:text-4xl"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={headingId(value)}
        className="text-foreground mt-8 mb-3 scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
      >
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4
        id={headingId(value)}
        className="text-foreground mt-6 mb-2 scroll-mt-24 text-xl font-semibold tracking-tight md:text-2xl"
      >
        {children}
      </h4>
    ),
    h5: ({ children, value }) => (
      <h5
        id={headingId(value)}
        className="text-foreground mt-6 mb-2 scroll-mt-24 text-base font-semibold tracking-tight"
      >
        {children}
      </h5>
    ),
    h6: ({ children, value }) => (
      <h6
        id={headingId(value)}
        className="text-muted-foreground mt-6 mb-2 scroll-mt-24 text-sm font-semibold tracking-wide uppercase"
      >
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-foreground/30 text-muted-foreground my-6 border-l-4 pl-4 text-lg italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="marker:text-muted-foreground my-4 ml-6 list-disc space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="marker:text-muted-foreground my-4 ml-6 list-decimal space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
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
    code: ({ children }) => (
      <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    ),
    underline: ({ children }) => <u>{children}</u>,
    "strike-through": ({ children }) => <s>{children}</s>,
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
    "module.callout": m(Callout),
    "module.card-list": m(CardList),
    "module.person-list": m(PersonList),
    "module.stat-list": m(StatList),
    "module.step-list": m(StepList),
    "module.quote-list": m(QuoteList),
    "module.accordion-list": m(AccordionList),
    "module.custom-html": m(CustomHtml),
  },
};
