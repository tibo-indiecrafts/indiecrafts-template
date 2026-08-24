import { headers } from "next/headers";
import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html> and <body> live in [locale]/layout.tsx
 * so we can set `lang` and `dir` from the resolved locale. The Clerk provider wraps
 * everything here (above the locale layout) so `auth()` + the hosted sign-in
 * components work app-wide, themed from the design tokens, nonced from the proxy's
 * per-request `x-nonce` header so its inline scripts pass the strict CSP.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <AppClerkProvider nonce={nonce}>{children}</AppClerkProvider>;
}
