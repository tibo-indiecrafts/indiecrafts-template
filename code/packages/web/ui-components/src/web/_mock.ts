/**
 * Provides reusable Storybook fixtures for the block renderers.
 *
 * @see docs/reference/packages/web/ui-components/src/web/_mock.md
 */
import type { PortableTextBlock } from "@portabletext/react";
import type { ImageRef, GalleryImage } from "../shared/types";

/** Reusable Storybook fixtures — resolved shapes the renderers expect. */

export const body = (text: string): PortableTextBlock[] =>
  [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "s1", text, marks: [] }],
    },
  ] as unknown as PortableTextBlock[];

export const img = (seed: string, alt = ""): ImageRef => ({
  asset: { url: `https://picsum.photos/seed/${seed}/800/600` },
  alt,
});

export const galleryImages: GalleryImage[] = [1, 2, 3, 4].map((n) => ({
  _key: `g${n}`,
  url: `https://picsum.photos/seed/gallery${n}/1200/800`,
  alt: `Sample image ${n}`,
  aspectRatio: 1.5,
  width: 1200,
  height: 800,
}));
