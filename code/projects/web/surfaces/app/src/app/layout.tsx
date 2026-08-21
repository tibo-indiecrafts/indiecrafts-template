import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html> and <body> live in [locale]/layout.tsx so
 * `lang`/`dir` follow the resolved locale (next-intl parity with the website). The
 * Clerk provider wraps everything (opt-in — inert with no publishable key).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppClerkProvider>{children}</AppClerkProvider>;
}
