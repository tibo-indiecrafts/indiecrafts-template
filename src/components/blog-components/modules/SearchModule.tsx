"use client";

import { useState } from "react";
import type { SearchModule as SearchModuleProps } from "@/sanity/types";

/**
 * Lightweight client-side post search. Filters whatever post cards are
 * visible in the same page (via a CSS selector + data attribute). Not a
 * full-text engine — meaningful enough for small blogs.
 *
 * The "Blog post list" module renders `<article data-search-title="…">`
 * elements so this widget can match against them.
 */
export function SearchModule(props: SearchModuleProps) {
  const [query, setQuery] = useState("");

  const handleChange = (next: string) => {
    setQuery(next);
    const lc = next.toLowerCase().trim();
    if (typeof document === "undefined") return;
    const items = document.querySelectorAll<HTMLElement>("[data-search-title]");
    items.forEach((el) => {
      const title = el.dataset.searchTitle?.toLowerCase() ?? "";
      el.hidden = lc.length > 0 && !title.includes(lc);
    });
  };

  return (
    <section id={props.anchor} className="mx-auto max-w-2xl px-(--gutter) py-8">
      {props.title ? <h2 className="text-lg font-semibold">{props.title}</h2> : null}
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={props.placeholder ?? "Search…"}
        className="bg-background ring-border focus-visible:ring-ring mt-3 h-11 w-full rounded-md px-4 ring-1 focus-visible:ring-2 focus-visible:outline-none"
        aria-label={props.title ?? "Search"}
      />
    </section>
  );
}
