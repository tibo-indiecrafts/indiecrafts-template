import type { PortableTextBlock } from "@portabletext/react";

export type ImageRef = {
  asset?: { url?: string; metadata?: { lqip?: string; dimensions?: unknown } };
  alt?: string;
};

export type AuthorRef = {
  name?: string;
  position?: string;
  slug?: string;
  image?: { asset?: { url?: string } };
};

export type CategoryRef = {
  _id: string;
  title?: string;
};

/** Reusable `metadata` object — see `src/sanity/schema/objects/metadata.ts`. */
export type PostMetadata = {
  title?: string;
  description?: string;
  image?: ImageRef;
  noIndex?: boolean;
};

export type PostListItem = {
  _id: string;
  title?: string;
  publishedAt?: string;
  featured?: boolean;
  slug?: string;
  metadata?: PostMetadata;
  author?: AuthorRef;
  categories?: CategoryRef[];
};

export type Post = PostListItem & {
  body?: PortableTextBlock[];
};

export type PostSlug = { slug?: string };

/** Reduced shape used by the RSS route. */
export type RssPost = {
  title?: string;
  publishedAt?: string;
  slug?: string;
  metadata?: Pick<PostMetadata, "title" | "description" | "image">;
  author?: { name?: string };
  categories?: { title?: string }[];
};
