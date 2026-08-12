import { ChevronDown } from "lucide-react";
import type { Heading } from "@indiecrafts/blog/sanity/types";
import { slugify } from "@indiecrafts/utils";
import { cn } from "@indiecrafts/utils";

/**
 * Collapsed "On this page" jump list for the article — shown only below
 * `lg`, where the sticky sidebar `Toc` is hidden. A native `<details>` so
 * it needs no JS (no scroll-spy on mobile; it's a tap-to-jump index).
 * Anchors match the `slugify`-derived heading ids in `portable-text-components`.
 */
export function MobileToc({ headings, title }: { headings: Heading[]; title: string }) {
  if (!headings.length) return null;

  return (
    <details className="group border-border/70 bg-card mb-8 rounded-xl border lg:hidden">
      <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden="true"
          className="text-muted-foreground size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <ul className="border-border/70 space-y-1 border-t px-4 py-3 text-sm">
        {headings.map((h) => {
          const id = slugify(h.text);
          return (
            <li
              key={id}
              className={cn(h.style === "h3" && "pl-3", h.style === "h4" && "pl-6")}
            >
              <a
                href={`#${id}`}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring block rounded py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
