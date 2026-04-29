/**
 * Root passthrough layout. The real <html> and <body> live in [locale]/layout.tsx
 * so we can set `lang` and `dir` from the resolved locale.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
