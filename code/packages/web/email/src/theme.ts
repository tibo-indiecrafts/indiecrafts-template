import { tokens } from "@indiecrafts/packages-shared-ui-tokens/native";

/**
 * The email palette — the design tokens, resolved to inline hex.
 *
 * Mail clients strip `<style>`, `var()`, and `<link>`, so the OKLCH tokens in
 * `globals.css` can never reach an inbox. `pnpm tokens:build` emits a resolved
 * hex mirror (`@indiecrafts/packages-shared-ui-tokens/native`); inlining it is the ONLY way an
 * email can track the design system — the same bridge the PWA manifest and React
 * Native use. Change a token → rebuild → every email updates. One source, no
 * hand-maintained email hex.
 *
 * Light-only: emails render `color-scheme: light`, so the light token set is the
 * whole story (no dark-mode mail to reconcile).
 */
const c = tokens.light.color;

export const EMAIL_COLORS = {
  /** Outer canvas behind the card (+ quote/panel fills). */
  page: c.muted,
  panel: c.muted,
  /** The card surface. */
  card: c.background,
  /** Hairline borders. */
  border: c.border,
  /** Headings + primary body text. */
  heading: c.foreground,
  body: c.foreground,
  /** Secondary / label text. */
  muted: c["muted-foreground"],
  /** Brand accent — links + primary buttons (rebrands with the tokens). */
  accent: c.brand,
  accentForeground: c["brand-foreground"],
  /** Destructive action (e.g. the comment "delete" button). */
  destructive: c.destructive,
} as const;
