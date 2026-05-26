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

export type PostListItem = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: ImageRef;
  author?: AuthorRef;
  categories?: CategoryRef[];
};

export type Post = PostListItem & {
  body?: PortableTextBlock[];
};

export type PostSlug = { slug?: string };
