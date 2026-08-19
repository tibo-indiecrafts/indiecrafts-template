import type { ComponentProps } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export type LegalBodyValue = ComponentProps<typeof PortableText>["value"];

/**
 * Minimal PortableText renderer for legal-page bodies — headings, lists, marks,
 * and links only (no page-builder blocks), so legal pages stay decoupled from the blog.
 * Styled with design tokens for a readable prose measure.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-xl font-semibold md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-lg font-semibold">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-1 pl-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground mb-4 list-decimal space-y-1 pl-6">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const raw = (value as { href?: string } | undefined)?.href ?? "";
      // Whitelist the scheme — a `javascript:`/`data:` href from a compromised
      // editor must not render (React won't block it; PortableText escapes only text).
      const href =
        /^(https?:|mailto:)/i.test(raw) ||
        raw.startsWith("/") ||
        raw.startsWith("#")
          ? raw
          : "#";
      const external = /^https?:/i.test(href);
      return (
        <a
          href={href}
          className="text-brand underline underline-offset-2 hover:opacity-80"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function LegalBody({ value }: { value: LegalBodyValue }) {
  return <PortableText value={value} components={components} />;
}
