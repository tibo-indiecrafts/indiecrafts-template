/**
 * Clerk `appearance` derived from the design tokens — so the hosted
 * `<SignIn>` / `<SignUp>` components match the app with NO hard-coded brand
 * colors. Every value references a CSS custom property defined by
 * `@indiecrafts/packages-web-ui-tokens` (`globals.css`), which the app
 * already loads, so light/dark + per-client theming flow through automatically.
 *
 * Returned untyped (a plain literal): the `<ClerkProvider appearance={...}>`
 * call site type-checks the shape, so the brick carries no `@clerk/types` dep.
 */
const NATIVE_SHELL = "html[data-native-shell] &";

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
    elements: {
      // Clerk tints its badges ("Primary", "This device") from colorNeutral at a low
      // alpha — #dedede on white, contrast 1.3. Muted text on the badge passes AA.
      badge: { color: "var(--muted-foreground)" },
      // Hide Clerk's own "Delete account" (Security tab). Deleting goes through our "Your
      // data" page: the step-up re-check, the exit survey and the erasure engine. (A Clerk
      // deletion would still be fully erased by the webhook — this removes the second door.)
      profileSection__danger: { display: "none" },
      // Inside the Capacitor shell (`data-native-shell`, set by the app's NativeBridge) social
      // sign-in leaves for the system browser and the session lands there, not in the shell.
      // Google also refuses OAuth in an embedded web view. The shell keeps email + password.
      socialButtonsRoot: { [NATIVE_SHELL]: { display: "none" } },
      dividerRow: { [NATIVE_SHELL]: { display: "none" } },
      // Page titles ("Profile details", "Security", the sign-in card title) on the type
      // scale — the account widget's own pages use the same size (`account-modal.tsx`).
      headerTitle: {
        fontSize: "var(--text-lg)",
        lineHeight: "var(--text-lg--line-height)",
        fontWeight: "var(--font-weight-semibold)",
      },
    },
  };
}
