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
      colorPrimary: "var(--primary)",
      colorBackground: "var(--background)",
      colorText: "var(--foreground)",
      colorTextSecondary: "var(--muted-foreground)",
      colorDanger: "var(--destructive)",
      borderRadius: "var(--radius)",
    },
  };
}
