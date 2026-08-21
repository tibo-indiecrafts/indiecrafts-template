import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html>/<body> live in [locale]/layout.tsx so
 * `lang`/`dir` follow the resolved locale. The Clerk provider wraps everything here
 * (above the locale layout) so `auth()` + the hosted <SignIn> work app-wide.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppClerkProvider>{children}</AppClerkProvider>;
}
