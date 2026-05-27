import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { slugify } from "@/lib/slugify";
import { AccordionList } from "./AccordionList";
import { Callout } from "./Callout";
import { CardList } from "./CardList";
import { CustomHtml } from "./CustomHtml";
import { FormModule } from "./FormModule";
import { HeroSplit } from "./HeroSplit";
import { LogoList } from "./LogoList";
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
 *     so a Callout inside a post body looks identical to a Callout in
 *     `post.modules`.
 */
function headingId(value: PortableTextBlock | undefined): string {
  const children = ((value?.children ?? []) as { text?: string }[])
    .map((c) => c.text ?? "")
    .join("");
  return slugify(children);
}

// The `value` Sanity hands to each block-content renderer is the module
// shape itself — same as what `ModuleRenderer` passes via spread. Using
// `any` here because `@portabletext/react`'s types parameterize on a
// concrete value shape and our union is too wide to express literally.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const m =
  (Cmp: (props: any) => React.ReactNode) =>
  ({ value }: { value: unknown }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cmp(value as any);

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
  types: {
    "module.callout": m(Callout),
    "module.card-list": m(CardList),
    "module.hero-split": m(HeroSplit),
    "module.logo-list": m(LogoList),
    "module.person-list": m(PersonList),
    "module.stat-list": m(StatList),
    "module.step-list": m(StepList),
    "module.quote-list": m(QuoteList),
    "module.accordion-list": m(AccordionList),
    "module.form": m(FormModule),
    "module.custom-html": m(CustomHtml),
  },
};
