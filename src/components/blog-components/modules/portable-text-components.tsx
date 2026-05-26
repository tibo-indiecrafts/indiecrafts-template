import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { slugify } from "@/lib/slugify";

/**
 * Shared PortableText render map for module bodies.
 *
 *   - `h2`/`h3`/`h4` headings get a deterministic `id` from the text
 *     so the Table of Contents can anchor-link to them.
 *   - The `link` mark promotes external URLs to `target="_blank"`.
 */
function headingId(value: PortableTextBlock | undefined): string {
  const children = ((value?.children ?? []) as { text?: string }[])
    .map((c) => c.text ?? "")
    .join("");
  return slugify(children);
}

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
};
