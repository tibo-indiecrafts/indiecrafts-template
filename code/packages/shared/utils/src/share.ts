/**
 * Social share targets — platform-agnostic share-intent URLs for a page. Pure
 * strings, no DOM, so ANY surface reuses them: the web renders a button row
 * (`ui-components` `ShareButtons`), a native surface can feed the same targets
 * to the OS share sheet. `key` doubles as the `BrandName` for the icon.
 */
export type ShareNetwork = "x" | "linkedin" | "facebook";

export type ShareTarget = { key: ShareNetwork; href: string };

/** Build the X / LinkedIn / Facebook share-intent URLs for a page `url` + `title`. */
export function shareTargets(url: string, title: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { key: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    {
      key: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      key: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];
}
