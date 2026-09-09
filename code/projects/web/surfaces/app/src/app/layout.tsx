/**
 * Root passthrough layout. The real <html>/<body> — and the Clerk provider — live in
 * [locale]/layout.tsx so the provider reads the active locale (from params) and
 * localizes Clerk's UI. This root just forwards children.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
