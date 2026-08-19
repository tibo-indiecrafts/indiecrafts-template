import "@indiecrafts/ui-tokens/globals.css";
import type { ReactNode } from "react";
import { defaultLocale } from "@/config";

// Minimal root layout. Admin is internal/auth-gated — wire Cloudflare Access (or
// your auth) at the edge + a session guard here. Copy the chrome you need from web.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
