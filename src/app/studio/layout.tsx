/**
 * Root layout for the embedded Sanity Studio at `/studio`.
 *
 * The app's site-wide `src/app/layout.tsx` is a passthrough — `<html>`
 * and `<body>` live under `[locale]/layout.tsx` so we can stamp the
 * locale into `lang` + `dir`. Studio routes sit OUTSIDE `[locale]/`, so
 * without this file the catch-all renders without an HTML document and
 * Next throws "Missing <html> and <body> tags in the root layout."
 *
 * Keep the markup minimal: the Studio bundle owns its own styles, theme,
 * fonts, and chrome — no need to wrap with the site shell.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
