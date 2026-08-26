"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@indiecrafts/modules-web-blog/sanity/types";
import { slugify } from "@indiecrafts/packages-shared-utils/slugify";
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/**
 * Sidebar Table of Contents — anchors to h2/h3/h4 in the post body.
 *
 * Client component so it can run a scroll-spy: the heading nearest the
 * top of the viewport gets `aria-current="location"`. Sticks to the top
 * on `md:` and above; hidden below that breakpoint (the article body
 * shows the same headings inline so mobile doesn't need duplication).
 *
 * Pattern matches sanitypress's article sidebar TOC.
 */
export function Toc({
  headings,
  title,
}: {
  headings: Heading[];
  title: string;
}) {
  const items = headings.map((h) => ({ ...h, id: slugify(h.text) }));
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0 || typeof window === "undefined") return;
    const nodes = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          )[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="hidden text-sm md:block"
    >
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
        {title}
      </p>
      <ul className="border-border space-y-1 border-l">
        {items.map((h) => (
          <li
            key={h.id}
            className={cn(
              h.style === "h3" && "pl-3",
              h.style === "h4" && "pl-6",
            )}
          >
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={cn(
                "hover:text-foreground -ml-px block border-l py-1 pl-3 transition",
                active === h.id
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground border-transparent",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
