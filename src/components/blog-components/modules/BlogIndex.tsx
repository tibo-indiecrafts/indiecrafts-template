import type { BlogIndexModule } from "@/sanity/types";

/** Frontpage hero for /blog — title + intro. Posts go in BlogPostList. */
export function BlogIndex(props: BlogIndexModule) {
  return (
    <section
      id={props.anchor}
      className="mx-auto max-w-3xl px-(--gutter) py-16 text-center md:py-24"
    >
      {props.eyebrow ? (
        <p className="text-brand text-sm font-medium tracking-wide uppercase">
          {props.eyebrow}
        </p>
      ) : null}
      {props.title ? (
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          {props.title}
        </h1>
      ) : null}
      {props.intro ? (
        <p className="text-muted-foreground mt-4 text-balance md:text-lg">
          {props.intro}
        </p>
      ) : null}
    </section>
  );
}
