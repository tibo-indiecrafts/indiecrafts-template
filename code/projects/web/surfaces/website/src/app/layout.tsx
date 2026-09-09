/**
 * Root passthrough layout. The real <html> and <body> — and the Clerk provider —
 * live in [locale]/layout.tsx, so the provider can read the active locale (from the
 * route params) and localize Clerk's UI. This root just forwards children.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
