import { headers } from "next/headers";
import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

/**
 * Root passthrough layout. The real <html>/<body> live in [locale]/layout.tsx so
 * `lang`/`dir` follow the resolved locale. The Clerk provider wraps everything here
 * (above the locale layout) so `auth()` + the hosted <SignIn> work app-wide, nonced
 * from the proxy's per-request `x-nonce` header so its inline scripts pass the
 * strict CSP.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <AppClerkProvider nonce={nonce}>{children}</AppClerkProvider>;
}
