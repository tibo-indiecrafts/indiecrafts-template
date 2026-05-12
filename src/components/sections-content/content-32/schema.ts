export type ContentBlock = {
  type: "content-32";
  id: string;
  /** Decorative absolute background — high-res unsplash-style URL works best. */
  backdropSrc: string;
  /** Foreground product screenshot. */
  screenshotSrc: string;
};
