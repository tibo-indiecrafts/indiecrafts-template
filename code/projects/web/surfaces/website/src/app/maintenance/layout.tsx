import "@indiecrafts/ui-tokens/globals.css";
import { fontClassName, fontStyle } from "@/lib/fonts";
import { maintenanceLocale } from "./locale";

/**
 * Standalone root layout for `/maintenance`. Like `/studio`, it sits outside
 * `[locale]/` and owns its own `<html>`/`<body>`. Shares the site font
 * system (`@/lib/fonts`). No ThemeProvider — dark mode falls to the
 * `prefers-color-scheme` tokens in globals.css, which is all a single static
 * page needs.
 */
export default async function MaintenanceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await maintenanceLocale();
  return (
    <html
      lang={locale}
      className={`${fontClassName} antialiased`}
      style={{ colorScheme: "light dark", ...fontStyle }}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
