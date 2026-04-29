export const animatedTestimonialsKey = "animated-testimonials" as const;
export const animatedTestimonialsNamespace =
  "blocks.animated-testimonials" as const;

/**
 * Structural defaults — non-translatable. Each entry's `id` matches the
 * key under `blocks.animated-testimonials.items.<id>` in `en.json`, where
 * the wrapper reads quote/name/designation. `src` stays here because it's
 * an asset URL, not copy.
 */
export const animatedTestimonialsItems = [
  {
    id: "alice",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    id: "ben",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    id: "cara",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
] as const;
