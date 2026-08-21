import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html> and <body> live in [locale]/layout.tsx
 * so we can set `lang` and `dir` from the resolved locale. The Clerk provider wraps
 * everything here (above the locale layout) so `auth()` + the hosted sign-in
 * components work app-wide, themed from the design tokens.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppClerkProvider>{children}</AppClerkProvider>;
}
