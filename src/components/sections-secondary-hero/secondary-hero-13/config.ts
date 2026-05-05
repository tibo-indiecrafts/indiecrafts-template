/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — iOS app pitch. Left tagged headline + body +
 * Apple download CTA + checklist; right `PhoneScreenshot` mock with a
 * desktop preview backdrop. All visible strings translate via
 * `./en.json`; phone screenshot URL lives here so projects override it.
 */
export const secondaryHero13Key = "secondary-hero-13" as const;
export const secondaryHero13Namespace = "blocks.secondary-hero-13" as const;

/** Download CTA target. */
export const secondaryHero13DownloadHref = "#" as const;

/** Phone screenshot URL. */
export const secondaryHero13PhoneImage =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/mobile_hwua2g.png" as const;
