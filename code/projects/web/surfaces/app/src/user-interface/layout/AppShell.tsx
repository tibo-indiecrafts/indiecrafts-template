import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@indiecrafts/packages-web-ui/web/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

/** The app shell every `(app)` page renders inside: sidebar + sticky header.
 *  `<Toaster>` lives at `[locale]/layout.tsx` (covers sign-in too), not here. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset id="main" tabIndex={-1}>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
