import "@indiecrafts/ui-tokens/globals.css";
import type { ReactNode } from "react";

// Minimal root layout. For production, copy the web app's `[locale]/layout.tsx`
// patterns this app needs — fonts (`@/lib/fonts`), the theme provider, i18n
// (`next-intl`), and the JSON-LD/metadata chain. This scaffold keeps it bare.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
