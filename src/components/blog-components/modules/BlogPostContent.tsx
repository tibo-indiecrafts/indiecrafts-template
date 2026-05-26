import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { BlogPostContentModule, Post } from "@/sanity/types";
import type { Locale } from "@/config";
import { portableComponents } from "./portable-text-components";

/**
 * Renders the active post's header + body. The module schema itself has
 * no fields — content comes from the post passed via render context.
 *
 * When the surrounding `postModules` array is empty, the /blog/[slug]
 * route uses this same layout as its fallback. Editors only need a
 * `module.blog-post-content` instance when they're composing extra
 * modules above or below the body.
 */
export function BlogPostContent({
  module: m,
  post,
  locale,
}: {
  module: BlogPostContentModule;
  post: Post;
  locale: Locale;
}) {
  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;
  const image = post.metadata?.image?.asset?.url;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <article id={m.anchor} className="mx-auto max-w-3xl px-(--gutter) py-16 md:py-24">
      <header className="flex flex-col gap-4">
        {post.categories?.[0]?.title ? (
          <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium">
            {post.categories[0].title}
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-balance">{description}</p>
        ) : null}
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          {post.author?.name ? <span>By {post.author.name}</span> : null}
          {post.author?.name && date ? <span>·</span> : null}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </header>

      {image ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={post.metadata?.image?.alt ?? title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {post.body ? (
        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
          <PortableText value={post.body} components={portableComponents} />
        </div>
      ) : null}
    </article>
  );
}
