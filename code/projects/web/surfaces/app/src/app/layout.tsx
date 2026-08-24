import { headers } from "next/headers";
import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html> and <body> live in [locale]/layout.tsx so
 * `lang`/`dir` follow the resolved locale (next-intl parity with the website). The
 * Clerk provider wraps everything (opt-in — inert with no publishable key), nonced
 * from the proxy's per-request `x-nonce` header so its inline scripts pass the
 * strict CSP.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <AppClerkProvider nonce={nonce}>{children}</AppClerkProvider>;
}
