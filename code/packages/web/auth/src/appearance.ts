/**
 * Clerk `appearance` derived from the design tokens — so the hosted
 * `<SignIn>` / `<SignUp>` components match the app with NO hard-coded brand
 * colors. Every value references a CSS custom property defined by
 * `@indiecrafts/packages-shared-ui-tokens` (`globals.css`), which the app
 * already loads, so light/dark + per-client theming flow through automatically.
 *
 * Returned untyped (a plain literal): the `<ClerkProvider appearance={...}>`
 * call site type-checks the shape, so the brick carries no `@clerk/types` dep.
 */
export function authAppearance() {
  return {
    variables: {
      // Stable across clerk-js versions.
      colorPrimary: "var(--primary)",
      colorBackground: "var(--background)",
      colorDanger: "var(--destructive)",
      borderRadius: "var(--radius)",
      // Core 3 role names (the installed clerk-js renamed the text/surface roles —
      // `colorText`→`colorForeground`, `colorTextSecondary`→`colorMutedForeground`).
      // `colorNeutral` seeds Clerk's derived gray scale so muted text/borders stay
      // legible on a dark card. Without these, Clerk falls back to its light-theme
      // defaults → dark-on-dark text.
      colorForeground: "var(--foreground)",
      colorMutedForeground: "var(--muted-foreground)",
      colorMuted: "var(--muted)",
      colorPrimaryForeground: "var(--primary-foreground)",
      colorInput: "var(--background)",
      colorInputForeground: "var(--foreground)",
      colorNeutral: "var(--foreground)",
      colorBorder: "var(--border)",
      colorRing: "var(--ring)",
      // Core 2 aliases — kept so an older clerk-js still themes correctly (ignored on Core 3).
      colorText: "var(--foreground)",
      colorTextSecondary: "var(--muted-foreground)",
    },
  };
}
