/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered headline + body + email-newsletter form
 * paired with the `MeetIllustration` (two-up video grid + draggable AI
 * assistant chat panel) framed by a softly tinted angled-stripe
 * backdrop. All visible strings translate via `./en.json`; visual
 * assets come from `ui-illustrations`.
 */
export const hero12Key = "hero-12" as const;
export const hero12Namespace = "blocks.hero-12" as const;
